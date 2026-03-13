import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.models";
import RefreshToken from "../models/refreshToken.models";
import { registerSchema, loginSchema, RegisterInput, LoginInput } from "../validations/user.validation";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, AuthRequest } from "../middleware/auth.middleware";

export const register = async (req: Request, res: Response) => {
    try {
        const validation = registerSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({
                error: "Datos inválidos",
                details: validation.error.issues
            });
        }

        const { name, email, password }: RegisterInput = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "El correo electrónico ya está registrado" });
        }

        const user = await User.create({ name, email, password });

        const accessToken = generateAccessToken({ id: user.id!, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id!, email: user.email });

        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        await RefreshToken.create({
            userId: user.id!,
            token: refreshToken,
            expiresAt
        });

        res.status(201).json({
            message: "Usuario creado exitosamente",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Error en register:", error);
        res.status(500).json({ error: "Error al crear el usuario" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({
                error: "Datos inválidos",
                details: validation.error.issues
            });
        }

        const { email, password }: LoginInput = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const accessToken = generateAccessToken({ id: user.id!, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id!, email: user.email });

        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        await RefreshToken.create({
            userId: user.id!,
            token: refreshToken,
            expiresAt
        });

        res.json({
            message: "Login exitoso",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(400).json({ error: "Refresh token no proporcionado" });
        }

        const storedToken = await RefreshToken.findOne({ where: { token } });
        if (!storedToken) {
            return res.status(401).json({ error: "Refresh token inválido" });
        }

        if (storedToken.expiresAt < new Date()) {
            await storedToken.destroy();
            return res.status(401).json({ error: "Refresh token expirado" });
        }

        const decoded = verifyRefreshToken(token);
        if (!decoded) {
            return res.status(401).json({ error: "Refresh token inválido" });
        }

        const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email });

        res.json({
            accessToken
        });
    } catch (error) {
        console.error("Error en refreshToken:", error);
        res.status(500).json({ error: "Error al refreshear el token" });
    }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "name", "email", "createdAt", "updatedAt"]
        });

        res.json({ users });
    } catch (error) {
        console.error("Error en getUsers:", error);
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
};
