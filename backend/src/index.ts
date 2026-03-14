import app from "./app";
import sequelize from "./config/database";
import Notita from "./models/notitas.models";
import User from "./models/user.models";
import RefreshToken from "./models/refreshToken.models";
import "./models/associations";

const port = 3000;

(async() => {
    try {
        await sequelize.authenticate();
        console.log("DB establecida");

        await sequelize.sync({ alter: true });
        console.log("DB sincronizada")

        app.listen(port, () =>{
            console.log(`Servidor corriendo en http://localhost:${port}`);
        })
    } catch (error) {
        console.error(`Error al iniciar el servidor ${error}`);
        process.exit(1);
    }
})();