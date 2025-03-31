import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access the GEMINI_API_KEY from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("Environment variables available:", {
  hasGeminiKey: !!GEMINI_API_KEY,
  envKeys: Object.keys(process.env).filter(key => key.includes('GEMINI'))
});

// Check if the GEMINI_API_KEY is set
if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable");
  throw new Error("GEMINI_API_KEY environment variable is not set");
}
console.log("GEMINI_API_KEY:", GEMINI_API_KEY);

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const SYSTEM_PROMPT = `You are a helpful assistant that converts natural language queries about listings into SQL queries.
The database has the following tables and columns:

listings:
- id (uuid)
- title (text)
- description (text)
- price (numeric)
- category_id (uuid)
- subcategory_id (uuid)
- location_id (uuid)
- user_id (uuid)
- status (text)
- created_at (timestamp)
- updated_at (timestamp)
- views (integer)
- is_featured (boolean)

categories:
- id (uuid)
- name (text)
- slug (text)
- parent_id (uuid)
- order (integer)

locations:
- id (uuid)
- name (text)
- slug (text)

profiles:
- id (uuid)
- full_name (text)
- avatar_url (text)

Convert the user's question into a SQL query that will return relevant information in a user-friendly format.
The response should include both the SQL query and a natural language explanation of what the query does
return only the results in a user-friendly format no extra text.`;
export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Generate content with structured output
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser question: ${message}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const response = await result.response;
    const text = response.text();

    if (!text) {
      return NextResponse.json(
        { error: "No response from Gemini API" },
        { status: 500 }
      );
    }

    // Extract the SQL query from the response
    const sqlMatch = text.match(/```sql\n([\s\S]*?)\n```/);
    if (!sqlMatch) {
      return NextResponse.json(
        { error: "No SQL query found in response" },
        { status: 500 }
      );
    }

    const query = sqlMatch[1];

    // Execute the SQL query using Supabase
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc("execute_sql", { query });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to execute SQL query" },
        { status: 500 }
      );
    }

    // Format the response to include only the results from the query
    const formattedResponse = `Results:\n${JSON.stringify(data, null, 2)}`;

    return NextResponse.json({ response: formattedResponse });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    if (error.message?.includes("API key not valid")) {
      return NextResponse.json(
        { error: "Invalid Gemini API key. Please check your environment variables." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: `Gemini API error: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}