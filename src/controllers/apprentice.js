import Apprentice from '../models/apprentice.js';
import Register from "../models/register.js";
import {validate} from "../middleware/validateJWT.js"
import apprentice from '../models/apprentice.js';
import mongoose from 'mongoose';

const controllerApprentice = {

    postLogin: async (req, res) => {
        const { email, numdocument } = req.body;
      
        try {
          const apprentice = await Apprentice.findOne({
            $or:[
                { institucionalEmail:email},
                { personalEmail:email}
            ]
           });
      
          if (!apprentice || apprentice.status === 0) {
            return res.status(400).json({
              mensaje: "Los datos del aprendiz estan incorrectos",
            });
          }

          if (apprentice.numdocument !== numdocument){
            return res.status(401).json ({ message: "Numero de documento no coincide"})
          }

          const token = await validate.generarJWT(apprentice._id);
      
          return res.json({
            apprentice,
            token,
          });
      
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            mensaje: "Hable con el WebMaster",
          });
        }
      },
    
    
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
        const { idfiche } = req.params;
        try {
            const apprentice = await Apprentice.find({ "fiche.idfiche":idfiche });
            console.log(`lista de fiche en apprentice ${idfiche}`);
            res.json(apprentice);
        } catch (error) {
            console.log(`Error al listar fiche en apprentice ${idfiche}`, error);
            res.status(500).json({ error: `Error al listar fiche en apprentice ${idfiche}` });
        }
    },


    listApprenticeByStatus: async (req, res) => {
        const { status } = req.params;
        try{
            const statusNumber = Number(status)
            const apprentice =  await Apprentice.find({ status:statusNumber})
        if (apprentice.length === 0){
            return res.status(404).json ({message:`No hay datos para el estado:${status}`})
        }
        res.json({apprentice})
        }catch(error){
            res.status(500).json({error: error.message})
        }

    },

    listApprenticeByModality : async(req,res) => {
        const {modality} = req.params
        try {
            if(!mongoose.Types.ObjectId.isValid(modality)){
                return res.status(400).json({ message:'Id de la modalidad no es valido'})
                }
                const apprentice =await Apprentice.find ({modality})
                if (apprentice.length ===0){
                    return res.status(404).json ({ message:'No se encuentra aprendices para esta modalidad'})
                }
                res.status(200).json(apprentice)
        }catch(error) {
            console.log('Error al listar aprendices por la modalidad', error)
            res.status(500).json({message:'Erro interno de servidor', error:error.message})
        }

    },


    inserttheapprentice: async (req, res) => {
        const { fiche, tpdocument, numdocument, firstname, lastname, phone, personalEmail,institucionalEmail,hoursExecuted,hoursPending,hoursTotal, modality } = req.body;
        
        try {
            const newApprentice = new Apprentice({ fiche, tpdocument, numdocument, firstname, lastname, phone, personalEmail,institucionalEmail,hoursExecuted,hoursPending,hoursTotal,modality });
            const apprenticeCreated = await newApprentice.save();

            const newRegister = new Register({
                idApprentice: apprenticeCreated._id,
                idModality: modality
            });


            const preRegisterCreated = await newRegister.save();

            res.status(201).json({
                apprentice: apprenticeCreated,
                register: preRegisterCreated
            });
            console.log("Aprendiz y pre-registro guardados exitosamente");
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    
    updateapprenticebyid: async (req, res) => {
        const { id } = req.params;
        const { fiche, tpdocument,numdocument,firstname,lastname,phone,email}= req.body
        try{
            const apprentice= await Apprentice.findById(id)
            if (!apprentice) {
                return res.status(404).json ({ error:'No se ha encontrado aprendiz'})
            }

            const updateapprentice = await Apprentice.findByIdAndUpdate (id, {fiche, tpdocument,numdocument,firstname,lastname,phone,email}, {new:true})
            console.log('Aprendiz editado:', updateapprentice)
            res.json(updateapprentice)
        }catch (error){
            console.error('Error al editar aprendiz:' ,error)
            res.status(500).json ({ error:'Error al editar aprendiz'})
        }
    },

    updateStatus:async (req, res) => {


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
},


certificateApprentice : async (rep,res) => {
    const { id } = rep.params
    try{
        const apprentice = await Apprentice.findById(id)
        if(!apprentice){
            return res.status(404).json ({ msg:'Aprendiz no encontrado'})

        }else if (!apprentice.status ===3){
            return res.status(400).json ({ msg:'El aprendiz no cumple con las condiciones para certificarse'})
        }
        apprentice.status=4
        await apprentice.save()
        res.json ({msg: 'Informacion de certificacion del aprendiz valida correctamente', apprentice})

    }catch(error){
        res.status(500).json ({ msg: error.message})
    }
}

};

export default controllerApprentice;
