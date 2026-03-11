'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dbService, Segment } from '@/services/database/dbService';
import { Plus, Users, Filter, MoreVertical, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

export default function SegmentsPage() {
    const [segments, setSegments] = useState<Segment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSegments();
    }, []);

    const loadSegments = async () => {
        try {
            const response = await dbService.getSegments();
            setSegments(response.documents);
        } catch (error) {
            console.error('Error fetching segments:', error);
            toast.error('Erro ao carregar segmentos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Segmentos</h1>
                    <p className="text-muted-foreground">Filtre seus contatos de forma inteligente para envios focados.</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/dashboard/segmentos/novo">
                        <Plus className="h-4 w-4" />
                        Novo Segmento
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : segments.length === 0 ? (
                <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
                    <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle>Nenhum segmento criado</CardTitle>
                    <CardDescription className="max-w-xs mt-2">
                        Crie filtros dinâmicos baseados em tags, comportamento ou campos personalizados.
                    </CardDescription>
                    <Button asChild variant="outline" className="mt-6">
                        <Link href="/dashboard/segmentos/novo">Criar meu primeiro segmento</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {segments.map((segment) => (
                        <Card key={segment.$id} className="border-none shadow-md overflow-hidden hover:ring-1 hover:ring-primary/20 transition-all">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2">
                                                <Edit className="h-4 w-4" /> Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 text-destructive">
                                                <Trash2 className="h-4 w-4" /> Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardTitle className="mt-4">{segment.name}</CardTitle>
                                <CardDescription>{segment.description || 'Sem descrição.'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Filter className="h-3 w-3" />
                                        <span className="font-medium">Regras:</span>
                                    </div>
                                    <div className="bg-muted/30 p-2 rounded text-[10px] font-mono whitespace-pre-wrap">
                                        {segment.rules}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-muted/5 flex justify-between px-6 py-3">
                                <span className="text-xs text-muted-foreground font-medium">Filtro Ativo</span>
                                <Button variant="link" size="sm" className="h-auto p-0 text-primary">Ver Contatos</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
