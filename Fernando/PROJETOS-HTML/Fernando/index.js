$(document).ready(function() {
  const starSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f5a623">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>`;


  const fiveStars = starSVG.repeat(5);

  const css = `
    .stars-content-name{
      display: flex;
      gap: 2px;
      align-items: center;
      justify-content: center;
      }`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  $(".product-list-name").after(`
    <div class="stars-content-name" aria-label="Avaliação 5 de 5" style="display:flex; gap:2px;">
      ${fiveStars}
    </div>
  `);
});