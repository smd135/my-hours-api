import NextShift from "../models/nextShift.js";
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

export const addNextShift = async (req, res) => {
   const { start_at, next_etc } = req.body

   try {
      const user = await User.findById(req.user._id);
      const nextShift = new NextShift({
         start_at, next_etc
      })
      await nextShift.save()
      await User.findByIdAndUpdate(req.user._id, {
         $push: { nextShifts: nextShift }
      })
      res.json(nextShift)
   } catch (error) {
      console.log(error)
      res.json(error)
   }
}

export const getAllNexts = async (req, res) => {
   const nexts = await NextShift.find().sort('-createdAt');
   try {
      if (!nexts) {
         return res.json({ message: "Немає запланованих поїздок" })
      }
      res.json(nexts)
   } catch (error) {
      console.log(error)
   }
}
export const getNextById = async (req, res) => {
   const { id } = req.body
   const nexts = await NextShift.findById(req.params.id)
   try {
      if (!nexts) {
         return res.json({ message: "Поїздку не знайдено" })
      }
      res.json(nexts)
   } catch (error) {
      console.log(error)
   }
}
export const editNext = async (req, res) => {
   const { id, start_at, next_etc } = req.body
   const nexts = await NextShift.findOneAndUpdate(id);
   nexts.start_at = start_at
   nexts.next_etc = next_etc
   try {
      if (!nexts) {
         return res.json({ message: "Дану поїздку не знайдено" })
      }
      await nexts.save()
      res.json(nexts)
   } catch (error) {
      console.log(error)
      res.json({ message: "Сталася помилка" })
   }
}
export const deleteNext = async (req, res) => {
   try {
      const id = req.params.id
      const route = await NextShift.findByIdAndDelete(id)
      if (!route) return res.json({ message: 'Маршрут не знайдений!' })
      await User.findByIdAndUpdate(req.userId, {
         $pull: { routes: req.params.id }
      })
      res.json({ message: "Поїздку видалено!" })
   } catch (error) {
      res.json({ message: 'Щось пішло не так !' })
   } ``
}