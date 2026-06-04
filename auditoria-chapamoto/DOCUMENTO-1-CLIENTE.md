# Auditoria Técnica — Chapa Moto Parts
## Documento 1 — Versão Cliente

**Data:** Abril/2026  
**Site:** https://www.chapamotoparts.com.br/  
**Página de referência:** https://www.chapamotoparts.com.br/kit-chave-ignicao-tiger-800-xr-2015-2018-original

---

## Resumo Executivo

A loja Chapa Moto Parts apresenta **problemas técnicos significativos** nos conteúdos adicionais injetados na página, afetando diretamente **performance, SEO, conversão e manutenibilidade**. A homepage carrega **821 KB de HTML** (valor excessivo), com **34 scripts inline** e **17 blocos de estilo** embutidos. A página de produto carrega **37 scripts inline**, **22 blocos de estilo** e acumula **75 usos de !important** — indicadores de implementação desordenada.

Os principais achados são:

1. **Código duplicado entre páginas** — o mesmo bloco de benefícios (barra "Desconto 8% no PIX / 12x / Envio rápido / Produto usado") existe como **Bloco 40** na home e **Bloco 38** na página de produto, com código CSS+HTML+JS **idêntico** de ~11.000 caracteres replicado
2. **Scripts pesados rodando em todas as páginas** sem necessidade
3. **CSS conflitante** entre múltiplos blocos estilizando os mesmos elementos
4. **Ausência de H1** em todas as páginas analisadas — problema grave de SEO
5. **Swiper carregado duas vezes** na página de produto (versão nativa da plataforma + CDN externo)
6. **YouTube iframes carregados sem lazy loading**, impactando performance
7. **7 chamadas console.log** em produção — código de debug esquecido

---

## Principais Problemas Encontrados

### 1. Performance — Site mais lento do que deveria

| Problema | Impacto |
|----------|---------|
| Homepage com **821 KB** de HTML puro | Carregamento lento, LCP prejudicado |
| **805 KB de JavaScript inline** na home | Bloqueio de renderização, tempo de parse alto |
| Barra de benefícios duplicada (~11 KB cada) com SVG inline pesado | Download desnecessário em cada página |
| Swiper CSS+JS carregado **duas vezes** no produto | ~100 KB desperdiçados |
| 2 iframes do YouTube carregados imediatamente | Atraso de ~2-3s no carregamento |
| 22 blocos `<style>` inline no produto | Parser CSS repetido, CSSOM recriado |

**Impacto prático:** O site pode estar perdendo posições no Google por causa dos Core Web Vitals (LCP, CLS, INP) abaixo do ideal. Visitantes em conexão 3G/4G sofrem esperas significativas.

### 2. SEO — Oportunidades perdidas

| Problema | Impacto |
|----------|---------|
| **Nenhum H1** na home nem na página de produto | Google não identifica o assunto principal da página |
| Título do produto sem H1 semântico | Perda de relevância para pesquisa orgânica |
| Conteúdo injetado via JavaScript (selos, benefícios, classificações) | Googlebot pode não indexar esses conteúdos |
| Avaliações e estrelas sendo **ocultadas com CSS** (display:none) | Perda de rich snippets e prova social para SEO |
| Seção de FAQ inexistente | Oportunidade perdida de ranquear para perguntas comuns |
| Conteúdo "Mais de 700 clientes satisfeitos" injetado via JS | Pode não ser visto pelo Google |

**Impacto prático:** O site compete por termos como "peça usada de moto", "kit chave ignição Tiger 800" etc. Sem H1 e com conteúdo oculto do Google, perde relevância frente a concorrentes com melhor estrutura.

### 3. Conversão (CRO) — Atritos que reduzem vendas

| Problema | Impacto |
|----------|---------|
| Barra de benefícios **repetida 3x visualmente** (plataforma + bloco injetado) | Poluição visual, diluição da mensagem |
| Avaliações de produto **escondidas com CSS** | Elimina prova social que aumenta conversão |
| Cupom de frete com timer — urgência artificial | Pode gerar desconfiança se o timer reiniciar |
| Botão "Comprar" trocado via setInterval (até 10s de tentativas) | Risco de o usuário ver o botão mudar de texto, gerando estranheza |
| Campo de quantidade **escondido** (Bloco 28: `.quantidade { display: none !important }`) | Impede compra de múltiplas unidades |
| WhatsApp e telefone presentes, mas sem destaque na página de produto | Perda de leads |
| Vídeos do YouTube entre descrição e avaliações | Posição não ideal — deveriam estar mais visíveis |

