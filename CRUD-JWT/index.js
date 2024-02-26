const express = require('express')
const app = express()
require('dotenv').config()

const DB_URL = process.env.DB_URL || ""
const port = process.env.PORT || 3001

const moongose = require('mongoose')
moongose.connect(DB_URL)

const userRoutes = require('./routes/userRoutes.js')
const houseRoutes = require('./routes/houseRoutes.js') 

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/uploads', express.static('uploads'))
app.use('/', userRoutes)
app.use('/', houseRoutes)

app.listen(port,() =>
    console.log(port)
)