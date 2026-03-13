import { Client, Databases, Users, Query } from 'node-appwrite';
import { Resend } from 'resend';

export default async ({ req, res, log, error }) => {
    // Initialize Appwrite Client
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || 'https://appwrite.grovehub.com.br/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Database IDs (Match your setup)
    const DATABASE_ID = 'default';
    const CAMPAIGNS_COLLECTION_ID = 'campaigns';
    const CONTACTS_COLLECTION_ID = 'contacts';

    try {
        const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { campaignId } = payload;

        if (!campaignId) {
            return res.json({ success: false, error: 'Campaign ID is required' }, 400);
        }

        // 1. Fetch Campaign Details
        const campaign = await databases.getDocument(DATABASE_ID, CAMPAIGNS_COLLECTION_ID, campaignId);

        if (campaign.status === 'sent') {
            return res.json({ success: false, error: 'Campaign already sent' }, 400);
        }

        // 2. Determine Audience and Fetch ALL Contacts with Pagination
        const queries = [Query.equal('status', 'active')];

        // Feature 10: Dynamic Segmentation
        if (campaign.segmentId && campaign.segmentId !== 'all') {
            try {
                const segment = await databases.getDocument(DATABASE_ID, 'segments', campaign.segmentId);
                const rules = JSON.parse(segment.rules);
                rules.forEach(rule => {
                    if (rule.operator === 'contains') queries.push(Query.contains(rule.field, rule.value));
                    if (rule.operator === 'equals') queries.push(Query.equal(rule.field, rule.value));
                });
            } catch (e) {
                log('Segment not found or invalid rules, falling back to all active.');
            }
        }

        let allContacts = [];
        let offset = 0;
        const LIMIT = 100;

        while (true) {
            const batchQueries = [...queries, Query.limit(LIMIT), Query.offset(offset)];
            const response = await databases.listDocuments(DATABASE_ID, CONTACTS_COLLECTION_ID, batchQueries);
            allContacts = allContacts.concat(response.documents);
            if (response.documents.length < LIMIT) break;
            offset += LIMIT;
        }

        if (allContacts.length === 0) {
            return res.json({ success: false, error: 'No contacts found for this audience' }, 400);
        }

        // Feature 4: Preheader support (hidden in HTML)
        const preheaderHtml = campaign.preheader
            ? `<div style="display: none; max-height: 0px; overflow: hidden;">${campaign.preheader}</div>`
            : '';

        // Feature 14: Tracking Infrastructure
        const BASE_URL = process.env.BASE_URL || 'https://newsletter.grovehost.com.br';

        let successCount = 0;
        let failCount = 0;

        for (const contact of allContacts) {
            try {
                // Feature 6: Advanced Personalization
                let personalizedContent = campaign.content
                    .replace(/{{nome}}/g, contact.name || 'Amigo')
                    .replace(/{{email}}/g, contact.email)
                    .replace(/{{leadScore}}/g, contact.leadScore || 0)
                    .replace(/{{unsubscribe_url}}/g, `${BASE_URL}/unsubscribe?e=${encodeURIComponent(contact.email)}`);

                // Metadata tags support (Feature 9)
                if (contact.metadata) {
                    try {
                        const meta = JSON.parse(contact.metadata);
                        Object.keys(meta).forEach(key => {
                            const regex = new RegExp(`{{${key}}}`, 'g');
                            personalizedContent = personalizedContent.replace(regex, meta[key]);
                        });
                    } catch (e) { }
                }

                // Feature 14: Click Tracking rewrite
                personalizedContent = personalizedContent.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi, (match, url) => {
                    if (url.startsWith('{{') || url.includes('unsubscribe')) return match;
                    const trackingUrl = `${BASE_URL}/api/tracking/click?id=${campaignId}&cid=${contact.$id}&url=${encodeURIComponent(url)}`;
                    return match.replace(url, trackingUrl);
                });

                // Feature 14: Open Tracking pixel
                const trackingPixel = `<img src="${BASE_URL}/api/tracking/open?id=${campaignId}&cid=${contact.$id}" width="1" height="1" style="display:none" />`;

                await resend.emails.send({
                    from: campaign.sender || 'Newsletter <news@newsletter.grovehost.com.br>',
                    to: contact.email,
                    subject: campaign.subject,
                    html: preheaderHtml + personalizedContent + trackingPixel,
                });
                successCount++;
            } catch (e) {
                error(`Failed to send to ${contact.email}: ${e.message}`);
                failCount++;
            }
        }

        // 4. Update Campaign Stats
        await databases.updateDocument(DATABASE_ID, CAMPAIGNS_COLLECTION_ID, campaignId, {
            status: 'sent',
            sentDate: new Date().toISOString(),
            stats: JSON.stringify({
                sent: successCount,
                failed: failCount,
                opens: 0,
                clicks: 0
            })
        });

        return res.json({ success: true, sent: successCount, failed: failCount });

    } catch (err) {
        error('Error in send-newsletter function: ' + err.message);
        return res.json({ success: false, error: err.message }, 500);
    }
};
