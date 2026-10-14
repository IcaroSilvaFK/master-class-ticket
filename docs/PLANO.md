# Ticket de Participação — Masterclass de IA (Ímpar)

## Context

A Ímpar vai realizar a **Primeira Masterclass de Inteligência Artificial** em **21/10/2026**. Queremos que cada funcionário gere um **"ticket de participação" personalizado** (com o nome e a foto dele) no estilo dojô/faixa-preta do artefato de inspiração, e baixe como imagem pra postar no LinkedIn ou Viva Engage, junto com uma legenda pronta.

Hoje o diretório `/home/whyy/www/ticket-post` está vazio (só `.omc`) — é um projeto novo do zero.

### Decisões fechadas com o usuário

- **Dados no ticket:** Nome + Foto (upload).
- **Compartilhamento:** baixar imagem PNG **+ legenda pronta** pra copiar e colar.
- **Hospedagem:** página estática autossuficiente (HTML/CSS/JS puro, sem backend) — roda abrindo no navegador ou em qualquer host estático.
- **Visual:** recriar o clima do artefato via **CSS/Canvas** (fundo escuro com brilho central, kanji, círculo ensô, selo de faixa-preta 黒帯) — sem depender de arquivos externos.
- **Formato:** ticket **quadrado 1080×1080** (melhor no feed do LinkedIn/Viva Engage).

## Abordagem

Renderização **100% via Canvas API** (zero dependências externas → PNG confiável e página portável via `file://`). A foto é carregada com `FileReader` como data URL (não "taint-a" o canvas, então o `toDataURL()` de export funciona). O preview ao vivo **é** o próprio `<canvas>` reduzido por CSS.

### Estrutura de arquivos

- `index.html` — estrutura da página: formulário (nome, upload de foto) + `<canvas id="ticket" width=1080 height=1080>` + botões.
- `styles.css` — tema escuro da página, layout do formulário e do preview.
- `ticket.js` — módulo isolado de desenho + ações:
  - `drawTicket(ctx, { name, photoImg })` — desenha o ticket completo.
  - helpers: `drawBackground`, `drawHeader`, `drawTitle`, `drawEnso`, `drawAvatar` (foto recortada em círculo via `clip()`), `drawName`, `drawModuleChips`, `drawSideKanji`, `drawBeltSeal`.
  - `downloadPNG()` — `canvas.toDataURL('image/png')` + `<a download>`.
  - `copyCaption()` — `navigator.clipboard.writeText(...)`.
  - listeners: inputs disparam re-render ao vivo (nome com placeholder default pra preview não ficar vazio).

### Layout do ticket (1080×1080)

- **Fundo:** gradiente radial escuro (marrons/preto) com brilho quente no centro, evocando a foto do dojô.
- **Topo:** `ÍMPAR · 21 · 10 · 2026` em letras espaçadas, com filetes dourados nas laterais.
- **Título:** `Primeira Masterclass` (serifada grande) + `de Inteligência Artificial` (subtítulo).
- **Centro:** círculo **ensô** (arco desenhado com traço irregular) envolvendo a **foto do usuário recortada em círculo**; **nome** em destaque logo abaixo.
- **Laterais:** kanji faint `人工知能` (esq.) e `道場` (dir.); selo vermelho `黒帯` (faixa-preta) no canto.
- **Rodapé:** 4 chips dos módulos — `一 Claude Code + extensão no navegador`, `二 Spec Driven Development`, `三 Agentes no Copilot Studio`, `四 Case: dashboard no Power BI`.

### Tipografia

Stack serifada do sistema (`Georgia, "Times New Roman", serif`) pra evocar o título elegante do artefato, sem precisar carregar fontes externas (mais robusto em `file://`). _Enhancement opcional futuro:_ embutir uma fonte tipo Cinzel/Playfair via `@font-face` base64 + `await document.fonts.ready` antes do primeiro render.

### Formulário (fora do ticket, na página)

- Campo **Nome**.
- Campo **Foto** (`<input type=file accept="image/*">`) com center-crop "cover" dentro do círculo.
- Botão **Baixar ticket (PNG)**.
- **Textarea com legenda pronta** (PT-BR, mencionando o evento + hashtags) e botão **Copiar legenda**.

## Arquivos a criar

- `/home/whyy/www/ticket-post/index.html`
- `/home/whyy/www/ticket-post/styles.css`
- `/home/whyy/www/ticket-post/ticket.js`

## Verificação (end-to-end)

1. Abrir `index.html` no navegador (duplo clique / `file://`).
2. Digitar um nome → preview atualiza ao vivo no canvas.
3. Fazer upload de uma foto → aparece recortada em círculo no ensô.
4. Clicar **Baixar ticket** → baixa um PNG **1080×1080** com o ticket renderizado.
5. Clicar **Copiar legenda** → texto vai pro clipboard (colar e conferir).
6. Conferir visualmente: fundo escuro, título, kanji, selo faixa-preta, 4 chips de módulo, nome + foto centralizados.

_(Opcional: validar o export com um screenshot headless do canvas, mas a conferência manual acima cobre o fluxo.)_

**É obrigatório o uso das cores da Ímpar.**
