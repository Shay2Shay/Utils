const { gql } = require('apollo-server-express');
const userModel = require("./../models/userSchema");
const adminSchema = require("./../models/adminSchem");
const uri = require('./../mongoUtils/mongo_pass')
const jwt = require('jsonwebtoken')

const { mongoose } = require('mongoose');

exports.typeDefs = gql `
type User {
    name: String,
    password: String,
    age: Int
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
    updateUser(token: String! , name: String, password: String, age: Int): Boolean!
    addUser(name: String, password: String, age: Int): Boolean!
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
            const result = userModel.find({}).then((res) => {
                if (res) {
                    return res;
                }
            })
            return result;

        },
        getUser: async (parent, args) => {
            await connect();
            const result = userModel.findById(args.id).then((res) => {
                if (res) {
                    return res;
                }
            })
            return result;

        },
        loginUser: async (parent, args) => {
            try {
                await connect();
                const result = await userModel.find({
                    name: args.name,
                    password: args.password
                })
                if (result.length > 0){
                    let tkn  = await userModel.genrateAuthToken();
                    return tkn;
                }else {
                    return "Failed"
                }
            }catch (e){
                console.log(e)
                return "Failed"
            }
        },
        loginAdmin: async (parent, args) => {
            await connect();
            const result = await adminSchema.find({
                name: args.name,
                password: args.password
            })
            if (result.length > 0){
                let tkn  = await adminSchema.genrateAuthToken();
                return tkn;
            }else {
                return "Failed"
            }
        }

    },

    Mutation: {
        updateUser: async (parent, args) => {
            const token = args.token
            jwt.verify(token,"LAB",async (err,decoded)=>
            {
                if(err)
                {
                    console.log("Verification Failed")
                    return false
                }

                console.log("verified user")
            })
            await connect();
            const result = userModel.findByIdAndUpdate(args.id, 
                {
                    name: args.name,
                    password: args.password,
                    age: args.age,
                })
            return true;
        },
        addUser :  async (parent, args) => {
            try {
                await connect();
                let product = new userModel({
                    name: args.name,
                    password: args.password,
                    age: args.age,
                });
                const result = await product.save()
                return true;
            } catch (e){
                console.log(e)
                return false
            }
        },
        deleteUser:  async (parent, args) => {
            const token = args.token
            jwt.verify(token,"LAB",async (err,decoded)=>
            {
                if(err)
                {
                    console.log("Verification Failed")
                    return false
                }
                console.log("verified user")
            })
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
