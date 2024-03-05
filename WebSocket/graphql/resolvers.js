const UserSchema = require('../models/User.js')

const resolvers = {
    hello: () => {
        return "hello world"
    },
    User: async ({id}) => {
        try{
            return user = await UserSchema.findById(id)
        }catch(err){
            console.log(`error: ${err}`)
        }
    },
    Users: async () => {
        try{
            return await UserSchema.find()
        }catch(err){
            console.log(`error: ${err}`)
        }
    },
    UsersByFilter: async () => {

    }
}

module.exports = resolvers