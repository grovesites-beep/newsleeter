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
        const { campaignId } = req.body;

        if (!campaignId) {
            return res.json({ success: false, error: 'Campaign ID is required' }, 400);
        }

        // 1. Fetch Campaign Details
        const campaign = await databases.getDocument(
            DATABASE_ID,
            CAMPAIGNS_COLLECTION_ID,
            campaignId
        );

        if (campaign.status === 'sent') {
            return res.json({ success: false, error: 'Campaign already sent' }, 400);
        }

        // 2. Fetch Targeted Contacts
        // For MVP, we'll fetch all active contacts. 
        // You can add filtering based on campaign.segmentId later
        const contacts = await databases.listDocuments(
            DATABASE_ID,
            CONTACTS_COLLECTION_ID,
            [Query.equal('status', 'active')]
        );

        if (contacts.total === 0) {
            return res.json({ success: false, error: 'No active contacts found' }, 400);
        }

        log(`Starting campaign "${campaign.name}" for ${contacts.total} contacts.`);

        // 3. Send Emails via Resend
        // Note: Resend has rate limits, for large lists you should batch these
        const sendPromises = contacts.documents.map(contact => {
            // Basic tag replacement for personalization
            let personalizedContent = campaign.content
                .replace(/{{nome}}/g, contact.name)
                .replace(/{{email}}/g, contact.email);

            return resend.emails.send({
                from: campaign.sender || 'Newsletter <news@newsletter.grovehost.com.br>',
                to: contact.email,
                subject: campaign.subject,
                html: personalizedContent,
            });
        });

        const results = await Promise.allSettled(sendPromises);
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failCount = results.length - successCount;

        // 4. Update Campaign Status
        await databases.updateDocument(
            DATABASE_ID,
            CAMPAIGNS_COLLECTION_ID,
            campaignId,
            {
                status: 'sent',
                sentAt: new Date().toISOString(),
                stats: JSON.stringify({
                    sent: successCount,
                    failed: failCount,
                    opens: 0,
                    clicks: 0
                })
            }
        );

        log(`Campaign finished. Success: ${successCount}, Failed: ${failCount}`);

        return res.json({
            success: true,
            sent: successCount,
            failed: failCount
        });

    } catch (err) {
        error('Error sending newsletter: ' + err.message);
        return res.json({ success: false, error: err.message }, 500);
    }
};
