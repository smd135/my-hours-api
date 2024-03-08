import jwt from 'jsonwebtoken';

export default (req, res, next) => {
   const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
   if (token) {
      try {
         const secret = process.env.jwt_secret
         const decoded = jwt.verify(token, secret)

         req.userId = decoded._id;
         next();
      } catch (error) {
         console.log(error)
         return res.json({ messge: "Немає доступу" })
      }
   } else {
      return res.status(403).json({ message: 'Немає доступу' })
   }

}

