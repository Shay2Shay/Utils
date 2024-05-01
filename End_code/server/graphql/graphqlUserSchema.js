const { gql } = require('apollo-server-express');
const userSchema = require("./../models/userSchema");
const adminSchema = require("./../models/adminSchem");
const uri = require('./../mongoUtils/mongo_pass')

const { mongoose } = require('mongoose');

exports.typeDefs = gql `
type User {
    name: String,
    password: String,
    age: Number
}

type Admin {
    name: String,
    password: String
}

type Query {
    getUserAll: [User]
    getUser(id: ID!): User
    loginUser(name: String, password: String): String
    loginAdmin(name: String, password: String): String
}

type Mutation {
    updateUser(token: String! , name: String, password: String, age: Number): Product
    addUser(name: String, password: String, age: Number): Product
    deleteUser(token: String!): Boolean!
} `

const db_url  = uri

const connect = async () => {
    await mongoose.connect(db_url, { useNewUrlParser: true });
}


// =====================================================================================================================

exports.resolvers = {
    Query: {

        getUserAll: async (parent, args) => {
            await connect();
            const result = userSchema.find({}).then((res) => {
                if (res) {
                    return res;
                }
            })
            return result;

        },
        getUser: async (parent, args) => {
            await connect();
            const result = userSchema.findById(args.id).then((res) => {
                if (res) {
                    return res;
                }
            })
            return result;

        },
        loginUser: async (parent, args) => {
            await connect();
            const result = await userSchema.find({
                name: args.name,
                password: args.password
            })
            if (result.length > 0){
                let tkn  = await consumer.genrateAuthToken();
                return tkn;
            }else {
                return "Failed"
            }
        },
        loginAdmin: async (parent, args) => {}
        
    },

    Mutation: {
        updateUser: async (parent, args) => {
            await connect();
            const result = userSchema.findByIdAndUpdate(args.id, 
                {
                    name: args.name,
                    password: args.password,
                    age: args.age,
                }, {new: true}).then((res) => {
                    if (res) {
                        return res;
                    }
                })
            return result;
        },
        addUser :  async (parent, args) => {
            await connect();
            let product = new ProductModel({
                name: args.name,
                password: args.password,
                age: args.age,
            });
           const result = product.save().then((res) => {
                return res;
            })
            return result;
        },
        deleteUser:  async (parent, args) => {
            try {
                await connect();
                await ProductModel.findOneAndRemove({_id: args.id});
                return true;
            } catch (error) {
                console.log('Error while delete:',error);
                return false;
            }
            
        }
    }
}
