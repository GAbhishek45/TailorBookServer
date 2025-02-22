import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
// import { dotenv } from 'dotenv';
// import {dbConnect}
import { dbConnect } from './Config/dbConnect.js';
import { userRouter } from './Routes/userRoutes.js';
import { clientRouter } from './Routes/ClientRoutes.js';
import { mapRouter } from './Routes/MapRoutes.js';
import  Client  from './Models/Client.js';
import  Shirt  from './Models/Shirt.js';
import  Pant  from './Models/Pant.js';
import  User  from './Models/User.js';

dotenv.config();

const app = express();

app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT"],
    allowedHeaders: ["Content-Type"],
}));
app.use(bodyParser.json());
app.use(express.json())



app.use('/api/users',userRouter);
app.use('/api/client',clientRouter)
app.use('/api/map',mapRouter)

app.get("/del",async(req,res)=>{
    await Client.deleteMany({});
    await Shirt.deleteMany({});
    await Pant.deleteMany({});
    await User.deleteMany({});

    res.send("Deleted")
})

dbConnect();

app.get('/count', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

        // Fetch all clients with their orders
        const clients = await Client.find({})
            .populate("clientShirt")
            .populate("clientPant");

        let upcomingCount = 0;
        let pastDueCount = 0;
        let completedCount = 0;

        clients.forEach(client => {
            const shirts = Array.isArray(client.clientShirt) ? client.clientShirt : client.clientShirt ? [client.clientShirt] : [];
            const pants = Array.isArray(client.clientPant) ? client.clientPant : client.clientPant ? [client.clientPant] : [];

            // Count upcoming orders
            upcomingCount += shirts.filter(shirt => new Date(shirt.deliveryDate) >= today && shirt.isPending && !shirt.completed).length;
            upcomingCount += pants.filter(pant => new Date(pant.deliveryDate) >= today && pant.isPending && !pant.completed).length;

            // Count past due orders
            pastDueCount += shirts.filter(shirt => new Date(shirt.deliveryDate) < today && shirt.isPending && !shirt.completed).length;
            pastDueCount += pants.filter(pant => new Date(pant.deliveryDate) < today && pant.isPending && !pant.completed).length;

            // Count completed orders
            completedCount += shirts.filter(shirt => shirt.completed === true && !shirt.isPending).length;
            completedCount += pants.filter(pant => pant.completed === true && !pant.isPending).length;
        });

        return res.status(200).json({
            success: true,
            msg: "Order counts fetched successfully",
            counts: {
                upcoming: upcomingCount,
                pastDue: pastDueCount,
                completed: completedCount
            }
        });

    } catch (error) {
        console.error("Error in counting orders:", error);
        return res.status(500).json({ success: false, msg: "Something went wrong while counting orders" });
    }
});


app.get('/', (req, res) => {
    res.send("Hello World");
});


app.listen(process.env.PORT,"0.0.0.0", () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})