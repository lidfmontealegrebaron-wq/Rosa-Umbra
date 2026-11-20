
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Solicitud = require("../models/solicitud");
const verificarAdmin = require("../middleware/auth");

// Registrar una nueva solicitud
router.post("/", async (req, res) => {
    try {
        const {
            nombre,
            contacto,
            tipoSolicitud,
            producto,
            descripcion,
            colores,
            presupuesto,
            imagenReferencia
        } = req.body;

        if (!nombre || !contacto || !tipoSolicitud || !descripcion) {
            return res.status(400).json({
                mensaje: "Completa todos los campos obligatorios."
            });
        }

        const nuevaSolicitud = new Solicitud({
            nombre,
            contacto,
            tipoSolicitud,
            producto,
            descripcion,
            colores,
            presupuesto,
            imagenReferencia
        });

        await nuevaSolicitud.save();

        res.status(201).json({
            mensaje: "Solicitud recibida correctamente 🖤",
            solicitud: nuevaSolicitud
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al guardar la solicitud."
        });
    }
});

// Consultar solicitudes
router.get("/", verificarAdmin, async (req, res) => {
    try {
        const solicitudes = await Solicitud.find().sort({ createdAt: -1 });

        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al consultar las solicitudes."
        });
    }
});

// ACTUALIZAR ESTADO DE UNA SOLICITUD
router.patch("/:id/estado", verificarAdmin, async (req, res) => {
    try {
        const { estado } = req.body;

        const estadosPermitidos = [
            "Pendiente",
            "En revisión",
            "Contactado",
            "Aceptado",
            "Finalizado"
        ];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                mensaje: "El estado seleccionado no es válido."
            });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                mensaje: "Identificador de solicitud no válido."
            });
        }

        const solicitud = await Solicitud.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true, runValidators: true }
        );

        if (!solicitud) {
            return res.status(404).json({
                mensaje: "No se encontró la solicitud."
            });
        }

        res.json({
            mensaje: "Estado actualizado correctamente.",
            solicitud
        });

    } catch (error) {
        console.error("Error actualizando solicitud:", error);

        res.status(500).json({
            mensaje: "No fue posible actualizar el estado."
        });
    }
});

module.exports = router;
