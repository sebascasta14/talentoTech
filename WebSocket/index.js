const express = require('express')
const app = express()
const router = express.Router()
require('dotenv').config()

const socket = require('socket.io')
const http = require('http').Server(app)
const io = socket(http)

const DB_URL = process.env.DB_URL || ""
const port = process.env.PORT || 3001

const moongose = require('mongoose')
moongose.connect(DB_URL)

const userRoutes = require('./routes/userRoutes.js')
const houseRoutes = require('./routes/houseRoutes.js') 
const messageRoutes = require('./routes/messageRouters.js')

const MessageSchema = require('./models/Message.js')


router.get('/', async (req, res) =>{
    res.send('Hello World')
    }
)

io.on('connect', (socket) =>{
    console.log(`connected`)

    socket.on('message', (data)=>{
        const payload = JSON.parse(data)
        console.log(payload)
        MessageSchema(payload).save().then((result)=>{
            socket.broadcast.emit('message-receipt', payload)
        }
        ).catch((err) => {
            console.log({"status": "errr", "message": err.message})
        })
    })
    socket.on('disconnect', (socket) => {
        console.log("disconnect")    
    })
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use((req, res, next)=>{
    res.io = io
    next()
})

app.use(router)
app.use('/uploads', express.static('uploads'))
app.use('/', userRoutes)
app.use('/', houseRoutes)
app.use('/', messageRoutes)


http.listen(port,() =>
    console.log(port)
)