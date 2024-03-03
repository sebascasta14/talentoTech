const { buildSchema } = require('graphql')

const schema = buildSchema(`
    type User {
        id: ID!
        name: String!
        lastname: String!
        email: String!
        avatar: String!
    }
    type Message {
        id: ID!
        body: String! 
        from: User!
        to: User!
        readed: Boolean
    }
    type House {
        id: ID!
        address: String! 
        city: String!
        state: String!
        size: Int!
        type: String!
        zip_code: String!
        rooms: Int!
        bathrooms: Int!
        parking: Boolean
        price: Int!
        code: Int!
        image: String!
    }
    type Query {
        hello: String 
        User(id: ID!): User
        Users: [User]
        UsersByFilter(filter: FilterInput): [User]
    }
    input UserFilterInput {
        name: String
        lastname: String
        email: String
    }

`)

module.exports = schema
