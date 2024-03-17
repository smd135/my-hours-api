import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
   const secret = 'uiCKlEAvERfo'
   const token = jwt.sign({ userId }, secret, { expiresIn: '30d' })

   // Set JWT as HTTP-Only cookie
   return res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 Days
   })
}

export default generateToken