import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
    apprentice: [{type:mongoose.Schema.Types.ObjectId, ref: 'Apprentice'}],
    modality: {type:mongoose.Schema.Types.ObjectId, ref: 'Modality'},
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
        _id:false
    }],

    businessProjectHourExcuted:[{
        idInstructor:{ type: mongoose.Schema.Types.ObjectId},
        name:{ type:String},
        hour:{ type:Number},
        _id:false
    }],

    productiveProjectHourExcuted:[{
        idInstructor:{ type: mongoose.Schema.Types.ObjectId},
        name:{ type:String},
        hour:{ type:Number},
        _id:false
    }],

    productiveProjectHourExcuted:[{
        idInstructor:{ type: mongoose.Schema.Types.ObjectId},
        name:{ type:String},
        hour:{ type:Number},
        _id:false
    }],

    technicalHourPending :[{
        idInstructor:{ type: mongoose.Schema.Types.ObjectId},
        name:{ type:String},
        hour:{ type:Number},
        _id:false
    }],

    proyectHourPending :[{
        idInstructor:{ type: mongoose.Schema.Types.ObjectId},
        name:{ type:String},
        hour:{ type:Number},
        _id:false
    }],

    assignment:[{
        
        followUpInstructor: [{ 
            idInstructor: mongoose.Schema.Types.ObjectId, 
            name: {type:String},
            email: {type:String},
            status: {type:Number},
            _id:false
        }],

        technicalInstructor: { type:[{ 
            idInstructor: mongoose.Schema.Types.ObjectId,
             name: {type:String},
             email:{type: String},
             status:{type:Number},
             _id:false
            }],
            default: undefined
        },

        projectInstructor:{ type: [{ 
            idInstructor: mongoose.Schema.Types.ObjectId,
             name: {type:String} ,
             email: {tyep:String}, 
             status: {type:Number},
             _id:false

            }],
            default: undefined
         },

        status:{type:Number},
        _id: false
    }],

    
    status:{ type: Number, default : 1}
},{timestamps:true})

export default mongoose.model("Register", registerSchema);
 