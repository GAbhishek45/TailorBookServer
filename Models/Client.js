import  mongoose  from 'mongoose';


const clientSchema = new mongoose.Schema({
    clientName:{
        type:String,
        required:true
    },
    clientPhone:{
        type:String,
        required:true
    },
    clientAddress:{
        type:String,
        required:true
    },
    clientGender:{
        type:String,
        enum:["Male","Female"],
    },
    clientShirt:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shirt"
    },
    clientPant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pant"
    },
},{new: true});


const Client = mongoose.model("Client", clientSchema);

export default Client