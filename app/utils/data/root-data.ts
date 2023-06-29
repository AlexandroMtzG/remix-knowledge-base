import { useMatches } from "@remix-run/react";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { UserSession, createUserSession, generateAnalyticsUserId, getUserInfo, getUserSession } from "../session/session.server";
import { json } from "@remix-run/node";

export type AppRootData = {
  metatags: MetaTagsDto;
  userSession: UserSession;
  debug: boolean;
};

export function useRootData(): AppRootData {
  return (useMatches().find((f) => f.pathname === "/" || f.pathname === "")?.data ?? {}) as AppRootData;
}

export async function loadRootData({ request }: { request: Request }) {
  const userSession = await getUserSession(request);
  const userInfo = await getUserInfo(request);

  const headers = new Headers();
  if (!userSession.get("userAnalyticsId")) {
    return createUserSession(
      {
        userAnalyticsId: generateAnalyticsUserId(),
      },
      new URL(request.url).pathname
    );
  }

  const metatags = {
    title: "SaasRock KB",
    description: "Knowledge Base starter kit with WYSIWYG, Markdown, GPT, and Multi-language support",
    seoImage: "https://yahooder.sirv.com/saasrock-kb/cover.png",
  };

  const data: AppRootData = {
    metatags: [
      { charset: "utf-8" },
      { title: metatags.title },
      { viewport: "width=device-width,initial-scale=1" },
      { name: "description", content: "Intercom-like knowledge base with WYSIWYG and Markdown support" },
      // { name: "keywords", content: kb.keywords },
      { name: "og:title", content: metatags.title },
      { name: "og:description", content: metatags.description },
      { name: "og:image", content: metatags.seoImage },
      { name: "og:url", content: request.url },
      { name: "twitter:title", content: metatags.title },
      { name: "twitter:description", content: metatags.description },
      { name: "twitter:image", content: metatags.seoImage },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    userSession: userInfo,
    debug: process.env.NODE_ENV === "development",
  };

  return json(data, { headers });
}
