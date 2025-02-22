
// import ca from './../../Client/node_modules/react-native-paper-dates/lib/module/translations/ca';
import Shirt from './../Models/Shirt.js';
import Client from './../Models/Client.js';
import Pant from './../Models/Pant.js';

export const addShirtMap = async (req, res) => {
    try {
        const {clientId,chest,waist,length,shoulder,sleeveLength,neck,wrist,remark,deliveryDate,notedBy,mainImg} = req.body;
        const client = await Client.findById(clientId);
        if (!clientId) {
            return res.status(400).json({ success: false, msg: "Client ID is required" });
        }

        const deletePreviousShirts = await Shirt.deleteMany({clientId:clientId});
        const shirt = await Shirt.create({
            clientId,
            chest,
            waist,
            length,
            shoulder,
            sleeveLength,
            neck,
            wrist,
            remark,
            deliveryDate,
            notedBy,
            mainImg
        })

        
        if (!client) {
            return res.status(404).json({ success: false, msg: "Client not found" });
        }

        client.clientShirt = shirt._id; // Store Shirt ObjectId in clientShirt
        await client.save();

        return res.status(200).json({ success: true, msg: "Shirt measurement added successfully", client });

    } catch (error) {
        return res.status(500).json({success:false,msg:"Something went wrong in adding map"})
    }
}
export const addPantMap = async (req, res) => {
    try{
        const {clientId,kamar,mori,length,Jang,Seat,remark,deliveryDate,notedBy,mainImg} = req.body;
        const client = await Client.findById(clientId);

        if (!clientId) {
            return res.status(400).json({ success: false, msg: "Client ID is required" });
        }
        const deleteExistingPants = await Pant.deleteMany({clientId:clientId});
        const pant = await Pant.create({
            clientId,
            kamar,
            mori,
            length,
            Jang,
            Seat,
            remark,
            deliveryDate,
            mainImg
        })

        if (!client) {
            return res.status(404).json({ success: false, msg: "Client not found" });
        }

        client.clientPant = pant._id; // Store Pant ObjectId in clientPant
        await client.save();

        return res.status(200).json({ success: true, msg: "Pant measurement added successfully", client });
    }catch(error){
        return res.status(500).json({success:false,msg:"Something went wrong in adding map pant"})
    }
}


const getUpComingMaps = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

        // Fetch all clients with their shirt and pant orders populated
        const clients = await Client.find({})
            .populate("clientShirt")
            .populate("clientPant");

        // Filter upcoming orders correctly
        const filteredClients = clients.map(client => {
            const shirts = Array.isArray(client.clientShirt) ? client.clientShirt : client.clientShirt ? [client.clientShirt] : [];
            const pants = Array.isArray(client.clientPant) ? client.clientPant : client.clientPant ? [client.clientPant] : [];

            // Filter upcoming orders that are still pending
            const upcomingShirts = shirts.filter(shirt => 
                new Date(shirt.deliveryDate) >= today && shirt.isPending && !shirt.completed
            );
            const upcomingPants = pants.filter(pant => 
                new Date(pant.deliveryDate) >= today && pant.isPending && !pant.completed
            );

            // Return clients who have upcoming pending orders (shirts, pants, or both)
            if (upcomingShirts.length > 0 || upcomingPants.length > 0) {
                return {
                    ...client.toObject(),
                    clientShirt: upcomingShirts.length > 0 ? upcomingShirts : null,
                    clientPant: upcomingPants.length > 0 ? upcomingPants : null
                };
            }
            return null;
        }).filter(client => client !== null);

        return res.status(200).json({ success: true, msg: "Upcoming pending orders fetched successfully", clients: filteredClients });

    } catch (error) {
        console.error("Error in getUpComingMaps:", error);
        return res.status(500).json({ success: false, msg: "Something went wrong in fetching upcoming orders" });
    }
};


