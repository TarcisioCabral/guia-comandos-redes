export interface Command {
  id: string;
  category: string;
  command: string;
  description: string;
  vendor: string;
  os?: string;
  mode?: string;
}

export interface TroubleshootingStep {
  number: number;
  title: string;
  description: string;
  commands?: {
    vendor: string;
    command: string;
  }[];
  tips?: string[];
}

export interface TroubleshootingGuide {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  category: string;
  symptoms: string[];
  steps: TroubleshootingStep[];
  relatedCommands?: string[];
}
