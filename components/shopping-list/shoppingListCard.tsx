import { ApiShoppingList } from "@/utils/api";
import { format } from "date-fns";
import Link from "next/link";

export function ShoppingListCard({ shoppingList }: { shoppingList: ApiShoppingList }) {
  return (
    <div className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col items-center justify-center gap-4">
      <div className="w-full flex flex-row p-4 items-center gap-4">
        <h1>{shoppingList.purchase.name}</h1>
        <Link className="text-blue-400 hover:text-blue-700 cursor-pointer" href={`/shopping-list/${shoppingList.id}`}>Ver Lista</Link>
      </div>
      <div className="bg-gray-100 w-full flex flex-row items-center gap-4">
        <h1 className="text-sm font-semibold">Data de Início:</h1>
        <p>{format(shoppingList.purchase.startDate, "dd/MM/yyyy")}</p>
        <h1 className="text-sm font-semibold">Data de Fim:</h1>
        <p>{format(shoppingList.purchase.endDate, "dd/MM/yyyy")}</p>
      </div>
    </div>
  );
}