/*************************
 * LOGIN / USUÁRIO
 *************************/

function login() {
  const nome = document.getElementById("usuario").value.trim();

  if (!nome) {
    alert("Digite seu nome");
    return;
  }

  localStorage.setItem("usuarioLogado", nome);

  if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify({}));
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios"));

  if (!usuarios[nome]) {
    usuarios[nome] = { dias: {} };
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  window.location.href = "controle.html";
}

function getUsuarioAtual() {
  return localStorage.getItem("usuarioLogado");
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

/*************************
 * DATA / STORAGE
 *************************/

function getDataHoje() {
  return new Date().toISOString().split("T")[0];
}

function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios"));
}

function salvarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function getDiaAtual() {
  const usuario = getUsuarioAtual();
  const usuarios = getUsuarios();
  const hoje = getDataHoje();

  if (!usuarios[usuario].dias[hoje]) {
    usuarios[usuario].dias[hoje] = {
      alimentos: [],
      totalKcal: 0
    };
    salvarUsuarios(usuarios);
  }

  return usuarios[usuario].dias[hoje];
}

/*************************
 * ALIMENTOS
 *************************/

function adicionarAlimento() {
  const alimento = document.getElementById("alimento").value;
  const gramas = Number(document.getElementById("gramas").value);
  const kcal100 = Number(document.getElementById("kcal100").value);

  if (!alimento || !gramas || !kcal100) {
    alert("Preencha todos os campos");
    return;
  }

  const kcal = (gramas * kcal100) / 100;

  const usuario = getUsuarioAtual();
  const usuarios = getUsuarios();
  const hoje = getDataHoje();

  usuarios[usuario].dias[hoje].alimentos.push({
    alimento,
    gramas,
    kcal
  });

  usuarios[usuario].dias[hoje].totalKcal += kcal;

  salvarUsuarios(usuarios);

  limparCampos();
  atualizarTela();
}

function limparCampos() {
  document.getElementById("alimento").value = "";
  document.getElementById("gramas").value = "";
  document.getElementById("kcal100").value = "";
}

/*************************
 * TELA
 *************************/

function atualizarTela() {
  const dia = getDiaAtual();

  document.getElementById("totalKcal").innerText =
    dia.totalKcal.toFixed(0);

  const lista = document.getElementById("listaAlimentos");
  lista.innerHTML = "";

  dia.alimentos.forEach(item => {
    const div = document.createElement("div");
    div.innerText = `${item.alimento} - ${item.kcal.toFixed(0)} kcal`;
    lista.appendChild(div);
  });
}

window.onload = function () {
  if (document.body.dataset.page === "interna") {
    atualizarTela();
  }
};

/*************************
 * LIMPAR DIA
 *************************/

function limparDia() {
  if (!confirm("Deseja apagar tudo de hoje?")) return;

  const usuario = getUsuarioAtual();
  const usuarios = getUsuarios();
  const hoje = getDataHoje();

  usuarios[usuario].dias[hoje] = {
    alimentos: [],
    totalKcal: 0
  };

  salvarUsuarios(usuarios);
  atualizarTela();
}

/************************************
 * BASE DE ALIMENTOS (kcal/100g)
 ************************************/
const alimentosPadrao = [
  { nome: "Arroz branco", kcal100: 130 },
  { nome: "Feijão carioca", kcal100: 77 },
  { nome: "Pão francês", kcal100: 270 },
  { nome: "Frango grelhado", kcal100: 165 },
  { nome: "Carne bovina", kcal100: 250 },
  { nome: "Ovo", kcal100: 155 },
  { nome: "Banana", kcal100: 89 },
  { nome: "Maçã", kcal100: 52 },
  { nome: "Batata cozida", kcal100: 87 },
  { nome: "Batata doce", kcal100: 86 },
  { nome: "Aveia", kcal100: 389 },
  { nome: "Iogurte natural", kcal100: 59 },
  { nome: "Queijo muçarela", kcal100: 300 },
  { nome: "Leite integral", kcal100: 61 },
  { nome: "Brócolis", kcal100: 34 },
  { nome: "Alface", kcal100: 15 },
  { nome: "Tomate", kcal100: 18 },
  { nome: "Peito de peru", kcal100: 135 }
];

if (!localStorage.getItem("alimentosBase")) {
  localStorage.setItem("alimentosBase", JSON.stringify(alimentosPadrao));
}
if (!localStorage.getItem("alimentosUsuario")) {
  localStorage.setItem("alimentosUsuario", JSON.stringify([]));
}
if (!localStorage.getItem("kcalDia")) {
  localStorage.setItem("kcalDia", JSON.stringify([]));
}

/************************************
 * IMC
 ************************************/
function calcularIMC() {
  const altura = parseFloat(
    document.getElementById("altura").value.replace(",", ".")
  );
  const peso = parseFloat(
    document.getElementById("peso").value.replace(",", ".")
  );

  if (isNaN(altura) || isNaN(peso)) {
    alert("Digite valores válidos");
    return;
  }

  const h = altura > 3 ? altura / 100 : altura;
  const imc = (peso / (h * h)).toFixed(1);

  const msg =
    imc < 18.5 ? "Abaixo do saudável." :
    imc < 25 ? "Faixa saudável." :
    "Acima do saudável.";

  document.getElementById("resultado").innerText =
    `IMC: ${imc} — ${msg}`;
}

/************************************
 * META SEMANAL
 ************************************/
