import ServerError from "~/components/ServerError";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService";
import { useTypedLoaderData } from "remix-typedjson";
import KbHeader from "~/modules/knowledgeBase/components/KbHeader";
import KbCategories from "~/modules/knowledgeBase/components/categories/KbCategories";
import type { KbCategoryDto } from "~/modules/knowledgeBase/dtos/KbCategoryDto";
import type { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import type { KbArticleDto } from "~/modules/knowledgeBase/dtos/KbArticleDto";
import type { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import KbFeaturedArticles from "~/modules/knowledgeBase/components/KbFeaturedArticles";
import { createKnowledgeBaseView } from "~/modules/knowledgeBase/db/kbAnalytics.db.server";
import { getUserInfo } from "~/utils/session/session.server";

type LoaderData = {
  metatags: MetaTagsDto;
  kb: KnowledgeBaseDto;
  categories: KbCategoryDto[];
  featured: KbArticleDto[];
  query?: string;
};
export let loader = async ({ request, params }: LoaderArgs) => {
  const kb = await KnowledgeBaseService.get({ slug: params.slug!, enabled: true });

  const userInfo = await getUserInfo(request);

  await createKnowledgeBaseView({ userAnalyticsId: userInfo.userAnalyticsId, knowledgeBaseId: kb.id });
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("q")?.toString();
  const data: LoaderData = {
    metatags: kb.metatags,
    kb,
    categories: await KnowledgeBaseService.getCategories({
      kb,
      params,
    }),
    featured: await KnowledgeBaseService.getFeaturedArticles({
      kb,
      params,
    }),
    query,
    // searchResult,
  };
  return defer(data);
};

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;

export default function Index() {
  const data = useTypedLoaderData<LoaderData>();

  return (
    <div className="min-h-screen">
      <KbHeader kb={data.kb} withTitleAndDescription={true} />
      <div className="max-w-5xl mx-auto py-6 px-8">
        <div className="space-y-8">
          <KbFeaturedArticles kb={data.kb} items={data.featured} />
          <KbCategories kb={data.kb} items={data.categories} />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ServerError error={error} />;
}
