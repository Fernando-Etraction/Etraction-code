(function () {
  const root = document.querySelector('.fernando-cro-artfactory-lp');
  if (!root) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = root.querySelectorAll('[data-fernando-cro-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('fernando-cro-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });
    items.forEach(function(item) { observer.observe(item); });
  } else {
    items.forEach(function(item) { item.classList.add('fernando-cro-revealed'); });
  }
})();
