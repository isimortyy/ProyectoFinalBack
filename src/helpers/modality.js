import Modality from "../models/modality.js"

const modalityHelper = {
    existeModalityID: async (id, req) => {
        const existe = await Modality.findById(id)
        if (!existe) {
            throw new Error(`no existe la modalidad con ID ${id}`)
        }

        req.req.logbd = existe

    },
    
}

export{ modalityHelper};