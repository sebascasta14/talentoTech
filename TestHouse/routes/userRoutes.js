const express = require('express')
const router = express.Router()
const multer = require('multer')

const UserController = require('../controllers/userController.js')
const userController = new UserController()

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

router.get('/user', userController.getAll)
router.get('/user/:id', userController.getById)
router.get('/user/:email', userController.getByEmail)
router.post('/user', userController.create)
router.post('/upload/:id/user', upload.single('file'), userController.newImage)
router.patch('/user/:id', userController.validateToken, userController.update)
router.delete('/user/:id', userController.validateToken, userController.delete)

router.post('/login', userController.login)

module.exports = router