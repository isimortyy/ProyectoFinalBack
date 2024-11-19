import Apprentice from '../models/apprentice.js';
import Register from "../models/register.js";
import Modality from "../models/modality.js"
import {validate} from "../middleware/validateJWT.js"
/* import useRepfora from "../controllers/repfora.js" */
import readline from 'readline'
import { Readable } from 'stream';
import axios from 'axios'
import mongoose from 'mongoose';

const REPFORA = process.env.REPFORA;

const controllerApprentice = {

    // Login aprendiz/ consultor

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
    
    //Listar todos los aprendices
    
    listtheapprentice: async (req, res) => {
        try {
            const apprentice = await Apprentice.find().populate('modality');
            console.log('lista de apprentice', apprentice);
            res.json(apprentice);
        } catch (error) {
            console.log('Error al listar apprentice');
            res.status(500).json({ error: 'Error al listar apprentice' });
        }
    },

    //Listar  Id de aprendiz

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

    //Listar aprendices por ficha

    listtheapprenticebyficheid: async (req, res) => {
        const { idfiche } = req.params;
        try {
            console.log ('ID de ficha recibido', idfiche)
            if (!mongoose.Types.ObjectId.isValid(idfiche)){
                return res.status(400).json({ msg:'Id de la ficha es invalido'})
            }

            const apprentice = await Apprentice.find({ "fiche.idfiche":idfiche });
           if (apprentice.length=== 0 ){
            return res.status (404).json ({ msg: 'No se encontraron aprendices en esta ficha'})
           }
            res.json(apprentice);
        } catch (error) {
            console.log(`Error al listar fiche en apprentice ${idfiche}`, error);
            res.status(500).json({ error: `Error al listar fiche en apprentice ${idfiche}` });
        }
    },

    // Listar por estado

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

    //Listar aprendices por modalidad

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

    //Agregar o insertar nuevo aprendiz

    inserttheapprentice: async (req, res) => {
        const { fiche, tpDocument, numDocument, firstName, lastName, phone, personalEmail,institucionalEmail,hoursExecuted,hoursPending,hoursTotal, modality } = req.body;
        
        try {
            const newApprentice = new Apprentice({ fiche, tpDocument, numDocument, firstName, lastName, phone, personalEmail,institucionalEmail,hoursExecuted,hoursPending,hoursTotal,modality });
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

    //Archivo plano agregar aprendices

    createApprenticesCSV: async (file, token) => {
        const results = [];
        const readable = new Readable();
        readable._read = () => {};
        readable.push(file.buffer);
        readable.push(null);
    
        const rl = readline.createInterface({
            input: readable,
            crlfDelay: Infinity,
        });
    
        let isFirstLine = true;
        for await (const line of rl) {
            if (isFirstLine) {
                isFirstLine = false;
                continue; // Ignora encabezados
            }
    
            const formattedLine = line.replace(/;/g, ',');
            const data = formattedLine.split(',');
            if (data.length < 8) {
                console.error('Error: Datos faltantes en la línea:', formattedLine);
                continue;
            }
    
            // Asignación de variables con los nombres del archivo plano
            const [Ficha, TipoDocumento, NroDocumento, PrimerNombre, PrimerApellido, Telefono, EmailPersonal, EmailInstitucional, Modalidad] = data;
    
            try {
                const normalizedModalityName = Modalidad.toUpperCase();
                const modality = await Modality.findOne({ name: normalizedModalityName });
                if (!modality) {
                    console.error('Error: Modalidad no encontrada para', Modalidad);
                    continue;
                }
    
                // Solicitar ficha a REP_FORA con el token
                console.log(`Haciendo solicitud a: ${REPFORA}/api/fiches con el token`);
                const response = await axios.get(`${REPFORA}/api/fiches`, {
                    headers: { token: token },
                    params: { number: Ficha }
                });
    
                const fiches = response.data;
                const fiche = fiches.find(f => f.number === Ficha);
                if (!fiche) {
                    console.error('Error: Ficha no encontrada para el número', Ficha);
                    continue;
                }
    
                const newApprentice = new Apprentice({
                    fiche: {
                        idfiche: fiche._id,
                        name: fiche.program.name,
                        number: fiche.number
                    },
                    modality: modality._id,
                    tpDocument: TipoDocumento,
                    numDocument: NroDocumento,
                    firstName: PrimerNombre,
                    lastName: PrimerApellido,
                    phone: Telefono,
                    personalEmail: EmailPersonal,
                    institucionalEmail: EmailInstitucional
                });
    
                const apprenticeCreated = await newApprentice.save();
                const newRegister = new Register({
                    apprentice: apprenticeCreated._id,
                    modality: modality._id
                });
    
                const preRegisterCreated = await newRegister.save();
                results.push({ apprentice: apprenticeCreated, register: preRegisterCreated });
            } catch (error) {
                console.error('Error al guardar el aprendiz:', error.response?.data || error.message);
            }
        }
    
        return results;
    },

    //Actualizar aprendiz
    
    updateapprenticebyid: async (req, res) => {
        const { id } = req.params;
        const { fiche, tpDocument,numDocument,firstName,lastName,phone,email}= req.body
        try{
            const apprentice= await Apprentice.findById(id)
            if (!apprentice) {
                return res.status(404).json ({ error:'No se ha encontrado aprendiz'})
            }

            const updateapprentice = await Apprentice.findByIdAndUpdate (id, {fiche, tpDocument,numDocument,firstName,lastName,phone,email}, {new:true})
            console.log('Aprendiz editado:', updateapprentice)
            res.json(updateapprentice)
        }catch (error){
            console.error('Error al editar aprendiz:' ,error)
            res.status(500).json ({ error:'Error al editar aprendiz'})
        }
    },


    //Actualizar estado

    updateStatus:async (req, res) => {

        const { id } = req.params;
        const { status } = req.body;
        try {
            const apprentice = await Apprentice.findById(id);
            if (!apprentice) {
                return res.status(404).json({ message: 'Aprendiz no encontrado' });
            }
            const statusNumber = [0, 1, 2, 3, 4];
            if (!statusNumber.includes(status)) {
                return res.status(400).json({ message: 'Estado inválido' });
            }
            const register = await Register.findOne({ apprentice: apprentice._id });
    
            if (!register) {
                return res.status(404).json({ message: 'Registro no encontrado para el aprendiz' });
            }
            const today = new Date();
            const totalHoursExecuted = register.hourFollowupExcuted + register.businessProjectHourExcuted + register.productiveProjectHourExcuted;
    
            if (register.endDate < today && totalHoursExecuted >= 864) {
                apprentice.status = 3;  
            }
            if (status === 4) {
                if (apprentice.status !== 3) {
                    return res.status(400).json({ message: 'El aprendiz debe estar en estado "Por Certificación" para ser certificado' });
                }
                if (!register.certificationDoc || !register.docalternative) {
                    return res.status(400).json({ message: 'Faltan documentos para certificar' });
                }
                apprentice.status = 4;  
            }
            const updatedApprentice = await apprentice.save();
            res.json({ message: 'Estado actualizado correctamente', updatedApprentice });
    
        } catch (error) {
            console.error("Error al actualizar el estado del aprendiz", error);
            res.status(500).json({ error: 'Error al actualizar el estado del aprendiz' });
        }

    },

    //Activar
    
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

    //Desactivar

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
},



};

export default controllerApprentice;
