const moongose = require('mongoose')

let UserSchema = new moongose.Schema({
    id: Number,
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
              // Expresión regular para validar el formato del correo electrónico
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} no es un correo electrónico válido!`
          }
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    }
})

module.exports = moongose.model('user', UserSchema)