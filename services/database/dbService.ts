import { databases, ID, Query } from '@/lib/appwrite-client';
import { Models } from 'appwrite';

const DATABASE_ID = 'default'; // Adjust if using specific ID
const CONTACTS_COLLECTION_ID = 'contacts';
const SEGMENTS_COLLECTION_ID = 'segments';

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

    // Segments
    async getSegments() {
        return await databases.listDocuments<Segment>(DATABASE_ID, SEGMENTS_COLLECTION_ID);
    },

    async createSegment(data: Omit<Segment, keyof Models.Document>) {
        return await databases.createDocument<Segment>(DATABASE_ID, SEGMENTS_COLLECTION_ID, ID.unique(), data);
    }
};
