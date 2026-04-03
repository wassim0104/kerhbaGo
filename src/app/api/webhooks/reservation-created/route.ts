import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const bookingData = await req.json();

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_RESERVATION;
    
    // If no n8n webhook is configured, log and return success (dry-run mode)
    if (!n8nWebhookUrl) {
      console.log('n8n Webhook URL not configured. Simulating AI processing for booking:', bookingData.id);
      return NextResponse.json({ 
        success: true, 
        message: 'Booking processed in dry-run mode (no n8n webhook URL found).' 
      });
    }

    // Call actual n8n Webhook for Reservation Processing (SMS/Email/AI Pricing log)
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'reservation_created',
        data: bookingData,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) throw new Error('n8n webhook failed with status: ' + response.status);
    
    return NextResponse.json({ success: true, message: "n8n workflow triggered successfully." });
  } catch (error) {
    console.error("Reservation Webhook API Error:", error);
    // We don't want to fail the whole frontend booking if the optional n8n webhook fails
    return NextResponse.json({ error: "Failed to trigger n8n workflow, but booking is saved." }, { status: 500 });
  }
}
