import mongoose from 'mongoose';

const pantSchema = new mongoose.Schema({
    length:{
        type:String,
    },
    kamar:{
        type:String,
    },
    mori:{
        type:String,
    },
    Jang:{
        type:String,
    },
    Seat:{
        type:String,
    },
    Gothan:{
        type:String,
    },
    remark:{
        type:String,
    },
    deliveryDate:{
        type:Date,
        default:Date.now()
    },
    notedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    countPant:{
        type:String
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
});


const Pant = mongoose.model("Pant", pantSchema);

export default Pant;