import app from "./app";

const port = 3000;

try {
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    })
} catch (error) {
    console.log(`Error en el servidor ${error}`);
}