const Prisma = require("../prisma");
const _ = require("lodash");

async function posts() {
  const posts = await Prisma.post.findMany({
    include: {
      creator: true,
      requiredTokens: true,
      comments: {
        include: {
          creator: true,
        },
      },
    },
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
    include: {
      creator: true,
      requiredTokens: true,
      comments: {
        include: {
          creator: true,
        },
      },
    },
  });

  return {
    ...post,
    comments: unflatCommentsArray(post.comments),
  };
}

const PostsResolver = {
  Query: {
    posts,
    post,
  },
};

module.exports = PostsResolver;
