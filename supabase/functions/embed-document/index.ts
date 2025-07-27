import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from "npm:openai";

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { text_content, source_file_name } = await req.json();

  if (!text_content) {
    return new Response(JSON.stringify({ error: 'Missing text_content' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  });
  
  try {  
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text_content,
    })

    const { error: insertError } = await supabaseClient
      .from('documents')
      .insert({
        content: text_content,
        source_file: source_file_name,
        embedding: response.data[0].embedding,
      });

    if (insertError) {
      console.error('Error inserting embeddings:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to insert embeddings' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: `Successfully embedded and stored` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in embedding process:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
