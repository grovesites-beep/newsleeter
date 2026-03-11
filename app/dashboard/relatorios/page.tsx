'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart3,
    TrendingUp,
    Users,
    Mail,
    MousePointer2,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const dailyData = [
    { name: 'Seg', opens: 400, clicks: 240 },
    { name: 'Ter', opens: 300, clicks: 139 },
    { name: 'Qua', opens: 200, clicks: 980 },
    { name: 'Qui', opens: 278, clicks: 390 },
    { name: 'Sex', opens: 189, clicks: 480 },
    { name: 'Sáb', opens: 239, clicks: 380 },
    { name: 'Dom', opens: 349, clicks: 430 },
];

const categoryData = [
    { name: 'Entregues', value: 98.2, color: '#10b981' },
    { name: 'Rejeitados', value: 1.1, color: '#ef4444' },
    { name: 'SPAM', value: 0.7, color: '#f59e0b' },
];

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Relatórios Detalhados</h1>
                    <p className="text-muted-foreground">Analise o desempenho de todas as suas campanhas de e-mail.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Cliques Totais</CardTitle>
                        <MousePointer2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,234</div>
                        <p className="flex items-center text-xs text-green-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            +12% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Aberturas Únicas</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45.8%</div>
                        <p className="flex items-center text-xs text-green-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            +5.4% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Novos Inscritos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="flex items-center text-xs text-red-500">
                            <ArrowDownRight className="mr-1 h-3 w-3" />
                            -2% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Bounces</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0.8%</div>
                        <p className="flex items-center text-xs text-muted-foreground text-green-500">
                            Dentro da média recomendada
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
                                        data={categoryData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {categoryData.map((item) => (
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
