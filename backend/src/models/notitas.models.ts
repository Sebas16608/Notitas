import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Notita extends Model{
    declare id? : number;
    declare title: string;
    declare content: string;
    declare userId: number;
}

Notita.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            len: [1,255]
        },
    },

    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
},
{
    sequelize,
    modelName: "Notita",
    tableName: "Notitas",
}
);

export default Notita;