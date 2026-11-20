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
    <img class="imagen-producto" src="${producto.imagen}" alt="${producto.nombre}">
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

const carrusel = document.querySelector('.catalogo-carrusel');
const carruselProductos = document.getElementById('grid-productos');
const estadoCarrusel = document.getElementById('estado-carrusel');
let indiceProducto = 0;

function actualizarCarrusel() {
  const tarjetas = carruselProductos.children;
  const cantidad = tarjetas.length;

  carruselProductos.style.transform = `translateX(-${indiceProducto * 100}%)`;
  estadoCarrusel.textContent = `${indiceProducto + 1} de ${cantidad}`;

  Array.from(tarjetas).forEach(function (tarjeta, indice) {
    const activo = indice === indiceProducto;
    tarjeta.setAttribute('aria-hidden', String(!activo));
    tarjeta.querySelector('a').tabIndex = activo ? 0 : -1;
  });
}

carrusel.querySelector('.anterior').addEventListener('click', function () {
  indiceProducto = (indiceProducto - 1 + productos.length) % productos.length;
  actualizarCarrusel();
});

carrusel.querySelector('.siguiente').addEventListener('click', function () {
  indiceProducto = (indiceProducto + 1) % productos.length;
  actualizarCarrusel();
});

actualizarCarrusel();