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

  const msg =
    imc < 18.5 ? "Abaixo da faixa considerada saudável." :
    imc < 25 ? "Dentro da faixa considerada saudável." :
    "Acima da faixa considerada saudável.";

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
Caso haja mudança, algo entre ${max} kg e ${min} kg.`;

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

/************************************
 * CONTROLE CALÓRICO DIÁRIO
 ************************************/
function carregarSelectAlimentos() {
  const select = document.getElementById("nomeAlimento");
  if (!select) return;

  select.innerHTML = `<option value="">Selecione o alimento</option>`;

  const base = JSON.parse(localStorage.getItem("alimentosBase"));
  const usuario = JSON.parse(localStorage.getItem("alimentosUsuario"));

  [...base, ...usuario].forEach((item, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = item.nome;
    select.appendChild(opt);
  });
}

function adicionarAlimento() {
  const index = document.getElementById("nomeAlimento").value;
  const gramas = Number(document.getElementById("gramas").value);

  if (index === "" || !gramas) {
    alert("Preencha todos os campos");
    return;
  }

  const base = JSON.parse(localStorage.getItem("alimentosBase"));
  const usuario = JSON.parse(localStorage.getItem("alimentosUsuario"));
  const alimentos = [...base, ...usuario];

  const alimento = alimentos[index];
  const kcal = (gramas * alimento.kcal100) / 100;

  const registros = JSON.parse(localStorage.getItem("kcalDia"));
  registros.push({ nome: alimento.nome, gramas, kcal });

  localStorage.setItem("kcalDia", JSON.stringify(registros));
  atualizarTelaKcal();
}

function atualizarTelaKcal() {
  const lista = document.getElementById("listaKcal");
  const totalEl = document.getElementById("totalKcal");
  if (!lista || !totalEl) return;

  lista.innerHTML = "";
  let total = 0;

  const registros = JSON.parse(localStorage.getItem("kcalDia"));

  registros.forEach((item, i) => {
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
}

function removerAlimento(i) {
  const registros = JSON.parse(localStorage.getItem("kcalDia"));
  registros.splice(i, 1);
  localStorage.setItem("kcalDia", JSON.stringify(registros));
  atualizarTelaKcal();
}

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
