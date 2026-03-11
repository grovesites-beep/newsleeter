'use client';

import { useState } from 'react';
import {
    History,
    Mail,
    MousePointer2,
    UserMinus,
    Rocket,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    PlayCircle,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const mockLogs = [
    {
        id: '1',
        type: 'open',
        contact: 'ana.silva@exemplo.com.br',
        campaign: 'Newsletter de Março 2024',
        timestamp: 'há 2 minutos',
        icon: Mail,
        color: 'text-blue-500 bg-blue-500/10'
    },
    {
        id: '2',
        type: 'click',
        contact: 'carlos@dominio.com',
        campaign: 'Promoção Relâmpago',
        timestamp: 'há 15 minutos',
        icon: MousePointer2,
        color: 'text-green-500 bg-green-500/10'
    },
    {
        id: '3',
        type: 'unsubscribe',
        contact: 'jonathan.doe@gmail.com',
        campaign: 'Newsletter Semanal',
        timestamp: 'há 1 hora',
        icon: UserMinus,
        color: 'text-red-500 bg-red-500/10'
    },
    {
        id: '4',
        type: 'campaign_start',
        contact: '',
        campaign: 'Lançamento Produto X',
        timestamp: 'há 3 horas',
        icon: Rocket,
        color: 'text-purple-500 bg-purple-500/10'
    },
    {
        id: '5',
        type: 'campaign_end',
        contact: '',
        campaign: 'Oferta de Carnaval',
        timestamp: 'há 5 horas',
        icon: CheckCircle2,
        color: 'text-emerald-500 bg-emerald-500/10'
    }
];

export default function LogsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gradient-text">Rastro de Atividade</h1>
                    <p className="text-muted-foreground">Monitore cada interação em tempo real através da rede.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-full gap-2">
                        <Filter className="h-4 w-4" />
                        Filtrar
                    </Button>
                    <Button variant="outline" className="rounded-full gap-2">
                        Exportar Logs
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-none shadow-md glass">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Aberturas (24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,452</div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +15.2%
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md glass">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cliques (24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">384</div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +8.4%
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md glass">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Desinscrições</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <div className="flex items-center text-xs text-red-500 mt-1">
                            <ArrowDownRight className="h-3 w-3 mr-1" /> -2.1%
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md glass">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Eventos Totais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5,890</div>
                        <div className="flex items-center text-xs text-blue-500 mt-1">
                            Processando live...
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-xl glass overflow-hidden">
                <CardHeader className="border-b bg-muted/5 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-primary" />
                        Log de Eventos em Tempo Real
                    </CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar evento..." className="pl-10 h-8 text-xs rounded-full border-primary/20 bg-background/50 focus-visible:bg-background" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                        {mockLogs.map((log) => (
                            <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border shadow-sm ${log.color}`}>
                                        <log.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <p className="text-sm font-semibold">
                                                {log.type === 'open' && 'E-mail aberto por '}
                                                {log.type === 'click' && 'Link clicado por '}
                                                {log.type === 'unsubscribe' && 'Desinscrição de '}
                                                {log.type === 'campaign_start' && 'Campanha iniciada: '}
                                                {log.type === 'campaign_end' && 'Campanha finalizada: '}
                                                <span className="text-primary">{log.contact || log.campaign}</span>
                                            </p>
                                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full">
                                                {log.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {log.contact ? `Campanha: ${log.campaign}` : 'Processamento do sistema concluído com sucesso.'}
                                        </p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="sm" className="h-8 text-[11px] rounded-full">
                                            Detalhes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
