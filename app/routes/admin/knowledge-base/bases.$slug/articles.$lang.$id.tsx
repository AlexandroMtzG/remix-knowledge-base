import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, useNavigate, useOutlet, useParams } from "@remix-run/react";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import KbArticleContent from "~/modules/knowledgeBase/components/articles/KbArticleContent";
import { getKbArticleById, updateKnowledgeBaseArticle } from "~/modules/knowledgeBase/db/kbArticles.db.server";
import { KbArticleDto } from "~/modules/knowledgeBase/dtos/KbArticleDto";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import KnowledgeBasePermissionsService from "~/modules/knowledgeBase/service/KnowledgeBasePermissionsService";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService";

type LoaderData = {
  knowledgeBase: KnowledgeBaseDto;
  item: KbArticleDto;
};
export let loader = async ({ params }: LoaderArgs) => {
  const knowledgeBase = await KnowledgeBaseService.get({
    slug: params.slug!,
  });
  if (!knowledgeBase) {
    return redirect("/admin/knowledge-base/bases");
  }
  const item = await KnowledgeBaseService.getArticleById({
    kb: knowledgeBase,
    id: params.id!,
  });
  if (!item) {
    return redirect(`/admin/knowledge-base/bases/${params.slug!}/articles`);
  }
  const data: LoaderData = {
    knowledgeBase,
    item,
  };
  return json(data);
};

type ActionData = {
  error?: string;
};
export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  await KnowledgeBasePermissionsService.hasPermission({ action });

  const item = await getKbArticleById(params.id!);
  if (!item) {
    return json({ error: "Article not found" }, { status: 400 });
  }

  if (action === "togglePublish") {
    if (!item.categoryId) {
      return json({ error: "Article must have a category. Go to settings to set one." }, { status: 400 });
    }
    let publishedAt = item.publishedAt;
    let contentPublished = item.contentPublished;
    if (item.publishedAt) {
      publishedAt = null;
    } else {
      publishedAt = new Date();
      contentPublished = item.contentDraft;
    }

    await updateKnowledgeBaseArticle(item.id, {
      publishedAt,
      contentPublished,
    });

    return json({ success: true });
  }
  return json({ error: "Invalid action" }, { status: 400 });
};

export default function () {
  const data = useTypedLoaderData<LoaderData>();
  const actionData = useTypedActionData<ActionData>();
  const params = useParams();
  const outlet = useOutlet();
  const navigate = useNavigate();

  return (
    <Form method="post" className="space-y-6">
      <input type="hidden" readOnly name="action" value="togglePublish" />
      <EditPageLayout
        title={`${data.item.title}`}
        withHome={false}
        menu={[
          { title: "Knowledge Bases", routePath: "/admin/knowledge-base/bases" },
          { title: "Articles", routePath: `/admin/knowledge-base/bases/${params.slug}/articles` },
          { title: params.lang!, routePath: `/admin/knowledge-base/bases/${params.slug}/articles/${params.lang}` },
          {
            title: data.item.title,
            routePath: `/admin/knowledge-base/bases/${params.slug}/articles/${params.lang}/${params.id}`,
          },
        ]}
        buttons={
          <>
            <ButtonSecondary to="settings">
              <div>Settings</div>
            </ButtonSecondary>
            <ButtonSecondary to="edit">
              <div>Edit latest</div>
            </ButtonSecondary>
            {data.item.publishedAt && (
              <ButtonSecondary to={data.item.href} target="_blank">
                <div>Preview</div>
              </ButtonSecondary>
            )}
            <ButtonPrimary type="submit" destructive={!!data.item.publishedAt}>
              {data.item.publishedAt ? <div>Unpublish</div> : <div>Publish</div>}
            </ButtonPrimary>
          </>
        }
      >
        <div className="space-y-2">
          <div className="space-y-3 max-w-2xl mx-auto py-12">
            <KbArticleContent item={data.item} content={data.item.contentDraft} />
          </div>
        </div>

        <ActionResultModal actionData={actionData} showSuccess={false} />

        <SlideOverWideEmpty
          title={"Article settings"}
          open={!!outlet}
          onClose={() => {
            navigate(".", { replace: true });
          }}
          className="sm:max-w-sm"
          overflowYScroll={true}
        >
          <div className="-mx-1 -mt-3">
            <div className="space-y-4">{outlet}</div>
          </div>
        </SlideOverWideEmpty>
      </EditPageLayout>
    </Form>
  );
}
