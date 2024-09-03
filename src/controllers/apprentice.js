import Apprentice from '../models/apprentice.js';

const controllerApprentice = {
    listtheapprentice: async (req, res) => {
        try {
            const apprentice = await Apprentice.find();
            console.log('lista de apprentice', apprentice);
            res.json(apprentice);
        } catch (error) {
            console.log('Error al listar apprentice');
            res.status(500).json({ error: 'Error al listar apprentice' });
        }
    },
    listtheapprenticebyid: async (req, res) => {
        const { id } = req.params;
        try {
            const apprentice = await Apprentice.findById(id);
            if (!apprentice) {
                return res.status(404).json({ error: 'apprentice not found' });
            }
            console.log('apprentice encontrado', apprentice);
            res.json(apprentice);
        } catch (error) {
            console.log('Error al listar apprentice por id', error);
            res.status(500).json({ error: 'Error al listar apprentice por id' });
        }
    },
    listtheapprenticebyficheid: async (req, res) => {
        const { fiche } = req.params;
        try {
            const apprentice = await Apprentice.find({ fiche });
            console.log(`lista de fiche en apprentice ${fiche}`);
            res.json(apprentice);
        } catch (error) {
            console.log(`Error al listar fiche en apprentice ${fiche}`, error);
            res.status(500).json({ error: `Error al listar fiche en apprentice ${fiche}` });
        }
    },
    listApprenticeByStatus: async (req, res) => {
        const { status } = req.params;
        try {
            if (status !== '0' && status !== '1') {
                return res.status(404).json({ message: 'Estado inválido' });
            } else if (status == 1) {
                const apprenticeActive = await Apprentice.find({ status: 1 });
                res.json({ apprenticeActive });
            } else {
                const apprenticeInactive = await Apprentice.find({ status: 0 });
                res.json({ apprenticeInactive });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    inserttheapprentice: async (req, res) => {
        const { tpDocument, numDocument, firstName, lastName, phone, email, fiche } = req.body;
        try {
            const apprentice = new Apprentice({ tpDocument, numDocument, firstName, lastName, phone, email, fiche });
            const result = await apprentice.save();
            console.log('apprentice saved', result);
            res.json(result);
        } catch (error) {
            console.log('Error al insertar apprentice', error);
            res.status(500).json({ error: 'Error al insertar apprentice' });
        }
    },
    updateapprenticebyid: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedApprentice = await Apprentice.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedApprentice) {
                return res.status(404).json({ error: 'Apprentice not found' });
            }
            console.log("Apprentice updated:", updatedApprentice);
            res.json(updatedApprentice);
        } catch (error) {
            console.error("Error updating apprentice:", error);
            res.status(500).json({ error: "Error updating apprentice" });
        }
    },
    activateAndDesactiveapprentice: async (req, res) => {
        const { id } = req.params;
        try {
            const apprentice = await Apprentice.findById(id);
            if (!apprentice) {
                return res.status(404).json({ error: 'apprentice no encontrado' });
            }
            apprentice.status = apprentice.status === 1 ? 0 : 1;
            await apprentice.save();
            const messages = apprentice.status === 1 ? "apprentice active" : "apprentice inactive";
            res.json({ messages });
        } catch (error) {
            console.log("Error al desactivar / activar apprentice");
            res.status(500).json({ error: 'Error al desactivar / activar apprentice' });
        }
    }
};

export default controllerApprentice;
