import { Link } from "@remix-run/react";
import RightIcon from "~/components/icons/RightIcon";
import clsx from "clsx";
import ColorHoverUtils from "~/utils/shared/colors/ColorHoverUtils";
import type { KnowledgeBaseDto } from "../../dtos/KnowledgeBaseDto";

export default function KbArticles({
  kb,
  items,
}: {
  kb: KnowledgeBaseDto;
  items: {
    order: number;
    title: string;
    description: string;
    href: string;
    sectionId: string | null;
  }[];
}) {
  return (
    <div className="bg-white border border-gray-300 rounded-md py-3">
      {items.map((item) => {
        return (
          <div key={item.title} className={clsx("group", ColorHoverUtils.getBorder500(kb.color))}>
            <Link to={item.href}>
              <div className="flex justify-between space-x-2 px-6 py-3 hover:bg-gray-50 items-center">
                <div className="">
                  <div className={clsx("text-gray-600 group-hover:text-gray-900")}>{item.title}</div>
                </div>
                <RightIcon className={clsx("h-5 w-5 text-gray-300 flex-shrink-0 group-hover:text-gray-600")} />
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
