'use client';

import { useState } from 'react';
import {
    Users,
    UserPlus,
    MoreVertical,
    Shield,
    Mail,
    CheckCircle2,
    Clock,
    Search,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const mockUsers = [
    {
        id: '1',
        name: 'Nei Espíndola',
        email: 'nei@grovehub.com.br',
        role: 'admin',
        status: 'active',
        avatar: '',
        joinedAt: '12 de Jan, 2024'
    },
    {
        id: '2',
        name: 'Ana Silva',
        email: 'ana.silva@exemplo.com.br',
        role: 'editor',
        status: 'active',
        avatar: '',
        joinedAt: '05 de Fev, 2024'
    },
    {
        id: '3',
        name: 'Carlos Oliveira',
        email: 'carlos@exemplo.com.br',
        role: 'viewer',
        status: 'pending',
        avatar: '',
        joinedAt: 'Pendente'
    }
];

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-primary hover:bg-primary/90">Administrador</Badge>;
            case 'editor':
                return <Badge variant="secondary">Editor</Badge>;
            default:
                return <Badge variant="outline">Visualizador</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        return status === 'active' ? (
            <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5 gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ativo
            </Badge>
        ) : (
            <Badge variant="outline" className="text-yellow-500 border-yellow-500/20 bg-yellow-500/5 gap-1">
                <Clock className="h-3 w-3" /> Pendente
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
                    <p className="text-muted-foreground">Gerencie os membros da sua equipe e suas permissões de acesso.</p>
                </div>
                <Button className="rounded-full shadow-lg gap-2">
                    <UserPlus className="h-4 w-4" />
                    Convidar Membro
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Ativos no sistema</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Convites Pendentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Aguardando aceitação</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Vagas no Plano</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground">De 10 assentos totais</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="border-b bg-muted/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg">Membros da Equipe</CardTitle>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar membro..."
                                className="pl-10 h-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent bg-muted/5">
                                <TableHead className="w-[300px]">Membro</TableHead>
                                <TableHead>Cargo</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Entrou em</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUsers.map((member) => (
                                <TableRow key={member.id} className="group transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border">
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{member.name}</span>
                                                <span className="text-xs text-muted-foreground">{member.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getRoleBadge(member.role)}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(member.status)}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {member.joinedAt}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-full">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuItem className="gap-2">
                                                    <Shield className="h-4 w-4" /> Alterar Cargo
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">
                                                    <Mail className="h-4 w-4" /> Reenviar Convite
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 text-destructive">
                                                    <Trash2 className="h-4 w-4" /> Remover Acesso
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
