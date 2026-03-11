import { Client, Databases, Functions, Permission, Role, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://appwrite.grovehub.com.br/v1')
    .setProject('69b19b99002f199c90e2')
    .setKey('standard_b9ffa628b053791c1eaa9f87e64ba1c554fbecd94c66958cd8884410859aa2705e08d7dc601a81fcc03063fdd0bfec34ff7c60c9c11d28d8f1a69f45973c2de8896c318616c5639b91d1dc305020fe5a73e4fcc66c6e09f67a622456a92569980c323481094c6fc6fbde4f35aa3b90f9ed2f32c0d6ef8052b14ae3d6aa43052f');

const databases = new Databases(client);
const functions = new Functions(client);

const DB_ID = 'default';

async function runSetup() {
    console.log('Iniciando configuração do Appwrite...');

    // 1. Garantir que o Banco de Dados existe
    try {
        await databases.get(DB_ID);
        console.log('Banco "default" já existe.');
    } catch (e) {
        await databases.create(DB_ID, 'Newsletter DB');
        console.log('Banco "default" criado.');
    }

    const collections = [
        { id: 'contacts', name: 'Contatos' },
        { id: 'campaigns', name: 'Campanhas' },
        { id: 'templates', name: 'Modelos' }
    ];

    for (const col of collections) {
        try {
            await databases.createCollection(DB_ID, col.id, col.name, [
                Permission.read(Role.any()),
                Permission.write(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]);
            console.log(`Coleção ${col.id} criada.`);

            // Atributos para Campanhas
            if (col.id === 'campaigns') {
                await databases.createStringAttribute(DB_ID, col.id, 'name', 255, true);
                await databases.createStringAttribute(DB_ID, col.id, 'subject', 255, false);
                await databases.createStringAttribute(DB_ID, col.id, 'content', 100000, false);
                await databases.createStringAttribute(DB_ID, col.id, 'sender', 255, false);
                await databases.createStringAttribute(DB_ID, col.id, 'status', 50, true);
                await databases.createStringAttribute(DB_ID, col.id, 'stats', 10000, false);
                await databases.createStringAttribute(DB_ID, col.id, 'segmentId', 50, false);
                console.log('Atributos de Campanhas adicionados.');
            }

            // Atributos para Modelos
            if (col.id === 'templates') {
                await databases.createStringAttribute(DB_ID, col.id, 'name', 255, true);
                await databases.createStringAttribute(DB_ID, col.id, 'content', 100000, true);
                await databases.createStringAttribute(DB_ID, col.id, 'description', 500, false);
                console.log('Atributos de Modelos adicionados.');
            }

            // Atributos para Contatos
            if (col.id === 'contacts') {
                await databases.createStringAttribute(DB_ID, col.id, 'name', 255, true);
                await databases.createStringAttribute(DB_ID, col.id, 'email', 255, true);
                await databases.createStringAttribute(DB_ID, col.id, 'status', 50, true);
                // Tags como array (Attribute string com array=true)
                await databases.createStringAttribute(DB_ID, col.id, 'tags', 50, false, undefined, true);
                console.log('Atributos de Contatos adicionados.');
            }

        } catch (e) {
            if (e.code === 409) console.log(`Coleção ${col.id} já existe.`);
            else console.error(`Erro na coleção ${col.id}:`, e.message);
        }
    }

    // 2. Configurar Appwrite Function
    try {
        const funcId = 'send-newsletter';
        try {
            await functions.get(funcId);
            console.log('Função já existe.');
        } catch (e) {
            // Tentando node-16.0 se 18.0 falhou
            try {
                await functions.create(funcId, 'Disparo de Newsletter', 'node-16.0', ['any']);
                console.log('Função criada com node-16.0.');
            } catch (err2) {
                console.error('Erro ao criar com 16.0. Detalhes:', err2.message);
                // Se falhar, tentaremos node-18.0 de novo mas logando o erro completo
                console.log('Tentativa final com node-18.0...');
                await functions.create(funcId, 'Disparo de Newsletter', 'node-18.0', ['any']);
            }
        }

        // Variáveis de Ambiente
        const vars = [
            { key: 'RESEND_API_KEY', value: 're_ii4HsGbL_PtGVbnYtSuAsBVvUXcd78tKc' },
            { key: 'APPWRITE_API_KEY', value: 'standard_b9ffa628b053791c1eaa9f87e64ba1c554fbecd94c66958cd8884410859aa2705e08d7dc601a81fcc03063fdd0bfec34ff7c60c9c11d28d8f1a69f45973c2de8896c318616c5639b91d1dc305020fe5a73e4fcc66c6e09f67a622456a92569980c323481094c6fc6fbde4f35aa3b90f9ed2f32c0d6ef8052b14ae3d6aa43052f' },
            { key: 'APPWRITE_FUNCTION_PROJECT_ID', value: '69b19b99002f199c90e2' },
            { key: 'APPWRITE_FUNCTION_ENDPOINT', value: 'https://appwrite.grovehub.com.br/v1' }
        ];

        for (const v of vars) {
            try {
                await functions.createVariable(funcId, v.key, v.value);
                console.log(`Variável ${v.key} configurada.`);
            } catch (e) {
                console.log(`Variável ${v.key} já existe ou erro.`);
            }
        }
    } catch (e) {
        console.error('Erro na configuração da função:', e.message);
    }

    console.log('Configuração finalizada com sucesso!');
}

runSetup();
