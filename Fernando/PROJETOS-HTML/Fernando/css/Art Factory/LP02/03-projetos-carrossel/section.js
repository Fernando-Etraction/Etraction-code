(function () {
  const root = document.querySelector('.fernando-cro-artfactory-lp');
  if (!root) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealItems = root.querySelectorAll('[data-fernando-cro-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('fernando-cro-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });
    revealItems.forEach(function(item) { observer.observe(item); });
  } else {
    revealItems.forEach(function(item) { item.classList.add('fernando-cro-revealed'); });
  }

  const carousel = root.querySelector('[data-fernando-cro-carousel]');
  if (!carousel) return;
  const track = carousel.querySelector('.fernando-cro-projetos-track');
  const slides = Array.from(carousel.querySelectorAll('.fernando-cro-projetos-slide'));
  const prev = carousel.querySelector('[data-fernando-cro-carousel-prev]');
  const next = carousel.querySelector('[data-fernando-cro-carousel-next]');
  const dotsWrap = carousel.querySelector('[data-fernando-cro-carousel-dots]');
  let index = 0;
  let touchStart = 0;

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach(function(_, dotIndex) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'fernando-cro-projetos-dot';
      dot.setAttribute('aria-label', 'Ir para o projeto ' + (dotIndex + 1));
      dot.addEventListener('click', function() { goTo(dotIndex); });
      dotsWrap.appendChild(dot);
    });
  }
  function update() {
    if (track) track.style.transform = 'translateX(' + (-index * 100) + '%)';
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.fernando-cro-projetos-dot').forEach(function(dot, dotIndex) {
      dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
    });
  }
  function goTo(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    update();
  }
  buildDots();
  update();
  if (prev) prev.addEventListener('click', function() { goTo(index - 1); });
  if (next) next.addEventListener('click', function() { goTo(index + 1); });
  carousel.addEventListener('touchstart', function(event) {
    touchStart = event.changedTouches[0].screenX;
  }, { passive: true });
  carousel.addEventListener('touchend', function(event) {
    const distance = touchStart - event.changedTouches[0].screenX;
    if (Math.abs(distance) > 50) goTo(distance > 0 ? index + 1 : index - 1);
  }, { passive: true });
})();
