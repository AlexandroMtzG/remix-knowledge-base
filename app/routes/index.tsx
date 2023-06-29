import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { useTypedLoaderData } from "remix-typedjson";
import Header from "~/components/Header";
import ServerError from "~/components/ServerError";
import type { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService";

type LoaderData = {
  knowledgeBases: KnowledgeBaseDto[];
};
export let loader = async () => {
  const data: LoaderData = {
    knowledgeBases: await KnowledgeBaseService.getAll({ enabled: true }),
  };
  return json(data);
};

export default function Index() {
  const data = useTypedLoaderData<LoaderData>();

  return (
    <div>
      <Header />
      <div className="relative mx-auto flex flex-col items-center justify-center space-y-8 py-6 px-8 max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">SaasRock KB</h1>
        <p className="text-center text-2xl text-gray-800">Organize your knowledge bases with categories and articles</p>
        <div className="mt-10 flex items-center justify-center gap-x-6 w-full max-w-md">
          {data.knowledgeBases.length === 0 ? (
            <div>No knowledge bases found</div>
          ) : (
            <div className="space-y-6 flex flex-col w-full">
              {data.knowledgeBases.map((kb, idx) => {
                return (
                  <Link
                    key={kb.slug}
                    to={`/${kb?.slug}`}
                    className="text-lg relative block rounded-lg border-2 border-dashed border-gray-300 px-12 py-6 text-center hover:border-gray-400 focus:outline-none focus:border-solid"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex-grow">
                        {kb.title} <span className="text-gray-500 text-sm">(demo #{idx + 1})</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
