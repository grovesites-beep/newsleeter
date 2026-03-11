import { databases, ID, Query } from '@/lib/appwrite-client';
import { Models } from 'appwrite';

const DATABASE_ID = 'default'; // Adjust if using specific ID
const CONTACTS_COLLECTION_ID = 'contacts';
const SEGMENTS_COLLECTION_ID = 'segments';
const USERS_COLLECTION_ID = 'users';
const ACTIVITY_LOGS_COLLECTION_ID = 'activity_logs';

export interface Contact extends Models.Document {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    tags: string[];
    status: 'active' | 'inactive' | 'unsubscribed';
}

export interface Segment extends Models.Document {
    name: string;
    description?: string;
    filters: string; // JSON string of filter logic
}

export interface UserProfile extends Models.Document {
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    avatar?: string;
    status: 'active' | 'pending';
}

export interface ActivityLog extends Models.Document {
    eventId: string;
    type: 'open' | 'click' | 'unsubscribe' | 'campaign_start' | 'campaign_end';
    contactId?: string;
    campaignId?: string;
    metadata?: string; // JSON string
    timestamp: string;
}

export interface Campaign extends Models.Document {
    name: string;
    subject: string;
    content: string;
    sender: string;
    status: 'draft' | 'scheduled' | 'sent' | 'sending';
    scheduledDate?: string;
    sentDate?: string;
    stats?: {
        opens: number;
        clicks: number;
        bounces: number;
        delivered: number;
    };
}

export const dbService = {
    // Contacts
    async getContacts(queries: string[] = []) {
        return await databases.listDocuments<Contact>(DATABASE_ID, CONTACTS_COLLECTION_ID, queries);
    },

    async createContact(data: Omit<Contact, keyof Models.Document>) {
        return await databases.createDocument<Contact>(DATABASE_ID, CONTACTS_COLLECTION_ID, ID.unique(), data);
    },

    async updateContact(documentId: string, data: Partial<Contact>) {
        return await databases.updateDocument<Contact>(DATABASE_ID, CONTACTS_COLLECTION_ID, documentId, data);
    },

    async deleteContact(documentId: string) {
        return await databases.deleteDocument(DATABASE_ID, CONTACTS_COLLECTION_ID, documentId);
    },

    // Campaigns
    async getCampaigns() {
        // Mock data for UI development
        const mockCampaigns: Campaign[] = [
            {
                $id: '1',
                name: 'Newsletter Março 2024',
                subject: 'Novidades Incríveis!',
                content: '<h1>Conteúdo</h1>',
                sender: 'contato@grovehub.com.br',
                status: 'sent',
                sentDate: new Date().toISOString(),
                stats: { opens: 425, clicks: 89, bounces: 2, delivered: 1240 },
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: [],
                $databaseId: 'default',
                $collectionId: 'campaigns',
                $sequence: 1
            },
            {
                $id: '2',
                name: 'Promoção Relâmpago',
                subject: 'Só hoje: 50% de desconto',
                content: '<h1>Conteúdo</h1>',
                sender: 'news@newsletter.grovehost.com.br',
                status: 'draft',
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: [],
                $databaseId: 'default',
                $collectionId: 'campaigns',
                $sequence: 2
            }
        ];
        return { documents: mockCampaigns, total: mockCampaigns.length };
    },

    // Segments
    async getSegments() {
        return await databases.listDocuments<Segment>(DATABASE_ID, SEGMENTS_COLLECTION_ID);
    },

    async createSegment(data: Omit<Segment, keyof Models.Document>) {
        return await databases.createDocument<Segment>(DATABASE_ID, SEGMENTS_COLLECTION_ID, ID.unique(), data);
    },

    // Users / Team
    async getUsers() {
        return await databases.listDocuments<UserProfile>(DATABASE_ID, USERS_COLLECTION_ID);
    },

    async updateUserRole(documentId: string, role: UserProfile['role']) {
        return await databases.updateDocument<UserProfile>(DATABASE_ID, USERS_COLLECTION_ID, documentId, { role });
    },

    // Logs
    async getLogs(queries: string[] = []) {
        return await databases.listDocuments<ActivityLog>(DATABASE_ID, ACTIVITY_LOGS_COLLECTION_ID, queries);
    }
};
