import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Protect routes
export const protect = async (req, res, next) => {
   let token = req.cookies.jwt
   // Read JWT from cookie
   if (token) {
      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET)
         req.user = await User.findById(decoded.userId).select('-password')
         next()
      } catch (error) {
         console.log(error)
         res.json({ message: "Not authorized, no token", error })
      }
   } else {
      console.log('Not authorized, no token')
      res.json({ message: 'Not authorized, no token' })
   }
}