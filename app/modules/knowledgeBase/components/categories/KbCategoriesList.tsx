import { Link } from "@remix-run/react";
import clsx from "clsx";

import type { KbCategoryDto } from "~/modules/knowledgeBase/dtos/KbCategoryDto";

export default function KbCategoriesList({ items }: { items: KbCategoryDto[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Categories</h2>
      <div className={clsx("grid gap-4 grid-cols-1")}>
        {items.map((item) => {
          return (
            <div key={item.title} className="rounded-md border border-gray-300 bg-white hover:border-slate-400 group">
              <Link to={item.href} className="w-full">
                <div className="flex items-center space-x-8 p-6">
                  <div className="flex-shrink-0">
                    {item.icon.startsWith("<svg") ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.icon.replace("<svg", `<svg class='${"h-12 w-12 text-gray-400 group-hover:text-gray-700"}'`) ?? "",
                        }}
                      />
                    ) : item.icon.includes("http") ? (
                      <img className="h-12 w-12" src={item.icon} alt={item.title} />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="font-bold group-hover:text-gray-700">{item.title}</div>
                    <div className="mt-1 text-sm text-gray-700">{item.description}</div>
                    <div className="mt-6 flex items-center space-x-2 justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm">
                          {item.articles.length} <span>{item.articles.length === 1 ? "article" : "articles"}</span>
                        </div>
                        {/* <div className="text-sm text-gray-300">|</div>
                        <div className="text-sm">Written by 10 authors</div> */}
                      </div>
                      {/* <div className="text-sm text-gray-400">{item.version}</div> */}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
