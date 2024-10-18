import Register from "../models/register.js";
import Modality from "../models/modality.js";

const controllerRegister = {
    // Listar todos los registros---------------------------------------------------------
    listtheregister: async (req, res) => {
        try {
            const registers = await Register.find();
            console.log('Lista de registros', registers);
            res.json(registers);
        } catch (error) {
            console.log('Error al listar registros', error);
            res.status(500).json({ error: 'Error al listar registros' });
        }
    },

    // Listar por id-----------------------------------------------------------------------
    listtheregisterbyid: async (req, res) => {
        const { id } = req.params;
        try {
            const register = await Register.findById(id);

            if (!register) {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }
            console.log('Registro encontrado', register);
            res.json(register);
        } catch (error) {
            console.log('Error al listar registro por id', error);
            res.status(500).json({ error: 'Error al listar registro por id' });
        }
    },

    // Listar registro por Id aprendiz-----------------------------------------------------------------
    listtheapprenticebyid: async (req, res) => {
        const { apprentice } = req.params;
        try {
            const registers = await Register.find({ apprentice });
            console.log(`Lista de aprendices en registros: ${apprentice}`);
            res.json(registers);
        } catch (error) {
            console.log(`Error al listar aprendices en registros: ${apprentice}`, error);
            res.status(500).json({ error: 'Error al listar aprendices en registros' });
        }
    },
  
 // Listar registros por ID de ficha
 listregistersbyfiche: async (req, res) => {
    const { idfiche } = req.params;
    console.log(`ID de ficha recibido: ${idfiche}`);
    
    try {
      const registers = await Register.aggregate([
        {
          $lookup: {
            from: "apprentices",
            localField: "apprentice",
            foreignField: "_id",
            as: "apprentice",
          },
        },
        {
          $unwind: "$apprentice",
        },
 
        {
          $match: {
            "apprentice.fiche.idfiche": new mongoose.Types.ObjectId(idfiche),
          },
        },
        {
          $project: {
            _id: 1,
            idfiche:"$apprentice.fiche",
            apprentice: 1,
            modality: 1,
            startDate:1,
            endDate:1,
            company:1,
            phoneCompany: 1,
            addressCompany:1,
            owner: 1,
            docAlternative:1,
            hour : 1,
            businessProyectHour: 1,
            productiveProjectHour: 1,
            status: 1,
            mailCompany :1,
          },
        },
      ]);
      console.log(`Registros encontrados: ${JSON.stringify(registers, null, 2)}`);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.log(`Error al listar idfiche en register: ${idfiche}`, error);
      res.status(500).json({ error: "Error al listar idfiche en register" });
    }
  },

    // Listar por modalidad---------------------------------------------------------------
    listthemodalitybyid: async (req, res) => {
        const { modality } = req.params;
        try {
            const registers = await Register.find({ modality });
            console.log(`Lista de modalidades en registros: ${modality}`);
            res.json(registers);
        } catch (error) {
            console.log(`Error al listar modalidades en registros: ${modality}`, error);
            res.status(500).json({ error: `Error al listar modalidades en registros ${modality}`, error });
        }
    },

    // Listar los registros por fecha de inicio 
    listregisterstardatebyid: async (req, res) => {
        try {
            const register = await Register.find({ startDate })
            if (!register) {
                return res.status(404).json({ error: 'Registro no encontrar' })
            }
            console.log('Listar por fecha de inicio');
            res.json(register)
        } catch (error) {
            console.log('Error al listar por fecha de inicio', error);
            res.status(500).json({ error: 'Error al listar por fecha de inicio' })
        }
    },

    // Listar los registros por fecha de finalización
    listregisterenddatebyid: async (req, res) => {
        try {
            const register = await Register.find({ endDate })
            if (!register) {
                return res.status(404).json({ error: 'Registro no encontrar' })
            }
            console.log('Listar por fecha de finalización');
            res.json(register)
        } catch (error) {
            console.log('Error al listar por fecha de finalizción', error);
            res.status(500).json({ error: 'Error al listar por fecha de finalización' })
        }
    },
    // Insertar registro-----------------------------------------------------------------
    insertregister: async (req, res) => {
        const { apprentice, modality, startDate, company, phonecompany, addresscompany, owner, hour, businessProjectHour,productiveProjectHour,emailCompany } = req.body;
        try {

            const start= new Date(startDate)
            const endDate = new Date (start)

            endDate.setMonth(endDate.getMonth() + 6)
            endDate.setDate(endDate.getDate() - 1)

            const register = new Register({ apprentice, modality, startDate, endDate, company, phonecompany, addresscompany, owner, hour ,businessProjectHour,productiveProjectHour,emailCompany});
            const result = await register.save();
            console.log('Registro guardado', result);
            res.json(result);
        } catch (error) {
            console.log('Error al insertar registro', error);
            res.status(500).json({ error: 'Error al insertar registro' });
        }
    },

    // Actualizar registro---------------------------------------------------------------
    updateRegisterById: async (req, res) => {
        const { id } = req.params;
        const { apprentice, modality, startDate, company, phonecompany, addresscompany, owner, hour, businessProjectHour,productiveProjectHour,emailCompany  } = req.body;
        try {
            const registerID = await Register.findById(id);
            if (!registerID) {
                return res.status(404).json({ msg: "Registro no encontrado" });
            }

            const start = new Date(startDate);
            const endDate = new Date(start);
            endDate.setMonth(endDate.getMonth() + 6);
            endDate.setDate(endDate.getDate() - 1);

            const updatedRegister = await Register.findByIdAndUpdate(
                id, { apprentice, modality, startDate, endDate, company, phonecompany, addresscompany, owner, hour ,businessProjectHour,productiveProjectHour,emailCompany },
                { new: true }
            );

            console.log('Registro editado correctamente:', updatedRegister);
            res.json(updatedRegister);
        } catch (error) {
            console.log('Error al actualizar registro:', error);
            res.status(400).json({ error: 'Error al actualizar el registro' });
        }
    },

    //Actualizar registro por modalidad 

    updatemodalityregister: async (req, res) => {
        const { id } = req.params;
        const { modality } = req.body;
        try {
            const updatedModality = await Modality.findByIdAndUpdate(id, { modality }, { new: true });
            if (!updatedModality) {
                return res.status(404).json({ message: 'Registro no encontrado' });
            }
            res.json({ success: true, data: updatedModality });
        } catch (error) {
            console.log('Error al actualizar modalidad', error);
            res.status(500).json({ error: 'Error al actualizar modalidad' });
        }
    },

    // Activar y Desactivar registro--------------------------------------------------------
    enableregister: async (req, res) => {
        const { id } = req.params;
        try {
            const register = await Register.findById(id);
    
            if (!register) {
                return res.status(404).json({ error: 'Register not found' });
            }
    
            // Activar el registro si está desactivado
            if (register.status === 0) {
                register.status = 1;
                await register.save();
                res.json({ message: 'Register activated successfully' });
            } else {
                res.json({ message: 'Register is already active' });
            }
        } catch (error) {
            console.error('Error activating register:', error);
            res.status(500).json({ error: 'Error activating register' });
        }
    },

    disableregiste:async (req, res) => {
        const { id } = req.params;
        try {
            const register = await Register.findById(id);
    
            if (!register) {
                return res.status(404).json({ error: 'Register not found' });
            }
    
            // Desactivar el registro si está activado
            if (register.status === 1) {
                register.status = 0;
                await register.save();
                res.json({ message: 'Register deactivated successfully' });
            } else {
                res.json({ message: 'Register is already inactive' });
            }
        } catch (error) {
            console.error('Error deactivating register:', error);
            res.status(500).json({ error: 'Error deactivating register' });
        }
    }
};

export default controllerRegister;