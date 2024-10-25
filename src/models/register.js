import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
    apprentice: [{type:mongoose.Schema.Types.ObjectId, ref: 'apprentice'}],
    modality: {type:mongoose.Schema.Types.ObjectId, ref: 'modality'},
    startDate: {type:Date},
    endDate: {type:Date},
    company: {type:String },
    phonecompany:{type:String},
    addresscompany:{type:String },
    owner:{type:String },
    docalternative:{type:String,},
    assignment:[{
        followUpInstructor: { idInstructor: mongoose.Schema.Types.ObjectId, name: String },
        technicalInstructor: { idInstructor: mongoose.Schema.Types.ObjectId, name: String },
        projectInstructor: { idInstructor: mongoose.Schema.Types.ObjectId, name: String },
        status:{type:Number, require:true, default:1}
    }],
    hour:{type:Number },
    businessProjectHour:{type:Number},
    productiveProjectHour:{ type:Number},
    emailCompany: {type: String },
    status:{ type: Number, default : 1}
},{timestamps:true})

export default mongoose.model("Register", registerSchema);
 