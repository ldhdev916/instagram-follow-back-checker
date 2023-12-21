-- CreateTable
CREATE TABLE "AppUser" (
    "id" TEXT NOT NULL,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramSession" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profileUrl" TEXT NOT NULL,
    "serialized" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AppUserToInstagramSession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AppUserToInstagramSession_AB_unique" ON "_AppUserToInstagramSession"("A", "B");

-- CreateIndex
CREATE INDEX "_AppUserToInstagramSession_B_index" ON "_AppUserToInstagramSession"("B");

-- AddForeignKey
ALTER TABLE "_AppUserToInstagramSession" ADD CONSTRAINT "_AppUserToInstagramSession_A_fkey" FOREIGN KEY ("A") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppUserToInstagramSession" ADD CONSTRAINT "_AppUserToInstagramSession_B_fkey" FOREIGN KEY ("B") REFERENCES "InstagramSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
