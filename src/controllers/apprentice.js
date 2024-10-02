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
        console.log('req.body:', req.body);
        const { tpDocument, numdocument, firname, lasname, phone, email, fiche } = req.body;
        try {
            if (!tpDocument || !numdocument || !firname || !lasname || !phone || !email || !fiche) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }
            const apprentice = new Apprentice({ 
                tpDocument, 
                numdocument, 
                firname, 
                lasname, 
                phone, 
                email, 
                fiche 
            });
            const result = await apprentice.save();
            console.log('Aprendiz guardado:', result);
            res.status(201).json({ message: 'Aprendiz guardado exitosamente', apprentice: result });
        } catch (error) {
            console.error('Error al insertar aprendiz:', error);
            res.status(500).json({ error: 'Error al insertar aprendiz', details: error.message });
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

     enableapprentice:async (req, res) => {
    const { id } = req.params;
    try {
        const apprentice = await Apprentice.findById(id);
        if (!apprentice) {
            return res.status(404).json({ error: 'Apprentice no encontrado' });
        }

        // Activar el apprentice si está desactivado
        if (apprentice.status === 0) {
            apprentice.status = 1;
            await apprentice.save();
            res.json({ message: 'Apprentice activado correctamente' });
        } else {
            res.json({ message: 'El apprentice ya está activado' });
        }
    } catch (error) {
        console.log("Error al activar apprentice:", error);
        res.status(500).json({ error: 'Error al activar apprentice' });
    }
},

disableapprentice:async (req, res) => {
    const { id } = req.params;
    try {
        const apprentice = await Apprentice.findById(id);
        if (!apprentice) {
            return res.status(404).json({ error: 'Apprentice no encontrado' });
        }

        // Desactivar el apprentice si está activado
        if (apprentice.status === 1) {
            apprentice.status = 0;
            await apprentice.save();
            res.json({ message: 'Apprentice desactivado correctamente' });
        } else {
            res.json({ message: 'El apprentice ya está desactivado' });
        }
    } catch (error) {
        console.log("Error al desactivar apprentice:", error);
        res.status(500).json({ error: 'Error al desactivar apprentice' });
    }
}
};

export default controllerApprentice;
