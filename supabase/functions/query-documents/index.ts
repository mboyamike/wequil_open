import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from "npm:openai";

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { query } = await req.json();

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing query' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')! // Use anon key for client-side calls, ensure RLS is set up
  );

  const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  });

  try {
    // 1. Embed the user's query using OpenAI
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    
    const queryEmbedding = response.data[0].embedding;

    // 2. Perform similarity search in Supabase
    // Using `similarity` operator for pgvector's cosine distance (1 - (a <=> b))
    const { data: documents, error: queryError } = await supabaseClient.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.78, // Adjust this threshold based on your data and desired relevance
      match_count: 5,        // Number of top relevant documents to retrieve
    });

    if (queryError) {
      console.error('Error querying documents:', queryError);
      return new Response(JSON.stringify({ error: 'Failed to retrieve documents' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!documents || documents.length === 0) {
      return new Response(JSON.stringify({ message: 'No relevant documents found.', context: '' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Combine retrieved contexts
    const context = documents.map((doc: any) => doc.content).join('\n\n');

    return new Response(JSON.stringify({ context, documents: documents.map((doc: any) => ({ content: doc.content, similarity: doc.similarity, source_file: doc.source_file })) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in query processing:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});