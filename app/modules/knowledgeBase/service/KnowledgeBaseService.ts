import type { KbArticleDto } from "../dtos/KbArticleDto";
import type { KbCategoryDto } from "../dtos/KbCategoryDto";
import type { KbSearchResultDto } from "../dtos/KbSearchResultDto";
import type { KnowledgeBaseDto } from "../dtos/KnowledgeBaseDto";
import { KnowledgeBaseWithDetails, getAllKnowledgeBases, getKnowledgeBaseById, getKnowledgeBaseBySlug } from "../db/knowledgeBase.db.server";
import { db } from "~/lib/db.server";
import { KbNavLinkDto } from "../dtos/KbNavLinkDto";
import {
  KnowledgeBaseArticleWithDetails,
  createKnowledgeBaseArticle,
  getAllKnowledgeBaseArticles,
  getFeaturedKnowledgeBaseArticles,
  getKbArticleById,
  getKbArticleBySlug,
} from "../db/kbArticles.db.server";
import { createKnowledgeBaseCategory, getAllKnowledgeBaseCategories, getKbCategoryById, getKbCategoryBySlug } from "../db/kbCategories.db.server";
import KnowledgeBaseUtils from "../utils/KnowledgeBaseUtils";
import { KnowledgeBaseCategoryWithDetails } from "../helpers/KbCategoryModelHelper";

async function getAll({ enabled }: { enabled?: boolean }): Promise<KnowledgeBaseDto[]> {
  const items = await getAllKnowledgeBases({ enabled });
  return items.map((item) => kbToDto(item));
  // const items: KnowledgeBaseDto[] = [
  //   {
  //     id: "1",
  //     createdAt: new Date(),
  //     updatedAt: null,
  //     slug: "docs",
  //     title: "Documentation",
  //     description: "Your documentation description",
  //     defaultLanguage: "en",
  //     layout: "list",
  //     languages: ["en", "es"],
  //     links: [{ name: "Back to site", href: "/" }],
  //     color: Colors.PINK,
  //     logo: "https://yahooder.sirv.com/saasrock/logos/logo-dark.png",
  //     metatags: [{ title: `Documentation` }],
  //     enabled: true,
  //     views: 0,
  //     count: { categories: 0, articles: 0 },
  //   },
  //   {
  //     id: "2",
  //     createdAt: new Date(),
  //     updatedAt: null,
  //     slug: "help-center",
  //     title: "Help Center",
  //     description: "Your help center description",
  //     defaultLanguage: "es",
  //     layout: "articles",
  //     languages: ["en", "es"],
  //     links: [{ name: "Back to site", href: "/" }],
  //     color: Colors.BLUE,
  //     logo: "light",
  //     metatags: [{ title: `Help Center` }],
  //     enabled: true,
  //     views: 0,
  //     count: { categories: 0, articles: 0 },
  //   },
  //   {
  //     id: "3",
  //     createdAt: new Date(),
  //     updatedAt: null,
  //     slug: "ayuda",
  //     title: "Centro de Ayuda",
  //     description: "Tu descripción del centro de ayuda",
  //     defaultLanguage: "es",
  //     layout: "grid",
  //     languages: ["es"],
  //     links: [{ name: "Volver al sitio", href: "/" }],
  //     color: Colors.TEAL,
  //     logo: "dark",
  //     metatags: [{ title: `Centro de Ayuda` }],
  //     enabled: true,
  //     views: 0,
  //     count: { categories: 0, articles: 0 },
  //   },
  // ];
  // return items.filter((f) => enabled === undefined || f.enabled === enabled);
}

async function get({ slug, enabled }: { slug: string; enabled?: boolean }): Promise<KnowledgeBaseDto> {
  const item = await getKnowledgeBaseBySlug(slug);
  if (!item || (enabled !== undefined && item.enabled !== enabled)) {
    throw new Error("Knowledge base not found");
  }
  return kbToDto(item);
}

async function getById(id: string): Promise<KnowledgeBaseDto | null> {
  const item = await getKnowledgeBaseById(id);
  if (!item) {
    return null;
  }
  return kbToDto(item);
}

