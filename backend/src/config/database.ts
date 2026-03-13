import { Sequelize } from "sequelize";
import path from "node:path";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "db.sqlite3"),
    logging: false,
});

export default sequelize;