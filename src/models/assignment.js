import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    register: { type: mongoose.Schema.Types.ObjectId, ref: 'Register', required:true },
    followUpInstructor: { idInstructor: mongoose.Schema.Types.ObjectId, name: String },
    technicalInstructor: { idInstructor: mongoose.Schema.Types.ObjectId, name: String },
    projectInstructor: { idInstructor: mongoose.Schema.Types.ObjectId, name: String },
    certificationdoc: { type: String, required: true},
    judymentPhoto: { type: String, required: true },
    status:{type:Number, require:true, default:1}
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema)













;