const getPastMaps = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

        // Fetch all clients with their shirt and pant orders populated
        const clients = await Client.find({})
            .populate("clientShirt")
            .populate("clientPant");

        // Filter past orders correctly
        const filteredClients = clients.map(client => {
            const shirts = Array.isArray(client.clientShirt) ? client.clientShirt : client.clientShirt ? [client.clientShirt] : [];
            const pants = Array.isArray(client.clientPant) ? client.clientPant : client.clientPant ? [client.clientPant] : [];

            // Filter past orders that are still pending
            const pastShirts = shirts.filter(shirt => 
                new Date(shirt.deliveryDate) < today && shirt.isPending && !shirt.completed
            );
            const pastPants = pants.filter(pant => 
                new Date(pant.deliveryDate) < today && pant.isPending && !pant.completed
            );

            // Return clients who have past pending orders (shirts, pants, or both)
            if (pastShirts.length > 0 || pastPants.length > 0) {
                return {
                    ...client.toObject(),
                    clientShirt: pastShirts.length > 0 ? pastShirts : null,
                    clientPant: pastPants.length > 0 ? pastPants : null
                };
            }
            return null;
        }).filter(client => client !== null);

        return res.status(200).json({ success: true, msg: "Past pending orders fetched successfully", clients: filteredClients });

    } catch (error) {
        console.error("Error in getPastMaps:", error);
        return res.status(500).json({ success: false, msg: "Something went wrong in fetching past orders" });
    }
};




const getCompletedMaps = async (req, res) => {
    try {
        // Fetch all clients with their shirt and pant orders populated
        const clients = await Client.find({})
            .populate("clientShirt")
            .populate("clientPant")
            .lean();  // Convert Mongoose documents to plain objects for modification

        // Filter and return only clients with completed orders
        const filteredClients = clients.map(client => {
            const shirts = Array.isArray(client.clientShirt) ? client.clientShirt : client.clientShirt ? [client.clientShirt] : [];
            const pants = Array.isArray(client.clientPant) ? client.clientPant : client.clientPant ? [client.clientPant] : [];

            // Filter completed items
            const completedShirts = shirts.filter(shirt => shirt?.completed === true && shirt?.isPending === false);
            const completedPants = pants.filter(pant => pant?.completed === true && pant?.isPending === false);

            // If the client has completed items, return them with full details
            if (completedShirts.length > 0 || completedPants.length > 0) {
                return {
                    ...client,
                    clientShirt: completedShirts.length > 0 ? completedShirts : null,
                    clientPant: completedPants.length > 0 ? completedPants : null
                };
            }
            return null;
        }).filter(client => client !== null); // Remove null values

        return res.status(200).json({ success: true, msg: "Completed orders fetched successfully", clients: filteredClients });

    } catch (error) {
        console.error("Error in getCompletedMaps:", error);
        return res.status(500).json({ success: false, msg: "Something went wrong in fetching completed orders" });
    }
};
const tickCompleted = async (req, res) => {
    try {
        const { clientId } = req.params;
        const client = await Client.findById(clientId);
        
        if (!client) {
            return res.status(404).json({ success: false, msg: "Client not found" });
        }

        const { clientShirt, clientPant } = client;
        if (!clientShirt && !clientPant) {
            return res.status(400).json({ success: false, msg: "Client has no orders" });
        }

        if (clientShirt) {
            const clientShirtObj = await Shirt.findById(clientShirt._id);
            if (clientShirtObj) {
                clientShirtObj.completed = true;
                clientShirtObj.isPending = false;
                await clientShirtObj.save();
            }
        }

        if (clientPant) {
            const clientPantObj = await Pant.findById(clientPant._id);
            if (clientPantObj) {
                clientPantObj.completed = true;
                clientPantObj.isPending = false;
                await clientPantObj.save();
            }
        }

        return res.status(200).json({ success: true, msg: "Orders completed successfully" });
    } catch (error) {
        console.error("Something went wrong in tickCompleted", error);
        return res.status(500).json({ success: false, msg: "Something went wrong in tickCompleted" });
    }
};





export { getUpComingMaps, getPastMaps, tickCompleted, getCompletedMaps };