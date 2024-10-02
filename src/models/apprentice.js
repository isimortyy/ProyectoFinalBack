
import mongoose from 'mongoose';

const apprenticeSchema = new mongoose.Schema({
    fiche: {
        idfiche: mongoose.Schema.Types.ObjectId,
        number: String,
        name: String
    },
    tpdocument: { type: String, required: true }, // Cambié a "required"
    numdocument: { type: String, required: true, unique: true }, // Cambié a "required"
    firstname: { type: String, required: true, maxlength: 50 }, // Cambié a "required"
    lastname: { type: String, required: true, maxlength: 50 }, // Corregí "lasname" a "lastname"
    phone: { type: String, required: true, maxlength: 10 }, // Cambié a "required"
    email: { type: String, required: true, unique: true },
    status: { type: Number, required: true, default: 1 }, // Cambié a "required"
}, { timestamps: true });

export default mongoose.model("Apprentice", apprenticeSchema);
