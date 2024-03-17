import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Protect routes
export const protect = async (req, res, next) => {
   let token;
   token = req.cookies.jwt
   // Read JWT from cookie
   if (token) {
      try {
         const secret = 'uiCKlEAvERfo'
         const decoded = jwt.verify(token, secret)
         req.user = await User.findById(decoded.userId).select('-password')
         next()
      } catch (error) {
         console.log(error)
         res.json("Not authorized, token failed", error)
      }
   } else {
      console.log('Not authorized, no token')
      res.json("Not authorized, no token")
   }
}