'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Calendar, Tag, Star, Activity, ExternalLink, Clock, Trash2 } from 'lucide-react';
import { dbService, Contact, ActivityLog } from '@/services/database/dbService';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [contact, setContact] = useState<Contact | null>(null);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [contactData, logsData] = await Promise.all([
                dbService.getContacts([`equal("$id", ["${id}"])`]),
                dbService.getLogs([`equal("contactId", ["${id}"])`, `orderDesc("$createdAt")`])
            ]);

            if (contactData.documents.length > 0) {
                setContact(contactData.documents[0]);
            }
            setLogs(logsData.documents);
        } catch (error) {
            console.error('Error loading contact details:', error);
            toast.error('Erro ao carregar detalhes do contato.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );

    if (!contact) return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold">Contato não encontrado</h2>
            <Button asChild variant="link" className="mt-4">
                <Link href="/dashboard/contatos">Voltar para a lista</Link>
            </Button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/contatos">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Detalhes do Lead</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1 border-none shadow-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">{contact.name}</CardTitle>
                        <CardDescription>{contact.email}</CardDescription>
                        <div className="mt-4 flex justify-center gap-2">
                            <Badge className={contact.status === 'active' ? 'bg-green-500/10 text-green-500' : ''}>
                                {contact.status === 'active' ? 'Ativo' : contact.status}
                            </Badge>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 text-yellow-600 rounded-full text-xs font-bold ring-1 ring-yellow-400/20">
                                <Star className="h-3 w-3 fill-yellow-400" />
                                {contact.leadScore || 0}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Membro desde:</span>
                            <span className="font-medium ml-auto">{new Date(contact.$createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Tags:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {contact.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="px-2 py-0.5 font-normal text-[11px] h-5">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Feed */}
                <Card className="md:col-span-2 border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Linha do Tempo de Atividade
                        </CardTitle>
                        <CardDescription>Rastreamento de todas as interações do lead com suas campanhas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {logs.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>Nenhuma atividade registrada ainda.</p>
                            </div>
                        ) : (
                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-muted-foreground/10">
                                {logs.map((log) => (
                                    <div key={log.$id} className="relative flex items-center gap-8 pl-5">
                                        <div className="absolute left-0 h-10 w-10 flex items-center justify-center rounded-full bg-background border-2 border-muted-foreground/20 ring-4 ring-background">
                                            {log.type === 'open' && <Mail className="h-4 w-4 text-blue-500" />}
                                            {log.type === 'click' && <ExternalLink className="h-4 w-4 text-green-500" />}
                                            {log.type === 'unsubscribe' && <Trash2 className="h-4 w-4 text-destructive" />}
                                            {(!log.type || (log.type !== 'open' && log.type !== 'click' && log.type !== 'unsubscribe')) && <Clock className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-sm capitalize">
                                                    {log.type === 'open' ? 'E-mail Aberto' :
                                                        log.type === 'click' ? 'Link Clicado' :
                                                            log.type === 'unsubscribe' ? 'Cancelou Inscrição' : log.type}
                                                </p>
                                                <time className="text-[11px] text-muted-foreground">
                                                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                                                </time>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Interação detectada na plataforma via tracking.
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
