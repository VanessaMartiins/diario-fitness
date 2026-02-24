function calcularIMC() {
  let altura = document.getElementById("altura").value;
  let peso = document.getElementById("peso").value;

  // troca vírgula por ponto
  altura = altura.replace(",", ".");
  peso = peso.replace(",", ".");

  altura = parseFloat(altura);
  peso = parseFloat(peso);

  if (isNaN(altura) || isNaN(peso)) {
    alert("Digite valores numéricos válidos");
    return;
  }

  // se altura vier em cm
  const h = altura > 3 ? altura / 100 : altura;

  const imc = (peso / (h * h)).toFixed(1);

  let mensagem = "";
  if (imc < 18.5) mensagem = "Abaixo da faixa considerada saudável.";
  else if (imc < 25) mensagem = "Dentro da faixa considerada saudável.";
  else mensagem = "Acima da faixa considerada saudável.";

  document.getElementById("resultado").innerText =
    `IMC: ${imc} — ${mensagem}`;
}
function gerarMeta() {
  let peso = document.getElementById("pesoMeta").value.trim();
  peso = peso.replace(",", ".");
  peso = parseFloat(peso);

  if (isNaN(peso)) {
    document.getElementById("resultadoMeta").innerText =
      "⚠️ Digite um peso válido.";
    return;
    localStorage.setItem("ultimaMeta", resultado);
  }

  const min = (peso - 0.25).toFixed(1);
  const max = (peso - 0.5).toFixed(1);

  document.getElementById("resultadoMeta").innerText =
    `Sugestão de acompanhamento semanal:
     foco em hábitos saudáveis. 
     Caso haja mudança de peso, algo entre ${max} kg e ${min} kg pode ser esperado.`;
}

function salvarRefeicao() {
  const fotoInput = document.getElementById("foto");
  const comentario = document.getElementById("comentario").value;

  if (!fotoInput.files[0] || comentario.trim() === "") {
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

    let refeicoes = JSON.parse(localStorage.getItem("refeicoes")) || [];
    refeicoes.unshift(refeicao);
    localStorage.setItem("refeicoes", JSON.stringify(refeicoes));

    fotoInput.value = "";
    document.getElementById("comentario").value = "";

    carregarRefeicoes();
  };

  reader.readAsDataURL(fotoInput.files[0]);
}
const pagina = document.body.getAttribute("data-page");

document.querySelectorAll(".menu a").forEach(link => {
  if (link.dataset.page === pagina) {
    link.classList.add("ativo");
  }
  window.onload = function () {
  const metaSalva = localStorage.getItem("ultimaMeta");
  if (metaSalva) {
    document.getElementById("resultadoMeta").innerText =
      "Última meta salva: " + metaSalva;
  }
};
});
