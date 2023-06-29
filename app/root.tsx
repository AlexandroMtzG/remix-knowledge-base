import type { LinksFunction, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
import stylesheet from "~/tailwind.css";
import { loadRootData, useRootData } from "./utils/data/root-data";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];
export const meta: V2_MetaFunction = ({ data }) => data?.metatags;

export let loader = async ({ request }: LoaderArgs) => {
  return loadRootData({ request });
};

export default function App() {
  const rootData = useRootData();
  const data = useTypedLoaderData<{ debug: boolean }>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-800">
        {!data.debug && (
          <>
            <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
            <noscript>
              <img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="privacy-friendly-simpleanalytics" referrerPolicy="no-referrer-when-downgrade" />
            </noscript>
          </>
        )}

        {rootData.chatWebsiteId && (
          <div
            dangerouslySetInnerHTML={{
              __html: `<script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="${rootData.chatWebsiteId}";(function(){d = document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>`,
            }}
          ></div>
        )}

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
