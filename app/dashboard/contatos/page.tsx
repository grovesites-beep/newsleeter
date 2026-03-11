'use client';

import { useState, useEffect } from 'react';
import { dbService, Contact } from '@/services/database/dbService';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Search,
    Download,
    Upload,
    MoreHorizontal,
    UserPlus,
    Filter,
    Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // New Contact State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', email: '', tags: '' });

    // CSV State
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [csvFile, setCsvFile] = useState<File | null>(null);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        setLoading(true);
        try {
            const response = await dbService.getContacts();
            setContacts(response.documents);
        } catch (error) {
            console.error('Falha ao carregar contatos:', error);
            toast.info('Nenhum contato encontrado ou erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddContact = async () => {
        if (!newContact.name || !newContact.email) {
            toast.error('Preencha pelo menos nome e e-mail.');
            return;
        }

        try {
            await dbService.createContact({
                name: newContact.name,
                email: newContact.email,
                tags: newContact.tags ? newContact.tags.split(',').map(t => t.trim()) : [],
                status: 'active'
            });
            toast.success('Contato adicionado com sucesso!');
            setIsAddModalOpen(false);
            setNewContact({ name: '', email: '', tags: '' });
            loadContacts();
        } catch (error) {
            toast.error('Erro ao salvar contato.');
        }
    };

    const handleCsvImport = async () => {
        if (!csvFile) return;

        toast.promise(
            new Promise(async (resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const text = e.target?.result as string;
                    const lines = text.split('\n');
                    // Simple CSV Parser (assuming Name, Email format)
                    for (let i = 1; i < lines.length; i++) {
                        const [name, email] = lines[i].split(',');
                        if (name && email) {
                            await dbService.createContact({
                                name: name.trim(),
                                email: email.trim(),
                                tags: ['import-csv'],
                                status: 'active'
                            });
                        }
                    }
                    resolve(true);
                    setIsImportModalOpen(false);
                    loadContacts();
                };
                reader.readAsText(csvFile);
            }),
            {
                loading: 'Importando contatos...',
                success: 'Contatos importados com sucesso!',
                error: 'Erro na importação.',
            }
        );
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Ativo</Badge>;
            case 'inactive': return <Badge variant="secondary">Inativo</Badge>;
            case 'unsubscribed': return <Badge variant="destructive">Descadastrado</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contatos</h1>
                    <p className="text-muted-foreground">
                        Gerencie seus inscritos e organize sua base de leads.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/contatos/importar">
                            <Upload className="mr-2 h-4 w-4" />
                            Importar Lista
                        </Link>
                    </Button>

                    <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/segmentos">
                            <Filter className="mr-2 h-4 w-4" />
                            Segmentos
                        </Link>
                    </Button>

                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>

                    {/* New Contact Dialog */}
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="rounded-full shadow-lg">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Novo Contato
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Adicionar Contato</DialogTitle>
                                <DialogDescription>
                                    Insira os dados manualmente para sua base.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input id="name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} placeholder="João Silva" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input id="email" type="email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} placeholder="joao@exemplo.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                                    <Input id="tags" value={newContact.tags} onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })} placeholder="cliente, leads-2024" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                                <Button onClick={handleAddContact}>Salvar Contato</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome ou email..."
                        className="pl-9 h-10 rounded-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data Cadastro</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Carregando contatos...
                                </TableCell>
                            </TableRow>
                        ) : filteredContacts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Nenhum contato encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredContacts.map((contact) => (
                                <TableRow key={contact.$id}>
                                    <TableCell className="font-medium">{contact.name}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Star className={`h-3 w-3 ${Number(contact.leadScore || 0) > 50 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                            <span className="text-xs font-bold">{contact.leadScore || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {contact.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                                    <TableCell>{new Date(contact.$createdAt).toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                                <DropdownMenuItem>Ver Atividade</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
