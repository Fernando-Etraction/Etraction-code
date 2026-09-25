# Auditoria Técnica — Conteúdos Adicionais Magazord (armfitness.com.br)

> Análise feita lendo o DOM real de / (Home, 21 blocos) e /legging-powerslim-marrom-avela (PDP, 33 blocos). Total de 33 blocos únicos.

# Conteúdos Auditados

## Conteúdo adicional 5


**Classe:** .conteudo-adicional-5

**Tipo:** CSS

**Função:** Zera min-height e força height: 22px em .tipo-vitrine-11 .product-name.

**Onde impacta:** Home (vitrines tipo 11). Apenas o nome do produto na vitrine. Local.

**Status de uso:** Parcialmente em uso — só tem efeito se ainda houver vitrine tipo 11 ativa no painel. Tem overlap com o bloco 10.

**Duplicação:** Sim, com bloco 10 (ambos manipulam .tipo-vitrine-11).

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não diretamente, mas dialoga com 10.

**Erros encontrados:** CSS embrulhado em <!-- ... --> HTML dentro de  (funciona no Chromium mas é prática ruim). Uso de !important desnecessário.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Baixo |
| Manutenção | Médio (código pulverizado) |
| Estabilidade | Baixo |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Unificar com bloco 10 num único conteúdo "Vitrine 11".

**Melhoria sugerida:** Remover <!-- -->, remover !important e centralizar todas as regras de .tipo-vitrine-11 em um único bloco.

## Conteúdo adicional 10


**Classe:** .conteudo-adicional-10

**Tipo:** CSS

**Função:** Aplica padding-left: 10px em img.img-principal.lazyloaded e esconde .tipo-vitrine-11 .preco-de.

**Onde impacta:** Home + PDP. Imagem principal e preço "de" das vitrines tipo 11. Local/global (a regra da imagem é genérica).

**Status de uso:** Em uso.

**Duplicação:** Sim, com bloco 5.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Seletor genérico para imagem (img.img-principal.lazyautosizes.lazyloaded) que afeta qualquer página. CSS dentro de <!-- -->. !important em padding-left.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Médio (padding em todas as imagens principais) |
| Manutenção | Médio |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Unificar com bloco 5 e restringir o seletor de imagem (ex.: .tipo-vitrine-XX img.img-principal).

**Melhoria sugerida:** Escopar para a vitrine onde realmente é necessário.

## Conteúdo adicional 22


**Classe:** .conteudo-adicional-22

**Tipo:** CSS

**Função:** Define .zoom { transform/transition } e hover.

**Onde impacta:** Home. Não foi encontrado nenhum elemento .zoom no DOM da home — seletor sem alvo.

**Status de uso:** Sem uso aparente. CSS não bate com nenhum elemento renderizado.

**Duplicação:** Não.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Seletor genérico .zoom (alto risco de colisão com classes de terceiros). CSS embrulhado em <!-- -->. Sem efeito visível.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Baixo |
| Manutenção | Médio (CSS morto) |
| Estabilidade | Médio (se outra biblioteca usar .zoom quebra) |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Remover (após validar com $$('.zoom') no DevTools).

**Melhoria sugerida:** Se for resgatar a feature, prefixar a classe (ex.: .arm-zoom).

## Conteúdo adicional 25


**Classe:** .conteudo-adicional-25

**Tipo:** JS (jQuery)

**Função:** No document.ready, conta avaliações do produto e: remove o bloco se 0; adapta texto se < 10; remove número/separador se ≥ 10.

**Onde impacta:** PDP — bloco de avaliações (.avaliacoes/.numero-avaliacoes).

**Status de uso:** Em uso.

**Duplicação:** Não.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Não valida typeof jQuery. Manipula DOM antes que widgets assíncronos terminem (race). Sem fallback se a estrutura mudar ($bloco.remove() permanente).
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Médio (avaliações podem desaparecer em race) |
| Manutenção | Médio |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Média

**Recomendação:** Ajustar.

**Melhoria sugerida:** Trocar $(document).ready por MutationObserver no container das avaliações; adicionar guards.

## Conteúdo adicional 26


**Classe:** .conteudo-adicional-26

**Tipo:** CSS

**Função:** Esconde li.flex.center.footer-link-atendimento.

**Onde impacta:** Home + PDP — link de atendimento no footer. Global.

**Status de uso:** Em uso.

**Duplicação:** Sim — função semelhante (esconder elemento de header/menu) com 45, 60, 81, 130.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** !important desnecessário; um seletor por bloco (poderia ser consolidado).
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Baixo |
| Manutenção | Alto (regras "esconder" pulverizadas em vários blocos) |
| Estabilidade | Baixo |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Unificar com 45/60/81/130 num bloco "Header/Menu/Footer overrides".

