import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Link, useLocation, useNavigate, useOutlet, useParams, useSubmit } from "@remix-run/react";
import { useRef, useState } from "react";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import DocumentDuplicateIconFilled from "~/components/ui/icons/DocumentDuplicateIconFilled";
import FolderIconFilled from "~/components/ui/icons/FolderIconFilled";
import PlusIcon from "~/components/ui/icons/PlusIcon";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import OrderListButtons from "~/components/ui/sort/OrderListButtons";
import {
  deleteKnowledgeBaseCategory,
  getAllKnowledgeBaseCategories,
  getKbCategoryById,
  updateKnowledgeBaseCategory,
} from "~/modules/knowledgeBase/db/kbCategories.db.server";
import {
  deleteKnowledgeBaseCategorySection,
  getKbCategorySectionById,
  updateKnowledgeBaseCategorySection,
} from "~/modules/knowledgeBase/db/kbCategorySections.db.server";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import { KnowledgeBaseCategoryWithDetails } from "~/modules/knowledgeBase/helpers/KbCategoryModelHelper";
import KnowledgeBasePermissionsService from "~/modules/knowledgeBase/service/KnowledgeBasePermissionsService";
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
    language: params.lang!,
  });
  const data: LoaderData = {
    knowledgeBase,
    items,
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

  const kb = await KnowledgeBaseService.get({ slug: params.slug! });

  if (action === "set-orders") {
    const items: { id: string; order: number }[] = form.getAll("orders[]").map((f: FormDataEntryValue) => {
      return JSON.parse(f.toString());
    });

    await Promise.all(
      items.map(async ({ id, order }) => {
        await updateKnowledgeBaseCategory(id, {
          order: Number(order),
        });
      })
    );
    return json({ updated: true });
  } else if (action === "set-section-orders") {
    const items: { id: string; order: number }[] = form.getAll("orders[]").map((f: FormDataEntryValue) => {
      return JSON.parse(f.toString());
    });

    await Promise.all(
      items.map(async ({ id, order }) => {
        await updateKnowledgeBaseCategorySection(id, {
          order: Number(order),
        });
      })
    );
    return json({ updated: true });
  } else if (action === "delete-category") {
    const id = form.get("id")?.toString() ?? "";
    const existing = await getKbCategoryById(id);
    if (!existing) {
      return json({ error: "Category not found" }, { status: 400 });
    }
    await deleteKnowledgeBaseCategory(id);
    return json({ deleted: true });
  } else if (action === "delete-section") {
    const id = form.get("id")?.toString() ?? "";
    const existing = await getKbCategorySectionById(id);
    if (!existing) {
      return json({ error: "Section not found" }, { status: 400 });
    }
    await deleteKnowledgeBaseCategorySection(id);
    return json({ deleted: true });
  } else if (action === "duplicate") {
    try {
      const categoryId = form.get("id")?.toString() ?? "";
      await KnowledgeBaseService.duplicateCategory({ kb, language: params.lang!, categoryId });
      return json({ duplicated: true });
    } catch (e: any) {
      return json({ error: e.message }, { status: 400 });
    }
  }
  return json({ error: "Invalid action" }, { status: 400 });
};

