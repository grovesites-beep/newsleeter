'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, ArrowLeft, CheckCircle2, AlertCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { dbService } from '@/services/database/dbService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Papa from 'papaparse';

export default function ImportContactsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [mapping, setMapping] = useState({
        name: '',
        email: '',
        tags: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setPreview(results.data.slice(0, 5));
                    const headers = results.meta.fields || [];
                    // Auto-mapping suggestion
                    const foundName = headers.find(h => h.toLowerCase().includes('nome') || h.toLowerCase().includes('name'));
                    const foundEmail = headers.find(h => h.toLowerCase().includes('email') || h.toLowerCase().includes('e-mail'));
                    const foundTags = headers.find(h => h.toLowerCase().includes('tag'));

                    setMapping({
                        name: foundName || '',
                        email: foundEmail || '',
                        tags: foundTags || ''
                    });
                }
            });
        }
    };

    const handleImport = async () => {
        if (!file || !mapping.name || !mapping.email) {
            toast.error('Selecione o arquivo e mapeie pelo menos Nome e E-mail.');
            return;
        }

        setLoading(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const dataToImport = results.data.map((row: any) => ({
                    name: row[mapping.name] || 'Sem Nome',
                    email: row[mapping.email],
                    status: 'active' as const,
                    tags: mapping.tags && row[mapping.tags] ? row[mapping.tags].split(',').map((t: string) => t.trim()) : [],
                    leadScore: 0,
                    metadata: JSON.stringify(row) // Save everything for custom fields
                })).filter(c => c.email && c.email.includes('@'));

                try {
                    await dbService.bulkCreateContacts(dataToImport);
                    toast.success(`${dataToImport.length} contatos importados com sucesso!`);
                    router.push('/dashboard/contatos');
                } catch (error) {
                    console.error('Import error:', error);
                    toast.error('Erro ao importar contatos. Verifique o formato do arquivo.');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/contatos">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Importar Contatos</h1>
                    <p className="text-muted-foreground">Suba sua lista em CSV para popular sua base rapidamente.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle>1. Selecione o Arquivo</CardTitle>
                        <CardDescription>O arquivo deve estar no formato CSV e conter cabeçalhos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 border-muted-foreground/20 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">
                                        <span className="font-semibold">{file ? file.name : 'Clique para selecionar'}</span> ou arraste e solte
                                    </p>
                                    <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">CSV (Máx. 50MB)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {preview.length > 0 && (
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>2. Mapeamento de Colunas</CardTitle>
                            <CardDescription>Indique quais colunas do seu arquivo correspondem aos nossos campos.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome Completo</Label>
                                    <select
                                        className="w-full rounded-md border p-2 bg-background"
                                        value={mapping.name}
                                        onChange={(e) => setMapping({ ...mapping, name: e.target.value })}
                                    >
                                        <option value="">Selecione...</option>
                                        {Object.keys(preview[0]).map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>E-mail</Label>
                                    <select
                                        className="w-full rounded-md border p-2 bg-background"
                                        value={mapping.email}
                                        onChange={(e) => setMapping({ ...mapping, email: e.target.value })}
                                    >
                                        <option value="">Selecione...</option>
                                        {Object.keys(preview[0]).map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tags (Opcional - separadas por vírgula)</Label>
                                    <select
                                        className="w-full rounded-md border p-2 bg-background"
                                        value={mapping.tags}
                                        onChange={(e) => setMapping({ ...mapping, tags: e.target.value })}
                                    >
                                        <option value="">Nenhuma</option>
                                        {Object.keys(preview[0]).map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-sm font-semibold mb-2">Prévia dos dados (primeiras 3 linhas):</p>
                                <div className="rounded-md border overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                {Object.keys(preview[0]).map(h => <th key={h} className="p-2 border-b text-left font-medium">{h}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.slice(0, 3).map((row, i) => (
                                                <tr key={i}>
                                                    {Object.values(row).map((v: any, j) => <td key={j} className="p-2 border-b text-muted-foreground truncate max-w-[150px]">{String(v)}</td>)}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end border-t bg-muted/5 p-4">
                            <Button onClick={handleImport} disabled={loading} className="gap-2">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                {loading ? 'Importando...' : 'Iniciar Importação'}
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}
