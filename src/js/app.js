document.getElementById('contacto').addEventListener('submit', function (e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const salida = document.getElementById('resultado');
  salida.textContent = 'Gracias, ' + nombre + '. Mensaje recibido.';
});
