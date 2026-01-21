<script type="text/javascript">
function economize() {
  const precoAntigoEl = $('.buy-area .preco-de span');
  const precoAtualEl = $('.buy-area .price.preco-principal .price-big');

  if (precoAntigoEl.length && precoAtualEl.length) {
    const precoAntigo = parsePrice(precoAntigoEl.text().trim());
    const precoAtual = parsePrice(precoAtualEl.text().trim());

    console.log('Preço antigo:', precoAntigo);
    console.log('Preço atual:', precoAtual);

    if (!isNaN(precoAntigo) && !isNaN(precoAtual) && precoAntigo > precoAtual) {
      const economia = (precoAntigo - precoAtual).toFixed(2).replace('.', ',');

      const economiaHtml = `
         <div class="economize" style="
                        color:#28A745;
                        display:flex;
                        flex-direction: column;
                        align-items:flex-start;
                        gap: px;
                        margin-top:10px;
                        background-color:#f0fdf4;
                        padding:10px 15px;
                        border-radius:10px;
                        font-weight: 500;
                        font-size: 0.95rem;
                    ">
          <span style="color:#16a34a; font-weight:bold; font-size: 1.05rem;">
            Promo Sale - Últimas unidades
          </span>
          <span>Você economiza <strong>R$ ${economia}</strong></span>
        </div>
      `;

      $('.economize').remove(); // evita duplicação
$('.buy-area .price.preco-principal').after(economiaHtml);
    }
  } else {
    console.log('Aguardando elementos...');
    setTimeout(economize, 300);
  }
}

function parsePrice(text) {
  if (!text) return NaN;
  return parseFloat(
    text
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/\s/g, '')
  );
}

// Executa quando o DOM estiver carregado
$(document).ready(function () {
  economize();
});
</script>
