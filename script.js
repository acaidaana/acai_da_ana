// ----------------------
// Variáveis globais
// ----------------------
let carrinho = [];
let itemAtual = null;
let qtdAçai = 1;
let adicionaisSelecionados = {};
let clienteLat = null;
let clienteLon = null;

// Número da loja (WhatsApp)
const numeroLoja = "+556692566903"; // substitua pelo seu número com DDI + DDD + número

// Localização da loja
const lojaLat = -15.8697; // latitude da loja
const lojaLon = -52.3491; // longitude da loja

// Lista de adicionais
const adicionais = [
    { nome: "Nutella", preco: 9.00 },
    { nome: "Creme ninho gourmet", preco: 7.00 },
    { nome: "Bis Oreo", preco: 2.50 },
    { nome: "Bis Branco", preco: 2.00 },
    { nome: "Bolacha Oreo", preco: 3.00 },
    { nome: "Canudos", preco: 3.00 },
    { nome: "Morango", preco: 4.00 },
    { nome: "Banana", preco: 2.00 },
    { nome: "Castanha", preco: 3.00 },
    { nome: "Leite Condensado", preco: 2.00 },
    { nome: "Granola", preco: 2.00 },
    { nome: "Paçoca", preco: 2.00 },
    { nome: "Leite Ninho", preco: 2.00 },
    { nome: "Disquete", preco: 3.00 }
];

// ----------------------
// Funções de filtro
// ----------------------
function filtrar(categoria) {
    const todasCategorias = document.querySelectorAll('.categoria');
    todasCategorias.forEach(cat => {
        cat.style.display = (categoria === 'Todas' || cat.dataset.categoria === categoria) ? 'block' : 'none';
    });
}

function scrollFiltros(valor) {
    document.querySelector('.filtros').scrollBy({ left: valor, behavior: 'smooth' });
}

// ----------------------
// Modal de item
// ----------------------
function abrirDetalhes(item) {
    itemAtual = item;
    qtdAçai = 1;
    document.getElementById("qtdAtual").textContent = qtdAçai;

    document.getElementById("modalImg").src = item.querySelector('img').src;
    document.getElementById("modalNome").textContent = item.querySelector('.nome').textContent;
    document.getElementById("modalIngredientes").textContent = item.dataset.ingredientes || "Ingredientes não informados";

    const preco = parseFloat(item.querySelector('.preco').textContent.replace('R$', '').replace(',', '.'));
    document.getElementById("modalPreco").textContent = preco.toFixed(2);

    const categoria = item.closest('.categoria').dataset.categoria;
    const adicionaisContainer = document.getElementById('adicionaisContainer');
    adicionaisContainer.style.display = 'block';
    carregarAdicionais();

    document.getElementById("modalItem").style.display = 'block';
}

function fecharModalItem() {
    document.getElementById("modalItem").style.display = 'none';
}

// ----------------------
// Quantidade do item
// ----------------------
function alterarQtd(valor) {
    qtdAçai += valor;
    if(qtdAçai < 1) qtdAçai = 1;
    document.getElementById("qtdAtual").textContent = qtdAçai;
}

