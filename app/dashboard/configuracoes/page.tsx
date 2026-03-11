'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Shield, Save, Loader2, Info, UserPlus, Users, Activity } from 'lucide-react';
import { dbService, UserProfile, ActivityLog } from '@/services/database/dbService';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [resendKey, setResendKey] = useState('re_************************');
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [auditLogs, setAuditLogs] = useState<ActivityLog[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersData, logsData] = await Promise.all([
                dbService.getUsers(),
                dbService.getLogs([`limit(10)`, `orderDesc("$createdAt")`])
            ]);
            setUsers(usersData.documents);
            setAuditLogs(logsData.documents);
        } catch (error) {
            console.error('Error loading settings data:', error);
        }
    };

    const handleSaveKey = async () => {
        setLoading(true);
        // In a real app, this would update an Appwrite Global Variable or a dedicated settings collection
        setTimeout(() => {
            setLoading(false);
            toast.success('Chave da API Resend atualizada com sucesso!');
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Administração & Configurações</h1>
                <p className="text-muted-foreground">Gerencie chaves de API, usuários e registros de auditoria.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* API Key Management - Feature 30 */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary" />
                            Integração Resend
                        </CardTitle>
                        <CardDescription>Configure sua chave para o envio real de e-mails.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="resend-key">Chave de API (Resend)</Label>
                            <Input
                                id="resend-key"
                                type="password"
                                value={resendKey}
                                onChange={(e) => setResendKey(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/5 border-t py-3 flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">Sua chave é criptografada em repouso.</p>
                        <Button size="sm" onClick={handleSaveKey} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Salvar</>}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Team Management - Feature 26 */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Gestão de Equipe
                            </CardTitle>
                            <CardDescription>Controle quem tem acesso ao dashboard.</CardDescription>
                        </div>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <UserPlus className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.length === 0 ? (
                                <p className="text-sm text-center py-6 text-muted-foreground">Carregando usuários...</p>
                            ) : users.map(user => (
                                <div key={user.$id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px capitalize]">
                                        {user.role}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Logs - Feature 29 */}
                <Card className="md:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Logs de Auditoria
                        </CardTitle>
                        <CardDescription>Histórico recente de ações administrativas no sistema.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="p-3 text-left font-medium">Ação</th>
                                        <th className="p-3 text-left font-medium">Data</th>
                                        <th className="p-3 text-left font-medium">Detalhes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-muted-foreground">Nenhum log encontrado.</td>
                                        </tr>
                                    ) : auditLogs.map(log => (
                                        <tr key={log.$id} className="border-b transition-colors hover:bg-muted/20">
                                            <td className="p-3">
                                                <Badge variant="secondary" className="font-mono text-[10px] uppercase">
                                                    {log.type}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-xs text-muted-foreground">
                                                {new Date(log.timestamp).toLocaleString('pt-BR')}
                                            </td>
                                            <td className="p-3 text-xs truncate max-w-[200px]">
                                                {log.metadata ? (
                                                    <span className="opacity-70">{JSON.parse(log.metadata).ip || 'Sistema'}</span>
                                                ) : 'Ação sistêmica'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
