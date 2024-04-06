const HouseSchema = require('../models/House.js')
require('dotenv').config()

class houseController {
    constructor(){}

    async getAll (req, res){
        const houses = await HouseSchema.find()
        res.send(houses)
    }

    async getByCode (req, res){
        const query = HouseSchema.where({code: req.params.code})
        const house = await query.findOne()
        if(house){
            res.status(200).send(house)
        }else{
            res.status(404).send({  
                "status": "failed",
                "message": "Not Found"
            })
        }
    }

    async create (req, res){
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
                .then((result) => {res.status(201).send(result)})
                .catch((err) => {
                    if(err.code == 11000){
                        res.status(409).send({  
                            "status": "failed",
                            "message": "El codigo ya ha sido registrado"
                        })
                    }else{
                        res.status(400).send({  
                            "status": "failed",
                            "message": "Error almacenando la informacion" + err,
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
    }


    async update (req, res){

        const query = HouseSchema.where({code: req.params.code})
        const house = await query.findOne()
    
        if(house){
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
                res.status(200).send(result)
            })
        }else{
            res.status(500).send("Error actualizando el registro, casa no encontrada")
        }}

    async delete (req, res){
        const code = req.params.code
        const {deletedCount} = await HouseSchema.deleteOne({code: code})
        if (deletedCount === 0) {
            return res.status(500).json({
                        "status": "failed",
                        "message": "Error deleting house"
                    })
        }
        return res.status(200).json({
            "status": "success",
            "message": "House deleted successfully"
        })
    }
}

module.exports = houseController