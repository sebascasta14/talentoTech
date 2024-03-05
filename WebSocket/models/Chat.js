const moongose = require('mongoose')

let ChatSchema = new moongose.Schema({
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
    message: {
        type: [{
            type: moongose.Schema.Types.ObjectId,
            ref: 'message'
        }],
        required: true
    }
},{
    timestamps: true
})

module.exports = moongose.model('chat', ChatSchema)
