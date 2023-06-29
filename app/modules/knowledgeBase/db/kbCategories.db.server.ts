import { db } from "~/lib/db.server";
import { KnowledgeBaseCategoryWithDetails } from "../helpers/KbCategoryModelHelper";
import { Prisma } from "@prisma/client";

const include = {
  articles: {
    select: { id: true, order: true, title: true, description: true, slug: true, language: true, sectionId: true, publishedAt: true },
  },
  sections: {
    select: { id: true, order: true, title: true, description: true },
  },
};

export async function getAllKnowledgeBaseCategories({
  knowledgeBaseSlug,
  language,
}: {
  knowledgeBaseSlug: string;
  language: string | undefined;
}): Promise<KnowledgeBaseCategoryWithDetails[]> {
  return await db.knowledgeBaseCategory.findMany({
    where: {
      knowledgeBase: { slug: knowledgeBaseSlug },
      language,
    },
    include,
    orderBy: { order: "asc" },
  });
}

export async function getKbCategoryById(id: string): Promise<KnowledgeBaseCategoryWithDetails | null> {
  return await db.knowledgeBaseCategory.findUnique({
    where: { id },
    include,
  });
}

export async function getKbCategoryBySlug({
  knowledgeBaseId,
  slug,
  language,
}: {
  knowledgeBaseId: string;
  slug: string;
  language: string | undefined;
}): Promise<KnowledgeBaseCategoryWithDetails | null> {
  const where: Prisma.KnowledgeBaseCategoryWhereInput = {
    knowledgeBaseId,
    slug,
    language,
  };
  return await db.knowledgeBaseCategory.findFirst({
    where,
    include,
  });
}

export async function createKnowledgeBaseCategory(data: {
  knowledgeBaseId: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  icon: string;
  language: string;
  seoImage: string;
}): Promise<KnowledgeBaseCategoryWithDetails> {
  return await db.knowledgeBaseCategory.create({
    data: {
      knowledgeBaseId: data.knowledgeBaseId,
      slug: data.slug,
      order: data.order,
      title: data.title,
      description: data.description,
      icon: data.icon,
      language: data.language,
      seoImage: data.seoImage,
    },
    include,
  });
}

export async function updateKnowledgeBaseCategory(
  id: string,
  data: {
    slug?: string;
    title?: string;
    order?: number;
    description?: string;
    icon?: string;
    language?: string;
    seoImage?: string;
  }
) {
  return await db.knowledgeBaseCategory.update({
    where: { id },
    data: {
      slug: data.slug,
      order: data.order,
      title: data.title,
      description: data.description,
      icon: data.icon,
      language: data.language,
      seoImage: data.seoImage,
    },
  });
}

export async function deleteKnowledgeBaseCategory(id: string) {
  return await db.knowledgeBaseCategory.delete({
    where: { id },
  });
}

export async function countKnowledgeBaseCategories() {
  return await db.knowledgeBaseCategory.count();
}
