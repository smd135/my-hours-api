import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'

import { validationResult } from 'express-validator'

export const register = async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json(errors.array())
      }
      const { email, username, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const doc = new UserModel({
         email,
         username,
         avatarUrl: req.body.avatarUrl,
         passwordHash: hash
      })
      const user = await doc.save()
      // const secret = process.env.jwt_secret
      const secret = 'uiCKlEAvERfo'
      const token = jwt.sign({
         _id: user._id
      }, secret, { expiresIn: '30d' })

      const { passwordHash, ...userData } = user._doc;

      res.json({ ...userData, token })
   } catch (error) {
      res.json({ message: "Не вдалося зареєструватися" })
   }

}

export const login = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
         return res.status(404).json({ message: "Користувача не знайдено" });
      }
      const hashedPassword = user._doc.passwordHash;
      const isValidPass = await bcrypt.compare(password, hashedPassword)
      if (!isValidPass) {
         return res.status(400).json({ message: "Невірний логін або пароль" });
      }

      // const secret = process.env.jwt_secret
      const secret = "uiCKlEAvERfo"
      const token = jwt.sign({
         _id: user._id
      }, secret, { expiresIn: '30d' })

      const { passwordHash, ...userData } = user._doc;

      res.json({ ...userData, token })

   } catch (error) {
      res.json({ error: "Не вдалося ввійти" })
      console.log(error)
   }
}

export const getMe = async (req, res) => {
   try {
      const user = await UserModel.findById(req.userId)
      if (!user) return res.status(404).json({ message: "Користувача не знайдено" })

      const { passwordHash, ...userData } = user._doc;
      res.json({ ...userData })

   } catch (error) {
      console.log(error)
      res.json({ message: "Немає доступу" })
   }
}