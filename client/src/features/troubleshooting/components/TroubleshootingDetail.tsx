import { TroubleshootingGuide } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface TroubleshootingDetailProps {
  guide: TroubleshootingGuide;
  onBack: () => void;
}

/**
 * Design Philosophy: Minimalist Technical
 * - Exibe guia completo com passos numerados
 * - Cada passo tem descrição, comandos e dicas
 * - Botão de copiar para cada comando
 * - Navegação clara e hierarquia visual
 */
export default function TroubleshootingDetail({
  guide,
  onBack,
}: TroubleshootingDetailProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (command: string, id: string) => {
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const severityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  };

  const severityLabels = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <h1 className="text-4xl font-bold text-foreground mb-3">
          {guide.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          {guide.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{guide.category}</Badge>
          <Badge className={severityColors[guide.severity]}>
            Severidade: {severityLabels[guide.severity]}
          </Badge>
        </div>
      </div>

      {/* Symptoms */}
      <div className="bg-secondary rounded-lg p-4">
        <h2 className="font-semibold text-foreground mb-3">Sintomas:</h2>
        <ul className="space-y-2">
          {guide.symptoms.map((symptom, index) => (
            <li key={index} className="flex items-start gap-2 text-foreground">
              <span className="text-primary font-bold">✓</span>
              <span>{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Guia Passo a Passo</h2>

        {guide.steps.map((step) => (
          <div
            key={step.number}
            className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Step Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                {step.number}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
              </div>
            </div>

            {/* Step Description */}
            <p className="text-foreground mb-4 ml-11">{step.description}</p>

            {/* Commands */}
            {step.commands && step.commands.length > 0 && (
              <div className="ml-11 mb-4">
                <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase">
                  Comandos:
                </p>
                <div className="space-y-2">
                  {step.commands.map((cmd, index) => (
                    <div
                      key={index}
                      className="bg-input rounded p-2 flex items-start justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">
                          {cmd.vendor}
                        </p>
                        <code className="text-sm text-foreground break-all font-mono">
                          {cmd.command}
                        </code>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCopy(cmd.command, `${guide.id}-${step.number}-${index}`)
                        }
                        className="flex-shrink-0 whitespace-nowrap"
                      >
                        {copiedId === `${guide.id}-${step.number}-${index}` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {step.tips && step.tips.length > 0 && (
              <div className="ml-11">
                <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase">
                  💡 Dicas:
                </p>
                <ul className="space-y-1">
                  {step.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-sm text-foreground flex items-start gap-2"
                    >
                      <span className="text-accent">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-secondary rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">
          ℹ️ Se o problema persistir após seguir todos os passos, entre em contato
          com o suporte técnico.
        </p>
      </div>
    </div>
  );
}
