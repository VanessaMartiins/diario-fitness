document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");

  btnLogin.addEventListener("click", () => {
    const nome = document.getElementById("usuario").value.trim();

    if (!nome) {
      alert("Digite um nome");
      return;
    }

    localStorage.setItem("usuarioLogado", nome);
    window.location.href = "../index.html";
  });
});
