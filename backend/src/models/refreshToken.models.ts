import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class RefreshToken extends Model {
    declare id: number;
    declare userId: number;
    declare token: string;
    declare expiresAt: Date;
};

RefreshToken.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "RefreshToken",
    tableName: "RefreshTokens",
    timestamps: true
});

export default RefreshToken;
