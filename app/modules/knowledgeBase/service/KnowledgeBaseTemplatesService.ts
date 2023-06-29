import { KnowledgeBase, KnowledgeBaseArticle } from "@prisma/client";
import { createKnowledgeBaseArticle, getAllKnowledgeBaseArticles, getKbArticleBySlug, updateKnowledgeBaseArticle } from "../db/kbArticles.db.server";
import { createKnowledgeBaseCategory, getAllKnowledgeBaseCategories, getKbCategoryBySlug, updateKnowledgeBaseCategory } from "../db/kbCategories.db.server";
import { createKnowledgeBase, getAllKnowledgeBases, getKnowledgeBaseBySlug, updateKnowledgeBase } from "../db/knowledgeBase.db.server";
import { KbNavLinkDto } from "../dtos/KbNavLinkDto";
import { KnowledgeBasesTemplateDto } from "../dtos/KnowledgeBasesTemplateDto";
import { KnowledgeBaseCategoryWithDetails } from "../helpers/KbCategoryModelHelper";
import { createKnowledgeBaseCategorySection, updateKnowledgeBaseCategorySection } from "../db/kbCategorySections.db.server";

async function getTemplate(): Promise<KnowledgeBasesTemplateDto> {
  const template: KnowledgeBasesTemplateDto = {
    knowledgeBases: [],
    categories: [],
    articles: [],
  };
  const allKbs = await getAllKnowledgeBases();
  for (const kb of allKbs) {
    template.knowledgeBases.push({
      slug: kb.slug,
      title: kb.title,
      description: kb.description,
      defaultLanguage: kb.defaultLanguage,
      layout: kb.layout,
      color: kb.color,
      enabled: kb.enabled,
      languages: JSON.parse(kb.languages) as string[],
      links: JSON.parse(kb.links) as KbNavLinkDto[],
      logo: kb.logo,
      seoImage: kb.seoImage,
    });
    const allCategories = await getAllKnowledgeBaseCategories({
      knowledgeBaseSlug: kb.slug,
      language: undefined,
    });
    for (const category of allCategories) {
      template.categories.push({
        knowledgeBaseSlug: kb.slug,
        slug: category.slug,
        order: category.order,
        title: category.title,
        description: category.description,
        icon: category.icon,
        language: category.language,
        seoImage: category.seoImage,
        sections: category.sections.map((section) => ({
          order: section.order,
          title: section.title,
          description: section.description,
        })),
      });
    }
    const allArticles = await getAllKnowledgeBaseArticles({
      knowledgeBaseSlug: kb.slug,
      language: undefined,
    });
    for (const article of allArticles) {
      template.articles.push({
        knowledgeBaseSlug: kb.slug,
        categorySlug: article.category?.slug ?? null,
        categorySectionOrder: article.section?.order ?? null,
        slug: article.slug,
        title: article.title,
        description: article.description,
        order: article.order,
        contentDraft: article.contentDraft,
        contentPublished: article.contentPublished,
        contentType: article.contentType,
        language: article.language,
        featuredOrder: article.featuredOrder,
        seoImage: article.seoImage,
        publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
        relatedArticles: article.relatedArticles.map((relatedArticle) => ({
          slug: relatedArticle.slug,
        })),
      });
    }
  }
  return template;
}

