const { gql } = require("apollo-server");

const TestSchema = gql`
  type Query {
    test: String
  }
`;

module.exports = TestSchema;
