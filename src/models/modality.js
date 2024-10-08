import mongoose from 'mongoose';

const modalitySchema = new mongoose.Schema({
    name: { type: String, required: true},
    hourInstructorFollow: { type: Number, required: true, default:0 },
    hourInstructorTechnical: { type: Number},
    hourInstructorProject: { type: Number },
    
}, { timestamps: true });

export default mongoose.model("Modality", modalitySchema);