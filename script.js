// Malla interactiva — guarda estado en localStorage, desbloquea por prereqs
const STORAGE_KEY = 'malla_medvet_udalba_v1';

// Helpers
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

// Al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  const estado = loadEstado();
  const botones = qsa('.asig');

  // Aplicar estado guardado
  botones.forEach(btn => {
    const id = btn.dataset.id;
    if (estado.completed && estado.completed.includes(id)) {
      btn.classList.add('completed');
      btn.removeAttribute('disabled');
      btn.classList.remove('locked');
    }
  });

  // Actualizar desbloqueos iniciales
  actualizarDesbloqueos();

  // Clic en asignatura
  botones.forEach(btn => {
    btn.addEventListener('click', () => onClickAsignatura(btn));
  });

  // Reiniciar malla
  qs('#resetBtn').addEventListener('click', () => {
    if (confirm('¿Seguro que quieres reiniciar la malla y borrar aprobadas?')) {
      localStorage.removeItem(STORAGE_KEY);
      qsa('.asig').forEach(b => {
        b.classList.remove('completed', 'locked');
        b.removeAttribute('disabled');
      });
      actualizarDesbloqueos();
    }
  });
});

// Cuando se hace clic en una asignatura
function onClickAsignatura(btn) {
  if (btn.classList.contains('locked')) return; // bloqueado

  const id = btn.dataset.id;
  const estado = loadEstado();
  estado.completed = estado.completed || [];

  // Alternar estado (aprobado/no aprobado)
  if (btn.classList.contains('completed')) {
    btn.classList.remove('completed');
    const idx = estado.completed.indexOf(id);
    if (idx > -1) estado.completed.splice(idx, 1);
  } else {
    btn.classList.add('completed');
    if (!estado.completed.includes(id)) estado.completed.push(id);
  }

  saveEstado(estado);
  actualizarDesbloqueos();
}

// Actualiza qué asignaturas se desbloquean según prerequisitos
function actualizarDesbloqueos() {
  const botones = qsa('.asig');
  const estado = loadEstado();
  const completed = new Set(estado.completed || []);

  botones.forEach(btn => {
    const prereqRaw = btn.dataset.prereq || '';
    const prereqs = prereqRaw.split(',').map(s => s.trim()).filter(Boolean);

    if (prereqs.length === 0) {
      // Sin prerequisitos
      btn.classList.remove('locked');
      btn.removeAttribute('disabled');
      return;
    }

    // Verificar si todos los prerequisitos están aprobados
    const ok = prereqs.every(p => completed.has(p));
    if (ok) {
      btn.classList.remove('locked');
      btn.removeAttribute('disabled');
    } else {
      if (!btn.classList.contains('completed')) {
        btn.classList.add('locked');
        btn.setAttribute('disabled', 'true');
      }
    }
  });
}

// Guardar y cargar estado desde localStorage
function loadEstado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { completed: [] };
  } catch (e) {
    return { completed: [] };
  }
}

function saveEstado(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {}
}
