import { Client, Functions } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import fs from 'fs';

const client = new Client()
    .setEndpoint('https://appwrite.grovehub.com.br/v1')
    .setProject('69b19b99002f199c90e2')
    .setKey('standard_b9ffa628b053791c1eaa9f87e64ba1c554fbecd94c66958cd8884410859aa2705e08d7dc601a81fcc03063fdd0bfec34ff7c60c9c11d28d8f1a69f45973c2de8896c318616c5639b91d1dc305020fe5a73e4fcc66c6e09f67a622456a92569980c323481094c6fc6fbde4f35aa3b90f9ed2f32c0d6ef8052b14ae3d6aa43052f');

const functions = new Functions(client);

async function setup() {
    const funcId = 'process-scheduler';
    console.log('--- Configurando Função process-scheduler ---');

    try {
        await functions.get(funcId);
        console.log('Função já existe.');

        // Update schedule just in case
        await functions.update({
            functionId: funcId,
            name: 'Scheduler de Campanhas',
            schedule: '* * * * *'
        });
        console.log('Schedule atualizado para: * * * * *');

    } catch (e) {
        console.log('Criando função...');
        try {
            await functions.create({
                functionId: funcId,
                name: 'Scheduler de Campanhas',
                runtime: 'node-18.0',
                execute: ['any'],
                schedule: '* * * * *'
            });
            console.log('Função criada com node-18.0 e cron: * * * * *');
        } catch (err) {
            console.log('Falha ao criar com node-18.0, tentando node-16.0...');
            await functions.create({
                functionId: funcId,
                name: 'Scheduler de Campanhas',
                runtime: 'node-16.0',
                execute: ['any'],
                schedule: '* * * * *'
            });
            console.log('Função criada com node-16.0.');
        }
    }

    // Env Vars
    const vars = [
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

    // Deploy
    if (fs.existsSync('scheduler.tar.gz')) {
        const buffer = fs.readFileSync('scheduler.tar.gz');
        try {
            await functions.createDeployment({
                functionId: funcId,
                code: InputFile.fromBuffer(buffer, 'scheduler.tar.gz'),
                activate: true,
                entrypoint: 'src/main.js',
                commands: 'npm install'
            });
            console.log('Deploy realizado com sucesso!');
        } catch (e) {
            console.error('Erro no deploy:', e.message);
        }
    } else {
        console.error('scheduler.tar.gz não encontrado para deploy.');
    }
}

setup();
