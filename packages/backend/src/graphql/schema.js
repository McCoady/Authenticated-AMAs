const AuthSchema = require("./auth.graphql.js");
const PostsSchema = require("./posts.graphql.js");

const typeDefs = [AuthSchema, PostsSchema];

module.exports = typeDefs;
