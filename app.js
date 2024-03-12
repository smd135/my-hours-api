import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js'
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js'
import { createRoute, getAllRoutes, getById, getMyRoutes, removeRoute, updateRoute } from './controllers/RouteControllers.js'
import { addNextShift, getAllNexts } from './controllers/nextShiftController.js';
import cookieParser from 'cookie-parser';


const app = express();
// middlewares
app.use(cors())
app.use(express.json())
app.use(cookieParser())
dotenv.config({ path: './.env' })
//variables
// const PORT = process.env.PORT;

// const db_password = process.env.db_password
//*****************************************/
function InitDB() {
   try {
      mongoose.connect(`mongodb+srv://misiailoyurii:${db_password}@cluster0.idtz4it.mongodb.net/new_routes?retryWrites=true&w=majority&appName=Cluster0`)
      console.log(`Your DB is successfully connected`)
   } catch (error) {
      console.log(error)
   }
}
InitDB()

// Register, Login, GetMe
app.post('/auth/register', registerValidation, register)
app.post('/auth/login', login)
app.get('/auth/me', checkAuth, getMe)

// CRUD routes
app.get('/routes', getAllRoutes)
app.get('/routes/:id', getById)
app.post('/routes', checkAuth, createRoute)
app.delete('/routes/:id', checkAuth, removeRoute)
app.patch('/routes', checkAuth, updateRoute)
// next shift feature
app.post('/next', checkAuth, addNextShift)
app.get('/next', checkAuth, getAllNexts)

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`)
})
