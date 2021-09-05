/*
  Warnings:

  - Added the required column `postId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorAddress" TEXT NOT NULL,
    "commentId" INTEGER,
    "postId" INTEGER NOT NULL,
    FOREIGN KEY ("creatorAddress") REFERENCES "User" ("address") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("commentId", "content", "createdAt", "creatorAddress", "id") SELECT "commentId", "content", "createdAt", "creatorAddress", "id" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
