# Aplicativo de Controle de Frequência

Este é um aplicativo web progressivo (PWA) para controle de frequência de alunos, desenvolvido para facilitar o acesso dos alunos aos seus dados de presença e faltas.

## Características

- **Autenticação segura**: Acesso por email e DRE
- **Múltiplas turmas**: Suporte para diferentes turmas (A e B)
- **Privacidade**: Cada aluno só pode ver seus próprios dados
- **Assistente de IA**: Integração com o Agente GEO para dúvidas sobre a disciplina
- **Responsivo**: Funciona em qualquer dispositivo (desktop, tablet, celular)
- **Instalável**: Pode ser instalado como aplicativo no celular
- **Offline**: Funciona mesmo sem conexão à internet (após primeiro acesso)
- **Seguro**: Conformidade com LGPD e registro de logs de acesso

## Como usar

### Para o professor

1. Continue atualizando sua planilha do Google Sheets normalmente
2. O aplicativo sincronizará automaticamente com sua planilha

### Para os alunos

1. Acesse o aplicativo pelo link fornecido
2. Faça login usando seu email e DRE
3. Visualize suas informações de frequência
4. Para instalar como aplicativo no celular:
   - **Android**: Clique em "Adicionar à tela inicial" no menu do navegador
   - **iOS**: Clique em "Compartilhar" e depois "Adicionar à tela de início"

## Segurança e Privacidade

- Todos os acessos são registrados para fins de segurança
- Os dados pessoais são protegidos conforme a LGPD
- Emails e DREs são mascarados nos logs para proteção da privacidade
- Cada aluno só consegue ver seus próprios dados

## Implementação Técnica

Este aplicativo foi desenvolvido como um PWA (Progressive Web App) que se integra com o Google Sheets. A estrutura inclui:

- **Frontend**: HTML, CSS e JavaScript
- **Autenticação**: Baseada em email e DRE
- **Armazenamento**: Dados armazenados no Google Sheets
- **Sincronização**: Via Google Sheets API

## Próximos passos para implementação completa

Para implementar este aplicativo em produção, será necessário:

1. Configurar uma conta de serviço no Google Cloud Platform
2. Obter uma chave de API para o Google Sheets
3. Implementar um backend simples para gerenciar a autenticação e os logs
4. Hospedar o aplicativo em um serviço como GitHub Pages, Netlify ou Vercel

## Suporte

Para qualquer dúvida ou problema, entre em contato com o desenvolvedor.
