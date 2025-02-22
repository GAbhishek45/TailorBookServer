import express from "express";
// import { clientRouter } from './ClientRoutes';
import { getAllClients,createClient } from './../Controllers/ClientControllers.js';


export const clientRouter = express.Router();

clientRouter.get("/getAllClients",getAllClients)

clientRouter.post('/createClient',createClient)
