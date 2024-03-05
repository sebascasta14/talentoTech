const moongose = require('mongoose')

let MessageSchema = new moongose.Schema({
    body:{
        type: String,
        required: true
    },
    from:{
        type: moongose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    to:{
        type: moongose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    readed:{
        type: Boolean,
        required: true,
        default: false
    }
},{
    timestamps: true
})


module.exports = moongose.model('message', MessageSchema)
