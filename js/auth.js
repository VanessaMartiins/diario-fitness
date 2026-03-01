function entrar() {
  const nome = document.getElementById("usuario").value.trim();

  if (!nome) {
    alert("Digite um nome de usuário");
    return;
  }

  localStorage.setItem("usuarioLogado", nome);

  // volta para a home
  window.location.href = "../index.html";
}
