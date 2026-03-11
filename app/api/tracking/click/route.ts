import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite-server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const campaignId = searchParams.get('id');
    const contactId = searchParams.get('cid');

    if (url && campaignId && contactId) {
        try {
            const { databases } = createAdminClient();
            // Log click activity
            await databases.createDocument(
                'default',
                'activity_logs',
                'unique()',
                {
                    campaignId,
                    contactId,
                    type: 'click',
                    url,
                    timestamp: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error('Tracking Error (Click):', error);
        }

        return NextResponse.redirect(decodeURIComponent(url));
    }

    return NextResponse.redirect(new URL('/', req.url));
}
