'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Users,
    Mail,
    MousePointer2,
    Eye,
    UserMinus,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stats = [
    { name: 'Total de Contatos', value: '0', icon: Users, description: 'Leads ativos na base' },
    { name: 'Campanhas Enviadas', value: '0', icon: Mail, description: 'No total acumulado' },
    { name: 'Taxa de Abertura', value: '0%', icon: Eye, description: 'Média global' },
    { name: 'Taxa de Clique', value: '0%', icon: MousePointer2, description: 'Média global' },
];

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Olá, {user?.name?.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground">
                        Aqui está o que está acontecendo com sua newsletter hoje.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline">
                        <Link href="/campaigns/new">Agendar Campanha</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/campaigns/new">Nova Campanha</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Performance das Campanhas</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-[300px] items-center justify-center border-t text-muted-foreground">
                        Gráficos serão exibidos aqui (Magic UI Charts)
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Campanhas Agendadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Calendar className="mb-4 h-12 w-12 text-muted-foreground/20" />
                            <h3 className="font-semibold text-muted-foreground">Nenhuma campanha agendada</h3>
                            <p className="text-sm text-muted-foreground">Suas próximas sessões aparecerão aqui.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
