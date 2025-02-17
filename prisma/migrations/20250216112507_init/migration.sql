-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportedCase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "reportReason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "adminResponse" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportedCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactCheckLog" (
    "id" TEXT NOT NULL,
    "reportedCaseId" TEXT NOT NULL,
    "verifiedById" TEXT NOT NULL,
    "credibilityScore" INTEGER NOT NULL DEFAULT 50,
    "sourcesUsed" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FactCheckLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizTopic" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FactCheckLog_reportedCaseId_key" ON "FactCheckLog"("reportedCaseId");

-- AddForeignKey
ALTER TABLE "ReportedCase" ADD CONSTRAINT "ReportedCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactCheckLog" ADD CONSTRAINT "FactCheckLog_reportedCaseId_fkey" FOREIGN KEY ("reportedCaseId") REFERENCES "ReportedCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactCheckLog" ADD CONSTRAINT "FactCheckLog_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizScore" ADD CONSTRAINT "QuizScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
