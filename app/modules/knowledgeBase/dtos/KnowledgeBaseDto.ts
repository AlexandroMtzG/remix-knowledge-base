import type { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import type { Colors } from "~/application/enums/shared/Colors";
import { KbNavLinkDto } from "./KbNavLinkDto";

export type KnowledgeBaseDto = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  slug: string;
  title: string;
  description: string;
  defaultLanguage: string;
  layout: "list" | "articles" | "grid";
  color: Colors;
  enabled: boolean;
  metatags: MetaTagsDto;
  languages: string[];
  links: KbNavLinkDto[];
  logo: string;
  seoImage: string;
  count: {
    categories: number;
    articles: number;
    views: number;
  };
};
