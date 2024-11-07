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
    emailCompany: {type: String },
    certificationDoc:{ type: String},
    judymentPhone:{ type:String},
    hourProductiveStageApprendice: {type:Number},
    
    hourFollowupExcuted:  [{
        idInstructor:{ type: mongoose.Schema.Types.ObjectId},
        name:{ type:String},
        hour:{ type:Number},
    }],

    businessProjectHourExcuted:[{
        idInstructor:{ type: mongoose.Schema.Types.ObjectId},
        name:{ type:String},
        hour:{ type:Number},
    }],

    productiveProjectHourExcuted:[{
        idInstructor:{ type: mongoose.Schema.Types.ObjectId},
        name:{ type:String},
        hour:{ type:Number},
    }],

    productiveProjectHourExcuted:[{
        idInstructor:{ type: mongoose.Schema.Types.ObjectId},
        name:{ type:String},
        hour:{ type:Number},
    }],

    technicalHourPending :[{
        idInstructor:{ type: mongoose.Schema.Types.ObjectId},
        name:{ type:String},
        hour:{ type:Number},
    }],

    proyectHourPending :[{
        idInstructor:{ type: mongoose.Schema.Types.ObjectId},
        name:{ type:String},
        hour:{ type:Number},
    }],


    


    assignment:[{
        followUpInstructor: { idInstructor: mongoose.Schema.Types.ObjectId, name: String, email:String, hour:Number, status:Number },
        technicalInstructor: { idInstructor: mongoose.Schema.Types.ObjectId, name: String , email:String, hour:Number, status:Number},
        projectInstructor: { idInstructor: mongoose.Schema.Types.ObjectId, name: String , email:String, hour:Number, status:Number},
        status:{type:Number, require:true, default:1}
    }],

    
    status:{ type: Number, default : 1}
},{timestamps:true})

export default mongoose.model("Register", registerSchema);
 