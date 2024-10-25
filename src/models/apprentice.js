
import mongoose from 'mongoose';

const apprenticeSchema = new mongoose.Schema({
    fiche: {
        idfiche: mongoose.Schema.Types.ObjectId,
        number: String,
        name: String
    },
    tpdocument: { type: String, required: true }, // Cambié a "required"
    numdocument: { type: String, required: true }, // Cambié a "required"
    firstname: { type: String, required: true }, // Cambié a "required"
    lastname: { type: String, required: true }, // Corregí "lasname" a "lastname"
    phone: { type: String, required: true }, // Cambié a "required"
    personalEmail: { type: String, required: true },
    institucionalEmail:{ type: String, required: true }, 
    modality:{type: mongoose.Schema.Types.ObjectId, ref:'Modality'},
    status: { type: Number, required: true, default: 1 }, // Cambié a "required"
}, { timestamps: true });

export default mongoose.model("Apprentice", apprenticeSchema);
