import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite-server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('id');
    const contactId = searchParams.get('cid');

    if (campaignId && contactId) {
        try {
            const { databases } = createAdminClient();

            // Feature 15: Basic Geolocation Tracking
            const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
            const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
            const city = req.headers.get('x-vercel-ip-city') || 'Unknown';

            // Log opening activity
            await databases.createDocument(
                'default',
                'activity_logs',
                'unique()',
                {
                    campaignId,
                    contactId,
                    type: 'open',
                    metadata: JSON.stringify({ ip, country, city }),
                    timestamp: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error('Tracking Error (Open):', error);
        }
    }

    // Return a 1x1 transparent GIF
    const buffer = Buffer.from(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        'base64'
    );

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'image/gif',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    });
}
