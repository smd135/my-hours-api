import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'
import generateToken from '../utils/generateToken.js'

import { validationResult } from 'express-validator'

// @desc Auth a user
// @route POST /auth/login
export const register = async (req, res) => {
   const { email, name, password } = req.body;
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json(errors.array())
      }
      const userExists = await UserModel.findOne({ email })

      if (userExists) {
         res.status(400).json({ message: 'Такий користувач вже існує' })
      }


      const user = await UserModel.create({
         name, email, password
      })
      if (user) {
         generateToken(res, user._id)
         res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
         })
      }


   } catch (error) {
      console.log(error)
      res.json({ message: "Не вдалося зареєструватися", error })
   }

}
// @desc Auth a user
// @route POST /auth/login

export const login = async (req, res) => {
   const { email, password } = req.body;
   try {

      const user = await UserModel.findOne({ email });
      if (user && (await user.matchPassword(password))) {
         generateToken(res, user._id)
         res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
         })

      } else {
         return res.status(401).json({ message: "Неправильний логін або пароль" });
      }
   } catch (error) {
      res.json({ error: "Не вдалося ввійти", error })
      console.log(error)
   }
}
export const logout = async (req, res) => {
   try {
      const { email, password } = req.body;

   } catch (error) {
      res.json({ error: "Не вдалося ввійти", error })
      console.log(error)
   }
}

export const getMe = async (req, res) => {
   try {
      const user = await UserModel.findById(req.user._id)

      if (user) {
         return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
         })
      } else {
         res.json('Користувача не знайдено')
      }

   } catch (error) {
      console.log(error)
      res.json({ message: "Немає доступу" })
   }
}