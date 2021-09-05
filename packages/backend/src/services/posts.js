const Prisma = require("../prisma");
const _ = require("lodash");
const { verifyAuthToken } = require("../authToken/authToken");
const PostsSchema = require("../graphql/posts.graphql");

const INCLUDE_ALL_POST_FIELDS = {
  creator: true,
  requiredTokens: true,
  comments: {
    include: {
      creator: true,
    },
  },
};

async function posts() {
  const posts = await Prisma.post.findMany({
    include: INCLUDE_ALL_POST_FIELDS,
  });

  return posts.map((post) => ({
    ...post,
    comments: unflatCommentsArray(post.comments),
  }));
}

async function unflatCommentsArray(comments) {
  if (!comments || comments.length === 0) return [];

  const group = _.groupBy(comments, "commentId");
  const rootComments = group["null"];
  const subComments = _.omit(group, ["null"]);

  const rootCommentsUnFlatten = rootComments.map((rootComment) => {
    return { ...rootComment, subcomments: subComments[rootComment.id] ?? [] };
  });

  return rootCommentsUnFlatten;
}

async function post(parent, { id }, context, info) {
  console.log(id);
  const post = await Prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    include: INCLUDE_ALL_POST_FIELDS,
  });

  return {
    ...post,
    comments: unflatCommentsArray(post.comments),
  };
}

async function addComment(parent, { commentInput }, { authToken }, info) {
  const { address } = await verifyAuthToken(authToken);

  //TODO - Verify if address have the required tokens before creating

  const { content, postId } = commentInput;

  const post = await Prisma.post.update({
    where: { id: Number(postId) },
    data: {
      comments: {
        create: [
          {
            content,
            creator: {
              connectOrCreate: {
                where: {
                  address: address,
                },
                create: {
                  address,
                  name: "unknown",
                },
              },
            },
          },
        ],
      },
    },
    include: INCLUDE_ALL_POST_FIELDS,
  });

  return {
    ...post,
    comments: unflatCommentsArray(post.comments),
  };
}

async function respondComment(parent, { content }, { authToken }, info) {
  const { address } = await verifyAuthToken(authToken);
}

const PostsResolver = {
  Query: {
    posts,
    post,
  },
  Mutation: {
    addComment,
    respondComment,
  },
};

module.exports = PostsResolver;
