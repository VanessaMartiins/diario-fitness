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
