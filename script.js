document.addEventListener("DOMContentLoaded", () => {
  const asignaturas = document.querySelectorAll(".asig");
  const resetBtn = document.getElementById("resetBtn");
  const aprobadas = JSON.parse(localStorage.getItem("aprobadas")) || [];

  // Cargar asignaturas guardadas
  asignaturas.forEach(asig => {
    const id = asig.dataset.id;
    if (aprobadas.includes(id)) {
      asig.classList.add("aprobada");
    }
  });

  actualizarBloqueos();

  // Clic para aprobar
  asignaturas.forEach(asig => {
    asig.addEventListener("click", () => {
      if (asig.classList.contains("bloqueada")) return;

      const id = asig.dataset.id;
      asig.classList.toggle("aprobada");

      if (asig.classList.contains("aprobada")) {
        aprobadas.push(id);
      } else {
        const index = aprobadas.indexOf(id);
        if (index > -1) aprobadas.splice(index, 1);
      }

      localStorage.setItem("aprobadas", JSON.stringify(aprobadas));
      actualizarBloqueos();
    });
  });

  // Botón para reiniciar progreso
  resetBtn.addEventListener("click", () => {
    localStorage.removeItem("aprobadas");
    asignaturas.forEach(a => a.classList.remove("aprobada", "bloqueada"));
    actualizarBloqueos();
  });

  function actualizarBloqueos() {
    asignaturas.forEach(asig => {
      const prereq = asig.dataset.prereq;
      if (!prereq) {
        asig.classList.remove("bloqueada");
        return;
      }

      const requisitos = prereq.split(",");
      const cumplidos = requisitos.every(r => aprobadas.includes(r.trim()));

      if (cumplidos) {
        asig.classList.remove("bloqueada");
      } else {
        asig.classList.add("bloqueada");
      }
    });
  }
});
