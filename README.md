# WhatsApp AI Agents - Frontend

Frontend moderno em React + Next.js para gerenciar agentes de IA do WhatsApp.

## Funcionalidades

- **Dashboard**: Visão geral com estatísticas em tempo real
- **Gerenciamento de Agentes**: Criar, editar e configurar agentes de IA
- **Conexões WhatsApp**: Conectar instâncias do WhatsApp via QR Code
- **Configurações**: Gerenciar API keys e parâmetros do sistema

## Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna e responsiva
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones modernos

## Instalação

```bash
cd frontend
npm install
```

## Configuração

Crie um arquivo `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com a URL do backend:

```env
BACKEND_URL=http://localhost:5001
```

## Executar em Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: http://localhost:3000

## Build para Produção

```bash
npm run build
npm start
```

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── agents/            # Página de gerenciamento de agentes
│   │   ├── connections/       # Página de conexões WhatsApp
│   │   ├── settings/          # Página de configurações
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Dashboard (home)
│   │   └── globals.css        # Estilos globais
│   ├── components/            # Componentes reutilizáveis
│   │   └── Sidebar.tsx        # Barra lateral de navegação
│   └── lib/                   # Utilidades e serviços
├── public/                    # Arquivos estáticos
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Páginas

### Dashboard (`/`)
- Estatísticas do sistema
- Conversas ativas
- Total de mensagens
- Ações rápidas

### Agentes (`/agents`)
- Lista de agentes configurados
- Criar novo agente
- Editar prompts e instruções
- Escolher modelo OpenAI
- Definir tipo de agente (Vendas, Suporte, etc.)

### Conexões WhatsApp (`/connections`)
- Conectar via QR Code
- Ver status das conexões
- Gerenciar múltiplas instâncias
- Reconectar instâncias

### Configurações (`/settings`)
- API Key OpenAI
- Configurações Falai
- Parâmetros do sistema
- Modo debug

## Integração com Backend

O frontend se comunica com o backend Flask através da URL configurada em `BACKEND_URL`.

Endpoints utilizados:
- `GET /stats` - Estatísticas do sistema
- `GET /health` - Health check
- (Futuros endpoints para CRUD de agentes e conexões)

## Próximos Passos

- [ ] Implementar API routes no Next.js
- [ ] Conectar formulários com backend
- [ ] Adicionar autenticação (opcional)
- [ ] Implementar WebSocket para atualizações em tempo real
- [ ] Adicionar gráficos e métricas
- [ ] Sistema de logs e histórico de conversas

## Notas

- Interface sem sistema de login (conforme solicitado)
- Design moderno e minimalista
- Responsivo para mobile e desktop
- Notificações toast para feedback do usuário
