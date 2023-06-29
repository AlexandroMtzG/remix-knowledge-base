import { type KbArticleDto } from "./KbArticleDto";
import { type KbCategoryDto } from "./KbCategoryDto";

export type KbSearchResultDto = {
  categories: KbCategoryDto[];
  articles: KbArticleDto[];
};
