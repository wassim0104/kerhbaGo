import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, clientId } = body;

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_CHAT;
    
    console.log("[CHAT API] Webhook URL configured:", n8nWebhookUrl ? "YES" : "NO");
    console.log("[CHAT API] Webhook URL value:", n8nWebhookUrl);
    
    if (!n8nWebhookUrl) {
      return NextResponse.json({ 
        reply: "L'assistant IA n'est pas encore configuré (variable manquante)." 
      });
    }

    const payload = { 
      userMessage: message, 
      sessionId: clientId || 'anonymous', 
      timestamp: new Date().toISOString() 
    };
    
    console.log("[CHAT API] Sending to n8n:", JSON.stringify(payload));

    // Call actual n8n Webhook
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    console.log("[CHAT API] n8n response status:", response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[CHAT API] n8n error body:", errorText);
      return NextResponse.json({ 
        reply: `Erreur n8n (${response.status}): L'assistant est temporairement indisponible.` 
      });
    }
    
    // Handle various n8n response formats
    const text = await response.text();
    console.log("[CHAT API] n8n raw response:", text);
    
    let reply = "Réponse reçue de l'assistant.";
    
    try {
      const data = JSON.parse(text);
      reply = data.reply || data.output || data.message || data.text || JSON.stringify(data);
    } catch {
      reply = text || reply;
    }
    
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("[CHAT API] FULL ERROR:", error?.message, error?.cause);
    return NextResponse.json({ 
      reply: `Erreur de connexion: ${error?.message || 'timeout'}. Vérifiez que le workflow n8n est actif.` 
    });
  }
}
