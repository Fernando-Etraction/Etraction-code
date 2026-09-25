# Auditoria técnica — Conteúdos adicionais Magazord (Arm Fitness)

## Contexto

Página analisada: Home (https://www.armfitness.com.br/).

Total de blocos .pagina-conteudo-adicional.conteudo-adicional-XX encontrados na renderização da Home: 21.

Numeração identificada (na ordem em que aparecem no DOM):

22, 69, 26, 5, 60, 68, 70, 64, 36, 82, 37, 45, 113, 10, 35, 81, 107, 103, 130, 112, 94.

Observação importante: 100% dos blocos rodam globalmente (estão presentes na Home, mesmo quando seu seletor só faz sentido em PDP, Vitrine, Carrinho, Painel do cliente, etc.). Esse é o achado mais recorrente da auditoria.

# Conteúdos auditados

## Conteúdo adicional 22


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-22

**Tipo:** CSS inline (<style>)

**Peso:** ~322 caracteres

**Trecho-chave:**

```css

.zoom { padding:50px; background:rgba(0,128,0,0); transition:transform .3s; width:200px; height:200px; margin:0 auto; }

```

.zoom:hover { transform: scale(0.9); /* 1.0 = 100% de zoom... */ }

**Função:** visual / efeito hover de "zoom" em um card 200x200. Comentário em PT-BR sugere personalização legada (“pode causar bug em algumas telas”).

**Onde impacta:** qualquer elemento com classe .zoom. Na Home não existe nenhum .zoom no DOM (validado por document.querySelector('.zoom') → null).

**Status de uso:** Sem uso aparente / Obsoleto candidato. A classe .zoom é genérica demais e não foi encontrada na renderização atual.

**Duplicação:** Não direta. Mas concorre com qualquer outro CSS que use .zoom.

**Sobrescreve outro:** Não verificado, mas o transform: scale(0.9) no hover é destrutivo se .zoom for usado em outros contextos visuais.

**Está sendo sobrescrito:** provável, dado que é uma classe muito genérica.

**Erros:** classe genérica sem prefixo, comentário admitindo bug ("pode causar bug em algumas telas"), background-color: rgba(0,128,0,0) (verde 100% transparente — código residual).

**Impacto:**


| Área | Nível |

|---|---|

| Performance | Baixo |

| UX Baixo (só executa em | hover) |

| Manutenção Alto (classe genérica, comentário de | bug) |

| Estabilidade | Médio |

| SEO Não | aplicável |

**Gravidade:** Média.

**Recomendação:** Remover após validação com marketing/dev (perguntar se algum banner antigo usa .zoom).

**Validação manual:** DevTools → Console: document.querySelectorAll('.zoom').length em Home, PDP, vitrine, categoria. Se sempre 0, remover.

## Conteúdo adicional 69


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-69

**Tipo:** JS externo

**Peso:** ~118 caracteres + script externo carregado (peso real depende do arquivo remoto).

**Trecho:**

```html

<script src="https://storage.googleapis.com/solomon-app-scripts/magazord_pixel_interno.js" async defer></script>

```

**Função:** Tracking (pixel interno do "Solomon", app de tracking/atribuição). Carrega script de terceiros do Google Cloud Storage.

**Onde impacta:** global (todas as páginas). Roda em Home, PDP, categoria, carrinho, checkout.

**Status de uso:** Em uso (presente em todas as páginas).

**Duplicação:** validar se existe outro pixel da Solomon configurado via TagManager ou via Magazord Apps. Possível duplicação com o conteúdo 103 (cupom de influenciador), pois ambos atendem ao funil de afiliados/influencers — função correlata, não idêntica.

**Sobrescreve outro:** Não.

**Está sendo sobrescrito:** Não.

**Erros:** usa async defer simultaneamente (com <script src>, defer é redundante quando async está presente — não é bug, mas é redundante); script de terceiros sem SRI (subresource integrity) e sem fallback.

**Impacto:** Performance Médio (3rd party script, mesmo async, ainda gera requisição/CPU); UX Baixo; Manutenção Médio (depende de URL de terceiro hardcoded); Estabilidade Médio (se o GCS cair, async evita bloqueio mas perde tracking); SEO Não aplicável.

**Gravidade:** Média.

**Recomendação:** Manter como está, mas mover para o app/integração oficial do Solomon ou para o GTM, evitando lógica espalhada em conteúdos adicionais.

**Validação manual:** Network → filtrar magazord_pixel_interno.js; verificar status 200; conferir se não há duplicação com outro <script> Solomon.

## Conteúdo adicional 26


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-26

**Tipo:** CSS inline

**Peso:** ~91 caracteres

**Trecho:**

```css

li.flex.center.footer-link-atendimento { display: none !important; }

```

**Função:** visual / oculta um link de atendimento no footer.

**Onde impacta:** footer global.

**Status de uso:** validado — document.querySelector('li.flex.center.footer-link-atendimento') retorna false na Home. Pode ser que o link tenha sido removido do template e o CSS continue ocultando algo que já não existe → Sem uso aparente.

**Duplicação:** possível com bloco 64 (também esconde algo no footer — bg-footer-light-blue-color). Não é duplicação literal, mas ambos manipulam footer.

**Sobrescreve outro:** Sim, sobrescreve o template padrão do footer Magazord usando !important.

**Está sendo sobrescrito:** Não.

**Erros:** uso de !important para esconder elemento que pode nem existir mais; seletor encadeado e frágil (depende das 3 classes flex center footer-link-atendimento).

**Impacto:** Performance Baixo; UX Baixo; Manutenção Médio; Estabilidade Baixo; SEO Baixo.

**Gravidade:** Baixa.

**Recomendação:** Remover após validação — confirmar se o link "Atendimento" foi removido do template ou se ainda volta em outras páginas (PDP, conta).

**Validação manual:** rodar document.querySelectorAll('li.footer-link-atendimento').length em Home, PDP, categoria, checkout, conta. Se 0 em todas, remover.

## Conteúdo adicional 5


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-5

**Tipo:** CSS inline

**Peso:** ~138 caracteres

**Trecho:**

```css

.tipo-vitrine-11 .product-name { min-height:0px!important; height:22px!important; margin-top:0px; }

```

**Função:** visual / força altura fixa do nome do produto na vitrine tipo 11.

**Onde impacta:** vitrines do tipo tipo-vitrine-11. Na Home .tipo-vitrine-11 não existe (validado, retorna null).

**Status de uso:** Sem uso aparente na Home. Pode estar em uso em categorias se ainda houver vitrine tipo 11.

**Duplicação:** Sim — concorre com bloco 10 (que também estiliza .tipo-vitrine-11, escondendo .preco-de). Mesmo seletor base, funções correlatas. Devem ser unificados.

**Sobrescreve outro:** Sobrescreve o template padrão da vitrine 11.

**Está sendo sobrescrito:** Não.

**Erros:** forçar height:22px é frágil — quebra com nomes longos no mobile (CLS / corte de texto).

**Impacto:** Performance Baixo; UX Médio (nomes de produto cortados no mobile); Manutenção Médio; Estabilidade Médio; SEO Baixo.

**Gravidade:** Média.

**Recomendação:** Unificar com o bloco 10 num único conteúdo adicional "Estilo vitrine-11", e revisar se altura fixa é aceitável.

**Validação manual:** Console em todas as páginas de listagem: document.querySelectorAll('.tipo-vitrine-11').length.

## Conteúdo adicional 60


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-60

**Tipo:** CSS inline

**Peso:** ~106 caracteres

**Trecho:**

```css

a.menu-link-154.not-has-childs { background:#000; color:white !important; }

```

**Função:** visual / destaca um item específico do menu (link 154) com fundo preto e texto branco.

**Onde impacta:** menu principal. Na Home .menu-link-154 não existe (validado).

**Status de uso:** Sem uso aparente / possivelmente Obsoleto — link 154 foi renomeado/excluído do menu? Verificar com a equipe.

**Duplicação:** parcial com bloco 81 (que esconde .menu-list-156) e blocos 113, 112 (também tocam no menu).

**Sobrescreve outro:** sim, sobrescreve estilo padrão de item de menu Magazord.

**Está sendo sobrescrito:** Não.

**Erros:** identificador numérico fixo (154) acopla o CSS a um ID interno do CMS — quebra silenciosamente quando o item é recriado e ganha outro número.

**Impacto:** Performance Baixo; UX Baixo; Manutenção Alto (acoplado a ID volátil); Estabilidade Médio; SEO Não aplicável.

**Gravidade:** Média.

**Recomendação:** Investigar manualmente com marketing — se o item 154 não existe mais, remover; se existe e é uma campanha (ex.: "OUTLET"), trocar o seletor para uma classe semântica (.menu-destaque).

**Validação manual:** Console: document.querySelectorAll('.menu-link-154').length.

## Conteúdo adicional 68


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-68

**Tipo:** CSS inline

**Peso:** ~69 caracteres

**Trecho:**

```css

.recomender-items { min-height: 0px !important; }

```

**Função:** correção técnica / zera min-height da seção de recomendados (provavelmente Smart Hint, LinxImpulse ou similar).

**Onde impacta:** widget de recomendação. Validado: .recomender-items não está na Home (provável que só apareça em PDP/categoria).

**Status de uso:** Parcialmente em uso (executa global, só faz efeito onde o widget existe).

**Duplicação:** Não.

**Sobrescreve outro:** Sim — sobrescreve CSS injetado pelo widget de recomendação.

**Está sendo sobrescrito:** Não.

**Erros:** !important provavelmente foi colocado para vencer o CSS do widget — frágil contra atualizações do app de recomendação.

**Impacto:** Performance Baixo; UX Baixo (provavelmente reduz CLS no widget); Manutenção Baixo; Estabilidade Baixo; SEO Não aplicável.

**Gravidade:** Baixa.

**Recomendação:** Manter como está (correção pequena, válida).

**Validação manual:** PDP/categoria → inspecionar .recomender-items e checar se min-height resolvido é 0.

## Conteúdo adicional 70


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-70

**Tipo:** CSS inline

**Peso:** ~59 caracteres

**Trecho:**

```css

ul#nav-root { margin-left: 75px; }

```

**Função:** estrutural / desloca o menu principal 75px para a direita.

**Onde impacta:** header global (validado: #nav-root existe).

**Status de uso:** Em uso.

**Duplicação:** Conflito direto com blocos 113 e 112 que também alteram ul#nav-root. O 113 modifica padding, width: fit-content, e o 112 muda background do container-menu.

**Sobrescreve outro:** sobrescreve o tema base.

**Está sendo sobrescrito:** Não no margin-left, mas competindo no mesmo seletor com outros conteúdos adicionais.

**Erros:** valor mágico fixo (75px) acopla o menu a uma largura específica do logo — quebra se o logo mudar de tamanho (e o bloco 36 controla justamente o tamanho do logo).

**Impacto:** Performance Baixo; UX Médio (em mobile pode quebrar); Manutenção Alto (acoplado a outro bloco); Estabilidade Médio; SEO Não aplicável.

**Gravidade:** Média.

**Recomendação:** Refatorar / Unificar com 113, 112 e 36 num único bloco "Header & Menu" controlado por variáveis CSS.

**Validação manual:** redimensionar viewport mobile e checar se há overflow horizontal no header.

## Conteúdo adicional 64


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-64

**Tipo:** CSS inline

**Peso:** ~98 caracteres

**Trecho:**

```css

.ra-footer .bg-footer-light-blue-color { background-color:#fff !important; }

```

**Função:** visual / força fundo branco no footer do widget Reclame Aqui (ra-footer). Validado: .ra-footer existe na Home.

**Onde impacta:** footer global.

**Status de uso:** Em uso.

**Duplicação:** parcial com bloco 26 (também ajusta footer).

**Sobrescreve outro:** sobrescreve CSS do widget Reclame Aqui.

**Está sendo sobrescrito:** Não.

**Erros:** !important para vencer CSS de terceiro (ok). Sem prefixo, sem escopo.

**Impacto:** Performance Baixo; UX Baixo; Manutenção Baixo; Estabilidade Baixo; SEO Não aplicável.

**Gravidade:** Baixa.

**Recomendação:** Manter como está.

**Validação manual:** inspecionar .ra-footer .bg-footer-light-blue-color no DevTools.

## Conteúdo adicional 36


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-36

**Tipo:** CSS inline

**Peso:** ~265 caracteres

**Trecho:**

```css

.buy-area .pix .price-big { font-weight:bold; }

```

.buy-area .values-area.forma-pagamento-2 .card { justify-content:flex-start; order:1; }

.buy-area .pix { order:0; }

**Função:** funcional + visual / inverte ordem do PIX e cartão na PDP e destaca preço PIX em negrito.

**Onde impacta:** PDP (.buy-area). Validado: na Home .buy-area não existe (count = 0).

**Status de uso:** Em uso na PDP, mas o bloco roda globalmente (peso desnecessário em todas as outras páginas).

**Duplicação:** Não.

**Sobrescreve outro:** Sim — sobrescreve ordem padrão das formas de pagamento da Magazord.

**Está sendo sobrescrito:** Não.

**Erros:** declaração .buy-area .values-area.forma-pagamento-2 .card aparece duas vezes com regras diferentes (justify-content e order) — deveria ser unificada num único bloco.

**Impacto:** Performance Baixo; UX Alto positivo (destaca PIX, conhecidamente melhora conversão); Manutenção Médio; Estabilidade Baixo; SEO Não aplicável.

**Gravidade:** Média.

**Recomendação:** Condicionar por página (PDP) e consolidar as duas regras .card numa só.

**Validação manual:** PDP → inspecionar .buy-area .pix (order=0) e .card (order=1).

## Conteúdo adicional 82


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-82

**Tipo:** CSS inline

**Peso:** ~86 caracteres

**Trecho:**

```css

.logo img { max-width:100px; }

```

.logo svg { max-width:100px; }

**Função:** visual / força tamanho do logo a 100px.

**Onde impacta:** header global. Validado: .logo img existe.

**Status de uso:** Em uso.

**Duplicação:** Não direta, mas acoplado ao bloco 70 (que define margin-left:75px no menu, calculado em função do logo).

**Sobrescreve outro:** sobrescreve estilos do tema Magazord.

**Está sendo sobrescrito:** Não.

**Erros:** força largura sem height: auto — risco mínimo de distorção dependendo do SVG; valores mágicos repetidos.

**Impacto:** Performance Baixo (mas o logo ser 100px ajuda LCP); UX Baixo; Manutenção Baixo; Estabilidade Baixo; SEO Baixo.

**Gravidade:** Baixa.

**Recomendação:** Manter como está, idealmente unificar com 70/113/112 num bloco "Header".

**Validação manual:** inspecionar .logo img width = 100px.

## Conteúdo adicional 37


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-37

**Tipo:** CSS inline

**Peso:** ~527 caracteres

**Trecho-chave:**

```css

.tipo-vitrine-02 .type-payment-condiction, .tipo-vitrine-17 .type-payment-condiction { display:none; }

```

.tipo-vitrine-02 .secondary-price, .tipo-vitrine-17 .secondary-price { display:none; }

.tipo-vitrine-02 .rating { text-align:center; } .tipo-vitrine-17 .rating { justify-content:center; }

.tipo-vitrine-02 .primary-price .valor-big, .tipo-vitrine-17 .primary-price .valor-big { color:#333; }

.tipo-vitrine-02 .primary-price, .tipo-vitrine-17 .primary-price { text-align:center; }

**Função:** visual / padroniza vitrines tipo 02 e 17 (esconde "12x sem juros", esconde preço secundário, centraliza rating e preço).

**Onde impacta:** vitrines da Home e categorias (validado: .tipo-vitrine-17 existe na Home).

**Status de uso:** Em uso (vitrine 17 confirmada). .tipo-vitrine-02 não foi vista na Home — pode ser vestígio.

**Duplicação:** Conflito/sobreposição com bloco 45 (também adiciona display:none em vitrine 17 para .btn-comprar-vitrine, e cria seu próprio .button__adicional na vitrine 17). Cruzamento de seletores .tipo-vitrine-17 *.

**Sobrescreve outro:** Sim — sobrescreve template das vitrines.

**Está sendo sobrescrito:** parcialmente pelo 45.

**Erros:** esconder type-payment-condiction (parcelamento) é decisão comercial — validar com marketing se isso é desejado em todas as vitrines, sempre.

**Impacto:** Performance Baixo; UX Alto (afeta percepção de preço/parcelamento — comercial); Manutenção Médio; Estabilidade Médio; SEO Baixo.

**Gravidade:** Alta (decisão comercial impactando conversão).

**Recomendação:** Investigar manualmente com marketing. Confirmar se vitrine 02 ainda existe; se não, remover essa metade. Consolidar com 45.

**Validação manual:** Console: document.querySelectorAll('.tipo-vitrine-02').length e .tipo-vitrine-17 em Home, busca, categoria.

## Conteúdo adicional 45


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-45

**Tipo:** Misto (CSS inline + JS visível) — O bloco visível tem só CSS, mas seu HTML real é maior; ele depende do bloco 35 que também é misto. Atenção: o que o read mostrou aqui foi 282 caracteres com <style>, mas a função .button__adicional é injetada pelo bloco 35. Auditando como CSS:

**Trecho:**

```css

.acoes-header .meus-favoritos { display:none; }

```

li.swiper-slide.product-one-of-three.swiper-slide-active>a>figure>video { height: 321px !important; }

div#videos-produto { DISPLAY: none; }

.item-frete-oferta { display: block !important;

**Função:** misturada — (1) esconde "Meus Favoritos" do header (validado: .acoes-header .meus-favoritos existe), (2) força altura 321px em vídeos do swiper na vitrine de 3 colunas, (3) esconde #videos-produto (na PDP), (4) força .item-frete-oferta visível.

**Onde impacta:** header global + PDP + vitrines.

**Status de uso:** Parcialmente em uso. .acoes-header .meus-favoritos ✅; #videos-produto ❌ (não existe na Home, é PDP); .item-frete-oferta ❌ (não existe na Home).

**Duplicação:** parcial com 37 e 35 (todos mexem em vitrine).

**Sobrescreve outro:** sim.

**Está sendo sobrescrito:** Não.

**Erros:** CSS inválido — bloco não fechado ({ aberto em .item-frete-oferta { display: block !important; sem } antes do </style>). DISPLAY em maiúsculo é tolerado mas inconsistente. Mistura de 4 propósitos diferentes num único conteúdo (visual, vitrine, PDP, header).

**Impacto:** Performance Baixo; UX Médio (CSS quebrado pode propagar erros de parser); Manutenção Alto (mistura propósitos); Estabilidade Médio; SEO Não aplicável.

**Gravidade:** Alta (CSS inválido + mistura de escopos).

**Recomendação:** Refatorar. Separar em 4 conteúdos coesos OU em 1 arquivo CSS único e fechar todas as chaves.

**Validação manual:** DevTools → Elements → .pagina-conteudo-adicional.conteudo-adicional-45 style → Coverage panel para ver regras não aplicadas.

## Conteúdo adicional 113


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-113

**Tipo:** CSS inline

**Peso:** ~366 caracteres

**Trecho:**

```css

.menu-list-216 .container-menu ul,.menu-list-114 .container-menu ul{ display:flex; flex-direction:column; width:fit-content; }

```

.menu-list-216 .container-menu ul li,.menu-list-114 .container-menu ul li{ width:fit-content; }

ul#nav-root>li>.container-menu { padding:10px !important; width:fit-content; }

**Função:** estrutural / muda layout dos submenus 216 e 114 e o container-menu global.

**Onde impacta:** header global. Validado: .menu-list-216 e .menu-list-114 existem.

**Status de uso:** Em uso.

**Duplicação:** Conflito direto com bloco 112 (também aplica regras a ul#nav-root>li>.container-menu).

**Sobrescreve outro:** sim.

**Está sendo sobrescrito:** parcialmente pelo 112 (mesmo seletor, propriedades diferentes — pode haver corrida de cascata pelo order do DOM).

**Erros:** IDs numéricos hardcoded (216, 114) frágeis; !important no padding.

**Impacto:** Performance Baixo; UX Baixo; Manutenção Alto (IDs voláteis); Estabilidade Médio; SEO Não aplicável.

**Gravidade:** Média.

**Recomendação:** Unificar com 112, 70 e 60 num único bloco "Header & Menu".

**Validação manual:** navegar PDP, categoria — verificar se .menu-list-216 e .menu-list-114 continuam existindo com esses IDs.

## Conteúdo adicional 10


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-10

**Tipo:** CSS inline

**Peso:** ~271 caracteres

**Trecho:**

```css

img.img-principal.lazyautosizes.lazyloaded { padding-left: 10px !important; }

```

.tipo-vitrine-11 .preco-de { height:17px; font-size:.75em; color:var(--cor-texto-secundario); text-decoration:line-through; display:none; }

**Função:** visual / aplica padding-left:10px na imagem principal e formata .preco-de da vitrine 11 (mas com display:none — ou seja, esconde o preço-de mas ainda define cor, font-size e height, o que é CSS morto).

**Onde impacta:** PDP (img-principal) + vitrine 11. Validado: img.img-principal ✅; .tipo-vitrine-11 ❌ (na Home).

**Status de uso:** Parcialmente em uso (PDP) / Sem uso aparente para vitrine 11 na Home.

**Duplicação:** Sim — duplica/conflita com bloco 5 (ambos estilizam .tipo-vitrine-11).

**Sobrescreve outro:** sim.

**Está sendo sobrescrito:** Não.

**Erros:** CSS morto — definir height, font-size, color, text-decoration num elemento que está com display:none é desperdício; depende de classes geradas pelo lazysizes (lazyautosizes lazyloaded) — se a lib mudar, quebra; padding-left:10px aplicado só após o lazyload finalizar pode causar CLS na PDP.

**Impacto:** Performance Baixo; UX Médio (risco CLS na PDP); Manutenção Médio; Estabilidade Médio; SEO Baixo.

**Gravidade:** Média.

**Recomendação:** Refatorar / Unificar com 5. Aplicar padding direto em .img-principal (sem depender do estado lazysizes).

**Validação manual:** Lighthouse → Performance → CLS na PDP; verificar se a imagem "anda" 10px após carregar.

## Conteúdo adicional 35


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-35

**Tipo:** Misto — JS (jQuery) + CSS inline

**Peso:** ~1.578 caracteres

**Trecho-chave:**

```js

jQuery(function ($) {

```

function addComprarButton() {

$('ul.product-list > li').each(function () {

var $li = $(this);

if ($li.find('.button__adicional').length) return; // evita duplicar

var $a = $li.find('a[href]').filter(function(){ var h = $(this).attr('href'); return h && h !== '#' && h.indexOf( ... ) ... });

// ... insere botão "COMPRAR"

});

}

var tries = 0;

var interval = setInterval(function(){ addComprarButton(); tries++; if (tries >= 10) clearInterval(interval); }, 500);

});

**CSS:**

```css

.button__adicional, .tipo-vitrine-17 .button__adicional { display:flex; justify-content:center; margin-top:8px; }

```

.botao-comprar, .tipo-vitrine-17 .botao-comprar { display:inline-block; padding:10px 19px; background:#fff; color:#000; border:1px solid #000; border-radius:10px; ... }

ul.product-list li .btn-comprar-vitrine { display:none; }

**Função:** funcional crítica — substitui o botão nativo .btn-comprar-vitrine por um botão custom .button__adicional > .botao-comprar em todas as vitrines (atalho "Comprar" indo direto para a PDP).

**Onde impacta:** global (validado: 6 `.`.button__adicional`  injetados na Home).

**Status de uso:** **Em uso.** Confirmado: 6 botões adicionados ao DOM, e a regra `.btn-comprar-vitrine` { display:none }está ativa.

**Duplicação:** **Sim — sobrepõe lógica/CSS com o bloco 37 e 45** (todos manipulam `.tipo-vitrine-17`); o CSS do botão custom poderia estar nos blocos 37/45. Sobrescreve outro: sim — esconde o botão padrão Magazord (`.btn-comprar-vitrine`).

**Está sendo sobrescrito:** Não.

Erros (vários):

Dependência de jQuery (a Magazord ainda entrega jQuery, mas é dívida técnica).

setInterval a cada 500ms × 10 tentativas = 5s de polling mesmo após o DOM estar pronto. Anti-padrão clássico — deveria usar MutationObserver ou hook do Magazord.

O .each roda múltiplas vezes (10×), o if ($li.find('.button__adicional').length) return evita duplicar inserções, mas o DOM scan repetitivo é desperdício de CPU em mobile (impacto INP/TBT).

Se a vitrine for paginada/infinite scroll após 5s, novos itens não recebem o botão (o intervalo já foi limpo).

Depende de <a href> filtrado por hash — frágil.

**Impacto:** Performance Médio/Alto (jQuery + polling 500ms × 10 + CSS extra + 6 nós DOM); UX Alto positivo (CTA direto, melhora conversão); Manutenção Alto (jQuery, polling, mistura JS+CSS); Estabilidade Médio; SEO Baixo (não impacta indexação, mas pode atrasar interatividade).

**Gravidade:** Alta.

**Recomendação:** Refatorar. Trocar setInterval por MutationObserver ou pelo evento de "vitrine carregada" do Magazord; remover dependência de jQuery; mover CSS para um arquivo único; condicionar a páginas com vitrine.

**Validação manual:** Performance panel → gravar carregamento da Home → procurar long tasks de 500ms recorrentes; rolar até infinite scroll (se houver) e verificar se novos cards recebem .button__adicional.

## Conteúdo adicional 81


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-81

**Tipo:** CSS inline

**Peso:** ~61 caracteres

**Trecho:**

```css

.menu-list-156 { display:none; }

```

**Função:** visual / esconde um item de menu específico.

**Onde impacta:** header global. Validado: .menu-list-156 ❌ (não existe na Home).

**Status de uso:** Sem uso aparente / Obsoleto candidato.

**Duplicação:** padrão similar ao bloco 60 (acoplamento a IDs numéricos do menu).

**Sobrescreve outro:** sim.

**Está sendo sobrescrito:** Não.

**Erros:** ID volátil (156); se o item não existe mais, o CSS é morto.

**Impacto:** Performance Baixo; UX Baixo; Manutenção Alto (ID volátil); Estabilidade Baixo; SEO Não aplicável.

**Gravidade:** Baixa.

**Recomendação:** Remover após validação — confirmar com marketing se menu-list-156 foi excluído.

**Validação manual:** Console: document.querySelectorAll('.menu-list-156').length em todas as páginas.

## Conteúdo adicional 107


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-107

**Tipo:** Misto — JS + CSS

**Peso:** ~1.534 caracteres

**Trecho-chave:**

```js

(function () {

```

if (!window.location.pathname.includes("/cliente/pedidos")) return;

function inserirAviso() {

const alvo = document.querySelector(".info-pedidos");

if (!alvo) return false;

if (document.querySelector(".aviso-produto-pedido--dark")) return true;

alvo.insertAdjacentHTML('beforebegin', `

<div class="aviso-produto-pedido--dark" role="alert" aria-live="polite">

<p><span class="aviso-icone">⚠️</span><strong>Fique Atenta:</strong> Nenhuma taxa adicional é cobrada para realizar a entrega do pedido.</p>

</div>

`);

return true;

}

let tentativas = 0;

const timer = setInterval(() => {

tentativas++;

if (inserirAviso() || tentativas >= 30) clearInterval(timer);

}, 300);

})();

CSS de .aviso-produto-pedido--dark.

**Função:** funcional / insere aviso "nenhuma taxa adicional é cobrada para entrega" na página de pedidos do cliente (golpes de "taxa de entrega" são comuns).

**Onde impacta:** Apenas em /cliente/pedidos (já condicionado corretamente — bom!). Mas o conteúdo é carregado globalmente em todas as páginas, executa o if e sai.

**Status de uso:** Parcialmente em uso (só efetiva em pedidos).

**Duplicação:** Não.

**Sobrescreve outro:** Não.

**Está sendo sobrescrito:** Não.

**Erros leves:** 

setInterval a 300ms × 30 = 9s de polling. Aceitável, mas MutationObserver seria melhor.

O CSS é carregado globalmente (poluição), mesmo sendo usado só em /cliente/pedidos.

Boa prática presente: role="alert", aria-live="polite", evita duplicar.

**Impacto:** Performance Baixo (sai cedo via return); UX Alto positivo (proteção antifraude); Manutenção Baixo; Estabilidade Baixo; SEO Não aplicável.

**Gravidade:** Baixa.

**Recomendação:** Manter (lógica antifraude útil); idealmente condicionar por página para não carregar HTML+CSS+JS na Home.

**Validação manual:** navegar até /cliente/pedidos e ver se aparece o card de aviso acima de .info-pedidos.

## Conteúdo adicional 103


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-103

**Tipo:** JS inline

**Peso:** ~1.945 caracteres

**Trecho-chave:**

```js

(function () {

```

const STORAGE_KEY = 'influencerCouponData';

const MAX_DAYS = 1; // tempo que o cupom fica salvo

function formatNameFromId(id) { ... }

const params = new URLSearchParams(window.location.search);

const utmSourceRaw = params.get('utm_source');

if (utmSourceRaw && /^Cupom-/i.test(utmSourceRaw)) {

const rawId = decodeURIComponent(utmSourceRaw.replace(/^Cupom-/i, '')).trim();

if (rawId) {

const couponCode = rawId.toUpperCase();

const influencerName = formatNameFromId(rawId);

try {

localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

} catch (e) { console.warn('...'); }

params.delete('utm_source');

const newQuery = params.toString();

const newUrl = window.location.pathname + (newQuery ? '?' + newQuery : '') + window.location.hash;

window.history.replaceState({}, '', newUrl);

}

}

// Limpeza automática se o cupom já tiver passado do prazo

try {

const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

if (stored && stored.timestamp) {

const diffMs = Date.now() - stored.timestamp;

const diffDays = diffMs / (1000 * 60 * 60 * 24);

if (diffDays > MAX_DAYS) localStorage.removeItem(STORAGE_KEY);

}

} catch (e) {}

})();

**Função:** funcional / promocional — sistema de captura de cupom de influenciador. Quando a URL tem ?utm_source=Cupom-FULANA10, salva no localStorage o cupom FULANA10 por 1 dia, formata o nome do influencer, e remove o utm_source da URL via replaceState (não polui o histórico).

**Onde impacta:** global (precisa rodar em qualquer página de entrada).

**Status de uso:** Em uso (lógica viva, com expiração).

**Duplicação:** complementar ao bloco 69 (Solomon pixel — também trata atribuição). Sem duplicação literal.

**Sobrescreve outro:** Não.

**Está sendo sobrescrito:** Não.

**Erros / pontos de atenção:** 

Não há código visível de aplicação automática do cupom no checkout dentro deste bloco — só persiste em localStorage. Confirmar se algum outro conteúdo adicional ou app lê influencerCouponData para aplicar no carrinho. Se ninguém lê, o bloco é parcialmente morto.

MAX_DAYS = 1 é muito curto para uma janela de atribuição de campanha de influencer (geralmente 7–30 dias). Validar com marketing.

console.warn em produção (cosmético).

Boa prática: try/catch, replaceState em vez de pushState, expiração automática.

**Impacto:** Performance Baixo; UX Alto positivo (atribuição/cupom); Manutenção Médio; Estabilidade Baixo; SEO Baixo (limpa URL, ajuda canonicalização).

**Gravidade:** Média (depende de validação comercial sobre MAX_DAYS=1 e sobre quem consome influencerCouponData).

**Recomendação:** Investigar manualmente com marketing — confirmar se o cupom é aplicado no checkout e qual a janela desejada de atribuição.

**Validação manual:** simular ?utm_source=Cupom-TESTE10 na URL, abrir DevTools → Application → Local Storage → procurar influencerCouponData; depois ir ao checkout e verificar se o cupom é aplicado.

## Conteúdo adicional 130


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-130

**Tipo:** CSS inline

**Peso:** ~411 caracteres

**Trecho:**

```css

.global-root-27CbN.global-reset-2xxDJ.global-scope-3EHyX.global-bottom_right-2n1BB.global-minimized-1ItFW.global-noDark-22WfB { display: none !important; }

```

.global-root-27CbN.global-reset-2xxDJ.global-scope-3EHyX.global-mid_right-USeRX.global-minimized-1ItFW.global-rotate-8mgx1.global-noDark-22WfB { display: none !important; }

.fidegg-simulation { display: none !important; }

**Função:** visual / esconde widgets de terceiros — provavelmente um chat/widget JivoChat/Octadesk (classes global-root-…-… com hashes) e o widget Fidegg de simulação de frete/parcelamento.

**Onde impacta:** global. Validado: .global-root-27CbN ✅ (existe na Home — ou seja, o widget está sendo carregado e depois oculto via CSS). .fidegg-simulation não está visível na Home.

**Status de uso:** Em uso parcial (esconde efetivamente o .global-root-27CbN).

**Duplicação:** Não literal.

**Sobrescreve outro:** sim — esconde widgets de terceiros que ainda são carregados.

**Está sendo sobrescrito:** Não.

Erros (sérios):

Anti-padrão crítico: o widget de terceiro ainda está sendo carregado (JS, CSS, fontes, possivelmente WebSocket), só está visualmente oculto. Peso desnecessário em rede e CPU. O correto seria desinstalar o app que injeta esses widgets.

Seletores baseados em hashes de CSS-in-JS (27CbN, 2xxDJ, 8mgx1) — são gerados aleatoriamente pelo build do widget e podem mudar a qualquer atualização do app, fazendo a regra parar de funcionar silenciosamente.

O encadeamento de 6 classes torna o seletor extremamente frágil.

**Impacto:** Performance Alto (widget de terceiro continua carregando); UX Médio (widget pode "piscar" antes do CSS aplicar); Manutenção Alto (hashes voláteis); Estabilidade Alto; SEO Não aplicável.

**Gravidade:** Alta.

**Recomendação:** Remover imediatamente o app que injeta esses widgets (pelo painel Magazord/Apps), e em seguida remover este conteúdo adicional. Se precisar manter o app por algum motivo de tracking, usar display:none no container raiz do app, não nas classes-hash.

**Validação manual:** Network tab → filtrar por jivo, octa, fidegg, tawk etc. → ver se requisições são feitas mesmo o widget estando "oculto".

## Conteúdo adicional 112


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-112

**Tipo:** CSS inline

**Peso:** ~348 caracteres

**Trecho:**

```css

ul#nav-root>li>.container-menu { background:#fff!important; }

```

ul#nav-root>li>.container-menu ul {}

ul#nav-root>li>.container-menu ul li { margin-bottom:0px !important; }

ul#nav-root>li>.container-menu ul li a { font-weight:normal !important; }

ul#nav-root>li>.container-menu ul li a:hover { opacity:80% !important; }

**Função:** visual / estiliza dropdown do menu principal.

**Onde impacta:** header global. Validado: #nav-root ✅.

**Status de uso:** Em uso.

**Duplicação:** Conflito direto com bloco 113 e 70 (todos atuam em ul#nav-root>li>.container-menu).

**Sobrescreve outro:** sim.

**Está sendo sobrescrito:** ordem de cascata depende da ordem de inserção dos blocos no <head>/body — risco de regra ganhar/perder dependendo de mudanças do CMS.

**Erros:** regra ul#nav-root>li>.container-menu ul {} vazia — CSS morto; uso massivo de !important; duplicação seletor com 113.

**Impacto:** Performance Baixo; UX Baixo; Manutenção Alto; Estabilidade Médio; SEO Não aplicável.

**Gravidade:** Média.

**Recomendação:** Unificar com 113, 70, 60, 82 num único bloco "Header & Menu". Remover regra vazia.

**Validação manual:** Coverage panel → ver % de CSS não usado deste bloco.

## Conteúdo adicional 94


**Classe:** .pagina-conteudo-adicional.conteudo-adicional-94

**Tipo:** CSS inline

**Peso:** ~1.828 caracteres (o mais pesado entre os CSS-only)

**Trecho-chave:**

```css

.tag-area .superior-direito { right:-17% !important; }

```

.superior-direito { right:-20% !important; }

.tag-area .superior-direito .tag-13 { background-color:transparent !important; border:1px solid #fff; }

.tag-area .superior-direito .tag-14 { background-color:transparent !important; border:1px solid #000; color:#000; }

.tag-area .superior-direito .tag-15 { background-color:transparent !important; border:1px solid #000; color:#000; }

.tag-area .superior-direito .tag-21 { background-color:transparent !important; border:1px solid #000; color:#000; }

.tag-area .superior-direito .tag-1 { border-radius:0px; }

.superior-direito .tag-1 .tag-value { border-radius:0px; right:15% !important; }

.superior-direito .tag-12 .tag-value { ... right:9%; }

.superior-direito .tag-13 .tag-value { ... right:9%; }

.superior-direito .tag-14 .tag-value { ... right:9%; }

.superior-direito .tag-15 .tag-value { ... right:9%; }

.superior-direito .tag-21 .tag-value { ... right:9%; }

@media(max-width:768px){

.tag-area .superior-direito { right:5%; }

.tag-area .superior-direito .tag-13 { ... border:1px solid #fff; }

.tag-area .superior-direito .tag-14 { ... border:1px solid #fff; }

}

**Função:** visual / estilização das tags promocionais (tag-13, tag-14, tag-15, tag-21, tag-12, tag-1) sobre os produtos das vitrines, com fundo transparente, bordas e posicionamento.

**Onde impacta:** vitrines (.tag-area .superior-direito). Validado: 6 .superior-direito na Home.

**Status de uso:** Em uso. Mas há excesso de IDs hardcoded de tags (1, 12, 13, 14, 15, 21) — algumas podem ter sido descontinuadas pelo marketing.

**Duplicação:** parcial com 37/45 (estilização de vitrines).

**Sobrescreve outro:** sim.

**Está sendo sobrescrito:** Não.

**Erros:** 

Uso massivo de !important (>20 ocorrências).

Posicionamento com percentuais negativos (right:-17%, right:-20%) — frágil em mobile, risco real de overflow horizontal.

IDs numéricos de tags (tag-13, tag-14, tag-15, tag-21) acoplam o CSS a registros do CMS — se uma tag for excluída, o CSS é morto silenciosamente.

Regra .superior-direito { right:-20%!important } é sobrescrita imediatamente abaixo por .tag-area .superior-direito { right:-17%!important } no mesmo bloco — redundância interna.

@media(max-width:768px) redefine border para algumas tags — duplicação dentro do próprio bloco.

**Impacto:** Performance Baixo; UX Médio/Alto (risco de overflow horizontal mobile, CLS visual); Manutenção Alto; Estabilidade Médio; SEO Não aplicável.

**Gravidade:** Alta.

**Recomendação:** Refatorar. Eliminar !important desnecessários, trocar percentuais negativos por posicionamento absoluto controlado, validar com marketing quais tag-XX ainda existem; idealmente unificar com 37 e 45 num arquivo CSS de "Vitrine & Tags".

**Validação manual:** testar em viewport ≤375px e verificar overflow horizontal (DevTools → Rendering → "Show scrollbars"); Coverage panel para regras de tags inexistentes.

# Tabela-resumo

NºTipoFunçãoEm uso?Duplica/Conflita comGravidadeRecomendação22CSSHover zoom em .zoom❌ não encontrado—MédiaRemover após validação69JS ext.Pixel Solomon (tracking)✅103 (correlato)MédiaManter (mover p/ GTM)26CSSEsconde link footer❌ não encontrado64 (correlato)BaixaRemover após validação5CSS.tipo-vitrine-11 height❌ na Home10MédiaUnificar com 1060CSSDestaca menu-link-154❌ não encontrado81, 113, 112MédiaInvestigar (ID volátil)68CSSMin-height recomendados⚠️ parcial—BaixaManter70CSSMargin-left menu✅113, 112, 82MédiaRefatorar/Unificar64CSSBg-footer Reclame Aqui✅26BaixaManter36CSSOrdem PIX/Cartão PDP✅ (PDP)—MédiaCondicionar por página82CSSTamanho do logo✅70 (correlato)BaixaManter/Unificar37CSSVitrines 02 e 17✅ (17)45, 35, 94AltaInvestigar marketing/Unificar45CSSHeader+PDP+vitrine+frete⚠️ parcial37, 35AltaRefatorar (CSS quebrado)113CSSSubmenus 216/114✅112, 70MédiaUnificar10CSSImg principal + vitrine 11⚠️ parcial5MédiaRefatorar/Unificar35JS+CSSBotão "COMPRAR" custom✅37, 45AltaRefatorar (jQuery + setInterval)81CSSEsconde menu-list-156❌ não encontrado60 (padrão)BaixaRemover após validação107JS+CSSAviso antifraude pedidos⚠️ só em /cliente/pedidos—BaixaManter / condicionar103JSCupom influencer (utm_source)✅69 (correlato)MédiaInvestigar marketing130CSSEsconde widgets terceiros✅ (oculta)—AltaDesinstalar app112CSSSubmenu nav-root✅113, 70MédiaUnificar94CSSTags promocionais✅37, 45AltaRefatorar (!important + %)

# Resumo executivo
## Inventário

Total de conteúdos adicionais analisados: 21
Em uso confirmado: 12 (69, 68, 70, 64, 36, 82, 37, 45, 113, 35, 107, 103, 130, 112, 94 — alguns parciais)
Parcialmente em uso: 6 (45, 10, 36, 68, 107, 130)
Sem uso aparente / candidatos a obsoleto: 5 (22, 26, 60, 81, parte de 5/10)
Com erros técnicos visíveis: 8 (45 CSS quebrado, 35 jQuery+setInterval, 70/82/113/112 conflito de header, 94 !important+%, 130 widgets de terceiro)
Possuem duplicação/sobreposição: 9 (5↔10; 70↔112↔113↔82; 37↔45↔35↔94; 26↔64; 60↔81)
Rodam globalmente sem necessidade: 15+ (praticamente todos os blocos de PDP, painel do cliente e vitrines estão sempre presentes na Home)
Deveriam ser condicionados por página: 36 (PDP), 107 (/cliente/pedidos), 35 (vitrine), 5/10 (vitrine 11)

## Mais críticos (prioridade máxima)

130 — Esconde widgets de terceiros que continuam carregando. Maior ganho rápido de performance: desinstalar o app e remover o CSS.
35 — Botão "COMPRAR" via setInterval 500ms × 10 + jQuery. Impacta INP/TBT em mobile e em vitrines paginadas. Refatorar com MutationObserver.
45 — CSS inválido (chave não fechada) e mistura 4 propósitos diferentes. Risco de propagação de bugs de parser.
94 — Estilização de tags com !important excessivo e percentuais negativos: risco real de overflow horizontal no mobile.
37 — Esconde parcelamento e preço secundário em vitrines. Decisão comercial — validar com marketing antes de manter/remover.

## Devem ser removidos primeiro (após validação rápida)

22 (.zoom não existe), 26 (footer-link-atendimento não existe), 60 (menu-link-154 não existe), 81 (menu-list-156 não existe). Custo de validação baixo, ganho de manutenção alto.

## Devem ser refatorados primeiro

35 (JS), 45 (CSS quebrado), 94 (CSS frágil), 130 (widgets de terceiro), 103 (validar MAX_DAYS=1).

## Podem ser unificados (consolidação de manutenção)

Header & Menu: 70 + 82 + 112 + 113 + 60 → 1 único conteúdo "Header.css".
Vitrine & Tags: 5 + 10 + 37 + 94 + 35 → 1 único conteúdo "Vitrine.css" + 1 único "Vitrine.js".
Footer: 26 + 64 → 1 único "Footer.css".

Maior risco de performance: 130 (widgets de terceiro carregados) > 35 (jQuery + polling) > 69 (3rd party tracking) > 94 (CSS pesado).
Maior risco de manutenção: 35 (jQuery+setInterval), 45 (CSS quebrado), 130 (hashes voláteis), 60/81/94 (IDs/tags hardcoded), 70+112+113+82 (cascata de header competindo).
Maior risco de UX: 94 (overflow mobile), 45 (CSS inválido), 37 (esconde info comercial), 10 (CLS na PDP), 130 (widget piscando antes do display:none).
Maior risco para conversão: 37 (esconde parcelamento), 35 (botão CTA crítico — se quebrar a vitrine perde conversão), 103 (cupom de influencer com janela de 1 dia pode estar sub-utilizando atribuição), 36 (ordem PIX/cartão na PDP).
## Ordem de correção recomendada

Remoção segura (semana 1) — Validar e remover 22, 26, 60, 81. Risco baixo, ganho de limpeza.
Crítico de performance (semana 1) — 130: desinstalar app que injeta os widgets global-root-… e Fidegg.
Refatoração crítica (semana 2) — 45 (fechar CSS, separar propósitos) e 35 (trocar setInterval por MutationObserver, remover jQuery).
Decisão comercial (semana 2) — Reunir com marketing para validar 37, 103, 130 (parcelamento, janela de cupom, widgets).
Consolidação (semana 3) — Unificar Header (70+82+112+113), Vitrine (5+10+37+94+35), Footer (26+64).
Otimização (semana 4) — Condicionar por página: 36 (PDP), 107 (/cliente/pedidos), 35 (vitrine). Mover CSS inline para arquivo único versionado.

Observação final: a auditoria foi feita exclusivamente sobre a Home renderizada. Para fechar a análise, recomendo rodar o mesmo document.querySelectorAll('.pagina-conteudo-adicional') em PDP, categoria, busca, carrinho, checkout, /cliente/pedidos — alguns blocos podem ter dependências (ou códigos extras) que aparecem só nessas páginas. Posso reexecutar essa varredura em qualquer outra URL se você abrir a página correspondente.
