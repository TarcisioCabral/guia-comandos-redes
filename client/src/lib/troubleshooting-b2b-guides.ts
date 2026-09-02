import { TroubleshootingGuide } from "./troubleshooting-guides";

export const troubleshootingB2BGuides: TroubleshootingGuide[] = [
  {
    id: "vpn-site-to-site-down",
    title: "VPN Site-to-Site Down (IPsec)",
    description:
      "Guia para diagnosticar e resolver problemas em túneis VPN IPsec entre matriz e filial.",
    severity: "high",
    category: "VPN",
    symptoms: [
      "Túnel VPN em estado 'down'",
      "Sem comunicação entre sub-redes remotas",
      "Falha na fase 1 ou fase 2 do IKE",
    ],
    steps: [
      {
        number: 1,
        title: "Verificar Status do Túnel",
        description: "Confirme o estado atual da associação de segurança (SA) do IPsec.",
        commands: [
          {
            vendor: "Cisco",
            command: "show crypto isakmp sa",
          },
          {
            vendor: "Cisco",
            command: "show crypto ipsec sa",
          },
          {
            vendor: "Fortigate",
            command: "get vpn ipsec tunnel details",
          },
        ],
        tips: [
          "Verifique se o estado é 'QM_IDLE' (Cisco) ou similar",
          "Se não houver SA, a fase 1 falhou",
        ],
      },
      {
        number: 2,
        title: "Verificar Logs de IKE",
        description: "Analise os logs para identificar se o erro está na fase 1 ou fase 2.",
        commands: [
          {
            vendor: "Cisco",
            command: "debug crypto isakmp",
          },
          {
            vendor: "Fortigate",
            command: "diagnose vpn ike log filter dst [remote-ip]",
          },
        ],
        tips: [
          "Erro 'mismatched preshared key' indica senha errada",
          "Erro 'no proposal chosen' indica divergência de algoritmos",
        ],
      },
      {
        number: 3,
        title: "Confirmar ACLs e NAT",
        description: "Garanta que o tráfego do túnel não está sendo bloqueado ou sofrendo NAT indevido.",
        tips: [
          "O tráfego de interesse deve bater com a ACL de ambos os lados",
          "Exclua o tráfego VPN do NAT (NAT Overload/Masquerade)",
        ],
      },
    ],
  },
  {
    id: "mpls-l3vpn-bgp-down",
    title: "Sessão BGP Down em L3VPN MPLS",
    description:
      "Diagnóstico de queda de vizinhança BGP entre o PE (Provider Edge) e o CE (Customer Edge).",
    severity: "high",
    category: "MPLS",
    symptoms: [
      "Rotas remotas sumiram da tabela",
      "Vizinho BGP em estado 'Idle' ou 'Active'",
      "Ping para o IP de loopback do PE falha",
    ],
    steps: [
      {
        number: 1,
        title: "Verificar Vizinhos BGP",
        description: "Veja o estado atual da sessão BGP.",
        commands: [
          {
            vendor: "Cisco",
            command: "show ip bgp summary",
          },
          {
            vendor: "Huawei",
            command: "display bgp peer",
          },
        ],
        tips: [
          "Estado 'Established' é o único correto para troca de rotas",
          "Se estiver em 'Active', o roteador está tentando iniciar a conexão",
        ],
      },
      {
        number: 2,
        title: "Verificar Conectividade de Camada 3",
        description: "Tente pingar o IP do vizinho.",
        commands: [
          {
            vendor: "Cisco",
            command: "ping [neighbor-ip]",
          },
        ],
        tips: [
          "Se o ping falhar, o problema pode ser físico ou de interface",
          "Verifique se há filtros de entrada/saída (ACLs) bloqueando a porta TCP 179",
        ],
      },
    ],
  },
  {
    id: "dedicated-link-saturation",
    title: "Saturação de Link Dedicado",
    description:
      "Identificação de gargalos em links dedicados de alta performance.",
    severity: "medium",
    category: "WAN",
    symptoms: [
      "Latência alta apenas em horário comercial",
      "Perda de pacotes em horários de pico",
      "Reclamações de lentidão em sistemas ERP",
    ],
    steps: [
      {
        number: 1,
        title: "Análise de NetFlow/SNMP",
        description: "Identifique qual IP ou protocolo está consumindo a banda.",
        commands: [
          {
            vendor: "Cisco",
            command: "show ip cache flow",
          },
        ],
        tips: [
          "Procure por backups em horário indevido",
          "Verifique se há ataques de DDoS vindo da rede externa",
        ],
      },
    ],
  },
  {
    id: "huawei-b2b-diagnostics",
    title: "Diagnósticos B2B - Huawei (NE e Switches)",
    description: "Principais comandos para verificar circuitos B2B e LTL em equipamentos Huawei.",
    severity: "low",
    category: "Huawei",
    symptoms: [
      "Circuito LTL/VPLS inoperante",
      "Cliente IP Dedicado sem navegação",
      "Perda de pacotes na rede Master",
    ],
    steps: [
      {
        number: 1,
        title: "Verificar Interfaces e Configurações",
        description: "Confirme o status das interfaces e suas configurações aplicadas.",
        commands: [
          { vendor: "Huawei", command: "dis ip interface brief" },
          { vendor: "Huawei", command: "dis cu int [INTERFACE]" },
          { vendor: "Huawei", command: "dis interface [INTERFACE]" }
        ],
        tips: ["Use 'dis interface' para ver descartes de pacotes e erros físicos."]
      },
      {
        number: 2,
        title: "Diagnósticos de Camada 2 (MAC e VLAN)",
        description: "Verifique se o MAC do cliente está sendo aprendido na VLAN ou VSI.",
        commands: [
          { vendor: "Huawei", command: "dis mac-address vlan [VLAN-ID]" },
          { vendor: "Huawei", command: "dis mac-address vsi [NOME-VSI]" },
          { vendor: "Huawei", command: "dis vlan [VLAN-ID]" }
        ]
      },
      {
        number: 3,
        title: "Testes de Rede MPLS (VPLS e L2VC)",
        description: "Use ferramentas de ping e tracert exclusivas para a malha MPLS.",
        commands: [
          { vendor: "Huawei", command: "ping vpls vsi [NOME-VSI] peer [IP-DO-SWITCH]" },
          { vendor: "Huawei", command: "tracert vpls vsi [NOME-VSI] peer [IP-DO-SWITCH]" },
          { vendor: "Huawei", command: "ping vc vlan [VLAN-ID] label-alert no-control-word" }
        ],
        tips: ["Estes comandos verificam a comunicação do túnel MPLS dentro do backbone."]
      },
      {
        number: 4,
        title: "Verificações de Sinal e Clientes PPPoE/Dedicado",
        description: "Valide potência do link óptico e status de autenticação.",
        commands: [
          { vendor: "Huawei", command: "dis transceiver diagnosis interface [INTERFACE]" },
          { vendor: "Huawei", command: "dis access-user username [USER]" },
          { vendor: "Huawei", command: "dis access-user qos-profile RADIUS-NO-QOS-PROFILE" },
          { vendor: "Huawei", command: "display aaa online fail-record username [USER]" }
        ]
      },
      {
        number: 5,
        title: "Outros Comandos Úteis",
        description: "Valide informações adicionais de L2VC, LLDP, Jumbo Frames e Vlanif.",
        commands: [
          { vendor: "Huawei", command: "dis lldp neighbor brief" },
          { vendor: "Huawei", command: "tracert vc vlan [VLAN-ID] label-alert no-control-word" },
          { vendor: "Huawei", command: "dis cu int vlanif [VLAN]" },
          { vendor: "Huawei", command: "ping -c 1000 -s 9000 [IP]" }
        ],
        tips: ["Use o ping com tamanho 9000 para testar a passagem de jumbo frames na rede."]
      }
    ]
  },
  {
    id: "zte-b2b-diagnostics",
    title: "Diagnósticos B2B - ZTE",
    description: "Comandos básicos de validação e troubleshooting em switches ZTE para B2B.",
    severity: "low",
    category: "ZTE",
    symptoms: [
      "Lentidão ou falha de comunicação no switch ZTE",
      "Dúvida sobre sinal óptico ou portas"
    ],
    steps: [
      {
        number: 1,
        title: "Verificação Geral e IP",
        description: "Valide as configurações e IPs no equipamento.",
        commands: [
          { vendor: "ZTE", command: "show clock" },
          { vendor: "ZTE", command: "show version" },
          { vendor: "ZTE", command: "show ip interface brief" },
          { vendor: "ZTE", command: "show running config" }
        ]
      },
      {
        number: 2,
        title: "Sinal Óptico e Estatísticas",
        description: "Verifique atenuação óptica e uso de banda.",
        commands: [
          { vendor: "ZTE", command: "show optical info brief | in [PORTA]" },
          { vendor: "ZTE", command: "show intf-statistics utilization" },
          { vendor: "ZTE", command: "clear statistics interface" }
        ],
        tips: ["Use o clear statistics para zerar os contadores e verificar se há aumento de erros em tempo real."]
      },
      {
        number: 3,
        title: "Reiniciar Porta (Shutdown)",
        description: "Como forçar o reinício de uma porta para restabelecer conexão.",
        commands: [
          { vendor: "ZTE", command: "config terminal\ninterface [PORTA]\nshutdown\ncommit\nno shutdown\ncommit\nexit" }
        ]
      }
    ]
  },
  {
    id: "mikrotik-bandwidth-test",
    title: "Teste de Banda Isolado (Mikrotik Bandwidth Test)",
    description: "Procedimento para testar a banda do cliente B2B utilizando uma Mikrotik diretamente.",
    severity: "medium",
    category: "Mikrotik",
    symptoms: [
      "Cliente relata que banda não chega ao contratado",
      "Necessidade de validar links acima de 1Gbps internamente"
    ],
    steps: [
      {
        number: 1,
        title: "Preparar a Mikrotik do Cliente",
        description: "Configure o IP do cliente (ou PPPoE) na interface ether1 e adicione a rota default.",
        tips: [
          "Se a ONU estiver em 'transparent', o tráfego vem tagueado e você precisa criar a VLAN.",
          "Crie a rota: Dst Address 0.0.0.0/0 apontando para o Gateway do cliente."
        ]
      },
      {
        number: 2,
        title: "Executar o Bandwidth Test",
        description: "Use a ferramenta Tools > Bandwidth Test no Winbox.",
        tips: [
          "Aponte para o IP de uma Mikrotik de testes da Master (Ex: DVL-RBW 191.53.192.1).",
          "Use o protocolo UDP para evitar o overhead do TCP e estressar o link máximo.",
          "Direction: 'send' para upload, 'receive' para download."
        ]
      }
    ]
  },
  {
    id: "datacom-edd-config",
    title: "Validação Switch Datacom (EDD)",
    description: "Verificação de equipamentos Datacom EDD 2104 e 4370 instalados em clientes.",
    severity: "low",
    category: "Datacom",
    symptoms: [
      "Equipamento monitorado via SNMP sem resposta",
      "Validação de portas untagged/tagged"
    ],
    steps: [
      {
        number: 1,
        title: "Acesso e Visualização",
        description: "Logue com usuário nocuser e verifique as VLANs.",
        commands: [
          { vendor: "Datacom", command: "show vlan" },
          { vendor: "Datacom", command: "show interface" }
        ],
        tips: ["Verifique se o switchport native vlan e set-member tagged/untagged estão corretos."]
      }
    ]
  },
  {
    id: "b2b-products-info",
    title: "Produtos B2B (IP Dedicado, LTL, Wifeed)",
    description: "Informações sobre a arquitetura dos produtos B2B Master.",
    severity: "low",
    category: "Produtos",
    symptoms: [
      "Dúvida sobre topologia de um produto"
    ],
    steps: [
      {
        number: 1,
        title: "IP Dedicado e IP Fixo",
        description: "Entenda a entrega de blocos IP.",
        tips: [
          "IP Dedicado pode ser entregue direto com o bloco na interface (gateway) ou via Bloco de Enlace (/30 privado) com Rota Estática apontando o bloco válido.",
          "IP Fixo (IP Light): IPV4 estático via PPPoE ou DHCP, passa por firewall."
        ]
      },
      {
        number: 2,
        title: "Lan To Lan (LTL)",
        description: "Comunicação camada 2.",
        tips: [
          "VPWS (L2VC): Comunicação ponto a ponto na malha MPLS.",
          "VPLS (VSI): Comunicação ponto-multiponto."
        ]
      },
      {
        number: 3,
        title: "Wifeed",
        description: "Integração Wifi Seguro.",
        tips: ["Pode usar IP Dedicado, Fixo ou Dinâmico. Exige cadastro na plataforma Wifeed para liberar navegação."]
      },
      {
        number: 4,
        title: "IP Trânsito e Transporte PTT",
        description: "Produtos de alta capacidade gerenciados diretamente pela equipe de engenharia.",
        tips: [
          "IP Trânsito: Sessão BGP entre Master e o Contratante (na maioria provedores).",
          "Transporte PTT: LTL na malha MPLS onde a ponta B é o PTT."
        ]
      }
    ]
  },
  {
    id: "config-ip-dedicado-2025",
    title: "Provisionamento IP Dedicado (Estrutura 2025)",
    description: "Configuração com redundância de PE (Primário e Secundário) via Global-VE.",
    severity: "low",
    category: "Provisionamento",
    symptoms: [
      "Necessidade de provisionar novo IP Dedicado B2B"
    ],
    steps: [
      {
        number: 1,
        title: "Determinar Hierarquia de PE",
        description: "Identifique o PE Primário e Secundário com base na cidade.",
        tips: [
          "BHE (MG-BHE-ATV-RSV-01) como Primário: Divinópolis, Itaúna, Betim, BH, Lavras, Passos, Sete Lagoas, Montes Claros, Paracatu, etc.",
          "SP (SP-BRE-SP4-RSV-01) como Primário: Pouso Alegre, Santa Rita do Sapucaí, Itajubá, Lorena, Taubaté, SJC, etc."
        ]
      },
      {
        number: 2,
        title: "Configurar Sub-interfaces no NE",
        description: "Crie a sub-interface com IP do gateway e a sub-interface do túnel MPLS.",
        commands: [
          { vendor: "Huawei", command: "interface Global-VE 1.[VLAN]\nvlan-type dot1q [VLAN]\nip address [IP] [MASCARA]\nl3ve track pw-state" },
          { vendor: "Huawei", command: "interface Global-VE 0.[VLAN]\nvlan-type dot1q [VLAN]\nmpls l2vc [IP-SWITCH-REGIONAL] [VCID] control-word" }
        ],
        tips: ["Sempre aplique as descrições padronizadas e traffic-policy nas interfaces."]
      },
      {
        number: 3,
        title: "Configurar Divulgação BGP (Prefix-Lists)",
        description: "Permita o bloco de IP nas prefix-lists de exportação para que o tráfego saia para a internet.",
        commands: [
          { vendor: "Huawei", command: "bgp 28202\nipv4-family unicast\nnetwork [IP-REDE] [MASCARA] route-policy ADD-COMM\nexit\nip ip-prefix BHE-20Gb-DWDM-EXPORT permit [IP-REDE] [MASCARA]\nip ip-prefix BRE-DVL-ELT-EXPORT permit [IP-REDE] [MASCARA]" }
        ],
        tips: ["Se esquecer de permitir na ip-prefix, o bloco será anunciado mas pode ser filtrado pelas operadoras de trânsito."]
      },
      {
        number: 4,
        title: "Configurar Switch MPLS da Regional",
        description: "Configure o túnel L2VC com redundância apontando para ambos os NEs.",
        commands: [
          { vendor: "Huawei", command: "interface vlanif [VLAN]\nmpls l2vc [IP-NE-PRIMARIO] [VCID] control-word\nmpls l2vpn flow-label-both\nmpls l2vc [IP-NE-SECUNDARIO] [VCID] control-word secondary\nmpls l2vpn redundancy master" }
        ]
      }
    ]
  },
  {
    id: "config-zte-provisioning",
    title: "Provisionamento B2B - Switch ZTE",
    description: "Procedimento completo para configurar um cliente B2B em Switch ZTE, incluindo o gateway no NE (Huawei) e o túnel VPWS.",
    severity: "low",
    category: "Provisionamento",
    symptoms: ["Necessidade de configurar cliente B2B em Switch ZTE (SLA/CTR)"],
    steps: [
      {
        number: 1,
        title: "Configuração no NE (Huawei) - Gateway do Cliente",
        description: "Criação da sub-interface Global-VE para o gateway e aplicação de políticas de tráfego.",
        commands: [
          {
            vendor: "Huawei",
            command: "sys //entrar no modo de configuração\n\ninterface Global-VE 1.1479 //criar subinterafce para o gateway do cliente\n\nvlan-type dot1q 1479 //vincular a vlan na interface\n\ndescription CLI | IPD-SLA | IGN | 1077267 | 400MB //descrição para a interface\n\nip address 186.216.96.193 29 //setar IP de gateway do cliente\n\nstatistic enable //habilitar a coleta de estatísticas\n\ntraffic-policy TRAFFIC_POLICY_400MB inbound //limitar tráfego de entrada\n\ntraffic-policy TRAFFIC_POLICY_400MB outbound //limitar tráfego de saída\n\nl3ve track pw-state //monitorar estado do pseudo-wire\n\nquit //sair da interface"
          }
        ],
        tips: ["Repetir esta configuração nos NEs de BHE e BRE conforme a topologia."]
      },
      {
        number: 2,
        title: "Configuração no NE (Huawei) - Comunicação MPLS",
        description: "Criação da sub-interface Global-VE para o túnel L2VC com o switch regional.",
        commands: [
          {
            vendor: "Huawei",
            command: "interface Global-VE 0.1479 //criar subinterafce para comunicação MPLS\n\nvlan-type dot1q 1479 //vincular a vlan na interface\n\ndescription CLI | IPD-SLA | IGN | 1077267 | 400MB //descrição para a interface\n\nstatistic enable //habilitar a coleta de estatísticas\n\nmpls l2vc 172.16.255.40 1479251479 //aplica o L2VC para comunicar com o switch regional\n\nq //sair da interface"
          }
        ]
      },
      {
        number: 3,
        title: "Switch ZTE - Interfaces e VLAN",
        description: "Ativação das interfaces físicas e sub-interfaces no switch ZTE.",
        commands: [
          {
            vendor: "ZTE",
            command: "Config terminal //entrar no modo de configuração\n\ninterface xgei-0/1/1/5 //entrar na interface física\n\nno shutdown //ativar interface\n\nexit\n\ninterface xgei-0/1/1/5.1479 //criar sub-interface para o cliente\n\ndescription CLI | IPD-SLA | IGN | 1077267 | 400MB //definir descrição\n\nno shutdown //ativar sub-interface\n\nexit\n\nvlan-configuration //entrar em configurações de vlan\n\ninterface xgei-0/1/1/5.1479 //acessar configurações de vlan da sub-interface\n\nencapsulation-dot1q 1479 //vincular vlan na interface\n\nexit"
          }
        ]
      },
      {
        number: 4,
        title: "Switch ZTE - Pseudo-wire e VPWS (MPLS)",
        description: "Criação do VPWS e configuração dos pseudo-wires principal e backup.",
        commands: [
          {
            vendor: "ZTE",
            command: "pw pw1479251479 //cria pseudo-wire principal para o MPLS\n\npw pw147925 //cria pseudo-wire para backup\n\nvpws CLI-IPD-IGN-1077267-400MB //cria o VPWS para o cliente\n\naccess-point xgei-0/1/1/5.1479 //define a porta de acesso\n\naccess-params ethernet //tráfego tratado como ethernet\n\nexit\n\npseudo-wire pw1479251479 //configura o pseudo-wire principal\n\nneighbour 172.16.255.110 vcid 1479251479 //IP da extremidade (NE)\n\nencapsulation tagged //manter vlan original\n\nvccv bfd capability status encapsulation ip\n\nexit"
          },
          {
            vendor: "ZTE",
            command: "redundancy-manager\n\npfs-bits negotiate master\n\nprotect-type 1:1 unidirectional receiving both protect-strategy aps\n\nexit\n\nexit\n\nbackup-pw pw147925 protect pw1479251479 //configura pseudo-wire de backup\n\nneighbour 172.16.255.111 vcid 1479251479\n\nvccv bfd capability status encapsulation ip\n\nexit\n\nexit\n\nexit\n\ncommit //aplicar as configurações"
          }
        ],
        tips: ["Após o commit, você já deverá conseguir pingar o L2VC de BRE e BHE."]
      }
    ]
  },
  {
    id: "config-limitacao-trafego",
    title: "Limitação de Tráfego em Switches/NEs",
    description: "Como aplicar políticas de limitação de banda em circuitos LTL e IP Dedicado.",
    severity: "low",
    category: "Provisionamento",
    symptoms: [
      "Circuito sem controle de banda adequado"
    ],
    steps: [
      {
        number: 1,
        title: "Traffic Policy Roteadores B2B (Novo)",
        description: "Aplica o limite usando políticas globais já criadas.",
        commands: [
          { vendor: "Huawei", command: "interface Global-VE 1.[VLAN]\ntraffic-policy TRAFFIC_POLICY_[BANDA] inbound\ntraffic-policy TRAFFIC_POLICY_[BANDA] outbound" }
        ]
      },
      {
        number: 2,
        title: "Limitação por Vlan em Switches de Acesso",
        description: "Criar classificador e aplicar o comportamento limitador na interface.",
        commands: [
          { vendor: "Huawei", command: "traffic classifier B2B-NOC\nif-match vlan [VLAN]" },
          { vendor: "Huawei", command: "traffic behavior B2B-NOC\ncar cir [VALOR_KBPS] pir [VALOR_KBPS] green pass yellow pass red discard" },
          { vendor: "Huawei", command: "traffic policy B2B-NOC\nclassifier B2B-NOC behavior B2B-NOC" },
          { vendor: "Huawei", command: "interface [INT]\ntraffic-policy B2B-NOC inbound\ntraffic-policy B2B-NOC outbound" }
        ],
        tips: ["Os valores de banda no 'car cir' devem ser sempre calculados em KBPS."]
      }
    ]
  },
  {
    id: "config-huawei-mpls",
    title: "MPLS Backbone: VPLS (VSI) e VPWS (L2VC)",
    description: "Configuração de túneis Camada 2 na malha MPLS para comunicação entre regionais.",
    severity: "low",
    category: "Provisionamento",
    symptoms: [
      "Necessidade de criar novo circuito Lan To Lan (LTL)",
      "Comunicação ponto-a-ponto ou ponto-multiponto entre cidades"
    ],
    steps: [
      {
        number: 1,
        title: "VPLS (VSI) - Ponto-Multiponto",
        description: "Cria um túnel capaz de comunicar múltiplas pontas. Requer OSPF, MPLS e LDP operantes (Underlay).",
        commands: [
          { vendor: "Huawei", command: "vsi [NOME_VSI]\npwsignal ldp\nvsi-id [ID]\npeer [IP_REMOTA]\nflow-label both" },
          { vendor: "Huawei", command: "sys\ninterface vlanif [VLAN]\nl2 binding vsi [NOME_VSI]" }
        ],
        tips: [
          "A VSI só ficará UP após a VLAN ser configurada em uma interface física que também esteja UP.",
          "Se configurar em um switch, deve replicar no switch remoto alterando o IP do peer para o IP local do primeiro.",
          "Para verificar MACs aprendidos na VSI: 'dis mac-address vsi [NOME_VSI]'."
        ]
      },
      {
        number: 2,
        title: "VPWS (L2VC) - Ponto-a-Ponto",
        description: "Utilizado para ligar uma ponta 'A' a uma ponta 'B' de forma simples.",
        commands: [
          { vendor: "Huawei", command: "interface vlanif [VLAN]\ndesc BHE<>BRE-RYAN\nmpls l2vc [IP_PROXIMO_DISPOSITIVO] [VCID]\nmpls l2vpn flow-label both" }
        ],
        tips: [
          "Diferente da VSI, no L2VC não é possível aprender endereços MAC na VLAN nos switches.",
          "O identificador (VCID) deve ser o mesmo em ambas as pontas do circuito."
        ]
      },
      {
        number: 3,
        title: "Configurar QinQ",
        description: "Encapsula VLANs do cliente dentro da VLAN da Master (ex: Vlan 1005).",
        commands: [
          { vendor: "Huawei", command: "interface [INT]\nport link-type dot1q-tunnel\nport default vlan 1005" }
        ]
      }
    ]
  },
  {
    id: "config-datacom-2104",
    title: "Configuração EDD Datacom 2104 (1GB)",
    description: "Configuração completa para o modelo EDD 2104, incluindo gerência, SNMP e VLANs.",
    severity: "low",
    category: "Provisionamento",
    symptoms: [
      "Instalação de novo EDD 2104 para monitoramento SNMP",
      "Necessidade de configurar gerência e link B2B"
    ],
    steps: [
      {
        number: 1,
        title: "Nome, Horário e Usuários",
        description: "Configure o hostname, timezone e crie o usuário nocuser.",
        commands: [
          { vendor: "Datacom", command: "configure\nhostname [NOME-EDD]\nclock timezone BRA -3\nexit\nclock set [HH:MM:SS] [DD] [MM] [YYYY]" },
          { vendor: "Datacom", command: "configure\nusername nocuser access-level 15\nusername nocuser password 0 %$NoC.2018" }
        ]
      },
      {
        number: 2,
        title: "Segurança e SNMP",
        description: "Habilite SSH, desabilite Telnet e configure a community SNMP.",
        commands: [
          { vendor: "Datacom", command: "no ip telnet server\nno ip http secure-server\nip ssh host-key generate dsa\nip ssh server" },
          { vendor: "Datacom", command: "ip snmp-server\nip snmp-server location [CIDADE]\nip snmp-server community [COMMUNITY]" }
        ]
      },
      {
        number: 3,
        title: "VLAN de Dados e Gerência",
        description: "Crie as VLANs e defina o IP de gerência com gateway.",
        commands: [
          { vendor: "Datacom", command: "interface vlan [VLAN_DADOS]\nname [DESC_VLAN]\nset-member tagged ethernet 1/1\nset-member untagged ethernet 1/5\nexit" },
          { vendor: "Datacom", command: "interface vlan [VLAN_GER]\nip address [IP_GERENCIA]/[MASK]\nset-member tagged ethernet 1/1\nexit\nip default-gateway [IP_GATEWAY_NE]" }
        ]
      },
      {
        number: 4,
        title: "Configuração de Portas e Banner",
        description: "Ative as interfaces e configure a porta do cliente em Access.",
        commands: [
          { vendor: "Datacom", command: "interface ethernet 1/1\nno shutdown\ndescription LINK-UPLINK\nexit" },
          { vendor: "Datacom", command: "interface ethernet 1/5\nno shutdown\nswitchport native vlan [VLAN_DADOS]\nexit" },
          { vendor: "Datacom", command: "banner login\n~================MASTER================~" }
        ],
        tips: ["O caractere '~' é usado para iniciar e finalizar o texto do banner login."]
      },
      {
        number: 5,
        title: "Finalização e Limpeza",
        description: "Salve as configurações, reinicie e remova o usuário admin original.",
        commands: [
          { vendor: "Datacom", command: "copy run st\nreboot" },
          { vendor: "Datacom", command: "configure\nno username guest\nno username admin\ncopy run st" }
        ]
      }
    ]
  },
  {
    id: "config-datacom-4370",
    title: "Configuração EDD Datacom 4370 (10GB)",
    description: "Procedimento completo de configuração para o switch 10GB 4370, seguindo o padrão do Manual B2B Master Telecom.",
    severity: "low",
    category: "Provisionamento",
    symptoms: [
      "Provisionamento de novo EDD 4370 (10G)",
      "Necessidade de configurar SNMP v2c para monitoramento",
      "Configuração de interfaces L3 e roteamento estático"
    ],
    steps: [
      {
        number: 1,
        title: "Nome, Horário e Usuário",
        description: "Configurações iniciais de identificação e acesso.",
        commands: [
          {
            vendor: "Datacom",
            command: "config //entrar no modo de configuração\n\nhostname MCL-B2B-840521-EDD-01 //definir nome do EDD\n\nclock timezone BRA -3 //definir fuso horário\n\naaa user nocuser //criar e entrar na configuração do usuário\n\npassword %$NoC.2018 //definir senha do usuário\n\ngroup admin //definir permissões de administrador para o usuário\n\nexit //sair da configuração do usuário “nocuser”\n\ncommit //aplicar config"
          }
        ]
      },
      {
        number: 2,
        title: "SNMP (Coleta de Dados)",
        description: "Habilitação do agente SNMP e notificações de sistema.",
        commands: [
          {
            vendor: "Datacom",
            command: "snmp system location Montes Claros //definir a localização do equipamento\n\nsnmp traps config-commit //habilitar notificação do snmp quando aplicar configurações\n\nsnmp traps cpu-load //habilitar notificação do snmp sobre o processamento\n\nsnmp traps link-status //habilitar notificação do snmp sobre o status das interfaces\n\nsnmp traps login-success //habilitar notificação do snmp quando algum usuário logar\n\nsnmp agent enabled //habilitar o snmp\n\nsnmp agent ip 172.17.192.9 //definir o ip de origem do snmp como o IP da gerencia do EDD\n\nsnmp agent version v2c //habilitar a versão 2 do snmp"
          },
          {
            vendor: "Datacom",
            command: "snmp community McxMCL@RNP //criar e entrar na community SNMP\n\nsec-name McxMCL@RNP //definir a community\n\nexit //sair da configuração da community\n\nsnmp vacm group McxMCL@RNP //criar e entrar no grupo\n\nmember McxMCL@RNP //criar e entrar no membro\n\nsec-model v2c //habilitar a leitura do snmp v2 no membro\n\nexit //sair da configuração do membro\n\naccess \"\" v2c no-auth-no-priv //criar e entrar no acesso para habilitar as permissões\n\nread-view root //habilitar a permissão leitura\n\nwrite-view root //habilitar a permissão de escrita\n\nnotify-view root //habilitar a permissão de notificações\n\nexit //sair do acesso criado\n\nexit //sair do grupo criado"
          },
          {
            vendor: "Datacom",
            command: "snmp vacm view root //criar e entrar no grupo de visualização “root”\n\nsubtree 1.3 //entrar na árvore 1.3\n\nincluded //habilitar a coleta de dados dessa árvore pelo grupo root\n\nexit //sair da árvore 1.3\n\nexit //sair do grupo root\n\ncommit //aplicar config"
          }
        ]
      },
      {
        number: 3,
        title: "VLANs e Layer 2",
        description: "Configuração das VLANs de gerência e dados (Tagged/Untagged).",
        commands: [
          {
            vendor: "Datacom",
            command: "dot1q //entrar no modo de configuração das vlans\n\nvlan 2635 //criar e entrar na vlan\n\nname GER-CLI-B2B-MCL //definir descrição para a vlan\n\ninterface ten-gigabit-ethernet-1/1/1 tagged //passar a vlan em tag na interface\n\nexit //sair da configuração da interface dentro da vlan\n\nexit //sair da configuração da vlan\n\nvlan 1143 //criar e entrar na vlan\n\nname LTL-MCL-BHE-840521 //definir descrição para a vlan\n\ninterface ten-gigabit-ethernet-1/1/1 tagged //passar a vlan em tag na interface\n\nexit //sair da configuração da interface na vlan\n\ninterface gigabit-ethernet-1/1/5 untagged // passar a vlan em untag na interface\n\nexit //sair da configuração da interface na vlan\n\nexit //sair da configuração da vlan\n\nexit //sair da configuração de dot1q"
          },
          {
            vendor: "Datacom",
            command: "switchport //acessar as configurações de switchport\n\ninterface gigabit-ethernet-1/1/5 //acessar as configurações de switchport da interface\n\nnative-vlan //acessar as configurações de native vlan da interface\n\nvlan-id 1143 //definir a vlan 1143 em access na interface\n\nexit //sair do native vlan\n\nexit //sair da interface\n\nexit //sair do switchport\n\ncommit //aplicar configuração"
          }
        ]
      },
      {
        number: 4,
        title: "Gerência L3 e Acesso",
        description: "Configuração de IP, Gateway e SSH.",
        commands: [
          {
            vendor: "Datacom",
            command: "interface l3 GER-CLI-B2B-MCL //criar interface de camada 3\n\nlower-layer-if vlan 2635 //definir que o l3 irá conversar com o l2 na vlan 2635\n\nipv4 address 172.17.192.9/21 //definir ip de gerência\n\nexit //sair da interface l3\n\nssh-server port 2021 //definir o acesso via ssh pela porta 2021\n\nssh-server max-connections 16 //definir o máximo de conexões simultâneas via ssh\n\ntelnet-server disable //desabilitar o acesso via telnet (não seguro)"
          },
          {
            vendor: "Datacom",
            command: "router static //acessar a configuração de rota estática\n\naddress family ipv4 //entrar na configuração de ipv4\n\n0.0.0.0/0 next-hop 172.17.192.1 //definir o gateway da gerência\n\nexit //sair da configuração de rota estática\n\ncommit //aplicar config"
          }
        ]
      },
      {
        number: 5,
        title: "Ativação de Interfaces Físicas",
        description: "Habilitação das portas físicas.",
        commands: [
          {
            vendor: "Datacom",
            command: "interface ten-gigabit-ethernet 1/1/1 //acessar a interface\n\nno shutdown //habilitar a interface (tirar o shutdown)\n\nexit //sair da interface\n\ninterface gigabit-ethernet 1/1/5 //acessar interface\n\nno shutdown //habilitar interface (tirar shutdown)\n\nexit //sair da interface\n\ncommit //aplicar config"
          }
        ],
        tips: ["Se as interfaces não linkarem, desabilite a auto-negociação com 'no negotiation' dentro da interface."]
      },
      {
        number: 6,
        title: "Segurança Final",
        description: "Remover usuário administrativo padrão.",
        commands: [
          {
            vendor: "Datacom",
            command: "config \n\nno aaa user admin //excluir usuário admin\n\ncommit //aplicar configuração"
          }
        ]
      }
    ]
  },
  {
    id: "config-mikrotik-bridge",
    title: "Passagem de VLAN e Bridge na Mikrotik",
    description: "Como configurar CRS e CCR para funcionar como equipamento B2B (gerenciável/switch).",
    severity: "low",
    category: "Mikrotik",
    symptoms: [
      "Cliente precisa receber porta untagged ou Vlan a partir da CCR"
    ],
    steps: [
      {
        number: 1,
        title: "Criar VLANs (Interfaces)",
        description: "Crie a Vlan vinculando à interface física que liga o uplink.",
        tips: ["Vá em Interface > VLAN > [+]. Preencha ID da VLAN e escolha a porta física (ex: ether1)."]
      },
      {
        number: 2,
        title: "Amarrar Vlan à Porta Local (Bridge)",
        description: "Crie a Bridge e adicione as portas para comunicar o tráfego da VLAN pro cliente.",
        tips: [
          "1. Bridge > [+].",
          "2. Bridge > Ports > [+].",
          "3. Adicione a interface VLAN recém-criada à Bridge.",
          "4. Adicione a porta do cliente (ex: ether2) à mesma Bridge."
        ]
      },
      {
        number: 3,
        title: "Configurar IP de Gerência",
        description: "Se o equipamento for gerenciável, vincule um IP à interface VLAN de Gerência.",
        tips: ["Vá em IP > Addresses > [+]. Cadastre o IP e aponte para a Interface Vlan de Gerência."]
      }
    ]
  },
  {
    id: "config-switches-huawei",
    title: "Configurações Switches Huawei (LTL / IP Dedicado)",
    description: "Configuração de comunicação camada 2 do roteador até o cliente (IP Dedicado) ou ponta-a-ponta (LTL) utilizando VPWS/L2VC.",
    severity: "low",
    category: "Provisionamento",
    symptoms: [
      "Necessidade de criar a comunicação L2VC entre o switch MPLS e o cliente.",
      "Configuração de VLAN, classificador de banda e interface trunk."
    ],
    steps: [
      {
        number: 1,
        title: "Switch Uplink (BHE-ATV-SWT-MPLS-01)",
        description: "Configuração da VLAN e do túnel L2VC no switch que recebe o tráfego do backbone.",
        commands: [
          {
            vendor: "Huawei",
            command: "vlan batch 3302 //criar vlan no switch\n\nvlan 3302 //entrar na vlan\n\ndesc EXEMPLO-B2B //adicionar uma descrição para vlan\n\nq //sair da configuração da vlan\n\ninterface eth-trunk 3 //entrar na interface\n\ndesc NNI-CENTURY //adicionar uma descrição para interface\n\nport link-type trunk //definir um tipo para porta (trunk permite passagem de várias vlans)\n\nport trunk allow-pass vlan 3302 //passar vlan 3302 na porta em tagged\n\nq //sair da configuração da porta\n\ninterface vlanif 3302 //criar uma interface vlanif (virtual para a vlan)\n\nmpls l2vc 172.16.255.30 330224 //adicionar o serviço VPWS na interface\n\nmpls l2vpn flow-label both //permitir entrada e saída de tráfego no VPWS\n\nq //sair da interface"
          }
        ]
      },
      {
        number: 2,
        title: "Switch de Acesso (UNI-HED-SWT-MPLS-01)",
        description: "Configuração de VLAN, controle de banda (QoS) e túnel L2VC na ponta do cliente.",
        commands: [
          {
            vendor: "Huawei",
            command: "vlan batch 3302 //criar vlan no switch\n\nvlan 3302 //entrar na vlan\n\ndesc EXEMPLO-B2B //adicionar uma descrição para vlan\n\nq //sair da configuração da vlan\n\ntraffic classifier EXEMPLO-B2B //criar classificação de tráfego\n\nif-match vlan 3302 //definir qual tráfego terá a classificação\n\nq //sair do classifier\n\ntraffic behavior EXEMPLO-B2B //criar comportamento no switch\n\ncar cir 102400 pir 102400 green pass yellow pass red discard //limite de 100MB (em KBPS)\n\nstatistic enable //habilitar coleta de estatísticas\n\nq //sair do behavior\n\ntraffic policy EXEMPLO-B2B //criar uma regra\n\nclassifier EXEMPLO-B2B behavior EXEMPLO-B2B //vincular classificação ao comportamento\n\nq //sair da policy"
          },
          {
            vendor: "Huawei",
            command: "interface xg 0/0/10 //entrar na interface física\n\nport link-type trunk //definir porta como trunk\n\nport trunk allow-pass vlan 3302 //passar vlan 3302 em tagged\n\ntraffic-policy EXEMPLO-B2B inbound //aplicar regra na entrada\n\ntraffic-policy EXEMPLO-B2B outbound //aplicar regra na saída\n\nq //sair da interface\n\ninterface vlanif 3302 //criar interface virtual vlanif\n\nmpls l2vc 172.16.255.4 330224 //adicionar VPWS (IP do outro switch)\n\nmpls l2vpn flow-label both //permitir tráfego no VPWS\n\nq //sair da interface"
          }
        ]
      },
      {
        number: 3,
        title: "Salvar Configurações",
        description: "Garanta que as configurações sejam mantidas após o reinício do equipamento.",
        commands: [
          {
            vendor: "Huawei",
            command: "run save //salvar a configuração aplicada na memória flash\n\nyes //confirmar o save"
          }
        ]
      }
    ]
  },
  {
    id: "config-roteadores-ne-borda",
    title: "Configurações Roteadores NE (Borda da Regional)",
    description: "Configuração passo a passo no NE para provisionamento de clientes B2B (Huawei).",
    severity: "low",
    category: "Provisionamento",
    symptoms: [
      "Configuração de novo cliente IP Dedicado no NE",
      "Necessidade de gateway e divulgação BGP"
    ],
    steps: [
      {
        number: 1,
        title: "Identificar Interface de Uplink",
        description: "Identifique a interface Eth-trunk que comunica com o próximo switch.",
        commands: [
          { vendor: "Huawei", command: "dis int desc" }
        ],
        tips: ["Verifique as descrições para confirmar qual Eth-trunk está sendo usado para as sub-interfaces."]
      },
      {
        number: 2,
        title: "Criar e Configurar Sub-Interface",
        description: "Crie a sub-interface e defina o encapsulamento dot1q.",
        commands: [
          { vendor: "Huawei", command: "sys\ninterface eth-trunk0.441\nvlan-type dot1q 441" }
        ],
        tips: ["Sempre que houver um '*' nos colchetes, há configurações pendentes que exigem commit."]
      },
      {
        number: 3,
        title: "Configurar IP de Gateway",
        description: "Seta o IP de gateway para fechar o enlace com o cliente.",
        commands: [
          { vendor: "Huawei", command: "interface eth-trunk0.441\nip address 191.240.92.173 30" }
        ]
      },
      {
        number: 4,
        title: "Habilitar Coleta de Estatísticas",
        description: "Ativa a coleta de tráfego e estatísticas na sub-interface.",
        commands: [
          { vendor: "Huawei", command: "statistic enable\nip netstream inbound" }
        ]
      },
      {
        number: 5,
        title: "Divulgar Segmento no BGP",
        description: "Anuncia o bloco no protocolo BGP utilizando a política padrão.",
        commands: [
          { vendor: "Huawei", command: "bgp 28202\nipv4-family unicast\nnetwork 191.240.0.0 30 route-policy ADD-COMM" }
        ]
      },
      {
        number: 6,
        title: "Permitir na Lista de Prefixos (Export)",
        description: "Permite o IP nas listas de exportação para BRE e BHE.",
        commands: [
          { vendor: "Huawei", command: "ip ip-prefix BHE-20Gb-DWDM-EXPORT permit 191.240.0.0 30\nip ip-prefix BRE-DVL-ELT-EXPORT permit 191.240.0.0 30" }
        ]
      },
      {
        number: 7,
        title: "Aplicar e Salvar Configurações",
        description: "Aplica as mudanças com commit e salva na memória flash.",
        commands: [
          { vendor: "Huawei", command: "commit\nrun save\nyes" }
        ],
        tips: ["Após o save, o IP da sub-interface já deve estar acessível via internet."]
      }
    ]
  },
  {
    id: "config-rota-estatica-enlace",
    title: "IP Dedicado com Bloco de Enlace (Rota Estática)",
    description: "Configuração para liberar o bloco de IP válido completo para o cliente utilizando um IP de enlace privado.",
    severity: "low",
    category: "Provisionamento",
    symptoms: [
      "Cliente deseja utilizar o bloco de IP válido completo",
      "Necessidade de gateway em IP privado (enlace)"
    ],
    steps: [
      {
        number: 1,
        title: "Configurar Sub-Interface com IP de Enlace",
        description: "A sub-interface utilizará o IP do bloco de enlace privado.",
        commands: [
          { vendor: "Huawei", command: "sys\ninterface eth-trunk0.10\nvlan-type dot1q 10\nip address 172.25.16.1 30\nstatistic enable\nip netstream inbound" }
        ],
        tips: ["Neste exemplo, o IP 172.25.16.1 é o gateway no NE e o 172.25.16.2 será setado no cliente."]
      },
      {
        number: 2,
        title: "Configurar Rota Estática",
        description: "Aponte o bloco válido para o IP de enlace do cliente (next-hop).",
        commands: [
          { vendor: "Huawei", command: "sys\nip route-static 191.240.92.172 30 172.25.16.2" }
        ],
        tips: ["Isso ensina o roteador que para chegar na rede válida, os pacotes devem seguir pelo IP de enlace do cliente."]
      }
    ]
  },
  {
    id: "conceitos-vlan-detalhado",
    title: "Switch de Agregação e Acesso: VLANs e Portas",
    description: "Conceitos fundamentais de comunicação Camada 2, tipos de VLAN e configurações de interface.",
    severity: "low",
    category: "Teoria",
    symptoms: [
      "Dúvidas sobre Tagged vs Untagged",
      "Necessidade de configurar QinQ (Double-TAG)",
      "Configuração de portas Trunk, Access ou Hybrid"
    ],
    steps: [
      {
        number: 1,
        title: "Conceitos de VLAN (Tagged e Untagged)",
        description: "Entenda como o tráfego é segmentado utilizando VIDs (1 a 4094).",
        tips: [
          "Tagged: A interface permite a passagem de frames com TAG sem alterá-los.",
          "Untagged (Access): A interface retira a TAG ao enviar o frame para o próximo equipamento.",
          "Transparent: Comum em OLTs, equivale ao modo Tagged dos switches Huawei."
        ]
      },
      {
        number: 2,
        title: "QinQ (Double-TAG / dot1q-tunnel)",
        description: "Encapsulamento de VLANs do cliente dentro de uma VLAN da operadora.",
        commands: [
          { vendor: "Huawei", command: "interface xg 0/0/11\nport link-type dot1q-tunnel\nport default vlan 1005" }
        ],
        tips: [
          "Analogia: Funciona como um cano de água ou um túnel. Se configurar apenas uma ponta, o tráfego entra mas não sai.",
          "Permite que o cliente passe todas as 4094 VLANs dele encapsuladas em uma única VLAN nossa (ex: 1005)."
        ]
      },
      {
        number: 3,
        title: "Port link-type Trunk",
        description: "Transporta múltiplas VLANs com TAG e permite uma VLAN nativa (PVID).",
        commands: [
          { vendor: "Huawei", command: "interface xgigabitethernet 0/0/1\nport link-type trunk\nport trunk allow pass vlan 15 16 17\nport trunk pvid vlan 10" }
        ],
        tips: ["Neste exemplo, as VLANs 15, 16 e 17 passam com TAG, enquanto tráfego sem TAG é destinado à VLAN 10."]
      },
      {
        number: 4,
        title: "Port link-type Access",
        description: "Modo utilizado quando o cliente não configura VLANs no próprio equipamento.",
        commands: [
          { vendor: "Huawei", command: "interface xgigabitethernet 0/0/1\nport link-type access\nport default vlan 15" }
        ],
        tips: ["Todo tráfego que chega sem tag na interface é automaticamente destinado à VLAN 15."]
      },
      {
        number: 5,
        title: "Port link-type Hybrid",
        description: "Modo versátil que permite múltiplas VLANs tanto em modo Tagged quanto Untagged.",
        tips: ["Funciona simultaneamente como Trunk e Access."]
      },
      {
        number: 6,
        title: "Backbone MPLS: VPLS (VSI) e VPWS (L2VC)",
        description: "Tipos de serviço de transporte Camada 2 no backbone MPLS.",
        tips: [
          "A malha MPLS provê múltiplos caminhos automáticos para o tráfego através do backbone.",
          "VPLS (VSI): Ponto-Multiponto. Requer Underlay operante (OSPF, MPLS, LDP) para funcionar.",
          "VPWS (L2VC): Ponto-a-Ponto simples. Utilizado para ligar uma ponta 'A' diretamente a uma ponta 'B'.",
          "Diferença Técnica: VSI permite aprender endereços MAC (dis mac-address vsi), enquanto L2VC não permite aprendizagem de MAC na VLAN."
        ]
      }
    ]
  },
];

export const troubleshootingB2BCategories = Array.from(
  new Set(troubleshootingB2BGuides.map((guide) => guide.category))
);
