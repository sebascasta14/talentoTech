const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const UserSchema = require('../models/User.js')
const UserController = require('../controllers/userController.js')
const multer = require('multer')
const userController = new UserController()


router.get('/user', async (req, res) =>{
    let users = await UserSchema.find()
    res.send(users)
    }
)

// router.get('/user/:id', async (req, res) =>{
//     const id = req.params.id
//     const user = await UserSchema.findById(id)
//     res.send(user)
//     }
// )

router.get('/user/:email', async (req, res) =>{
    const query = UserSchema.where({email: req.params.email})
    const user = await query.findOne()
    res.send(user)
    }
)

router.post('/user', async (req, res) =>{
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
})

router.patch('/user/:id', userController.validateToken, (req, res) =>{
    const id = req.params.id
    let updateUser ={
        id: req.body.id,
        name: req.body.name,
        lastName: req.body.lastname,
        email: req.body.email,
    }
    UserSchema.findByIdAndUpdate(id, updateUser, {new: true}).then((result) =>{
        res.send(result)
    }).catch((err)=>{
        console.log(err)
        res.send("Error actualizando el registro")
    })
    }
)
router.delete('/user/:id', userController.validateToken, (req, res) =>{
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
)

router.post('/login', (req, res) =>{
    const email = req.body.email
    const password = req.body.password

    userController.login(email, password).then((result) => {
        res.send(result)
    })
})


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname )
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true)
    }else{
        cb(new Error ('El archivo no es una imagen'))
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter})

router.post('/upload/:id/user', upload.single('file'), (req, res) =>{
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
})


module.exports = router