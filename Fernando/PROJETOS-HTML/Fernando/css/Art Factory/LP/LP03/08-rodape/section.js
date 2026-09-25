(function () {
  'use strict';
  const root = document.querySelector('.fernando-cro-artfactory-lp');
  if (!root) return;
  const yearNode = root.querySelector('[data-fernando-cro-year]');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
})();
