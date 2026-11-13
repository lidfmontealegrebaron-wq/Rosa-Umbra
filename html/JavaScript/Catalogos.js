// LÓGICA: toma los datos de productos.js y dibuja las tarjetas en la página.

// 1. Convierte 180000 en "$180.000 COP"
function formatearPrecio(valor) {
  return '$' + valor.toLocaleString('es-CO') + ' COP';
}

// 2. Construye una tarjeta (un <article>) para un producto
function crearTarjeta(producto) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'producto';
  tarjeta.innerHTML = `
    <svg class="icono-rosa" style="color: var(--oro-antiguo);"><use href="#rosa"/></svg>
    <h3>${producto.nombre}</h3>
    <span class="precio">${formatearPrecio(producto.precio)}</span>
    <p>${producto.descripcion}</p>
    <a href="#contacto">Consultar</a>
  `;
  return tarjeta;
}

// 3. Vacía el contenedor y dibuja todas las tarjetas de la lista
function mostrarCatalogo(lista) {
  const contenedor = document.getElementById('grid-productos');
  contenedor.innerHTML = '';
  lista.forEach(function (producto) {
    contenedor.appendChild(crearTarjeta(producto));
  });
}

// 4. Al cargar la página, mostrar todos los productos
mostrarCatalogo(productos);