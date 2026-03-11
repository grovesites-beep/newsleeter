import { databases, ID, Query, functions } from '@/lib/appwrite-client';
import { Models } from 'appwrite';

const DATABASE_ID = 'default'; // Adjust if using specific ID
const CONTACTS_COLLECTION_ID = 'contacts';
const SEGMENTS_COLLECTION_ID = 'segments';
const USERS_COLLECTION_ID = 'users';
const ACTIVITY_LOGS_COLLECTION_ID = 'activity_logs';
const CAMPAIGNS_COLLECTION_ID = 'campaigns';
const TEMPLATES_COLLECTION_ID = 'templates';

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
    segmentId?: string;
    status: 'draft' | 'scheduled' | 'sent' | 'sending';
    scheduledDate?: string;
    sentDate?: string;
    stats?: {
        opens: number;
        clicks: number;
        bounces: number;
        delivered: number;
    } | string; // Appwrite might return it as a stringified object if not using maps
}

export interface EmailTemplate extends Models.Document {
    name: string;
    content: string;
    description?: string;
    thumbnail?: string;
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
    async getCampaigns(queries: string[] = []) {
        try {
            return await databases.listDocuments<Campaign>(DATABASE_ID, CAMPAIGNS_COLLECTION_ID, queries);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            return { documents: [], total: 0 };
        }
    },

    async createCampaign(data: Omit<Campaign, keyof Models.Document>) {
        return await databases.createDocument<Campaign>(DATABASE_ID, CAMPAIGNS_COLLECTION_ID, ID.unique(), data);
    },

    async updateCampaign(documentId: string, data: Partial<Campaign>) {
        return await databases.updateDocument<Campaign>(DATABASE_ID, CAMPAIGNS_COLLECTION_ID, documentId, data);
    },

    async deleteCampaign(documentId: string) {
        return await databases.deleteDocument(DATABASE_ID, CAMPAIGNS_COLLECTION_ID, documentId);
    },

    async sendCampaign(campaignId: string) {
        // Replace 'send-newsletter' with your actual function ID in Appwrite Console
        const FUNCTION_ID = 'send-newsletter';
        return await functions.createExecution(FUNCTION_ID, JSON.stringify({ campaignId }));
    },

    // Templates
    async getTemplates(queries: string[] = []) {
        try {
            return await databases.listDocuments<EmailTemplate>(DATABASE_ID, TEMPLATES_COLLECTION_ID, queries);
        } catch (error) {
            console.error('Error fetching templates:', error);
            return { documents: [], total: 0 };
        }
    },

    async createTemplate(data: Omit<EmailTemplate, keyof Models.Document>) {
        return await databases.createDocument<EmailTemplate>(DATABASE_ID, TEMPLATES_COLLECTION_ID, ID.unique(), data);
    },

    async updateTemplate(documentId: string, data: Partial<EmailTemplate>) {
        return await databases.updateDocument<EmailTemplate>(DATABASE_ID, TEMPLATES_COLLECTION_ID, documentId, data);
    },

    async deleteTemplate(documentId: string) {
        return await databases.deleteDocument(DATABASE_ID, TEMPLATES_COLLECTION_ID, documentId);
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
