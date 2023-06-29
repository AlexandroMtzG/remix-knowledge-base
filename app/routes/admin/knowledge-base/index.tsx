import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import {
  countAllKbsArticleDownvotes,
  countAllKbsArticleUpvotes,
  countAllKbsArticleViews,
  countAllKbsViews,
} from "~/modules/knowledgeBase/db/kbAnalytics.db.server";
import { countKnowledgeBaseArticles } from "~/modules/knowledgeBase/db/kbArticles.db.server";
import { countKnowledgeBaseCategories } from "~/modules/knowledgeBase/db/kbCategories.db.server";
import { countKnowledgeBases } from "~/modules/knowledgeBase/db/knowledgeBase.db.server";
import NumberUtils from "~/utils/shared/NumberUtils";

type LoaderData = {
  metatags: MetaTagsDto;
  summary: {
    kbsTotal: number;
    articlesTotal: number;
    categoriesTotal: number;
    kbsViews: number;
    articlesViews: number;
    articlesUpvotes: number;
    articlesDownvotes: number;
  };
};
export let loader = async () => {
  const data: LoaderData = {
    metatags: [{ title: `Knowledge Base` }],
    summary: {
      kbsTotal: await countKnowledgeBases(),
      articlesTotal: await countKnowledgeBaseArticles(),
      categoriesTotal: await countKnowledgeBaseCategories(),
      kbsViews: await countAllKbsViews(),
      articlesViews: await countAllKbsArticleViews(),
      articlesUpvotes: await countAllKbsArticleUpvotes(),
      articlesDownvotes: await countAllKbsArticleDownvotes(),
    },
  };
  return json(data);
};

export const meta: V2_MetaFunction = ({ data }) => data?.metatags;

export default function () {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="mx-auto mb-12 max-w-5xl space-y-5 px-4 py-4 sm:px-6 lg:px-8 xl:max-w-7xl">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Overview</h3>
      </div>
      <dl className="grid gap-2 sm:grid-cols-3">
        <SummaryCard title="Knowledge Bases" value={data.summary.kbsTotal} />
        <SummaryCard title="Articles" value={data.summary.articlesTotal} />
        <SummaryCard title="Categories" value={data.summary.categoriesTotal} />
        <SummaryCard title="Articles Views" value={data.summary.articlesViews} />
        <SummaryCard title="Articles Upvotes" value={data.summary.articlesUpvotes} />
        <SummaryCard title="Articles Downvotes" value={data.summary.articlesDownvotes} />
      </dl>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-3 shadow ">
      <dt className="truncate text-xs font-medium uppercase text-gray-500">
        <div>{title}</div>
      </dt>
      <dd className="mt-1 truncate text-2xl font-semibold text-gray-900">{NumberUtils.intFormat(value)}</dd>
    </div>
  );
}
