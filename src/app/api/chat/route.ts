import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("🔁 Incoming request to /api/chat");

  const body = await req.json();
  const messages = body.messages;
  console.log("📩 Messages received from client:", messages);

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  console.log("🔐 API Key available:", !!OPENROUTER_API_KEY);

  if (!OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY not found");
    return NextResponse.json(
      { error: "OpenRouter API key not found in environment variables" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // ✅ Update when deploying
        "X-Title": "Smartyy",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...messages,
        ],
      }),
    });

    console.log("🌐 Sent request to OpenRouter");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("💥 Error response from OpenRouter:", errorText);
      return NextResponse.json(
        { error: "❌ No valid response from the API", detail: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("✅ Successful OpenRouter response:\n", JSON.stringify(data, null, 2));
    console.log("📦 Response message content:", data?.choices?.[0]?.message?.content);

    return NextResponse.json(data);

  } catch (err) {
    console.error("🔥 Unexpected error during fetch:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred", detail: err },
      { status: 500 }
    );
  }
}
