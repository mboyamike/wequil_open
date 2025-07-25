// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { EmbedContentRequest, GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    let end = i + chunkSize;
    if (end > text.length) {
      end = text.length;
    }
    chunks.push(text.substring(i, end));
    i += chunkSize - overlap;
    if (i >= text.length && text.length > 0) { // Handle last chunk
        break;
    }
    if (i < 0) i = 0; // Prevent negative index if overlap is too large
  }
  return chunks;
}

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

  const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
  const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

  try {
    const chunks = chunkText(text_content);
    const embeddingsToInsert: { content: string; embedding: number[]; source_file: string }[] = [];

    for (const chunk of chunks) {
      const result = await embeddingModel.embedContent({
        content: { parts: [{ text: chunk }] },
        taskType: 'SEMANTIC_SIMILARITY', // Optimize for semantic similarity
      } as EmbedContentRequest);
      const embedding = result.embedding.values;

      embeddingsToInsert.push({
        content: chunk,
        embedding: embedding,
        source_file: source_file_name || 'unknown',
      });
    }

    const { error: insertError } = await supabaseClient
      .from('documents')
      .insert(embeddingsToInsert);

    if (insertError) {
      console.error('Error inserting embeddings:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to insert embeddings' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: `Successfully embedded and stored ${chunks.length} chunks.` }), {
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

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/embed-document' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
