import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import type { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import ServerError from "~/components/ui/errors/ServerError";
import SidebarIconsLayout from "~/components/ui/layouts/SidebarIconsLayout";

type LoaderData = {
  metatags: MetaTagsDto;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const data: LoaderData = {
    metatags: [{ title: `Knowledge Base` }],
  };
  return json(data);
};

export default () => {
  return (
    <SidebarIconsLayout
      label={{ align: "right" }}
      items={[
        {
          name: "Overview",
          href: "/admin/knowledge-base",
          exact: true,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50" fill="currentColor">
              <path d="M 39 0 L 39 2 L 46.5625 2 L 34 14.5625 L 30.71875 11.28125 L 30 10.59375 L 29.28125 11.28125 L 18 22.5625 L 14.71875 19.28125 L 14 18.59375 L 13.28125 19.28125 L 0.28125 32.28125 L 1.71875 33.71875 L 14 21.4375 L 17.28125 24.71875 L 18 25.40625 L 18.71875 24.71875 L 30 13.4375 L 33.28125 16.71875 L 34 17.40625 L 34.71875 16.71875 L 48 3.4375 L 48 11 L 50 11 L 50 0 Z M 42 14 L 42 50 L 44 50 L 44 14 Z M 48 15 L 48 50 L 50 50 L 50 15 Z M 30 20 L 30 50 L 32 50 L 32 20 Z M 36 20 L 36 50 L 38 50 L 38 20 Z M 24 24 L 24 50 L 26 50 L 26 24 Z M 12 28 L 12 50 L 14 50 L 14 28 Z M 18 30 L 18 50 L 20 50 L 20 30 Z M 6 34 L 6 50 L 8 50 L 8 34 Z M 0 38 L 0 50 L 2 50 L 2 38 Z"></path>
            </svg>
          ),
          iconSelected: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50" fill="currentColor">
              <path d="M 38 0 L 38 4 L 43.1875 4 L 34 13.1875 L 31.40625 10.59375 L 30 9.15625 L 28.59375 10.59375 L 18 21.1875 L 15.40625 18.59375 L 14 17.15625 L 12.59375 18.59375 L 0.59375 30.59375 L 3.40625 33.40625 L 14 22.8125 L 16.59375 25.40625 L 18 26.84375 L 19.40625 25.40625 L 30 14.8125 L 32.59375 17.40625 L 34 18.84375 L 35.40625 17.40625 L 46 6.8125 L 46 12 L 50 12 L 50 0 Z M 44 15 L 44 50 L 48 50 L 48 15 Z M 30 20 L 30 50 L 34 50 L 34 20 Z M 37 20 L 37 50 L 41 50 L 41 20 Z M 23 24 L 23 50 L 27 50 L 27 24 Z M 16 30 L 16 50 L 20 50 L 20 30 Z M 9 31 L 9 50 L 13 50 L 13 31 Z M 2 38 L 2 50 L 6 50 L 6 38 Z"></path>
            </svg>
          ),
        },
        {
          name: "Bases",
          href: "/admin/knowledge-base/bases",
          icon: (
            <svg className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
              <path d="M 13 2 C 10.800781 2 9 3.800781 9 6 L 9 44.3125 L 9.03125 44.3125 C 9.195313 46.363281 10.910156 48 13 48 L 42 48 L 42 46 L 13 46 C 11.882813 46 11 45.117188 11 44 C 11 42.882813 11.882813 42 13 42 L 42 42 L 42 40 L 13 40 C 11.882813 40 11 39.117188 11 38 C 11 36.882813 11.882813 36 13 36 L 42 36 L 42 2 Z M 13 4 L 40 4 L 40 34 L 13 34 C 12.257813 34 11.597656 34.261719 11 34.621094 L 11 6 C 11 4.882813 11.882813 4 13 4 Z M 16 7 C 14.90625 7 14 7.90625 14 9 L 14 12 C 14 13.09375 14.90625 14 16 14 L 35 14 C 36.09375 14 37 13.09375 37 12 L 37 9 C 37 7.90625 36.09375 7 35 7 Z M 16 9 L 35 9 L 35 12 L 16 12 Z"></path>
            </svg>
          ),
          iconSelected: (
            <svg className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
              <path d="M 13 2 C 10.792969 2 9 3.792969 9 6 L 9 44.3125 L 9.03125 44.3125 C 9.195313 46.363281 10.910156 48 13 48 L 42 48 L 42 46 L 13 46 C 11.882813 46 11 45.117188 11 44 C 11 42.882813 11.882813 42 13 42 L 42 42 L 42 40 L 13 40 C 11.898438 40 11 39.101563 11 38 C 11 36.898438 11.898438 36 13 36 L 42 36 L 42 2 Z M 16 8 L 35 8 C 35.550781 8 36 8.449219 36 9 L 36 12 C 36 12.550781 35.550781 13 35 13 L 16 13 C 15.449219 13 15 12.550781 15 12 L 15 9 C 15 8.449219 15.449219 8 16 8 Z"></path>
            </svg>
          ),
        },
        {
          name: "Danger",
          href: "/admin/knowledge-base/danger",
          bottom: true,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          ),
          iconSelected: (
            <svg className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
          ),
        },
      ]}
    >
      <Outlet />
    </SidebarIconsLayout>
  );
};

export function ErrorBoundary() {
  return <ServerError />;
}