function gerarMeta() {
  const peso = parseFloat(
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
Entre ${max} kg e ${min} kg.`;

  document.getElementById("resultadoMeta").innerText = resultado;
  localStorage.setItem("ultimaMeta", resultado);
}

/************************************
 * REFEIÇÕES (foto + comentário)
 ************************************/
function salvarRefeicao() {
  const foto = document.getElementById("foto");
  const comentario = document.getElementById("comentario").value.trim();

  if (!foto?.files[0] || !comentario) {
    alert("Adicione foto e comentário");
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
    listaEl.innerHTML += `
      <div class="card">
        <img src="${ref.imagem}">
        <p><strong>${ref.data}</strong></p>
        <p>${ref.texto}</p>
        <button onclick="excluirRefeicao(${ref.id})">🗑️</button>
      </div>
    `;
  });
}

function excluirRefeicao(id) {
  let lista = JSON.parse(localStorage.getItem("refeicoes")) || [];
  lista = lista.filter(r => r.id !== id);
  localStorage.setItem("refeicoes", JSON.stringify(lista));
  carregarRefeicoes();
}

/************************************
 * CONTROLE CALÓRICO DIÁRIO
 ************************************/
function carregarSelectAlimentos() {
  const select = document.getElementById("nomeAlimento");
  if (!select) return;

  select.innerHTML = `<option value="">Selecione</option>`;

  const base = JSON.parse(localStorage.getItem("alimentosBase"));
  const usuario = JSON.parse(localStorage.getItem("alimentosUsuario"));

  [...base, ...usuario].forEach((item, index) => {
    select.innerHTML += `<option value="${index}">${item.nome}</option>`;
  });
}

function adicionarAlimento() {
  const index = document.getElementById("nomeAlimento").value;
  const gramas = Number(document.getElementById("gramas").value);

  if (index === "" || !gramas) {
    alert("Preencha os campos");
    return;
  }

  const alimentos = [
    ...JSON.parse(localStorage.getItem("alimentosBase")),
    ...JSON.parse(localStorage.getItem("alimentosUsuario"))
  ];

  const hoje = new Date().toLocaleDateString("pt-BR");
  const kcal = (gramas * alimentos[index].kcal100) / 100;

  const registros = JSON.parse(localStorage.getItem("kcalDia"));
  registros.push({ nome: alimentos[index].nome, gramas, kcal, data: hoje });

  localStorage.setItem("kcalDia", JSON.stringify(registros));
  atualizarTelaKcal();
}

function atualizarTelaKcal() {
  const lista = document.getElementById("listaKcal");
  const totalEl = document.getElementById("totalKcal");
  if (!lista || !totalEl) return;

  const hoje = new Date().toLocaleDateString("pt-BR");
  const registros = JSON.parse(localStorage.getItem("kcalDia"));

  lista.innerHTML = "";
  let total = 0;

  registros.filter(r => r.data === hoje).forEach((item, i) => {
    total += item.kcal;
    lista.innerHTML += `
      <div class="item">
        <strong>${item.nome}</strong><br>
        ${item.gramas} g · ${item.kcal.toFixed(1)} kcal
        <span onclick="removerAlimento(${i})">❌</span>
      </div>
    `;
  });

  totalEl.innerText = total.toFixed(1);
  desenharGrafico();
}

function removerAlimento(i) {
  const registros = JSON.parse(localStorage.getItem("kcalDia"));
  registros.splice(i, 1);
  localStorage.setItem("kcalDia", JSON.stringify(registros));
  atualizarTelaKcal();
}

function limparDia() {
  const hoje = new Date().toLocaleDateString("pt-BR");
  let registros = JSON.parse(localStorage.getItem("kcalDia"));
  registros = registros.filter(r => r.data !== hoje);
  localStorage.setItem("kcalDia", JSON.stringify(registros));
  atualizarTelaKcal();
}

/************************************
 * NOVO ALIMENTO (usuário)
 ************************************/
function salvarNovoAlimento() {
  const nome = document.getElementById("novoNome").value.trim();
  const kcal100 = Number(document.getElementById("novoKcal").value);

  if (!nome || !kcal100) {
    alert("Preencha todos os campos");
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("alimentosUsuario"));
  usuario.push({ nome, kcal100 });
  localStorage.setItem("alimentosUsuario", JSON.stringify(usuario));

  document.getElementById("novoNome").value = "";
  document.getElementById("novoKcal").value = "";

  carregarSelectAlimentos();
}

/************************************
 * GRÁFICO SIMPLES (canvas)
 ************************************/
function desenharGrafico() {
  const canvas = document.getElementById("graficoKcal");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const registros = JSON.parse(localStorage.getItem("kcalDia"));
  const porDia = {};

  registros.forEach(r => {
    porDia[r.data] = (porDia[r.data] || 0) + r.kcal;
  });

  const dias = Object.keys(porDia);
  const valores = Object.values(porDia);
  const max = Math.max(...valores, 1);

  const largura = canvas.width / dias.length;

  valores.forEach((v, i) => {
    const h = (v / max) * 180;
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(i * largura, 200 - h, largura - 10, h);
  });
}

/************************************
 * INIT GLOBAL
 ************************************/
document.addEventListener("DOMContentLoaded", () => {
  carregarRefeicoes();
  carregarSelectAlimentos();
  atualizarTelaKcal();

  const meta = localStorage.getItem("ultimaMeta");
  if (meta && document.getElementById("resultadoMeta")) {
    document.getElementById("resultadoMeta").innerText = meta;
  }
});
