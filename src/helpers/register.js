import Register from '../models/register.js'

const registerHelper = {

    //verificar si un registro con un ID específico existe en la base de datos.
    
    existResgister: async (id) => {
        try {
            const exist = await Register.findById(id)
            if (!exist){
                throw new Error(`Ya existe el ID:${id}`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar el ID:${error.message}`)
        }
    },

  /*   
    existAddressCompany: async (adressCompany) => {
        try {
            const existe = await Register.findOne({ adressCompany });
            if (existe) {
                throw new Error(`Ya existe ese AdressCompany en la base de datos: ${adres}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar AdressCompany: ${error.message}`);
        }
    },

    verifyAdressCompany: async (adressCompany)=>{
        try {
            const exist = await  Register.findOne({adressCompany})
            if(!exist){
                throw new Error(`El adressCompany ${adressCompany} no esta registrado`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar adressCompany ${error.message}`)
        }
    },

    existPhoneCompany: async (phoneCompany) => {
        try {
            const exist = await Register.findOne({ phoneCompany })
            if (exist) {
                throw new Error(`Ya existe phoneCompany en la base de datos:${phoneCompany}`)
            }
        } catch (error) {
            throw new Error(`Error al verificar el phoneCompany: ${error.message}`)
        }
    },

    verifyAdressCompany: async (phoneCompany)=>{
        try {
            const exist = await  Register.findOne({phoneCompany})
            if(!exist){
                throw new Error(`El phoneCompany ${phoneCompany} no esta registrado`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar phoneCompany ${error.message}`)
        }
    }, */

    verifyDocAlternative: async (docAlternative) => {
        try {
            const url = docAlternative;

            const isOneDriveLink = (url) => {
                const regex = /^https?:\/\/(www\.)?(onedrive\.live\.com|1drv\.ms)(\/.*)?$/;
                return regex.test(url);
            };

            if (!isOneDriveLink(url)) {
                throw new Error("El enlace proporcionado no es válido. Debe ser un enlace de OneDrive.");
            }

            console.log("El contenido es un enlace válido de OneDrive.");
            return true;
        } catch (error) {
            throw new Error(error.message || "Error al verificar el enlace de OneDrive.");
        }
    }

}

export { registerHelper };