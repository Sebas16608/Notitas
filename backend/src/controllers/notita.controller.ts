import Notita from "../models/notitas.models";
import { Request, Response } from "express";

const getAllNotitas = async (req: Request, res: Response) => {
    try {
        const notita = await Notita.findAll();
        return res.status(200).json(notita)
    } catch (error) {
        return res.status(500).json({ error: `Internal Server Error ${error}` });
    }
}

const getNotitaById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const notita = await Notita.findByPk(id as string);
        if (!notita) return res.status(404).json({ error: "Not Found" });

        return res.status(200).json(notita);
    } catch (error) {
        return res.status(500).json({ error: `Internal Server Error ${error}` });
    }
}

const postNotita = async (req: Request, res: Response) => {
    try{
        const { title, content, userId } = req.body;

        const notita = await Notita.create({ title, content, userId });

        return res.status(201).json(notita);
    } catch (error) {
        return res.status(400).json({ error: `Bad Request ${error}` });
    }
}

const putNotita = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const notita = await Notita.findByPk(id as string);
        if (!notita) return res.status(404).json({ error: "Not Found" });

        const { title, content, userId } = req.body;

        notita.title = title ?? notita.title;
        notita.content = content ?? notita.content;
        notita.userId = userId ?? notita.userId;

        await notita.save();

        return res.json(notita);
    } catch (error) {
        return res.status(400).json({ error: `Bad Request ${error}`})
    }
}

const deleteNotita = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const notita = await Notita.findByPk(id as string);
        if (!notita) return res.status(404).json({ error: "Not Found" });

        await notita.destroy();
        return res.status(204).json({ error: "No Content" });
    } catch (error) {
        return res.status(500).json({ error: `Internal Error Server ${error} `});
    }
}

export { getAllNotitas, getNotitaById, postNotita, putNotita, deleteNotita}