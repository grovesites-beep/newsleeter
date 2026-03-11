'use client';

import { useState, useEffect } from 'react';
import { dbService, Segment } from '@/services/database/dbService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Filter,
    Plus,
    MoreVertical,
    Users,
    Layers,
    Trash2,
    Edit3
} from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function SegmentsPage() {
    const [segments, setSegments] = useState<Segment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSegments();
    }, []);

    const loadSegments = async () => {
        setLoading(true);
        try {
            const response = await dbService.getSegments();
            setSegments(response.documents);
        } catch (error) {
            console.error('Falha ao carregar segmentos:', error);
            // Non-blocking toast
            toast.info('Nenhum segmento encontrado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Segmentos</h1>
                    <p className="text-muted-foreground">
                        Crie grupos dinâmicos de contatos baseados em tags, comportamento e atributos.
                    </p>
                </div>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Segmento
                </Button>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse border-none shadow-sm">
                            <CardHeader className="h-24 bg-muted/50"></CardHeader>
                            <CardContent className="h-20 bg-muted/20"></CardContent>
                        </Card>
                    ))}
                </div>
            ) : segments.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                    <div className="rounded-full bg-primary/10 p-4 text-primary">
                        <Layers className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Nenhum segmento ainda</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                        Comece criando um segmento para enviar campanhas segmentadas e personalizadas.
                    </p>
                    <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar primeiro segmento
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {segments.map((segment) => (
                        <Card key={segment.$id} className="border-none shadow-md transition-all hover:shadow-lg">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">{segment.name}</CardTitle>
                                    <CardDescription>{segment.description || 'Sem descrição'}</CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Edit3 className="mr-2 h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>Calculando contatos...</span>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-muted/5 py-3">
                                <Button variant="link" className="h-auto p-0 text-xs font-medium" asChild>
                                    <Link href={`/dashboard/contacts?segment=${segment.$id}`}>
                                        Ver contatos deste segmento
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

// Fixed missing import for Link
import Link from 'next/link';
