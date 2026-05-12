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

export const troubleshootingGuides: TroubleshootingGuide[] = [
  {
    id: "interface-down",
    title: "Interface Caiu (Link Down)",
    description:
      "Guia para diagnosticar e resolver problemas de interface que está em estado administrativo down ou link down.",
    severity: "high",
    category: "Interface",
    symptoms: [
      "Interface aparece como 'down' no status",
      "Sem conectividade na porta",
      "Luz LED apagada na porta",
    ],
    steps: [
      {
        number: 1,
        title: "Verificar Status Administrativo da Interface",
        description:
          "Primeiro, confirme se a interface está em shutdown administrativo ou se é um problema físico.",
        commands: [
          {
            vendor: "Cisco",
            command: "show interface [tipo/número]",
          },
          {
            vendor: "Huawei",
            command: "display interface [tipo/número]",
          },
          {
            vendor: "Juniper",
            command: "show interfaces [interface-name]",
          },
        ],
        tips: [
          "Procure por 'administratively down' ou 'disabled'",
          "Se estiver administrativamente desativada, passe para o Passo 2",
        ],
      },
      {
        number: 2,
        title: "Ativar a Interface",
        description:
          "Se a interface estiver em shutdown administrativo, ative-a com o comando apropriado.",
        commands: [
          {
            vendor: "Cisco",
            command: "no shutdown",
          },
          {
            vendor: "Huawei",
            command: "undo shutdown",
          },
          {
            vendor: "Juniper",
            command: "activate",
          },
        ],
        tips: [
          "Execute este comando no modo de configuração da interface",
          "Salve a configuração após ativar",
        ],
      },
      {
        number: 3,
        title: "Verificar Conectividade Física",
        description:
          "Se a interface ainda estiver down após ativação, verifique o cabo e o equipamento conectado.",
        tips: [
          "Inspecione o cabo de rede (RJ45 ou fibra óptica)",
          "Verifique se o outro lado da conexão está ativo",
          "Teste com um cabo diferente se possível",
          "Verifique se há danos físicos na porta",
        ],
      },
      {
        number: 4,
        title: "Verificar Sinais Ópticos (se aplicável)",
        description:
          "Para portas ópticas, verifique os níveis de potência TX/RX.",
        commands: [
          {
            vendor: "Cisco",
            command: "show interface [tipo/número] transceiver detail",
          },
          {
            vendor: "Huawei",
            command: "display interface [tipo/número] transceiver verbose",
          },
          {
            vendor: "Juniper",
            command: "show interfaces diagnostics optics [interface]",
          },
        ],
        tips: [
          "Potência TX/RX muito baixa indica problema no transceptor",
          "Valores normais variam conforme o tipo de módulo SFP",
          "Se fora do intervalo, substitua o módulo SFP",
        ],
      },
    ],
  },
  {
    id: "no-connectivity",
    title: "Sem Conectividade Entre Equipamentos",
    description:
      "Guia para diagnosticar problemas de conectividade entre dois equipamentos ou redes.",
    severity: "high",
    category: "Conectividade",
    symptoms: [
      "Não consegue fazer ping entre equipamentos",
      "Interface está up mas não há tráfego",
      "Conexão intermitente",
    ],
    steps: [
      {
        number: 1,
        title: "Verificar Status das Interfaces",
        description:
          "Confirme que ambas as interfaces estão em estado up/up (Link e Protocol).",
        commands: [
          {
            vendor: "Cisco",
            command: "show interface status",
          },
          {
            vendor: "Huawei",
            command: "display interface brief",
          },
          {
            vendor: "Juniper",
            command: "show interfaces terse",
          },
        ],
        tips: [
          "Procure por status 'up up' em ambos os lados",
          "Se uma estiver down, consulte o guia 'Interface Caiu'",
        ],
      },
      {
        number: 2,
        title: "Testar Conectividade com Ping",
        description:
          "Execute um ping para verificar se há comunicação entre os equipamentos.",
        commands: [
          {
            vendor: "Cisco",
            command: "ping [IP-destino]",
          },
          {
            vendor: "Huawei",
            command: "ping [IP-destino]",
          },
          {
            vendor: "Juniper",
            command: "ping [IP-destino]",
          },
        ],
        tips: [
          "Se receber resposta, a conectividade básica funciona",
          "Se não receber resposta, continue com o próximo passo",
        ],
      },
      {
        number: 3,
        title: "Verificar Configuração de IP",
        description:
          "Confirme que os endereços IP estão configurados corretamente e na mesma sub-rede.",
        commands: [
          {
            vendor: "Cisco",
            command: "show ip interface brief",
          },
          {
            vendor: "Huawei",
            command: "display ip interface brief",
          },
          {
            vendor: "Juniper",
            command: "show interfaces terse",
          },
        ],
        tips: [
          "Verifique se os IPs estão na mesma sub-rede",
          "Confirme que o gateway está configurado corretamente",
        ],
      },
      {
        number: 4,
        title: "Verificar Tabela de Roteamento",
        description:
          "Confirme que a rota para o destino existe na tabela de roteamento.",
        commands: [
          {
            vendor: "Cisco",
            command: "show ip route",
          },
          {
            vendor: "Huawei",
            command: "display ip routing-table",
          },
          {
            vendor: "Juniper",
            command: "show route",
          },
        ],
        tips: [
          "Procure pela rede de destino na tabela de roteamento",
          "Se não existir, adicione uma rota estática ou ative um protocolo de roteamento",
        ],
      },
      {
        number: 5,
        title: "Verificar Firewall/ACLs",
        description:
          "Confirme que não há regras de firewall ou ACLs bloqueando o tráfego.",
        commands: [
          {
            vendor: "Cisco",
            command: "show access-lists",
          },
          {
            vendor: "Huawei",
            command: "display acl all",
          },
          {
            vendor: "Juniper",
            command: "show firewall filter",
          },
        ],
        tips: [
          "Verifique se há regras que negam (deny) o tráfego",
          "Teste desativando temporariamente ACLs para isolar o problema",
        ],
      },
    ],
  },
  {
    id: "high-packet-loss",
    title: "Alta Taxa de Perda de Pacotes",
    description:
      "Guia para diagnosticar e resolver problemas de perda de pacotes em uma conexão.",
    severity: "high",
    category: "Performance",
    symptoms: [
      "Ping com alta taxa de perda (>5%)",
      "Conexão lenta ou intermitente",
      "Erros frequentes nos logs",
    ],
    steps: [
      {
        number: 1,
        title: "Executar Ping Estendido",
        description:
          "Faça um ping com múltiplos pacotes para medir a taxa de perda.",
        commands: [
          {
            vendor: "Cisco",
            command: "ping -c 100 [IP-destino]",
          },
          {
            vendor: "Huawei",
            command: "ping -c 100 [IP-destino]",
          },
          {
            vendor: "Juniper",
            command: "ping -c 100 [IP-destino]",
          },
        ],
        tips: [
          "Taxa de perda <1% é aceitável",
          "Taxa de perda >5% indica problema significativo",
        ],
      },
      {
        number: 2,
        title: "Verificar Erros na Interface",
        description:
          "Procure por erros de CRC, colisões ou outros problemas na interface.",
        commands: [
          {
            vendor: "Cisco",
            command: "show interface [tipo/número]",
          },
          {
            vendor: "Huawei",
            command: "display interface [tipo/número]",
          },
          {
            vendor: "Juniper",
            command: "show interfaces [interface-name] extensive",
          },
        ],
        tips: [
          "Procure por 'CRC errors', 'input errors', 'output errors'",
          "Se houver muitos erros, pode ser problema no cabo ou transceptor",
        ],
      },
      {
        number: 3,
        title: "Verificar Utilização de Banda",
        description:
          "Confirme que a interface não está congestionada (utilização >80%).",
        commands: [
          {
            vendor: "Cisco",
            command: "show interface [tipo/número] | include load",
          },
          {
            vendor: "Huawei",
            command: "display interface [tipo/número]",
          },
          {
            vendor: "Juniper",
            command: "monitor interface [interface-name]",
          },
        ],
        tips: [
          "Se utilização >80%, considere aumentar a banda ou reduzir tráfego",
          "Verifique se há tráfego anômalo ou DDoS",
        ],
      },
      {
        number: 4,
        title: "Inspecionar Cabo e Transceptor",
        description:
          "Verifique a qualidade do cabo e os níveis de sinal do transceptor.",
        tips: [
          "Procure por danos físicos no cabo",
          "Teste com um cabo diferente",
          "Verifique se o transceptor está funcionando corretamente",
          "Substitua o transceptor se necessário",
        ],
      },
    ],
  },
  {
    id: "onu-offline",
    title: "ONU Offline (ZTE/GPON)",
    description:
      "Guia para diagnosticar e trazer ONUs offline de volta ao estado online.",
    severity: "high",
    category: "GPON",
    symptoms: [
      "ONU não aparece na lista de ONUs",
      "ONU aparece como 'offline' ou 'not-responding'",
      "Cliente sem acesso à internet",
    ],
    steps: [
      {
        number: 1,
        title: "Verificar Status da ONU",
        description: "Confirme o estado atual da ONU na OLT.",
        commands: [
          {
            vendor: "ZTE",
            command: "show gpon onu state [slot/porta] [onu-id]",
          },
          {
            vendor: "ZTE",
            command: "show gpon onu all",
          },
        ],
        tips: [
          "Procure pelo estado 'online' ou 'offline'",
          "Anote o ONU ID e a porta para referência",
        ],
      },
      {
        number: 2,
        title: "Verificar Sinais Ópticos",
        description:
          "Verifique os níveis de potência óptica da ONU (RX/TX).",
        commands: [
          {
            vendor: "ZTE",
            command: "show gpon remote-onu interface [onu-id] optical-info",
          },
        ],
        tips: [
          "Potência RX muito baixa (<-20 dBm) indica problema no cabo",
          "Potência TX muito alta (>5 dBm) pode indicar problema na ONU",
          "Valores normais: RX entre -20 e -8 dBm, TX entre -3 e 3 dBm",
        ],
      },
      {
        number: 3,
        title: "Reiniciar a ONU",
        description:
          "Faça um reset suave da ONU para tentar restaurar a conexão.",
        commands: [
          {
            vendor: "ZTE",
            command: "reboot gpon onu [slot/porta] [onu-id]",
          },
        ],
        tips: [
          "Aguarde 2-3 minutos para a ONU reiniciar",
          "Verifique o status novamente após o reinício",
        ],
      },
      {
        number: 4,
        title: "Verificar Cabo de Fibra Óptica",
        description:
          "Inspecione o cabo de fibra óptica para danos ou desconexões.",
        tips: [
          "Procure por danos visíveis no cabo",
          "Verifique se o conector está bem encaixado",
          "Teste com um cabo diferente se possível",
          "Use um testador de fibra óptica para medir a potência",
        ],
      },
      {
        number: 5,
        title: "Reset Completo da ONU",
        description:
          "Se os passos anteriores não funcionarem, faça um reset completo.",
        commands: [
          {
            vendor: "ZTE",
            command: "reset gpon onu [slot/porta] [onu-id]",
          },
        ],
        tips: [
          "Isso apagará todas as configurações da ONU",
          "Você precisará reconfigurar a ONU após o reset",
          "Contate o suporte se o problema persistir",
        ],
      },
    ],
  },
  {
    id: "slow-speed",
    title: "Velocidade Lenta de Conexão",
    description:
      "Guia para diagnosticar problemas de velocidade lenta em conexões de dados.",
    severity: "medium",
    category: "Performance",
    symptoms: [
      "Velocidade abaixo do esperado",
      "Downloads lentos",
      "Streaming com buffering frequente",
    ],
    steps: [
      {
        number: 1,
        title: "Testar Velocidade",
        description:
          "Execute um teste de velocidade para confirmar a velocidade real.",
        tips: [
          "Use ferramentas como iperf, speedtest ou similar",
          "Teste em horários diferentes para descartar congestionamento",
          "Compare com a velocidade contratada",
        ],
      },
      {
        number: 2,
        title: "Verificar Utilização de Banda",
        description:
          "Confirme que não há congestionamento na interface.",
        commands: [
          {
            vendor: "Cisco",
            command: "show interface [tipo/número] | include load",
          },
          {
            vendor: "Huawei",
            command: "display interface [tipo/número]",
          },
          {
            vendor: "Juniper",
            command: "monitor interface [interface-name]",
          },
        ],
        tips: [
          "Se utilização >80%, há congestionamento",
          "Procure por tráfego anômalo ou aplicações consumindo banda",
        ],
      },
      {
        number: 3,
        title: "Verificar Velocidade Negociada",
        description:
          "Confirme que a interface está negociando a velocidade correta.",
        commands: [
          {
            vendor: "Cisco",
            command: "show interface [tipo/número] | include speed",
          },
          {
            vendor: "Huawei",
            command: "display interface [tipo/número]",
          },
        ],
        tips: [
          "Procure por 'speed 1000Mb/s' ou similar",
          "Se estiver em velocidade reduzida (10Mb/s), há problema na negociação",
        ],
      },
      {
        number: 4,
        title: "Verificar Duplex",
        description:
          "Confirme que a interface está em full-duplex, não half-duplex.",
        commands: [
          {
            vendor: "Cisco",
            command: "show interface [tipo/número] | include duplex",
          },
          {
            vendor: "Huawei",
            command: "display interface [tipo/número]",
          },
        ],
        tips: [
          "Half-duplex reduz significativamente a velocidade",
          "Configure para full-duplex se necessário",
        ],
      },
    ],
  },
  {
    id: "onu-signal-weak",
    title: "Sinal Fraco da ONU (ZTE/GPON)",
    description:
      "Guia para diagnosticar e corrigir problemas de sinal fraco em ONUs, resultando em velocidade reduzida ou desconexões.",
    severity: "medium",
    category: "GPON",
    symptoms: [
      "ONU online mas com velocidade lenta",
      "Desconexões frequentes",
      "Sinal RX muito baixo (<-20 dBm)",
    ],
    steps: [
      {
        number: 1,
        title: "Verificar Potência Óptica da ONU",
        description:
          "Verifique os níveis de potência RX (recebimento) e TX (transmissão) da ONU.",
        commands: [
          {
            vendor: "ZTE",
            command: "show gpon remote-onu interface [onu-id] optical-info",
          },
          {
            vendor: "ZTE",
            command: "show gpon onu performance [slot/porta] [onu-id]",
          },
        ],
        tips: [
          "RX ideal: entre -20 e -8 dBm",
          "TX ideal: entre -3 e 3 dBm",
          "RX < -25 dBm indica problema no cabo ou conector",
          "TX > 5 dBm pode indicar problema na ONU",
        ],
      },
      {
        number: 2,
        title: "Inspecionar Cabo de Fibra Óptica",
        description:
          "Verifique o cabo de fibra óptica por danos, sujeira ou desconexões.",
        tips: [
          "Procure por danos visíveis no cabo (amassados, dobrados)",
          "Limpe os conectores com álcool isopropílico",
          "Verifique se o conector está bem encaixado",
          "Teste com um cabo de fibra diferente",
        ],
      },
      {
        number: 3,
        title: "Verificar Atenuação da Fibra",
        description:
          "Use um testador de fibra óptica para medir a atenuação do cabo.",
        tips: [
          "Atenuação normal: 0,3-0,4 dB/km para fibra monomodo",
          "Atenuação > 0,5 dB/km indica problema no cabo",
          "Se possível, faça teste OTDR (Optical Time-Domain Reflectometer)",
        ],
      },
      {
        number: 4,
        title: "Verificar Potência da OLT",
        description:
          "Confirme que a potência de transmissão da OLT está adequada.",
        commands: [
          {
            vendor: "ZTE",
            command: "show gpon olt port [slot/porta] optical-info",
          },
        ],
        tips: [
          "Potência TX da OLT deve estar entre 0 e 5 dBm",
          "Se muito baixa, pode indicar problema no transceptor da OLT",
        ],
      },
      {
        number: 5,
        title: "Reiniciar ONU e OLT",
        description:
          "Se o sinal ainda estiver fraco, reinicie a ONU e a porta da OLT.",
        commands: [
          {
            vendor: "ZTE",
            command: "reboot gpon onu [slot/porta] [onu-id]",
          },
          {
            vendor: "ZTE",
            command: "reboot gpon olt-port [slot/porta]",
          },
        ],
        tips: [
          "Aguarde 2-3 minutos para reinicialização completa",
          "Verifique os sinais novamente após reinício",
        ],
      },
    ],
  },
  {
    id: "onu-authentication-failed",
    title: "Falha de Autenticação da ONU (ZTE/GPON)",
    description:
      "Guia para resolver problemas quando a ONU não consegue autenticar na OLT.",
    severity: "high",
    category: "GPON",
    symptoms: [
      "ONU descoberta mas não autentica",
      "Estado 'not-authenticated' ou 'auth-failed'",
      "Mensagens de erro de autenticação nos logs",
    ],
    steps: [
      {
        number: 1,
        title: "Verificar Status de Autenticação",
        description: "Confirme o estado de autenticação da ONU.",
        commands: [
          {
            vendor: "ZTE",
            command: "show gpon onu state [slot/porta] [onu-id]",
          },
          {
            vendor: "ZTE",
            command: "show gpon onu all | include [onu-id]",
          },
        ],
        tips: [
          "Procure pelo estado 'authenticated' ou 'not-authenticated'",
          "Anote o motivo da falha se disponível",
        ],
      },
      {
        number: 2,
        title: "Verificar Configuração de Autenticação na OLT",
        description:
          "Confirme que a ONU está configurada para autenticar corretamente.",
        commands: [
          {
            vendor: "ZTE",
            command: "show gpon onu config [slot/porta] [onu-id]",
          },
        ],
        tips: [
          "Verifique se o tipo de ONU está correto",
          "Confirme que o serial number da ONU está registrado",
        ],
      },
      {
        number: 3,
        title: "Verificar Certificados e Chaves",
        description:
          "Confirme que os certificados de autenticação estão válidos.",
        commands: [
          {
            vendor: "ZTE",
            command: "show gpon onu certificate [slot/porta] [onu-id]",
          },
        ],
        tips: [
          "Certificados expirados podem causar falha de autenticação",
          "Atualize os certificados se necessário",
        ],
      },
      {
        number: 4,
        title: "Forçar Reautenticação",
        description:
          "Force a ONU a se autenticar novamente na OLT.",
        commands: [
          {
            vendor: "ZTE",
            command: "authenticate gpon onu [slot/porta] [onu-id]",
          },
        ],
        tips: [
          "Aguarde 30-60 segundos para reautenticação",
          "Verifique o status novamente",
        ],
      },
      {
        number: 5,
        title: "Reset e Reconfigurção",
        description:
          "Se persistir, faça reset completo e reconfigure a ONU.",
        commands: [
          {
            vendor: "ZTE",
            command: "reset gpon onu [slot/porta] [onu-id]",
          },
        ],
        tips: [
          "Isso apagará todas as configurações",
          "Reconfigure a ONU após o reset",
          "Contate o suporte se o problema persistir",
        ],
      },
    ],
  },
  {
    id: "onu-traffic-error",
    title: "Erros de Tráfego na ONU (ZTE/GPON)",
    description:
      "Guia para diagnosticar e resolver erros de tráfego (FEC, CRC) em ONUs.",
    severity: "medium",
    category: "GPON",
    symptoms: [
      "ONU online mas com muitos erros",
      "Taxa de erro FEC alta",
      "Desconexões intermitentes",
      "Velocidade reduzida",
    ],
    steps: [
      {
        number: 1,
        title: "Verificar Estatísticas de Erro",
        description:
          "Verifique os contadores de erro FEC e CRC da ONU.",
        commands: [
          {
            vendor: "ZTE",
            command: "show gpon onu performance [slot/porta] [onu-id]",
          },
          {
            vendor: "ZTE",
            command: "show gpon onu traffic [slot/porta] [onu-id]",
          },
        ],
        tips: [
          "FEC errors > 1000 por minuto indica problema",
          "CRC errors devem ser zero ou muito baixos",
          "Anote os valores para comparação posterior",
        ],
      },
      {
        number: 2,
        title: "Verificar Qualidade do Sinal",
        description:
          "Confirme que a potência óptica está dentro dos limites normais.",
        commands: [
          {
            vendor: "ZTE",
            command: "show gpon remote-onu interface [onu-id] optical-info",
          },
        ],
        tips: [
          "RX fraco pode causar erros FEC altos",
          "Procure por flutuações na potência",
        ],
      },
      {
        number: 3,
        title: "Inspecionar Cabo e Conectores",
        description:
          "Verifique o cabo de fibra óptica por danos ou sujeira.",
        tips: [
          "Limpe os conectores com álcool isopropílico",
          "Procure por danos visíveis",
          "Teste com um cabo diferente",
        ],
      },
      {
        number: 4,
        title: "Reiniciar ONU",
        description: "Reinicie a ONU para limpar contadores de erro.",
        commands: [
          {
            vendor: "ZTE",
            command: "reboot gpon onu [slot/porta] [onu-id]",
          },
        ],
        tips: [
          "Aguarde 2-3 minutos para reinicialização",
          "Monitore os erros após reinício",
        ],
      },
      {
        number: 5,
        title: "Verificar Compatibilidade de Transceptor",
        description:
          "Confirme que o transceptor SFP é compatível com a ONU.",
        tips: [
          "Transceptores incompatíveis podem causar erros",
          "Substitua por um transceptor compatível se necessário",
        ],
      },
    ],
  },
  {
    id: "olt-port-down",
    title: "Porta da OLT Down (ZTE/GPON)",
    description:
      "Guia para diagnosticar e resolver problemas quando uma porta da OLT está down.",
    severity: "high",
    category: "GPON",
    symptoms: [
      "Porta da OLT aparece como down",
      "Todas as ONUs da porta offline",
      "Sem tráfego na porta",
    ],
    steps: [
      {
        number: 1,
        title: "Verificar Status da Porta",
        description: "Confirme o estado da porta da OLT.",
        commands: [
          {
            vendor: "ZTE",
            command: "show gpon olt port [slot/porta]",
          },
          {
            vendor: "ZTE",
            command: "show gpon olt port [slot/porta] optical-info",
          },
        ],
        tips: [
          "Procure pelo estado 'up' ou 'down'",
          "Verifique a potência óptica TX/RX",
        ],
      },
      {
        number: 2,
        title: "Verificar Conectividade Física",
        description:
          "Inspecione o cabo de fibra óptica conectado à porta.",
        tips: [
          "Procure por danos no cabo",
          "Verifique se o conector está bem encaixado",
          "Teste com um cabo diferente",
        ],
      },
      {
        number: 3,
        title: "Verificar Transceptor SFP",
        description:
          "Confirme que o transceptor SFP está funcionando corretamente.",
        commands: [
          {
            vendor: "ZTE",
            command: "show gpon olt port [slot/porta] transceiver-info",
          },
        ],
        tips: [
          "Transceptor defeituoso pode causar porta down",
          "Substitua o transceptor se necessário",
        ],
      },
      {
        number: 4,
        title: "Ativar a Porta",
        description: "Se a porta estiver administrativamente down, ative-a.",
        commands: [
          {
            vendor: "ZTE",
            command: "no shutdown gpon olt-port [slot/porta]",
          },
        ],
        tips: [
          "Aguarde 30 segundos para a porta ativar",
          "Verifique o status novamente",
        ],
      },
      {
        number: 5,
        title: "Reiniciar Porta da OLT",
        description: "Se necessário, reinicie a porta da OLT.",
        commands: [
          {
            vendor: "ZTE",
            command: "reboot gpon olt-port [slot/porta]",
          },
        ],
        tips: [
          "Aguarde 1-2 minutos para reinicialização",
          "Todas as ONUs da porta ficarão offline temporariamente",
        ],
      },
    ],
  },
];

export const troubleshootingCategories = [
  "Interface",
  "Conectividade",
  "Performance",
  "GPON",
];
