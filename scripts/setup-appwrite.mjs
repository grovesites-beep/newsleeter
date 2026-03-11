import { Client, Functions, Databases, ID, Role, Permission } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://appwrite.grovehub.com.br/v1')
    .setProject('69b19b99002f199c90e2')
    .setKey('standard_b9ffa628b053791c1eaa9f87e64ba1c554fbecd94c66958cd8884410859aa2705e08d7dc601a81fcc03063fdd0bfec34ff7c60c9c11d28d8f1a69f45973c2de8896c318616c5639b91d1dc305020fe5a73e4fcc66c6e09f67a622456a92569980c323481094c6fc6fbde4f35aa3b90f9ed2f32c0d6ef8052b14ae3d6aa43052f');

const functions = new Functions(client);
const databases = new Databases(client);

const DB_ID = 'default';
const COLLECTIONS = [
    { id: 'contacts', name: 'Contacts' },
    { id: 'campaigns', name: 'Campaigns' },
    { id: 'templates', name: 'Templates' },
    { id: 'segments', name: 'Segments' },
    { id: 'users', name: 'Users' },
    { id: 'activity_logs', name: 'Activity Logs' }
];

async function setup() {
    console.log('--- Starting Appwrite Setup ---');

    // 1. Create Database
    try {
        await databases.create(DB_ID, 'Main Database');
        console.log('Created database: default');
    } catch (e) {
        if (e.code === 409) console.log('Database "default" already exists.');
        else console.error('Error creating database:', e.message);
    }

    // 2. Create Collections
    for (const col of COLLECTIONS) {
        try {
            await databases.createCollection(DB_ID, col.id, col.name, [
                Permission.read(Role.any()),
                Permission.write(Role.users()),
            ]);
            console.log(`Created collection: ${col.id}`);

            // Add basic attributes for the ones we use
            if (col.id === 'campaigns') {
                await databases.createStringAttribute(DB_ID, col.id, 'name', 255, true);
                await databases.createStringAttribute(DB_ID, col.id, 'subject', 255, false);
                await databases.createStringAttribute(DB_ID, col.id, 'content', 100000, false);
                await databases.createStringAttribute(DB_ID, col.id, 'sender', 255, false);
                await databases.createStringAttribute(DB_ID, col.id, 'status', 50, true);
                await databases.createStringAttribute(DB_ID, col.id, 'stats', 5000, false);
                console.log('Added attributes to campaigns');
            }
            if (col.id === 'templates') {
                await databases.createStringAttribute(DB_ID, col.id, 'name', 255, true);
                await databases.createStringAttribute(DB_ID, col.id, 'content', 100000, true);
                await databases.createStringAttribute(DB_ID, col.id, 'description', 500, false);
                console.log('Added attributes to templates');
            }
            if (col.id === 'contacts') {
                await databases.createStringAttribute(DB_ID, col.id, 'name', 255, true);
                await databases.createStringAttribute(DB_ID, col.id, 'email', 255, true);
                await databases.createStringAttribute(DB_ID, col.id, 'status', 50, true);
                await databases.createStringListAttribute(DB_ID, col.id, 'tags', 100, false);
                console.log('Added attributes to contacts');
            }
        } catch (e) {
            if (e.code === 409) console.log(`Collection "${col.id}" already exists.`);
            else console.error(`Error with collection ${col.id}:`, e.message);
        }
    }

    // 3. Create Function
    try {
        const func = await functions.create(
            'send-newsletter',
            'Send Newsletter via Resend',
            'node-18.0',
            ['any']
        );
        console.log('Created function: send-newsletter');

        // Add variables
        await functions.createVariable('send-newsletter', 'RESEND_API_KEY', 're_ii4HsGbL_PtGVbnYtSuAsBVvUXcd78tKc');
        await functions.createVariable('send-newsletter', 'APPWRITE_API_KEY', 'standard_b9ffa628b053791c1eaa9f87e64ba1c554fbecd94c66958cd8884410859aa2705e08d7dc601a81fcc03063fdd0bfec34ff7c60c9c11d28d8f1a69f45973c2de8896c318616c5639b91d1dc305020fe5a73e4fcc66c6e09f67a622456a92569980c323481094c6fc6fbde4f35aa3b90f9ed2f32c0d6ef8052b14ae3d6aa43052f');
        await functions.createVariable('send-newsletter', 'APPWRITE_FUNCTION_PROJECT_ID', '69b19b99002f199c90e2');
        await functions.createVariable('send-newsletter', 'APPWRITE_FUNCTION_ENDPOINT', 'https://appwrite.grovehub.com.br/v1');
        console.log('Added environment variables to function');
    } catch (e) {
        if (e.code === 409) console.log('Function "send-newsletter" already exists.');
        else console.error('Error with function:', e.message);
    }

    console.log('--- Setup Finished ---');
}

setup();
