
const mongoose = require("mongoose");

const solicitudSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },

        contacto: {
            type: String,
            required: true,
            trim: true
        },

        tipoSolicitud: {
            type: String,
            enum: ["catalogo", "personalizado"],
            required: true
        },

        producto: {
            type: String,
            default: ""
        },

        descripcion: {
            type: String,
            required: true,
            trim: true
        },

        colores: {
            type: String,
            default: ""
        },

        presupuesto: {
            type: String,
            default: ""
        },

        imagenReferencia: {
            type: String,
            default: ""
        },

        estado: {
            type: String,
            enum: [
                "Pendiente",
                "En revisión",
                "Contactado",
                "Aceptado",
                "Finalizado"
            ],
            default: "Pendiente"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Solicitud", solicitudSchema);
