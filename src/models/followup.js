import mongoose from 'mongoose';

const followupSchema = new mongoose.Schema({
    assignment: {type:mongoose.Schema.Types.ObjectId, ref: 'assignment', require:true},
    instructor: {idInstructor: mongoose.Schema.Types.ObjectId, name: String},
    number: { type: Number, required: true, enum: [1, 2, 3, ] },
    month: {type:String,  require:true},
    document: {type:String, require:true},
    status:{type:Number , require:true, default:1 },
    observation: [{
        observation: {type:String},
        user: {type:mongoose.Schema.Types.ObjectId},
        observationDate: { type: Date, default: Date.now }
    }],
},{timestamps:true}) 

export default mongoose.model("Followup", followupSchema);