{/* <style>
  .faca-avaliacao {
    display: none;
  }
</style> */}


// <script>
//   $(document).ready(function() {
//     // Obtém número de avaliações
//     let numAvaliacoes = parseInt($('.num-avaliacoes a').text().replace(/\D/g, ''), 10) || 0;

//     if (numAvaliacoes === 0) {
//       $('.avaliacoes').remove();
//     } else {
//       let linkText = numAvaliacoes < 10
//         ? 'Ver Avaliações'
//         : 'Mais de ' + numAvaliacoes + ' avaliações!';

//       $('.num-avaliacoes').remove();

//       let botaoNovo = $('<button/>', {
//         text: linkText,
//         id: 'btn-avaliacoes',
//         style: 'font-size:12px; color:black; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;'
//       });

//       $('.faca-avaliacao').replaceWith(botaoNovo);

//       $(document).on('click', '#btn-avaliacoes', function(e) {
//         e.preventDefault();
//         $('html, body').animate({
//           scrollTop: $('#avaliacoes').offset().top
//         }, 800);
//       });
//     }
//   });
// </script>

<script type="text/javascript">
function economize() {
    try {
        const precoAntigoEl = $('.valor-de .line-through');
        const precoAtualEl = $('.preco-pix strong');
        if (precoAntigoEl.length && precoAtualEl.length) {
            let precoAntigoStr = precoAntigoEl.text().trim();
            let precoAtualStr = precoAtualEl.text().trim();
            const precoAntigo = parsePrice(precoAntigoStr);
            const precoAtual = parsePrice(precoAtualStr);
            console.log('Preço antigo:', precoAntigo);
            console.log('Preço atual:', precoAtual);
            if (!isNaN(precoAntigo) && !isNaN(precoAtual) && precoAntigo > precoAtual) {
                const economia = (precoAntigo - precoAtual)
                    .toFixed(2)
                    .replace('.', ',');
                const economiaHtml = `
                    <div class="economize" style="
                        color:#059669;
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
                       <span style="color:#16a34a; font-weight:bold; font-size: 1.05rem;">Liquida Inverno - Últimos dias</span>
                       
                       <span>Você economiza <strong>R$ ${economia}</strong></span>
                    </div>
                `;
                // Remove economia antiga, se existir
                $('.economize').remove();
                // Insere após o bloco de preço principal
                $('.preco-principal').after(economiaHtml);
            }
        } else {
            console.log('Elementos de preço não encontrados.');
        }
    } catch (e) {
        console.error('Erro na função economize:', e);
    }
}
// Função para converter texto de preço em número
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
setTimeout(function(){
    economize();
}, 500);
</script>
