document.addEventListener("DOMContentLoaded", () => {
  const asignaturas = document.querySelectorAll(".asignatura");

  asignaturas.forEach(asig => {
    asig.addEventListener("click", () => {
      if (asig.classList.contains("aprobada")) return;

      const requisitos = asig.dataset.req ? asig.dataset.req.split(" ") : [];
      const cumplidos = requisitos.every(req =>
        document.querySelector(`[data-id="${req}"]`)?.classList.contains("aprobada")
      );

      if (cumplidos) {
        asig.classList.add("aprobada");
      } else if (requisitos.length > 0) {
        alert("Debes aprobar antes: " + requisitos.join(", "));
      } else {
        asig.classList.add("aprobada");
      }
    });
  });
});
