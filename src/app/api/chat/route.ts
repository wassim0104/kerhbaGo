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
      
      // Handle array or object from n8n
      const rawData = Array.isArray(data) ? data[0] : data;
      
      reply = rawData?.message || rawData?.reply || rawData?.output || rawData?.text || (typeof rawData === 'string' ? rawData : JSON.stringify(rawData));
      
      // Look for chips in various common fields
      chips = rawData?.chips || rawData?.suggestions || rawData?.actions || [];
      
      // Ensure chips is actually an array of strings
      if (!Array.isArray(chips)) {
        if (typeof chips === 'string') chips = [chips];
        else chips = [];
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
