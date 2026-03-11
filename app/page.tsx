'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  Zap,
  Shield,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle2,
  MousePointerClick
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">
              <Mail className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Newsletter Grove</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Funcionalidades</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">Como Funciona</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Preços</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/entrar" className="text-sm font-medium hover:text-primary transition-colors">Entrar</Link>
            <Button asChild size="sm" className="rounded-full px-6 shadow-md hover:shadow-lg transition-all">
              <Link href="/cadastro">Começar agora</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block rounded-full border bg-muted/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
              >
                ✨ A Nova Era do Email Marketing
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl"
              >
                Cultive conexões <span className="text-primary italic">reais</span> com seu público.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-muted-foreground max-w-2xl"
              >
                Newsletter Grove é a plataforma ultra profissional para envio de e-mails que combina simplicidade radical com performance de elite. Feito para criadores e empresas que levam sério o engajamento.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20">
                  <Link href="/cadastro" className="flex items-center gap-2">
                    Criar Minha Conta Grátis
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2">
                  <Link href="#features">Ver Demonstração</Link>
                </Button>
              </motion.div>

              {/* Hero Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-16 w-full max-w-5xl rounded-2xl border bg-card shadow-2xl overflow-hidden"
              >
                <div className="border-b bg-muted/30 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center text-xs text-muted-foreground font-medium">dashboard.newslettergrove.com.br</div>
                </div>
                <div className="p-4 md:p-8 bg-zinc-950/5 dark:bg-zinc-900/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                      <div className="h-32 rounded-xl bg-primary/10 border border-primary/20 animate-pulse" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-xl bg-card border shadow-sm" />
                        <div className="h-24 rounded-xl bg-card border shadow-sm" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-10 w-full rounded-md bg-muted" />
                      <div className="h-10 w-full rounded-md bg-muted" />
                      <div className="h-40 w-full rounded-xl bg-muted/50 border" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Background elements */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-primary/20 blur-[120px] rounded-full -z-10" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 blur-[130px] rounded-full -z-10" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-balance">
                Tudo o que você precisa para crescer.
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Desenvolvido com foco total em performance e simplicidade, o Newsletter Grove entrega as ferramentas certas sem a complexidade desnecessária.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Performance SaaS",
                  desc: "Carregamento instantâneo e interface ultra-rápida construída com Next.js 14.",
                  icon: Zap,
                  color: "text-yellow-500"
                },
                {
                  title: "Segurança de Dados",
                  desc: "Seus contatos protegidos com a robustez e compliance do Appwrite.",
                  icon: Shield,
                  color: "text-blue-500"
                },
                {
                  title: "Métricas Reais",
                  desc: "Rastreamento preciso de aberturas e cliques para entender seu público.",
                  icon: BarChart3,
                  color: "text-primary"
                },
                {
                  title: "Segmentação Inteligente",
                  desc: "Envie a mensagem certa para a pessoa certa através de filtros dinâmicos.",
                  icon: Users,
                  color: "text-purple-500"
                },
                {
                  title: "Entrega Garantida",
                  desc: "Integração nativa com Resend API para garantir que seus e-mails cheguem à caixa de entrada.",
                  icon: Send,
                  color: "text-emerald-500"
                },
                {
                  title: "Automação Simples",
                  desc: "Agende campanhas e automatize fluxos sem precisar ser um especialista.",
                  icon: MousePointerClick,
                  color: "text-orange-500"
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl border bg-background shadow-sm hover:shadow-xl transition-all"
                >
                  <div className={cn("mb-6 inline-block p-3 rounded-xl bg-muted", feature.color)}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="py-20 border-y bg-muted/10">
          <div className="container mx-auto px-4 text-center">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h4 className="text-4xl font-bold text-primary mb-2">99.9%</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Entregabilidade</p>
              </div>
              <div>
                <h4 className="text-4xl font-bold text-primary mb-2">+10M</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">E-mails Enviados</p>
              </div>
              <div>
                <h4 className="text-4xl font-bold text-primary mb-2">&lt;1s</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Latência de Interface</p>
              </div>
              <div>
                <h4 className="text-4xl font-bold text-primary mb-2">100%</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Privacidade</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center space-y-8 relative z-10">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Pronto para cultivar seu jardim?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Junte-se a milhares de criadores que já utilizam o Newsletter Grove para se aproximar de seus assinantes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-10 rounded-full shadow-lg">
                <Link href="/cadastro">Começar Gratuitamente</Link>
              </Button>
              <Button variant="ghost" size="lg" className="h-14 px-10 rounded-full">
                Falar com especialista
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Sem cartão de crédito</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Setup em 2 minutos</span>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold">Newsletter Grove</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                A plataforma definitiva de email marketing para quem busca simplicidade e performance ultra profissional.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Plataforma</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">Funcionalidades</Link></li>
                <li><Link href="/dashboard/modelos" className="hover:text-primary transition-colors">Templates</Link></li>
                <li><Link href="/dashboard/relatorios" className="hover:text-primary transition-colors">Relatórios</Link></li>
                <li><Link href="/cadastro" className="hover:text-primary transition-colors">Preços</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Empresa</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Carreiras</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contatos</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2024 Newsletter Grove. Todos os direitos reservados. Feito com ❤️ no Brasil.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary">Termos</Link>
              <Link href="#" className="hover:text-primary">Privacidade</Link>
              <Link href="#" className="hover:text-primary">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Utility function duplicated for safety since types/utils might not be ready
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
