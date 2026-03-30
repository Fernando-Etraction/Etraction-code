(function () {
  const LIMITE_FRETE = 499.90;
  let observer = null;
  let debounceTimer = null;

  function inserirEstiloListagem() {
    if (document.getElementById('tag-flutuante-style')) return;

    const style = document.createElement('style');
    style.id = 'tag-flutuante-style';
    style.textContent = `
      .listagem-item {
        position: relative;
      }

      .listagem-item .bandeiras-produto {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 20;
        display: flex;
        align-items: flex-start;
        gap: 6px;
        flex-wrap: wrap;
      }

      .listagem-item .bandeira-pre-venda {
        margin: 0 !important;
      }

      .tag-frete-gratis {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #000;
        color: #fff;
        padding: 3px 10px;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.2;
        border-radius: 5px;
        white-space: nowrap;
      }

      @media (max-width: 768px) {
        .listagem-item .bandeiras-produto {
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        .listagem-item .bandeira-pre-venda {
          border-radius: 5px !important;
          padding: 2px 5px !important;
        }

        .tag-frete-gratis {
          font-size: 10px !important;
          padding: 3px 8px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function obterNumero(texto) {
    if (!texto) return 0;

    return parseFloat(
      String(texto)
        .replace(/[^\d,.-]/g, '')
        .replace(/\.(?=\d{3}(\D|$))/g, '')
        .replace(',', '.')
    ) || 0;
  }

  function obterPrecoListagem(produto) {
    const precoEl = produto.querySelector('.preco-promocional');
    if (!precoEl) return 0;

    const dataSellPrice = precoEl.getAttribute('data-sell-price');
    if (dataSellPrice) return parseFloat(dataSellPrice) || 0;

    return obterNumero(precoEl.textContent);
  }

  function obterPrecoPaginaProduto() {
    const seletores = [
      '.produto .preco-promocional',
      '.produto .preco-produto .preco-promocional',
      '.produto .preco-venda',
      '.produto .preco-principal',
      '.produto [data-sell-price]'
    ];

    for (const seletor of seletores) {
      const el = document.querySelector(seletor);
      if (!el) continue;

      const dataSellPrice = el.getAttribute('data-sell-price');
      if (dataSellPrice) {
        const valor = parseFloat(dataSellPrice) || 0;
        if (valor > 0) return valor;
      }

      const valorTexto = obterNumero(el.textContent);
      if (valorTexto > 0) return valorTexto;
    }

    return 0;
  }

  function inserirTagNaListagem() {
    const produtos = document.querySelectorAll('.listagem-item');

    produtos.forEach((produto) => {
      const bandeiras = produto.querySelector('.bandeiras-produto');
      if (!bandeiras) return;

      const preco = obterPrecoListagem(produto);
      const tagExistente = bandeiras.querySelector('.tag-frete-gratis');

      if (preco > LIMITE_FRETE) {
        if (!tagExistente) {
          const tag = document.createElement('div');
          tag.className = 'tag-frete-gratis';
          tag.textContent = 'Frete Grátis';
          bandeiras.appendChild(tag);
        }
      } else if (tagExistente) {
        tagExistente.remove();
      }
    });
  }

  function aplicarStyleDiretoNaTagProduto(tag) {
    tag.style.position = 'absolute';
    tag.style.top = '0';
    tag.style.left = '0';
    tag.style.background = '#000';
    tag.style.padding = '4px 10px';
    tag.style.color = '#fff';
    tag.style.borderRadius = '5px';
    tag.style.zIndex = '999';
    tag.style.display = 'inline-block';
    tag.style.pointerEvents = 'none';
    tag.style.fontSize = '12px';
    tag.style.fontWeight = '600';
    tag.style.lineHeight = '1.2';
    tag.style.whiteSpace = 'nowrap';
  }

  function inserirTagNaPaginaProduto() {
    const containerImagem = document.querySelector('.produto .conteiner-imagem');
    if (!containerImagem) return;

    const wrapperInterno = containerImagem.querySelector('div');
    if (!wrapperInterno) return;

    wrapperInterno.style.position = 'relative';
    wrapperInterno.style.display = 'inline-block';

    const preco = obterPrecoPaginaProduto();
    let tagExistente = wrapperInterno.querySelector('.tag-frete-gratis-produto');

    if (preco > LIMITE_FRETE) {
      if (!tagExistente) {
        tagExistente = document.createElement('div');
        tagExistente.className = 'tag-frete-gratis-produto';
        tagExistente.textContent = 'Frete Grátis';
        wrapperInterno.appendChild(tagExistente);
      }

      aplicarStyleDiretoNaTagProduto(tagExistente);
    } else {
      if (tagExistente) {
        tagExistente.remove();
      }
    }
  }

  function aplicarTagsFreteGratis() {
    inserirEstiloListagem();
    inserirTagNaListagem();
    inserirTagNaPaginaProduto();
  }

  function iniciarObserver() {
    if (observer) observer.disconnect();

    const alvos = [
      document.querySelector('.listagem-linha'),
      document.querySelector('.listagem-produtos-carousel'),
      document.querySelector('.produto .conteiner-imagem'),
      document.querySelector('.produto')
    ].filter(Boolean);

    if (!alvos.length) return;

    observer = new MutationObserver(function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        aplicarTagsFreteGratis();
      }, 200);
    });

    alvos.forEach((alvo) => {
      observer.observe(alvo, {
        childList: true,
        subtree: true
      });
    });
  }

  function init() {
    aplicarTagsFreteGratis();
    setTimeout(aplicarTagsFreteGratis, 400);
    setTimeout(aplicarTagsFreteGratis, 1000);
    setTimeout(aplicarTagsFreteGratis, 1800);
    iniciarObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
