import clsx from "clsx";
import { useState } from "react";
import InputText from "~/components/ui/input/InputText";
import { KnowledgeBaseArticleWithDetails } from "~/modules/knowledgeBase/db/kbArticles.db.server";
import NovelEditor from "~/modules/novel/ui/editor";
import useLocalStorage from "~/utils/hooks/use-local-storage";

export default function KbArticleForm({ item }: { item: KnowledgeBaseArticleWithDetails }) {
  const [content, setContent] = useLocalStorage(item.id, item.contentDraft);
  const [contentType, setContentType] = useState(item?.contentType ?? "wysiwyg");

  return (
    <div className="space-y-2">
      <div className="grid gap-3">
        <div className="space-y-2">
          <div className="flex justify-between space-x-2">
            {/* <label className="text-sm font-medium text-gray-600">Article</label> */}
            <div className="flex space-x-1 items-center">
              <button type="button" onClick={() => setContentType("wysiwyg")} className="text-xs hover:underline text-gray-600">
                <div className={clsx(contentType === "wysiwyg" ? "font-bold" : "")}>WYSIWYG</div>
              </button>
              <div>•</div>
              <button type="button" onClick={() => setContentType("markdown")} className="text-xs hover:underline text-gray-600">
                <div className={clsx(contentType === "markdown" ? "font-bold" : "")}>Markdown</div>
              </button>
            </div>
          </div>
          <input name="contentType" value={contentType} readOnly hidden />
          {contentType === "wysiwyg" ? (
            <div>
              <input type="hidden" name="content" value={content} readOnly hidden />
              <NovelEditor content={content} onChange={(e) => setContent(e.html ?? "")} />
              {/* <InputText autoFocus name="content" placeholder="Content" value={content} setValue={setContent} /> */}
            </div>
          ) : contentType === "markdown" ? (
            <InputText
              className="col-span-12"
              rows={6}
              editor="monaco"
              editorLanguage="markdown"
              editorTheme="vs-dark"
              editorSize="screen"
              editorFontSize={14}
              name="content"
              value={content}
              setValue={(e) => setContent(e.toString())}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
