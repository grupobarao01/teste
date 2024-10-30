// Carregar o carrinho do localStorage
//https://www.invertexto.com/qwws21
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let total = carrinho.reduce(
  (acc, item) => acc + item.preco * item.quantidade,
  0,
);

// Dados do estoque dos produtos
const estoqueProdutos = {
  1: 53, // Produto 1
  2: 32, // Produto 2
  3: 21, // Produto 3
  4: 65,
  5: 87,
  6: 10,
};

// Função para salvar o carrinho no localStorage
function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarQuantidadeCarrinho();
}

// Função para adicionar um item ao carrinho
function adicionarAoCarrinho(nomeProduto, preco, produtoId) {
  const produtoExistente = carrinho.find((item) => item.nome === nomeProduto);
  const estoqueAtual = estoqueProdutos[produtoId];

  if (estoqueAtual > 0) {
    if (produtoExistente) {
      produtoExistente.quantidade++;
    } else {
      carrinho.push({ nome: nomeProduto, preco: preco, quantidade: 1 });
    }

    estoqueProdutos[produtoId]--;
    atualizarEstoque(produtoId);
    total += preco;
    salvarCarrinho();
    // alert('Produto adicionado ao carrinho!');
  } else {
    alert('Produto esgotado!');
  }
}

// Função para atualizar a exibição do estoque e desativar botão se o estoque acabar
function atualizarEstoque(produtoId) {
  const estoqueElemento = document.getElementById(
    `estoque-produto-${produtoId}`,
  );
  const botaoElemento = document.getElementById(`btn-produto-${produtoId}`);

  estoqueElemento.textContent = `Estoque: ${estoqueProdutos[produtoId]}`;
  console.log(estoqueElemento);
  if (estoqueProdutos[produtoId] === 0) {
    botaoElemento.disabled = true;
    botaoElemento.textContent = 'Esgotado';
  }
}

// Função para filtrar os produtos na pesquisa
function filtrarProdutos() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const produtos = document.querySelectorAll('.produto');

  produtos.forEach((produto) => {
    const nomeProduto = produto.getAttribute('data-nome').toLowerCase();
    if (nomeProduto.includes(input)) {
      produto.style.display = 'block';
    } else {
      produto.style.display = 'none';
    }
  });
}

// Função para remover um item do carrinho
function removerDoCarrinho(nomeProduto) {
  const produto = carrinho.find((item) => item.nome === nomeProduto);
  if (produto) {
    if (produto.quantidade > 1) {
      // Apenas diminui a quantidade se mais de um item estiver no carrinho
      produto.quantidade--;
      total -= produto.preco;
    } else {
      // Remove o item se a quantidade for 1
      const produtoIndex = carrinho.indexOf(produto);
      carrinho.splice(produtoIndex, 1);
      total -= produto.preco * produto.quantidade;
    }
    salvarCarrinho();
    atualizarCarrinho();
  }
}

// Função para ajustar a quantidade de um item no carrinho
function ajustarQuantidade(nomeProduto, novaQuantidade) {
  const produto = carrinho.find((item) => item.nome === nomeProduto);
  if (produto) {
    total -= produto.preco * produto.quantidade; // Subtrair o total anterior
    produto.quantidade = novaQuantidade;
    total += produto.preco * produto.quantidade; // Adicionar o novo total
    salvarCarrinho();
    atualizarCarrinho();
  }
}

// Função para atualizar o carrinho na tela do carrinho.html
function atualizarCarrinho() {
  const listaCarrinho = document.getElementById('listaCarrinho');
  const totalElemento = document.getElementById('total');

  if (listaCarrinho && totalElemento) {
    listaCarrinho.innerHTML = '';
    carrinho.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `
                ${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}
                <button onclick="removerDoCarrinho('${
                  item.nome
                }')" class="btn btn-danger">Remover</button>
            `;

      listaCarrinho.appendChild(li);
    });
    totalElemento.textContent = `Total: R$ ${total.toFixed(2)}`;
  }
}

// Função para finalizar a compra
function finalizarCompra() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const modal = new bootstrap.Modal(
    document.getElementById('ExemploModalCentralizado'),
  );
  modal.show();

  // alert('Compra finalizada! Obrigado pela preferência.');
  carrinho = [];
  total = 0;
  salvarCarrinho();
  atualizarCarrinho();
}

const btnPix = document.getElementById('pix');
btnPix.addEventListener('click', formaPagamento);
const btnCredito = document.getElementById('credito');
btnPix.addEventListener('click', formaPagamento);
const btnBoleto = document.getElementById('boleto');
btnPix.addEventListener('click', formaPagamento);

function formaPagamento() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById('ExemploModalCentralizado'),
  );
  if (modal) {
    modal.hide(); // Fecha o modal
    alert('Compra Finalizada');
  }
}

// Função para remover todos os itens do carrinho
function removerTodosItens() {
  carrinho = [];
  total = 0;
  salvarCarrinho();
  atualizarCarrinho();
}

// Função para atualizar a quantidade de itens no carrinho
function atualizarQuantidadeCarrinho() {
  const quantidadeCarrinhoElemento =
    document.getElementById('quantidadeCarrinho');
  const quantidadeTotal = carrinho.reduce(
    (acc, item) => acc + item.quantidade,
    0,
  );
  if (quantidadeCarrinhoElemento) {
    quantidadeCarrinhoElemento.textContent = quantidadeTotal;
  }
}

// Atualizar o carrinho e a quantidade de itens ao carregar a página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho();
    atualizarQuantidadeCarrinho();
  });
} else {
  atualizarCarrinho();
  atualizarQuantidadeCarrinho();
}

// Atualizar estoque ao carregar a página de produtos
document.addEventListener('DOMContentLoaded', () => {
  for (let produtoId in estoqueProdutos) {
    atualizarEstoque(produtoId);
  }
});
