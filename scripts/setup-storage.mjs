import { Client, Storage, Permission, Role } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://appwrite.grovehub.com.br/v1')
    .setProject('69b19b99002f199c90e2')
    .setKey('standard_b9ffa628b053791c1eaa9f87e64ba1c554fbecd94c66958cd8884410859aa2705e08d7dc601a81fcc03063fdd0bfec34ff7c60c9c11d28d8f1a69f45973c2de8896c318616c5639b91d1dc305020fe5a73e4fcc66c6e09f67a622456a92569980c323481094c6fc6fbde4f35aa3b90f9ed2f32c0d6ef8052b14ae3d6aa43052f');

const storage = new Storage(client);

async function setupStorage() {
    console.log('Iniciando configuração do Storage...');

    const BUCKET_ID = 'images';

    try {
        // Tenta buscar o bucket para ver se já existe
        await storage.getBucket(BUCKET_ID);
        console.log(`Bucket "${BUCKET_ID}" já existe.`);
    } catch (e) {
        console.log(`Criando bucket "${BUCKET_ID}"...`);
        try {
            await storage.createBucket(
                BUCKET_ID,
                'Biblioteca de Imagens',
                [
                    Permission.read(Role.any()),      // Qualquer um pode ver as imagens (para os e-mails)
                    Permission.write(Role.users()),   // Apenas usuários logados podem subir arquivos
                    Permission.update(Role.users()),  // Apenas usuários logados podem atualizar
                    Permission.delete(Role.users()),  // Apenas usuários logados podem deletar
                ],
                false, // fileSecurity (se false, usa permissões do bucket)
                true,  // enabled
                undefined, // maximumFileSize
                ['jpg', 'png', 'gif', 'svg', 'webp', 'jpeg'], // allowedFileExtensions
                undefined, // encryption
                true, //antivirus
            );
            console.log(`Bucket "${BUCKET_ID}" criado com sucesso!`);
        } catch (err) {
            console.error('Erro ao criar bucket:', err.message);
        }
    }

    console.log('Configuração do Storage finalizada!');
}

setupStorage();
