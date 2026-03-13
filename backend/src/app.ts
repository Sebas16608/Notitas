import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Ruta principal
app.get("/", (req: Request, res: Response) => {
    res.json({
        mensaje: "Hola mi amor, bienvenida",
        endpoints: {
            notitas: "/notitas"
        }
    })
})

// Rutas
import NotitaRouter from "./routes/notita.router";
import UserRouter from "./routes/user.router";
app.use("/notitas", NotitaRouter)
app.use("/users", UserRouter)

export default app;