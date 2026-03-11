'use client';

import { useState, useEffect } from 'react';
import { dbService, EmailTemplate } from '@/services/database/dbService';
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
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('all');

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            const response = await dbService.getTemplates();
            setTemplates(response.documents);
        } catch (error) {
            console.error('Falha ao carregar templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', ...Array.from(new Set(templates.map(t => t.category).filter(Boolean)))];

    const filteredTemplates = activeCategory === 'all'
        ? templates
        : templates.filter(t => t.category === activeCategory);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Modelos de E-mail</h1>
                    <p className="text-muted-foreground">
                        Crie e gerencie modelos reutilizáveis para suas campanhas.
                    </p>
                </div>
                <Button size="sm" asChild>
                    <Link href="/dashboard/modelos/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Modelo
                    </Link>
                </Button>
            </div>

            {/* Category Filter - Feature 21 */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                    <Button
                        key={cat}
                        variant={activeCategory === cat ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-full capitalize whitespace-nowrap"
                        onClick={() => setActiveCategory(cat!)}
                    >
                        {cat === 'all' ? 'Todos os Modelos' : cat}
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            ) : filteredTemplates.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTemplates.map((template) => (
                        <Card key={template.$id} className="group relative border-none shadow-md transition-all hover:shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <Badge variant="secondary" className="mb-2 uppercase text-[10px] tracking-widest font-bold">
                                        {template.category || 'Geral'}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Copy className="mr-2 h-4 w-4" />
                                                Duplicar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive cursor-pointer">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardTitle className="text-xl font-bold">{template.name}</CardTitle>
                                <CardDescription className="line-clamp-2">{template.description || 'Nenhuma descrição fornecida.'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-[4/5] w-full rounded-md bg-muted/20 flex items-center justify-center border border-dashed text-muted-foreground group-hover:bg-muted/30 transition-colors">
                                    <FileText className="h-12 w-12 opacity-20" />
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/5 py-3 flex justify-between">
                                <Button variant="ghost" size="sm" className="text-xs h-8 px-2">
                                    <Eye className="mr-2 h-3 w-3" />
                                    Prévia
                                </Button>
                                <Button size="sm" className="text-xs h-8" asChild>
                                    <Link href={`/dashboard/campanhas/nova?templateId=${template.$id}`}>
                                        Usar Modelo
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl border-dashed">
                    <div className="bg-muted p-6 rounded-full mb-4">
                        <FileText className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-bold">Nenhum modelo encontrado</h3>
                    <p className="max-w-xs text-sm text-muted-foreground mt-2">
                        Não encontramos nenhum modelo nesta categoria.
                    </p>
                </div>
            )}
        </div>
    );
}
