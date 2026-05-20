import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, Wrench, Home } from "lucide-react";
import { useLocation } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";
import QuickTipsModal from "@/components/QuickTipsModal";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location, setLocation] = useLocation();
  const [quickTipsOpen, setQuickTipsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Navigation */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={location === "/" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLocation("/")}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Comandos</span>
            </Button>
            <Button
              variant={location === "/troubleshooting" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLocation("/troubleshooting")}
              className="flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">Solução de Problemas</span>
            </Button>
            <Button
              variant={location === "/troubleshooting-b2b" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLocation("/troubleshooting-b2b")}
              className="flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">Solução de Problemas B2B</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickTipsOpen(true)}
              className="flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Dicas Rápidas</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Quick Tips Modal */}
      <QuickTipsModal open={quickTipsOpen} onOpenChange={setQuickTipsOpen} />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-secondary">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Guia de Comandos de Redes • Criado por{" "}
            <span className="font-semibold text-foreground">Tarcisio Cabral</span>
          </p>
          <p className="mt-1 opacity-70">
            © {new Date().getFullYear()} • Última atualização:{" "}
            {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
      </footer>
    </div>
  );
}
