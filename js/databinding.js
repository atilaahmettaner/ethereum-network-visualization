const express = require('express')
const app=express();

const {graphqlHTTP}=require('express-graphql');
const graphql = require("graphql");
const {GraphQLSchema,GraphQLObjectType,GraphQLInt,GraphQLString, getOperationRootType,GraphQLList}=graphql
const port= 6969
const schema=require("../Schemas")
const http = require("http");

app.use('/graphql',graphqlHTTP({

        schema,
        graphiql:true
    }

))

app.listen(port,()=>{
    console.log("server is running listening :" ,"localhost:",port)
});
