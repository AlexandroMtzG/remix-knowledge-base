import { KnowledgeBaseCategorySection } from "@prisma/client";
import { db } from "~/lib/db.server";

export type KnowledgeBaseCategorySectionWithDetails = KnowledgeBaseCategorySection & {
  articles: {
    id: string;
    order: number;
    title: string;
  }[];
};

export async function getAllKnowledgeBaseCategorySections(): Promise<KnowledgeBaseCategorySectionWithDetails[]> {
  return await db.knowledgeBaseCategorySection.findMany({
    include: {
      articles: { select: { id: true, order: true, title: true } },
    },
  });
}

export async function getKbCategorySectionById(id: string): Promise<KnowledgeBaseCategorySectionWithDetails | null> {
  return await db.knowledgeBaseCategorySection.findUnique({
    where: { id },
    include: {
      articles: { select: { id: true, order: true, title: true } },
    },
  });
}

export async function createKnowledgeBaseCategorySection(data: { categoryId: string; order: number; title: string; description: string }) {
  return await db.knowledgeBaseCategorySection.create({
    data: {
      categoryId: data.categoryId,
      order: data.order,
      title: data.title,
      description: data.description,
    },
  });
}

export async function updateKnowledgeBaseCategorySection(
  id: string,
  data: {
    order?: number;
    title?: string;
    description?: string;
  }
) {
  return await db.knowledgeBaseCategorySection.update({
    where: { id },
    data: {
      order: data.order,
      title: data.title,
      description: data.description,
    },
  });
}

export async function deleteKnowledgeBaseCategorySection(id: string) {
  return await db.knowledgeBaseCategorySection.delete({
    where: { id },
  });
}
