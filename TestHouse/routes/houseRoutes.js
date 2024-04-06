const express = require('express')
const router = express.Router()
const multer = require('multer')

const HouseController = require('../controllers/houseController.js')
const houseController = new HouseController()

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

router.get('/house', houseController.getAll)
router.get('/house/:code', houseController.getByCode)
router.post('/house', houseController.create) 
router.post('/upload/:code/house', upload.single('file'), houseController.newImage)
router.patch('/house/:code', houseController.update)
router.delete('/house/:code', houseController.delete)

module.exports = router