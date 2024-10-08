import mongoose from "mongoose";

const logsSchema = new mongoose.Schema({
    users: { type: String, required: true }, 
    email:{type: String, required:true},
    action: { type: String, required: true }, 
    information: { type: Object, required: true }, 
   
}, { timestamps: true });

export default mongoose.model("Log", logsSchema);