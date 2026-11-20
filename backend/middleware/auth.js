const jwt = require("jsonwebtoken");

const verificarAdmin = (req, res, next) => {
    const encabezado = req.headers.authorization;

    if (!encabezado || !encabezado.startsWith("Bearer ")) {
        return res.status(401).json({
            mensaje: "Debes iniciar sesión para acceder."
        });
    }

    const token = encabezado.split(" ")[1];

    try {
        const usuario = jwt.verify(token, process.env.JWT_SECRET);

        if (usuario.role !== "admin") {
            return res.status(403).json({
                mensaje: "No tienes permiso para acceder."
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: "Tu sesión no es válida o ha expirado."
        });
    }
};

module.exports = verificarAdmin;