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
});

function compartilharWhatsApp() {
  const url = window.location.href;
  const texto = encodeURIComponent(
    "Estou usando este Diário Fitness para acompanhar hábitos 👇"
  );

  const link = `https://wa.me/?text=${texto}%20${encodeURIComponent(url)}`;
  window.open(link, "_blank");
}

function copiarLink() {
  const url = window.location.href;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(url)
      .then(() => alert("✅ Link copiado!"))
      .catch(() => alert("❌ Não foi possível copiar o link."));
  } else {
    const input = document.createElement("input");
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    alert("✅ Link copiado!");
  }
}

/*************************
 * CONTROLE CALÓRICO DIÁRIO
 *************************/

function adicionarAlimento() {
  const nome = document.getElementById("alimento").value.trim();
  const gramas = parseFloat(
    document.getElementById("gramas").value.replace(",", ".")
  );
  const kcal100 = parseFloat(
    document.getElementById("kcal100").value.replace(",", ".")
  );

  if (!nome || isNaN(gramas) || isNaN(kcal100)) {
    alert("Preencha todos os campos corretamente 🙂");
    return;
  }

  const kcalTotal = ((gramas * kcal100) / 100).toFixed(1);

  const alimento = {
    nome,
    gramas,
    kcal100,
    kcalTotal: parseFloat(kcalTotal),
    data: new Date().toLocaleDateString("pt-BR")
  };

  const lista = JSON.parse(localStorage.getItem("kcalDiario")) || [];
  lista.push(alimento);
  localStorage.setItem("kcalDiario", JSON.stringify(lista));

  document.getElementById("alimento").value = "";
  document.getElementById("gramas").value = "";
  document.getElementById("kcal100").value = "";

  carregarAlimentos();
}

function carregarAlimentos() {
  const container = document.getElementById("listaAlimentos");
  const totalSpan = document.getElementById("totalKcal");

  if (!container || !totalSpan) return;

  container.innerHTML = "";

  const hoje = new Date().toLocaleDateString("pt-BR");
  const lista = JSON.parse(localStorage.getItem("kcalDiario")) || [];

  let total = 0;

  lista
    .filter(item => item.data === hoje)
    .forEach((item, index) => {
      total += item.kcalTotal;

      const div = document.createElement("div");
      div.className = "item-kcal";
      div.innerHTML = `
        <strong>${item.nome}</strong>
        <p>${item.gramas} g · ${item.kcalTotal} kcal</p>
        <button onclick="removerAlimento(${index})">✖</button>
      `;
      container.appendChild(div);
    });

  totalSpan.innerText = total.toFixed(1);
}

function removerAlimento(index) {
  const lista = JSON.parse(localStorage.getItem("kcalDiario")) || [];
  lista.splice(index, 1);
  localStorage.setItem("kcalDiario", JSON.stringify(lista));
  carregarAlimentos();
}

document.addEventListener("DOMContentLoaded", carregarAlimentos);
