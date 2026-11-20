
// =====================================
// ROSA UMBRA - PANEL ADMINISTRATIVO
// =====================================

const API_URL = "http://localhost:3000/api";

const formularioLogin = document.getElementById("login-form");
const loginPanel = document.getElementById("login-panel");
const dashboard = document.getElementById("dashboard");

const mensajeLogin = document.getElementById("login-mensaje");
const mensajeDashboard = document.getElementById("dashboard-mensaje");

const botonLogin = document.getElementById("btn-login");
const botonLogout = document.getElementById("btn-logout");

const listaSolicitudes = document.getElementById("lista-solicitudes");
const filtroEstado = document.getElementById("filtro-estado");

const totalSolicitudes = document.getElementById("total-solicitudes");
const totalPendientes = document.getElementById("total-pendientes");
const totalRevision = document.getElementById("total-revision");
const totalFinalizadas = document.getElementById("total-finalizadas");

let solicitudes = [];

const tokenGuardado = () => sessionStorage.getItem("rosaUmbraToken");

// Evita interpretar los datos de los clientes como HTML.
function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);
}

// =====================================
// INICIAR SESIÓN
// =====================================

formularioLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    mensajeLogin.textContent = "";

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value;

    botonLogin.disabled = true;
    botonLogin.textContent = "Verificando...";

    try {
        const respuesta = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario, password })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "No se pudo iniciar sesión.");
        }

        sessionStorage.setItem("rosaUmbraToken", resultado.token);

        formularioLogin.reset();

        await mostrarDashboard();

    } catch (error) {
        mensajeLogin.textContent = error.message;

    } finally {
        botonLogin.disabled = false;
        botonLogin.textContent = "Entrar al jardín";
    }
});

// =====================================
// MOSTRAR PANEL
// =====================================

async function mostrarDashboard() {
    loginPanel.hidden = true;
    dashboard.hidden = false;

    await cargarSolicitudes();
}

// =====================================
// CARGAR SOLICITUDES
// =====================================

async function cargarSolicitudes() {
    listaSolicitudes.innerHTML =
        '<p class="mensaje-vacio">Cargando solicitudes...</p>';

    mensajeDashboard.textContent = "";
    mensajeDashboard.className = "";

    try {
        const respuesta = await fetch(`${API_URL}/solicitudes`, {
            headers: {
                "Authorization": `Bearer ${tokenGuardado()}`
            }
        });

        if (respuesta.status === 401 || respuesta.status === 403) {
            cerrarSesion();
            throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.");
        }

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "Error al consultar solicitudes.");
        }

        solicitudes = resultado;

        actualizarResumen();
        mostrarSolicitudes();

    } catch (error) {
        listaSolicitudes.innerHTML =
            '<p class="mensaje-vacio">No se pudieron cargar las solicitudes.</p>';

        mensajeDashboard.textContent = error.message;
        mensajeDashboard.classList.add("error");
    }
}

// =====================================
// ACTUALIZAR RESUMEN
// =====================================

function actualizarResumen() {
    totalSolicitudes.textContent = solicitudes.length;

    totalPendientes.textContent =
        solicitudes.filter(s => s.estado === "Pendiente").length;

    totalRevision.textContent =
        solicitudes.filter(s => s.estado === "En revisión").length;

    totalFinalizadas.textContent =
        solicitudes.filter(s => s.estado === "Finalizado").length;
}

// =====================================
// MOSTRAR TARJETAS
// =====================================

