
// ===================================
// FORMULARIO DE SOLICITUDES - ROSA UMBRA
// ===================================

// Dirección del servidor local.
// Cuando publiquemos el backend, cambiaremos esta dirección.
const API_URL = "https://rosa-umbra-backend.onrender.com/api/solicitudes";

const botonAbrir = document.getElementById("abrir-formulario");
const botonCerrar = document.getElementById("cerrar-formulario");
const contenedorFormulario = document.getElementById("contenedor-formulario");
const formulario = document.getElementById("solicitud-form");
const botonEnviar = document.getElementById("btn-enviar");
const mensaje = document.getElementById("mensaje-solicitud");

// Desplegar formulario
botonAbrir.addEventListener("click", () => {
    contenedorFormulario.hidden = false;
    botonAbrir.setAttribute("aria-expanded", "true");

    contenedorFormulario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Cerrar formulario
botonCerrar.addEventListener("click", () => {
    contenedorFormulario.hidden = true;
    botonAbrir.setAttribute("aria-expanded", "false");

    botonAbrir.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

// Enviar solicitud al backend
formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    mensaje.textContent = "";
    mensaje.className = "mensaje-solicitud";

    const datosFormulario = new FormData(formulario);

    const solicitud = {
        nombre: datosFormulario.get("nombre").trim(),
        contacto: datosFormulario.get("contacto").trim(),
        tipoSolicitud: datosFormulario.get("tipoSolicitud"),
        producto: datosFormulario.get("producto").trim(),
        descripcion: datosFormulario.get("descripcion").trim(),
        colores: datosFormulario.get("colores").trim(),
        presupuesto: datosFormulario.get("presupuesto").trim()
    };

    botonEnviar.disabled = true;
    botonEnviar.textContent = "Enviando...";

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(solicitud)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || "No fue posible enviar la solicitud."
            );
        }

        mensaje.textContent =
            "¡Tu solicitud llegó correctamente! Pronto nos pondremos en contacto contigo. 🖤";

        mensaje.classList.add("exito");

        formulario.reset();

    } catch (error) {
        console.error("Error al enviar la solicitud:", error);

        mensaje.textContent =
            "No pudimos enviar tu solicitud. Inténtalo nuevamente en unos momentos.";

        mensaje.classList.add("error");

    } finally {
        botonEnviar.disabled = false;
        botonEnviar.textContent = "Enviar solicitud";
    }
});
