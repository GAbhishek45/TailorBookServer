import { mongoose } from 'mongoose';

const shirtSchema = new mongoose.Schema({
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client"
    },
    chest:{
        type:String,
    },
    waist:{
        type:String,
    },
    length:{
        type:String,
    },
    shoulder:{
        type:String,
    },
    sleeveLength:{
        type:String,
    },
    neck:{
        type:String,
    },
    wrist:{
        type:String,
    },
    remark:{
        type:String,
    },
    deliveryDate:{
        type:String,
        default:Date.now()
    },
    notedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    mainImg:{
        type:String
    },
    isPending:{
        type:Boolean,
        default:true
    },
    completed:{
        type:Boolean,
        default:false
    }
},{new: true});

const Shirt = mongoose.model("Shirt", shirtSchema);
export default Shirt;