export default function () {
  const data = useTypedLoaderData<LoaderData>();
  const actionData = useTypedActionData<ActionData>();
  const params = useParams();
  const outlet = useOutlet();
  const navigate = useNavigate();
  const submit = useSubmit();
  const location = useLocation();

  const [toggledCategories, setToggledCategories] = useState<string[]>([]);

  const confirmDeleteCategory = useRef<RefConfirmModal>(null);
  const confirmDeleteSection = useRef<RefConfirmModal>(null);

  function onDelete(item: KnowledgeBaseCategoryWithDetails) {
    confirmDeleteCategory.current?.setValue(item);
    confirmDeleteCategory.current?.show("Delete category", "Delete", "Cancel", `Are you sure you want to delete the category "${item.title}"?`);
  }

  function onConfirmedDeleteCategory(item: KnowledgeBaseCategoryWithDetails) {
    const form = new FormData();
    form.set("action", "delete-category");
    form.set("id", item.id);
    submit(form, {
      method: "post",
    });
  }

  function onDeleteSection(item: { id: string; title: string }) {
    confirmDeleteSection.current?.setValue(item);
    confirmDeleteSection.current?.show("Delete section", "Delete", "Cancel", `Are you sure you want to delete the section "${item.title}"?`);
  }

  function onConfirmedDeleteSection(item: KnowledgeBaseCategoryWithDetails) {
    const form = new FormData();
    form.set("action", "delete-section");
    form.set("id", item.id);
    submit(form, {
      method: "post",
    });
  }

  function onDuplicate(item: KnowledgeBaseCategoryWithDetails) {
    const form = new FormData();
    form.set("action", "duplicate");
    form.set("id", item.id);
    submit(form, {
      method: "post",
    });
  }

  function getOutletTitle() {
    if (location.pathname.includes("/sections/")) {
      if (params.section) {
        return "Edit section";
      } else {
        return "Create section";
      }
    } else {
      if (params.id) {
        return "Edit category";
      } else {
        return "Create category";
      }
    }
  }
  return (
    <EditPageLayout
      title={`Categories (${KnowledgeBaseUtils.getLanguageName(params.lang!)})`}
      withHome={false}
      menu={[
        { title: "Knowledge Bases", routePath: "/admin/knowledge-base/bases" },
        { title: "Categories", routePath: `/admin/knowledge-base/bases/${params.slug}/categories` },
        { title: params.lang!, routePath: `/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}` },
      ]}
    >
      <div className="space-y-2">
        {data.items.map((item, idx) => {
          return (
            <div key={idx} className="space-y-2">
              <div className="rounded-md border border-gray-300 bg-white px-4 py-1 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2 truncate">
                      <div className=" flex items-center space-x-3 truncate">
                        <div className="hidden flex-shrink-0 sm:flex">
                          <OrderListButtons index={idx} items={data.items} editable={true} />
                        </div>
                        <div className="flex items-center space-x-2 truncate text-sm text-gray-800">
                          <div className="flex items-baseline space-x-1 truncate">
                            <div className="flex flex-col">
                              <div className="flex items-baseline space-x-1">
                                <div>
                                  {item.title}
                                  {item.sections.length > 0 && (
                                    <span className="ml-1 truncate text-xs">
                                      ({item.sections.length === 1 ? "1 section" : `${item.sections.length} sections`})
                                    </span>
                                  )}
                                </div>
                                <div>•</div>
                                {item.articles.filter((f) => f.publishedAt && !f.sectionId).length > 0 ? (
                                  <div className="truncate text-xs text-gray-400">
                                    {item.articles
                                      .filter((f) => f.publishedAt)
                                      .map((article) => article.title)
                                      .join(", ")}
                                  </div>
                                ) : (
                                  <div className="truncate text-xs text-gray-400">No articles</div>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 space-x-1">
                      <div className="flex items-center space-x-1 truncate p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setToggledCategories((prev) => {
                              if (prev.includes(item.id)) {
                                return prev.filter((f) => f !== item.id);
                              }
                              return [...prev, item.id];
                            });
                          }}
                          className="group flex items-center rounded-md border border-transparent p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                        >
                          <FolderIconFilled className="h-4 w-4 text-gray-300 hover:text-gray-500" />
                        </button>
                        <Link
                          to={item.id}
                          className="group flex items-center rounded-md border border-transparent p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                        >
                          <PencilIcon className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDuplicate(item)}
                          className="group flex items-center rounded-md border border-transparent p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                        >
                          <DocumentDuplicateIconFilled className="h-4 w-4 text-gray-300 hover:text-gray-500" />
                        </button>
                        <button
                          type="button"
                          className="group flex items-center rounded-md border border-transparent p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                          onClick={() => onDelete(item)}
                        >
                          <TrashIcon className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {toggledCategories.includes(item.id) && <CategorySections category={item} onDeleteSection={onDeleteSection} />}
              </div>
            </div>
          );
        })}
        <Link
          to={`new`}
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 px-12 py-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-theme-500 focus:ring-offset-2"
        >
          <PlusIcon className="mx-auto h-5 text-gray-900" />
          <span className="mt-2 block text-sm font-medium text-gray-900">Add new category</span>
        </Link>
      </div>

      <ConfirmModal ref={confirmDeleteCategory} onYes={onConfirmedDeleteCategory} destructive />
      <ConfirmModal ref={confirmDeleteSection} onYes={onConfirmedDeleteSection} destructive />
      <ActionResultModal actionData={actionData} showSuccess={false} />

      <SlideOverWideEmpty
        title={getOutletTitle()}
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
  );
}

function CategorySections({
  category,
  onDeleteSection,
}: {
  category: KnowledgeBaseCategoryWithDetails;
  onDeleteSection: (section: { id: string; title: string }) => void;
}) {
  function getSectionArticles(id: string) {
    return category.articles.filter((f) => f.sectionId === id && f.publishedAt);
  }
  return (
    <div className="space-y-2 pb-2">
      {/* <div className="font-medium text-sm text-gray-700">Sections</div> */}
      <div className="space-y-2 bg-slate-50 border border-slate-100 rounded-md w-full px-4 py-2">
        <div className="space-y-2">
          {category.sections.map((item, idx) => {
            return (
              <div key={idx} className="rounded-md border border-gray-300 bg-white px-4 py-1 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2 truncate">
                      <div className=" flex items-center space-x-3 truncate">
                        <div className="hidden flex-shrink-0 sm:flex">
                          <OrderListButtons
                            formData={{
                              categoryId: item.id,
                            }}
                            actionName="set-section-orders"
                            index={idx}
                            items={category.sections}
                            editable={true}
                          />
                        </div>
                        <div className="flex items-center space-x-2 truncate text-sm text-gray-800">
                          <div className="flex items-baseline space-x-1 truncate">
                            <div className="flex flex-col">
                              <div className="flex items-baseline space-x-1">
                                {item.title}
                                <div>•</div>
                                {getSectionArticles(item.id).length > 0 ? (
                                  <div className="truncate text-xs text-gray-400">
                                    {getSectionArticles(item.id)
                                      .map((f) => f.title)
                                      .join(", ")}
                                  </div>
                                ) : (
                                  <div className="truncate text-xs text-gray-400">No articles</div>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 space-x-1">
                      <div className="flex items-center space-x-1 truncate p-1">
                        <Link
                          to={`${category.id}/sections/${item.id}`}
                          className="group flex items-center rounded-md border border-transparent p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                        >
                          <PencilIcon className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                        </Link>
                        <button
                          type="button"
                          className="group flex items-center rounded-md border border-transparent p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                          onClick={() => onDeleteSection(item)}
                        >
                          <TrashIcon className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <Link
            to={`${category.id}/sections/new`}
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-200 px-12 py-4 text-center hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-theme-500 focus:ring-offset-2"
          >
            <span className="block text-xs font-medium text-gray-600">Add section</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
