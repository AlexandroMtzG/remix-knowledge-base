import { Link } from "@remix-run/react";
import type { KbArticleDto } from "../dtos/KbArticleDto";
import ColorTextUtils from "~/utils/shared/colors/ColorTextUtils";
import type { Colors } from "~/application/enums/shared/Colors";
import clsx from "clsx";
import type { KnowledgeBaseDto } from "../dtos/KnowledgeBaseDto";
import EmptyState from "~/components/ui/emptyState/EmptyState";

export default function KbFeaturedArticles({ kb, items }: { kb: KnowledgeBaseDto; items: KbArticleDto[] }) {
  return (
    <div className="space-y-4">
      <div className="space-x-4 flex items-center">
        <FeaturedArticlesIcon color={kb.color} />
        <h2 className="text-2xl font-bold">Featured Articles</h2>
      </div>
      {items.length === 0 && <EmptyState className="bg-white" captions={{ thereAreNo: "No featured articles" }} />}
      <div className="grid gap-2 grid-cols-2">
        {items.map((item) => {
          return (
            <Link
              to={item.href}
              key={item.id}
              className="px-3 py-4 bg-white border border-gray-200 shadow-sm rounded-md hover:bg-slate-50 hover:border-slate-400"
            >
              <div className="flex justify-between space-x-2 items-center">
                <div className="font-medium text-gray-700 flex-grow">{item.title}</div>
                <div className="flex-shrink-0">
                  {/* <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg> */}
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FeaturedArticlesIcon({ color }: { color: Colors }) {
  return (
    <svg
      className={clsx("h-5 w-5", ColorTextUtils.getText500(color))}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      height="48"
      width="48"
    >
      <g id="star-1--reward-rating-rate-social-star-media-favorite-like-stars">
        <path
          id="Union"
          fill="currentColor"
          fillRule="evenodd"
          d="M7 .277a1.04 1.04 0 0 0-.94.596L4.472 4.078a.495.495 0 0 0-.012.023.486.486 0 0 0-.023.004L.94 4.623a1.04 1.04 0 0 0-.617 1.788l2.56 2.469.006.005a.03.03 0 0 1 .009.027v.004l-.61 3.568v.001a1.05 1.05 0 0 0 1.526 1.107l3.15-1.665a.09.09 0 0 1 .072 0l3.15 1.664a1.049 1.049 0 0 0 1.527-1.106l-.61-3.57v-.003c-.002-.004-.001-.01 0-.014a.03.03 0 0 1 .008-.013l.006-.005 2.559-2.47a1.04 1.04 0 0 0-.617-1.787l-3.496-.518a.486.486 0 0 0-.023-.004.495.495 0 0 0-.012-.023L7.94.873A1.04 1.04 0 0 0 7 .277Z"
          clipRule="evenodd"
        ></path>
      </g>
    </svg>
  );
}

// function CategoriesIcon() {
//   return (
//     <svg className="h-7 w-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
//       <path d="M 10.5 5 C 8.019 5 6 7.019 6 9.5 L 6 31.5 C 6 33.981 8.019 36 10.5 36 L 16 36 L 16 33 L 10.5 33 C 9.673 33 9 32.327 9 31.5 L 9 31 L 16 31 L 16 16.5 C 16 16.331 16.013391 16.166 16.025391 16 L 13.5 16 C 12.671 16 12 15.329 12 14.5 C 12 13.671 12.671 13 13.5 13 L 17.03125 13 C 18.18825 11.199 20.205 10 22.5 10 L 30 10 L 30 9.5 C 30 7.019 27.981 5 25.5 5 L 10.5 5 z M 22.5 12 C 20.019 12 18 14.019 18 16.5 L 18 38.5 C 18 40.981 20.019 43 22.5 43 L 40.5 43 C 41.329 43 42 42.329 42 41.5 C 42 40.671 41.329 40 40.5 40 L 22.5 40 C 21.673 40 21 39.327 21 38.5 L 21 38 L 40.5 38 C 41.329 38 42 37.329 42 36.5 L 42 16.5 C 42 14.019 39.981 12 37.5 12 L 22.5 12 z M 25.5 20 L 34.5 20 C 35.329 20 36 20.671 36 21.5 C 36 22.329 35.329 23 34.5 23 L 25.5 23 C 24.671 23 24 22.329 24 21.5 C 24 20.671 24.671 20 25.5 20 z"></path>
//     </svg>
//   );
// }
