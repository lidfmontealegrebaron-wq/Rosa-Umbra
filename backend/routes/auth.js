const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({
                mensaje: "Completa el usuario y la contraseña."
            });
        }

        if (
            usuario !== process.env.ADMIN_USER ||
            !process.env.ADMIN_PASSWORD_HASH
        ) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas."
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            process.env.ADMIN_PASSWORD_HASH
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas."
            });
        }

        const token = jwt.sign(
            {
                role: "admin",
                username: usuario
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            mensaje: "Inicio de sesión correcto.",
            token
        });

    } catch (error) {
        console.error("Error de inicio de sesión:", error);

        res.status(500).json({
            mensaje: "Error al iniciar sesión."
        });
    }
});

module.exports = router;