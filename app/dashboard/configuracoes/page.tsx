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
    Plus,
    Save,
    ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Configurações salvas com sucesso!');
        }, 1000);
    };

    const handleVerifyDNS = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            toast.success('Domínio verificado com sucesso!');
        }, 2000);
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

                {/* General & Domains TabsContent */}
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
                            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <Globe className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">newsletter.grovehost.com.br</p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] text-green-600 border-green-500/20 bg-green-500/5">Verificado</Badge>
                                        </div>
                                    </div>
                                </div>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-full">
                                            Ver DNS
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="sm:max-w-xl overflow-y-auto">
                                        <SheetHeader className="pb-6">
                                            <SheetTitle>Configuração de DNS</SheetTitle>
                                            <SheetDescription>
                                                Adicione estes registros ao seu provedor de DNS (Cloudflare, GoDaddy, etc) para ativar o envio.
                                            </SheetDescription>
                                        </SheetHeader>

                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold flex items-center gap-2">
                                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                                    Registros SPF/DKIM
                                                </h4>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="hover:bg-transparent">
                                                            <TableHead>Tipo</TableHead>
                                                            <TableHead>Host</TableHead>
                                                            <TableHead>Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell className="font-mono text-xs">TXT</TableCell>
                                                            <TableCell className="font-mono text-xs underline decoration-dotted">@</TableCell>
                                                            <TableCell><CheckCircle2 className="h-4 w-4 text-green-500" /></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-mono text-xs">CNAME</TableCell>
                                                            <TableCell className="font-mono text-xs underline decoration-dotted">resend._domainkey</TableCell>
                                                            <TableCell><CheckCircle2 className="h-4 w-4 text-green-500" /></TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            <div className="p-4 rounded-xl bg-muted/30 border space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Valor DKIM</p>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toast.success('Copiado!')}>
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <code className="block text-[10px] break-all text-muted-foreground bg-background p-2 rounded border">
                                                    v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7...
                                                </code>
                                            </div>

                                            <Button
                                                className="w-full rounded-full h-12 gap-2"
                                                onClick={handleVerifyDNS}
                                                disabled={isVerifying}
                                            >
                                                {isVerifying ? (
                                                    <RefreshCcw className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <ShieldCheck className="h-4 w-4" />
                                                )}
                                                {isVerifying ? 'Verificando...' : 'Verificar Registros Agora'}
                                            </Button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                            <Button variant="outline" className="w-full border-dashed rounded-xl h-12 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Novo Domínio de Envio
                            </Button>
                        </CardContent>
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
            </Tabs >
        </div >
    );
}
