  
  function criarBotaoNosForaDeEstoque() {
    const itens = document.querySelectorAll(".ra-vitrine ul.product-list li");

    itens.forEach(li => {
      const link = li.querySelector("a");
      const temBotao = li.querySelector(".btn-comprar-vitrine, .btn-consulte");

      if (!link || temBotao) return;

      const opacidade = parseFloat(getComputedStyle(link).opacity);
      if (opacidade < 0.46) {
        const nomeProduto = decodeURIComponent(li.getAttribute("data-name") || "Produto não identificado");
        const mensagem = encodeURIComponent(`Olá! Gostaria de consultar a disponibilidade do produto: ${nomeProduto}`);
        const whatsappLink = `https://wa.me/5545991125910?text=${mensagem}`;

        const botao = document.createElement("a");
        botao.href = whatsappLink;
        botao.target = "_blank";
        botao.rel = "noopener noreferrer";
        botao.className = "btn-consulte";
        botao.textContent = "Consulte disponibilidade";
        botao.style.cssText = `
          display: block;
          text-align: center;
          width: 90%;
opacity: 1;
          margin: 10px auto 0;
          padding: 10px 16px;
          background-color: #e0e0e0;
          color: #444;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-family: Roboto, sans-serif;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
        `;

        li.appendChild(botao);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", criarBotaoNosForaDeEstoque);

  const observerTarget = document.querySelector(".ra-vitrine ul.product-list") || document.body;
  const observer = new MutationObserver(criarBotaoNosForaDeEstoque);
  observer.observe(observerTarget, { childList: true, subtree: true });

