
import mongoose from 'mongoose';

const apprenticeSchema = new mongoose.Schema({
    fiche: {
        idfiche: mongoose.Schema.Types.ObjectId,
        number: String,
        name: String
    },
    modality:{type: mongoose.Schema.Types.ObjectId, ref:'Modality'},
    tpDocument: { type: String, required: true }, // Cambié a "required"
    numDocument: { type: String, required: true }, // Cambié a "required"
    firstName: { type: String, required: true }, // Cambié a "required"
    lastName: { type: String, required: true }, // Corregí "lasname" a "lastname"
    phone: { type: String, required: true }, // Cambié a "required"
    personalEmail: { type: String, required: true },
    institucionalEmail:{ type: String, required: true }, 
    hoursExecutedPS: { type: Number, default:0 },
    hoursPendingPS: { type: Number, default:864 },
    hoursTotalPS: { type: Number, default:864},

    
    status: { type: Number, required: true, default: 1 }, // Cambié a "required"
}, { timestamps: true });

export default mongoose.model("Apprentice", apprenticeSchema);
