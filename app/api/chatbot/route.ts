import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable")
  throw new Error("GEMINI_API_KEY environment variable is not set")
}

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
The response should include both the SQL query and a natural language explanation of what the query does.`

export async function POST(request: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please check your environment variables." },
        { status: 500 }
      )
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    try {
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
      })

      const response = await result.response
      const text = response.text()

      if (!text) {
        return NextResponse.json(
          { error: "No response from Gemini API" },
          { status: 500 }
        )
      }

      // Extract the SQL query from the response
      const sqlMatch = text.match(/```sql\n([\s\S]*?)\n```/)
      if (!sqlMatch) {
        return NextResponse.json(
          { error: "No SQL query found in response" },
          { status: 500 }
        )
      }

      const query = sqlMatch[1]

      // Execute the SQL query using Supabase
      const supabase = await createServerSupabaseClient()
      const { data, error } = await supabase.rpc("execute_sql", { query })

      if (error) {
        console.error("Supabase error:", error)
        return NextResponse.json(
          { error: "Failed to execute SQL query" },
          { status: 500 }
        )
      }

      // Format the response
      const formattedResponse = `${text}\n\nResults:\n${JSON.stringify(data, null, 2)}`

      return NextResponse.json({ response: formattedResponse })
    } catch (error: any) {
      console.error("Gemini API error:", error)
      if (error.message?.includes("API key not valid")) {
        return NextResponse.json(
          { error: "Invalid Gemini API key. Please check your environment variables." },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { error: `Gemini API error: ${error.message || "Unknown error"}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in chatbot:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 