import { Client, Functions } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import fs from 'fs';

const client = new Client()
    .setEndpoint('https://appwrite.grovehub.com.br/v1')
    .setProject('69b19b99002f199c90e2')
    .setKey('standard_b9ffa628b053791c1eaa9f87e64ba1c554fbecd94c66958cd8884410859aa2705e08d7dc601a81fcc03063fdd0bfec34ff7c60c9c11d28d8f1a69f45973c2de8896c318616c5639b91d1dc305020fe5a73e4fcc66c6e09f67a622456a92569980c323481094c6fc6fbde4f35aa3b90f9ed2f32c0d6ef8052b14ae3d6aa43052f');

const functions = new Functions(client);

async function deploy() {
    console.log('--- Iniciando Deploy de send-newsletter ---');
    try {
        if (!fs.existsSync('function.tar.gz')) {
            throw new Error('Arquivo function.tar.gz não encontrado!');
        }

        const buffer = fs.readFileSync('function.tar.gz');
        console.log(`Lido function.tar.gz (${buffer.length} bytes)`);

        const deployment = await functions.createDeployment(
            'send-newsletter',
            InputFile.fromBuffer(buffer, 'function.tar.gz'),
            true,
            'src/main.js',
            'npm install'
        );
        console.log('DEPLOY REALIZADO COM SUCESSO! ID:', deployment.$id);
    } catch (e) {
        console.error('FALHA NO DEPLOY:');
        console.error(e);
    }
}

deploy();
