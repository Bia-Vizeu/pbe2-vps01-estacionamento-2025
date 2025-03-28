const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const automovel = await prisma.automóvel.create({
            data: req.body
        });
        return res.status(201).json(automovel);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const read = async (req, res) => {
    try {
        const automoveis = await prisma.automóvel.findMany();
        return res.json(automoveis);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const readOne = async (req, res) => {
    try {
        const automovel = await prisma.automóvel.findUnique({
            where: {
                placa: req.params.placa
            },
            include:{
                estadias: {
                }
            }
        });
        if (!automovel) {
            return res.status(404).json({ error: "Automóvel não encontrado" });
        }
        return res.json(automovel);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const automovel = await prisma.automóvel.update({
            where: {
                placa: req.params.placa
            },
            data: req.body
        });
        return res.status(202).json(automovel);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await prisma.automóvel.delete({
            where: {
                placa: req.params.placa
            }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

module.exports = { create, read, readOne, update, remove };