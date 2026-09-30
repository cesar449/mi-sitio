const form = document.getElementById('contacto');
const salida = document.getElementById('resultado');
const mensaje = document.getElementById('mensaje');
const contador = document.getElementById('contador');

mensaje.addEventListener('input', () => {
  contador.textContent = mensaje.value.length + '/300';
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  let valido = true;
  for (const campo of form.querySelectorAll('input, textarea')) {
    const ok = campo.checkValidity();
    campo.classList.toggle('invalido', !ok);
    if (!ok) valido = false;
  }
  if (!valido) {
    salida.className = 'error';
    salida.textContent = 'Revisa los campos marcados en rojo.';
    return;
  }
  const nombre = document.getElementById('nombre').value.trim();
  salida.className = 'ok';
  salida.textContent = 'Gracias, ' + nombre + '. Mensaje recibido.';
  form.reset();
  contador.textContent = '0/300';
});
