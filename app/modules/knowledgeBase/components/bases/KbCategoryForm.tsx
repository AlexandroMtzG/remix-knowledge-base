import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import InputText, { RefInputText } from "~/components/ui/input/InputText";
import UrlUtils from "~/utils/app/UrlUtils";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import EntityIcon from "~/components/layouts/icons/EntityIcon";
import { KnowledgeBaseCategoryWithDetails } from "../../helpers/KbCategoryModelHelper";
import KbSortArticles from "../articles/KbSortArticles";

export default function KbCategoryForm({
  knowledgeBase,
  language,
  item,
  onDelete,
}: {
  knowledgeBase: KnowledgeBaseDto;
  language: string;
  item?: KnowledgeBaseCategoryWithDetails;
  onDelete?: () => void;
}) {
  const navigation = useNavigation();
  const navigate = useNavigate();

  // const [showFilterModal, setShowFilterModal] = useState<{ item?: { type: FeatureFlagsFilterType; value: string | null }; idx?: number }>();

  const mainInput = useRef<RefInputText>(null);
  useEffect(() => {
    setTimeout(() => {
      mainInput.current?.input.current?.focus();
    }, 100);
  }, []);

  const [slug, setSlug] = useState(item?.slug || "");
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [icon, setIcon] = useState(
    item?.icon || ""
    // `<svg stroke="currentColor" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5">   <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /> </svg>`
  );
  // const [language, setLanguage] = useState(item?.language || "");
  const [seoImage, setSeoImage] = useState(item?.seoImage || "");

  useEffect(() => {
    if (!item) {
      setSlug(UrlUtils.slugify(title.toLowerCase()));
    }
  }, [item, title]);

  return (
    <div>
      <Form method="post" className="inline-block w-full overflow-hidden p-1 text-left align-bottom sm:align-middle">
        <input type="hidden" name="action" value={item ? "edit" : "new"} />
        <div className="space-y-2">
          <InputText ref={mainInput} autoFocus name="title" title={"Title"} value={title} setValue={setTitle} required />
          <InputText name="slug" title={"Slug"} value={slug} setValue={setSlug} required />
          <InputText name="description" title={"Description"} value={description} setValue={setDescription} />
          {/* <InputSelect
              name="language"
              title={"Language"}
              value={language}
              setValue={(e) => setLanguage((e?.toString() as any) || "")}
              options={KnowledgeBaseUtils.supportedLanguages.map((item) => {
                return {
                  value: item.value,
                  name: item.name,
                };
              })}
            /> */}

          <InputText
            name="icon"
            title={"Icon"}
            value={icon}
            setValue={(e) => setIcon(e.toString() ?? "")}
            hint={"svg or url"}
            button={
              <div className="absolute inset-y-0 right-0 flex py-0.5 pr-0.5 ">
                <kbd className="inline-flex w-10 items-center justify-center rounded border border-gray-300 bg-gray-50 px-1 text-center font-sans text-xs font-medium text-gray-500">
                  {icon ? <EntityIcon className="h-7 w-7 text-gray-600" icon={icon} title={title} /> : <span className="text-red-600">?</span>}
                </kbd>
              </div>
            }
          />
          <InputText name="seoImage" title={"SEO Image"} value={seoImage} setValue={setSeoImage} hint={"url"} />
          {seoImage && (
            <div className="col-span-12">
              <img className="overflow-hidden rounded-lg shadow-xl xl:border-b xl:border-gray-200" src={seoImage} alt={title} />
            </div>
          )}

          {item && <KbSortArticles items={item.articles.filter((f) => !f.sectionId).sort((a, b) => a.order - b.order)} />}
        </div>
        <div className="mt-5 flex justify-between space-x-2 sm:mt-6">
          <div>
            {onDelete && (
              <ButtonSecondary disabled={navigation.state === "submitting"} type="button" className="w-full" onClick={onDelete} destructive>
                <div>{"Delete"}</div>
              </ButtonSecondary>
            )}
          </div>
          <div className="flex space-x-2">
            <ButtonSecondary onClick={() => navigate(`/admin/knowledge-base/bases/${knowledgeBase.slug}/categories/${language}`)}>{"Cancel"}</ButtonSecondary>
            <LoadingButton actionName={item ? "edit" : "new"} type="submit" disabled={navigation.state === "submitting"}>
              {"Save"}
            </LoadingButton>
          </div>
        </div>
      </Form>
    </div>
  );
}
