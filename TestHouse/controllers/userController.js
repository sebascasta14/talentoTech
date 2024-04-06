const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserSchema = require('../models/User.js')

require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET ?? ""


class userController {
    constructor(){}

    async getAll (req, res){
        const users = await UserSchema.find()
        res.send(users)
    }

    async getById (req, res){        
        const id = req.params.id
        const user = await UserSchema.findById(id)
        res.send(user)
        }

    async getByEmail (req, res){
        const query = UserSchema.where({email: req.params.email})
        const user = await query.findOne()
        res.send(user) 
    }

    async create (req, res){
        const hashPassword = await bcrypt.hash(req.body.password, 10)
    
        let user = UserSchema({
            id: req.body.id,
            name: req.body.name,
            lastName: req.body.lastname,
            email: req.body.email,
            password: hashPassword
        })
            
        user.save()
            .then((result) => {res.send(result)})
            .catch((err) => {
                if(err.code == 11000){
                    res.send({  
                        "status": "failed",
                        "message": "El correo ya ha sido registrado"
                    })
                }else{
                    res.send({  
                        "status": "failed",
                        "message": "Error almacenando la informacion"
                    })
                }
            })
    }

    async newImage (req, res){
        if(!req.file){
            return res.status(400).send({
                "status": "error",
                "message": "No se proporciono un archivo"
            })
        }
        const id = req.params.id
        const updateUser = {
            avatar: req.file.path
        }
    
        UserSchema.findByIdAndUpdate(id, updateUser, {new: true}).then((result) =>{
            res.send({
                "status": "sucess",
                "message": "Archivo subido correctamente"
            })
        }).catch((err)=>{
            console.log(err)
            res.send("Error actualizando el registro")
        })
    }

    async update (req, res){
        const id = req.params.id

        let hashedPassword
        if(req.body.password){ 
            hashedPassword = await bcrypt.hash(req.body.password, 10)
        }

        let updateUser ={
            id: req.body.id,
            name: req.body.name,
            lastName: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
        }
        
        UserSchema.findByIdAndUpdate(id, updateUser, {new: true}).then((result) =>{
            res.send(result)
        }).catch((err)=>{
            console.log(err)
            res.send("Error actualizando el registro")
        })
    }

    async delete (req, res){
        const id = req.params.id
        UserSchema.deleteOne({_id: id}).then(() => {
            res.json({
                "status": "sucess",
                "message": "User deleted successfully"
            })
        }).catch((err) => {
            console.log(err)
            res.json({  
                "status": "failed",
                "message": "Error deleting user"
            })
        })
    }
    
    async login (req, res){
        const email = req.body.email
        const password = req.body.password

        try{
            //Buscar al usuario con el email
            const user = await UserSchema.findOne({email})  
            if(!user){
                res.send( {
                    "status": "error",
                    "message": "El usuario no existe"
                })
            }
            
            //Comparar la contraseña con la que tengo en la base de datos
            const passwordMatch = await bcrypt.compare(password, user.password)
            if(!passwordMatch){
                res.send(  {
                    "status": "error",
                    "message": "Contraseña incorrecta"
                })
            }

            const token = jwt.sign({ 
                userId: user._id, 
                email: user.email, 
                avatar: user.avatar, 
                fullname: `${user.name} ${user.lastname}` 
            }, JWT_SECRET, { expiresIn: '1h' })

            user.password = null
            
            res.send({
                "status": "success",
                "token": token, 
                "user": user
            })
        }catch(err){
            console.log(err)
            res.send(  {
                "status": "error",
                "message": "Error al iniciar sesion"
            })
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