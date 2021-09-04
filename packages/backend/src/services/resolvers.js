const _ = require("lodash");

const AuthResolver = require("./auth.js");
const PostsResolver = require("./posts.js");

const resolvers = _.merge(AuthResolver, PostsResolver);

module.exports = resolvers;
