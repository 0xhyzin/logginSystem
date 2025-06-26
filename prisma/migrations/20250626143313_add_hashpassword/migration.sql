-- CreateTable
CREATE TABLE "User" (
    "userid" SERIAL NOT NULL,
    "firstname" VARCHAR(50) NOT NULL,
    "secoundname" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "hashPassword" VARCHAR(250) NOT NULL,
    "phone" VARCHAR(100) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "roletype" (
    "roletypeid" SERIAL NOT NULL,
    "rolename" VARCHAR(20),

    CONSTRAINT "roletype_pkey" PRIMARY KEY ("roletypeid")
);

-- CreateTable
CREATE TABLE "tokentype" (
    "tokentypeid" SERIAL NOT NULL,
    "tokenname" VARCHAR(50),

    CONSTRAINT "tokentype_pkey" PRIMARY KEY ("tokentypeid")
);

-- CreateTable
CREATE TABLE "userrole" (
    "roleid" SERIAL NOT NULL,
    "roletypeid" INTEGER,
    "userid" INTEGER,

    CONSTRAINT "userrole_pkey" PRIMARY KEY ("roleid")
);

-- CreateTable
CREATE TABLE "usertoken" (
    "tokenid" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "expiredate" TIMESTAMP(6),
    "isused" BOOLEAN DEFAULT false,
    "userid" INTEGER,
    "tokentypeid" INTEGER,

    CONSTRAINT "usertoken_pkey" PRIMARY KEY ("tokenid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "usertoken_token_key" ON "usertoken"("token");

-- AddForeignKey
ALTER TABLE "userrole" ADD CONSTRAINT "userrole_roletypeid_fkey" FOREIGN KEY ("roletypeid") REFERENCES "roletype"("roletypeid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userrole" ADD CONSTRAINT "userrole_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usertoken" ADD CONSTRAINT "usertoken_tokentypeid_fkey" FOREIGN KEY ("tokentypeid") REFERENCES "tokentype"("tokentypeid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usertoken" ADD CONSTRAINT "usertoken_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;
