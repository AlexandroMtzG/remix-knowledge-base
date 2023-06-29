import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, useNavigate, useOutlet, useParams } from "@remix-run/react";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import KbArticleForm from "~/modules/knowledgeBase/components/bases/KbArticleForm";
import { KnowledgeBaseArticleWithDetails, getKbArticleById, updateKnowledgeBaseArticle } from "~/modules/knowledgeBase/db/kbArticles.db.server";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import KnowledgeBasePermissionsService from "~/modules/knowledgeBase/service/KnowledgeBasePermissionsService";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService";
import KnowledgeBaseUtils from "~/modules/knowledgeBase/utils/KnowledgeBaseUtils";

type LoaderData = {
  knowledgeBase: KnowledgeBaseDto;
  item: KnowledgeBaseArticleWithDetails;
};
export let loader = async ({ params }: LoaderArgs) => {
  const knowledgeBase = await KnowledgeBaseService.get({
    slug: params.slug!,
  });
  if (!knowledgeBase) {
    return redirect("/admin/knowledge-base/bases");
  }
  const item = await getKbArticleById(params.id!);
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

  if (action === "edit") {
    const content = form.get("content")?.toString() ?? "";
    const contentType = form.get("contentType")?.toString() ?? "";

    await updateKnowledgeBaseArticle(item.id, {
      contentDraft: content,
      contentType,
    });

    return redirect(`/admin/knowledge-base/bases/${params.slug}/articles/${params.lang}/${params.id}`);
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
      <input type="hidden" readOnly name="action" value="edit" />
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
            <ButtonSecondary to={`/admin/knowledge-base/bases/${params.slug}/articles/${params.lang}/${params.id}`}>
              <div>Cancel</div>
            </ButtonSecondary>
            <LoadingButton type="submit">
              <div>Save draft</div>
            </LoadingButton>
          </>
        }
      >
        <div className="space-y-2">
          <KbArticleForm item={data.item} />
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
