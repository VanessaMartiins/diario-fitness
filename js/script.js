/*************************
 * CÁLCULO SAUDÁVEL (IMC)
 *************************/
function calcularIMC() {
  let altura = document.getElementById("altura").value.replace(",", ".");
  let peso = document.getElementById("peso").value.replace(",", ".");

  altura = parseFloat(altura);
  peso = parseFloat(peso);

  if (isNaN(altura) || isNaN(peso)) {
    alert("Digite valores numéricos válidos");
    return;
  }

  const h = altura > 3 ? altura / 100 : altura;
  const imc = (peso / (h * h)).toFixed(1);

  let mensagem = "";
  if (imc < 18.5) mensagem = "Abaixo da faixa considerada saudável.";
  else if (imc < 25) mensagem = "Dentro da faixa considerada saudável.";
  else mensagem = "Acima da faixa considerada saudável.";

  document.getElementById("resultado").innerText =
    `IMC: ${imc} — ${mensagem}`;
}

/*************************
 * META SEMANAL
 *************************/
function gerarMeta() {
  let peso = document.getElementById("pesoMeta").value.replace(",", ".");
  peso = parseFloat(peso);

  if (isNaN(peso)) {
    document.getElementById("resultadoMeta").innerText =
      "⚠️ Digite um peso válido.";
    return;
  }

  const min = (peso - 0.25).toFixed(1);
  const max = (peso - 0.5).toFixed(1);

  const resultado =
    `Sugestão de acompanhamento semanal:
Caso haja mudança, algo entre ${max} kg e ${min} kg pode ser esperado.`;

  document.getElementById("resultadoMeta").innerText = resultado;
  localStorage.setItem("ultimaMeta", resultado);
}

/*************************
 * REFEIÇÕES (SALVAR)
 *************************/
function salvarRefeicao() {
  const fotoInput = document.getElementById("foto");
  const comentario = document.getElementById("comentario").value;

  if (!fotoInput || !fotoInput.files[0] || comentario.trim() === "") {
    alert("Adicione uma foto e um comentário 🙂");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const refeicao = {
      imagem: reader.result,
      texto: comentario,
      data: new Date().toLocaleDateString("pt-BR")
    };

    const refeicoes =
      JSON.parse(localStorage.getItem("refeicoes")) || [];

    refeicoes.unshift(refeicao);
    localStorage.setItem("refeicoes", JSON.stringify(refeicoes));

    fotoInput.value = "";
    document.getElementById("comentario").value = "";

    carregarRefeicoes();
  };

  reader.readAsDataURL(fotoInput.files[0]);
}

/*************************
 * REFEIÇÕES (CARREGAR)
 *************************/
function carregarRefeicoes() {
  const lista = document.getElementById("listaRefeicoes");
  if (!lista) return;

  lista.innerHTML = "";

  const refeicoes =
    JSON.parse(localStorage.getItem("refeicoes")) || [];

  refeicoes.forEach((ref, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${ref.imagem}" style="width:100%; border-radius:10px;">
      <p><strong>${ref.data}</strong></p>
      <p>${ref.texto}</p>
      <button class="btn-excluir" onclick="excluirRefeicao(${index})">
        🗑️ Excluir
      </button>
    `;

    lista.appendChild(card);
  });
}
function excluirRefeicao(index) {
  const refeicoes =
    JSON.parse(localStorage.getItem("refeicoes")) || [];

  refeicoes.splice(index, 1);
  localStorage.setItem("refeicoes", JSON.stringify(refeicoes));

  carregarRefeicoes();
}

/*************************
 * INICIALIZAÇÃO GLOBAL
 *************************/
document.addEventListener("DOMContentLoaded", () => {

  // carregar refeições
  carregarRefeicoes();

  // carregar última meta salva
  const metaSalva = localStorage.getItem("ultimaMeta");
  if (metaSalva && document.getElementById("resultadoMeta")) {
    document.getElementById("resultadoMeta").innerText =
      "Última meta salva:\n" + metaSalva;
  }

  // menu ativo
  const pagina = document.body.getAttribute("data-page");
  document.querySelectorAll(".menu a").forEach(link => {
    if (link.dataset.page === pagina) {
      link.classList.add("ativo");
    }
  });
});
