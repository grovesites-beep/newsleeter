'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function NewCampaignPage() {
    const [step, setStep] = useState('settings');
    const [campaign, setCampaign] = useState({
        name: '',
        subject: '',
        sender: '',
        segment: '',
        content: ''
    });

    const handleSave = () => {
        toast.success('Campanha salva como rascunho!');
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nova Campanha</h1>
                    <p className="text-muted-foreground">Configure os detalhes e o conteúdo da sua mensagem.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Rascunho
                    </Button>
                    <Button>
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
                                        value={campaign.segment}
                                        onValueChange={(v) => setCampaign({ ...campaign, segment: v })}
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
                    <Card className="border-none shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Layout className="h-5 w-5 text-primary" />
                                    <CardTitle>Editor de Conteúdo</CardTitle>
                                </div>
                                <CardDescription>Crie o visual do seu e-mail.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Type className="mr-2 h-4 w-4" />
                                    Texto Simples
                                </Button>
                                <Button variant="outline" size="sm">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Templates
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="min-h-[400px]">
                            <div className="rounded-lg border bg-muted/10 p-4">
                                <textarea
                                    className="min-h-[350px] w-full resize-none border-none bg-transparent focus:ring-0"
                                    placeholder="Escreva seu e-mail aqui ou use um template..."
                                    value={campaign.content}
                                    onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t bg-muted/5 px-6 py-4">
                            <Button variant="ghost" onClick={() => setStep('settings')}>Voltar</Button>
                            <Button onClick={() => setStep('preview')}>Revisar e Enviar</Button>
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
