import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite-server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('id');
    const contactId = searchParams.get('cid');

    if (campaignId && contactId) {
        try {
            const { databases } = createAdminClient();
            // Log opening activity
            await databases.createDocument(
                'default',
                'activity_logs',
                'unique()',
                {
                    campaignId,
                    contactId,
                    type: 'open',
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
