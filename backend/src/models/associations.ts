import User from "./user.models";
import Notita from "./notitas.models";

User.hasMany(Notita, {
    foreignKey: "userId",
    as: "notitas"
})

Notita.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
})