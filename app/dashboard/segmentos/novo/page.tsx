'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Plus, Trash2, Filter, Info } from 'lucide-react';
import { toast } from 'sonner';
import { dbService } from '@/services/database/dbService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewSegmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [segment, setSegment] = useState({
        name: '',
        description: '',
        rules: [
            { field: 'tags', operator: 'contains', value: '' }
        ]
    });

    const addRule = () => {
        setSegment({
            ...segment,
            rules: [...segment.rules, { field: 'tags', operator: 'contains', value: '' }]
        });
    };

    const removeRule = (index: number) => {
        const newRules = [...segment.rules];
        newRules.splice(index, 1);
        setSegment({ ...segment, rules: newRules });
    };

    const updateRule = (index: number, field: string, value: string) => {
        const newRules = [...segment.rules];
        (newRules[index] as any)[field] = value;
        setSegment({ ...segment, rules: newRules });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!segment.name) {
            toast.error('Dê um nome ao seu segmento.');
            return;
        }

        setLoading(true);
        try {
            await dbService.createSegment({
                name: segment.name,
                description: segment.description,
                rules: JSON.stringify(segment.rules)
            });
            toast.success('Segmento criado com sucesso!');
            router.push('/dashboard/segmentos');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Erro ao salvar o segmento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/segmentos">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Novo Segmento</h1>
                    <p className="text-muted-foreground">Crie um grupo dinâmico de contatos baseado em regras.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid gap-6">
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Identificação</CardTitle>
                        <CardDescription>Nomeie seu segmento para usá-lo em futuras campanhas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Segmento</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Clientes VIP - Leads 2024"
                                value={segment.name}
                                onChange={(e) => setSegment({ ...segment, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição (Opcional)</Label>
                            <Input
                                id="description"
                                placeholder="Filtro focado em quem comprou o curso X"
                                value={segment.description}
                                onChange={(e) => setSegment({ ...segment, description: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-primary" />
                            Regras de Filtragem
                        </CardTitle>
                        <CardDescription>O contato deve cumprir TODAS as regras abaixo para ser incluído.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {segment.rules.map((rule, index) => (
                            <div key={index} className="flex gap-4 items-end bg-muted/20 p-4 rounded-lg border border-muted-foreground/10">
                                <div className="space-y-2 flex-1">
                                    <Label>Campo</Label>
                                    <select
                                        className="w-full rounded-md border p-2 bg-background text-sm"
                                        value={rule.field}
                                        onChange={(e) => updateRule(index, 'field', e.target.value)}
                                    >
                                        <option value="tags">Tags</option>
                                        <option value="status">Status</option>
                                        <option value="leadScore">Lead Score</option>
                                    </select>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <Label>Condição</Label>
                                    <select
                                        className="w-full rounded-md border p-2 bg-background text-sm"
                                        value={rule.operator}
                                        onChange={(e) => updateRule(index, 'operator', e.target.value)}
                                    >
                                        <option value="contains">Contém</option>
                                        <option value="equals">É igual a</option>
                                        <option value="greater">Maior que</option>
                                    </select>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <Label>Valor</Label>
                                    <Input
                                        placeholder="Ex: vip"
                                        value={rule.value}
                                        onChange={(e) => updateRule(index, 'value', e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => removeRule(index)}
                                    disabled={segment.rules.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-dashed gap-2"
                            onClick={addRule}
                        >
                            <Plus className="h-4 w-4" />
                            Adicionar Regra
                        </Button>
                    </CardContent>
                    <CardFooter className="bg-muted/5 flex items-center gap-2 p-4 border-t">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Este segmento será atualizado automaticamente conforme novos contatos entrarem na base.</p>
                    </CardFooter>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" asChild>
                        <Link href="/dashboard/segmentos">Cancelar</Link>
                    </Button>
                    <Button type="submit" disabled={loading} className="gap-2 px-8">
                        {loading ? 'Criando...' : <><Save className="h-4 w-4" /> Salvar Segmento</>}
                    </Button>
                </div>
            </form>
        </div>
    );
}
