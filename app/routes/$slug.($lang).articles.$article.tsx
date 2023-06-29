import ServerError from "~/components/ServerError";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { defer, json, redirect } from "@remix-run/node";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService";
import { useTypedLoaderData } from "remix-typedjson";
import KbHeader from "~/modules/knowledgeBase/components/KbHeader";
import type { KbArticleDto } from "~/modules/knowledgeBase/dtos/KbArticleDto";
import type { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import KbArticle from "~/modules/knowledgeBase/components/articles/KbArticle";
import type { KbCategoryDto } from "~/modules/knowledgeBase/dtos/KbCategoryDto";
import type { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { useSubmit } from "@remix-run/react";
import { createKnowledgeBaseArticleView, getArticleStateByUserAnalyticsId, voteArticle } from "~/modules/knowledgeBase/db/kbAnalytics.db.server";
import { getUserInfo } from "~/utils/session/session.server";
import KnowledgeBaseUtils from "~/modules/knowledgeBase/utils/KnowledgeBaseUtils";

type LoaderData = {
  metatags?: MetaTagsDto;
  kb: KnowledgeBaseDto;
  item: {
    article: KbArticleDto;
    category: KbCategoryDto;
  } | null;
  userState: {
    hasThumbsUp: boolean;
    hasThumbsDown: boolean;
  };
};
export let loader = async ({ request, params }: LoaderArgs) => {
  const userInfo = await getUserInfo(request);
  const kb = await KnowledgeBaseService.get({ slug: params.slug!, enabled: true });
  const item = await KnowledgeBaseService.getArticle({
    kb,
    slug: params.article ?? "",
    params,
  });
  if (!item) {
    return redirect(KnowledgeBaseUtils.getKbUrl({ kb, params }));
  }

  if (item?.article) {
    await createKnowledgeBaseArticleView({ userAnalyticsId: userInfo.userAnalyticsId, articleId: item.article.id });
  }
  let userState = await getArticleStateByUserAnalyticsId({
    userAnalyticsId: userInfo.userAnalyticsId,
    articleId: item?.article.id ?? "",
  });
  const data: LoaderData = {
    metatags: item?.article.metatags,
    kb,
    item,
    userState,
  };
  return defer(data);
};

export const action = async ({ request, params }: LoaderArgs) => {
  const userInfo = await getUserInfo(request);
  const form = await request.formData();
  const action = form.get("action") as string;
  const kb = await KnowledgeBaseService.get({ slug: params.slug!, enabled: true });
  const item = await KnowledgeBaseService.getArticle({
    kb,
    slug: params.article ?? "",
    params,
  });
  if (!item) {
    return json({ error: "Not found" }, { status: 404 });
  }
  if (action === "thumbsUp") {
    await voteArticle({ userAnalyticsId: userInfo.userAnalyticsId, articleId: item.article.id, type: "up" });
    return json({ success: true });
  } else if (action === "thumbsDown") {
    await voteArticle({ userAnalyticsId: userInfo.userAnalyticsId, articleId: item.article.id, type: "down" });
    return json({ success: true });
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;

export default function Index() {
  const data = useTypedLoaderData<LoaderData>();
  const submit = useSubmit();

  function onAction(name: string) {
    const form = new FormData();
    form.set("action", name);
    submit(form, {
      method: "post",
    });
  }
  return (
    <div className="min-h-screen">
      <KbHeader kb={data.kb} withTitleAndDescription={false} />

      <div className="max-w-5xl mx-auto py-8 px-8">
        <div className="space-y-3">
          {!data.item ? (
            <div>Not found</div>
          ) : (
            <KbArticle
              kb={data.kb}
              category={data.item.category}
              item={data.item.article}
              userState={{
                hasThumbsUp: data.userState.hasThumbsUp,
                hasThumbsDown: data.userState.hasThumbsDown,
              }}
              actions={{
                onThumbsUp: () => onAction("thumbsUp"),
                onThumbsDown: () => onAction("thumbsDown"),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
