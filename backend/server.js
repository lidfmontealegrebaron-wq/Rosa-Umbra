
const express = require("express");
const cors = require("cors");

require("dotenv").config({ path: __dirname + "/.env" });

const connectDB = require("./config/database");
const solicitudesRoutes = require("./routes/solicitudes");
const app = express();
const authRoutes = require("./routes/auth");

// Configuración
app.use(cors());
app.use(express.json());
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/auth", authRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.send("Servidor de Rosa Umbra funcionando correctamente 🖤");
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Iniciar servidor y conectar MongoDB
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Servidor activo en http://localhost:${PORT}`);
    });
};

startServer();
