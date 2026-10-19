import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { findTelegramUser } from './find-user.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Telegram Login Widget fields we accept
interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

async function hmacSha256(keyData: ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
}

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyTelegramHash(data: TelegramAuthData, botToken: string): Promise<boolean> {
  const { hash, ...fields } = data;
  const checkString = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(botToken));
  const computed = toHex(await hmacSha256(secretKey, checkString));
  return computed === hash;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!botToken || !supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Telegram sign-in not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data: TelegramAuthData = await req.json();
    if (!data?.id || !data.hash || !data.auth_date || !data.first_name) {
      return new Response(JSON.stringify({ error: 'Invalid Telegram login data' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Reject logins older than 24 hours
    if (Math.abs(Date.now() / 1000 - data.auth_date) > 86400) {
      return new Response(JSON.stringify({ error: 'Login expired. Please try again.' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const valid = await verifyTelegramHash(data, botToken);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Telegram verification failed' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const email = `tg_${data.id}@telegram.cpncreditboost.local`;

    // Find or create the account
    const existing = await findTelegramUser(supabase.auth.admin, email);

    if (!existing) {
      const { error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          first_name: data.first_name,
          last_name: data.last_name || '',
          telegram_id: data.id,
          telegram_username: data.username || null,
          auth_provider: 'telegram',
        },
      });
      if (createError) {
        console.error('Create user error:', createError);
        return new Response(JSON.stringify({ error: 'Could not create account' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Issue a one-time magic link token the browser exchanges for a session
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });
    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('Generate link error:', linkError);
      return new Response(JSON.stringify({ error: 'Could not start session' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ token_hash: linkData.properties.hashed_token, email }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Telegram auth error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
