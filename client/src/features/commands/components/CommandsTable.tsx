import { Command } from "@/types";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CommandsTableProps {
  commands: Command[];
  onCopyCommand?: (command: string) => void;
}

export default function CommandsTable({
  commands,
  onCopyCommand,
}: CommandsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (command: string, id: string) => {
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    onCopyCommand?.(command);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (commands.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Nenhum comando encontrado. Tente outra busca.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {commands.map((cmd) => (
        <div
          key={cmd.id}
          className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-block px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                  {cmd.vendor}
                </span>
                <span className="inline-block px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded">
                  {cmd.category}
                </span>
                {cmd.os && (
                  <span className="inline-block px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded">
                    {cmd.os}
                  </span>
                )}
              </div>

              <div className="bg-input rounded p-3 mb-2 font-mono text-sm break-all">
                <code className="text-foreground">{cmd.command}</code>
              </div>

              <p className="text-sm text-foreground">{cmd.description}</p>

              {cmd.mode && (
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="font-semibold">Modo:</span> {cmd.mode}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(cmd.command, cmd.id)}
              className="flex-shrink-0 whitespace-nowrap"
              title="Copiar comando"
            >
              {copiedId === cmd.id ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
