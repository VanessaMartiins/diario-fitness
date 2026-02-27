/************************************
 * AUTH / USUÁRIO
 ************************************/
function login() {
  const nome = document.getElementById("usuario").value.trim();
  if (!nome) return alert("Digite seu nome");

  localStorage.setItem("usuarioLogado", nome);

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
  if (!usuarios[nome]) {
    usuarios[nome] = {
      dias: {},
      alimentosUsuario: [],
      refeicoes: [],
      meta: ""
    };
  }

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  window.location.href = "controle.html";
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

function usuarioAtual() {
  return localStorage.getItem("usuarioLogado");
}

/************************************
 * DATA / STORAGE
 ************************************/
function hojeISO() {
  return new Date().toISOString().split("T")[0];
}

function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || {};
}

function salvarUsuarios(u) {
  localStorage.setItem("usuarios", JSON.stringify(u));
}

function getDiaAtual() {
  const u = usuarioAtual();
  const usuarios = getUsuarios();
  const hoje = hojeISO();

  if (!usuarios[u].dias[hoje]) {
    usuarios[u].dias[hoje] = {
      alimentos: [],
      totalKcal: 0
    };
    salvarUsuarios(usuarios);
  }

  return usuarios[u].dias[hoje];
}

/************************************
 * BASE DE ALIMENTOS
 ************************************/
const alimentosBase = [
  { nome: "Arroz branco", kcal100: 130 },
  { nome: "Feijão", kcal100: 77 },
  { nome: "Frango grelhado", kcal100: 165 },
  { nome: "Carne bovina", kcal100: 250 },
  { nome: "Ovo", kcal100: 155 },
  { nome: "Banana", kcal100: 89 },
  { nome: "Maçã", kcal100: 52 },
  { nome: "Batata doce", kcal100: 86 },
  { nome: "Aveia", kcal100: 389 },
  { nome: "Leite integral", kcal100: 61 }
];

/************************************
 * SELECT DE ALIMENTOS
 ************************************/
function carregarSelectAlimentos() {
  const select = document.getElementById("nomeAlimento");
  if (!select) return;

  select.innerHTML = `<option value="">Selecione</option>`;

  const usuarios = getUsuarios();
  const u = usuarioAtual();
  const lista = [...alimentosBase, ...usuarios[u].alimentosUsuario];

  lista.forEach((a, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = a.nome;
    select.appendChild(opt);
  });
}

/************************************
 * ADICIONAR ALIMENTO (DIA)
 ************************************/
function adicionarAlimento() {
  const index = document.getElementById("nomeAlimento").value;
  const gramas = Number(document.getElementById("gramas").value);

  if (index === "" || !gramas) {
    alert("Preencha os campos");
    return;
  }

  const usuarios = getUsuarios();
  const u = usuarioAtual();
  const alimentos = [...alimentosBase, ...usuarios[u].alimentosUsuario];
  const alimento = alimentos[index];

  const kcal = (gramas * alimento.kcal100) / 100;
  const dia = getDiaAtual();

  dia.alimentos.push({
    nome: alimento.nome,
    gramas,
    kcal
  });

  dia.totalKcal += kcal;
  salvarUsuarios(usuarios);

  atualizarTela();
}

/************************************
 * TELA / TOTAL
 ************************************/
function atualizarTela() {
  const dia = getDiaAtual();

  document.getElementById("totalKcal").innerText =
    dia.totalKcal.toFixed(0);

  const lista = document.getElementById("listaAlimentos");
  lista.innerHTML = "";

  dia.alimentos.forEach((a, i) => {
    lista.innerHTML += `
      <div class="item">
        <strong>${a.nome}</strong><br>
        ${a.gramas} g · ${a.kcal.toFixed(0)} kcal
        <span onclick="removerAlimento(${i})">❌</span>
      </div>
    `;
  });

  desenharGrafico();
}

function removerAlimento(i) {
  const usuarios = getUsuarios();
  const u = usuarioAtual();
  const hoje = hojeISO();

  const dia = usuarios[u].dias[hoje];
  dia.totalKcal -= dia.alimentos[i].kcal;
  dia.alimentos.splice(i, 1);

  salvarUsuarios(usuarios);
  atualizarTela();
}

