import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Bitcoin address from Supabase secrets
    const bitcoinAddress = Deno.env.get('BITCOIN_ADDRESS');
    
    if (!bitcoinAddress) {
      throw new Error('Bitcoin address not configured');
    }

    return new Response(
      JSON.stringify({ address: bitcoinAddress }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching payment address:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch payment address' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});