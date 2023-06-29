import ServerError from "~/components/ServerError";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService";
import { useTypedLoaderData } from "remix-typedjson";
import KbHeader from "~/modules/knowledgeBase/components/KbHeader";
import type { KbCategoryDto } from "~/modules/knowledgeBase/dtos/KbCategoryDto";
import type { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import KbCategory from "~/modules/knowledgeBase/components/categories/KbCategory";
import type { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import KnowledgeBaseUtils from "~/modules/knowledgeBase/utils/KnowledgeBaseUtils";

type LoaderData = {
  metatags?: MetaTagsDto;
  item: KbCategoryDto | null;
  kb: KnowledgeBaseDto;
  language: string;
  allCategories: KbCategoryDto[];
};
export let loader = async ({ request, params }: LoaderArgs) => {
  const kb = await KnowledgeBaseService.get({ slug: params.slug!, enabled: true });
  const language = params.lang ?? kb.defaultLanguage;

  const item = await KnowledgeBaseService.getCategory({
    kb,
    category: params.category ?? "",
    language,
    params,
  });
  if (!item) {
    return redirect(KnowledgeBaseUtils.getKbUrl({ kb, params }));
  }
  const data: LoaderData = {
    metatags: item?.metatags,
    kb,
    item,
    allCategories: await KnowledgeBaseService.getCategories({
      kb,
      params,
    }),
    language,
  };
  return json(data);
};

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;

export default function Index() {
  const data = useTypedLoaderData<LoaderData>();
  return (
    <div className="min-h-screen">
      <KbHeader kb={data.kb} withTitleAndDescription={false} />
      <div className="max-w-5xl mx-auto py-8 px-8 min-h-screen">
        <div className="space-y-5">{!data.item ? <div>Not found</div> : <KbCategory kb={data.kb} item={data.item} allCategories={data.allCategories} />}</div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
