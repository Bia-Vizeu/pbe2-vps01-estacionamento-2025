const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const estadia = await prisma.estadia.create({
            data: req.body
        });
        return res.status(201).json(estadia);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const read = async (req, res) => {
    try {
        const estadias = await prisma.estadia.findMany();
        return res.json(estadias);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const estadiaExistente = await prisma.estadia.findUnique({
            where: { id }
        });

        if (!estadiaExistente) {
            return res.status(404).json({ error: "Estadia não encontrada" });
        }

        let valorTotal = estadiaExistente.valortotal;
        if (req.body.saida) {
            const entrada = new Date(estadiaExistente.entrada);
            const saida = new Date(req.body.saida);

            if (saida < entrada) {
                return res.status(400).json({ error: "A data de saída não pode ser anterior à data de entrada" });
            }

            const horas = Math.ceil((saida - entrada) / (1000 * 60 * 60)); 
            valorTotal = horas * estadiaExistente.valorhora; 
        }

        const estadia = await prisma.estadia.update({
            where: { id },
            data: {
                ...req.body,
                valortotal: valorTotal
            }
        });

        return res.status(202).json(estadia);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        await prisma.estadia.delete({
            where: {
                id: id
            }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

module.exports = { create, read, update, remove };