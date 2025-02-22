import express from 'express'
// import { mapRouter } from './MapRoutes';
import { addShirtMap,addPantMap,getUpComingMaps,getPastMaps ,tickCompleted,getCompletedMaps} from './../Controllers/mapController.js';

export const mapRouter = express.Router()

mapRouter.post('/addShirtMap',addShirtMap)
mapRouter.post('/addPantMap',addPantMap)
mapRouter.get('/getUpComingMaps',getUpComingMaps)
mapRouter.get('/getPastMaps',getPastMaps)
mapRouter.get('/getCompletedMaps',getCompletedMaps)

mapRouter.post('/tickCompleted/:clientId',tickCompleted)

