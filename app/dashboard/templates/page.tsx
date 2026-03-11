'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Plus,
    FileText,
    MoreHorizontal,
    Trash2,
    Edit,
    Copy,
    Eye
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const mockTemplates = [
    { id: '1', name: 'Newsletter Semanal', description: 'Template clássico para notícias e atualizações.', category: 'Informativo' },
    { id: '2', name: 'Promoção Relâmpago', description: 'Landing page direta focada em conversão.', category: 'Vendas' },
    { id: '3', name: 'Comunicado Oficial', description: 'Design clean para anúncios importantes.', category: 'Corporativo' },
];

export default function TemplatesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
                    <p className="text-muted-foreground">
                        Crie e gerencie modelos reutilizáveis para suas campanhas.
                    </p>
                </div>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Template
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockTemplates.map((template) => (
                    <Card key={template.id} className="group relative border-none shadow-md transition-all hover:shadow-lg">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <Badge variant="secondary" className="mb-2">{template.category}</Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Duplicar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="text-xl">{template.name}</CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-[4/5] w-full rounded-md bg-muted/20 flex items-center justify-center border border-dashed text-muted-foreground group-hover:bg-muted/30 transition-colors">
                                <FileText className="h-12 w-12 opacity-20" />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/5 py-3 flex justify-between">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/dashboard/templates/preview/${template.id}`}>
                                    <Eye className="mr-2 h-3 w-3" />
                                    Visualizar
                                </Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href={`/dashboard/campaigns/new?template=${template.id}`}>
                                    Usar Template
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
