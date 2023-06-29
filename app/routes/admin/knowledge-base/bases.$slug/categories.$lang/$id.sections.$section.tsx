import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { useParams, useSubmit } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
import KbCategorySectionForm from "~/modules/knowledgeBase/components/bases/KbCategorySectionForm";
import { updateKnowledgeBaseArticle } from "~/modules/knowledgeBase/db/kbArticles.db.server";
import { getKbCategoryById } from "~/modules/knowledgeBase/db/kbCategories.db.server";
import {
  KnowledgeBaseCategorySectionWithDetails,
  deleteKnowledgeBaseCategorySection,
  getKbCategorySectionById,
  updateKnowledgeBaseCategorySection,
} from "~/modules/knowledgeBase/db/kbCategorySections.db.server";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import { KnowledgeBaseCategoryWithDetails } from "~/modules/knowledgeBase/helpers/KbCategoryModelHelper";
import KnowledgeBasePermissionsService from "~/modules/knowledgeBase/service/KnowledgeBasePermissionsService";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService";

type LoaderData = {
  knowledgeBase: KnowledgeBaseDto;
  category: KnowledgeBaseCategoryWithDetails;
  item: KnowledgeBaseCategorySectionWithDetails;
};
export let loader = async ({ params }: LoaderArgs) => {
  const knowledgeBase = await KnowledgeBaseService.get({
    slug: params.slug!,
  });
  const category = await getKbCategoryById(params.id!);
  if (!category) {
    return redirect(`/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}`);
  }
  const item = await getKbCategorySectionById(params.section!);
  if (!item) {
    return redirect(`/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}/${params.id}`);
  }
  const data: LoaderData = {
    knowledgeBase,
    category,
    item,
  };
  return json(data);
};

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const action = form.get("action")?.toString();
  await KnowledgeBasePermissionsService.hasPermission({ action });

  const item = await getKbCategorySectionById(params.section!);
  if (!item) {
    return redirect(`/admin/knowledge-base/bases/${params.slug}/${params.lang}/${params.id}`);
  }

  if (action === "edit") {
    const order = Number(form.get("order")?.toString() ?? "");
    const title = form.get("title")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";

    try {
      await updateKnowledgeBaseCategorySection(item.id, {
        order,
        title,
        description,
      });
    } catch (e: any) {
      return json({ error: e.message }, { status: 400 });
    }

    return redirect(`/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}`);
  } else if (action === "delete") {
    await deleteKnowledgeBaseCategorySection(item.id);
    return redirect(`/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}`);
  } else if (action === "set-orders") {
    const items: { id: string; order: number }[] = form.getAll("orders[]").map((f: FormDataEntryValue) => {
      return JSON.parse(f.toString());
    });

    await Promise.all(
      items.map(async ({ id, order }) => {
        await updateKnowledgeBaseArticle(id, {
          order: Number(order),
        });
      })
    );
    return json({ updated: true });
  } else {
    return json({ error: "Invalid form" }, { status: 400 });
  }
};

export default function () {
  const data = useTypedLoaderData<LoaderData>();
  const submit = useSubmit();
  const params = useParams();

  function onDelete() {
    const form = new FormData();
    form.set("action", "delete");
    submit(form, {
      method: "post",
    });
  }
  return (
    <div>
      <KbCategorySectionForm knowledgeBase={data.knowledgeBase} category={data.category} language={params.lang!} item={data.item} onDelete={onDelete} />
    </div>
  );
}