// ----------------------
// Adicionais
// ----------------------
function carregarAdicionais() {
    adicionaisSelecionados = {};
    const lista = document.getElementById("adicionaisLista");
    lista.innerHTML = "";

    adicionais.forEach(ad => {
        adicionaisSelecionados[ad.nome] = 0;

        const li = document.createElement("li");
        li.className = "adicionalItemLi";
        li.innerHTML = `
            <span class="nomeAdicional">${ad.nome} (R$ ${ad.preco.toFixed(2)})</span>
            <div class="qtdContainer">
                <button class="btnQtd" onclick="alterarQtdAdicional('${ad.nome}', -1)">-</button>
                <span class="qtd" id="qtd_${ad.nome}">0</span>
                <button class="btnQtd" onclick="alterarQtdAdicional('${ad.nome}', 1)">+</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function alterarQtdAdicional(nome, valor) {
    adicionaisSelecionados[nome] += valor;
    if(adicionaisSelecionados[nome] < 0) adicionaisSelecionados[nome] = 0;
    document.getElementById("qtd_" + nome).textContent = adicionaisSelecionados[nome];
}

// ----------------------
// Animação do item para o carrinho
// ----------------------
function animarItemParaCarrinho(itemImg) {
    const img = itemImg.cloneNode(true);
    const rect = itemImg.getBoundingClientRect();
    img.style.position = 'fixed';
    img.style.left = rect.left + 'px';
    img.style.top = rect.top + 'px';
    img.style.width = rect.width + 'px';
    img.style.height = rect.height + 'px';
    img.style.transition = 'all 0.7s ease-in-out';
    img.style.zIndex = 1000;
    document.body.appendChild(img);

    const carrinhoEl = document.getElementById('carrinho');
    const carrinhoRect = carrinhoEl.getBoundingClientRect();

    setTimeout(() => {
        img.style.left = carrinhoRect.left + 'px';
        img.style.top = carrinhoRect.top + 'px';
        img.style.width = '20px';
        img.style.height = '20px';
        img.style.opacity = 0.5;
    }, 10);

    setTimeout(() => {
        document.body.removeChild(img);
    }, 710);
}


// ----------------------
// Carrinho
// ----------------------
document.getElementById("btnAdicionarModal").onclick = function() {
    // Aqui pegamos a imagem do item atual e animamos
    const itemImg = itemAtual.querySelector('img');
    animarItemParaCarrinho(itemImg);

    const nome = document.getElementById("modalNome").textContent;
    const precoBase = parseFloat(document.getElementById("modalPreco").textContent);

    const adicionaisDoItem = {};
    for(let key in adicionaisSelecionados) {
        if(adicionaisSelecionados[key] > 0) adicionaisDoItem[key] = adicionaisSelecionados[key];
    }

    carrinho.push({ nome, precoBase, qtd: qtdAçai, adicionais: adicionaisDoItem });
    atualizarCarrinho();
    fecharModalItem();
}


function atualizarCarrinho() {
    const itensCarrinho = document.getElementById("itensCarrinho");
    itensCarrinho.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, i) => {
        let precoItem = item.precoBase;
        let adicionaisText = "";

        for(let ad in item.adicionais) {
            const precoAd = adicionais.find(a => a.nome === ad).preco;
            precoItem += precoAd * item.adicionais[ad];
            adicionaisText += `${ad} x${item.adicionais[ad]}, `;
        }
        if(adicionaisText) adicionaisText = "(" + adicionaisText.slice(0, -2) + ")";

        const totalItem = precoItem * item.qtd;
        total += totalItem;

        const li = document.createElement("li");
        li.innerHTML = `${item.nome} x${item.qtd} ${adicionaisText} - R$ ${totalItem.toFixed(2)} <button onclick="removerItem(${i})">❌</button>`;
        itensCarrinho.appendChild(li);
    });

    document.getElementById("total").textContent = total.toFixed(2);
    document.getElementById("contador").textContent = carrinho.length;
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

document.getElementById("carrinho").addEventListener('click', () => {
    document.getElementById('modalCarrinho').style.display = 'block';
});

function fecharCarrinho() {
    document.getElementById('modalCarrinho').style.display = 'none';
}

// ----------------------
// Finalizar pedido
// ----------------------
function finalizarPedido() {
    if(carrinho.length === 0) {
        alert("Carrinho vazio!");
        return;
    }

    // Calcula subtotal
    let subtotal = 0;
    carrinho.forEach(item => {
        let precoItem = item.precoBase;
        for(let ad in item.adicionais) {
            const precoAd = adicionais.find(a => a.nome === ad).preco;
            precoItem += precoAd * item.adicionais[ad];
        }
        subtotal += precoItem * item.qtd;
    });

    const taxaEntrega = 7; // taxa fixa
    const total = subtotal + taxaEntrega;

    // Mostra valor total já incluindo taxa
    const totalModal = document.getElementById('totalPedidoFinal');
    if(totalModal) {
        totalModal.textContent = `Subtotal: R$ ${subtotal.toFixed(2)}\nTaxa de entrega: R$ ${taxaEntrega.toFixed(2)}\nTotal: R$ ${total.toFixed(2)}`;
    }

    fecharCarrinho();
    document.getElementById('modalCadastro').style.display = 'block';
}

// ----------------------
// Cadastro do cliente
// ----------------------
function fecharCadastro() {
    document.getElementById('modalCadastro').style.display = 'none';
}

function enviarCadastro() {
    const nome = document.getElementById('nomeCliente').value;
    const endereco = document.getElementById('enderecoCliente').value;
    const pagamento = document.getElementById('pagamentoCliente').value;

    if(!nome || !endereco) {
        alert("Preencha todos os campos!");
        return;
    }

    let mensagem = `*Pedido do(a) ${nome}*\nEndereço: ${endereco}\nPagamento: ${pagamento}\n\nItens:\n`;
    let subtotal = 0;

    carrinho.forEach(item => {
        let precoItem = item.precoBase;
        let adicionaisText = "";
        for(let ad in item.adicionais) {
            const precoAd = adicionais.find(a => a.nome === ad).preco;
            precoItem += precoAd * item.adicionais[ad];
            adicionaisText += `${ad} x${item.adicionais[ad]}, `;
        }
        if(adicionaisText) adicionaisText = " (" + adicionaisText.slice(0, -2) + ")";
        const totalItem = precoItem * item.qtd;
        subtotal += totalItem;
        mensagem += `- ${item.nome} x${item.qtd}${adicionaisText} - R$ ${totalItem.toFixed(2)}\n`;
    });

    // Taxa fixa de entrega
    const taxaEntrega = 7;
    const total = subtotal + taxaEntrega;
    mensagem += `\nTaxa de entrega: R$ ${taxaEntrega.toFixed(2)}`;
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

    const whatsapp = `https://api.whatsapp.com/send?phone=${numeroLoja}&text=${encodeURIComponent(mensagem)}`;
    window.open(whatsapp, "_blank");

    carrinho = [];
    atualizarCarrinho();
    fecharCadastro();
}

// ----------------------
// Localização
// ----------------------
function pegarLocalizacao() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            clienteLat = pos.coords.latitude;
            clienteLon = pos.coords.longitude;
            document.getElementById('enderecoCliente').value = `https://www.google.com/maps?q=${clienteLat},${clienteLon}`;
        }, () => {
            alert("Não foi possível obter a localização.");
        });
    } else {
        alert("Seu navegador não suporta geolocalização.");
    }
}
