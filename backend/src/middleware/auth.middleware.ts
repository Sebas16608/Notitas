import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret_2024";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_2024";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido o expirado" });
        }
        req.user = decoded as { id: number; email: string };
        next();
    });
};

export const generateAccessToken = (user: { id: number; email: string }): string => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (user: { id: number; email: string }): string => {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "1y" });
};

export const verifyRefreshToken = (token: string): jwt.JwtPayload | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
    } catch {
        return null;
    }
};
