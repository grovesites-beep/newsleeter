'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dbService } from '@/services/database/dbService';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function UnsubscribeForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get('e');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [reason, setReason] = useState('');

    const handleUnsubscribe = async () => {
        if (!email) return;

        setStatus('loading');
        try {
            const contacts = await dbService.getContacts([`equal("email", ["${email}"])`]);
            if (contacts.documents.length > 0) {
                await dbService.updateContact(contacts.documents[0].$id, {
                    status: 'unsubscribed',
                    metadata: JSON.stringify({
                        ...JSON.parse(contacts.documents[0].metadata || '{}'),
                        unsubscribe_reason: reason,
                        unsubscribe_date: new Date().toISOString()
                    })
                });
            }
            setStatus('success');
        } catch (error) {
            console.error('Unsubscribe error:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">Você foi removido com sucesso</h2>
                <p className="text-muted-foreground">Sentimos muito em te ver partir. Se mudar de ideia, pode se inscrever novamente em nosso site a qualquer momento.</p>
            </div>
        );
    }

    return (
        <Card className="max-w-md w-full border-none shadow-2xl">
            <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Cancelar Inscrição</CardTitle>
                <CardDescription>
                    Confirmamos que você deseja parar de receber nossos e-mails para: <br />
                    <span className="font-semibold text-foreground">{email || 'seu e-mail'}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Por que você está nos deixando? (Opcional)</label>
                    <textarea
                        className="w-full min-h-[100px] rounded-md border p-3 text-sm bg-background resize-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Ex: Recebo e-mails demais, o conteúdo não é mais relevante..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <Button
                    className="w-full h-12 text-base font-semibold"
                    variant="destructive"
                    onClick={handleUnsubscribe}
                    disabled={status === 'loading' || !email}
                >
                    {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirmar Cancelamento'}
                </Button>
                {status === 'error' && (
                    <p className="text-xs text-destructive text-center flex items-center justify-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Ocorreu um erro. Tente novamente mais tarde.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export default function UnsubscribePage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 dark:bg-zinc-950">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <UnsubscribeForm />
            </Suspense>
        </div>
    );
}
