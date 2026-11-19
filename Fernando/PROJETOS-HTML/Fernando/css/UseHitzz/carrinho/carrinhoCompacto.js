/* HITZZ — CARRINHO COMPACTO NO CELULAR (proposta A)
   Onde: página /cart/. Só age em telas de até 767px; no computador nada muda.

   Regra principal: não recria nem tira do lugar nada que tenha função na loja.
   Quantidade, lixeira, cupom, CEP, opções de frete e "Finalizar" continuam sendo os
   elementos originais. A nova ordem dos blocos é só visual (CSS "order" com
   "display: contents"), então nenhum formulário muda de lugar no HTML.

   Ordem no celular:
     faixa de frete grátis · bloco da ação (código 5) · produtos · "Tem cupom?" ·
     frete (CEP) · subtotal, opções de frete e total · avaliações · barra fixa

   Classes começam com "hzcc-". */
(function () {
  if (window.__hzCartCompacto) return;
  window.__hzCartCompacto = true;
  if (!document.getElementById('page-cart')) return;

  var MQ = window.matchMedia('(max-width: 767px)');

  // Esconde no celular o aviso longo dos Correios em PAC/SEDEX ("CEP único... Portaria 2.729/2021").
  // Deixe false se a loja precisar manter esse texto visível.
  var ESCONDER_AVISO_CORREIOS = true;

  var C = '#cartContainer';
  var T = '#cartTableWidget';

  var CSS =
    '@media (max-width:767px){' +

    /* ---------- topo: logo + "‹ Comprar mais" + quantidade de itens ---------- */
    'body.hzcc-on{position:relative;font-family:Roboto,Arial,sans-serif}' +
    'body.hzcc-on #simplified-step-header{border-bottom:1px solid #ececec !important;min-height:0 !important}' +
    'body.hzcc-on #simplified-step-header .brand-container{height:52px !important;display:flex !important;align-items:center;justify-content:center}' +
    'body.hzcc-on #simplified-step-header .brand-container img,body.hzcc-on #simplified-step-header .brand-container svg{max-height:30px !important;width:auto !important}' +
    'body.hzcc-on .main-container > .row:first-of-type{margin:0 !important;height:0;overflow:visible}' +
    'body.hzcc-on .main-container > .row:first-of-type .section-title-inner{display:none !important}' +
    'body.hzcc-on .main-container > .row:first-of-type .rightSidebar{position:absolute;top:17px;left:14px;width:auto !important;padding:0 !important;z-index:5}' +
    'body.hzcc-on .main-container > .row:first-of-type .rightSidebar h4{margin:0 !important;font-size:12px !important;text-transform:none !important;font-weight:400}' +
    'body.hzcc-on .main-container > .row:first-of-type .rightSidebar a{color:#555 !important;text-decoration:none !important}' +
    'body.hzcc-on .main-container > .row:first-of-type .rightSidebar i{font-size:10px !important;margin-right:2px}' +
    'body.hzcc-on .main-container > .row:first-of-type > div{float:none !important}' +
    'body.hzcc-on .main-container > .row:first-of-type > div:first-child{display:none !important}' +
    '.hzcc-n{position:absolute;top:18px;right:14px;font-size:12px;color:#555;z-index:5}' +

    /* ---------- nova ordem (só visual) ---------- */
    C + '{display:flex !important;flex-direction:column;width:100% !important;clear:both;padding-top:4px}' +
    C + ' > form > br{display:none !important}' +
    C + ' > form,#cartBody,#cartBody > div,#cartBody .userInfo,#cartBody .userInfo > div{display:contents !important}' +
    C + ' > *{order:20}' +
    '#shipping-notification-progress{order:1 !important}' +
    '#generic-progress-bar{order:2 !important}' +
    '#hzbf-cart{order:3 !important;margin:10px 0 0 !important}' +
    '.cartContent{order:4 !important}' +
    '.rowCartPromotionCodes{order:5 !important}' +
    '.rowCartPostalCode{order:6 !important}' +
    '.cartResume{display:none !important}' +
    '.cartSubtotal{order:7 !important}' +
    '#cartBody .userInfo > div > div:last-child{order:8 !important}' +
    '#crev-strip{display:none !important}' +

    /* ---------- faixa de frete grátis: texto pequeno + barra fina ---------- */
    '#shipping-notification-progress .free-shipping-notification{margin:0 !important}' +
    '#shipping-notification-progress .progress{position:relative;box-sizing:border-box;padding-top:40px !important;height:44px !important;margin:6px 0 4px !important;background:transparent !important;box-shadow:none !important;overflow:visible !important}' +
    '#shipping-notification-progress .progress:before{content:"";position:absolute;left:0;right:0;bottom:0;height:4px;border-radius:2px;background:#eee;z-index:-1}' +
    '#shipping-notification-progress .progress-bar{position:static !important;float:none !important;margin:0 !important;display:block !important;height:4px !important;border-radius:2px;background:#000 !important;box-shadow:none !important;overflow:visible !important}' +
    '#shipping-notification-progress .progress-bar-label{position:absolute !important;left:0;right:0;bottom:10px;top:auto !important;width:auto !important;height:auto !important;line-height:1.35 !important;color:#1a1a1a !important;font-size:12px !important;text-align:left !important;white-space:normal !important}' +
    '#shipping-notification-progress .progress-bar-label *{position:static !important;display:inline !important;width:auto !important;animation:none !important;transform:none !important;color:#1a1a1a !important;font-size:12px !important;white-space:normal !important}' +

    /* ---------- produtos: 2 linhas por item ---------- */
    T + ' thead{display:none !important}' +
    T + ',.cartContent .table-responsive,' + T + '.table-responsive{border:0 !important;margin:4px 0 0 !important}' +
    '.cartContent{width:100% !important}' +
    '.cartContent .table-responsive,' + T + '{display:block !important;width:100% !important;overflow:visible !important}' +
    T + ' tbody:last-of-type{display:block !important;width:100% !important}' +
    T + ' tbody:last-of-type tr.first-row{display:flex !important;width:100%;position:relative;padding-left:76px;min-height:46px}' +
    T + ' tbody:last-of-type tr.first-row td{display:block !important}' +
    T + ' tr.first-row td.ColumnCartDescription{flex:1;min-width:0}' +
    T + ' tr.first-row td.CartProductThumb,' + T + ' tr.first-row td.remove{flex:none}' +
    T + ' tr.space{display:none !important}' +
    T + ' tr.hzcc-esconde{display:none !important}' +
    T + ' tr.first-row{border:0 !important}' +
    T + ' tr.space td{height:0 !important;padding:0 !important;border:0 !important}' +
    T + ' tr.first-row td{border:0 !important;padding:12px 0 0 !important;vertical-align:top}' +
    T + ' tr.first-row td.CartProductThumb{position:absolute !important;left:0;top:0;width:64px;padding:12px 0 0 !important}' +
    T + ' tr.first-row td.CartProductThumb *{margin:0 !important}' +
    T + ' tr.first-row td.CartProductThumb img{width:64px !important;height:80px !important;object-fit:cover;border-radius:3px;background:#f5f5f5}' +
    T + ' tr.first-row .CartDescription h4{margin:0 !important;padding:0 !important;font-size:12px !important;line-height:1.4 !important;font-weight:500}' +
    T + ' tr.first-row .CartDescription h4 a{font-size:12px !important;font-weight:500 !important;color:#1a1a1a !important;letter-spacing:.2px}' +
    T + ' tr.first-row .CartDescription ul{margin:4px 0 0 !important;font-size:12px;color:#777}' +
    T + ' tr.first-row .CartDescriptionPrice{display:none !important}' +
    T + ' tr.first-row td.remove{width:30px;padding-top:10px !important;text-align:right}' +
    T + ' tr.first-row td.remove i{font-size:16px !important;color:#999}' +
    /* linha 2: quantidade à esquerda, preço à direita */
    T + ' tr.CartQuantityMobileRow{display:flex !important;flex-direction:row-reverse;justify-content:space-between;align-items:center;margin-top:0;position:relative;background:transparent !important;padding:8px 0 14px 76px;border:0 !important;border-bottom:1px solid #f0f0f0 !important}' +
    T + ' tr.CartQuantityMobileRow td{display:block !important;border:0 !important;padding:0 !important}' +
    T + ' tr.CartQuantityMobileRow td.CartQuantityLabel{font-size:0 !important;line-height:0 !important;color:transparent}' +
    T + ' td.CartQuantity{text-align:left !important}' +
    T + ' td.CartQuantity .form-group{margin:0 !important}' +
    T + ' td.CartQuantity .bootstrap-touchspin{display:inline-flex !important;width:auto !important;border:1px solid #ddd;border-radius:3px;height:30px;align-items:center}' +
    T + ' td.CartQuantity .bootstrap-touchspin .btn{height:28px !important;width:28px;padding:0 !important;color:#1a1a1a !important;font-size:15px}' +
    T + ' td.CartQuantity input{width:26px !important;height:28px !important;border:0 !important;box-shadow:none !important;text-align:center;padding:0 !important;font-size:12px}' +
    '.hzcc-preco{font-size:12px;line-height:1.25;text-align:right;color:#1a1a1a}' +
    '.hzcc-preco s{color:#999;font-size:11px;margin-right:5px}' +
    '.hzcc-preco b{font-size:13.5px}' +
    '.hzcc-preco span{display:block;color:#2e8b57}' +

    /* ---------- cupom: abre como gaveta pela barra fixa ---------- */
    '.rowCartPromotionCodes{display:none !important}' +
    'body.hzcc-sheet .rowCartPromotionCodes{display:block !important;position:fixed !important;left:0;right:0;bottom:0;z-index:9996;margin:0 !important;padding:14px 14px calc(18px + env(safe-area-inset-bottom)) !important;background:#fff;border-radius:12px 12px 0 0;box-shadow:0 -4px 20px rgba(0,0,0,.12);font-family:Roboto,Arial,sans-serif}' +
    '.rowCartPromotionCodes > div{width:100% !important;float:none !important;padding:0 !important}' +
    '.rowCartPromotionCodes > div.col-lg-3{display:none !important}' +
    '.hzcc-ov{display:none;position:fixed;inset:0;z-index:9995;background:rgba(0,0,0,.4)}' +
    'body.hzcc-sheet .hzcc-ov{display:block}' +
    '.hzcc-sheet-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-size:14px;font-weight:700;color:#1a1a1a}' +
    '.hzcc-sheet-x{width:30px;height:30px;margin:-6px -6px -6px 0;padding:0;border:0;background:none;font-size:22px;line-height:1;color:#777;cursor:pointer}' +
    '.rowCartPromotionCodes #cart-coupons{padding:0 !important;margin:0 !important;border:0 !important;background:none !important}' +
    '.rowCartPromotionCodes #cart-coupons-collection{padding:0 !important;border:0 !important;display:flex !important;align-items:center;gap:6px}' +
    '.rowCartPromotionCodes #cart-coupons-collection > span:empty{display:none !important}' +
    '.rowCartPromotionCodes .promotionCodeMessage{display:none !important}' +
    '.rowCartPromotionCodes .form-group{flex:1;margin:0 !important}' +
    '.rowCartPromotionCodes input{width:100% !important;height:42px !important;border:1px solid #ccc !important;border-radius:4px !important;font-size:16px;text-transform:uppercase}' +
    '.rowCartPromotionCodes #apply-coupon{flex:none;height:42px !important;padding:0 18px !important;background:#000 !important;color:#fff !important;border:0 !important;border-radius:4px !important;font-weight:700;font-size:12px;text-transform:uppercase}' +

    /* ---------- frete (CEP) em uma linha ---------- */
    '.rowCartPostalCode{margin:0 !important}' +
    '.rowCartPostalCode > div{width:100% !important;float:none !important;padding:0 !important;border:0 !important;background:none !important}' +
    '.rowCartPostalCode > div:empty{display:none !important}' +
    '#formPostalCode{display:flex !important;align-items:center;gap:8px;margin:0 !important;padding:10px 0 !important;border:0 !important;border-bottom:1px solid #f0f0f0 !important;background:none !important}' +
    '#formPostalCode .postalCodeMessage{flex:none;width:46px;margin:0 !important;font-size:0 !important}' +
    '#formPostalCode .postalCodeMessage:before{content:"Frete";font-size:13px;color:#1a1a1a}' +
    '#formPostalCode input{flex:1;width:auto !important;height:38px !important;border:1px solid #ccc !important;border-radius:3px !important;font-size:13px}' +
    '#formPostalCode > span:empty{display:none}' +
    '#formPostalCode button{height:38px !important;padding:0 14px !important;background:#fff !important;color:#000 !important;border:1px solid #000 !important;border-radius:3px !important;font-weight:700;font-size:12px;text-transform:uppercase}' +

    /* ---------- resumo ---------- */
    '.cartSubtotal,.cartSubtotal .box-footer,#cartShipping,#cartShipping .box-footer,.cartGrandTotal,.cartGrandTotal .box-footer{background:none !important;border:0 !important;box-shadow:none !important}' +
    '.cartSubtotal .box-footer{padding:12px 0 4px !important;font-size:13px !important}' +
    '.cartSubtotal .pull-right{float:none !important}' +
    '.cartSubtotal .box-footer,.cartSubtotal .pull-right,#cartShipping .box-footer,.cartGrandTotal .box-footer,.cartGrandTotal .pull-right{padding-left:0 !important;padding-right:0 !important}' +
    '#cartShipping .box-footer{padding:4px 0 !important;font-size:12.5px !important}' +
    '.cartGrandTotal .box-footer{padding:8px 0 !important;border-top:1px solid #f0f0f0 !important;font-size:13px !important}' +
    '.cartGrandTotal .pull-right{float:none !important}' +

    /* ---------- resumo: entrega + valores ---------- */
    '#cartShipping .box-footer{display:block !important}' +
    '#cartShippingMethodsChoice,.hzcc-tit{float:none !important;width:100% !important;padding-left:0 !important;padding-right:0 !important}' +
    '#cartShippingMethodsChoice > div{margin:0 !important;padding:10px 0 !important;border-bottom:1px solid #f2f2f2}' +
    '#cartShippingMethodsChoice label.shipment-enabled{display:flex !important;align-items:center;width:100%;margin:0 !important;padding:0 !important;font-size:0 !important;cursor:pointer}' +
    '#cartShippingMethodsChoice .iChk{flex:none;margin:0 !important}' +
    '#cartShippingMethodsChoice .shipping-price{margin-left:auto;font-size:13px !important;font-weight:500;color:#1a1a1a;white-space:nowrap}' +
    '#cartShippingMethodsChoice .free-shipping-label{margin-left:auto;font-size:13px !important;font-weight:700;color:#2e8b57 !important;white-space:nowrap}' +
    '.hzcc-qtd{display:inline-flex;align-items:center;height:30px;border:1px solid #ddd;border-radius:3px}' +
    '.hzcc-qtd button{width:28px;height:28px;padding:0;border:0;background:none;font-size:15px;color:#1a1a1a;cursor:pointer}' +
    '.hzcc-qtd input{width:26px !important;height:28px !important;border:0 !important;box-shadow:none !important;text-align:center;padding:0 !important;font-size:12px}' +
    '#cartShippingMethodsChoice small.shipping-information{font-size:11px}' +
    '.hzcc-op{flex:1;min-width:0;margin-left:10px;font-size:13px;line-height:1.25;color:#1a1a1a}' +
    '.hzcc-op small{display:block;font-size:11.5px;color:#888}' +
    '.hzcc-tit{font-size:13px;font-weight:700;color:#1a1a1a;padding:14px 0 0}' +
    '#cartShipping .cart-shipping-total,.cartSubtotal{display:none !important}' +
    '.hzcc-resumo{margin-top:0;padding:10px 0 2px;border-top:1px solid #eee}' +
    '#cartShippingMethodsChoice > div:last-child{border-bottom:0}' +
    '#cartShipping .box-footer{padding-bottom:0 !important}' +
    '.hzcc-row{display:flex;justify-content:space-between;gap:10px;padding:3px 0;font-size:13px;color:#555}' +
    '.hzcc-row b{font-weight:500;color:#1a1a1a}' +
    '.hzcc-row b.hzcc-gratis{color:#2e8b57}' +
    '.cartGrandTotal .box-footer{border-top:0 !important;padding:2px 0 8px !important}' +
    '.cartGrandTotal .cart-total{display:block !important;float:none !important;width:100% !important;text-align:left !important}' +
    '.cartGrandTotal .cart-total > strong{display:flex !important;justify-content:space-between;padding:4px 0 2px;font-size:15px;color:#1a1a1a}' +
    '.cartGrandTotal .cart-total > br{display:none !important}' +
    '.cartGrandTotal .cart-total-other-information{display:flex !important;flex-direction:column;gap:2px}' +
    '.cartGrandTotal .cart-cash-payment{order:-1;display:flex !important;justify-content:space-between;font-size:13px;color:#2e8b57}' +
    '.cartGrandTotal .cart-cash-payment:before{content:"No Pix"}' +
    '.cartGrandTotal .cash-or,.cartGrandTotal .cash-text{display:none !important}' +
    '.cartGrandTotal .cash-price{color:#2e8b57 !important;font-weight:700}' +
    '.cartGrandTotal .cart-installment-text{text-align:right;font-size:12px;color:#777}' +
    '.cartGrandTotal .cart-cashback{margin-top:6px;font-size:12px;color:#777}' +

    /* ---------- botões de finalizar duplicados (a barra fixa substitui) ---------- */
    '.rowCartPostalCode .btn-proceed_checkout,.rowCartPromotionCodes .btn-proceed_checkout,#etr-mobile-checkout-floating{display:none !important}' +

    /* ---------- barra fixa: linha do cupom + total e botão ---------- */
    '.hzcc-barra{position:fixed;left:0;right:0;bottom:0;z-index:9990;background:#fff;border-top:1px solid #e5e5e5;box-shadow:0 -2px 10px rgba(0,0,0,.06);font-family:Roboto,Arial,sans-serif}' +
    '.hzcc-barra__cupom{display:flex;align-items:center;gap:8px;width:100%;height:40px;margin:0;padding:0 14px;border:0;border-bottom:1px solid #eee;background:none;font:inherit;font-size:13px;font-weight:500;color:#1a1a1a;text-align:left;cursor:pointer}' +
    '.hzcc-barra__cupom svg{flex:none}' +
    '.hzcc-barra__cupom span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.hzcc-barra__cupom i{font-style:normal;font-size:18px;color:#999}' +
    '.hzcc-barra__cupom.hzcc-ok{color:#2e8b57}' +
    '.hzcc-barra__main{display:flex;align-items:center;gap:12px;padding:8px 14px calc(10px + env(safe-area-inset-bottom))}' +
    '.hzcc-barra__tot{flex:1;min-width:0;line-height:1.25;color:#1a1a1a}' +
    '.hzcc-barra__tot small{display:block;font-size:11px;color:#777}' +
    '.hzcc-barra__tot b{display:block;font-size:17px}' +
    '.hzcc-barra a{display:flex;align-items:center;justify-content:center;height:46px;padding:0 20px;background:#5cb82e;color:#fff !important;border-radius:5px;font-weight:700;font-size:14px;text-decoration:none !important;white-space:nowrap}' +
    'body.hzcc-on{padding-bottom:124px !important}' +

    (ESCONDER_AVISO_CORREIOS ? '#cartShipping small.shipping-information{display:none !important}' : '') +
    '}';

  function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }

  // Preço de cada item vai para a linha da quantidade (à direita).
  // O controle de quantidade da loja não é tocado.
  function compactarItens() {
    var linhas = document.querySelectorAll(T + ' tr.first-row');
    for (var i = 0; i < linhas.length; i++) {
      var unit = null, total = null, pix = null, qtdRow = null;
      var tr = linhas[i].nextElementSibling;
      while (tr && !tr.classList.contains('first-row') && !tr.classList.contains('space')) {
        if (tr.querySelector('td.unitPriceMobileRow')) { unit = tr.querySelector('td.unitPrice'); tr.classList.add('hzcc-esconde'); }
        else if (tr.querySelector('td.totalPriceMobileRow')) { total = tr.querySelector('td.totalPrice'); tr.classList.add('hzcc-esconde'); }
        else if (tr.classList.contains('totalCashPriceMobileRow')) { pix = tr.querySelector('td.cashTotalPrice'); tr.classList.add('hzcc-esconde'); }
        else if (tr.classList.contains('CartQuantityMobileRow')) { qtdRow = tr; }
        tr = tr.nextElementSibling;
      }
      var alvo = qtdRow && qtdRow.querySelector('td.CartQuantityLabel');
      if (!alvo) continue;

      // valores da linha (já multiplicados pela quantidade); o "de" riscado só com 1 unidade
      var campoQtd = qtdRow.querySelector('input');
      var qtd = campoQtd ? parseInt(campoQtd.value, 10) || 1 : 1;
      var de = qtd === 1 && unit && unit.querySelector('.old-price');
      var por = total || (unit && (unit.querySelector('.best-price') || unit));
      var html = (de && txt(de) ? '<s>' + txt(de) + '</s>' : '') + '<b>' + txt(por) + '</b>' +
                 (pix && txt(pix) ? '<span>' + txt(pix) + ' no Pix</span>' : '');

      var preco = alvo.querySelector('.hzcc-preco');
      if (!preco) { preco = document.createElement('div'); preco.className = 'hzcc-preco'; alvo.appendChild(preco); }
      if (preco.innerHTML !== html) preco.innerHTML = html;
    }
  }

  // Depois de "Aplicar", a loja recarrega a página e mostra um aviso (cupom aplicado ou
  // não encontrado). Com aviso de cupom na tela, o campo já abre para a cliente corrigir.
  function avisoDeCupom() {
    var avisos = document.querySelectorAll('.uoou-popup-alert, .alert');
    for (var i = 0; i < avisos.length; i++) {
      if (avisos[i].offsetHeight > 0 && /cupom/i.test(avisos[i].textContent)) return true;
    }
    return false;
  }

  function abrirCupom() {
    if (!document.querySelector('.rowCartPromotionCodes')) return;
    document.body.classList.add('hzcc-sheet');
    var i = document.querySelector('.rowCartPromotionCodes input');
    if (i) setTimeout(function () { i.focus(); }, 50);
  }

  function fecharCupom() { document.body.classList.remove('hzcc-sheet'); }

  // depois de um cupom inválido a página recarrega com o aviso da loja: reabre a gaveta
  function abrirCupomSeAviso() {
    if (avisoDeCupom() && !document.body.classList.contains('hzcc-sheet')) abrirCupom();
  }

  // O campo de cupom da loja (dentro do formulário) vira uma gaveta presa ao rodapé.
  // Nada é movido de lugar: só muda a posição na tela.
  function cupom() {
    var row = document.querySelector('.rowCartPromotionCodes');
    if (!row) return;
    if (!row.querySelector('.hzcc-sheet-top')) {
      var top = document.createElement('div');
      top.className = 'hzcc-sheet-top';
      top.innerHTML = '<span>Cupom de desconto</span><button type="button" class="hzcc-sheet-x" aria-label="Fechar">×</button>';
      top.querySelector('button').addEventListener('click', fecharCupom);
      row.insertBefore(top, row.firstChild);
    }
    if (!document.querySelector('.hzcc-ov')) {
      var ov = document.createElement('div');
      ov.className = 'hzcc-ov';
      ov.addEventListener('click', fecharCupom);
      document.body.appendChild(ov);
    }
  }

  // Resumo: cada opção de frete vira "nome + prazo" à esquerda e preço à direita, e o
  // subtotal/frete viram linhas "rótulo ... valor". Só texto de exibição: os botões de
  // frete (radio) e os valores continuam sendo os da loja.
  function resumo() {
    var labels = document.querySelectorAll('#cartShippingMethodsChoice label.shipment-enabled');
    for (var i = 0; i < labels.length; i++) {
      var lb = labels[i];
      var bruto = '';
      for (var n = lb.firstChild; n; n = n.nextSibling) {
        if (n.nodeType === 3) bruto += n.textContent;
        if (n.nodeType === 1 && (n.classList.contains('shipping-price') || n.classList.contains('free-shipping-label'))) break;
      }
      var partes = bruto.replace(/\s+/g, ' ').replace(/[-|]\s*$/, '').split('|');
      var nome = (partes[0] || '').trim();
      var prazo = (partes[1] || '').replace(/-\s*$/, '').trim();
      var html = nome + (prazo ? '<small>' + prazo.charAt(0).toLowerCase() + prazo.slice(1) + '</small>' : '');
      var op = lb.querySelector('.hzcc-op');
      if (!op) {
        op = document.createElement('span');
        op.className = 'hzcc-op';
        var chk = lb.querySelector('.iChk');
        lb.insertBefore(op, chk ? chk.nextSibling : lb.firstChild);
      }
      if (op.innerHTML !== html) op.innerHTML = html;
    }

    var lista = document.getElementById('cartShippingMethodsChoice');
    if (lista && !(lista.previousElementSibling && lista.previousElementSibling.classList.contains('hzcc-tit'))) {
      var tit = document.createElement('div');
      tit.className = 'hzcc-tit';
      tit.textContent = 'Entrega';
      lista.parentNode.insertBefore(tit, lista);
    }

    var total = document.querySelector('.cartGrandTotal');
    if (!total) return;
    var sub = txt(document.querySelector('.cartSubtotal')).match(/Subtotal\s*\(([^)]+)\):?\s*(R\$\s*[\d.]+,\d{2})/);
    var fr = txt(document.querySelector('#cartShipping .cart-shipping-total'));
    var freteTxt = fr.replace(/^Frete:?\s*/i, '');
    var gratis = /gr[aá]tis/i.test(freteTxt);
    if (!freteTxt || /n[aã]o calculado/i.test(freteTxt)) freteTxt = 'Calcule acima';

    var linhas = (sub ? '<div class="hzcc-row"><span>Subtotal (' + sub[1] + ')</span><b>' + sub[2] + '</b></div>' : '') +
                 '<div class="hzcc-row"><span>Frete</span><b' + (gratis ? ' class="hzcc-gratis"' : '') + '>' + (gratis ? 'Grátis' : freteTxt) + '</b></div>';

    var box = document.querySelector('.hzcc-resumo');
    if (!box) {
      box = document.createElement('div');
      box.className = 'hzcc-resumo';
    }
    if (box.nextElementSibling !== total) total.parentNode.insertBefore(box, total);
    if (box.innerHTML !== linhas) box.innerHTML = linhas;
  }

  function contagem() {
    var sub = document.querySelector('.cartSubtotal');
    var m = sub && sub.textContent.match(/\((\d+)\s*ite/);
    var topo = document.querySelector('#simplified-step-header .container') || document.getElementById('simplified-step-header');
    if (!m || !topo) return;
    var el = document.querySelector('.hzcc-n');
    if (!el) {
      el = document.createElement('span');
      el.className = 'hzcc-n';
      if (getComputedStyle(topo).position === 'static') topo.style.position = 'relative';
      topo.appendChild(el);
    }
    var t = m[1] + (m[1] === '1' ? ' item' : ' itens');
    if (el.textContent !== t) el.textContent = t;
  }

  var ICONE_CUPOM = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/></svg>';

  function barra() {
    var link = document.querySelector('a.btn-proceed_checkout');
    var total = document.querySelector('.cartGrandTotal');
    if (!link || !total) return;
    var t = total.textContent.replace(/\s+/g, ' ');
    var mTot = t.match(/Total:\s*(R\$\s*[\d.]+,\d{2})/);
    var mPix = t.match(/(R\$\s*[\d.]+,\d{2})\s*via Pix/);
    var parc = txt(total.querySelector('.cart-installment-text'));

    var tot = mPix
      ? '<small>no Pix</small><b>' + mPix[1] + '</b>' + (parc ? '<small>ou ' + parc + '</small>' : (mTot ? '<small>ou ' + mTot[1] + '</small>' : ''))
      : '<small>Total</small><b>' + (mTot ? mTot[1] : '') + '</b>' + (parc ? '<small>' + parc + '</small>' : '');

    var campo = document.querySelector('.rowCartPromotionCodes input');
    var cod = campo && campo.value ? campo.value.trim() : '';
    var cupomTxt = cod ? 'Cupom: ' + cod.toUpperCase() : 'Inserir código do cupom';

    var el = document.querySelector('.hzcc-barra');
    if (!el) {
      el = document.createElement('div');
      el.className = 'hzcc-barra';
      el.innerHTML = '<button type="button" class="hzcc-barra__cupom">' + ICONE_CUPOM + '<span></span><i>›</i></button>' +
                     '<div class="hzcc-barra__main"><div class="hzcc-barra__tot"></div><a href="#">Pagar e finalizar</a></div>';
      el.querySelector('.hzcc-barra__cupom').addEventListener('click', abrirCupom);
      // usa o botão original da loja
      el.querySelector('a').addEventListener('click', function (e) {
        e.preventDefault();
        var original = document.querySelector('a.btn-proceed_checkout');
        if (original) original.click();
      });
      document.body.appendChild(el);
    }
    var bt = el.querySelector('.hzcc-barra__cupom');
    bt.classList.toggle('hzcc-ok', !!cod);
    var sp = bt.querySelector('span');
    if (sp.textContent !== cupomTxt) sp.textContent = cupomTxt;
    var boxTot = el.querySelector('.hzcc-barra__tot');
    if (boxTot.innerHTML !== tot) boxTot.innerHTML = tot;
    el.querySelector('a').setAttribute('href', link.getAttribute('href') || '#');
  }

  // No celular a loja às vezes não monta o −/+ (touchspin) na quantidade e o campo fica solto.
  // Nesse caso criamos os botões: mudam a quantidade no campo real do formulário e salvam o carrinho.
  function quantidadeReserva() {
    var campos = document.querySelectorAll(T + ' tbody:last-of-type td.CartQuantity input.CartItemQuantityField');
    for (var i = 0; i < campos.length; i++) {
      var campo = campos[i];
      if (campo.closest('.bootstrap-touchspin') || campo.closest('.hzcc-qtd')) continue;
      var caixa = document.createElement('span');
      caixa.className = 'hzcc-qtd';
      campo.parentNode.insertBefore(caixa, campo);
      caixa.innerHTML = '<button type="button" data-d="-1">−</button>';
      caixa.appendChild(campo);
      caixa.insertAdjacentHTML('beforeend', '<button type="button" data-d="1">+</button>');
      caixa.addEventListener('click', function (e) {
        var bt = e.target.closest('button');
        if (!bt) return;
        var inp = this.querySelector('input');
        var max = parseInt(inp.getAttribute('data-max'), 10) || 99;
        var novo = Math.min(max, Math.max(1, (parseInt(inp.value, 10) || 1) + parseInt(bt.getAttribute('data-d'), 10)));
        if (novo === parseInt(inp.value, 10)) return;
        inp.value = novo;
        var id = inp.getAttribute('data-order-item-id');
        var real = document.querySelector('input.cartItemOriginal[data-order-item-id="' + id + '"]');
        if (!real || !real.form) return;
        real.value = novo;
        real.form.submit();
      });
    }
  }

  function aplicar() {
    if (!MQ.matches) { document.body.classList.remove('hzcc-on'); return; }
    document.body.classList.add('hzcc-on');
    compactarItens();
    cupom();
    contagem();
    resumo();
    barra();
  }

  function iniciar() {
    if (!document.getElementById('hzcc-css')) {
      var st = document.createElement('style'); st.id = 'hzcc-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    aplicar();
    var ag = null;
    new MutationObserver(function () {
      if (ag) return;
      ag = setTimeout(function () { ag = null; aplicar(); }, 150);
    }).observe(document.getElementById('cartContainer') || document.body, { childList: true, subtree: true });
    if (MQ.addEventListener) MQ.addEventListener('change', aplicar);
    // o aviso da loja aparece alguns instantes depois do carregamento
    [300, 900, 2000].forEach(function (ms) { setTimeout(abrirCupomSeAviso, ms); });
    // se o −/+ da loja não aparecer, entra o nosso
    setTimeout(function () { if (MQ.matches) quantidadeReserva(); }, 3000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
