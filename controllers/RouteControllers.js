import User from '../models/User.js';
import RouteSchema from '../models/Route.js'
import { differenceInMinutes, differenceInHours } from 'date-fns';
// Create new Shift (route)
export const createRoute = async (req, res) => {
   try {
      const { route_num, start_at, end_at, engine_type, engine_num, train_num, route_etc } = req.body
      const diff = differenceInMinutes(new Date(end_at), new Date(start_at));

      const user = await User.findById(req.userId)

      const newRoute = new RouteSchema({
         username: user.username,
         route_num, start_at, end_at, diff, engine_type, engine_num, train_num, route_etc, author: req.userId
      })
      await newRoute.save()
      await User.findByIdAndUpdate(req.userId,
         {
            $push: { routes: newRoute },
         }
      )
      res.json(newRoute)
   } catch (error) {
      console.log({ message: `Щось пішло не так ! ${error}` })
   }
}

export const getAllRoutes = async (req, res) => {
   try {
      const routes = await RouteSchema.find().sort('-createdAt')
      if (!routes) {
         return res.json({ message: 'Немає маршрутів !' })
      }
      res.json(routes)
   } catch (error) {
      res.json({ message: "Щось пішло не так !" })
   }
}
// Get route by ID
export const getById = async (req, res) => {
   try {
      const route = await RouteSchema.findById(req.params.id)
      if (!route) {
         return res.json({ message: 'Немає маршрутів !' })
      }
      res.json(route)
   } catch (error) {
      res.json({ message: "Щось пішло не так !" })
   }
}
// Get my routes
export const getMyRoutes = async (req, res) => {
   try {
      const user = await User.findById(req.userId)
      const list = await Promise.all(
         user.routes.map((route) => {
            return RouteSchema.findById(route._id)
         }),
      )
      res.json(list)

   } catch (error) {
      res.json({ message: 'Щось пішло не так !' })
   }
}
// Remove route
export const removeRoute = async (req, res) => {
   try {
      const route = await RouteSchema.findByIdAndDelete(req.params.id)
      if (!route) return res.json({ message: 'Маршрут не знайдений!' })
      await User.findByIdAndUpdate(req.userId, {
         $pull: { routes: req.params.id }
      })
      res.json({ message: "Маршрут видалено!" })
   } catch (error) {
      res.json({ message: 'Щось пішло не так !' })
   }
}
// Update route
export const updateRoute = async (req, res) => {
   try {
      const { route_num, start_at, end_at, engine_type, engine_num, train_num, route_etc } = req.body
      const { id } = req.body
      const route = await RouteSchema.findById(id)
      route.route_num = route_num;
      route.start_at = start_at;
      route.end_at = end_at;
      route.engine_type = engine_type;
      route.engine_num = engine_num;
      route.train_num = train_num;
      route.route_etc = route_etc;
      await route.save();

      res.json(route)
   } catch (error) {
      res.json({ message: `Не вдалося обновити маршрут !${error}` })
   }
}
