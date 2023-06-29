import { Link } from "@remix-run/react";
import clsx from "clsx";
import type { KbCategoryDto } from "../../dtos/KbCategoryDto";

export default function KbCategoriesTopArticles({ items }: { items: KbCategoryDto[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        return (
          <div key={item.slug} className="space-y-4">
            <div className="flex justify-between space-x-2 items-baseline">
              <div className="space-x-4 flex items-center">
                {item.icon.startsWith("<svg") ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.icon.replace("<svg", `<svg class='${"h-6 w-6 text-gray-400 group-hover:text-gray-700"}'`) ?? "",
                    }}
                  />
                ) : item.icon.includes("http") ? (
                  <img className="h-6 w-6" src={item.icon} alt={item.title} />
                ) : null}
                <Link to={item.href} className="hover:underline">
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                </Link>
              </div>
              <Link to={item.href} className="text-sm text-gray-500 hover:underline">
                View all
              </Link>
            </div>
            <div className={clsx("grid gap-4 grid-cols-3")}>
              {item.articles.slice(0, 3).map((item) => {
                return (
                  <div key={item.title} className="rounded-md border border-gray-300 bg-white hover:border-slate-400 group">
                    <Link to={item.href} className="w-full">
                      <div className="flex items-center space-x-8 p-6">
                        <div className="flex flex-col w-full">
                          <div className="font-medium group-hover:text-gray-700">{item.title}</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
