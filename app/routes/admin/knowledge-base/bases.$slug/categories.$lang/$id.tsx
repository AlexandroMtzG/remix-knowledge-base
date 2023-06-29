import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { useParams, useSubmit } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
import KbCategoryForm from "~/modules/knowledgeBase/components/bases/KbCategoryForm";
import { updateKnowledgeBaseArticle } from "~/modules/knowledgeBase/db/kbArticles.db.server";
import {
  deleteKnowledgeBaseCategory,
  getKbCategoryById,
  getKbCategoryBySlug,
  updateKnowledgeBaseCategory,
} from "~/modules/knowledgeBase/db/kbCategories.db.server";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import { KnowledgeBaseCategoryWithDetails } from "~/modules/knowledgeBase/helpers/KbCategoryModelHelper";
import KnowledgeBasePermissionsService from "~/modules/knowledgeBase/service/KnowledgeBasePermissionsService";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService";

type LoaderData = {
  knowledgeBase: KnowledgeBaseDto;
  item: KnowledgeBaseCategoryWithDetails;
};
export let loader = async ({ params }: LoaderArgs) => {
  const knowledgeBase = await KnowledgeBaseService.get({
    slug: params.slug!,
  });
  const item = await getKbCategoryById(params.id!);
  if (!item) {
    return redirect(`/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}`);
  }
  const data: LoaderData = {
    knowledgeBase,
    item,
  };
  return json(data);
};

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const action = form.get("action")?.toString();
  await KnowledgeBasePermissionsService.hasPermission({ action });

  const knowledgeBase = await KnowledgeBaseService.get({
    slug: params.slug!,
  });

  const item = await getKbCategoryById(params.id!);
  if (!item) {
    return redirect(`/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}`);
  }

  if (action === "edit") {
    const slug = form.get("slug")?.toString() ?? "";
    const title = form.get("title")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";
    const icon = form.get("icon")?.toString() ?? "";
    const seoImage = form.get("seoImage")?.toString() ?? "";

    const existing = await getKbCategoryBySlug({
      knowledgeBaseId: knowledgeBase.id,
      slug,
      language: params.lang!,
    });
    if (existing && existing.id !== item.id) {
      return json({ error: "Slug already exists" }, { status: 400 });
    }

    try {
      await updateKnowledgeBaseCategory(item.id, {
        slug,
        title,
        description,
        icon,
        language: params.lang!,
        seoImage,
      });
    } catch (e: any) {
      return json({ error: e.message }, { status: 400 });
    }

    return redirect(`/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}`);
  } else if (action === "delete") {
    await deleteKnowledgeBaseCategory(item.id);
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
      <KbCategoryForm knowledgeBase={data.knowledgeBase} language={params.lang!} item={data.item} onDelete={onDelete} />
    </div>
  );
}
