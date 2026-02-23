function calcularIMC() {
  const altura = document.getElementById("altura").value;
  const peso = document.getElementById("peso").value;

  if (!altura || !peso) {
    alert("Preencha altura e peso");
    return;
  }

  const h = altura / 100;
  const imc = (peso / (h * h)).toFixed(1);

  let mensagem = "";

  if (imc < 18.5) {
    mensagem = "Abaixo da faixa considerada saudável.";
  } else if (imc < 25) {
    mensagem = "Dentro da faixa considerada saudável.";
  } else {
    mensagem = "Acima da faixa considerada saudável.";
  }

  document.getElementById("resultado").innerText =
    `IMC: ${imc} — ${mensagem}`;
}