function limparDia() {
  if (!confirm("Apagar tudo de hoje?")) return;

  const usuarios = getUsuarios();
  const u = usuarioAtual();
  usuarios[u].dias[hojeISO()] = {
    alimentos: [],
    totalKcal: 0
  };

  salvarUsuarios(usuarios);
  atualizarTela();
}

/************************************
 * NOVO ALIMENTO (USUÁRIO)
 ************************************/
function salvarNovoAlimento() {
  const nome = document.getElementById("novoNome").value.trim();
  const kcal100 = Number(document.getElementById("novoKcal").value);

  if (!nome || !kcal100) return alert("Preencha os campos");

  const usuarios = getUsuarios();
  usuarios[usuarioAtual()].alimentosUsuario.push({ nome, kcal100 });
  salvarUsuarios(usuarios);

  document.getElementById("novoNome").value = "";
  document.getElementById("novoKcal").value = "";

  carregarSelectAlimentos();
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

  if (isNaN(altura) || isNaN(peso)) return;

  const h = altura > 3 ? altura / 100 : altura;
  const imc = (peso / (h * h)).toFixed(1);

  document.getElementById("resultado").innerText =
    `IMC: ${imc}`;
}

/************************************
 * META SEMANAL
 ************************************/
function gerarMeta() {
  const peso = parseFloat(
    document.getElementById("pesoMeta").value.replace(",", ".")
  );

  if (isNaN(peso)) return;

  const texto =
    `Sugestão semanal: entre ${(peso - 0.5).toFixed(1)}kg e ${(peso - 0.25).toFixed(1)}kg`;

  const usuarios = getUsuarios();
  usuarios[usuarioAtual()].meta = texto;
  salvarUsuarios(usuarios);

  document.getElementById("resultadoMeta").innerText = texto;
}

/************************************
 * REFEIÇÕES
 ************************************/
function salvarRefeicao() {
  const foto = document.getElementById("foto");
  const texto = document.getElementById("comentario").value.trim();
  if (!foto.files[0] || !texto) return;

  const reader = new FileReader();
  reader.onload = () => {
    const usuarios = getUsuarios();
    usuarios[usuarioAtual()].refeicoes.unshift({
      id: Date.now(),
      img: reader.result,
      texto,
      data: new Date().toLocaleDateString("pt-BR")
    });

    salvarUsuarios(usuarios);
    carregarRefeicoes();
  };
  reader.readAsDataURL(foto.files[0]);
}

function carregarRefeicoes() {
  const lista = document.getElementById("listaRefeicoes");
  if (!lista) return;

  lista.innerHTML = "";
  const usuarios = getUsuarios();
  const refeicoes = usuarios[usuarioAtual()].refeicoes;

  refeicoes.forEach(r => {
    lista.innerHTML += `
      <div class="card">
        <img src="${r.img}">
        <p><strong>${r.data}</strong></p>
        <p>${r.texto}</p>
      </div>
    `;
  });
}

/************************************
 * GRÁFICO (por dia)
 ************************************/
function desenharGrafico() {
  const canvas = document.getElementById("graficoKcal");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dias = getUsuarios()[usuarioAtual()].dias;
  const datas = Object.keys(dias);
  const valores = datas.map(d => dias[d].totalKcal);
  const max = Math.max(...valores, 1);

  const largura = canvas.width / datas.length;

  valores.forEach((v, i) => {
    const h = (v / max) * 180;
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(i * largura, 200 - h, largura - 10, h);
  });
}

/************************************
 * INIT
 ************************************/
document.addEventListener("DOMContentLoaded", () => {
  if (!usuarioAtual()) return;

  carregarSelectAlimentos();
  atualizarTela();
  carregarRefeicoes();

  const meta = getUsuarios()[usuarioAtual()].meta;
  if (meta && document.getElementById("resultadoMeta")) {
    document.getElementById("resultadoMeta").innerText = meta;
  }
});

/************************************
 * CONTROLE DE VISUAL DO HOME
 ************************************/
document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "home") return;

  const usuario = localStorage.getItem("usuarioLogado");

  const areaLogin = document.getElementById("area-login");
  const areaUsuario = document.getElementById("area-usuario");

  if (usuario) {
    areaLogin.style.display = "none";
    areaUsuario.style.display = "block";
    document.getElementById("nomeUsuario").innerText = usuario;
  } else {
    areaLogin.style.display = "block";
    areaUsuario.style.display = "none";
  }
});
