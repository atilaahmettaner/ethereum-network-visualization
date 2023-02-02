const graphql=require("graphql")
const {GraphQLSchema,GraphQLObjectType,GraphQLInt,GraphQLString, getOperationRootType,GraphQLList}=graphql
const UserType=require("C:\\Users\\Atila\\Documents\\GitHub\\ethereum-network-visualization\\Schemas\\TypeDefs\\UserTypes.js")
const userData=require('C:\\Users\\Atila\\Documents\\GitHub\\ethereum-network-visualization\\MOCK_DATA.json')

const ROOTquery =new GraphQLObjectType({
        name:"RootQueryType",
        fields: {
            getAllUsers: {
                type: new GraphQLList(UserType),
                args: {id: {type: GraphQLInt}},
                resolve(parent,args){
                    return userData;
                }
            }
        }

    }

)

const Mutation =new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString},
                lastName: { type: GraphQLString},
                email: { type: GraphQLString},
                password: { type: GraphQLString},
            },
            resolve(parent,args){
                userData.push({id:userData.length+1,firstName:args.firstName,lastName:args.lastName,email:args.email,password:args.password})
                return args
            }
        }
    }
});


module.exports=new GraphQLSchema({  query:ROOTquery,mutation:Mutation })



