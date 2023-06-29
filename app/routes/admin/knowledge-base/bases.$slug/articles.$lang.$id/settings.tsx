import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { useRef } from "react";
import { useTypedLoaderData } from "remix-typedjson";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import KbArticleSettingsForm from "~/modules/knowledgeBase/components/bases/KbArticleSettingsForm";
import {
  KnowledgeBaseArticleWithDetails,
  deleteKnowledgeBaseArticle,
  getKbArticleById,
  getKbArticleBySlug,
  updateKnowledgeBaseArticle,
} from "~/modules/knowledgeBase/db/kbArticles.db.server";
import { getAllKnowledgeBaseCategories } from "~/modules/knowledgeBase/db/kbCategories.db.server";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import { KnowledgeBaseCategoryWithDetails } from "~/modules/knowledgeBase/helpers/KbCategoryModelHelper";
import KnowledgeBasePermissionsService from "~/modules/knowledgeBase/service/KnowledgeBasePermissionsService";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService";

type LoaderData = {
  knowledgeBase: KnowledgeBaseDto;
  item: KnowledgeBaseArticleWithDetails;
  categories: KnowledgeBaseCategoryWithDetails[];
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
  const categories = await getAllKnowledgeBaseCategories({
    knowledgeBaseSlug: knowledgeBase.slug,
    language: params.lang!,
  });
  const data: LoaderData = {
    knowledgeBase,
    item,
    categories,
  };
  return json(data);
};

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  await KnowledgeBasePermissionsService.hasPermission({ action });

  const kb = await KnowledgeBaseService.get({ slug: params.slug! });
  const item = await getKbArticleById(params.id!);
  if (!item) {
    return json({ error: "Article not found" }, { status: 400 });
  }

  if (action === "edit") {
    const categoryId = form.get("categoryId")?.toString() ?? null;
    const sectionId = form.get("sectionId")?.toString() ?? null;
    const slug = form.get("slug")?.toString() ?? "";
    const title = form.get("title")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";
    const seoImage = form.get("seoImage")?.toString() ?? "";
    const isFeatured = Boolean(form.get("isFeatured"));

    const existing = await getKbArticleBySlug({
      knowledgeBaseId: kb.id,
      slug,
      language: params.lang!,
    });
    if (existing && existing.id !== item.id) {
      return json({ error: "Slug already exists" }, { status: 400 });
    }

    let featuredOrder = item.featuredOrder;
    if (isFeatured) {
      if (!item.featuredOrder) {
        const featuredArticles = await KnowledgeBaseService.getFeaturedArticles({
          kb,
          params: {},
        });
        let maxOrder = 0;
        if (featuredArticles.length > 0) {
          maxOrder = Math.max(...featuredArticles.map((p) => p.featuredOrder ?? 0));
        }
        featuredOrder = maxOrder + 1;
      }
    } else {
      featuredOrder = null;
    }

    await updateKnowledgeBaseArticle(item.id, {
      categoryId: categoryId?.length ? categoryId : null,
      sectionId: sectionId?.length ? sectionId : null,
      slug,
      title,
      description,
      order: 0,
      language: params.lang!,
      featuredOrder,
      author: "",
      seoImage,
    });

    return redirect(`/admin/knowledge-base/bases/${kb.slug}/articles/${params.lang}/${item.id}`);
  } else if (action === "delete") {
    await deleteKnowledgeBaseArticle(item.id);
    return redirect(`/admin/knowledge-base/bases/${kb.slug}/articles/${params.lang}`);
  }
  return json({ error: "Invalid action" }, { status: 400 });
};

export default function () {
  const data = useTypedLoaderData<LoaderData>();
  const submit = useSubmit();

  const confirmDelete = useRef<RefConfirmModal>(null);

  function onDelete() {
    confirmDelete.current?.show("Delete article", "Delete", "Cancel", `Are you sure you want to delete the article "${data.item.title}"?`);
  }

  function onConfirmedDelete() {
    const form = new FormData();
    form.set("action", "delete");
    submit(form, {
      method: "post",
    });
  }
  return (
    <div>
      <KbArticleSettingsForm categories={data.categories} item={data.item} onDelete={onDelete} />

      <ConfirmModal ref={confirmDelete} onYes={onConfirmedDelete} destructive />
    </div>
  );
}
