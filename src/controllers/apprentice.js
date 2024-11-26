import Apprentice from '../models/apprentice.js';
import Register from "../models/register.js";
import Modality from "../models/modality.js"
import {validate} from "../middleware/validateJWT.js"
import axios from 'axios'
import mongoose from 'mongoose';
import { Readable } from 'stream';
import csv from 'csv-parser';
import multer from 'multer';

const REPFORA = process.env.REPFORA;

// Configuración de multer para manejo de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único para cada archivo
    },
});

const upload = multer({ storage });

// Controlador para subir archivo
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No se cargó ningún archivo" });
        }
        res.status(200).send({
            message: "Archivo subido exitosamente",
            file: req.file,
        });
    } catch (error) {
        res.status(500).send({ message: "Error al subir el archivo", error });
    }
};

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

          // Asegúrate de que esta función esté generando el token correctamente
          const token = await validate.generarJWT(apprentice._id);
      
          console.log("Token generado:", token);  // Añade este log

          return res.json({
            apprentice,
            token,
          });
      
        } catch (error) {
          console.error("Error en postLogin:", error);
          return res.status(500).json({
            mensaje: "Error interno del servidor",
          });
        }
    },
    
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
//carga de archivo plano
    createApprenticesCSV: async (file, token) => {
        console.log('Iniciando procesamiento de CSV');
        console.log('Información del archivo:', file);
        const results = [];
        const errors = [];
        const readable = new Readable();
        readable._read = () => {};
        readable.push(file.buffer);
        readable.push(null);

        return new Promise((resolve, reject) => {
            readable
                .pipe(csv({ separator: ';' }))
                .on('data', async (data) => {
                    console.log('Procesando fila:', data);
                    try {
                        // Validate row data
                        const rowErrors = validateRow(data);
                        if (rowErrors.length > 0) {
                            errors.push({ row: results.length + 1, errors: rowErrors });
                            return;
                        }

                        const normalizedModalityName = data.Modalidad.toUpperCase();
                        const modality = await Modality.findOne({ name: normalizedModalityName });
                        if (!modality) {
                            errors.push({ row: results.length + 1, error: 'Modalidad no encontrada' });
                            return;
                        }

                        // Request fiche from REP_FORA with the token
                        const response = await axios.get(`${REPFORA}/api/fiches`, {
                            headers: { token: token },
                            params: { number: data.Ficha }
                        });

                        const fiches = response.data;
                        const fiche = fiches.find(f => f.number === data.Ficha);
                        if (!fiche) {
                            errors.push({ row: results.length + 1, error: 'Ficha no encontrada' });
                            return;
                        }

                        const newApprentice = new Apprentice({
                            fiche: {
                                idfiche: fiche._id,
                                name: fiche.program.name,
                                number: fiche.number
                            },
                            modality: modality._id,
                            tpDocument: data.TipoDocumento,
                            numDocument: data.NroDocumento,
                            firstName: data.PrimerNombre,
                            lastName: data.PrimerApellido,
                            phone: data.Telefono,
                            personalEmail: data.EmailPersonal,
                            institucionalEmail: data.EmailInstitucional
                        });

                        const apprenticeCreated = await newApprentice.save();
                        const newRegister = new Register({
                            apprentice: apprenticeCreated._id,
                            modality: modality._id
                        });

                        const preRegisterCreated = await newRegister.save();
                        results.push({ apprentice: apprenticeCreated, register: preRegisterCreated });
                    } catch (error) {
                        errors.push({ row: results.length + 1, error: error.message });
                    }
                })
                .on('end', () => {
                    console.log('Procesamiento de CSV finalizado');
                    if (errors.length > 0) {
                        console.log('Errores encontrados:', errors);
                        reject({ message: 'Errores en el archivo CSV', errors });
                    } else {
                        console.log('Resultados:', results);
                        resolve(results);
                    }
                })
                .on('error', (error) => {
                    console.error('Error durante el procesamiento del CSV:', error);
                    reject({ message: 'Error al procesar el archivo CSV', error });
                });
        });
    },

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
    

    updateStatus: async (req, res) => {
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

    enableapprentice: async (req, res) => {
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

    disableapprentice: async (req, res) => {
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
            } else if (!apprentice.status ===3){
                return res.status(400).json ({ msg:'El aprendiz no cumple con las condiciones para certificarse'})
            }
            apprentice.status=4
            await apprentice.save()
            res.json ({msg: 'Informacion de certificacion del aprendiz valida correctamente', apprentice})
        } catch(error){
            res.status(500).json ({ msg: error.message})
        }
    },
    uploadFile, // Nueva función para subir archivos
    upload, // Middleware de multer
};

function validateRow(data) {
    const errors = [];
    
    // Validate required fields
    const requiredFields = ['Ficha', 'TipoDocumento', 'NroDocumento', 'PrimerNombre', 'PrimerApellido', 'Telefono', 'EmailPersonal', 'EmailInstitucional', 'Modalidad'];
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`El campo ${field} es requerido`);
        }
    });

    // Validate email format
    if (data.EmailPersonal && !isValidEmail(data.EmailPersonal)) {
        errors.push('El formato del email personal no es válido');
    }
    if (data.EmailInstitucional && !isValidEmail(data.EmailInstitucional)) {
        errors.push('El formato del email institucional no es válido');
    }

    // Validate phone format (assuming it should be numeric)
    if (data.Telefono && !isValidPhone(data.Telefono)) {
        errors.push('El formato del teléfono no es válido');
    }

    // Validate document type
    const validDocTypes = ['CC', 'TI', 'CE', 'PAS'];
    if (data.TipoDocumento && !validDocTypes.includes(data.TipoDocumento)) {
        errors.push('El tipo de documento no es válido');
    }

    return errors;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    return /^\d+$/.test(phone);
}



export default controllerApprentice;
