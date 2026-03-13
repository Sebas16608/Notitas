import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.get("/", (req: Request, res: Response) => {
    res.json({
        mensaje: "Hola mi amor, bienvenida",
    })
})

export default app;