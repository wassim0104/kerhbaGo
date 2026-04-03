import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, clientId } = body;

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_CHAT;
    
    if (!n8nWebhookUrl) {
      // Mock AI response if n8n is not configured
      return NextResponse.json({ 
        reply: "Simulated n8n Claude AI: J'ai bien reçu votre message concernant votre réservation. Comment puis-je vous aider ?" 
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
    
    if (!response.ok) throw new Error('n8n webhook failed');
    
    const data = await response.json();
    return NextResponse.json({ reply: data.reply || "Réponse générique de n8n." });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to connect to kerhbaGo AI Brain." }, { status: 500 });
  }
}
