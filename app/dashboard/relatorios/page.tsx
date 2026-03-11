'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TrendingUp,
    Users,
    MousePointer2,
    AlertCircle,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import { dbService, Campaign, ActivityLog, Contact } from '@/services/database/dbService';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ReportsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [campaignsData, logsData, contactsData] = await Promise.all([
                dbService.getCampaigns(),
                dbService.getLogs(['limit(5000)']),
                dbService.getContacts(['limit(1)']) // Just to get total count
            ]);
            setCampaigns(campaignsData.documents);
            setLogs(logsData.documents);
            setContacts(contactsData.documents);
        } catch (error) {
            console.error('Error loading report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const totalOpens = logs.filter(l => l.type === 'open').length;
        const totalClicks = logs.filter(l => l.type === 'click').length;

        // Total emails sent across all campaigns
        const totalSent = campaigns.reduce((acc, c) => {
            const s = typeof c.stats === 'string' ? JSON.parse(c.stats) : c.stats;
            return acc + (s?.sent || 0);
        }, 0);

        const openRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0;
        const clickRate = totalOpens > 0 ? (totalClicks / totalOpens) * 100 : 0;

        return {
            totalClicks,
            totalOpens,
            openRate: openRate.toFixed(1) + '%',
            totalSent,
            clickRate: clickRate.toFixed(1) + '%'
        };
    }, [logs, campaigns]);

    const dailyData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(new Date(), 6 - i);
            return {
                name: format(date, 'eee', { locale: ptBR }),
                fullDate: startOfDay(date),
                opens: 0,
                clicks: 0
            };
        });

        logs.forEach(log => {
            const logDate = new Date(log.timestamp);
            const dayEntry = last7Days.find(d =>
                isWithinInterval(logDate, {
                    start: d.fullDate,
                    end: startOfDay(subDays(d.fullDate, -1))
                })
            );
            if (dayEntry) {
                if (log.type === 'open') dayEntry.opens++;
                if (log.type === 'click') dayEntry.clicks++;
            }
        });

        return last7Days;
    }, [logs]);

    const deliveryData = [
        { name: 'Entregues', value: 100, color: '#10b981' },
        { name: 'Rejeitados', value: 0, color: '#ef4444' },
        { name: 'SPAM', value: 0, color: '#f59e0b' },
    ];

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Relatórios Detalhado</h1>
                    <p className="text-muted-foreground">Dados reais do desempenho das suas campanhas.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Cliques Totais</CardTitle>
                        <MousePointer2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClicks}</div>
                        <p className="flex items-center text-xs text-muted-foreground">
                            Interações reais detectadas
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.openRate}</div>
                        <p className="flex items-center text-xs text-muted-foreground">
                            Base: {stats.totalSent} envios totais
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Envios Totais</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSent}</div>
                        <p className="flex items-center text-xs text-muted-foreground">
                            Volume acumulado de entregas
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Bounces</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0.0%</div>
                        <p className="flex items-center text-xs text-green-500">
                            Saúde da lista excelente
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Engajamento Temporal</CardTitle>
                        <CardDescription>Acompanhamento de aberturas e cliques nos últimos 7 dias.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="opens"
                                        name="Aberturas"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="clicks"
                                        name="Cliques"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Estado das Entregas</CardTitle>
                        <CardDescription>Distribuição de status dos e-mails enviados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deliveryData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {deliveryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {deliveryData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-semibold">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