**Impacto prático:** Cada atrito afasta o cliente da compra. Esconder avaliações e quantidade reduz confiança e ticket médio.

### 4. Problemas de Manutenção — Risco para o negócio

| Problema | Impacto |
|----------|---------|
| **15 blocos de conteúdo adicional** na página de produto | Qualquer alteração pode quebrar outra funcionalidade |
| 7 blocos compartilhados entre todas as páginas | CSS genérico pode afetar áreas inesperadas |
| Uso massivo de `!important` (75x) | Impossibilita sobrescrever estilos de forma limpa |
| Scripts dependem de `setTimeout(400ms)` para funcionar | Frágil — se a plataforma mudar o tempo de carga, quebra |
| Código comentado e `console.log` em produção | Indicador de desenvolvimento não-profissional |

---

## Riscos Principais

| Risco | Severidade |
|-------|-----------|
| Atualização da plataforma Magazord quebrar scripts que manipulam DOM | **Alta** |
| Google desvalorizar o site nos Core Web Vitals | **Alta** |
| Conflito entre blocos causando layout quebrado em mobile | **Média** |
| Timer do cupom ser identificado como prática enganosa | **Média** |
| Dificuldade de implementar novas funcionalidades sobre o código atual | **Alta** |

---

## O Que Deve Ser Priorizado

### Prioridade Alta (resolver primeiro)
1. **Adicionar H1** em todas as páginas — impacto imediato em SEO
2. **Eliminar duplicações** — usar um único bloco de benefícios para todas as páginas
3. **Remover carregamento duplo do Swiper** — economia imediata de ~100 KB
4. **Ativar lazy loading nos iframes do YouTube** — melhoria direta de LCP
5. **Remover `console.log` de produção** — profissionalismo e segurança

### Prioridade Média (resolver em seguida)
6. Consolidar CSS em um único bloco em vez de 22 `<style>` separados
7. Reativar avaliações de produto — prova social é essencial para conversão
8. Implementar FAQ estratégica na página de produto
9. Revisar timer do cupom de frete — usar data real de expiração

### Prioridade Baixa (refinamentos)
10. Melhorar hierarquia visual do CTA de compra
11. Adicionar schema markup (JSON-LD) para rich snippets
12. Otimizar SVGs inline — converter para sprites ou ícones referenciados
13. Melhorar responsividade mobile dos blocos injetados

---

## Ganhos Esperados com os Ajustes

| Área | Ganho Estimado |
|------|---------------|
| **Performance** | Redução de ~200-300 KB no carregamento, melhoria de 1-2s no LCP |
| **SEO** | Melhoria na indexação e potencial de subir 5-15 posições em buscas de cauda longa |
| **Conversão** | Aumento potencial de 5-15% na taxa de conversão com prova social e melhor CTA |
| **Manutenção** | Redução de 60-70% da complexidade dos conteúdos adicionais |
| **Estabilidade** | Eliminação de riscos de quebra por atualização da plataforma |

---

## Nota Final da Página

| Critério | Nota (0-10) | Status |
|----------|------------|--------|
| SEO | **4/10** | Sem H1, conteúdo via JS, avaliações ocultas |
| CRO | **5/10** | Elementos de conversão presentes mas conflitantes |
| Performance | **3/10** | HTML de 821 KB, CSS/JS duplicados, Swiper 2x |
| Organização do código | **3/10** | 15 blocos independentes sem coordenação |
| Manutenibilidade | **2/10** | 75 !important, setTimeout frágil, sem documentação |
| Experiência mobile | **5/10** | Funcional mas com poluição visual |
| Potencial de conversão | **7/10** | Produto bom, marca forte, falta otimização técnica |

---

*Este documento foi gerado com base na análise do código-fonte das páginas em Abril/2026.*
