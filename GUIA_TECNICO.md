# 🛠️ Guia Técnico - Vanguard Dossier

Este documento serve como um manual para realizar alterações manuais no projeto, entendendo sua estrutura e tecnologias.

## 🚀 Como Iniciar o Desenvolvimento

1. **Instalar Dependências**: No terminal da pasta, rode:
   ```bash
   npm install
   ```
2. **Rodar em Modo de Edição**:
   ```bash
   npm run dev
   ```
   O site abrirá em `http://localhost:5173`. Qualquer mudança salva no código refletirá instantaneamente no navegador.

---

## 📂 Mapa do Projeto (Onde alterar o quê?)

### 1. Dados e Estado Inicial
*   **`src/hooks/useCharacterSheetState.js`**: Contém os valores iniciais de Vigor, Sanidade, Atributos e Inventário. Se quiser que a ficha comece com valores diferentes, altere os `useState` aqui.

### 2. Estilização e Cores (Tailwind CSS)
A estilização é feita via classes do Tailwind diretamente nos componentes.
*   **Cores**: Procure por classes como `text-red-900` (texto vermelho escuro) ou `bg-zinc-900` (fundo cinza quase preto).
*   **Bordas**: Padronizamos para `rounded-none`. Se desejar mudar, use `rounded-sm`, `rounded-md`, etc.
*   **Estilos Globais**: Em `src/index.css` estão as regras que afetam o site todo, como o efeito CRT, Scanlines e a padronização global de bordas.

### 3. Sistema de Insanidade (Sanidade 3)
O bloco de notas reage quando a sanidade chega a 3 ou menos.
*   **Frases de Glitch**: No arquivo `src/components/notepad/Notepad.jsx`, localize a constante `CREEPY_PHRASES`. Você pode adicionar qualquer frase lá.
*   **Efeito Visual**: A lógica de trocar o texto e deixar o bloco vermelho está dentro do componente `NoteListItem` no mesmo arquivo.

### 4. Conquistas (Achievements)
*   **Novas Conquistas**: Edite o arquivo `src/data/achievements.js`. Basta seguir o padrão de objeto existente.
*   **Exibição**: O componente `src/components/sheet/DisplayedAchievements.jsx` controla como elas aparecem na tela inicial (incluindo as animações).

### 5. Barra Lateral e Monitor Cardíaco
*   **CombatStats**: Ocupação de Defesa/Reflexo está em `src/components/sidebar/CombatStats.jsx`.
*   **Fadiga**: Em `src/components/sidebar/FatigueStatus.jsx`, você encontra a lógica do ícone de caveira e o pulso de animação ao clicar.

### 6. Animações (Framer Motion)
Quase todas as animações usam a biblioteca `framer-motion`.
*   Para mudar a velocidade ou tipo de movimento, procure por componentes `<motion.div>` e altere a propriedade `transition={{ duration: 0.5 }}`.

---

## 🏗️ Gerando a Versão Final
Quando terminar suas edições e quiser a versão pronta para uso:
```bash
npm run build
```
Isso gerará a pasta `dist`. O conteúdo dessa pasta é o seu site final.

---

**Dica**: Se o site "quebrar" ou mostrar uma tela branca, verifique o terminal onde rodou o `npm run dev` ou aperte `F12` no navegador para ver os erros no console.
