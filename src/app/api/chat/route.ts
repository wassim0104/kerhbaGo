import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, clientId, userContext } = body;

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_CHAT;
    
    if (!n8nWebhookUrl) {
      return NextResponse.json({ 
        reply: "L'assistant IA n'est pas encore configuré." 
      });
    }

    const payload = { 
      userMessage: message, 
      sessionId: clientId || 'anonymous',
      userContext: userContext || {},
      timestamp: new Date().toISOString() 
    };

    // Call n8n Webhook with a 25s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return NextResponse.json({ 
        reply: `L'assistant est temporairement indisponible (${response.status}).` 
      });
    }
    
    const text = await response.text();
    let reply = "Réponse reçue de l'assistant.";
    let chips: string[] = [];
    
    try {
      const data = JSON.parse(text);
      
      // n8n can return different formats:
      // Array: [{message: "...", chips: [...]}]
      // Object: {reply: "..."} or {message: "..."} or {output: "..."}
      if (Array.isArray(data)) {
        const first = data[0];
        reply = first?.message || first?.reply || first?.output || first?.text || JSON.stringify(first);
        chips = first?.chips || [];
      } else {
        reply = data.reply || data.output || data.message || data.text || JSON.stringify(data);
        chips = data.chips || [];
      }
    } catch {
      reply = text || reply;
    }
    
    return NextResponse.json({ reply, chips });
  } catch (error: any) {
    const isTimeout = error?.name === 'AbortError';
    return NextResponse.json({ 
      reply: isTimeout 
        ? "L'assistant met trop de temps à répondre. Réessayez dans un instant." 
        : `Erreur de connexion: ${error?.message || 'inconnue'}.`
    });
  }
}
