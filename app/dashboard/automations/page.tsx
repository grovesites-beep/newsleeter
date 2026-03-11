'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Play,
    Pause,
    Mail,
    Zap,
    Clock,
    UserPlus,
    Tag,
    MoreVertical,
    ChevronRight,
    Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const mockAutomations = [
    {
        id: '1',
        name: 'Boas-vindas (Novos Inscritos)',
        status: 'active',
        trigger: 'Novo Contato Adicionado',
        steps: 3,
        stats: { sent: 1240, completion: '92%' },
        updatedAt: '2 horas atrás'
    },
    {
        id: '2',
        name: 'Recuperação de Carrinho',
        status: 'paused',
        trigger: 'Tag "carrinho_abandonado" adicionada',
        steps: 2,
        stats: { sent: 450, completion: '15%' },
        updatedAt: '1 dia atrás'
    },
    {
        id: '3',
        name: 'Nutrição de Leads - Funil Topo',
        status: 'active',
        trigger: 'Entrou no Segmento "Interesse SaaS"',
        steps: 5,
        stats: { sent: 3200, completion: '68%' },
        updatedAt: '3 dias atrás'
    }
];

export default function AutomationsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Automações</h1>
                    <p className="text-muted-foreground">Crie fluxos de e-mail automáticos baseados em comportamentos.</p>
                </div>
                <Button className="rounded-full shadow-lg gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Automação
                </Button>
            </div>

            <div className="flex items-center gap-4 py-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar automações..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {mockAutomations.map((automation) => (
                    <Card key={automation.id} className="border-none shadow-md hover:shadow-lg transition-all group">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row items-stretch md:items-center p-6 gap-6">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${automation.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg">{automation.name}</h3>
                                            <Badge variant={automation.status === 'active' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                                                {automation.status === 'active' ? 'Ativa' : 'Pausada'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Zap className="h-3 w-3" /> {automation.trigger}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {automation.steps} passos
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:border-l md:pl-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Enviados</p>
                                        <p className="text-lg font-bold">{automation.stats.sent.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Conclusão</p>
                                        <p className="text-lg font-bold text-green-500">{automation.stats.completion}</p>
                                    </div>
                                    <div className="hidden lg:block space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Atualizada</p>
                                        <p className="text-sm font-medium">{automation.updatedAt}</p>
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            {automation.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-full">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Editar Fluxo</DropdownMenuItem>
                                                <DropdownMenuItem>Ver Relatórios</DropdownMenuItem>
                                                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State / Creation Hint */}
            <div className="mt-12 p-8 rounded-3xl border border-dashed border-primary/20 bg-primary/5 flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-primary" />
                </div>
                <div className="max-w-md">
                    <h3 className="text-xl font-bold">Inicie um fluxo inteligente</h3>
                    <p className="text-muted-foreground text-sm">
                        Economize tempo automatizando tarefas repetitivas. Envie boas-vindas para novos inscritos ou recupere leads inativos automaticamente.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/10">
                        <Clock className="mr-2 h-4 w-4" />
                        Agendar Drip
                    </Button>
                    <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/10">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Fluxo de Onboarding
                    </Button>
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
