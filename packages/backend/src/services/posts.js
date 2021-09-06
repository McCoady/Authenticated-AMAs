const Prisma = require("../prisma");
const _ = require("lodash");
const {
  verifyAuthToken,
  verifyIfAddressHasTokens,
} = require("../authToken/authToken");

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
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
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

function getPostRequiredTokens(post) {
  const tokensAddress = post.requiredTokens.map((token) => token.address);
  return tokensAddress;
}

async function verifyIfAddressCanComment({ address, postId }) {
  const post = await Prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
    include: { requiredTokens: true, creator: true },
  });

  const tokensAddress = getPostRequiredTokens(post);
  const creatorAddress = post.creator.address;

  if (address === creatorAddress) return true;

  const hasTokens = await verifyIfAddressHasTokens({ address, tokensAddress });
  return hasTokens;
}

async function addComment(parent, { commentInput }, { authToken }, info) {
  const { address } = await verifyAuthToken(authToken);

  console.log("commentInput", commentInput);
  const { content, postId } = commentInput;

  const canComment = await verifyIfAddressCanComment({ address, postId });
  console.log("canComment", canComment);
  if (!canComment) throw "Sorry, you dont have the necessary tokens!";

  const modifiedPost = await Prisma.post.update({
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
    ...modifiedPost,
    comments: unflatCommentsArray(modifiedPost.comments),
  };
}

async function respondComment(
  parent,
  { commentInput: { content, postId }, respondingTo },
  { authToken },
  info
) {
  const { address } = await verifyAuthToken(authToken);

  const canComment = await verifyIfAddressCanComment({ address, postId });
  console.log("canRespond", canComment);

  if (!canComment) throw "Sorry, you dont have the necessary tokens!";

  const post = await Prisma.comment.update({
    where: { id: Number(respondingTo) },
    data: {
      subcomments: {
        create: [
          {
            content,
            post: {
              connect: {
                id: Number(postId),
              },
            },
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
  });
}

async function createPost(
  parent,
  { postInput: { title, requiredTokens } },
  { authToken },
  info
) {
  const { address } = await verifyAuthToken(authToken);

  const tokensQuery = requiredTokens.map(
    ({ address: tokenAddress, name: tokenName }) => ({
      where: { address: tokenAddress },
      create: {
        address: tokenAddress,
        name: tokenName,
      },
    })
  );

  const newPost = await Prisma.post.create({
    data: {
      title,
      expiration: new Date(Date.now() + 86400000 * 3),
      creator: {
        connectOrCreate: {
          where: {
            address,
          },
          create: {
            address,
            name: "unknown",
          },
        },
      },
      requiredTokens: {
        connectOrCreate: tokensQuery,
      },
    },
    include: INCLUDE_ALL_POST_FIELDS,
  });

  return newPost;
}

const PostsResolver = {
  Query: {
    posts,
    post,
  },
  Mutation: {
    addComment,
    respondComment,
    createPost,
  },
};

module.exports = PostsResolver;