function kbToDto(kb: KnowledgeBaseWithDetails) {
  const item: KnowledgeBaseDto = {
    id: kb.id,
    createdAt: kb.createdAt,
    updatedAt: kb.updatedAt,
    slug: kb.slug,
    title: kb.title,
    description: kb.description,
    defaultLanguage: kb.defaultLanguage,
    layout: kb.layout as "list" | "articles" | "grid",
    languages: JSON.parse(kb.languages) as string[],
    links: JSON.parse(kb.links) as KbNavLinkDto[],
    color: kb.color,
    enabled: kb.enabled,
    count: {
      articles: kb._count.articles,
      categories: kb._count.categories,
      views: kb._count.views,
    },
    logo: kb.logo,
    seoImage: kb.seoImage,
    metatags: [
      { title: `${kb.title}` },
      { name: "description", content: kb.description },
      // { name: "keywords", content: kb.keywords },
      { name: "og:title", content: `${kb.title}` },
      { name: "og:description", content: kb.description },
      { name: "og:image", content: kb.seoImage },
      // { name: "og:url", content: `${new URL(request.url).origin}/${kb.slug}` },
      { name: "twitter:title", content: `${kb.title}` },
      { name: "twitter:description", content: kb.description },
      { name: "twitter:image", content: kb.seoImage },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
  return item;
}

async function getCategories({
  kb,
  params,
}: {
  kb: KnowledgeBaseDto;
  params: {
    lang?: string;
  };
}): Promise<KbCategoryDto[]> {
  const items = await getAllKnowledgeBaseCategories({
    knowledgeBaseSlug: kb.slug,
    language: params.lang || kb.defaultLanguage,
  });
  return items.map((f) => categoryToDto({ kb, category: f, params }));
  // let allItems = await generateFakeData(kb);
  // allItems.categories = allItems.categories.filter((f) => f.language === language);
  // const result = await fakeSearch({ original: allItems, query });
  // allItems.categories.forEach((category) => {
  //   category.articles = allItems.articles;
  // });
  // return result.categories;
}

function categoryToDto({ kb, category, params }: { kb: KnowledgeBaseDto; category: KnowledgeBaseCategoryWithDetails; params: { lang?: string } }) {
  const item: KbCategoryDto = {
    id: category.id,
    slug: category.slug,
    order: category.order,
    title: category.title,
    description: category.description,
    icon: category.icon,
    language: category.language,
    seoImage: category.seoImage,
    href: KnowledgeBaseUtils.getCategoryUrl({ kb, category, params }),
    sections: category.sections.map((f) => ({
      id: f.id,
      order: f.order,
      title: f.title,
      description: f.description,
    })),
    articles: category.articles.map((f) => ({
      id: f.id,
      order: f.order,
      title: f.title,
      description: f.description,
      language: f.language,
      slug: f.slug,
      href: KnowledgeBaseUtils.getArticleUrl({ kb, article: f, params }),
      sectionId: f.sectionId,
    })),
    metatags: [
      { title: `${category.title} | ${kb.title}` },
      { name: "description", content: category.description },
      // { name: "keywords", content: category.keywords },
      { name: "og:title", content: `${category.title} | ${kb.title}` },
      { name: "og:description", content: category.description },
      { name: "og:image", content: category.seoImage },
      // { name: "og:url", content: `${process.env.APP_URL}/${kb.slug}/categories/${category.slug}` },
      { name: "twitter:title", content: `${category.title} | ${kb.title}` },
      { name: "twitter:description", content: category.description },
      { name: "twitter:image", content: category.seoImage },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
  return item;
}

async function getArticles({
  kb,
  categoryId,
  language,
  query,
  params,
}: {
  kb: KnowledgeBaseDto;
  categoryId: string;
  language: string;
  query: string | undefined;
  params: { lang?: string };
}): Promise<KbArticleDto[]> {
  const items = await getAllKnowledgeBaseArticles({
    knowledgeBaseSlug: kb.slug,
    categoryId,
    language,
  });
  return items.map((f) => articleToDto({ kb, article: f, relatedArticles: f.relatedArticles, params }));
  // let allItems = await generateFakeData(kb);
  // allItems.articles = allItems.articles.filter((f) => f.language === language);
  // const result = await fakeSearch({ original: allItems, query });
  // return result.articles;
}

async function getArticle({ kb, slug, params }: { kb: KnowledgeBaseDto; slug: string; params: { lang?: string } }): Promise<{
  article: KbArticleDto;
  category: KbCategoryDto;
} | null> {
  let language = params.lang || kb.defaultLanguage;
  const item = await getKbArticleBySlug({
    knowledgeBaseId: kb.id,
    slug,
    language,
  });
  if (!item || !item.publishedAt) {
    return null;
  }
  if (!item.categoryId) {
    return null;
  }
  const category = await getKbCategoryById(item.categoryId);
  if (!category) {
    return null;
  }
  return {
    article: articleToDto({ kb, article: item, relatedArticles: item.relatedArticles, params }),
    category: categoryToDto({ kb, category, params }),
  };
  // const getIdFromSlug = (slug: string) => {
  //   return slug.split("-").pop();
  // };
  // const id = getIdFromSlug(slug);
  // const allItems = await generateFakeData(kb);
  // const article = allItems.articles.find((f) => f.id === id && f.language === language);

  // if (!article) {
  //   return null;
  // }
  // const category = allItems.categories[0];
  // return { article, category };
}

async function getArticleById({ kb, id }: { kb: KnowledgeBaseDto; id: string }): Promise<KbArticleDto | null> {
  const item = await getKbArticleById(id);
  if (!item) {
    return null;
  }
  return articleToDto({ kb, article: item, relatedArticles: item.relatedArticles, params: {} });
}

async function getFeaturedArticles({ kb, params }: { kb: KnowledgeBaseDto; params: { lang?: string } }): Promise<KbArticleDto[]> {
  const items = await getFeaturedKnowledgeBaseArticles({
    knowledgeBaseId: kb.id,
    language: params.lang || kb.defaultLanguage,
  });
  return items.map((f) => articleToDto({ kb, article: f, relatedArticles: f.relatedArticles, params }));
  // let allItems = await generateFakeData(kb);
  // allItems.articles = allItems.articles.filter((f) => f.language === language && f.featuredOrder);
  // // return first 6
  // if (allItems.articles.length <= 4) {
  //   return allItems.articles;
  // }
  // return allItems.articles.slice(0, 4);
}

function articleToDto({
  kb,
  article,
  relatedArticles,
  params,
}: {
  kb: KnowledgeBaseDto;
  article: KnowledgeBaseArticleWithDetails;
  relatedArticles: { order: number; title: string; slug: string }[];
  params: { lang?: string };
}) {
  const item: KbArticleDto = {
    id: article.id,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    slug: article.slug,
    title: article.title,
    description: article.description,
    order: article.order,
    contentDraft: article.contentDraft,
    contentPublished: article.contentPublished,
    contentType: article.contentType as "wysiwyg" | "markdown",
    language: article.language,
    featuredOrder: article.featuredOrder,
    author: {
      email: "alex.martinez@absys.com.mx",
      firstName: "Alexandro",
      lastName: "Martinez",
      avatar: "https://avatars.githubusercontent.com/u/8606530?v=4",
    },
    publishedAt: article.publishedAt,
    href: KnowledgeBaseUtils.getArticleUrl({ kb, article, params }),
    sectionId: article.sectionId,
    relatedArticles: relatedArticles.map((f) => ({
      order: f.order,
      title: f.title,
      slug: f.slug,
      href: KnowledgeBaseUtils.getArticleUrl({ kb, article: f, params }),
    })),
    seoImage: article.seoImage,
    metatags: [
      { title: `${article.title} | ${kb.title}` },
      { name: "description", content: article.description },
      // { name: "keywords", content: article.keywords },
      { name: "og:title", content: `${article.title}` },
      { name: "og:description", content: article.description },
      { name: "og:image", content: article.seoImage },
      // { name: "og:url", content: `${process.env.APP_URL}/${kb.slug}/articles/${article.slug}` },
      { name: "twitter:title", content: `${article.title}` },
      { name: "twitter:description", content: article.description },
      { name: "twitter:image", content: article.seoImage },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
  return item;
}

async function getCategory({
  kb,
  category,
  language,
  params,
}: {
  kb: KnowledgeBaseDto;
  category: string;
  language: string;
  params: { lang?: string };
}): Promise<KbCategoryDto | null> {
  const item = await getKbCategoryBySlug({
    knowledgeBaseId: kb.id,
    slug: category,
    language,
  });
  if (!item) {
    return null;
  }
  item.articles = item.articles.filter((f) => f.publishedAt);
  return categoryToDto({ kb, category: item, params });
  // const allItems = await generateFakeData(kb);
  // const categoryItem = allItems.categories.find((f) => f.slug === category && f.language === language);
  // if (categoryItem) {
  //   categoryItem.articles = allItems.articles.filter((f) => f.language === language);
  // }

  // return categoryItem ?? null;
}

// async function generateFakeData(kb: KnowledgeBaseDto) {
//   const languages = ["en", "es"];
//   // const versions = ["0.9", "1.0"];

//   const authors: { email: string; firstName: string; lastName: string; avatar: string }[] = [
//     {
//       email: "alex.martinez@absys.com.mx",
//       firstName: "Alex",
//       lastName: "Martinez",
//       avatar: "https://avatars.githubusercontent.com/u/8606530?v=4",
//     },
//   ];
//   const categories: KbCategoryDto[] = [];
//   // const tags: KnowledgeBaseTagDto[] = [];
//   const articles: KbArticleDto[] = [];

//   languages.forEach((language) => {
//     // versions.forEach((version) => {
//     for (let i = 1; i <= 5; i++) {
//       let title = language === "es" ? "Categoría" : "Category";
//       const slug = `category-${i}`;
//       const sections: KbCategorySectionDto[] = [
//         {
//           id: "1",
//           order: 1,
//           title: "Section 1",
//           description: "Description of section 1",
//         },
//         {
//           id: "2",
//           order: 2,
//           title: "Section 2",
//           description: "Description of section 2",
//         },
//       ];
//       categories.push({
//         id: slug,
//         order: i,
//         icon:
//           i % 2 === 0
//             ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 5l5.5 9h-11L12 7z"/></svg>`
//             : "https://downloads.intercomcdn.com/i/o/413548/68ab50b2f4f155cc5e3af208/2bbe53ee6af29a766d79344e1ea19c97.png",
//         title: `${title} ${i}`,
//         description: "Description " + i,
//         slug,
//         language,
//         seoImage: "https://yahooder.sirv.com/saasfrontends/remix/ss/cover.png",
//         // version,
//         // categories: [],
//         sections,
//         articles: [],
//         href: `/${kb.slug}/${language}/categories/${slug}`,
//         metatags: [{ title: `${title} ${i} | ${kb.title}`, description: "Description " + i }],
//       });
//     }

//     // for (let i = 1; i <= 5; i++) {
//     //   tags.push({
//     //     name: "Tag " + i,
//     //     color: i,
//     //   });
//     // }

//     for (let i = 1; i <= 5; i++) {
//       let title =
//         language === "es"
//           ? "Artículo lorem ipsum dolor sit amet consectetur adipiscing elit lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor"
//           : "Article lorem ipsum dolor sit amet consectetur adipiscing elit lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor";
//       let slug = `article-${i}`;
//       let sectionId: string | null = null;
//       // first null, second 1, third 2, then repeat for every 2 articles
//       if (i % 2 === 0) {
//         sectionId = "1";
//       } else if (i % 3 === 0) {
//         sectionId = "2";
//       }

//       articles.push({
//         id: i.toString(),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         author: authors[0],
//         title: `${title} ${i}`,
//         description: "Description " + i,
//         contentDraft: FakeArticle,
//         contentPublished: FakeArticle,
//         contentType: "markdown",
//         slug,
//         language,
//         // version,
//         // tags: [tags[i]],
//         // reactions: [],
//         sectionId,
//         publishedAt: new Date(),
//         href: `/${kb.slug}/${language}/articles/${slug}`,
//         relatedArticles: articles
//           .filter((f) => f.language === language)
//           .map((f) => {
//             return {
//               ...f,
//               relatedArticles: [],
//             };
//           }),
//         featuredOrder: i % 2 === 0 ? i : null,
//         metatags: [{ title: `${title} ${i} | ${kb.title}`, description: "Description " + i }],
//         order: i,
//         views: 0,
//         upvotes: 0,
//         downvotes: 0,
//         seoImage: "https://yahooder.sirv.com/saasfrontends/remix/ss/cover.png",
//       });
//     }
//   });
//   // });

//   let result: KbSearchResultDto = {
//     categories,
//     articles,
//     // tags,
//     // authors,
//   };

//   return result;
// }

async function fakeSearch({ original, query }: { original: KbSearchResultDto; query: string | undefined }): Promise<KbSearchResultDto> {
  // const authors: string[] = ["John Doe", "Jane Doe", "John Smith", "Jane Smith", "Alex Doe", "Alex Smith"];
  const categories: KbCategoryDto[] = [];
  // const tags: KnowledgeBaseTagDto[] = [];
  const articles: KbArticleDto[] = [];

  function find(arr: string[]) {
    return arr.filter((f) => !query || f.toLowerCase().includes(query.toLowerCase())).length > 0;
  }

  original.categories.forEach((category) => {
    //
    if (find([category.title, category.slug, category.description])) {
      if (!categories.find((f) => f.title === category.title)) {
        categories.push(category);
      }
    }
  });

  original.articles.forEach((article) => {
    if (find([article.title, article.slug, article.description, article.contentDraft])) {
      if (!articles.find((f) => f.title === article.title)) {
        articles.push(article);
      }
    }
    // article.tags.forEach((tag) => {
    //   if (find([tag.name])) {
    //     if (!tags.find((f) => f.name === tag.name)) {
    //       tags.push(tag);
    //     }
    //   }
    // });
    // if (find([article.author])) {
    //   if (!authors.find((f) => f === article.author)) {
    //     authors.push(article.author);
    //   }
    // }
  });

  return {
    categories,
    articles,
    // tags,
    // authors,
  };
}

async function del(item: KnowledgeBaseDto) {
  const articlesCount = await db.knowledgeBaseArticle.count({
    where: { knowledgeBaseId: item.id },
  });
  const categoriesCount = await db.knowledgeBaseCategory.count({
    where: { knowledgeBaseId: item.id },
  });
  if (articlesCount > 0) {
    throw new Error("Cannot delete knowledge base with articles");
  }
  if (categoriesCount > 0) {
    throw new Error("Cannot delete knowledge base with categories");
  }
  return await db.knowledgeBase.delete({
    where: { id: item.id },
  });
}

async function duplicateCategory({ kb, language, categoryId }: { kb: KnowledgeBaseDto; language: string; categoryId: string }) {
  const allCategories = await getAllKnowledgeBaseCategories({
    knowledgeBaseSlug: kb.slug,
    language,
  });
  const existing = allCategories.find((p) => p.id === categoryId);
  if (!existing) {
    throw Error("Invalid category");
  }
  let number = 2;
  let slug = "";

  const findExistingSlug = (slug: string) => {
    return allCategories.find((p) => p.slug === slug);
  };

  do {
    slug = `${existing.slug}${number}`;
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
  if (allCategories.length > 0) {
    maxOrder = Math.max(...allCategories.map((p) => p.order));
  }

  const item = await createKnowledgeBaseCategory({
    knowledgeBaseId: kb.id,
    slug,
    order: maxOrder + 1,
    title: existing.title + " " + number,
    description: existing.description,
    icon: existing.icon,
    language: existing.language,
    seoImage: existing.seoImage,
  });
  return item;
}

async function duplicateArticle({ kb, language, articleId }: { kb: KnowledgeBaseDto; language: string; articleId: string }) {
  const allArticles = await getAllKnowledgeBaseArticles({
    knowledgeBaseSlug: kb.slug,
    language,
  });

  const existing = allArticles.find((p) => p.id === articleId);
  if (!existing) {
    throw Error("Invalid article");
  }

  const { slug, maxOrder, number } = KnowledgeBaseUtils.getAvailableArticleSlug({
    allArticles,
    initialSlug: existing.slug,
  });

  const item = await createKnowledgeBaseArticle({
    knowledgeBaseId: kb.id,
    categoryId: existing.categoryId,
    sectionId: existing.sectionId,
    slug,
    title: existing.title + " " + number,
    description: existing.description,
    order: maxOrder + 1,
    contentDraft: existing.contentDraft,
    contentPublished: existing.contentPublished,
    contentType: existing.contentType,
    language: existing.language,
    featuredOrder: existing.featuredOrder,
    author: existing.author,
    seoImage: existing.seoImage,
    publishedAt: null,
  });
  return item;
}

export default {
  getAll,
  get,
  getById,
  getCategories,
  getArticles,
  getArticle,
  getArticleById,
  getFeaturedArticles,
  getCategory,
  del,
  duplicateCategory,
  duplicateArticle,
};
