import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { quickTips } from "@/lib/quick-tips";
import { Copy, Check, Lightbulb } from "lucide-react";

interface QuickTipsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Design Philosophy: Minimalist Technical
 * - Modal com abas para cada fabricante
 * - Exibe os 5 comandos mais essenciais
 * - Botão de copiar para cada comando
 * - Ícones coloridos por fabricante
 */
export default function QuickTipsModal({ open, onOpenChange }: QuickTipsModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (command: string, id: string) => {
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            <DialogTitle>Dicas Rápidas</DialogTitle>
          </div>
          <DialogDescription>
            Os 5 comandos mais essenciais de cada fabricante para referência rápida
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="Cisco" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {quickTips.map((tip) => (
              <TabsTrigger key={tip.vendor} value={tip.vendor} className="text-xs">
                {tip.vendor}
              </TabsTrigger>
            ))}
          </TabsList>

          {quickTips.map((tip) => (
            <TabsContent key={tip.vendor} value={tip.vendor} className="space-y-3">
              <div className="space-y-3">
                {tip.tips.map((item, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{tip.icon}</span>
                          <span className="inline-block px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                            {tip.vendor}
                          </span>
                        </div>
                        <div className="bg-input rounded p-2 mb-2 font-mono text-sm break-all">
                          <code className="text-foreground">{item.command}</code>
                        </div>
                        <p className="text-sm text-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCopy(item.command, `${tip.vendor}-${index}`)
                        }
                        className="flex-shrink-0 whitespace-nowrap"
                        title="Copiar comando"
                      >
                        {copiedId === `${tip.vendor}-${index}` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
          💡 Dica: Use a barra de busca no topo para encontrar mais comandos de cada
          fabricante
        </div>
      </DialogContent>
    </Dialog>
  );
}
