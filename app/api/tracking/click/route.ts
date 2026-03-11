import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite-server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('id');
    const contactId = searchParams.get('cid');
    const targetUrl = searchParams.get('url');

    if (campaignId && contactId && targetUrl) {
        try {
            const { databases } = createAdminClient();

            // Feature 15: Basic Geolocation Tracking
            const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
            const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
            const city = req.headers.get('x-vercel-ip-city') || 'Unknown';

            // Log click activity
            await databases.createDocument(
                'default',
                'activity_logs',
                'unique()',
                {
                    campaignId,
                    contactId,
                    type: 'click',
                    metadata: JSON.stringify({
                        url: targetUrl,
                        ip,
                        country,
                        city
                    }),
                    timestamp: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error('Tracking Error (Click):', error);
        }
    }

    // Redirect to the actual target URL
    const destination = targetUrl || 'https://newsletter.grovehost.com.br';

    return NextResponse.redirect(new URL(destination));
}
