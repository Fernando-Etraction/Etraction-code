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

  const faqItems = root.querySelectorAll('.fernando-cro-faq-item');
  faqItems.forEach(function(item) {
    item.addEventListener('toggle', function() {
      if (!item.open) return;
      faqItems.forEach(function(other) {
        if (other !== item) other.removeAttribute('open');
      });
    });
  });
})();
