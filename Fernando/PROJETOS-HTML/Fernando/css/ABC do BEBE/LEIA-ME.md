# ABC de Bebê — códigos da loja (Loja Integrada)

Site: https://www.abcdebebe.com.br/
Onde colar: painel da Loja Integrada → Configurações → Incluir código HTML.
Cada arquivo é um código separado no painel.

## Home

| Arquivo | O que faz | Posição no painel |
|---|---|---|
| `Home/FiltroDeCategorias.html` | Quadradinhos com as 7 categorias principais. Ao clicar, mostra os produtos da categoria embaixo, sem sair da home. Fica acima de "Mais vendidos"; as bolinhas entram dentro dele, logo abaixo dos quadradinhos. | Rodapé, Página inicial |
| `Home/CarrosselCategorias.html` | Bolinhas (círculos feitos em CSS) com as demais categorias; cada uma é link para a categoria. Fica logo abaixo dos quadradinhos, antes dos produtos do filtro. | Rodapé, Página inicial |
| `Home/CriaBannerHome.html` | Banner único na área de banners da vitrine "Mais vendidos". | Rodapé, Página inicial |
| `Home/VisualizadorFiltro.html` | Não vai para a loja. Abra no navegador para simular o filtro de quadradinhos (computador, tablet e celular). | — |

Ordem na home com os dois carrosséis: banner principal → quadradinhos → bolinhas → produtos do filtro → "Mais vendidos".

As imagens dos dois carrosséis estão no gerenciador de arquivos da loja
(`https://cdn.awsli.com.br/1357/1357875/arquivos/...`). Para trocar uma imagem ou link,
edite a lista `CATEGORIAS` no topo de cada arquivo.

## Página de Produto

| Arquivo | O que faz |
|---|---|
| `Página de Produto/AvisoAoFretar.js` | Aviso sobre frete na página do produto. |
| `Página de Produto/Cupom.js` | Destaque do cupom PRIMEIRACOMPRA (5% de desconto). |

## _antigos

Arquivos que não são mais usados, guardados só por segurança:

- `filtro-categorias.js` — primeira versão do filtro (abas em pílula).
- `Imagens filtro de categoria/` — imagens originais dos quadradinhos e as versões reduzidas em `web/`
  (as imagens usadas hoje estão no gerenciador de arquivos da loja).
