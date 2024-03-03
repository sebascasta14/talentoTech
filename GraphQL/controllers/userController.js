const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserSchema = require('../models/User.js')

require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET || ""


class userController {
    constructor(){
    }

    async login (email, password){
        try{
            //Buscar al usuario con el email
            const user = await UserSchema.findOne({email})  
            if(!user){
                return {
                    "status": "error",
                    "message": "El usuario no existe"
                }
            }
            
            //Comparar la contraseña con la que tengo en la base de datos
            const passwordMatch = await bcrypt.compare(password, user.password)
            if(!passwordMatch){
                return {
                    "status": "error",
                    "message": "Contraseña incorrecta"
                }
            }

            const token = jwt.sign({ userId: user._id, email: user.email}, JWT_SECRET, { expiresIn: '1h' })

            return {
                "status": "success",
                "token": token
            }
        }catch(err){
            console.log(err)
            return {
                "status": "error",
                "message": "Error al iniciar sesion"
            }
        }
    }

    validateToken(req, res, next){
        const bearerToken = req.headers['authorization']
        if(!bearerToken){
            return res.status(401).json({
                "message": "Token no existente"
            })
        }

        const token = bearerToken.startsWith('Bearer ') ? bearerToken.slice(7) : bearerToken
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).json({
                    "message": "Token invalido"
                })
            }
            req.userId = decoded.userId
            next()
        })
    }   
}

module.exports = userController