'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { dbService, EmailTemplate } from '@/services/database/dbService';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Send,
    Calendar,
    Eye,
    Settings2,
    FileText,
    Layout,
    Type,
    Save,
    ChevronRight,
    Plus
} from 'lucide-react';
import { toast } from 'sonner';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const templates = [
    {
        id: '1',
        name: 'Newsletter Semanal',
        content: '<h1 style="color: #6366f1;">Newsletter Semanal</h1><p>Olá {{nome}},</p><p>Aqui estão as novidades da semana:</p><ul><li>Novidade 1</li><li>Novidade 2</li></ul><p>Até a próxima!</p>'
    },
    {
        id: '2',
        name: 'Promoção Relâmpago',
        content: '<div style="background-color: #fce7f3; padding: 20px; border-radius: 10px; text-align: center;"><h1 style="color: #db2777;">OFERTA LIMITADA!</h1><p style="font-size: 18px;">Ganhe 50% de desconto usando o cupom <b>GROVE50</b></p><br/><a href="#" style="background-color: #db2777; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Aproveitar Agora</a></div>'
    }
];

export default function NewCampaignPage() {
    const router = useRouter();
    const [step, setStep] = useState('settings');
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [campaign, setCampaign] = useState({
        name: '',
        subject: '',
        sender: '',
        segmentId: '',
        content: ''
    });

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            const response = await dbService.getTemplates();
            setTemplates(response.documents);
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    };

    const handleSave = async () => {
        if (!campaign.name) {
            toast.error('Dê um nome para sua campanha.');
            return;
        }
        setLoading(true);
        try {
            await dbService.createCampaign({
                name: campaign.name,
                subject: campaign.subject,
                sender: campaign.sender,
                content: campaign.content,
                status: 'draft',
                segmentId: campaign.segmentId
            });
            toast.success('Campanha salva como rascunho!');
            router.push('/dashboard/campanhas');
        } catch (error) {
            toast.error('Erro ao salvar rascunho.');
        } finally {
            setLoading(false);
        }
    };

    const applyTemplate = (content: string) => {
        setCampaign({ ...campaign, content });
        setIsTemplateModalOpen(false);
        toast.success('Template aplicado com sucesso!');
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nova Campanha</h1>
                    <p className="text-muted-foreground">Configure os detalhes e o conteúdo da sua mensagem.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSave} disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Salvando...' : 'Salvar Rascunho'}
                    </Button>
                    <Button disabled={loading}>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Agora
                    </Button>
                </div>
            </div>

            <Tabs value={step} onValueChange={setStep} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="settings">1. Configurações</TabsTrigger>
                    <TabsTrigger value="content">2. Conteúdo</TabsTrigger>
                    <TabsTrigger value="preview">3. Revisão</TabsTrigger>
                </TabsList>

                <TabsContent value="settings">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Settings2 className="h-5 w-5 text-primary" />
                                <CardTitle>Detalhes da Campanha</CardTitle>
                            </div>
                            <CardDescription>Defina o assunto, remetente e para quem enviar.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome da Campanha (Interno)</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ex: Newsletter de Março 2024"
                                        value={campaign.name}
                                        onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Assunto do E-mail</Label>
                                    <Input
                                        id="subject"
                                        placeholder="O que o usuário verá na caixa de entrada"
                                        value={campaign.subject}
                                        onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="sender">Remetente</Label>
                                    <Select
                                        value={campaign.sender}
                                        onValueChange={(v) => setCampaign({ ...campaign, sender: v })}
                                    >
                                        <SelectTrigger id="sender">
                                            <SelectValue placeholder="Selecione o domínio de envio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">contato@grovehub.com.br</SelectItem>
                                            <SelectItem value="news">news@newsletter.grovehost.com.br</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="segment">Público (Segmento)</Label>
                                    <Select
                                        value={campaign.segmentId}
                                        onValueChange={(v) => setCampaign({ ...campaign, segmentId: v })}
                                    >
                                        <SelectTrigger id="segment">
                                            <SelectValue placeholder="Para quem enviar?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos os Contatos</SelectItem>
                                            <SelectItem value="active">Clientes Ativos</SelectItem>
                                            <SelectItem value="dev">Desenvolvedores</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end border-t bg-muted/5 px-6 py-4">
                            <Button onClick={() => setStep('content')}>
                                Próximo: Criar Conteúdo
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="content">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Layout className="h-5 w-5 text-primary" />
                                    <CardTitle>Editor de Conteúdo</CardTitle>
                                </div>
                                <CardDescription>Crie o visual do seu e-mail com suporte a HTML simples.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-full">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Templates
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Selecionar Template</DialogTitle>
                                            <DialogDescription>
                                                Escolha um ponto de partida profissional para sua campanha.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                            {templates.length === 0 ? (
                                                <div className="col-span-2 py-10 text-center text-muted-foreground">
                                                    Nenhum template encontrado. Crie um na aba Modelos.
                                                </div>
                                            ) : (
                                                templates.map((t) => (
                                                    <div
                                                        key={t.$id}
                                                        className="group cursor-pointer rounded-xl border p-4 hover:border-primary hover:bg-primary/5 transition-all"
                                                        onClick={() => applyTemplate(t.content)}
                                                    >
                                                        <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center mb-3">
                                                            <FileText className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        </div>
                                                        <h4 className="font-bold">{t.name}</h4>
                                                        <p className="text-xs text-muted-foreground">{t.description || 'Clique para aplicar este design.'}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                                {/* Editor Pane */}
                                <div className="border-r flex flex-col">
                                    <div className="flex bg-muted/20 p-2 gap-1 border-b">
                                        <Button variant="ghost" size="sm" className="h-8 px-2 font-bold" onClick={() => setCampaign({ ...campaign, content: campaign.content + '<b></b>' })}>B</Button>
                                        <Button variant="ghost" size="sm" className="h-8 px-2 italic" onClick={() => setCampaign({ ...campaign, content: campaign.content + '<i></i>' })}>I</Button>
                                        <Button variant="ghost" size="sm" className="h-8 px-2 underline" onClick={() => setCampaign({ ...campaign, content: campaign.content + '<u></u>' })}>U</Button>
                                        <div className="w-px h-6 bg-border mx-1 my-auto" />
                                        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setCampaign({ ...campaign, content: campaign.content + '<a href=""></a>' })}>link</Button>
                                    </div>
                                    <Textarea
                                        className="flex-1 w-full p-6 resize-none border-none bg-transparent focus-visible:ring-0 font-mono text-sm leading-relaxed min-h-[400px]"
                                        placeholder="Use tags HTML para formatação..."
                                        value={campaign.content}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCampaign({ ...campaign, content: e.target.value })}
                                    />
                                </div>
                                {/* Preview Pane */}
                                <div className="bg-muted/5 p-8 flex flex-col">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Preview em tempo real</p>
                                    <div className="flex-1 rounded-xl border bg-white shadow-inner p-8 dark:bg-zinc-950 overflow-auto">
                                        <div
                                            className="max-w-prose mx-auto prose prose-sm dark:prose-invert"
                                            dangerouslySetInnerHTML={{
                                                __html: campaign.content || '<p class="text-zinc-400 italic">O conteúdo aparecerá aqui...</p>'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t bg-muted/5 px-6 py-4">
                            <Button variant="ghost" onClick={() => setStep('settings')}>Voltar</Button>
                            <Button onClick={() => setStep('preview')} className="gap-2">
                                Próximo: Revisar
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="preview">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-primary" />
                                <CardTitle>Revisão Final</CardTitle>
                            </div>
                            <CardDescription>Verifique tudo antes de realizar o envio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="rounded-lg border p-4">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Assunto</dt>
                                        <dd className="mt-1 text-sm font-semibold">{campaign.subject || '(Sem assunto)'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Público Estimado</dt>
                                        <dd className="mt-1 text-sm font-semibold">1,245 inscritos</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Remetente</dt>
                                        <dd className="mt-1 text-sm font-semibold">{campaign.sender || 'contato@grovehub.com.br'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Data Agendada</dt>
                                        <dd className="mt-1 text-sm font-semibold italic text-muted-foreground">Envio Imediato</dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="rounded-lg border bg-white p-8 dark:bg-zinc-950">
                                <div className="max-w-prose mx-auto">
                                    <h2 className="text-xl font-bold mb-4">{campaign.subject}</h2>
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {campaign.content || 'Nenhum conteúdo definido ainda.'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t bg-muted/5 px-6 py-4">
                            <Button variant="ghost" onClick={() => setStep('content')}>Voltar para Edição</Button>
                            <div className="flex gap-2">
                                <Button variant="outline">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Agendar
                                </Button>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Send className="mr-2 h-4 w-4" />
                                    Confirmar Envio
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
