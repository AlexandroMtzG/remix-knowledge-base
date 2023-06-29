import { ActionArgs, json } from "@remix-run/node";
import { createClient } from "@supabase/supabase-js";
import SupabaseService from "~/modules/supabase/SupabaseService";

export const action = async ({ request, params }: ActionArgs) => {
  const requiredEnvVars = ["SUPABASE_API_URL", "SUPABASE_KEY", "SUPABASE_ANON_PUBLIC_KEY"];
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  if (missingEnvVars.length) {
    return json("Missing env vars: " + missingEnvVars.join(", "), {
      status: 401,
    });
  }
  try {
    const file = request.body || "";
    const filename = request.headers.get("x-filename") || "file.txt";
    const contentType = request.headers.get("content-type") || "text/plain";
    const fileType = `.${contentType.split("/")[1]}`;

    const finalName = filename.includes(fileType) ? filename : `${filename}${fileType}`;

    const now = new Date().getTime();
    const path = `${now}-${finalName}`;

    const response = await SupabaseService.createSupabaseFile("saasrock-knowledge-bucket", path, file, contentType);

    return json({ success: true, url: response.publicUrl });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("Error uploading file", error.message);
    return new Response(error.message, { status: 500 });
  }
};
