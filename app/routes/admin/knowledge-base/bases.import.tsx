import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import { useTypedActionData } from "remix-typedjson";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ServerError from "~/components/ui/errors/ServerError";
import InputText from "~/components/ui/input/InputText";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import PreviewKbsTemplate from "~/modules/knowledgeBase/components/templates/PreviewKbsTemplate";
import { KnowledgeBasesTemplateDto } from "~/modules/knowledgeBase/dtos/KnowledgeBasesTemplateDto";
import KnowledgeBasePermissionsService from "~/modules/knowledgeBase/service/KnowledgeBasePermissionsService";
import KnowledgeBaseTemplatesService from "~/modules/knowledgeBase/service/KnowledgeBaseTemplatesService";
import DefaultKbsTemplate from "~/modules/knowledgeBase/utils/DefaultKbsTemplate";

export let loader: LoaderFunction = async () => {
  return json({});
};

type ActionData = {
  previewTemplate?: KnowledgeBasesTemplateDto;
  success?: string[];
  error?: string;
};
const success = (data: ActionData) => json(data, { status: 200 });
const badRequest = (data: ActionData) => json(data, { status: 400 });
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("action")?.toString();
  await KnowledgeBasePermissionsService.hasPermission({ action });
  if (action === "preview") {
    try {
      const previewTemplate = JSON.parse(form.get("configuration")?.toString() ?? "{}") as KnowledgeBasesTemplateDto;
      // await validateEntitiesFromTemplate(previewTemplate);
      const data: ActionData = {
        previewTemplate,
      };
      return success(data);
    } catch (error: any) {
      return badRequest({ error: error.message });
    }
  } else if (action === "create") {
    try {
      const template = JSON.parse(form.get("configuration")?.toString() ?? "{}") as KnowledgeBasesTemplateDto;
      const status = await KnowledgeBaseTemplatesService.importKbs(template);
      const messages: string[] = [];
      messages.push(`Knowledge bases (${status.created.kbs} created, ${status.updated.kbs} updated)`);
      messages.push(`Articles (${status.created.articles} created, ${status.updated.articles} updated)`);
      messages.push(`Categories (${status.created.categories} created, ${status.updated.categories} updated)`);
      messages.push(`Category Sections (${status.created.sections} created, ${status.updated.sections} updated)`);

      return success({
        success: messages,
      });
    } catch (error: any) {
      return badRequest({ error: error.message });
    }
  } else {
    return badRequest({ error: "Invalid form" });
  }
};

const defaultTemplates: { title: string; template: KnowledgeBasesTemplateDto }[] = [{ title: "Sample", template: DefaultKbsTemplate.SAMPLE }];

export default function AdminEntityTemplatesManual() {
  const actionData = useTypedActionData<ActionData>();
  const [configuration, setConfiguration] = useState<string>("");

  return (
    <EditPageLayout
      title="Upload a JSON configuration"
      withHome={false}
      menu={[
        { title: "Knowledge Bases", routePath: "/admin/knowledge-base/bases" },
        { title: "Import", routePath: `/admin/knowledge-base/bases/import` },
      ]}
    >
      <div className="md:border-t md:border-gray-200 md:py-2">
        {actionData?.error ? (
          <>
            <p id="form-error-message" className="py-2 text-sm text-rose-500" role="alert">
              {actionData.error}
            </p>
          </>
        ) : actionData?.success ? (
          <>
            <div id="form-success-message" className="text-text-500 py-2 text-sm space-y-1" role="alert">
              {actionData.success.map((f) => (
                <div key={f}>{f}</div>
              ))}
            </div>
            <Link to="/admin/knowledge-base/bases" className="text-sm font-medium text-theme-600 underline hover:text-theme-500">
              Back to knowledge bases
            </Link>
          </>
        ) : actionData?.previewTemplate === undefined ? (
          <>
            <Form method="post">
              <input type="hidden" name="action" value="preview" readOnly />
              <div className="space-y-3">
                <div className="flex space-x-2">
                  {defaultTemplates.map((t) => (
                    <button
                      key={t.title}
                      type="button"
                      onClick={() => setConfiguration(JSON.stringify(t.template, null, "\t"))}
                      className="inline-flex items-center rounded border border-transparent bg-theme-100 px-2.5 py-1.5 text-xs font-medium text-theme-700 hover:bg-theme-200 focus:outline-none focus:ring-2 focus:ring-theme-500 focus:ring-offset-2"
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
                <div>
                  <InputText
                    name="configuration"
                    title="Configuration"
                    editor="monaco"
                    editorLanguage="json"
                    value={configuration}
                    setValue={setConfiguration}
                    editorSize="lg"
                  />
                </div>
                <div className="flex justify-end">
                  <ButtonPrimary type="submit">Preview</ButtonPrimary>
                </div>
              </div>
            </Form>
          </>
        ) : (
          actionData?.previewTemplate !== undefined && (
            <>
              <Form method="post">
                <input type="hidden" name="action" value="create" readOnly />
                <input type="hidden" name="configuration" value={configuration} readOnly />
                <div className="space-y-2">
                  <PreviewKbsTemplate template={actionData.previewTemplate} />
                  <div className="flex justify-end space-x-2">
                    <ButtonPrimary type="submit">
                      <span>Import</span>
                    </ButtonPrimary>
                  </div>
                </div>
              </Form>
            </>
          )
        )}
      </div>
    </EditPageLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
