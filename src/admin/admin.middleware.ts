import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response,Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { conectarDB } from '../../src/database/mongo.js';
import { ObjectId } from 'mongodb';
dotenv.config()

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.token

      if (!token) {
        console.log('Token inexistente');
        
        return res.status(401).json({error:'Error de autenticación'})
      }

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      console.log(decoded);
      
      const userID = decoded.userID

      const db = await conectarDB()
      const users = await db.collection('users')

      const userData = await users.findOne({_id:new ObjectId(userID)},{projection:{password:0}})

      if (!userData?.rol.includes('admin')) {
        return res.status(401).json({error:'No eres administrador, no puedes visitar esta ruta'})
      }

      req.user = userData

      next()
      

    } catch (error) {
      console.log(error);
      
      console.log('Error de verificación de token');
      
      return res.status(401).json({error:'Error de autenticación'})
    }
  }
}