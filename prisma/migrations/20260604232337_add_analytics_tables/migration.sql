-- CreateTable
CREATE TABLE "PageView" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectView" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectClick" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_path_idx" ON "PageView"("path");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE INDEX "ProjectView_projectId_idx" ON "ProjectView"("projectId");

-- CreateIndex
CREATE INDEX "ProjectView_createdAt_idx" ON "ProjectView"("createdAt");

-- CreateIndex
CREATE INDEX "ProjectClick_projectId_idx" ON "ProjectClick"("projectId");

-- CreateIndex
CREATE INDEX "ProjectClick_createdAt_idx" ON "ProjectClick"("createdAt");

-- AddForeignKey
ALTER TABLE "ProjectView" ADD CONSTRAINT "ProjectView_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectClick" ADD CONSTRAINT "ProjectClick_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
