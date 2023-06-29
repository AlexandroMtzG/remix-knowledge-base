import { ActionArgs, json, LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import { useTypedLoaderData } from "remix-typedjson";
import { Link, Outlet, useSearchParams, useSubmit } from "@remix-run/react";
import TabsWithIcons from "~/components/ui/tabs/TabsWithIcons";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import PlusIcon from "~/components/ui/icons/PlusIcon";
import TableSimple from "~/components/ui/tables/TableSimple";
import InputCheckbox from "~/components/ui/input/InputCheckbox";
import DateCell from "~/components/ui/dates/DateCell";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService";
import { updateKnowledgeBase } from "~/modules/knowledgeBase/db/knowledgeBase.db.server";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import KnowledgeBaseTemplatesService from "~/modules/knowledgeBase/service/KnowledgeBaseTemplatesService";
import { KnowledgeBasesTemplateDto } from "~/modules/knowledgeBase/dtos/KnowledgeBasesTemplateDto";
import KnowledgeBasePermissionsService from "~/modules/knowledgeBase/service/KnowledgeBasePermissionsService";

type LoaderData = {
  metatags: MetaTagsDto;
  items: KnowledgeBaseDto[];
  template: KnowledgeBasesTemplateDto;
};
export let loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    metatags: [{ title: `Knowledge Base` }],
    items: await KnowledgeBaseService.getAll({}),
    template: await KnowledgeBaseTemplatesService.getTemplate(),
  };
  return json(data);
};

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const action = form.get("action")?.toString();
  await KnowledgeBasePermissionsService.hasPermission({ action });
  if (action === "toggle") {
    const id = form.get("id")?.toString() ?? "";
    const enabled = form.get("enabled")?.toString() === "true";

    const item = await KnowledgeBaseService.getById(id);
    if (!item) {
      return json({ error: "Not found" }, { status: 404 });
    }

    await updateKnowledgeBase(id, {
      enabled,
    });

    return json({ success: "Updated" });
  } else {
    return json({ error: "Invalid form" }, { status: 400 });
  }
};

export default function CampaignsListRoute() {
  const data = useTypedLoaderData<LoaderData>();
  const submit = useSubmit();

  const [searchParams] = useSearchParams();

  function countStatus(enabled?: boolean) {
    if (enabled === undefined) {
      return data.items.length;
    }
    return data.items.filter((item) => item.enabled === enabled).length;
  }
  function onToggle(item: KnowledgeBaseDto, enabled: boolean) {
    const form = new FormData();
    form.set("action", "toggle");
    form.set("enabled", enabled ? "true" : "false");
    form.set("id", item.id.toString());
    submit(form, {
      method: "post",
    });
  }
  function filteredItems() {
    if (searchParams.get("status") === "active") {
      return data.items.filter((item) => item.enabled);
    }
    if (searchParams.get("status") === "inactive") {
      return data.items.filter((item) => !item.enabled);
    }
    return data.items;
  }

  function onExport() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data.template, null, "\t"));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "kbs.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  return (
    <div className="mx-auto mb-12 max-w-5xl space-y-5 px-4 py-4 sm:px-6 lg:px-8 xl:max-w-7xl">
      <div className="flex items-center justify-between space-x-2">
        <div className="flex-grow">
          <TabsWithIcons
            tabs={[
              {
                name: `All ${countStatus() ? `(${countStatus()})` : ""}`,
                href: "?",
                current: !searchParams.get("status") || searchParams.get("status") === "all",
              },
              {
                name: `Active ${countStatus(true) ? `(${countStatus(true)})` : ""}`,
                href: "?status=active",
                current: searchParams.get("status") === "active",
              },
              {
                name: `Inactive ${countStatus(false) ? `(${countStatus(false)})` : ""}`,
                href: "?status=inactive",
                current: searchParams.get("status") === "inactive",
              },
            ]}
          />
        </div>
        <div className="flex space-x-1">
          <ButtonSecondary to="import">Import</ButtonSecondary>
          <ButtonSecondary onClick={onExport}>Export</ButtonSecondary>
          <ButtonPrimary to="new">
            <div>New</div>
            <PlusIcon className="h-5 w-5" />
          </ButtonPrimary>
        </div>
      </div>

      <TableSimple
        items={filteredItems()}
        actions={[
          {
            title: "Categories",
            onClickRoute: (_, i) => `${i.slug}/categories`,
          },
          {
            title: "Preview",
            onClickRoute: (_, i) => `/${i.slug}`,
            onClickRouteTarget: "_blank",
          },
          {
            title: "Edit",
            onClickRoute: (_, i) => `${i.id}`,
          },
        ]}
        headers={[
          {
            name: "status",
            title: "Status",
            value: (i) => {
              return <InputCheckbox asToggle value={i.enabled} setValue={(checked) => onToggle(i, Boolean(checked))} />;
            },
          },
          {
            name: "title",
            title: "Title",
            className: "w-full",
            value: (i) => (
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="text-base font-bold">{i.title}</div>
                  <SimpleBadge title={"/" + i.slug} color={i.color} />
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Link to={`${i.slug}/articles`} className="hover:underline">
                    {i.count.articles} articles
                  </Link>
                  <div>•</div>
                  <Link to={`${i.slug}/categories`} className="hover:underline">
                    {i.count.categories} categories
                  </Link>
                </div>
              </div>
            ),
          },
          {
            name: "views",
            title: "Views",
            value: (i) => i.count.views,
          },
          {
            name: "updatedAt",
            title: "Updated at",
            value: (i) => <DateCell date={i.updatedAt} />,
          },
        ]}
        noRecords={
          <div className="p-12 text-center">
            <h3 className="mt-1 text-sm font-medium text-gray-900">{"No knowledge bases"}</h3>
            <p className="mt-1 text-sm text-gray-500">{"Get started by creating a new knowledge base."}</p>
          </div>
        }
      />

      <Outlet />
    </div>
  );
}
