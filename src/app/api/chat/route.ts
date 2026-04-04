import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, clientId } = body;

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_CHAT;
    
    if (!n8nWebhookUrl) {
      return NextResponse.json({ 
        reply: "L'assistant IA n'est pas encore configuré. Veuillez réessayer plus tard." 
      });
    }

    // Call actual n8n Webhook
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message, 
        clientId: clientId || 'anonymous', 
        timestamp: new Date().toISOString() 
      })
    });
    
    if (!response.ok) {
      console.error(`n8n webhook returned ${response.status}: ${response.statusText}`);
      return NextResponse.json({ 
        reply: "L'assistant IA est temporairement indisponible. Réessayez dans un instant." 
      });
    }
    
    // Handle various n8n response formats
    const text = await response.text();
    let reply = "Réponse reçue de l'assistant.";
    
    try {
      const data = JSON.parse(text);
      // n8n can return { reply: "..." }, { output: "..." }, { message: "..." }, or just a string
      reply = data.reply || data.output || data.message || data.text || JSON.stringify(data);
    } catch {
      // n8n returned plain text
      reply = text || reply;
    }
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ 
      reply: "Une erreur est survenue lors de la connexion à l'assistant. Veuillez réessayer." 
    });
  }
}
