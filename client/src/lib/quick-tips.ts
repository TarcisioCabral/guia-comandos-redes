export interface QuickTip {
  vendor: string;
  icon: string;
  color: string;
  tips: {
    command: string;
    description: string;
  }[];
}

export const quickTips: QuickTip[] = [
  {
    vendor: "Cisco",
    icon: "📡",
    color: "bg-blue-500",
    tips: [
      {
        command: "show interface status",
        description: "Exibe o status resumido de todas as interfaces",
      },
      {
        command: "show interface [tipo/número] transceiver detail",
        description: "Exibe os níveis de potência óptica (TX/RX)",
      },
      {
        command: "configure terminal",
        description: "Entra no modo de configuração global",
      },
      {
        command: "no shutdown",
        description: "Ativa a interface",
      },
      {
        command: "write memory",
        description: "Salva a configuração na memória não volátil",
      },
    ],
  },
  {
    vendor: "Huawei",
    icon: "🔴",
    color: "bg-red-500",
    tips: [
      {
        command: "display interface brief",
        description: "Exibe o status resumido de todas as interfaces",
      },
      {
        command: "display interface [tipo/número] transceiver verbose",
        description: "Exibe os níveis de potência óptica e temperatura",
      },
      {
        command: "system-view",
        description: "Entra no modo de configuração global",
      },
      {
        command: "undo shutdown",
        description: "Ativa a interface",
      },
      {
        command: "save",
        description: "Salva a configuração na memória não volátil",
      },
    ],
  },
  {
    vendor: "Juniper",
    icon: "🌲",
    color: "bg-green-500",
    tips: [
      {
        command: "show interfaces terse",
        description: "Exibe o status de Link (físico) e Protocol (lógico)",
      },
      {
        command: "show interfaces diagnostics optics [interface]",
        description: "Exibe os níveis de potência óptica (TX/RX)",
      },
      {
        command: "show subscribers",
        description: "Lista todos os clientes PPPoE conectados",
      },
      {
        command: "test aaa ppp user [usuário] password [senha]",
        description: "Testa a autenticação do usuário",
      },
      {
        command: "commit",
        description: "Salva e aplica as alterações na configuração",
      },
    ],
  },
  {
    vendor: "Datacom",
    icon: "⚙️",
    color: "bg-indigo-500",
    tips: [
      {
        command: "show interface status",
        description: "Exibe o status resumido de todas as interfaces",
      },
      {
        command: "show interface transceiver",
        description: "Exibe os níveis de potência óptica de todos os transceptores",
      },
      {
        command: "show interface transceiver detail",
        description: "Exibe detalhes completos (temperatura, voltagem)",
      },
      {
        command: "no shutdown",
        description: "Ativa a interface",
      },
      {
        command: "show running-config",
        description: "Exibe a configuração atual do dispositivo",
      },
    ],
  },
  {
    vendor: "ZTE",
    icon: "🔧",
    color: "bg-orange-500",
    tips: [
      {
        command: "show interface [tipo/número]",
        description: "Exibe o status da interface especificada",
      },
      {
        command: "show interface optical-module-info [tipo/número]",
        description: "Exibe os níveis de potência óptica (TX/RX)",
      },
      {
        command: "show gpon remote-onu interface [onu-id] optical-info",
        description: "Exibe os níveis de sinal (TX/RX) da ONU",
      },
      {
        command: "show gpon onu state [slot/porta] [onu-id]",
        description: "Verifica se a ONU está online",
      },
      {
        command: "show gpon onu all",
        description: "Lista todas as ONUs descobertas na OLT",
      },
    ],
  },
  {
    vendor: "Nokia",
    icon: "📱",
    color: "bg-blue-600",
    tips: [
      {
        command: "show port",
        description: "Exibe o status resumido de todas as portas",
      },
      {
        command: "show port [porta] optical-diagnostic",
        description: "Exibe informações de diagnóstico óptico (TX/RX)",
      },
      {
        command: "no shutdown",
        description: "Ativa a porta",
      },
      {
        command: "show running-config",
        description: "Exibe a configuração atual",
      },
      {
        command: "ping [IP]",
        description: "Testa conectividade com um endereço IP",
      },
    ],
  },
];
