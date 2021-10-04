require("dotenv").config();

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./src/graphql/schema");
const resolvers = require("./src/services/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const authToken = req.headers.authorization || "";
    return { authToken };
  },
  formatError: (err) => {
    console.error(err);
    return err;
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
