import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js'
import { register, login, logout, getMe } from './controllers/UserController.js'
import { createRoute, getAllRoutes, getById, getMyRoutes, removeRoute, updateRoute } from './controllers/RouteControllers.js'
import { addNextShift, getAllNexts, getNextById, editNext, deleteNext } from './controllers/nextShiftController.js';
import cookieParser from 'cookie-parser';
import { protect } from './middlewares/authMiddleware.js'

const app = express();

// middlewares
//app.use(cors())
app.use(cors({ credentials: true, origin: 'https://routes-254a1.web.app' }))
// app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))


app.use(express.json())
app.use(cookieParser())
dotenv.config({ path: './.env' })
//variables
const PORT = 5006;
const MONGO_URL = process.env.MONGO_URL

// const db_password = process.env.db_password
//*****************************************/
function InitDB() {
   try {
      mongoose.connect(`mongodb+srv://misiailoyurii:pamito57@cluster0.idtz4it.mongodb.net/new_routes?retryWrites=true&w=majority&appName=Cluster0`)
      console.log(`Your DB is successfully connected`)
   } catch (error) {
      console.log(error)
   }
}
InitDB()

// Register, Login, GetMe
app.post('/auth/register', registerValidation, register)
app.post('/auth/login', login)
app.post('/auth/logout', logout)
app.get('/auth/me', protect, getMe)


// CRUD routes
app.get('/routes', protect, getAllRoutes)
app.get('/routes/:id', getById)
app.post('/routes', protect, createRoute)
app.delete('/routes/:id', protect, removeRoute)
app.put('/routes', protect, updateRoute)
// next shift feature
app.post('/next', protect, addNextShift)
app.get('/next', protect, getAllNexts)
app.get('/next/:id', protect, getNextById)
app.put('/next', protect, editNext)
app.delete('/next/:id', protect, deleteNext)
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`)
})
