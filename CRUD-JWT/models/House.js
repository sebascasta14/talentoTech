const moongose = require('mongoose')
const fetch = require('node-fetch') // Importar fetch si estás en un entorno de Node.js


let HouseSchema = new moongose.Schema({

    address: {
      type: String,
      required: true
    },
    city: {
      required: true,
      type: String,
      validate:{
        validator: async function(city) {
        // Validacion de la ciudad
        const response = await fetch('https://api-colombia.com/api/v1/City');
        const cities = await response.json()
        return cities.some(object => object.name.toUpperCase().includes(city.toUpperCase()));
      },
        message: props => `${props.value} no es un Ciudad de Colombia!`
      }
    },
    state: {
      required: true,
      type: String,
      validate:{validator: async function(state) {
        // Validacion del departamento
        const response = await fetch('https://api-colombia.com/api/v1/Department');
        const departments = await response.json()
        return departments.some(department => department.name.toUpperCase().includes(state.toUpperCase()))
      },
        message: props => `${props.value} no es un Departamento de Colombia!`
      }
    },
    size: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    zip_code: {
      type: String,
      required: true
    },
    rooms: {
      type: Number,
      required: true
    },
    bathrooms: {
      type: Number,
      required: true
    },
    parking: {
      type: Boolean,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
              // Expresión regular para validar el formato del codigo, 4 Letras mayusculas, 4 numeros
                return /^[A-Z]{4}\d{4}$/.test(v)
            },
            message: props => `${props.value} no es un codigo válido!`
          }
    },
    image: String,

})

module.exports = moongose.model('house', HouseSchema)