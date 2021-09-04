const { PrismaClient, prisma } = require("@prisma/client");
const Prisma = new PrismaClient();

module.exports = Prisma;

async function testDatabase() {
  const testUser = {
    address: "0xdbB0219D26DC9a1251E563114bCd5F647b173662",
    name: "camo",
  };

  await Prisma.post.create({
    data: {
      title: "First AMA",
      expiration: new Date(Date.now() + 86400000 * 3),
      creator: {
        connectOrCreate: {
          where: {
            address: testUser.address,
          },
          create: {
            ...testUser,
          },
        },
      },
      requiredTokens: {
        connectOrCreate: [
          {
            where: { address: "233123123123123123123123123" },
            create: {
              address: "233123123123123123123123123",
              name: "not really a token address",
            },
          },
        ],
      },
    },
    include: {
      creator: true,
      requiredTokens: true,
    },
  });
}

async function createComment() {
  const testUser = {
    address: "0xdbB0219D26DC9a1251E563114bCd5F647b173662",
    name: "camo",
  };

  const id = 7;

  await Prisma.post.update({
    where: { id },
    data: {
      comments: {
        create: [
          {
            content: "this is a comment",
            creator: {
              connectOrCreate: {
                where: {
                  address: testUser.address,
                },
                create: {
                  ...testUser,
                },
              },
            },
            subcomments: {
              create: [
                {
                  content: "this is subcomment in a comment",
                  post: {
                    connect: {
                      id,
                    },
                  },
                  creator: {
                    connectOrCreate: {
                      where: {
                        address: testUser.address,
                      },
                      create: {
                        ...testUser,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
}

// createComment()
//   .then()
//   .catch((e) => {
//     console.error(e);
//   })
//   .finally(async () => {
//     //await Prisma.$disconnect();
//   });

const util = require("util");
const printdatabase = async () => {
  const allUsers = await Prisma.user.findMany();
  console.log("users", allUsers);

  const allPosts = await Prisma.post.findMany({
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

  console.log(util.inspect(allPosts, false, null, true /* enable colors */));
};

//printdatabase();