function mostrarSolicitudes() {
    const filtro = filtroEstado.value;

    const filtradas = solicitudes.filter(solicitud => {
        return filtro === "Todas" || solicitud.estado === filtro;
    });

    if (filtradas.length === 0) {
        listaSolicitudes.innerHTML =
            '<p class="mensaje-vacio">No hay solicitudes en esta categoría.</p>';
        return;
    }

    listaSolicitudes.innerHTML = filtradas.map(solicitud => {
        const fecha = solicitud.createdAt
            ? new Date(solicitud.createdAt).toLocaleString("es-CO")
            : "Fecha no disponible";

        const estados = [
            "Pendiente",
            "En revisión",
            "Contactado",
            "Aceptado",
            "Finalizado"
        ];

        const opciones = estados.map(estado => `
            <option value="${estado}"
                ${solicitud.estado === estado ? "selected" : ""}>
                ${estado}
            </option>
        `).join("");

        return `
            <article class="solicitud-card">

                <div class="solicitud-cabecera">
                    <div>
                        <h3>${escaparHTML(solicitud.nombre)}</h3>
                        <p class="solicitud-fecha">${escaparHTML(fecha)}</p>
                        <p class="solicitud-tipo">
                            ${escaparHTML(
                                solicitud.tipoSolicitud === "personalizado"
                                    ? "Diseño personalizado"
                                    : "Producto del catálogo"
                            )}
                        </p>
                    </div>
                </div>

                <div class="solicitud-detalles">

                    <p><strong>Contacto:</strong>
                        ${escaparHTML(solicitud.contacto)}</p>

                    <p><strong>Producto:</strong>
                        ${escaparHTML(solicitud.producto || "No especificado")}</p>

                    <p><strong>Descripción:</strong>
                        ${escaparHTML(solicitud.descripcion)}</p>

                    <p><strong>Colores:</strong>
                        ${escaparHTML(solicitud.colores || "No especificados")}</p>

                    <p><strong>Presupuesto:</strong>
                        ${escaparHTML(solicitud.presupuesto || "No especificado")}</p>

                </div>

                <div class="solicitud-estado">
                    <label for="estado-${escaparHTML(solicitud._id)}">
                        Estado del pedido:
                    </label>

                    <select
                        class="estado-select"
                        id="estado-${escaparHTML(solicitud._id)}"
                        data-id="${escaparHTML(solicitud._id)}"
                    >
                        ${opciones}
                    </select>
                </div>

            </article>
        `;
    }).join("");
}

// =====================================
// FILTRAR SOLICITUDES
// =====================================

filtroEstado.addEventListener("change", mostrarSolicitudes);

// =====================================
// CAMBIAR ESTADO DE UN PEDIDO
// =====================================

listaSolicitudes.addEventListener("change", async (event) => {
    if (!event.target.matches(".estado-select")) return;

    const selector = event.target;
    const id = selector.dataset.id;
    const nuevoEstado = selector.value;

    selector.disabled = true;
    mensajeDashboard.textContent = "Actualizando estado...";

    try {
        const respuesta = await fetch(
            `${API_URL}/solicitudes/${encodeURIComponent(id)}/estado`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenGuardado()}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            }
        );

        const resultado = await respuesta.json();

        if (respuesta.status === 401 || respuesta.status === 403) {
            cerrarSesion();
            throw new Error("Tu sesión ha expirado.");
        }

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "No se pudo actualizar el estado.");
        }

        const indice = solicitudes.findIndex(s => s._id === id);

        if (indice !== -1) {
            solicitudes[indice] = resultado.solicitud;
        }

        actualizarResumen();
        mostrarSolicitudes();

        mensajeDashboard.textContent =
            "Estado actualizado correctamente 🖤";

    } catch (error) {
        mensajeDashboard.textContent = error.message;
        mensajeDashboard.classList.add("error");

        await cargarSolicitudes();

    } finally {
        selector.disabled = false;
    }
});

// =====================================
// CERRAR SESIÓN
// =====================================

function cerrarSesion() {
    sessionStorage.removeItem("rosaUmbraToken");

    solicitudes = [];

    dashboard.hidden = true;
    loginPanel.hidden = false;

    mensajeLogin.textContent = "";
    mensajeDashboard.textContent = "";
}

botonLogout.addEventListener("click", cerrarSesion);

// =====================================
// COMPROBAR SESIÓN AL ABRIR LA PÁGINA
// =====================================

async function comprobarSesion() {
    if (tokenGuardado()) {
        await mostrarDashboard();
    } else {
        dashboard.hidden = true;
        loginPanel.hidden = false;
    }
}

comprobarSesion();
