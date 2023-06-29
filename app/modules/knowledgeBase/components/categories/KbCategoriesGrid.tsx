import { Link } from "@remix-run/react";
import clsx from "clsx";
import type { KbCategoryDto } from "~/modules/knowledgeBase/dtos/KbCategoryDto";

export default function KbCategoriesGrid({ items, columns }: { items: KbCategoryDto[]; columns: number }) {
  return (
    <div
      className={clsx(
        "grid gap-4 grid-cols-1",
        columns === 2 && "md:grid-cols-2",
        columns === 3 && "md:grid-cols-3",
        columns === 4 && "md:grid-cols-4",
        columns === 5 && "md:grid-cols-5",
        columns === 6 && "md:grid-cols-6"
      )}
    >
      {items.map((item) => {
        return (
          <div key={item.title} className="rounded-md border border-gray-300 bg-white hover:border-slate-400 group">
            <Link to={item.href} className="w-full">
              <div className="p-6 flex flex-col space-y-3">
                <div className="flex-shrink-0">
                  {item.icon.startsWith("<svg") ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.icon.replace("<svg", `<svg class='${"h-8 w-8 text-gray-400 group-hover:text-gray-700"}'`) ?? "",
                      }}
                    />
                  ) : item.icon.includes("http") ? (
                    <img className="h-8 w-8" src={item.icon} alt={item.title} />
                  ) : (
                    <></>
                  )}
                </div>
                <div className="flex items-center space-x-8">
                  <div className="flex flex-col w-full">
                    <div className="font-bold group-hover:text-gray-700">{item.title}</div>
                    <div className="mt-1 text-sm text-gray-700">{item.description}</div>
                    <div className="mt-6 flex items-center space-x-2 justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm">
                          {item.articles.length} <span>{item.articles.length === 1 ? "article" : "articles"}</span>
                        </div>
                      </div>
                      {/* <div className="text-sm text-gray-400">{item.version}</div> */}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