async function importKbs(template: KnowledgeBasesTemplateDto) {
  let created = {
    kbs: 0,
    categories: 0,
    sections: 0,
    articles: 0,
  };
  let updated = {
    kbs: 0,
    categories: 0,
    sections: 0,
    articles: 0,
  };
  for (const kb of template.knowledgeBases) {
    let existing: KnowledgeBase | null = await getKnowledgeBaseBySlug(kb.slug);
    if (existing) {
      await updateKnowledgeBase(existing.id, {
        slug: kb.slug,
        title: kb.title,
        description: kb.description,
        defaultLanguage: kb.defaultLanguage,
        layout: kb.layout,
        color: kb.color,
        enabled: kb.enabled,
        languages: JSON.stringify(kb.languages),
        links: JSON.stringify(kb.links),
        logo: kb.logo,
        seoImage: kb.seoImage,
      });
      updated.kbs++;
    } else {
      existing = await createKnowledgeBase({
        slug: kb.slug,
        title: kb.title,
        description: kb.description,
        defaultLanguage: kb.defaultLanguage,
        layout: kb.layout,
        color: kb.color,
        enabled: kb.enabled,
        languages: JSON.stringify(kb.languages),
        links: JSON.stringify(kb.links),
        logo: kb.logo,
        seoImage: kb.seoImage,
      });
      created.kbs++;
    }

    for (const category of template.categories.filter((c) => c.knowledgeBaseSlug === kb.slug)) {
      let existingCategory: KnowledgeBaseCategoryWithDetails | null = await getKbCategoryBySlug({
        knowledgeBaseId: existing.id,
        slug: category.slug,
        language: category.language,
      });
      if (existingCategory) {
        await updateKnowledgeBaseCategory(existingCategory.id, {
          title: category.title,
          order: category.order,
          description: category.description,
          icon: category.icon,
          language: category.language,
          seoImage: category.seoImage,
        });
        updated.categories++;
      } else {
        existingCategory = await createKnowledgeBaseCategory({
          knowledgeBaseId: existing.id,
          slug: category.slug,
          title: category.title,
          order: category.order,
          description: category.description,
          icon: category.icon,
          language: category.language,
          seoImage: category.seoImage,
        });
        created.categories++;
      }

      for (const section of category.sections) {
        let existingSection: { id: string; order: number; title: string; description: string } | null = null;
        if (existingCategory) {
          existingSection = existingCategory.sections.find((s) => s.order === section.order) ?? null;
        }
        if (existingSection) {
          await updateKnowledgeBaseCategorySection(existingSection.id, {
            title: section.title,
            description: section.description,
          });
          updated.sections++;
        } else {
          await createKnowledgeBaseCategorySection({
            categoryId: existingCategory?.id ?? null,
            order: section.order,
            title: section.title,
            description: section.description,
          });
          created.sections++;
        }
      }
    }

    for (const article of template.articles.filter((a) => a.knowledgeBaseSlug === kb.slug)) {
      let existingArticle: KnowledgeBaseArticle | null = await getKbArticleBySlug({
        knowledgeBaseId: existing.id,
        slug: article.slug,
        language: article.language,
      });
      let category: KnowledgeBaseCategoryWithDetails | null = null;
      let sectionId: string | null = null;
      if (article.categorySlug) {
        category = await getKbCategoryBySlug({
          knowledgeBaseId: existing.id,
          slug: article.categorySlug,
          language: article.language,
        });
        if (category && article.categorySectionOrder) {
          const section = category.sections.find((s) => s.order === article.categorySectionOrder);
          if (section) {
            sectionId = section.id;
          }
        }
      }
      if (existingArticle) {
        await updateKnowledgeBaseArticle(existingArticle.id, {
          categoryId: category?.id ?? null,
          sectionId: sectionId,
          slug: article.slug,
          title: article.title,
          description: article.description,
          order: article.order,
          contentDraft: article.contentDraft,
          contentPublished: article.contentPublished,
          contentType: article.contentType,
          language: article.language,
          featuredOrder: article.featuredOrder,
          author: "", // TODO
          // views: article.views,
          // upvotes: article.upvotes,
          // downvotes: article.downvotes,
          seoImage: article.seoImage,
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
        });
        updated.articles++;
      } else {
        existingArticle = await createKnowledgeBaseArticle({
          knowledgeBaseId: existing.id,
          categoryId: category?.id ?? null,
          sectionId: sectionId,
          slug: article.slug,
          title: article.title,
          description: article.description,
          order: article.order,
          contentDraft: article.contentDraft,
          contentPublished: article.contentPublished,
          contentType: article.contentType,
          language: article.language,
          featuredOrder: article.featuredOrder,
          author: "", // TODO
          seoImage: article.seoImage,
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
        });
        created.articles++;
      }
    }
  }
  return {
    created,
    updated,
  };
}

export default {
  getTemplate,
  importKbs,
};
