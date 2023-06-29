import { Link, useNavigate, useParams, useSearchParams } from "@remix-run/react";
import XIcon from "~/components/icons/XIcon";
import { Fragment, useEffect, useState } from "react";
import type { KnowledgeBaseDto } from "../dtos/KnowledgeBaseDto";
import clsx from "clsx";
import ColorBackgroundUtils from "~/utils/shared/colors/ColorBackgroundUtils";
import ColorTextUtils from "~/utils/shared/colors/ColorTextUtils";
import ColorPlaceholderUtils from "~/utils/shared/colors/ColorPlaceholderUtils";
import ColorFocusUtils from "~/utils/shared/colors/ColorFocusUtils";
import ColorRingUtils from "~/utils/shared/colors/ColorRingUtils";
import ColorGradientUtils from "~/utils/shared/colors/ColorGradientUtils";
import LogoLight from "~/assets/img/logo-light.png";
import LogoDark from "~/assets/img/logo-dark.png";
import ColorFocusWithinUtils from "~/utils/shared/colors/ColorFocusWithinUtils";
import KnowledgeBaseUtils from "../utils/KnowledgeBaseUtils";
import WarningBanner from "~/components/WarningBanner";

interface Props {
  kb: KnowledgeBaseDto;
  // currentVersion: string | undefined;
  withTitleAndDescription: boolean;
}
export default function KbHeader({ kb, withTitleAndDescription }: Props) {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q")?.toString() ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("q")?.toString() ?? "");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const query = searchParams.get("q") ?? "";
    if (query !== debouncedSearch) {
      if (debouncedSearch === "") {
        searchParams.delete("q");
      } else {
        searchParams.set("q", debouncedSearch);
      }
      setSearchParams(searchParams);
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  return (
    <div>
      <div className={clsx("bg-gradient-to-r py-6 text-white", ColorGradientUtils.getFrom700To800(kb.color))}>
        <div className="mx-auto max-w-5xl px-8 py-6 space-y-8">
          <div className="flex items-center justify-between space-x-2 h-12">
            <Link to={`/${kb.slug}`} className="flex select-none items-center space-x-2">
              {kb.logo === "light" ? (
                <img className="h-8 w-auto" src={LogoLight} alt="Logo" />
              ) : kb.logo === "dark" ? (
                <img className="h-8 w-auto" src={LogoDark} alt="Logo" />
              ) : (
                <img className="h-8 w-auto" src={kb.logo} alt="Logo" />
              )}
              {!withTitleAndDescription && (
                <Fragment>
                  <span className={clsx("px-2", ColorTextUtils.getText300(kb.color))}>|</span>
                  <span className="font-semibold">{kb.title}</span>
                </Fragment>
              )}
            </Link>
            <div className="flex items-center space-x-4">
              {kb.links.map((link) => {
                return (
                  <a key={link.href} href={link.href} className={clsx("hover:text-white transition-colors duration-150", ColorTextUtils.getText300(kb.color))}>
                    {link.name}
                  </a>
                );
              })}
              <div className="flex space-x-2 items-center">
                {/* <select
                id="version"
                name="version"
                defaultValue={currentVersion}
                className="bg-theme-700 focus:ring-theme-600 text-white ring-1 ring-inset ring-theme-800 focus:ring-2 sm:text-sm sm:leading-6 w-auto block rounded-md border-0 py-1.5 pl-3 pr-10"
                onChange={(e) => {
                  if (params.article) {
                    navigate(`/${kb.slug}/${currentLanguage}/${e.target.value}/articles/${params.article}?${searchParams.toString()}`);
                  } else {
                    navigate(`/${kb.slug}/${currentLanguage}/${e.target.value}?${searchParams.toString()}`);
                  }
                }}
              >
                {versions.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </select> */}
                {kb.languages.length > 1 && (
                  <select
                    id="lang"
                    name="lang"
                    defaultValue={params.lang || kb.defaultLanguage}
                    className={clsx(
                      "text-white ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 w-full block rounded-md border-0 py-1.5 pl-3 pr-10",
                      ColorBackgroundUtils.getBg700(kb.color),
                      ColorRingUtils.getRing800(kb.color),
                      ColorFocusUtils.getRing600(kb.color)
                    )}
                    onChange={(e) => {
                      if (params.article) {
                        navigate(`/${kb.slug}/${e.target.value}/articles/${params.article}?${searchParams.toString()}`);
                      } else if (params.category) {
                        navigate(`/${kb.slug}/${e.target.value}/categories/${params.category}?${searchParams.toString()}`);
                      } else {
                        navigate(`/${kb.slug}/${e.target.value}?${searchParams.toString()}`);
                      }
                    }}
                  >
                    {kb.languages.map((lang) => {
                      const language = KnowledgeBaseUtils.supportedLanguages.find((f) => f.value === lang);
                      if (!language) return null;
                      return (
                        <option key={lang} value={lang}>
                          {language.name}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            </div>
          </div>
          {withTitleAndDescription && (
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{kb.title}</h1>
              <p className={clsx("text-base", ColorTextUtils.getText300(kb.color))}>{kb.description}</p>
            </div>
          )}
          <div className="w-full space-y-2">
            <div className={clsx("relative", ColorTextUtils.getText400(kb.color), ColorFocusWithinUtils.getText600(kb.color))}>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" height="48" width="48">
                  <g id="magnifying-glass--glass-search-magnifying">
                    <path
                      id="Vector"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 11.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
                    ></path>
                    <path id="Vector_2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 13.5 10 10"></path>
                  </g>
                </svg>
              </div>
              <input
                autoFocus={withTitleAndDescription}
                autoComplete="off"
                className={clsx(
                  " transition-all focus:bg-white focus:ring-2 focus:ring-inset block w-full rounded-md border-0 px-6 py-5 pl-12 ring-1 ring-inset outline-none",
                  ColorBackgroundUtils.getBg800(kb.color),
                  ColorTextUtils.getText300(kb.color),
                  ColorPlaceholderUtils.getText400(kb.color),
                  ColorFocusUtils.getText600(kb.color),
                  ColorFocusUtils.getPlaceholder600(kb.color),
                  ColorFocusUtils.getRing600(kb.color),
                  ColorRingUtils.getRing800(kb.color)
                )}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="absolute inset-y-0 right-0 flex items-center pr-4" onClick={() => setSearch("")} aria-label="Clear search">
                  <XIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {searchParams.get("q") && (
        <div className="mx-auto max-w-5xl px-8 py-6 space-y-8">
          <WarningBanner title="TODO">TODO: Search results for {searchParams.get("q")}</WarningBanner>
        </div>
      )}
    </div>
  );
}
