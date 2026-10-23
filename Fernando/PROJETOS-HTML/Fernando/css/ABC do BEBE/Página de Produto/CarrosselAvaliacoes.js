(function () {
  'use strict';

  /* AVALIACOES
   g: 1 = avaliacao 5 estrelas do Google (sem foto, mostra a inicial).
   Sem g = depoimento da home do site (com foto).
   Para adicionar/trocar, edite esta lista. */
  const F = 'https://cdn.awsli.com.br/1357/1357875/arquivos/';
  const AVALIACOES = [
    { nome: 'Bruna Hank', foto: F + 'design-sem-nome--2-.png', texto: 'Que delícia ver o cantinho do Matteo pronto! Ficou um sonho, aconchegante, funcional e cheio de amor! A Linha Cozy realmente transforma qualquer quartinho em um refúgio perfeito para o bebê, super recomendo...' },
    { nome: 'Caroline Kracik Silva', g: 1, texto: 'Experiência de compra maravilhosa sempre! Trabalham com as melhores marcas. Fiz o enxoval dos meus 4 filhos com eles e sempre entregaram tudo no prazo e atendimento impecável!' },
    { nome: 'Alexandre Freitas', foto: F + 'a.png', texto: 'Atendimento sensacional! Tudo conforme o prometido. Produto com excelente preço.' },
    { nome: 'Yara Fernanda', g: 1, texto: 'De todos os lugares em que comprei coisas da maternidade, esse foi o ÚNICO em que os produtos chegaram no tempo certo e sempre sendo bem assistida. Cômoda e berço, lindos! Recomendo 🤍' },
    { nome: 'Lígia G.', g: 1, texto: 'Loja maravilhosa! Comprei o berço e o enxoval do meu bebê aqui e amei a qualidade de tudo. Atendimento impecável e entrega no prazo. Recomendo muito!' },
    { nome: 'Andressa Chaban', foto: F + 'design-sem-nome--3-.png', texto: 'Loja linda, com preços excelentes, móveis de qualidade. Diferencial na região!' },
    { nome: 'Laís Perini', g: 1, texto: 'Foi ótima nossa experiência! Amamos os móveis e a cadeira de amamentação, atendimento rápido e esclarecedor, chegou no prazo combinado, montagem perfeita! Super recomendamos a ABC de Bebê! 😍' },
    { nome: 'Aline Cristina', g: 1, texto: 'O showroom é simplesmente maravilhoso! A loja tem várias opções de quartos lindos, de todos os preços. O atendimento é excelente. Comprei o quartinho da minha bebê e tenho certeza que fiz a melhor escolha de compra.' },
    { nome: 'Camila Lobo', foto: F + 'design-sem-nome--4-.png', texto: 'Adorei a variedade que encontrei para o quarto da minha bebê, entregaram em minha casa tudo perfeito' },
    { nome: 'Juliana Meneses Silva', g: 1, texto: 'Encontrei a minha poltrona de amamentação tão desejada na ABC de Bebê e o atendimento pelo WhatsApp foi sensacional e a entrega super rápida!' },
    { nome: 'Morgana Rodrigues', g: 1, texto: 'Tudo impecável! Comprei quase tudo para o meu bebê na loja on-line. Chegou suuuper rápido' },
    { nome: 'Thaiana R. Mueller', g: 1, texto: 'A loja é super completa! Tem muitas opções lindas de quarto de bebê!!! Amamos o atendimento personalizado e os produtos recebidos ficaram lindos!!! 🥰' }
  ];

  const CONFIG = {
    titulo: 'Quem já comprou, recomenda',
    subtitulo: 'Avaliações de clientes da ABC de Bebê',
    autoplay: 6000,
    widgetId: 'etraction-abcbebe-avaliacoes',
    styleId: 'etraction-abcbebe-avaliacoes-style'
  };

  const controllerKey = '__etractionAbcbebeAvaliacoes';
  if (typeof window[controllerKey] === 'function') window[controllerKey]();

  let observer = null, frame = null, scrollFrame = null, autoplayTimer = null, stopped = false;

  function cleanup() {
    stopped = true;
    if (observer) observer.disconnect();
    if (frame !== null) cancelAnimationFrame(frame);
    if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
    clearInterval(autoplayTimer);
    window.removeEventListener('resize', atualizar);
    document.removeEventListener('DOMContentLoaded', iniciar);
  }
  window[controllerKey] = cleanup;

  document.getElementById(CONFIG.widgetId)?.remove();
  document.getElementById(CONFIG.styleId)?.remove();

  /* CSS sem !important para caber no limite de 15k do painel;
   o replace abaixo adiciona !important em todas as declaracoes. */
  const W = '#' + CONFIG.widgetId;
  const css = `
${W},${W} *{box-sizing:border-box;}
${W}{width:calc(100% - 40px);max-width:1220px;margin:0 auto 40px;padding:28px 0 24px;order:2;position:relative;overflow:hidden;float:none;clear:both;background:linear-gradient(135deg,#fff9fb,#fffdf9 50%,#f7ffff);border:1px solid #f0dfe6;border-radius:14px;font-family:inherit;color:#201f1f;}
${W}::before{content:"";position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,#49b6b6 33%,#f6ba17 33% 66%,#e94d83 66%);}
${W} .ea-topo{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding:0 24px;margin:0 0 18px;}
${W} h2{margin:0 0 4px;font-family:inherit;font-size:22px;font-weight:700;line-height:1.2;color:#201f1f;text-transform:none;letter-spacing:0;}
${W} .ea-sub{margin:0;font-size:14px;line-height:1.4;color:#6b6566;}
${W} .ea-setas{display:flex;gap:8px;flex-shrink:0;}
${W} .ea-seta{width:38px;height:38px;display:flex;align-items:center;justify-content:center;margin:0;padding:0;background:#fff;border:1px solid #f0dfe6;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.05);color:#e94d83;cursor:pointer;transition:background-color .2s,color .2s;}
${W} .ea-seta:hover{background:#e94d83;color:#fff;}
${W} .ea-seta svg{width:18px;height:18px;display:block;}
${W} .ea-trilho{display:flex;gap:16px;margin:0;padding:4px 24px 8px;list-style:none;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-padding:0 24px;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
${W} .ea-trilho::-webkit-scrollbar{display:none;}
${W} .ea-card{flex:0 0 calc((100% - 32px) / 3);display:flex;flex-direction:column;margin:0;padding:20px;background:#fff;border:1px solid #f2e6eb;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.04);scroll-snap-align:start;}
${W} .ea-estrelas{display:flex;gap:2px;margin:0 0 12px;color:#f6ba17;}
${W} .ea-estrelas svg{width:16px;height:16px;display:block;fill:currentColor;}
${W} .ea-texto{flex:1 1 auto;margin:0 0 16px;padding:0;font-size:15px;line-height:1.55;color:#3b3637;}
${W} .ea-texto::before{content:"\\201C";display:block;height:22px;margin:0 0 2px;font-family:Georgia,serif;font-size:44px;line-height:1;color:#f3c2d4;}
${W} .ea-autor{display:flex;align-items:center;gap:10px;padding:14px 0 0;border-top:1px dashed #f0dfe6;}
${W} .ea-foto{width:40px;height:40px;min-width:40px;max-width:none;margin:0;display:flex;align-items:center;justify-content:center;border-radius:50%;border:2px solid #f9edf3;object-fit:cover;background:#f9edf3;font-size:16px;font-weight:700;color:#fff;}
${W} .ea-nome{display:block;font-size:14px;font-weight:700;line-height:1.3;color:#201f1f;}
${W} .ea-selo{display:flex;align-items:center;gap:4px;font-size:12px;line-height:1.3;color:#49a3a3;}
${W} .ea-selo svg{width:13px;height:13px;display:block;}
${W} .ea-bolinhas{display:flex;justify-content:center;flex-wrap:wrap;gap:6px;margin:14px 0 0;padding:0 16px;}
${W} .ea-bolinha{width:8px;height:8px;margin:0;padding:0;background:#f0dfe6;border:0;border-radius:8px;cursor:pointer;transition:width .25s,background-color .25s;}
${W} .ea-bolinha.ea-ativa{width:22px;background:#e94d83;}
@media (max-width:991px){${W} .ea-card{flex-basis:calc((100% - 16px) / 2);}}
@media (max-width:600px){
${W}{width:calc(100% - 24px);margin:0 auto 28px;padding:22px 0 18px;border-radius:12px;}
${W} .ea-topo{padding:0 16px;margin:0 0 14px;}
${W} h2{font-size:19px;}
${W} .ea-sub{font-size:13px;}
${W} .ea-setas{display:none;}
${W} .ea-trilho{gap:12px;padding:4px 16px 8px;scroll-padding:0 16px;}
${W} .ea-card{flex-basis:84%;padding:18px;}
${W} .ea-texto{font-size:14px;}
}
@media (prefers-reduced-motion:reduce){${W} .ea-trilho{scroll-behavior:auto;}}`;

  const style = document.createElement('style');
  style.id = CONFIG.styleId;
  style.textContent = css.replace(/;/g, ' !important;');
  document.head.appendChild(style);

  /* HTML */
  const CORES = ['#e94d83', '#49b6b6', '#f6ba17'];
  const SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">';
  const ESTRELA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96z"/></svg>';

  function escapar(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return '&#' + c.charCodeAt(0) + ';';
    });
  }

  const cards = AVALIACOES.map(function (a, i) {
    const foto = a.foto
      ? '<img class="ea-foto" src="' + escapar(a.foto) + '" alt="" loading="lazy" width="40" height="40">'
      : '<span class="ea-foto" style="background:' + CORES[i % 3] + ' !important" aria-hidden="true">' + escapar(a.nome.charAt(0)) + '</span>';
    return '<li class="ea-card" aria-roledescription="slide" aria-label="' + (i + 1) + ' de ' + AVALIACOES.length + '">' +
      '<div class="ea-estrelas" role="img" aria-label="5 de 5 estrelas">' + ESTRELA.repeat(5) + '</div>' +
      '<p class="ea-texto">' + escapar(a.texto) + '</p>' +
      '<div class="ea-autor">' + foto + '<div>' +
      '<span class="ea-nome">' + escapar(a.nome) + '</span>' +
      '<span class="ea-selo">' + SVG + '<path d="M20 6L9 17l-5-5"/></svg>' + (a.g ? 'Avaliação no Google' : 'Cliente ABC de Bebê') + '</span>' +
      '</div></div></li>';
  }).join('');

  const widget = document.createElement('section');
  widget.id = CONFIG.widgetId;
  widget.setAttribute('aria-roledescription', 'carrossel');
  widget.setAttribute('aria-label', CONFIG.titulo);
  widget.innerHTML =
    '<div class="ea-topo"><div>' +
    '<h2>' + escapar(CONFIG.titulo) + '</h2>' +
    '<p class="ea-sub">' + escapar(CONFIG.subtitulo) + '</p></div>' +
    '<div class="ea-setas">' +
    '<button type="button" class="ea-seta" data-dir="-1" aria-label="Avaliação anterior">' + SVG + '<path d="M15 18l-6-6 6-6"/></svg></button>' +
    '<button type="button" class="ea-seta" data-dir="1" aria-label="Próxima avaliação">' + SVG + '<path d="M9 18l6-6-6-6"/></svg></button>' +
    '</div></div>' +
    '<ul class="ea-trilho">' + cards + '</ul>' +
    '<div class="ea-bolinhas"></div>';

  /* CARROSSEL */
  const trilho = widget.querySelector('.ea-trilho');
  const bolinhas = widget.querySelector('.ea-bolinhas');
  const itens = trilho.children;

  function passo() {
    return itens.length > 1 ? itens[1].offsetLeft - itens[0].offsetLeft : trilho.clientWidth;
  }

  // Quantas "paradas" o trilho tem com a quantidade de cards visivel agora.
  function paginas() {
    const max = trilho.scrollWidth - trilho.clientWidth;
    return max <= 1 ? 1 : Math.round(max / passo()) + 1;
  }

  function paginaAtual() {
    if (trilho.scrollLeft >= trilho.scrollWidth - trilho.clientWidth - 2) return paginas() - 1;
    return Math.round(trilho.scrollLeft / passo());
  }

  function irPara(p) {
    const total = paginas();
    trilho.scrollTo({ left: ((p + total) % total) * passo() });
  }

  function atualizar() {
    if (stopped) return;
    const total = paginas();

    if (bolinhas.children.length !== (total > 1 ? total : 0)) {
      bolinhas.innerHTML = '';
      for (let i = 0; total > 1 && i < total; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ea-bolinha';
        b.setAttribute('aria-label', 'Ir para avaliação ' + (i + 1));
        b.addEventListener('click', function () { irPara(i); reiniciarAutoplay(); });
        bolinhas.appendChild(b);
      }
    }

    const atual = paginaAtual();
    [...bolinhas.children].forEach(function (b, i) {
      b.classList.toggle('ea-ativa', i === atual);
    });
  }

  widget.querySelectorAll('.ea-seta').forEach(function (seta) {
    seta.addEventListener('click', function () {
      irPara(paginaAtual() + Number(seta.dataset.dir));
      reiniciarAutoplay();
    });
  });

  trilho.addEventListener('scroll', function () {
    if (scrollFrame !== null) return;
    scrollFrame = requestAnimationFrame(function () {
      scrollFrame = null;
      atualizar();
    });
  }, { passive: true });

  function reiniciarAutoplay() {
    clearInterval(autoplayTimer);
    if (!CONFIG.autoplay || stopped || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    autoplayTimer = setInterval(function () {
      if (!document.body.contains(widget) || document.hidden) return;
      if (widget.matches(':hover') || widget.contains(document.activeElement)) return;
      irPara(paginaAtual() + 1);
    }, CONFIG.autoplay);
  }

  trilho.addEventListener('touchstart', reiniciarAutoplay, { passive: true });
  window.addEventListener('resize', atualizar);

  /* POSICAO
   Acima da descricao. .produto e flex com order (descricao = 2):
   mesmo order + vir antes no DOM = fica acima dela. */
  function posicionar() {
    if (stopped) return;

    const produto = document.querySelector('.pagina-produto .produto') || document.querySelector('.produto');
    if (!produto || !produto.querySelector('.principal')) return;

    // Sem descricao, entra logo abaixo dos detalhes.
    const desc = produto.querySelector(':scope > .produto-descricao');
    const alvo = desc || produto.querySelector(':scope > .produto-detalhes');
    if (!alvo) return;

    // So altera o DOM quando necessario, evitando duplicacao e loops.
    if ((desc ? alvo.previousElementSibling : alvo.nextElementSibling) !== widget) {
      alvo.insertAdjacentElement(desc ? 'beforebegin' : 'afterend', widget);
      atualizar();
      reiniciarAutoplay();
    }

    // Depois de localizar o produto, observa apenas a area dele.
    if (observer && observer.root !== produto) {
      observer.disconnect();
      observer.observe(produto, { childList: true });
      observer.root = produto;
    }
  }

  function iniciar() {
    if (stopped) return;
    observer = new MutationObserver(function () {
      if (frame !== null || stopped) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        posicionar();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    posicionar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
})();
