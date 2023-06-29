import { ActionArgs, V2_MetaFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useState } from "react";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import ActionResultModal, { ActionResultDto } from "~/components/ui/modals/ActionResultModal";
import { db } from "~/lib/db.server";
import KnowledgeBasePermissionsService from "~/modules/knowledgeBase/service/KnowledgeBasePermissionsService";

export const meta: V2_MetaFunction = () => [{ title: "Danger" }];

type ActionData = {
  error?: string;
  success?: string;
};
export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const action = form.get("action")?.toString();
  await KnowledgeBasePermissionsService.hasPermission({ action });
  if (action === "reset-all-data") {
    await db.knowledgeBaseCategory.deleteMany({});
    await db.knowledgeBaseArticle.deleteMany({});
    await db.knowledgeBase.deleteMany({});
    return json({ success: "Reset successful" });
  } else {
    return json({ error: "Invalid form" }, { status: 400 });
  }
};

export default function AdminSettingsDanger() {
  const actionData = useActionData<ActionData>();
  const [actionResult, setActionResult] = useState<ActionResultDto>();
  useEffect(() => {
    if (actionData?.error) {
      setActionResult({ error: { description: actionData.error } });
    } else if (actionData?.success) {
      setActionResult({ success: { description: actionData.success } });
    }
  }, [actionData]);
  return (
    <div className="flex-1 overflow-x-auto xl:overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8 lg:py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Danger</h1>

        <Form method="post" className="divide-y-gray-200 mt-6 space-y-8 divide-y">
          <input name="action" value="reset-all-data" hidden readOnly />
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
            <div className="sm:col-span-6">
              <h2 className="text-xl font-medium text-gray-900">Reset all data</h2>
              <p className="mt-1 text-sm text-gray-500">Delete all knowledge base data</p>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <ButtonPrimary destructive type="submit">
              Reset all data
            </ButtonPrimary>
          </div>
        </Form>
      </div>
      <ActionResultModal actionResult={actionResult} />
    </div>
  );
}
