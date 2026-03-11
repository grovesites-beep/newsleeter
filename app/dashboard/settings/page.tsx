'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
    Settings,
    Globe,
    Mail,
    ShieldCheck,
    Bell,
    Save,
    ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Configurações salvas com sucesso!');
        }, 1000);
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground">Gerencie as preferências da sua plataforma e domínios de envio.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="general" className="data-[state=active]:bg-background">Geral</TabsTrigger>
                    <TabsTrigger value="domains" className="data-[state=active]:bg-background">Domínios</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-background">Segurança</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-background">Notificações</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-primary" />
                                <CardTitle>Informações da Conta</CardTitle>
                            </div>
                            <CardDescription>Configure como você aparece para seus contatos.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="org-name">Nome da Organização</Label>
                                    <Input id="org-name" placeholder="Newsletter Grove Ltda" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reply-to">E-mail para Resposta</Label>
                                    <Input id="reply-to" placeholder="suporte@seu-dominio.com.br" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Fuso Horário</Label>
                                <Input id="timezone" defaultValue="America/Sao_Paulo (GMT-03:00)" disabled />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                <CardTitle>Limites de Envio</CardTitle>
                            </div>
                            <CardDescription>Monitore seus limites atuais conforme seu plano.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Envios Mensais</span>
                                    <span className="font-semibold">2,500 / 50,000</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                    <div className="h-full bg-primary w-[5%]" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Seu plano atual é o <strong>Profissional</strong>. Os limites são resetados todo dia 01.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="domains">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                <CardTitle>Domínios Verificados</CardTitle>
                            </div>
                            <CardDescription>Configure o DNS para garantir a entregabilidade dos seus e-mails.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <Globe className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">newsletter.grovehost.com.br</p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/20">Ativo</Badge>
                                            <span className="text-xs text-muted-foreground underline cursor-pointer">Ver DNS</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    Configurar
                                </Button>
                            </div>
                            <Button variant="outline" className="w-full border-dashed">
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Novo Domínio
                            </Button>
                        </CardContent>
                        <CardFooter className="bg-muted/5 border-t px-6 py-4">
                            <p className="text-xs text-muted-foreground flex items-center">
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Saiba como configurar SPF, DKIM e DMARC na nossa documentação.
                            </p>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                <CardTitle>Preferências de Notificação</CardTitle>
                            </div>
                            <CardDescription>Escolha como você quer ser avisado sobre suas campanhas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Relatório Semanal</Label>
                                    <p className="text-sm text-muted-foreground">Receba um resumo de performance toda segunda-feira.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Alertas de Bounce</Label>
                                    <p className="text-sm text-muted-foreground">Seja avisado quando uma taxa de rejeição estiver alta.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline">Descartar</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            </Tabs>
        </div>
    );
}

import { Plus } from 'lucide-react';
