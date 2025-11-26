import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    // Simple mock reply logic — replace with real LLM/RAG integration later
    const reply = `Echo: ${String(message).slice(0, 100)}`;
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ reply: "Sorry, something went wrong." }, { status: 500 });
  }
}
