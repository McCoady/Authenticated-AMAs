const _ = require("lodash");

const AuthResolver = require("./auth.js");

const resolvers = _.merge(AuthResolver, {
  Query: { test: () => "asdas" },
});

module.exports = resolvers;
