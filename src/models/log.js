import mongoose from "mongoose";

const logsSchema = new mongoose.Schema({
    users: { type: String, required: false }, 
    email:{ type:String, required: true, unique: true},
    action: { type: String, required: true, default:"No se hizo una accion"}, 
    information: { type: Object, required:true}, 
    status:{type:Number, required:true, default:1}
   
}, { timestamps: true });

export default mongoose.model("Log", logsSchema);