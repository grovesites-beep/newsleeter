import { Client, Functions, InputFile, Databases, ID } from 'node-appwrite';
import fs from 'fs';

const client = new Client()
    .setEndpoint('https://appwrite.grovehub.com.br/v1')
    .setProject('69b19b99002f199c90e2')
    .setKey('standard_b9ffa628b053791c1eaa9f87e64ba1c554fbecd94c66958cd8884410859aa2705e08d7dc601a81fcc03063fdd0bfec34ff7c60c9c11d28d8f1a69f45973c2de8896c318616c5639b91d1dc305020fe5a73e4fcc66c6e09f67a622456a92569980c323481094c6fc6fbde4f35aa3b90f9ed2f32c0d6ef8052b14ae3d6aa43052f');

const functions = new Functions(client);
const databases = new Databases(client);

async function finalTouch() {
    console.log('--- Finalizando Appwrite (Deploy e Templates) ---');

    // 1. Criar um Template Profissional de exemplo
    try {
        await databases.createDocument('default', 'templates', ID.unique(), {
            name: 'Boas-vindas Moderno',
            description: 'Template limpo para novos assinantes.',
            content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
    <h1 style="color: #4f46e5; text-align: center;">Bem-vindo à nossa Newsletter!</h1>
    <p>Olá <strong>{{nome}}</strong>,</p>
    <p>Estamos muito felizes em ter você aqui. Toda semana traremos as melhores novidades e insights direto para o seu e-mail ({{email}}).</p>
    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #64748b;">Dica da semana: Fique de olho na aba de promoções!</p>
    </div>
    <a href="#" style="display: block; width: 200px; margin: 20px auto; padding: 12px; background: #4f46e5; color: white; text-align: center; text-decoration: none; border-radius: 6px; font-weight: bold;">Visitar nosso Site</a>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
    <p style="text-align: center; font-size: 12px; color: #94a3b8;">© 2024 Grove Sites. Todos os direitos reservados.</p>
</div>`
        });
        console.log('Template de exemplo criado.');
    } catch (e) {
        console.log('Template já existe ou erro:', e.message);
    }

    // 2. Deploy da Função (Nova tentativa)
    try {
        console.log('Lendo arquivo de código...');
        const buffer = fs.readFileSync('function.tar.gz');
        console.log('Iniciando upload para send-newsletter...');

        const deployment = await functions.createDeployment(
            'send-newsletter',
            'src/main.js',
            InputFile.fromBuffer(buffer, 'function.tar.gz'),
            true, // Activate
            'npm install' // Install command
        );
        console.log('DEPLOY REALIZADO COM SUCESSO! ID:', deployment.$id);
    } catch (e) {
        console.error('ERRO NO DEPLOY FINAL:', e.message);
    }
}

finalTouch();
