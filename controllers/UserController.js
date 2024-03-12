import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

import { validationResult } from 'express-validator'

export const register = async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json(errors.array())
      }
      const { email, name, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const doc = new UserModel({
         email,
         name,
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
// @desc Auth a user
// @route POST /auth/login
export const login = async (req, res) => {
   try {
      const { email, password } = req.body;
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