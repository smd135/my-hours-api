import NextShift from "../models/nextShift.js";
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

export const addNextShift = async (req, res) => {
   const { next_at, next_etc } = req.body
   const secret = "uiCKlEAvERfo"
   const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
   const decoded = jwt.verify(token, secret)
   const id = decoded._id;

   try {
      // const user = await User.findById(id);
      const nextShift = new NextShift({
         next_at, next_etc
      })
      await nextShift.save()
      await User.findByIdAndUpdate(id, {
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
         return res.json({ messge: "Немає запланованих поїздок" })
      }
      res.json(nexts)
   } catch (error) {
      console.log(error)
   }
}