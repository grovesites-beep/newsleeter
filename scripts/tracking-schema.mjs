import { Client, Databases, Permission, Role } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://appwrite.grovehub.com.br/v1')
    .setProject('69b19b99002f199c90e2')
    .setKey('standard_b9ffa628b053791c1eaa9f87e64ba1c554fbecd94c66958cd8884410859aa2705e08d7dc601a81fcc03063fdd0bfec34ff7c60c9c11d28d8f1a69f45973c2de8896c318616c5639b91d1dc305020fe5a73e4fcc66c6e09f67a622456a92569980c323481094c6fc6fbde4f35aa3b90f9ed2f32c0d6ef8052b14ae3d6aa43052f');

const databases = new Databases(client);
const DB_ID = 'default';

async function setupTrackingSchema() {
    console.log('--- Iniciando Configuração de Rastreamento (Activity Logs) ---');

    const COL_ID = 'activity_logs';

    try {
        await databases.createCollection(DB_ID, COL_ID, 'Logs de Atividade', [
            Permission.read(Role.any()), // Permitir leitura para relatórios (ou Role.users() se preferir)
            Permission.write(Role.any()), // O tracking API precisa escrever sem auth JWT do front
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]);
        console.log(`Coleção ${COL_ID} criada.`);
    } catch (e) {
        if (e.code === 409) console.log(`Coleção ${COL_ID} já existe.`);
        else console.error(`Erro ao criar coleção ${COL_ID}:`, e.message);
    }

    const attributes = [
        { key: 'type', type: 'string', size: 50, required: true },
        { key: 'campaignId', type: 'string', size: 50, required: false },
        { key: 'contactId', type: 'string', size: 50, required: false },
        { key: 'timestamp', type: 'string', size: 50, required: true },
        { key: 'metadata', type: 'string', size: 10000, required: false }
    ];

    for (const attr of attributes) {
        try {
            if (attr.type === 'string') {
                await databases.createStringAttribute(DB_ID, COL_ID, attr.key, attr.size, attr.required);
            }
            console.log(`Atributo ${attr.key} adicionado.`);
        } catch (e) {
            console.log(`Atributo ${attr.key} já existe ou erro:`, e.message);
        }
    }

    console.log('--- Configuração de Rastreamento Finalizada ---');
}

setupTrackingSchema();
