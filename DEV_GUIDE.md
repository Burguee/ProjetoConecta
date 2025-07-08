
# 🛠️ Guia do Desenvolvedor - ProjetoConecta

## 📌 Visão Geral

O **ProjetoConecta** é uma aplicação web desenvolvida no contexto do Projeto Integrador Extensionista III – IFTM, com o objetivo de **facilitar o acesso ao mercado de trabalho em Ituiutaba-MG**.  

A proposta é fornecer uma plataforma acessível, intuitiva e responsiva que simula a interação entre **candidatos (PF)** e **empresas (PJ)** para visualização e publicação de vagas, tudo em uma aplicação sem backend, com dados simulados via JavaScript.

---

## 👥 Equipe

- **José Rodolfo**
- **Henrique Lacerda**
- Professor orientador: **Alencar Melo Jr., Dr. Eng.**

---

## 🧱 Estrutura do Projeto

```
ProjetoConecta/
├── css/
│   └── styles.css         # Estilização da interface
├── js/
│   └── scripts.js         # Lógica da aplicação (SPA)
├── index.html             # Página principal com todas as telas
└── LICENSE.md             # Licença MIT
```

---

## 🚀 Como Executar

### 1. Clonar o repositório

```bash
git clone https://github.com/Burguee/ProjetoConecta.git
cd ProjetoConecta
```

### 2. Executar localmente

Você pode apenas **abrir o `index.html` em um navegador** moderno ou usar um servidor local como o *Live Server* no VSCode.

---

## ⚙️ Tecnologias Utilizadas

- **HTML5** – estrutura do sistema e navegação entre seções
- **CSS3** – visual moderno e responsivo com animações e gradientes
- **JavaScript Puro** – controle de lógica, autenticação, candidaturas e notificações

---

## 🧠 Principais Funcionalidades

### 🟢 Login

- Usuário escolhe entre PF (Candidato) e PJ (Empresa).
- O método `handleLogin()` inicializa o usuário com base nos campos preenchidos.
- Não há backend: os dados são tratados no front usando variáveis globais.

### 🟢 Dashboard

- PF pode visualizar e se candidatar a vagas.
- PJ pode publicar vagas e visualizar candidaturas recebidas.
- A navegação entre seções ocorre sem recarregar a página (SPA).

### 🟢 Candidaturas

- PF se candidata por meio do método `applyToJob()`.
- As candidaturas são armazenadas em arrays locais (`applications[]`).
- PJ pode aceitar ou recusar candidaturas, com feedback via notificações.

### 🟢 Publicação de Vagas

- PJ utiliza o formulário da seção "Publicar Vaga".
- O método `handlePublishJob()` coleta os dados, cria a vaga e exibe no painel.
- Vagas são armazenadas no array `jobs[]`.

### 🟢 Notificações

- Geradas automaticamente com base em ações (nova candidatura, vaga publicada, etc.).
- Visualizadas no painel lateral ativado por `toggleNotifications()`.

---

## 📌 Regras de Negócio

- Apenas **PJ** pode **publicar vagas**.
- Apenas **PF** pode **se candidatar**.
- Cada vaga ou ação gera uma notificação.
- Toda lógica é implementada **no front-end**, com persistência temporária em arrays locais.

---

## 📦 Plano de Implementação Futuro

1. **Apresentação institucional**
   - Demonstração do sistema à Prefeitura de Ituiutaba
2. **Validação**
   - Feedback dos gestores municipais
3. **Integração com o site da prefeitura**
   - API pública futura com acesso via portal oficial
4. **Treinamento**
   - Manual do usuário (já criado), possíveis vídeos explicativos
5. **Divulgação**
   - Campanhas em rádios e redes sociais

---

## 🔧 Plano de Manutenção

- **Corretiva**: sob demanda (bugs ou falhas)
- **Evolutiva**: inclusão de novas funções como envio de currículo e chat
- **Preventiva**: testes mensais de compatibilidade e limpeza de dados

---

## 🪪 Licença

Este projeto está licenciado sob a [MIT License](LICENSE.md), que permite o uso, modificação e distribuição com ampla liberdade.

---

## 📎 Referências

- Repositório GitHub: [ProjetoConecta](https://github.com/Burguee/ProjetoConecta)
- Manual do Usuário: `ManualUsuarioConecta 1.pdf`
- Documento do Projeto: `DesenvolvimentoDoTrabalho_PI3.odt`
