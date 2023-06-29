import OrderListButtons from "~/components/ui/sort/OrderListButtons";
import TableSimple from "~/components/ui/tables/TableSimple";

export default function KbSortArticles({
  items,
}: {
  items: {
    id: string;
    order: number;
    title: string;
  }[];
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-600">{"Articles"}</label>
      <TableSimple
        items={items}
        headers={[
          {
            name: "order",
            title: "",
            value: (i, idx) => <OrderListButtons index={idx} items={items} editable={true} />,
          },
          {
            name: "title",
            title: "Title",
            value: (item) => item.title,
          },
        ]}
      />
    </div>
  );
}
