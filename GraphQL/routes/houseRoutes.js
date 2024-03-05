const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const HouseSchema = require('../models/House.js')
const multer = require('multer')


router.get('/house', async (req, res) =>{
    let houses = await HouseSchema.find()
    res.send(houses)
    }
)

router.get('/house/:code', async (req, res) =>{
    const query = HouseSchema.where({code: req.params.code})
    const house = await query.findOne()
    res.send(house)
    }
)

router.post('/house', async (req, res) =>{
    let house = HouseSchema({
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        size: req.body.size,
        type: req.body.type,
        zip_code: req.body.zip_code,
        rooms: req.body.rooms,
        bathrooms: req.body.bathrooms,
        parking: req.body.parking,
        price: req.body.price,
        code: req.body.code
    })
        
    house.save()
        .then((result) => {res.send(result)})
        .catch((err) => {
            if(err.code == 11000){
                res.send({  
                    "status": "failed",
                    "message": "El codigo ya ha sido registrado"
                })
            }else{
                res.send({  
                    "status": "failed",
                    "message": "Error almacenando la informacion"
                })
            }
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

router.post('/upload/:code/houses', upload.single('file'), async (req, res) =>{
    if(!req.file){
        return res.status(400).send({
            "status": "error",
            "message": "No se proporciono un archivo"
        })
    }

    const query = HouseSchema.where({code: req.params.code})
    const house = await query.findOne()

    const updateHouse = {
        image: req.file.path
    }

    HouseSchema.findOneAndUpdate(house, updateHouse, {new: true}).then((result) =>{
        res.send({
            "status": "sucess",
            "message": "Archivo subido correctamente"
        })
    }).catch((err)=>{
        console.log(err)
        res.send("Error actualizando el registro")
    })
})


router.patch('/house/:code', async (req, res) =>{

    const query = HouseSchema.where({code: req.params.code})
    const house = await query.findOne()

    let updateHouse = HouseSchema({
        _id: house._id,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        size: req.body.size,
        type: req.body.type,
        zip_code: req.body.zip_code,
        rooms: req.body.rooms,
        bathrooms: req.body.bathrooms,
        parking: req.body.parking,
        price: req.body.price,
    })
    HouseSchema.findOneAndUpdate(house, updateHouse, {new: true}).then((result) =>{
        res.send(result)
    }).catch((err)=>{
        console.log(err)
        res.send("Error actualizando el registro")
    })
    }
)

router.delete('/house/:code', async (req, res) =>{

    const code = req.params.code

    await HouseSchema.deleteOne({code: code}).then(() => {
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


module.exports = router