**Melhoria sugerida:** Centralizar todos os display:none num único bloco com comentários.

## Conteúdo adicional 27


**Classe:** .conteudo-adicional-27

**Tipo:** JS (jQuery)

**Função:** Em window.load, troca o título do bloco "avise-me" para "Produto esgotado!".

**Onde impacta:** PDP — apenas produtos sem estoque com .avise-me.

**Status de uso:** Em uso (condicional).

**Duplicação:** Não.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Usa window.load (espera todos os recursos) só para trocar texto — desperdício; nenhuma validação de existência.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo (mas atrasa percepção) |
| UX | Médio (texto correto demora a aparecer) |
| Manutenção | Baixo |
| Estabilidade | Baixo |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Ajustar.

**Melhoria sugerida:** Mover para DOMContentLoaded; melhor ainda: trocar via configuração do template, não JS.

## Conteúdo adicional 30


**Classe:** .conteudo-adicional-30

**Tipo:** CSS

**Função:** Estilos da Tabela de Medidas (.tabela-medidas, .measurements-table, .category-btn, #dialogstyle, #buttonFechar, .btn-tabela).

**Onde impacta:** PDP — modal/diálogo de tabela de medidas.

**Status de uso:** Em uso (mas duplicado por 46/61/105).

**Duplicação:** Sim, com 46, 61, 105, 115 (todos relacionados à mesma feature).

**Sobrescreve outro conteúdo:** Sim, parte é sobrescrita por 46 (.btn-tabela { display:none } no 46 anula o estilo do 30/61).

**Está sendo sobrescrito:** Sim, por 46.

**Erros encontrados:** width: 106% em mobile (estoura container, gera scroll horizontal/CLS). IDs muito genéricos (#dialogstyle, #buttonFechar).
### Impacto

| Área | Nível |
|---|---|
| Performance | Médio (5,7 KB inline) |
| UX | Médio (CLS no mobile pelo 106%) |
| Manutenção | Alto |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Alta

**Recomendação:** Unificar com 46, 61, 105, 115 em um único bloco "Tabela de Medidas".

**Melhoria sugerida:** Corrigir width: 106% → width: 100%; mover estilos para o tema; trocar IDs por classes namespaced.

## Conteúdo adicional 31


**Classe:** .conteudo-adicional-31

**Tipo:** <link rel="stylesheet"> externo (Font Awesome 5.15.4 via cdnjs)

**Função:** Carrega Font Awesome inteiro do CDN.

**Onde impacta:** PDP. Render-blocking, afeta LCP.

**Status de uso:** Em uso (mas o tema provavelmente já carrega ícones próprios).

**Duplicação:** Possível duplicação com biblioteca de ícones do tema Magazord. Validar.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Sem integrity/crossorigin (sem SRI). Render-blocking. CDN externa adiciona terceiro DNS lookup (cdnjs.cloudflare.com). Carregar ~70 KB para usar 1–2 ícones.
### Impacto

| Área | Nível |
|---|---|
| Performance | Crítico (LCP/TBT) |
| UX | Médio |
| Manutenção | Médio (versão pinada que envelhece) |
| Estabilidade | Médio (CDN third-party) |
| SEO | Médio (LCP) |

**Gravidade:** Crítica

**Recomendação:** Remover/refatorar.

**Melhoria sugerida:** Substituir os ícones realmente usados por SVG inline; se manter FA, self-host só do subset usado.

## Conteúdo adicional 35


**Classe:** .conteudo-adicional-35

**Tipo:** JS (jQuery + setInterval)

**Função:** Injeta um <a class="botao-comprar">COMPRAR</a> em cada ul.product-list > li com base no link do produto. Roda em setInterval (500 ms) para pegar vitrines carregadas tarde.

**Onde impacta:** Home + PDP (vitrines globais).

**Status de uso:** Em uso.

**Duplicação:** Não, mas concorre com lógica nativa da Magazord.

**Sobrescreve outro conteúdo:** Pode duplicar HTML se outra script injetar botão semelhante.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** setInterval(500) sem timeout máximo claro. Cria <a> aninhado dentro de <li> que já tem <a> (HTML inválido). Não valida jQuery. each em todos os li a cada tick.
### Impacto

| Área | Nível |
|---|---|
| Performance | Alto (INP/TBT, layout thrashing contínuo) |
| UX | Médio (CLS por inserção tardia) |
| Manutenção | Alto |
| Estabilidade | Alto |
| SEO | Médio (HTML inválido) |

**Gravidade:** Alta

**Recomendação:** Refatorar.

**Melhoria sugerida:** Substituir setInterval por MutationObserver no container de vitrines; envolver botão em <div> para evitar <a> aninhado; encerrar observer após N detecções.

## Conteúdo adicional 36


**Classe:** .conteudo-adicional-36

**Tipo:** CSS

**Função:** Reordena/formata área de pagamento da PDP (.buy-area .pix, .values-area.forma-pagamento-2 .card).

**Onde impacta:** Home + PDP — bloco de preço e formas de pagamento.

**Status de uso:** Em uso.

**Duplicação:** Sim — sobreposição com bloco 62 (também ajusta .buy-area .price).

**Sobrescreve outro conteúdo:** Compartilha escopo com 62.

**Está sendo sobrescrito:** Pode ser sobrescrito por 62 (que vem depois).

**Erros encontrados:** Linhas em branco font-weight:bold; sem outras props pode ser dead code. Mistura de seletores sem comentários.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Médio |
| Manutenção | Médio |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Média

**Recomendação:** Unificar com 62.

**Melhoria sugerida:** Bloco único "PDP – Preço e Pagamento".

## Conteúdo adicional 37


**Classe:** .conteudo-adicional-37

**Tipo:** CSS

**Função:** Esconde .type-payment-condiction e .secondary-price em vitrines 02/17 e centraliza .rating/.primary-price.

**Onde impacta:** Home + PDP (vitrines 02/17). Local.

**Status de uso:** Em uso.

**Duplicação:** Não.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Repete o mesmo grupo de seletores 4× (poderia agrupar .tipo-vitrine-02, .tipo-vitrine-17 num bloco só por propriedade).
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Baixo |
| Manutenção | Médio |
| Estabilidade | Baixo |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Ajustar (compactar seletores).

**Melhoria sugerida:** Agrupar regras por propriedade; manter.

## Conteúdo adicional 44


**Classe:** .conteudo-adicional-44

**Tipo:** CSS

**Função:** Força height: 100% !important no figure da galeria principal Swiper.

**Onde impacta:** PDP — galeria de imagens.

**Status de uso:** Em uso.

**Duplicação:** Não diretamente, mas próximo de 45 (que também mexe em vídeo da galeria).

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** !important em height (transição/reflow custoso se houver animação).
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Médio (CLS na galeria se as imagens tiverem aspect-ratio variado) |
| Manutenção | Baixo |
| Estabilidade | Baixo |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Manter (mas validar visualmente).

**Melhoria sugerida:** Remover !important se possível; usar aspect-ratio.

## Conteúdo adicional 45


**Classe:** .conteudo-adicional-45

**Tipo:** CSS

**Função:** Esconde .meus-favoritos, força altura de vídeo da vitrine, esconde #videos-produto, força display:block em .item-frete-oferta.

**Onde impacta:** Home + PDP — header (favoritos), vitrine (vídeo), PDP (vídeos), área de frete.

**Status de uso:** Parcialmente em uso (mistura de funções).

**Duplicação:** Sim — função "esconder" sobrepõe 26, 60, 81, 130.

**Sobrescreve outro conteúdo:** Pode sobrescrever 44 (ambos mexem em altura de figure/vídeo).

**Está sendo sobrescrito:** Não claramente.

**Erros encontrados:** CSS sintaticamente quebrado — a regra .item-frete-oferta { display: block !important;  aparece sem } no fim. Pode contaminar regras seguintes do navegador. Bloco com 4 funções diferentes (alta entropia).
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Alto (CSS quebrado pode propagar) |
| Manutenção | Alto |
| Estabilidade | Alto |
| SEO | Baixo |

**Gravidade:** Alta

**Recomendação:** Refatorar urgente.

**Melhoria sugerida:** Fechar a regra; quebrar em 4 blocos menores (favoritos, vídeo vitrine, vídeo PDP, frete) ou consolidar com outros do mesmo escopo.

## Conteúdo adicional 46


**Classe:** .conteudo-adicional-46

**Tipo:** CSS

**Função:** Estilos do Modal de Medidas baseado em SweetAlert2 (.modal-medidas, .imagem-modelo, .swal2-title).

**Onde impacta:** PDP — modal de tabela de medidas.

**Status de uso:** Em uso (condicional ao abrir o modal).

**Duplicação:** Sim, com 30, 61, 105, 115 (mesma feature).

**Sobrescreve outro conteúdo:** Sobrescreve 30 (.btn-tabela { display: none }).

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Depende de SweetAlert2 (Swal não estava carregado no momento da inspeção — verificar).
### Impacto

| Área | Nível |
|---|---|
| Performance | Médio (4,8 KB) |
| UX | Médio |
| Manutenção | Alto |
| Estabilidade | Médio (depende de Swal) |
| SEO | Baixo |

**Gravidade:** Alta

**Recomendação:** Unificar com 30/61/105/115.

**Melhoria sugerida:** Mover para arquivo CSS dedicado da feature, carregar sob demanda quando o modal abrir.

## Conteúdo adicional 60


**Classe:** .conteudo-adicional-60

**Tipo:** CSS

**Função:** Pinta .menu-link-154 de preto com texto branco.

**Onde impacta:** Home + PDP — menu (item específico, possivelmente "BLACK FRIDAY" ou destaque).

**Status de uso:** Em uso (depende do menu 154 existir).

**Duplicação:** Sim — função "menu override" com 70, 81, 112, 113.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Pode ser sobrescrito por 112 (background fff no container-menu).

**Erros encontrados:** Seletor com ID hardcoded de menu (-154) — quebra se o item for recriado.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Baixo |
| Manutenção | Médio |
| Estabilidade | Médio (ID frágil) |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Unificar com 70/81/112/113.

**Melhoria sugerida:** Adicionar uma classe semântica no item (.menu-destaque) em vez de depender do ID numérico.

## Conteúdo adicional 61


**Classe:** .conteudo-adicional-61

**Tipo:** CSS

**Função:** Estiliza o botão #abrir-tabela-medidas.

**Onde impacta:** PDP — botão que abre tabela de medidas.

**Status de uso:** Em uso (mas o bloco 115 esconde #abrir-tabela-medidas com display:none no estado inicial).

**Duplicação:** Sim, com 30, 46, 105, 115.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Sim, por 115 (#abrir-tabela-medidas { display: none }).

**Erros encontrados:** Esforço perdido — estiliza um botão que está oculto até o JS de Smart Size injetar.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Baixo |
| Manutenção | Alto (estilo "fantasma") |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Média

**Recomendação:** Unificar com 115; remover redundância.

**Melhoria sugerida:** Bloco único "Tabela de Medidas" gerenciando display + estilos juntos.

## Conteúdo adicional 62


**Classe:** .conteudo-adicional-62

**Tipo:** CSS

**Função:** Tipografia e ordem do preço na PDP; esconde .desconto-pix; força largura de .informacoes-compra-produto e .block-imagem em desktop.

**Onde impacta:** PDP — área de compra.

**Status de uso:** Em uso.

**Duplicação:** Sim, com bloco 36.

**Sobrescreve outro conteúdo:** Sobrescreve regras do tema e do bloco 36 (vem depois).

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Vários !important em font-size e width. width: 480px !important quebra responsividade entre 768–1024px.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Alto (largura fixa quebra layout em tablets) |
| Manutenção | Médio |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Alta

**Recomendação:** Refatorar e unificar com 36.

**Melhoria sugerida:** Trocar width: 480px por max-width + flex; remover !important.

## Conteúdo adicional 64


**Classe:** .conteudo-adicional-64

**Tipo:** CSS

**Função:** Força background branco em .ra-footer .bg-footer-light-blue-color.

**Onde impacta:** Home + PDP — selo ReclameAqui no footer.

**Status de uso:** Em uso (se o widget RA estiver ativo).

**Duplicação:** Não.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** !important para um override simples.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Baixo |
| Manutenção | Baixo |
| Estabilidade | Baixo |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Manter como está.

**Melhoria sugerida:** Mover para o CSS global do tema.

## Conteúdo adicional 68


**Classe:** .conteudo-adicional-68

**Tipo:** CSS

**Função:** Zera min-height do .recomender-items.

**Onde impacta:** Home + PDP — vitrine de recomendados.

**Status de uso:** Em uso.

**Duplicação:** Não.

**Sobrescreve outro conteúdo:** Sim — anula o min-height nativo do tema.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Pode causar CLS (sem min-height, a vitrine pula quando os itens carregam).
### Impacto

| Área | Nível |
|---|---|
| Performance | Médio (CLS) |
| UX | Alto (salto visual) |
| Manutenção | Baixo |
| Estabilidade | Médio |
| SEO | Médio (Core Web Vitals) |

**Gravidade:** Média

**Recomendação:** Refatorar.

**Melhoria sugerida:** Em vez de zerar, calcular o min-height correto baseado no card da vitrine.

## Conteúdo adicional 69


**Classe:** .conteudo-adicional-69

**Tipo:** <script src> externo (storage.googleapis.com/solomon-app-scripts/magazord_pixel_interno.js)

**Função:** Pixel de tracking interno (Solomon).

**Onde impacta:** Home + PDP. Global.

**Status de uso:** Em uso.

**Duplicação:** Validar se há outro pixel duplicado (GA/GTM/Meta).

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Sem async/defer declarados na tag (validar). Sem integrity/SRI. Recurso third-party externo.
### Impacto

| Área | Nível |
|---|---|
| Performance | Médio (bloqueio se síncrono) |
| UX | Baixo |
| Manutenção | Baixo |
| Estabilidade | Médio (depende do GCS) |
| SEO | Baixo |

**Gravidade:** Média

**Recomendação:** Ajustar.

**Melhoria sugerida:** Adicionar async; preconnect para storage.googleapis.com.

## Conteúdo adicional 70


**Classe:** .conteudo-adicional-70

**Tipo:** CSS

**Função:** margin-left: 75px em ul#nav-root.

**Onde impacta:** Home + PDP — menu principal.

**Status de uso:** Em uso.

**Duplicação:** Sim — função "menu override" com 60, 81, 112, 113.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Margin fixo em px, sem media query → empurra menu em telas pequenas.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Médio (mobile) |
| Manutenção | Baixo |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Média

**Recomendação:** Unificar com 60/81/112/113.

**Melhoria sugerida:** Usar gap/flex no header; envelopar em media query.

## Conteúdo adicional 81


**Classe:** .conteudo-adicional-81

**Tipo:** CSS

**Função:** Esconde .menu-list-156.

**Onde impacta:** Home + PDP — item de menu específico.

**Status de uso:** Em uso (se item 156 existir).

**Duplicação:** Sim — função "esconder elemento" com 26, 45, 60, 130.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** ID hardcoded -156.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Baixo |
| Manutenção | Médio |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Unificar com bloco "Header/Menu". Se item já foi excluído, remover.

**Melhoria sugerida:** Excluir o item no admin em vez de esconder via CSS.

## Conteúdo adicional 82


**Classe:** .conteudo-adicional-82

**Tipo:** CSS

**Função:** `.logo img/Conteúdo adicional: 82

**Classe:** .conteudo-adicional-82

**Tipo:** CSS

**Função:** Limita max-width: 100px no <img> e <svg> da .logo.

**Onde impacta:** Home + PDP — header (logo).

**Status de uso:** Em uso.

**Duplicação:** Não.

**Sobrescreve outro conteúdo:** Sim — sobrescreve o tamanho nativo da logo do tema.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Sem media query (mesmo tamanho desktop/mobile). Pode degradar LCP se a logo for o LCP candidate.
### Impacto

| Área | Nível |
|---|---|
| Performance | Médio (LCP em mobile se logo for o maior elemento) |
| UX | Médio |
| Manutenção | Baixo |
| Estabilidade | Baixo |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Manter (mas considerar configurar tamanho da logo no admin do tema).

**Melhoria sugerida:** Definir tamanho responsivo (ex.: clamp(80px, 10vw, 120px)).

## Conteúdo adicional 85


**Classe:** .conteudo-adicional-85

**Tipo:** JS (setInterval 100 ms)

**Função:** Aguarda dois elementos existirem e move um (alvo.after(elemento)) — provavelmente reposiciona botão Smart Size / Try On.

**Onde impacta:** PDP — área de compra.

**Status de uso:** Em uso.

**Duplicação:** Lógica próxima do bloco 86.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** setInterval(100) sem clearInterval se elementos nunca aparecerem (possível leak). Roda em todas as PDPs mesmo quando não há Smart Size.
### Impacto

| Área | Nível |
|---|---|
| Performance | Médio (INP, leak potencial) |
| UX | Baixo |
| Manutenção | Médio |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Média

**Recomendação:** Refatorar.

**Melhoria sugerida:** Substituir por MutationObserver com timeout máximo (ex.: 10 s) e disconnect().

## Conteúdo adicional 86


**Classe:** .conteudo-adicional-86

**Tipo:** JS (DOMContentLoaded)

**Função:** Manipula uma label (provavelmente texto de variação/tamanho).

**Onde impacta:** PDP — área de variação.

**Status de uso:** Em uso.

**Duplicação:** Próxima de 85 e 25 em escopo.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Sem fallback se label não existir (faz if (label), OK). Sem reexecução em troca de SKU.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Médio (se a label muda em outra interação, fica desatualizada) |
| Manutenção | Baixo |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Ajustar.

**Melhoria sugerida:** Reexecutar via evento de troca de variação Magazord.

## Conteúdo adicional 94


**Classe:** .conteudo-adicional-94

**Tipo:** CSS

**Função:** Estiliza tags promocionais .tag-area .superior-direito .tag-1, .tag-12 ... .tag-21 na vitrine da Home (cores, bordas, posicionamento, responsivo).

**Onde impacta:** Home — selos/tags promocionais nas vitrines.

**Status de uso:** Em uso (mas só efetivo nas tags configuradas).

**Duplicação:** Sim, com bloco 96 (mesma família para PDP).

**Sobrescreve outro conteúdo:** Sobrescreve o tema.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Mais de 20 !important. CSS embrulhado em <!-- -->. IDs tag-13, tag-14, tag-15, tag-21 hardcoded — quebra se cliente criar tag-22.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Médio |
| Manutenção | Crítico (regra repetida 5×, IDs hardcoded) |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Alta

**Recomendação:** Unificar com 96 e refatorar.

**Melhoria sugerida:** Criar uma única regra mãe .tag-area .superior-direito [class*="tag-"] com defaults; usar variáveis CSS por tag se necessário.

## Conteúdo adicional 96


**Classe:** .conteudo-adicional-96

**Tipo:** CSS

**Função:** Mesma família de tags .tag-area .superior-direito .tag-* mas para a PDP (com right:17%).

**Onde impacta:** PDP.

**Status de uso:** Em uso.

**Duplicação:** Sim, com 94.

**Sobrescreve outro conteúdo:** Sobrescreve o tema.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Idem 94 (!important excessivo, IDs hardcoded, <!-- -->).
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Médio |
| Manutenção | Alto |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Alta

**Recomendação:** Unificar com 94 num único bloco "Tags promocionais", usando seletores de página (body.home/body.produto).

**Melhoria sugerida:** Definir só os deltas (posicionamento) na regra de página; defaults numa regra única.

## Conteúdo adicional 103


**Classe:** .conteudo-adicional-103

**Tipo:** JS (IIFE)

**Função:** Lê ?utm_source=Cupom-NOME, salva {coupon, influencer, timestamp} em localStorage, remove utm_source da URL via history.replaceState, expira após N dias.

**Onde impacta:** Home + PDP (provavelmente todas as páginas) — sistema de cupom de influenciador.

**Status de uso:** Em uso.

**Duplicação:** Não.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Roda inline no parser, antes do GTM/GA — risco de o tracking nunca registrar utm_source original (fica vazio para o GA). replaceState sem evento custom.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Baixo (transparente) |
| Manutenção | Médio |
| Estabilidade | Médio |
| SEO | Médio (URL muda no replaceState — OK, mas atenção a links indexados) |
| Tracking | Alto (pode quebrar atribuição) |

**Gravidade:** Alta

**Recomendação:** Ajustar.

**Melhoria sugerida:** Antes de remover utm_source, disparar dataLayer.push({event:'cupom_influenciador', coupon, influencer}) para o GTM consumir; só então sanitizar a URL.

## Conteúdo adicional 105


**Classe:** .conteudo-adicional-105

**Tipo:** CSS

**Função:** Estiliza .btn-fita-metrica dentro do .swal2-popup.modal-medidas.

**Onde impacta:** PDP — modal SweetAlert2 da tabela de medidas.

**Status de uso:** Em uso (condicional).

**Duplicação:** Sim, com 30, 46, 61, 115.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** CSS para uma feature pulverizada em vários blocos.
### Impacto

| Área | Nível |
|---|---|
| Performance | Médio (2,9 KB) |
| UX | Baixo |
| Manutenção | Alto |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Média

**Recomendação:** Unificar com 30/46/61/115.

**Melhoria sugerida:** Mover para CSS de feature carregado on-demand quando o modal abrir.

## Conteúdo adicional 107


**Classe:** .conteudo-adicional-107

**Tipo:** JS (IIFE)

**Função:** Em /cliente/pedidos, injeta um aviso <div class="aviso-produto-pedido"> informando que não há taxa adicional para entrega. Usa setInterval(300) até o alvo aparecer.

**Onde impacta:** Página /cliente/pedidos apenas. Local.

**Status de uso:** Em uso.

**Duplicação:** Não.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Roda em todas as páginas (custo de carregar/parsear), mesmo sendo útil em uma só. Boa prática: o if (!path.includes('/cliente/pedidos')) return; está correto, mas o script ainda é baixado em todas as páginas.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo (early return) |
| UX | Médio (aviso útil) |
| Manutenção | Baixo |
| Estabilidade | Baixo |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Manter (modelo a seguir para condicionar por página).

**Melhoria sugerida:** Idealmente o conteúdo adicional deveria ter regra de página no admin Magazord (carregar só em /cliente/pedidos).

## Conteúdo adicional 109


**Classe:** .conteudo-adicional-109

**Tipo:** CSS

**Função:** Define width:30px; height:30px nas .sugestoes-cores .lista-cores li.

**Onde impacta:** PDP — sugestões de cor (variações).

**Status de uso:** Em uso.

**Duplicação:** Não.

**Sobrescreve outro conteúdo:** Sobrescreve o tema.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** !important. CSS em <!-- -->.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Baixo |
| Manutenção | Baixo |
| Estabilidade | Baixo |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Manter (consolidar com bloco "PDP – variações").

**Melhoria sugerida:** Remover <!-- --> e !important.

## Conteúdo adicional 112


**Classe:** .conteudo-adicional-112

**Tipo:** CSS

**Função:** Background branco e ajustes do mega-menu (ul#nav-root>li>.container-menu).

**Onde impacta:** Home + PDP — mega-menu.

**Status de uso:** Em uso.

**Duplicação:** Sim, com bloco 113.

**Sobrescreve outro conteúdo:** Sobrescreve estilos do tema; pode sobrescrever 60.

**Está sendo sobrescrito:** Pode ser sobrescrito por 113.

**Erros encontrados:** !important em background, margin-bottom, font-weight, opacity. Bloco vazio ul#nav-root>li>.container-menu ul {}.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Médio |
| Manutenção | Médio |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Média

**Recomendação:** Unificar com 113 (e idealmente com 60/70/81).

**Melhoria sugerida:** Bloco único "Mega-menu" com todas as regras agrupadas; remover regra vazia.

## Conteúdo adicional 113


**Classe:** .conteudo-adicional-113

**Tipo:** CSS

**Função:** Layout vertical (flex column, width: fit-content) dos containers de menu menu-list-216 e menu-list-114.

**Onde impacta:** Home + PDP — mega-menu.

**Status de uso:** Em uso.

**Duplicação:** Sim, com bloco 112.

**Sobrescreve outro conteúdo:** Sobrescreve o tema; complementar a 112.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** IDs hardcoded 216, 114 (frágil). !important em padding. Indentação inconsistente.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Médio |
| Manutenção | Médio |
| Estabilidade | Médio (IDs hardcoded) |
| SEO | Baixo |

**Gravidade:** Média

**Recomendação:** Unificar com 112.

**Melhoria sugerida:** Adicionar classe semântica nos itens (.menu-vertical) em vez de depender do número.

## Conteúdo adicional 115


**Classe:** .conteudo-adicional-115

**Tipo:** CSS

**Função:** Esconde #fut_try_on, #fut_smart_size, #abrir-tabela-medidas no estado inicial; estiliza .fut-botoes-container; define cores roxas, animação pulseRoxo, layout responsivo dos botões Smart Size / Try On (Futurise).

**Onde impacta:** PDP — área de compra (Smart Size + Try On + Tabela Medidas).

**Status de uso:** Em uso.

**Duplicação:** Sim, com 30, 46, 61, 105 (todas mexem em botões/tabela de medidas).

**Sobrescreve outro conteúdo:** Sobrescreve o bloco 61 (#abrir-tabela-medidas { display:none }).

**Está sendo sobrescrito:** Não.

**Erros encontrados:** animation: pulseRoxo 2s infinite consome GPU continuamente — impacta INP em devices fracos. box-shadow animado dentro do keyframe (custo de paint). Muitos !important.
### Impacto

| Área | Nível |
|---|---|
| Performance | Médio (animação infinita) |
| UX | Alto (botão "piscando" pode poluir; ✨ por outro lado chama atenção) |
| Manutenção | Alto |
| Estabilidade | Médio |
| SEO | Baixo |

**Gravidade:** Alta

**Recomendação:** Unificar com 30/46/61/105 e refatorar.

**Melhoria sugerida:** Trocar animation box-shadow por animação de transform ou opacity (GPU-friendly); pausar com prefers-reduced-motion; carregar CSS desta feature on-demand.

## Conteúdo adicional 128


**Classe:** .conteudo-adicional-128

**Tipo:** CSS

**Função:** Alinha à esquerda .header-product h1, .dados-nome-prod, .avaliacao-geral-topo; ajusta posição da paginação da galeria.

**Onde impacta:** PDP — header do produto.

**Status de uso:** Em uso.

**Duplicação:** Não.

**Sobrescreve outro conteúdo:** Sobrescreve o tema.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** !important em text-align, align-items, justify-content (poderia ser feito sem).
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Baixo |
| Manutenção | Baixo |
| Estabilidade | Baixo |
| SEO | Baixo |

**Gravidade:** Baixa

**Recomendação:** Manter (unificar com bloco "PDP – header produto").

**Melhoria sugerida:** Remover !important; aplicar diretamente no template.

## Conteúdo adicional 130


**Classe:** .conteudo-adicional-130

**Tipo:** CSS

**Função:** Esconde widgets globais com classes global-root-27CbN…, global-bottom_right-2n1BB…, global-mid_right-USeRX… (classes hashed típicas de chat/widget) e .fidegg-simulation.

**Onde impacta:** Home + PDP — widgets externos (chat e calculadora de frete antiga).

**Status de uso:** Sem uso aparente — as classes hashed sugerem widget descontinuado. Validar.

**Duplicação:** Função "esconder elemento" em comum com 26, 45, 60, 81.

**Sobrescreve outro conteúdo:** Não.

**Está sendo sobrescrito:** Não.

**Erros encontrados:** Seletores hashed extremamente frágeis — qualquer release do widget muda os hashes e a regra para de funcionar (e o widget volta a aparecer). !important.
### Impacto

| Área | Nível |
|---|---|
| Performance | Baixo |
| UX | Alto se o widget reaparecer (regra deixa de funcionar silenciosamente) |
| Manutenção | Crítico |
| Estabilidade | Crítico |
| SEO | Baixo |

**Gravidade:** Alta

**Recomendação:** Investigar e remover (idealmente desinstalar o widget na origem em vez de mascarar com CSS).

**Melhoria sugerida:** Se o widget ainda existe, removê-lo no painel; se não existe, remover o bloco.

# Resumo Executivo

Total de conteúdos adicionais encontrados: 33 únicos (21 na Home, 33 na PDP, 21 sobrepostos).

Em uso: 28

Parcialmente em uso: 3 (5, 10, 45)

Sem uso aparente: 2 (22, 130)

Não foi possível confirmar 100%: 64 (depende do RA estar carregado), 31 (depende de uso real do FA)

Conteúdos com duplicação de função: 14

Tabela de Medidas / Smart Size: 30, 31, 46, 61, 105, 115 (6 blocos para uma feature)

Header / Menu: 26, 45, 60, 70, 81, 112, 113 (7 blocos)

Tags promocionais: 94, 96

Vitrine 11: 5, 10

Preço PDP: 36, 62

Conteúdos com erros técnicos: 9

- 45 — CSS sintaticamente quebrado (} faltando)
- 35 — setInterval infinito + <a> aninhado em <li> com <a>
- 85 — setInterval 100 ms sem timeout
- 103 — Sanitiza URL antes do GTM ler utm_source
- 31 — Font Awesome inteiro do CDN sem SRI
- 62 — width: 480px !important quebra responsividade
- 68 — Remove min-height (CLS)
- 69 — Script externo sem async
- 115 — Animação box-shadow infinita

## Conteúdos que sobrescrevem outros

- 46 sobrescreve 30 (.btn-tabela)
- 115 sobrescreve 61 (#abrir-tabela-medidas)
- 113 complementa 112 (mega-menu)
- 62 sobrescreve 36 (preço)
- 96 espelha 94 (tags)

Os mais críticos (gravidade Crítica/Alta): 31, 45, 35, 30, 46, 62, 94, 96, 103, 115, 130

## Devem ser removidos primeiro (baixo risco, sem uso)

- 22 (.zoom sem alvo no DOM)
- 130 (widgets descontinuados — após confirmar)

## Devem ser refatorados primeiro (alto impacto técnico)

- 45 — fechar CSS quebrado urgente
- 31 — substituir Font Awesome CDN por SVG inline
- 35 — trocar setInterval por MutationObserver
- 103 — disparar evento para GTM antes de remover utm_source
- 115 — animação GPU-friendly + prefers-reduced-motion
- 62 — corrigir width: 480px !important

## Podem ser unificados

- **Feature "Tabela de Medidas + Smart Size":** 30 + 46 + 61 + 105 + 115
- **Feature "Header/Menu":** 26 + 45(parte) + 60 + 70 + 81 + 112 + 113
- **Feature "Tags Promocionais":** 94 + 96
- **Feature "Vitrine 11":** 5 + 10
- **Feature "Preço PDP":** 36 + 62
- **Feature "Vitrines 02/17 + recomender":** 37 + 68

Maior risco de performance: 31 (Font Awesome render-blocking), 35 (setInterval em vitrines), 115 (animação infinita), 85 (setInterval 100 ms).

Maior risco de manutenção: 94, 96 (regras repetidas 20× com IDs hardcoded), 130 (classes hashed frágeis), 30/46/61/105/115 (uma feature em 5 blocos), 45 (CSS quebrado).

## Ordem de correção recomendada

- **Hoje:** Corrigir 45 (CSS quebrado), remover 22 e 130 após validar.
- **Esta semana:** Refatorar 35 (Observer), 103 (evento GTM antes do replaceState), 31 (substituir FA por SVG).
- **Próximo sprint:** Consolidar features (Tabela de Medidas, Header/Menu, Tags, Vitrine 11, Preço PDP).
- **Backlog:** Padronizar — remover <!-- --> dentro de <style>, reduzir !important, mover regras estáveis para o CSS do tema, condicionar blocos por página no painel Magazord.
- message.txt
