(function () {
  'use strict';
  const root = document.querySelector('.fernando-cro-artfactory-lp');
  if (!root) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealNodes = root.querySelectorAll('.fernando-cro-reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fernando-cro-is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealNodes.forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('fernando-cro-is-visible'));
  }

  const carousel = root.querySelector('[data-fernando-cro-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('[data-fernando-cro-track]');
  const slides = carousel.querySelectorAll('[data-fernando-cro-slide]');
  const prevBtn = carousel.querySelector('[data-fernando-cro-prev]');
  const nextBtn = carousel.querySelector('[data-fernando-cro-next]');
  const dotsContainer = carousel.querySelector('[data-fernando-cro-dots]');
  const currentNode = carousel.querySelector('[data-fernando-cro-current]');
  const totalNode = carousel.querySelector('[data-fernando-cro-total]');

  let index = 0;
  const total = slides.length;
  const formatTwo = (n) => String(n).padStart(2, '0');
  if (totalNode) totalNode.textContent = formatTwo(total);

  const dots = [];
  if (dotsContainer) {
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'fernando-cro-carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Ir para o projeto ' + formatTwo(i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  }

  function update() {
    if (track) track.style.transform = 'translateX(-' + (index * 100) + '%)';
    slides.forEach((slide, i) => slide.classList.toggle('fernando-cro-is-active', i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle('fernando-cro-is-active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    if (currentNode) currentNode.textContent = formatTwo(index + 1);
  }

  function goTo(i) { index = (i + total) % total; update(); }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  });

  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 40) diff < 0 ? next() : prev();
  }, { passive: true });

  let autoplayId = null;
  function startAutoplay() { if (!prefersReducedMotion) { stopAutoplay(); autoplayId = window.setInterval(next, 7000); } }
  function stopAutoplay() { if (autoplayId) { clearInterval(autoplayId); autoplayId = null; } }
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);
  document.addEventListener('visibilitychange', () => document.hidden ? stopAutoplay() : startAutoplay());

  update();
  startAutoplay();
})();
