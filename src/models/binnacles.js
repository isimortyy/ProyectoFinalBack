import mongoose from 'mongoose'

const binnaclesShema = new mongoose.Schema({
    register:{ type: mongoose.Schema.Types.ObjectId, ref:'Register'},
    instructor: { 
        idInstructor: mongoose.Schema.Types.ObjectId, 
        name: String  },
    document: {type:String, require:true, unique:true, max:50},
    number: { type: Number, required: true, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    status:{type:String, require:true, default:1},
    observations :[{
            observations: String,
            user: { type: mongoose.Schema.Types.ObjectId},
            observationDat: { type: Date, default: Date.now}
    }],
    checkTechnicalInstructor:{
        type: Boolean,
        default: false
    },
    checkProjectInstructor:{
        type: Boolean,
        default: false
    }
},{timestamps:true})

export default mongoose.model("Binnacles", binnaclesShema);      