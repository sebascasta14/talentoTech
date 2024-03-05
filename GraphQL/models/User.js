const moongose = require('mongoose')

let UserSchema = new moongose.Schema({
    id: {
        type: Number, 
        required: true,
        unique: true
    },
    name: {
        type: String, 
        required: true,
        validate: {
            validator: function(name) {
              return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/.test(name);
            },
            message: props => `${props.value} no es un nombre válido!`
          }
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
        type: String
    }
})

module.exports = moongose.model('user', UserSchema)