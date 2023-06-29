import { KnowledgeBaseArticleWithDetails } from "../db/kbArticles.db.server";
import { KnowledgeBaseDto } from "../dtos/KnowledgeBaseDto";

const supportedLanguages: { name: string; value: string }[] = [
  { name: "English", value: "en" },
  { name: "Spanish", value: "es" },
];

function getLanguageName(language: string) {
  const supportedLanguage = supportedLanguages.find((l) => l.value === language);
  return supportedLanguage ? supportedLanguage.name : "";
}

function getAvailableArticleSlug({ allArticles, initialSlug }: { allArticles: KnowledgeBaseArticleWithDetails[]; initialSlug: string }) {
  let number = 1;
  let slug = "";

  const findExistingSlug = (slug: string) => {
    return allArticles.find((p) => p.slug === slug);
  };

  do {
    slug = `${initialSlug}-${number}`;
    const existingWithSlug = findExistingSlug(slug);
    if (!existingWithSlug) {
      break;
    }
    if (number > 10) {
      throw Error("Too many duplicates");
    }
    number++;
  } while (true);

  let maxOrder = 0;
  if (allArticles.length > 0) {
    maxOrder = Math.max(...allArticles.map((p) => p.order));
  }
  return {
    slug,
    maxOrder,
    number,
  };
}

function getKbUrl({ kb, params }: { kb: KnowledgeBaseDto; params: { lang?: string } }) {
  if (params.lang) {
    return `/${kb.slug}/${params.lang}`;
  }
  return `/${kb.slug}`;
}

function getArticleUrl({ kb, article, params }: { kb: { slug: string }; article: { slug: string }; params: { lang?: string } }) {
  if (params.lang) {
    return `/${kb.slug}/${params.lang}/articles/${article.slug}`;
  }
  return `/${kb.slug}/articles/${article.slug}`;
}

function getCategoryUrl({ kb, category, params }: { kb: { slug: string }; category: { slug: string }; params: { lang?: string } }) {
  if (params.lang) {
    return `/${kb.slug}/${params.lang}/categories/${category.slug}`;
  }
  return `/${kb.slug}/categories/${category.slug}`;
}

export default {
  supportedLanguages,
  getLanguageName,
  getAvailableArticleSlug,
  getKbUrl,
  getArticleUrl,
  getCategoryUrl,
};
