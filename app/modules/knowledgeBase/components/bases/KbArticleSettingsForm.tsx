import { Form, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import InputCheckboxWithDescription from "~/components/ui/input/InputCheckboxWithDescription";
import InputSelector from "~/components/ui/input/InputSelector";
import InputText, { RefInputText } from "~/components/ui/input/InputText";
import { KnowledgeBaseArticleWithDetails } from "~/modules/knowledgeBase/db/kbArticles.db.server";
import UrlUtils from "~/utils/app/UrlUtils";
import { KnowledgeBaseCategoryWithDetails } from "../../helpers/KbCategoryModelHelper";

export default function KbArticleSettingsForm({
  categories,
  item,
  onDelete,
}: {
  categories: KnowledgeBaseCategoryWithDetails[];
  item: KnowledgeBaseArticleWithDetails;
  onDelete: () => void;
}) {
  const navigation = useNavigation();
  const inputTitle = useRef<RefInputText>(null);

  const [categoryId, setCategoryId] = useState<string | undefined>(item?.categoryId ?? "");
  const [category, setCategory] = useState<KnowledgeBaseCategoryWithDetails | undefined>(undefined);
  const [sectionId, setSectionId] = useState<string | undefined>(item?.sectionId ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [seoImage, setSeoImage] = useState(item?.seoImage ?? "");
  const [isFeatured, setIsFeatured] = useState(item?.featuredOrder ? true : false);

  useEffect(() => {
    const slug = UrlUtils.slugify(title);
    setSlug(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  useEffect(() => {
    setCategory(categories.find((f) => f.id === categoryId));
  }, [categories, categoryId]);

  return (
    <Form method="post" className="space-y-6">
      <input name="action" value="edit" readOnly hidden />
      <div className="space-y-3">
        <div className="grid gap-3">
          <InputText ref={inputTitle} name="title" title={"Title"} value={title} setValue={setTitle} required />
          <InputText name="slug" title={"Slug"} value={slug} setValue={setSlug} required />
          <InputText
            rows={2}
            name="description"
            title={"Description"}
            value={description}
            setValue={setDescription}
            maxLength={300}
            // required
          />

          <InputSelector
            name="categoryId"
            title={"Category"}
            value={categoryId}
            setValue={(e) => setCategoryId(e?.toString())}
            options={categories.map((f) => {
              return {
                value: f.id,
                name: f.title,
              };
            })}
          />

          {category && category.sections.length > 0 && (
            <InputSelector
              name="sectionId"
              title={"Section"}
              value={sectionId}
              setValue={(e) => setSectionId(e?.toString())}
              options={category.sections.map((f) => {
                return {
                  value: f.id,
                  name: f.title,
                };
              })}
            />
          )}

          <InputText name="image" title={"SEO Image"} value={seoImage} setValue={setSeoImage} />

          {seoImage && (
            <div>
              <img className="overflow-hidden rounded-lg shadow-xl xl:border-b xl:border-gray-200" src={seoImage} alt={title} />
            </div>
          )}

          <InputCheckboxWithDescription
            name="isFeatured"
            title={"Featured"}
            value={isFeatured}
            setValue={setIsFeatured}
            description={"Displayed on the homepage."}
          />
        </div>
      </div>

      <div className="mt-5 flex justify-between space-x-2 sm:mt-6">
        <div>
          <ButtonSecondary disabled={navigation.state === "submitting"} type="button" className="w-full" onClick={onDelete} destructive>
            <div>{"Delete"}</div>
          </ButtonSecondary>
        </div>
        <div className="flex space-x-2">
          <LoadingButton actionName="edit" type="submit" disabled={navigation.state === "submitting"}>
            {"Save"}
          </LoadingButton>
        </div>
      </div>
    </Form>
  );
}
