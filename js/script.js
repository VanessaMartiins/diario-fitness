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

  let mensagem =
    imc < 18.5 ? "Abaixo da faixa considerada saudável." :
    imc < 25 ? "Dentro da faixa considerada saudável." :
    "Acima da faixa considerada saudável.";

  document.getElementById("resultado").innerText =
    `IMC: ${imc} — ${mensagem}`;
}

/*************************
 * META SEMANAL
 *************************/
function gerarMeta() {
  let peso = parseFloat(
    document.getElementById("pesoMeta").value.replace(",", ".")
  );

  if (isNaN(peso)) {
    document.getElementById("resultadoMeta").innerText =
      "⚠️ Digite um peso válido.";
    return;
  }

  const min = (peso - 0.25).toFixed(1);
  const max = (peso - 0.5).toFixed(1);

  const resultado =
    `Sugestão semanal:
Caso haja mudança, algo entre ${max} kg e ${min} kg.`;

  document.getElementById("resultadoMeta").innerText = resultado;
  localStorage.setItem("ultimaMeta", resultado);
}

/*************************
 * REFEIÇÕES
 *************************/
function salvarRefeicao() {
  const foto = document.getElementById("foto");
  const comentario = document.getElementById("comentario").value.trim();

  if (!foto.files[0] || !comentario) {
    alert("Adicione foto e comentário 🙂");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const refeicao = {
      id: Date.now(),
      imagem: reader.result,
      texto: comentario,
      data: new Date().toLocaleDateString("pt-BR")
    };

    const lista = JSON.parse(localStorage.getItem("refeicoes")) || [];
    lista.unshift(refeicao);
    localStorage.setItem("refeicoes", JSON.stringify(lista));
    carregarRefeicoes();
  };

  reader.readAsDataURL(foto.files[0]);
}

function carregarRefeicoes() {
  const listaEl = document.getElementById("listaRefeicoes");
  if (!listaEl) return;

  listaEl.innerHTML = "";
  const lista = JSON.parse(localStorage.getItem("refeicoes")) || [];

  lista.forEach(ref => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${ref.imagem}" style="width:100%; border-radius:10px;">
      <p><strong>${ref.data}</strong></p>
      <p>${ref.texto}</p>
      <button class="btn-excluir" onclick="excluirRefeicao(${ref.id})">🗑️</button>
    `;
    listaEl.appendChild(div);
  });
}

function excluirRefeicao(id) {
  let lista = JSON.parse(localStorage.getItem("refeicoes")) || [];
  lista = lista.filter(r => r.id !== id);
  localStorage.setItem("refeicoes", JSON.stringify(lista));
  carregarRefeicoes();
}

/*************************
 * CONTROLE CALÓRICO DIÁRIO
 *************************/
function adicionarAlimento() {
  const nome = document.getElementById("alimento").value.trim();
  const gramas = parseFloat(document.getElementById("gramas").value);
  const kcal100 = parseFloat(document.getElementById("kcal100").value);

  if (!nome || isNaN(gramas) || isNaN(kcal100)) {
    alert("Preencha todos os campos 🙂");
    return;
  }

  const alimento = {
    id: Date.now(),
    nome,
    gramas,
    kcalTotal: ((gramas * kcal100) / 100).toFixed(1),
    data: new Date().toLocaleDateString("pt-BR")
  };

  const lista = JSON.parse(localStorage.getItem("kcalDiario")) || [];
  lista.push(alimento);
  localStorage.setItem("kcalDiario", JSON.stringify(lista));
  carregarAlimentos();
}

function carregarAlimentos() {
  const listaEl = document.getElementById("listaAlimentos");
  const totalEl = document.getElementById("totalKcal");
  if (!listaEl || !totalEl) return;

  listaEl.innerHTML = "";
  const hoje = new Date().toLocaleDateString("pt-BR");
  const lista = JSON.parse(localStorage.getItem("kcalDiario")) || [];

  let total = 0;

  lista.filter(i => i.data === hoje).forEach(item => {
    total += parseFloat(item.kcalTotal);

    const div = document.createElement("div");
    div.className = "item-kcal";
    div.innerHTML = `
      <p><strong>${item.nome}</strong><br>${item.gramas} g · ${item.kcalTotal} kcal</p>
      <button onclick="removerAlimento(${item.id})">✖</button>
    `;
    listaEl.appendChild(div);
  });

  totalEl.innerText = total.toFixed(1);
}

function removerAlimento(id) {
  let lista = JSON.parse(localStorage.getItem("kcalDiario")) || [];
  lista = lista.filter(a => a.id !== id);
  localStorage.setItem("kcalDiario", JSON.stringify(lista));
  carregarAlimentos();
}

/*************************
 * INIT
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  carregarRefeicoes();
  carregarAlimentos();

  const meta = localStorage.getItem("ultimaMeta");
  if (meta && document.getElementById("resultadoMeta")) {
    document.getElementById("resultadoMeta").innerText = meta;
  }
});
