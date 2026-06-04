$(document).ready(function() {

    const seletor = '.main-container';
    const url = window.location.href;

    list = [
        'camiseta-algodao-penteado-premium-bci-fittato-tshit',
        'camiseta-masculina-fio-egipcio-premium-11052',
        'camiseta-masculina-viscose-vortex-11003',
        'camiseta-masculina-fitt-dry-string-11008',
        'camiseta-fitt-dry-jab-11010',
        'camiseta-masculina-fitt-dry-impulse-11011',
        'camiseta-masculina-fitt-dry-solare-11015',
        'camiseta-masculina-fitt-dry-solare-decote-v-11018',
        'camiseta-masculina-fitt-dry-bolt-11041',
        'camiseta-masculina-fitt-dry-hassan-flex-11042',
        'camiseta-masculina-fitt-dry-hassan-flex-11042',
        'bermuda-masculina-tactel-ergonomic-58124',
        'bermuda-masculina-tactel-mesclado-neo-flex-blend',
        'polo-masculina-pique-flex-bci-elastano-bolso-11001',
        'polo-masculina-pique-flex-elastano-11002'
    ];
    

    if(!list.some(item => url.includes(item))) {
        return;
    }

    //css
    const css = `.aviso-pdp {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        padding: 15px;
        margin-bottom: 20px;
        text-align: center;
    }
        .aviso-pdp__texto {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
    }
        .aviso-pdp__subtexto {
        font-size: 14px;
        color: #555;
        margin: 5px 0 0;
    }`;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);


    const html = `
    <div class="aviso-pdp">
        <p class="aviso-pdp__texto">3 peças por R$299</p>
        <p class="aviso-pdp__subtexto">Adicione 3 camisetas desta página no carrinho e pague apenas R$ 99,67 por item</p>
    </div>`;
    
    $(html).insertBefore(seletor);


});