'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Suspense } from 'react';

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const email = searchParams.get('email');
    const cid = searchParams.get('cid');

    const handleUnsubscribe = async () => {
        setStatus('loading');
        try {
            // In a real app, this would call an API route to update Appwrite
            // For now, we simulate the delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus('success');
            toast.success('Inscrição cancelada com sucesso.');
        } catch (error) {
            setStatus('error');
            toast.error('Ocorreu um erro ao cancelar sua inscrição.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Mail className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Cancelar Inscrição</CardTitle>
                    <CardDescription>
                        Sentimos muito em ver você partir!
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    {status === 'idle' && (
                        <>
                            <p className="text-sm text-muted-foreground">
                                Você está prestes a cancelar a inscrição para o e-mail:
                                <br />
                                <strong className="text-foreground">{email || 'seu-email@exemplo.com'}</strong>
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Você não receberá mais nossas atualizações semanais, promoções e novidades.
                            </p>
                        </>
                    )}

                    {status === 'loading' && (
                        <div className="py-8 flex flex-col items-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p className="mt-4 text-sm text-muted-foreground">Processando pedido...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="py-6 space-y-2">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                            <h3 className="text-lg font-semibold uppercase tracking-tight">Inscrição Cancelada</h3>
                            <p className="text-sm text-muted-foreground">
                                Você foi removido da nossa lista. Se mudar de ideia, poderá se inscrever novamente em nosso site.
                            </p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="py-6 space-y-2">
                            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                            <h3 className="text-lg font-semibold uppercase tracking-tight">Erro no Processamento</h3>
                            <p className="text-sm text-muted-foreground">
                                Não conseguimos processar seu pedido agora. Por favor, tente novamente mais tarde.
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    {status === 'idle' && (
                        <>
                            <Button className="w-full" variant="destructive" onClick={handleUnsubscribe}>
                                Confirmar Cancelamento
                            </Button>
                            <Button className="w-full" variant="ghost" asChild>
                                <a href="https://newsletter.grovehost.com.br">Manter minha inscrição</a>
                            </Button>
                        </>
                    )}
                    {status === 'success' && (
                        <Button className="w-full" asChild>
                            <a href="https://newsletter.grovehost.com.br">Voltar para o site</a>
                        </Button>
                    )}
                    {status === 'error' && (
                        <Button className="w-full" onClick={() => setStatus('idle')}>
                            Tentar Novamente
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
                <Card className="w-full max-w-md shadow-lg border-none p-8 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </Card>
            </div>
        }>
            <UnsubscribeContent />
        </Suspense>
    );
}
