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
    // Return the specific Bitcoin wallet address
    const bitcoinAddress = "18zzeUz9UXTZ58W6TxdKCh94un8JK7Jc3t";
    
    console.log('Returning Bitcoin address:', bitcoinAddress);

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