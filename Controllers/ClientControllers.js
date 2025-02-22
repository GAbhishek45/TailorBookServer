
import Client from './../Models/Client.js';

export const getAllClients = async(req,res) => {
    try {
        const clients = await Client.find({}).populate("clientShirt").populate("clientPant");

        return res.status(200).json({success:true,msg:"Clients fetched successfully",clients})

    } catch (error) {
        return res.status(400).json({success:false,msg:"Something went wrong in getting all clients"})
    }
}

export const createClient = async(req,res) => {
    try {
        const {clientName,clientPhone,clientAddress,clientGender,clientShirt,clientPant} = req.body;

        const existedClient = await Client.findOne({clientName});

        if(existedClient){
            return res.status(400).json({success:false,msg:"Client already exists"})
        }

        if(!clientName || !clientPhone || !clientAddress || !clientGender ){
            return res.status(400).json({success:false,msg:"Please fill all the fields"})
        }

        const client = await Client.create({
            clientName,
            clientPhone,
            clientAddress,
            clientGender,
            clientShirt:null,
            clientPant:null
        })

        return res.status(200).json({success:true,msg:"Client created successfully",client})
    } catch (error) {
        return res.status(400).json({success:false,msg:"Something went wrong in creating client"})
    }
}