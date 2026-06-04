# Savancini Home V2 - Front separado por secao

Este pacote contem uma primeira versao de front para sobrescrever a home atual da Savancini sem alterar o core da plataforma.

## Arquivos

- `index.html`: markup das novas secoes da home.
- `css/home-v2.css`: estilos escopados e sobrescritas dos seletores atuais.
- `js/home-v2.js`: ajustes de DOM, correcao de links, clonagem de cards, movimentacao de stories e avaliacoes.

## Como implantar

1. Inserir o bloco `#sv-home-v2` como primeiro bloco dentro de `.container-landing-page`.
2. Publicar `home-v2.css` no carregamento da home.
3. Publicar `home-v2.js` no final da pagina ou com `defer`.
4. Substituir placeholders de links/colecoes se existirem URLs especificas para cada landing.
5. Validar no staging antes de publicar, principalmente stories, Swiper e newsletter.

## Seletores usados

- `.container-landing-page`
- `.container-landing-page > .container-row`
- `.ra-header.header-21.header-fixed`
- `.stories-video-planweb-carousel`
- `.product-list-react .swiper-slide`
- `.product-name`
- `.preco-produto-vitrine`
- `.tag-area`
- `.tag-produto`

## O que o JS faz

- Corrige `/acessorios` para `/acessorios-para-ciclismo`.
- Corrige `/combos` para `/combos-femininos` ou `/combos-ciclismo-masculino` conforme texto do link.
- Clona cards de produto ja renderizados na home e reaproveita preco, imagem, cashback, desconto e link reais.
- Move o carousel de stories para uma posicao mais comercial.
- Move o bloco de avaliacoes para depois das colecoes e do complete o look.
- Oculta os 13 primeiros `.container-row` originais, preservando strip de servico e footer.

## Observacoes

- O botao de card foi implementado como `Ver produto`, pois o mapeamento nao informa endpoint de add-to-cart da Magazord.
- Quando o endpoint de carrinho estiver validado, a funcao pode ser trocada para adicionar ao carrinho direto do card.
- O CSS esta todo escopado em `.sv-home-v2` para reduzir conflito com componentes existentes.
