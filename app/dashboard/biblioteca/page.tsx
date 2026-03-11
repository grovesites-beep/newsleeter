'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Copy, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { dbService } from '@/services/database/dbService';
import { toast } from 'sonner';

export default function ImageLibraryPage() {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const response = await dbService.listFiles();
            setFiles(response.files);
        } catch (error) {
            console.error('Error loading files:', error);
            toast.error('O bucket "images" não foi encontrado. Certifique-se de criá-lo no console do Appwrite.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await dbService.uploadFile(file);
            toast.success('Imagem enviada com sucesso!');
            loadFiles();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Erro ao enviar imagem. Verifique as permissões do bucket.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (fileId: string) => {
        if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

        try {
            await dbService.deleteFile(fileId);
            toast.success('Imagem excluída.');
            setFiles(files.filter(f => f.$id !== fileId));
        } catch (error) {
            toast.error('Erro ao excluir imagem.');
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success('Link copiado para a área de transferência!');
    };

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Imagens</h1>
                    <p className="text-muted-foreground">Gerencie seus assets para usar em suas campanhas.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="relative h-10 px-4 overflow-hidden">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload de Imagem
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                placeholder="Buscar imagens pelo nome..."
                                className="w-full bg-muted/50 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-64 flex-col items-center justify-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Carregando sua galeria...</p>
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted">
                            <ImageIcon className="h-12 w-12 text-muted-foreground opacity-20" />
                            <div className="text-center">
                                <p className="font-medium">Nenhuma imagem encontrada</p>
                                <p className="text-sm text-muted-foreground">Faça upload da sua primeira imagem para começar.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredFiles.map((file) => {
                                const previewUrl = dbService.getFilePreview(file.$id);
                                return (
                                    <div key={file.$id} className="group relative bg-muted/20 rounded-xl border border-muted-foreground/10 overflow-hidden hover:shadow-lg transition-all">
                                        <div className="aspect-square w-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={previewUrl}
                                                alt={file.name}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <p className="text-xs font-medium truncate mb-2">{file.name}</p>
                                            <div className="flex justify-between gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => copyToClipboard(previewUrl)}
                                                    title="Copiar URL"
                                                >
                                                    <Copy className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(file.$id)}
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
