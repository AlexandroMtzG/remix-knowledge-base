import { KnowledgeBaseArticle, Prisma } from "@prisma/client";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { db } from "~/lib/db.server";

export type KnowledgeBaseArticleWithDetails = KnowledgeBaseArticle & {
  category: { slug: string; title: string } | null;
  section: { order: number; title: string } | null;
  relatedArticles: { order: number; title: string; slug: string }[];
  _count: {
    views: number;
    upvotes: number;
    downvotes: number;
  };
};

const include = {
  category: {
    select: { slug: true, title: true },
  },
  section: {
    select: { order: true, title: true },
  },
  relatedArticles: {
    select: { order: true, title: true, slug: true },
  },
  _count: {
    select: { views: true, upvotes: true, downvotes: true },
  },
};

export async function getAllKnowledgeBaseArticles({
  knowledgeBaseSlug,
  categoryId,
  language,
}: {
  knowledgeBaseSlug: string;
  categoryId?: string;
  language: string | undefined;
}): Promise<KnowledgeBaseArticleWithDetails[]> {
  return await db.knowledgeBaseArticle.findMany({
    where: {
      knowledgeBase: { slug: knowledgeBaseSlug },
      categoryId,
      language,
    },
    include,
    orderBy: [
      {
        category: { order: "asc" },
      },
      {
        section: { order: "asc" },
      },
      {
        order: "asc",
      },
    ],
  });
}

export async function getAllKnowledgeBaseArticlesWithPagination({
  knowledgeBaseSlug,
  language,
  pagination,
  filters,
}: {
  knowledgeBaseSlug: string;
  language: string | undefined;
  pagination: {
    page: number;
    pageSize: number;
  };
  filters: {
    title?: string;
    description?: string;
    categoryId?: string | null;
  };
}): Promise<{
  items: KnowledgeBaseArticleWithDetails[];
  pagination: PaginationDto;
}> {
  const where: Prisma.KnowledgeBaseArticleWhereInput = {
    knowledgeBase: { slug: knowledgeBaseSlug },
    language,
  };
  if (filters.title !== undefined) {
    where.title = { contains: filters.title };
  }
  if (filters.description !== undefined) {
    where.description = { contains: filters.description };
  }
  if (filters.categoryId !== undefined) {
    where.categoryId = filters.categoryId;
  }
  const items = await db.knowledgeBaseArticle.findMany({
    take: pagination.pageSize,
    skip: (pagination.page - 1) * pagination.pageSize,
    where,
    include,
    orderBy: [{ createdAt: "desc" }],
  });
  const totalItems = await db.knowledgeBaseArticle.count({
    where,
  });
  return {
    items,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.pageSize),
    },
  };
}

export async function getFeaturedKnowledgeBaseArticles({
  knowledgeBaseId,
  language,
}: {
  knowledgeBaseId: string;
  language: string;
}): Promise<KnowledgeBaseArticleWithDetails[]> {
  return await db.knowledgeBaseArticle.findMany({
    where: {
      knowledgeBaseId,
      language,
      featuredOrder: { not: null },
      publishedAt: { not: null },
    },
    include,
    orderBy: [{ featuredOrder: "asc" }],
  });
}

export async function getKbArticleById(id: string): Promise<KnowledgeBaseArticleWithDetails | null> {
  return await db.knowledgeBaseArticle.findUnique({
    where: { id },
    include,
  });
}

export async function getKbArticleBySlug({
  knowledgeBaseId,
  slug,
  language,
}: {
  knowledgeBaseId: string;
  slug: string;
  language: string;
}): Promise<KnowledgeBaseArticleWithDetails | null> {
  return await db.knowledgeBaseArticle.findFirst({
    where: {
      knowledgeBaseId,
      slug,
      language,
    },
    include: {
      ...include,
      // category: {
      //   include: {
      //     articles: {
      //       select: { id: true, order: true, title: true, description: true, slug: true, language: true, sectionId: true, publishedAt: true },
      //     },
      //     sections: {
      //       select: { id: true, order: true, title: true, description: true },
      //     },
      //   },
      // },
    },
  });
}

export async function createKnowledgeBaseArticle(data: {
  knowledgeBaseId: string;
  categoryId: string | null;
  sectionId: string | null;
  slug: string;
  title: string;
  description: string;
  order: number;
  contentDraft: string;
  contentPublished: string;
  contentType: string;
  language: string;
  featuredOrder: number | null;
  author: string;
  seoImage: string;
  publishedAt: Date | null;
}) {
  return await db.knowledgeBaseArticle.create({
    data: {
      knowledgeBaseId: data.knowledgeBaseId,
      categoryId: data.categoryId,
      sectionId: data.sectionId,
      slug: data.slug,
      title: data.title,
      description: data.description,
      order: data.order,
      contentDraft: data.contentDraft,
      contentPublished: data.contentPublished,
      contentType: data.contentType,
      language: data.language,
      featuredOrder: data.featuredOrder,
      author: data.author,
      seoImage: data.seoImage,
      publishedAt: data.publishedAt,
    },
  });
}

export async function updateKnowledgeBaseArticle(
  id: string,
  data: {
    categoryId?: string | null;
    sectionId?: string | null;
    slug?: string;
    title?: string;
    description?: string;
    order?: number;
    contentDraft?: string;
    contentPublished?: string;
    contentType?: string;
    language?: string;
    featuredOrder?: number | null;
    author?: string;
    seoImage?: string;
    publishedAt?: Date | null;
  }
) {
  return await db.knowledgeBaseArticle.update({
    where: { id },
    data: {
      categoryId: data.categoryId,
      sectionId: data.sectionId,
      slug: data.slug,
      title: data.title,
      description: data.description,
      order: data.order,
      contentDraft: data.contentDraft,
      contentPublished: data.contentPublished,
      contentType: data.contentType,
      language: data.language,
      featuredOrder: data.featuredOrder,
      author: data.author,
      seoImage: data.seoImage,
      publishedAt: data.publishedAt,
    },
  });
}

export async function deleteKnowledgeBaseArticle(id: string) {
  return await db.knowledgeBaseArticle.delete({
    where: { id },
  });
}

export async function countKnowledgeBaseArticles() {
  return await db.knowledgeBaseArticle.count();
}
