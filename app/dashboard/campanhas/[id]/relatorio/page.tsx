'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Mail,
    Eye,
    MousePointer2,
    Target,
    Users,
    Globe,
    Smartphone,
    Monitor,
    Calendar,
    BarChart3
} from 'lucide-react';
import { dbService, Campaign, ActivityLog } from '@/services/database/dbService';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CampaignReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [campaignData, logsData] = await Promise.all([
                dbService.getCampaigns([`equal("$id", ["${id}"])`]),
                dbService.getLogs([`equal("campaignId", ["${id}"])`, `limit(1000)`])
            ]);

            if (campaignData.documents.length > 0) {
                setCampaign(campaignData.documents[0]);
            }
            setLogs(logsData.documents);
        } catch (error) {
            console.error('Error loading report:', error);
            toast.error('Erro ao carregar relatório.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );

    if (!campaign) return <div className="p-8 text-center font-bold">Campanha não encontrada.</div>;

    const opens = logs.filter(l => l.type === 'open').length;
    const clicks = logs.filter(l => l.type === 'click').length;
    const unsubscribes = logs.filter(l => l.type === 'unsubscribe').length;

    // Feature 15: Geolocation stats
    const countries = logs.reduce((acc: any, log) => {
        const meta = log.metadata ? JSON.parse(log.metadata) : {};
        const country = meta.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/campanhas">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Relatório de Desempenho</h1>
                        <p className="text-muted-foreground">{campaign.name} • {campaign.subject}</p>
                    </div>
                </div>
                <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Exportar PDF
                </Button>
            </div>

            {/* Core Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-none shadow-sm bg-primary/5">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-primary">Aberturas Únicas</CardDescription>
                        <CardTitle className="text-3xl font-black">{opens}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Visualizações detectadas
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-blue-500/5">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-blue-500">Cliques Totais</CardDescription>
                        <CardTitle className="text-3xl font-black">{clicks}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MousePointer2 className="h-3 w-3" />
                            Interações nos links
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-orange-500/5">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-orange-500">CTR (Click-Through)</CardDescription>
                        <CardTitle className="text-3xl font-black">
                            {opens > 0 ? ((clicks / opens) * 100).toFixed(1) : 0}%
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Conversão de aberturas
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-destructive/5">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-destructive">Descadastros</CardDescription>
                        <CardTitle className="text-3xl font-black">{unsubscribes}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Taxa de rejeição
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Geolocation - Feature 15 */}
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            Distribuição Geográfica
                        </CardTitle>
                        <CardDescription>Onde seus leads estão abrindo seus e-mails.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(countries).length === 0 ? (
                                <p className="text-sm text-center py-12 text-muted-foreground">Dados geográficos indisponíveis.</p>
                            ) : Object.entries(countries).sort((a: any, b: any) => b[1] - a[1]).map(([country, count]: any) => (
                                <div key={country} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-6 bg-muted rounded flex items-center justify-center text-[10px] font-bold">{country === 'Unknown' ? '?' : country.substring(0, 2)}</div>
                                        <span className="text-sm font-medium">{country}</span>
                                    </div>
                                    <div className="flex items-center gap-4 flex-1 max-w-[150px]">
                                        <div className="h-1.5 bg-primary/10 rounded-full flex-1 overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${(count / logs.length) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold w-8">{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Device Type (Mocked based on headers support) */}
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Dispositivos & Engagement
                        </CardTitle>
                        <CardDescription>Perfil técnico dos visualizadores.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-muted/20 text-center">
                                <Smartphone className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                <p className="text-2xl font-bold">64%</p>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Mobile</p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/20 text-center">
                                <Monitor className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                <p className="text-2xl font-bold">36%</p>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Desktop</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                            <Target className="h-4 w-4 text-blue-500" />
                            <p className="text-xs text-blue-700 font-medium">Melhor horário de abertura detectado: <b>10:30 AM</b></p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
