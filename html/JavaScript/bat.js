/* =================================
   ROSA UMBRA - BAT + CHAT
================================= */

(() => {
    const bat = document.getElementById("rosa-bat");
    const batImage = document.getElementById("bat-frame");

    if (!bat || !batImage) return;

    const chat = document.getElementById("umbra-chat");
    const cerrarChat = document.getElementById("cerrar-chat");
    const mensajes = document.getElementById("umbra-mensajes");
    const formularioChat = document.getElementById("umbra-formulario");
    const entrada = document.getElementById("umbra-entrada");

    const frames = [
        "../assets/img/bat-sprite(1).png",
        "../assets/img/bat-sprite%20%282%29.png",
        "../assets/img/bat-sprite(3).png",
        "../assets/img/bat-sprite(4).png",
        "../assets/img/bat-sprite(5).png",
        "../assets/img/bat-sprite(6).png"
    ];

    frames.forEach(src => {
        const image = new Image();
        image.src = src;
    });

    let currentFrame = 0;
    let paused = false;

    setInterval(() => {
        if (!paused) {
            currentFrame = (currentFrame + 1) % frames.length;
            batImage.src = frames[currentFrame];
        }
    }, 120);

    function alternarChat() {
        if (!chat) return;

        const abrir = chat.hidden;
        chat.hidden = !abrir;
        paused = abrir;

        bat.classList.toggle("paused", abrir);
        bat.setAttribute("aria-expanded", String(abrir));

        if (abrir && entrada) {
            entrada.focus();
        }
    }

    function cerrarVentanaChat() {
        if (!chat) return;

        chat.hidden = true;
        paused = false;
        bat.classList.remove("paused");
        bat.setAttribute("aria-expanded", "false");
    }

    bat.addEventListener("click", alternarChat);

    if (cerrarChat) {
        cerrarChat.addEventListener("click", cerrarVentanaChat);
    }

    bat.tabIndex = 0;
    bat.setAttribute("role", "button");
    bat.setAttribute("aria-label", "Abrir o cerrar el chat de Umbra");
    bat.setAttribute("aria-expanded", "false");

    bat.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            bat.click();
        }
    });

    function agregarMensaje(texto, tipo) {
        if (!mensajes) return;

        const mensaje = document.createElement("div");
        mensaje.classList.add("mensaje", tipo);
        mensaje.textContent = texto;
        mensajes.appendChild(mensaje);
        mensajes.scrollTop = mensajes.scrollHeight;
    }

    function abrirFormularioPersonalizado() {
        const seccion = document.getElementById("personalizados");
        const boton = document.getElementById("abrir-formulario");

        if (!seccion || !boton) return;

        seccion.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => boton.click(), 500);
    }

    function responder(pregunta) {
        const respuestas = {
            catalogo:
                "🌹 Puedes descubrir nuestras flores eternas y creaciones en el catálogo de Rosa Umbra.",
            personalizado:
                "🖤 ¡Me encanta la idea! Puedes diseñar una creación especial desde nuestra sección de Personalizados.",
            pedido:
                "📦 Para consultar el estado de tu pedido, puedes comunicarte con Rosa Umbra desde la sección de Contacto.",
            contacto:
                "💌 Puedes encontrarnos en la sección de Contacto de nuestra página. ¡Estaremos encantados de atenderte!"
        };

        if (!Object.prototype.hasOwnProperty.call(respuestas, pregunta)) return;

        agregarMensaje(respuestas[pregunta], "mensaje-umbra");

        if (pregunta === "personalizado") {
            abrirFormularioPersonalizado();
        }
    }

    document.querySelectorAll("[data-pregunta]").forEach(boton => {
        boton.addEventListener("click", () => {
            agregarMensaje(boton.textContent.trim(), "mensaje-usuario");
            responder(boton.dataset.pregunta);

            const opciones = boton.closest(".umbra-opciones");
            if (opciones) {
                opciones.hidden = true;
            }
        });
    });

    if (formularioChat && entrada) {
        formularioChat.addEventListener("submit", event => {
            event.preventDefault();

            const pregunta = entrada.value.trim();
            if (!pregunta) return;

            agregarMensaje(pregunta, "mensaje-usuario");

            const texto = pregunta
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
            let respuesta =
                "🦇 Todavía estoy aprendiendo. Puedes elegir una de las opciones que aparecen arriba para ayudarte mejor.";

            // RESPUESTA A AGRADECIMIENTOS
            if (
                texto.includes("gracias") ||
                texto.includes("muchas gracias") ||
                texto.includes("te agradezco")
            ) {
                respuesta =
                    "¡De nada! 🖤 Siempre será un placer ayudarte. Aquí estaré cuando quieras descubrir algo más de Rosa Umbra.";
            }

            if (
                !texto.includes("gracias") &&
                !texto.includes("muchas gracias") &&
                !texto.includes("te agradezco")
            ) {
                if (
                    texto === "hola" ||
                    texto.includes("buenos dias") ||
                    texto.includes("buenas tardes") ||
                    texto.includes("buenas noches")
                ) {
                    respuesta =
                        "¡Hola! 🦇 Qué alegría tenerte en Rosa Umbra. ¿Buscas una flor especial o quieres conocer nuestras creaciones?";
                } else if (
                    // MOSTRAR EL CATALOGO
                    texto.includes("catalogo") ||
                    texto.includes("muestrame los productos") ||
                    texto.includes("quiero ver las flores") ||
                    texto.includes("ver productos")
                ) {
                    respuesta =
                        "🌹 ¡Por supuesto! Te invito a descubrir nuestro catálogo de flores eternas. Cada creación tiene su propia magia. 🖤";
                } else if (
                    // PREGUNTAS SOBRE LA UBICACION
                    texto.includes("donde estan") ||
                    texto.includes("donde se ubican") ||
                    texto.includes("donde estan ubicados") ||
                    texto.includes("ubicacion") ||
                    texto.includes("direccion") ||
                    texto.includes("donde queda") ||
                    texto.includes("donde puedo encontrarlos") ||
                    texto.includes("tienen tienda fisica")
                ) {
                    respuesta =
                        "🦇 ¡Qué alegría que quieras encontrarnos! 🖤 Puedes visitar nuestra sección de Contacto para conocer nuestros canales de atención y consultar cómo realizar tu pedido. Si deseas conocer nuestra ubicación física, puedes escribirnos directamente para recibir información.";
                } else if (
                    texto.includes("personal") ||
                    texto.includes("diseno") ||
                    texto.includes("crear")
                ) {
                    respuesta =
                        "🖤 Puedes crear una flor especial en nuestra sección de Personalizados.";
                } else if (
                    texto.includes("pedido") ||
                    texto.includes("solicitud") ||
                    texto.includes("estado")
                ) {
                    respuesta =
                        "📦 Para consultar tu pedido, comunícate con nosotros desde la sección de Contacto.";
                } else if (
                    texto.includes("contacto") ||
                    texto.includes("hablar") ||
                    texto.includes("comunicar")
                ) {
                    respuesta =
                        "💌 Visita nuestra sección de Contacto para comunicarte con Rosa Umbra.";
                }
            }

            agregarMensaje(respuesta, "mensaje-umbra");
            entrada.value = "";
        });
    }
})();
