'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, ArrowLeft, Layout, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { dbService } from '@/services/database/dbService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewTemplatePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [template, setTemplate] = useState({
        name: '',
        description: '',
        content: ''
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!template.name || !template.content) {
            toast.error('Preencha o nome e o conteúdo do modelo.');
            return;
        }

        setLoading(true);
        try {
            await dbService.createTemplate({
                name: template.name,
                description: template.description,
                content: template.content
            });
            toast.success('Modelo criado com sucesso!');
            router.push('/dashboard/modelos');
        } catch (error) {
            toast.error('Erro ao salvar modelo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/modelos">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Novo Modelo</h1>
                    <p className="text-muted-foreground">Crie um design reutilizável para suas futuras campanhas.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid gap-6">
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <CardTitle>Identificação</CardTitle>
                        </div>
                        <CardDescription>Como você identificará este modelo na sua lista.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Modelo</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Newsletter Semanal V1"
                                value={template.name}
                                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição Curta (Opcional)</Label>
                            <Input
                                id="description"
                                placeholder="Ex: Template focado em notícias com imagens grandes"
                                value={template.description}
                                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md overflow-hidden">
                    <CardHeader className="border-b pb-4">
                        <div className="flex items-center gap-2">
                            <Layout className="h-5 w-5 text-primary" />
                            <CardTitle>Conteúdo HTML</CardTitle>
                        </div>
                        <CardDescription>Insira o código HTML estrutural do seu e-mail.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
                            {/* Editor */}
                            <div className="border-r">
                                <textarea
                                    className="w-full h-full p-6 resize-none border-none bg-transparent focus:ring-0 font-mono text-sm"
                                    placeholder="<div><h1>Olá {{nome}}</h1>...</div>"
                                    value={template.content}
                                    onChange={(e) => setTemplate({ ...template, content: e.target.value })}
                                    required
                                />
                            </div>
                            {/* Preview */}
                            <div className="bg-muted/5 p-6">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Preview do design</p>
                                <div className="rounded-lg border bg-white p-6 shadow-inner min-h-[300px]">
                                    <div
                                        className="prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: template.content || '<p class="text-muted-foreground italic">O conteúdo aparecerá aqui...</p>' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t bg-muted/5 p-4">
                        <Button type="submit" disabled={loading} className="gap-2">
                            <Save className="h-4 w-4" />
                            {loading ? 'Salvando...' : 'Salvar Modelo'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
