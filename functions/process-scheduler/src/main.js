import { Client, Databases, Functions, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || 'https://appwrite.grovehub.com.br/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const functions = new Functions(client);

    const DATABASE_ID = 'default';
    const CAMPAIGNS_COLLECTION_ID = 'campaigns';
    const SEND_FUNCTION_ID = 'send-newsletter';

    try {
        const now = new Date().toISOString();
        log(`Checking for scheduled campaigns at ${now}`);

        // 1. Find scheduled campaigns that are due
        const response = await databases.listDocuments(DATABASE_ID, CAMPAIGNS_COLLECTION_ID, [
            Query.equal('status', 'scheduled'),
            Query.lessThanEqual('scheduledAt', now),
            Query.limit(10) // Process in small batches
        ]);

        log(`Found ${response.total} campaigns due for sending.`);

        for (const campaign of response.documents) {
            log(`Processing campaign: ${campaign.name} (${campaign.$id})`);

            try {
                // 2. Mark as sending so it's not picked up again
                await databases.updateDocument(DATABASE_ID, CAMPAIGNS_COLLECTION_ID, campaign.$id, {
                    status: 'sending'
                });

                // 3. Trigger the send-newsletter function
                // We don't wait for it to finish (async) so we can process multiple
                await functions.createExecution(SEND_FUNCTION_ID, JSON.stringify({ campaignId: campaign.$id }), true);

                log(`Triggered execution for campaign ${campaign.$id}`);
            } catch (err) {
                error(`Error processing campaign ${campaign.$id}: ${err.message}`);
                // Fallback: reset status to scheduled if trigger failed? 
                // Or leave as error? Let's leave for manual review if it fails here.
            }
        }

        return res.json({ success: true, processed: response.documents.length });

    } catch (err) {
        error(`Scheduler error: ${err.message}`);
        return res.json({ success: false, error: err.message }, 500);
    }
};
