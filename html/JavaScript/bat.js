/* =================================
   ROSA UMBRA - BAT ANIMATION
================================= */

const bat = document.getElementById("rosa-bat");
const batImage = document.getElementById("bat-frame");

if (bat && batImage) {

    // fotogramas
    const frames = [
        "../assets/img/bat-sprite(1).png",
        "../assets/img/bat-sprite%20%282%29.png",
        "../assets/img/bat-sprite(3).png",
        "../assets/img/bat-sprite(4).png",
        "../assets/img/bat-sprite(5).png",
        "../assets/img/bat-sprite(6).png"
    ];

    // Precargar las imágenes
    frames.forEach(src => {
        const image = new Image();
        image.src = src;
    });

    let currentFrame = 0;
    let paused = false;

    // Velocidad de animación
    const speed = 120;

    // Cambiar fotogramas
    const animation = setInterval(() => {

        if (!paused) {

            currentFrame = (currentFrame + 1) % frames.length;

            batImage.src = frames[currentFrame];

        }

    }, speed);

    // Pausar o reanudar al hacer clic
    bat.addEventListener("click", () => {

        paused = !paused;

        bat.classList.toggle("paused", paused);

    });

    // También permite controlarlo con teclado
    bat.tabIndex = 0;
    bat.setAttribute("role", "button");
    bat.setAttribute("aria-label", "Pausar o reanudar murciélago");

    bat.addEventListener("keydown", event => {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();
            bat.click();

        }

    });

}
