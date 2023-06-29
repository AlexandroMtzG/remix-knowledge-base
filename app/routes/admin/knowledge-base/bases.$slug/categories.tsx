import { LoaderArgs, json, redirect } from "@remix-run/node";
import { Link, useParams } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { getAllKnowledgeBaseCategories } from "~/modules/knowledgeBase/db/kbCategories.db.server";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import { KnowledgeBaseCategoryWithDetails } from "~/modules/knowledgeBase/helpers/KbCategoryModelHelper";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService";
import KnowledgeBaseUtils from "~/modules/knowledgeBase/utils/KnowledgeBaseUtils";

type LoaderData = {
  knowledgeBase: KnowledgeBaseDto;
  items: KnowledgeBaseCategoryWithDetails[];
};
export let loader = async ({ params }: LoaderArgs) => {
  const knowledgeBase = await KnowledgeBaseService.get({
    slug: params.slug!,
  });
  if (!knowledgeBase) {
    return redirect("/admin/knowledge-base/bases");
  }
  const items = await getAllKnowledgeBaseCategories({
    knowledgeBaseSlug: params.slug!,
    language: undefined,
  });
  const data: LoaderData = {
    knowledgeBase,
    items,
  };
  return json(data);
};
export default function () {
  const data = useTypedLoaderData<LoaderData>();
  const params = useParams();
  return (
    <EditPageLayout
      title="Categories"
      withHome={false}
      menu={[
        { title: "Knowledge Bases", routePath: "/admin/knowledge-base/bases" },
        { title: "Categories", routePath: `/admin/knowledge-base/bases/${params.slug}/categories` },
      ]}
    >
      <div className="space-y-2">
        {data.knowledgeBase.languages.map((f) => {
          return (
            <div key={f} className="space-y-2">
              <Link
                to={f}
                className="relative block rounded-lg border-2 border-dashed border-gray-300 px-12 py-6 text-center hover:border-gray-400 focus:outline-none focus:border-solid space-y-2"
              >
                <div className="font-bold">{KnowledgeBaseUtils.getLanguageName(f)}</div>
                <div className="text-sm">{data.items.filter((x) => x.language === f).length} categories</div>
              </Link>
            </div>
          );
        })}
      </div>
    </EditPageLayout>
  );
}
