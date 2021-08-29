const AuthSchema = require("./auth.graphql.js");
const TestSchema = require("./test.graphql.js");

const typeDefs = [AuthSchema, TestSchema];

module.exports = typeDefs;
