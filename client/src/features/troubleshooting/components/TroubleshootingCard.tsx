import { TroubleshootingGuide } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, AlertCircle } from "lucide-react";

interface TroubleshootingCardProps {
  guide: TroubleshootingGuide;
  onClick: () => void;
}

/**
 * Design Philosophy: Minimalist Technical
 * - Card com resumo do guia
 * - Badge de severidade com cores apropriadas
 * - Ícone e descrição clara
 * - Botão CTA para abrir guia completo
 */
export default function TroubleshootingCard({
  guide,
  onClick,
}: TroubleshootingCardProps) {
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
    <div
      onClick={onClick}
      className="border border-border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {guide.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {guide.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{guide.category}</Badge>
          <Badge className={severityColors[guide.severity]}>
            Severidade: {severityLabels[guide.severity]}
          </Badge>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">
          Sintomas:
        </p>
        <ul className="text-xs text-muted-foreground space-y-0.5">
          {guide.symptoms.slice(0, 2).map((symptom, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-primary">•</span>
              <span>{symptom}</span>
            </li>
          ))}
          {guide.symptoms.length > 2 && (
            <li className="text-primary">
              +{guide.symptoms.length - 2} mais sintomas
            </li>
          )}
        </ul>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center justify-center gap-2"
      >
        Ver Guia Completo
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
