'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    Save,
    Play,
    Plus,
    Mail,
    Clock,
    Zap,
    CornerRightDown,
    Trash2,
    Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const initialSteps = [
    { id: '1', type: 'trigger', label: 'Inscrito via Formulário Site', icon: Zap, color: 'text-yellow-500 bg-yellow-500/10' },
    { id: '2', type: 'action', label: 'Enviar E-mail de Boas-vindas', icon: Mail, color: 'text-blue-500 bg-blue-500/10' },
    { id: '3', type: 'delay', label: 'Aguardar 1 dia', icon: Clock, color: 'text-purple-500 bg-purple-500/10' },
    { id: '4', type: 'action', label: 'Enviar Segundo E-mail (Dicas)', icon: Mail, color: 'text-blue-500 bg-blue-500/10' },
];

export default function AutomationBuilderPage({ params }: { params: { id: string } }) {
    const [steps, setSteps] = useState(initialSteps);

    const removeStep = (id: string) => {
        setSteps(steps.filter(s => s.id !== id));
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-100px)] space-y-6">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between border-b pb-6 sticky top-0 bg-background z-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/dashboard/automations">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold">Fluxo de Boas-vindas</h1>
                            <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/20">Draft</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Editado pela última vez há 5 minutos</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-full">
                        <Settings2 className="mr-2 h-4 w-4" />
                        Configurações
                    </Button>
                    <Button variant="outline" className="rounded-full border-green-500/50 text-green-600 hover:bg-green-50">
                        <Play className="mr-2 h-4 w-4" />
                        Ativar Fluxo
                    </Button>
                    <Button className="rounded-full shadow-lg">
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                    </Button>
                </div>
            </div>

            {/* Builder Canvas */}
            <div className="flex-1 overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] flex flex-col items-center py-12 px-4">
                <div className="w-full max-w-lg space-y-8 relative">
                    {steps.map((step, index) => (
                        <div key={step.id} className="relative flex flex-col items-center group">
                            {/* Step Card */}
                            <Card className={`w-full border-none shadow-md overflow-hidden relative z-10 transition-all hover:scale-[1.02] ${step.type === 'trigger' ? 'ring-2 ring-primary ring-offset-4 ring-offset-background' : ''
                                }`}>
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-4 p-5">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${step.color}`}>
                                            <step.icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-0.5">
                                            <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                                {step.type === 'trigger' ? 'Gatilho' : step.type === 'action' ? 'Ação' : 'Atraso'}
                                            </p>
                                            <h4 className="font-semibold">{step.label}</h4>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                            <Settings2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Editar</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {step.type !== 'trigger' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full text-destructive hover:bg-red-50"
                                                    onClick={() => removeStep(step.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Connecting Line & Plus Button */}
                            {index !== steps.length - 1 && (
                                <div className="h-12 w-0.5 bg-border relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-2 bg-background shadow-sm hover:scale-110 transition-transform">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Terminal Indicator */}
                            {index === steps.length - 1 && (
                                <div className="h-12 w-0.5 bg-border" />
                            )}
                        </div>
                    ))}

                    <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground/50">
                            <Plus className="h-5 w-5" />
                        </div>
                        <p className="mt-2 text-xs font-medium text-muted-foreground">Adicionar novo passo</p>
                    </div>
                </div>
            </div>

            {/* Sidebar Inspector Mockup (Hidden by default, could be added later) */}
            <div className="fixed bottom-8 right-8 flex flex-col gap-3">
                <div className="p-4 rounded-xl bg-primary text-primary-foreground shadow-2xl flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-sm font-medium">Modo visualizador ativo</p>
                </div>
            </div>
        </div>
    );
}
