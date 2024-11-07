import mongoose from "mongoose";

const logsSchema = new mongoose.Schema({
    users: { type: String, required: false }, 
    action: { type: String, required: true, default:"No se hizo una accion"}, 
    information: { date:Date}, 
   
}, { timestamps: true });

export default mongoose.model("Log", logsSchema);