/* Filtro de categorias na home - ABC de Bebê (Loja Integrada) */
(function ($) {
  if (!$ || !$('body').hasClass('pagina-inicial') || $('.abc-filtro').length) return;

  var CDN = 'https://cdn.awsli.com.br/400x400/1357/1357875/produto/';
  // estampa desenhada para Papel de Parede (categoria ainda sem produtos/fotos)
  var PAPEL = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
      '<defs><pattern id="p" width="100" height="100" patternUnits="userSpaceOnUse">' +
        '<rect width="100" height="100" fill="#f3f8ec"/>' +
        '<path d="M18 40a11 11 0 0 1 21-4 8 8 0 0 1 9 12H16a7 7 0 0 1 2-8z" fill="#fff"/>' +
        '<path d="M68 90a11 11 0 0 1 21-4 8 8 0 0 1 9 12H66a7 7 0 0 1 2-8z" fill="#fff"/>' +
        '<path d="M75 22l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill="#f6d98a"/>' +
        '<circle cx="25" cy="78" r="5" fill="#9dd466"/>' +
        '<circle cx="50" cy="12" r="3" fill="#f3a6bd"/>' +
        '<circle cx="8" cy="8" r="2" fill="#8fd3d6"/>' +
      '</pattern></defs>' +
      '<rect width="400" height="400" fill="url(#p)"/>' +
    '</svg>'
  );
  // img: foto de capa de cada categoria (quadrada, 400x400 ou maior)
  var CATEGORIAS = [
    { nome: 'Pronta Entrega', url: '/pronta-entrega', img: CDN + '399715836/210-3p4si3rru9.jpg' },
    { nome: 'Berços', url: '/bercos', img: CDN + '399474668/134-theq4e2wre.jpg' },
    { nome: 'Berços Evolutivos', url: '/bercos-evolutivos-3-em-1-ou-4-em-1', img: CDN + '365410701/site-imagens-46-aex76ek60q.jpg' },
    { nome: 'Móveis', url: '/moveis', img: CDN + '402618590/aaa32130eb4a4cacafb353a63b1ee4ed-sevwrv79yu.jpg' },
    { nome: 'Poltronas de Amamentação', url: '/poltronas-de-amamentacao', img: CDN + '403811464/551a09c1a78e40bfbe518039826e3511-ve4zzk0ddh.jpg' },
    { nome: 'Papel de Parede', url: '/papel-de-parede', img: PAPEL },
    { nome: 'Decoração', url: '/decoracao-e-acessorios', img: CDN + '401975155/0a504d3fb5814bc79c8960654d1455a8-a24ka5enfq.jpg' }
  ];
  var LIMITE = 12;
  var cache = {};

  var css =
    '.abc-filtro{margin:30px 0 10px}' +
    '.abc-filtro-abas{margin:0 0 28px;padding:0 34px;list-style:none;position:relative}' +
    '.abc-filtro-aba{padding:4px 9px;box-sizing:border-box}' +
    '.abc-filtro-aba button{display:block;width:100%;padding:0;border:0;background:none;font-family:inherit;cursor:pointer;text-align:center}' +
    '.abc-filtro-quadro{display:block;position:relative;width:100%;padding-top:100%;border-radius:14px;overflow:hidden;background:#f1f9e8;box-shadow:0 0 0 2px #ececec;transition:box-shadow .2s}' +
    '.abc-filtro-quadro img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;transition:transform .35s}' +
    '.abc-filtro-aba button:hover .abc-filtro-quadro img{transform:scale(1.06)}' +
    '.abc-filtro-aba button.ativo .abc-filtro-quadro{box-shadow:0 0 0 3px #9dd466}' +
    '.abc-filtro-nome{display:block;margin-top:10px;font-size:15px;font-weight:600;line-height:1.25;color:#201f1f}' +
    '.abc-filtro-aba button.ativo .abc-filtro-nome{color:#6fae32}' +
    '.abc-filtro-abas .slick-arrow{top:calc(50% - 18px)}' +
    '.abc-filtro-conteudo{min-height:420px;position:relative;transition:opacity .2s}' +
    '.abc-filtro-conteudo.carregando{opacity:.35;pointer-events:none}' +
    '.abc-filtro-vazio{text-align:center;padding:60px 0;color:#777}' +
    '.abc-filtro-vermais{text-align:center;margin:18px 0 0}' +
    '.abc-filtro-vermais a{display:inline-block;font-weight:600;color:#201f1f;border-bottom:2px solid #9dd466;padding-bottom:2px;text-decoration:none}' +
    '@media(max-width:767px){' +
    '.abc-filtro-abas{padding:0 6px;margin-bottom:20px}' +
    '.abc-filtro-aba{padding:4px 6px}' +
    '.abc-filtro-nome{font-size:13px;margin-top:8px}' +
    '.abc-filtro-conteudo{min-height:320px}}';
  $('<style id="abc-filtro-css">').text(css).appendTo('head');

  var $modelo = $('.listagem.vitrine-produtos').first();
  var $secao = $(
    '<div class="abc-filtro listagem vitrine-produtos listagem-desktop-prod4 listagem-mobile-prod2 item-home fixarImagem">' +
      '<div class="conteiner"><div class="row-fluid">' +
        '<div class="titulo-categoria"><strong>Compre por categoria</strong></div>' +
        '<div class="abc-filtro-abas" role="tablist"></div>' +
        '<div class="abc-filtro-conteudo"></div>' +
        '<p class="abc-filtro-vermais"><a href="#"></a></p>' +
      '</div></div>' +
    '</div>'
  );
  var $abas = $secao.find('.abc-filtro-abas');
  var $conteudo = $secao.find('.abc-filtro-conteudo');
  var $verMais = $secao.find('.abc-filtro-vermais a');

  $.each(CATEGORIAS, function (i, c) {
    var $quadro = $('<span class="abc-filtro-quadro">');
    if (c.img) $quadro.append($('<img loading="lazy">').attr({ src: c.img, alt: c.nome }));
    $('<div class="abc-filtro-aba">').append(
      $('<button type="button" role="tab">').data('cat', c).append($quadro, $('<span class="abc-filtro-nome">').text(c.nome))
    ).appendTo($abas);
  });

  if ($modelo.length) $modelo.before($secao);
  else $('#corpo .secao-principal, #corpo').first().append($secao);

  function setas() {
    try {
      var o = $modelo.find('.slick-slider').slick('getSlick').options;
      return { prevArrow: o.prevArrow, nextArrow: o.nextArrow };
    } catch (e) {
      return {};
    }
  }

  if ($.fn.slick) {
    $abas.slick($.extend({ slidesToShow: 6, slidesToScroll: 2, infinite: false, dots: false, arrows: true,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 5, slidesToScroll: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 4, slidesToScroll: 2 } },
        { breakpoint: 600, settings: { slidesToShow: 3, slidesToScroll: 2, arrows: false } }
      ] }, setas()));
  }

  // deixa o card da página de categoria igual ao card da vitrine da home
  function normalizar(item) {
    var $i = $(item).addClass('acoes-fixar');
    $i.find('.cor-principal,.cor-secundaria').removeClass('cor-principal cor-secundaria');
    $i.find('.fundo-principal').removeClass('fundo-principal');
    var $preco = $i.find('.preco-produto');
    $preco.parent().addClass('precos-wrap');
    var $pix = $preco.find('.desconto-a-vista');
    if ($pix.length) {
      var valor = $pix.find('strong').first().prop('outerHTML') || '';
      $pix.html(valor + ' <span>no pix</span>').prependTo($preco);
    }
    $i.find('.acoes-produto .botao-comprar').text('Adicionar');
    $i.wrapInner('<div class="listagem-item-wrap"></div>');
    return $i;
  }

  function mostrar(cat, itens) {
    var $ul = $('<ul class="vitrine-carrossel">');
    if (!itens.length) {
      $conteudo.html('<p class="abc-filtro-vazio">Nenhum produto encontrado nesta categoria.</p>');
    } else {
      $.each(itens, function (i, html) { $ul.append(normalizar($(html))); });
      $conteudo.empty().append($ul);
      if ($.fn.slick) {
        $ul.slick($.extend({ slidesToShow: 4, slidesToScroll: 4, infinite: false, dots: false, arrows: true,
          responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 350, settings: { slidesToShow: 1, slidesToScroll: 1 } }
          ] }, setas()));
      }
    }
    $verMais.attr('href', cat.url).text('Ver tudo em ' + cat.nome + ' →');
    $conteudo.removeClass('carregando');
  }

  function carregar(cat) {
    $conteudo.addClass('carregando');
    if (cache[cat.url]) return mostrar(cat, cache[cat.url]);
    $.get(cat.url).done(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var itens = $(doc).find('#corpo .listagem .listagem-item').slice(0, LIMITE).map(function () {
        return this.outerHTML;
      }).get();
      cache[cat.url] = itens;
      if ($abas.find('.ativo').data('cat') === cat) mostrar(cat, itens);
    }).fail(function () {
      $conteudo.removeClass('carregando').html('<p class="abc-filtro-vazio">Não foi possível carregar os produtos.</p>');
    });
  }

  $abas.on('click', 'button', function () {
    var $b = $(this);
    if ($b.hasClass('ativo')) return;
    $abas.find('button').removeClass('ativo').attr('aria-selected', 'false');
    $b.addClass('ativo').attr('aria-selected', 'true');
    carregar($b.data('cat'));
  });

  $abas.find('button').first().trigger('click');
})(window.jQuery);
