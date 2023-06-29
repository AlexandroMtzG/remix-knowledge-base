import TableSimple from "~/components/ui/tables/TableSimple";
import { KnowledgeBasesTemplateDto } from "../../dtos/KnowledgeBasesTemplateDto";

export default function PreviewKbsTemplate({ template }: { template: KnowledgeBasesTemplateDto }) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Knowledge Bases</h3>
      <TableSimple
        items={template.knowledgeBases}
        headers={[
          { name: "slug", title: "Slug", value: (i) => i.slug },
          {
            name: "title",
            title: "Title",
            value: (i) => (
              <div className="flex-col">
                <div>{i.title}</div>
                <div className="text-xs text-gray-500">{i.description}</div>
              </div>
            ),
          },
          { name: "enabled", title: "Enabled", value: (i) => i.enabled },
        ]}
      />

      <h3 className="font-medium">Categories</h3>
      <TableSimple
        items={template.categories}
        headers={[
          { name: "slug", title: "Slug", value: (i) => i.slug },
          {
            name: "title",
            title: "Title",
            value: (i) => (
              <div className="flex-col">
                <div>{i.title}</div>
                <div className="text-xs text-gray-500">{i.description}</div>
              </div>
            ),
          },
          {
            name: "sections",
            title: "Sections",
            value: (i) => i.sections.map((s) => s.title).join(", "),
          },
          { name: "knowledgeBase", title: "Knowledge Base", value: (i) => i.knowledgeBaseSlug },
        ]}
      />

      <h3 className="font-medium">Articles</h3>
      <TableSimple
        items={template.articles}
        headers={[
          { name: "slug", title: "Slug", value: (i) => i.slug },
          {
            name: "title",
            title: "Title",
            value: (i) => (
              <div className="flex-col">
                <div>{i.title}</div>
                <div className="text-xs text-gray-500">{i.description}</div>
              </div>
            ),
          },
          { name: "knowledgeBase", title: "Knowledge Base", value: (i) => i.knowledgeBaseSlug },
        ]}
      />
    </div>
  );
}
