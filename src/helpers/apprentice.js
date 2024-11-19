import Apprentice from '../models/apprentice.js';

const apprenticeHelper = {

    // Verifica si Ya existe ese aprendiz

    existApprentice: async (id) => {
        try {
            const exist = await Apprentice.findById(id);
            if (!exist) {
                throw new Error(`Ya existe el ID:${id}`);
            }
            return exist;
        } catch (error) {
            throw new Error(`Error al verificar el ID:${error.message}`);
        }
    },

    // Verifica si Ya existe numero de documento, excluyendo el registro

    existNumDocument: async (numDocument, id = null) => {
        try {
            const document = await Apprentice.findOne({ numDocument });
            if ( document && (!id || document._id.toString() !== id.toString()) ) {
                throw new Error(`Ya existe el numDocument en la base de datos: ${numDocument}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar numDocument: ${error.message}`);
        }
    },

   // Verifica si el correo institucional ya existe 

   existInstitucionalEmail: async ( institucionalEmail, id=null) =>{
    try{
        const email = await Apprentice.findOne({  institucionalEmail})
        if ( email && (!id || email._id.toString() !== id.toString())){
            throw new Error (`El correo instirucional ${ institucionalEmail} ya existe `)
        }

    }catch(error){
        throw new Error (`Erro al verificar correo institucional: ${error.message}`)
    }
   },

    // Verifica si el correo personal ya existe, ignorando el registro

    existPersonalEmail: async (personalEmail, id = null) => {
        try {
            const emailP = await Apprentice.findOne({ personalEmail})
            if ( emailP && (!id || emailP._id.toString() !==id.toString)){
                throw new Error (`El email personal ${personalEmail} ya existe`)
        }
    }catch (error){
        throw new Error (`Error al verificar emaail personal: ${error.message}`)

    }

    },

    //Verificar si el numero de documento no existe 

    notExistNumDocument: async (numDocument) =>{
        try {
            const document = await Apprentice.findOne({numDocument})
            if (!document){
                throw new Error (` No existe un aprendiz con el numero de documento: ${numDocument}`)

            }
            return true
        }catch(error){
            throw new Error  (`Error al verificar numero de documento: ${error.message}`)
        }

},

    // verificar si no existe correo personal 

    notExistPersonalEmail: async (personalEmail) =>{
        try{
            const email = await Apprentice.findOne ({ personalEmail});
            return email === null
        }catch (error){
            throw new Error (`Error al verificar correo institucional: ${error.message}`)
        }
    },

    // verificar si no existe el correo institucional

    notExistInstitucionalEmail: async (institucionalEmail) =>{
        try{
            const email = await Apprentice.findOne ({ institucionalEmail})
            return email === null 
        }catch (error){
            throw new Error (`Error al verificar correo institucional: ${error.message}`)
        }
    },

    // Verificar si el correo no existe (institucional o personal)

    notExistEmail: async (email)=>{
        try{
            const institucionalEmailExist = await Apprentice.findOne ({ institucionalEmail: email})
            const  personalEmailExist = await Apprentice.findOne({ personalEmail:email})
            if (!institucionalEmailExist && !personalEmailExist){
                return true;
            }
            return false
        }catch (error){
        throw new Error (`Error al verificar el email :${error.message}`)
    }
},
   
};

export { apprenticeHelper };
