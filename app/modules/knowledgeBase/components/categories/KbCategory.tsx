import type { KnowledgeBaseDto } from "../../dtos/KnowledgeBaseDto";
import type { KbCategoryDto } from "../../dtos/KbCategoryDto";
import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";
import clsx from "clsx";
import { Link, useParams } from "@remix-run/react";
import KbArticlesBySection from "../articles/KbArticlesBySection";
import KnowledgeBaseUtils from "../../utils/KnowledgeBaseUtils";

export default function KbCategory({ kb, item, allCategories }: { kb: KnowledgeBaseDto; item: KbCategoryDto; allCategories: KbCategoryDto[] }) {
  const params = useParams();
  return (
    <div className="space-y-6">
      <BreadcrumbSimple
        menu={[
          {
            title: kb.title,
            routePath: KnowledgeBaseUtils.getKbUrl({ kb, params }),
          },
          {
            title: item.title ?? "",
            routePath: item.href,
          },
        ]}
      />

      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-8">
          <div className="flex flex-col w-full">
            <div className="flex space-x-3 items-center">
              {item.icon && (
                <div className="flex-shrink-0">
                  {item.icon.startsWith("<svg") ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.icon.replace("<svg", `<svg class='${"h-7 w-7 text-gray-400 group-hover:text-gray-700"}'`) ?? "",
                      }}
                    />
                  ) : item.icon.includes("http") ? (
                    <img className="h-7 w-7" src={item.icon} alt={item.title} />
                  ) : (
                    <></>
                  )}
                </div>
              )}
              <div className="text-xl md:text-2xl font-bold group-hover:text-gray-700">{item.title}</div>
            </div>
            <div className="mt-2 text-gray-700 font-normal">{item.description}</div>
            {/* <div className="mt-6 flex items-center space-x-2 justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-sm">
                  {item.articles.length} <span>{item.articles.length === 1 ? "article" : "articles"}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">{item.version}</div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200"></div>

      <div className="grid grid-cols-12 gap-8">
        <div className="hidden md:block col-span-3 space-y-3">
          <div className="font-bold text text-gray-800">Categories</div>
          <div className="space-y-1">
            {allCategories.map((category) => {
              return (
                <Link to={category.href} key={category.title}>
                  <div
                    className={clsx(
                      "rounded-md border border-transparent group p-2",
                      category.slug === item.slug ? "bg-slate-200 font-bold" : "hover:bg-slate-100"
                    )}
                  >
                    <div className="text-sm">{category.title}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="col-span-12 md:col-span-9 pt-2">
          <KbArticlesBySection kb={kb} item={item} />
        </div>
      </div>
    </div>
  );
}
