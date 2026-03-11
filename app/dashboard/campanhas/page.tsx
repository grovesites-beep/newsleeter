'use client';

import { useState, useEffect, useMemo } from 'react';
import { dbService, Campaign } from '@/services/database/dbService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Search,
    Mail,
    MoreVertical,
    Send,
    FileText,
    BarChart3,
    Calendar,
    Filter,
    ArrowUpRight,
    MousePointer2,
    Eye
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            const data = await dbService.getCampaigns();
            setCampaigns(data.documents);
        } catch (error) {
            console.error('Erro ao carregar campanhas:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCampaigns = campaigns.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = useMemo(() => {
        const sent = campaigns.filter(c => c.status === 'sent');
        const totalSentCount = sent.length;

        let totalOpens = 0;
        let totalClicks = 0;
        let totalDelivered = 0;

        sent.forEach(c => {
            const s = typeof c.stats === 'string' ? JSON.parse(c.stats) : c.stats;
            if (s) {
                totalOpens += s.opens || 0;
                totalClicks += s.clicks || 0;
                totalDelivered += s.delivered || 0;
            }
        });

        const avgOpenRate = totalDelivered > 0 ? (totalOpens / totalDelivered) * 100 : 0;
        const avgClickRate = totalOpens > 0 ? (totalClicks / totalOpens) * 100 : 0;

        return {
            totalSent: totalSentCount,
            avgOpenRate: avgOpenRate.toFixed(1) + '%',
            avgClickRate: avgClickRate.toFixed(1) + '%'
        };
    }, [campaigns]);

    const getStatusBadge = (status: Campaign['status']) => {
        switch (status) {
            case 'sent':
                return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">Enviada</Badge>;
            case 'sending':
                return <Badge className="bg-blue-500/10 text-blue-500 animate-pulse border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">Enviando</Badge>;
            case 'scheduled':
                return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">Agendada</Badge>;
            case 'draft':
                return <Badge variant="secondary" className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">Rascunho</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campanhas</h1>
                    <p className="text-muted-foreground">
                        Gerencie seus envios, rascunhos e analise o desempenho.
                    </p>
                </div>
                <Button asChild className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
                    <Link href="/dashboard/campanhas/nova">
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Campanha
                    </Link>
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-none bg-gradient-to-br from-primary/5 to-transparent shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between space-x-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Enviadas</p>
                                <h3 className="text-3xl font-bold mt-1">{stats.totalSent}</h3>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                <Send className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-gradient-to-br from-blue-500/5 to-transparent shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between space-x-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Média de Abertura</p>
                                <h3 className="text-3xl font-bold mt-1">{stats.avgOpenRate}</h3>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                                <Eye className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-gradient-to-br from-green-500/5 to-transparent shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between space-x-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Média de Cliques</p>
                                <h3 className="text-3xl font-bold mt-1">{stats.avgClickRate}</h3>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
                                <MousePointer2 className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Campaign List */}
            <Card className="border-none shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/50 pb-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome ou assunto..."
                                className="pl-10 h-10 bg-background"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-10">
                                <Filter className="mr-2 h-4 w-4" />
                                Filtros
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : filteredCampaigns.length > 0 ? (
                        <div className="divide-y relative">
                            {filteredCampaigns.map((campaign) => (
                                <div
                                    key={campaign.$id}
                                    className="group flex flex-col gap-4 p-6 transition-all hover:bg-muted/30 md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "mt-1 rounded-xl p-3 shadow-sm",
                                            campaign.status === 'sent' ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                                        )}>
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{campaign.name}</h4>
                                                {getStatusBadge(campaign.status)}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1 italic">"{campaign.subject}"</p>
                                            <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {campaign.sentDate
                                                        ? format(new Date(campaign.sentDate), "dd 'de' MMM, HH:mm", { locale: ptBR })
                                                        : 'Criado em ' + format(new Date(campaign.$createdAt), "dd/MM/yyyy")
                                                    }
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                <span>Remetente: {campaign.sender}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-8 md:justify-end">
                                        {campaign.status === 'sent' && campaign.stats && (() => {
                                            const s = typeof campaign.stats === 'string' ? JSON.parse(campaign.stats) : campaign.stats;
                                            return (
                                                <div className="flex gap-6">
                                                    <div className="text-center group-hover:scale-105 transition-transform">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Abertos</p>
                                                        <p className="text-sm font-extrabold">{s.opens || 0}</p>
                                                    </div>
                                                    <div className="text-center group-hover:scale-105 transition-transform delay-75">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cliques</p>
                                                        <p className="text-sm font-extrabold">{s.clicks || 0}</p>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full group-hover:bg-background shadow-none transition-all" asChild>
                                                <Link href={`/dashboard/campanhas/${campaign.$id}/relatorio`}>
                                                    <BarChart3 className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full group-hover:bg-background shadow-none transition-all">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" /> Visualizar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <FileText className="mr-2 h-4 w-4" /> Duplicar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive cursor-pointer">
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="bg-muted p-6 rounded-full mb-4">
                                <Mail className="h-12 w-12 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-xl font-bold">Nenhuma campanha encontrada</h3>
                            <p className="max-w-xs text-muted-foreground mt-2">
                                Você ainda não criou nenhuma campanha ou sua busca não retornou resultados.
                            </p>
                            <Button asChild className="mt-6" variant="outline">
                                <Link href="/dashboard/campanhas/nova">Criar minha primeira campanha</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
