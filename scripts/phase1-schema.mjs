import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://appwrite.grovehub.com.br/v1')
    .setProject('69b19b99002f199c90e2')
    .setKey('standard_b9ffa628b053791c1eaa9f87e64ba1c554fbecd94c66958cd8884410859aa2705e08d7dc601a81fcc03063fdd0bfec34ff7c60c9c11d28d8f1a69f45973c2de8896c318616c5639b91d1dc305020fe5a73e4fcc66c6e09f67a622456a92569980c323481094c6fc6fbde4f35aa3b90f9ed2f32c0d6ef8052b14ae3d6aa43052f');

const databases = new Databases(client);
const DB_ID = 'default';

async function phase1Schema() {
    console.log('--- Iniciando Fase 1: Atualização de Esquema ---');

    // 1. Atualizar Contacts para suportar Campos Personalizados e scoring
    try {
        await databases.createStringAttribute(DB_ID, 'contacts', 'metadata', 10000, false);
        console.log('Atributo metadata adicionado em contacts.');
    } catch (e) {
        console.log('Contacts: metadata já existe ou erro:', e.message);
    }

    try {
        await databases.createIntegerAttribute(DB_ID, 'contacts', 'leadScore', false, 0);
        console.log('Atributo leadScore adicionado em contacts.');
    } catch (e) {
        console.log('Contacts: leadScore já existe ou erro:', e.message);
    }

    // 2. Atualizar Campaigns para Preheader e Agendamento (preparando Fase 2)
    try {
        await databases.createStringAttribute(DB_ID, 'campaigns', 'preheader', 500, false);
        console.log('Atributo preheader adicionado em campaigns.');
    } catch (e) {
        console.log('Campaigns: preheader já existe ou erro:', e.message);
    }

    try {
        await databases.createStringAttribute(DB_ID, 'campaigns', 'scheduledAt', 50, false);
        console.log('Atributo scheduledAt adicionado em campaigns.');
    } catch (e) {
        console.log('Campaigns: scheduledAt já existe ou erro:', e.message);
    }

    // 3. Adicionar Coleção de Segmentos se não existir com atributos
    try {
        await databases.createStringAttribute(DB_ID, 'segments', 'name', 255, true);
        await databases.createStringAttribute(DB_ID, 'segments', 'description', 500, false);
        await databases.createStringAttribute(DB_ID, 'segments', 'rules', 5000, true);
        console.log('Atributos de segments adicionados.');
    } catch (e) {
        console.log('Segments: atributos já existem ou erro:', e.message);
    }

    console.log('Fase 1: Esquema Atualizado!');
}

phase1Schema();
