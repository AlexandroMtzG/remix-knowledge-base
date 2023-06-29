import { db } from "~/lib/db.server";

export async function createKnowledgeBaseView({ userAnalyticsId, knowledgeBaseId }: { userAnalyticsId: string; knowledgeBaseId: string }) {
  if (!userAnalyticsId) {
    return;
  }
  const existing = await db.knowledgeBaseViews.findUnique({
    where: {
      knowledgeBaseId_userAnalyticsId: {
        userAnalyticsId,
        knowledgeBaseId,
      },
    },
  });
  if (!existing) {
    await db.knowledgeBaseViews.create({
      data: {
        userAnalyticsId,
        knowledgeBaseId,
      },
    });
  }
}

export async function createKnowledgeBaseArticleView({ userAnalyticsId, articleId }: { userAnalyticsId: string; articleId: string }) {
  if (!userAnalyticsId) {
    return;
  }
  const existing = await db.knowledgeBaseArticleViews.findUnique({
    where: {
      knowledgeBaseArticleId_userAnalyticsId: {
        userAnalyticsId,
        knowledgeBaseArticleId: articleId,
      },
    },
  });
  if (!existing) {
    await db.knowledgeBaseArticleViews.create({
      data: {
        userAnalyticsId,
        knowledgeBaseArticleId: articleId,
      },
    });
  }
}

export async function voteArticle({ userAnalyticsId, articleId, type }: { userAnalyticsId: string; articleId: string; type: "up" | "down" }) {
  if (!userAnalyticsId) {
    return;
  }
  if (type === "up") {
    await db.knowledgeBaseArticleDownvotes.deleteMany({
      where: {
        userAnalyticsId,
        knowledgeBaseArticleId: articleId,
      },
    });
    const existing = await db.knowledgeBaseArticleUpvotes.findUnique({
      where: {
        knowledgeBaseArticleId_userAnalyticsId: {
          userAnalyticsId,
          knowledgeBaseArticleId: articleId,
        },
      },
    });
    if (!existing) {
      await db.knowledgeBaseArticleUpvotes.create({
        data: {
          userAnalyticsId,
          knowledgeBaseArticleId: articleId,
        },
      });
    } else {
      await db.knowledgeBaseArticleUpvotes.delete({
        where: {
          knowledgeBaseArticleId_userAnalyticsId: {
            userAnalyticsId,
            knowledgeBaseArticleId: articleId,
          },
        },
      });
    }
  } else {
    await db.knowledgeBaseArticleUpvotes.deleteMany({
      where: {
        userAnalyticsId,
        knowledgeBaseArticleId: articleId,
      },
    });
    const existing = await db.knowledgeBaseArticleDownvotes.findUnique({
      where: {
        knowledgeBaseArticleId_userAnalyticsId: {
          userAnalyticsId,
          knowledgeBaseArticleId: articleId,
        },
      },
    });
    if (!existing) {
      await db.knowledgeBaseArticleDownvotes.create({
        data: {
          userAnalyticsId,
          knowledgeBaseArticleId: articleId,
        },
      });
    } else {
      await db.knowledgeBaseArticleDownvotes.delete({
        where: {
          knowledgeBaseArticleId_userAnalyticsId: {
            userAnalyticsId,
            knowledgeBaseArticleId: articleId,
          },
        },
      });
    }
  }
}

export async function getArticleStateByUserAnalyticsId({ userAnalyticsId, articleId }: { userAnalyticsId: string; articleId: string }) {
  return {
    hasThumbsUp: !!(await db.knowledgeBaseArticleUpvotes.findUnique({
      where: {
        knowledgeBaseArticleId_userAnalyticsId: {
          userAnalyticsId,
          knowledgeBaseArticleId: articleId,
        },
      },
    })),
    hasThumbsDown: !!(await db.knowledgeBaseArticleDownvotes.findUnique({
      where: {
        knowledgeBaseArticleId_userAnalyticsId: {
          userAnalyticsId,
          knowledgeBaseArticleId: articleId,
        },
      },
    })),
  };
}

export async function countAllKbsViews() {
  return await db.knowledgeBaseViews.count();
}

export async function countAllKbsArticleViews() {
  return await db.knowledgeBaseArticleViews.count();
}

export async function countAllKbsArticleUpvotes() {
  return await db.knowledgeBaseArticleUpvotes.count();
}

export async function countAllKbsArticleDownvotes() {
  return await db.knowledgeBaseArticleDownvotes.count();
}
