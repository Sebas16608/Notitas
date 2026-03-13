import User from "./user.models";
import Notita from "./notitas.models";
import RefreshToken from "./refreshToken.models";

User.hasMany(Notita, {
    foreignKey: "userId",
    as: "notitas"
})

Notita.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
})

User.hasMany(RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens"
})

RefreshToken.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
})