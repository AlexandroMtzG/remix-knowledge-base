import EmptyState from "~/components/ui/emptyState/EmptyState";
import type { KbCategoryDto } from "../../dtos/KbCategoryDto";
import type { KbCategorySectionDto } from "../../dtos/KbCategorySectionDto";
import type { KnowledgeBaseDto } from "../../dtos/KnowledgeBaseDto";
import KbArticles from "./KbArticles";

export default function KbArticlesBySection({ kb, item }: { kb: KnowledgeBaseDto; item: KbCategoryDto }) {
  // function getArticleSlug(item: KbArticleDto) {
  //   return `/${kb.slug}/${item.language}/articles/${item.slug}-${item.id}`;
  // }
  function getSections() {
    let sections: {
      section: KbCategorySectionDto | null;
      articles: {
        order: number;
        title: string;
        description: string;
        href: string;
        sectionId: string | null;
      }[];
    }[] = [];
    item.articles.forEach((article) => {
      const section = item.sections.find((item) => item.id === article.sectionId) ?? null;
      const sectionIndex = sections.findIndex((item) => item.section?.id === section?.id);
      if (sectionIndex === -1) {
        sections.push({
          section,
          articles: [article],
        });
      } else {
        sections[sectionIndex].articles.push(article);
      }
    });
    sections.forEach((item) => {
      item.articles = item.articles.sort((a, b) => {
        if (a.order && b.order) {
          return a.order - b.order;
        }
        return 0;
      });
    });
    sections = sections.sort((a, b) => {
      if (a.section?.order && b.section?.order) {
        return a.section.order - b.section.order;
      }
      return -1;
    });
    return sections;
  }
  return (
    <div>
      {item.articles.length === 0 ? (
        <EmptyState className="bg-white" captions={{ thereAreNo: "No articles" }} />
      ) : (
        <div className="space-y-6">
          {getSections().map((item) => {
            return (
              <div key={item.section?.id} className="space-y-3">
                {item.section && (
                  <div className="flex items-center space-x-2">
                    <div className="text-xl font-bold">{item.section.title}</div>
                  </div>
                )}
                <KbArticles kb={kb} items={item.articles} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
