import { Client, Databases, Functions, Permission, Role, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://appwrite.grovehub.com.br/v1')
    .setProject('69b19b99002f199c90e2')
    .setKey('standard_b9ffa628b053791c1eaa9f87e64ba1c554fbecd94c66958cd8884410859aa2705e08d7dc601a81fcc03063fdd0bfec34ff7c60c9c11d28d8f1a69f45973c2de8896c318616c5639b91d1dc305020fe5a73e4fcc66c6e09f67a622456a92569980c323481094c6fc6fbde4f35aa3b90f9ed2f32c0d6ef8052b14ae3d6aa43052f');

const databases = new Databases(client);

const DB_ID = 'default';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fixAppwrite() {
    console.log('--- Corrigindo Esquemas do Appwrite ---');

    // 1. Corrigir Coleção Campaigns
    const campaignAttrs = [
        { key: 'sender', size: 255 },
        { key: 'status', size: 50 },
        { key: 'stats', size: 10000 },
        { key: 'segmentId', size: 50 }
    ];

    for (const attr of campaignAttrs) {
        try {
            await databases.createStringAttribute(DB_ID, 'campaigns', attr.key, attr.size, false);
            console.log(`Atributo ${attr.key} adicionado em campaigns.`);
            await sleep(1000);
        } catch (e) {
            console.log(`Campaigns: ${attr.key} já existe ou erro: ${e.message}`);
        }
    }

    // 2. Corrigir Coleção Contacts (Tags como Array)
    try {
        // Appwrite createStringAttribute(databaseId, collectionId, key, size, required, default, array)
        await databases.createStringAttribute(DB_ID, 'contacts', 'tags', 100, false, undefined, true);
        console.log('Atributo tags (array) adicionado em contacts.');
    } catch (e) {
        console.log(`Contacts: tags já existe ou erro: ${e.message}`);
    }

    // 3. Corrigir Coleção Templates
    const templateAttrs = [
        { key: 'name', size: 255 },
        { key: 'content', size: 100000 },
        { key: 'description', size: 500 }
    ];

    for (const attr of templateAttrs) {
        try {
            await databases.createStringAttribute(DB_ID, 'templates', attr.key, attr.size, true);
            console.log(`Atributo ${attr.key} adicionado em templates.`);
            await sleep(1000);
        } catch (e) {
            console.log(`Templates: ${attr.key} já existe ou erro: ${e.message}`);
        }
    }

    // 4. Adicionar Contato de Teste
    try {
        await databases.createDocument(DB_ID, 'contacts', ID.unique(), {
            name: 'Usuário Teste',
            email: 'contato@grovehub.com.br',
            status: 'active',
            tags: ['teste', 'newsletter']
        });
        console.log('Contato de teste criado em contatos.');
    } catch (e) {
        console.log('Erro ao criar contato de teste:', e.message);
    }

    console.log('Esquema corrigido!');
}

fixAppwrite();
