import { cookies } from 'next/headers';
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { ApiShoppingList } from '@/utils/api';
import { redirect } from 'next/navigation';
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from 'next/link';

export default async function MyShoppingLists() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/');
  }
  
  const cookieStore = await cookies();
  const token = cookieStore.get('next-auth.session-token')?.value;
  
  let data: ApiShoppingList[] = [];
  let error: string | null = null;
  
  if (token) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/shopping-list/user/${user.id}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cookie': `next-auth.session-token=${token}`
        }
      });
      
      if (response.ok) {
        data = await response.json();
      } else {
        error = `Erro ${response.status}: ${response.statusText}`;
      }
    } catch (error: any) {
      error = `Erro ao buscar dados: ${error.message}`;
    }
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Minhas Listas de compra</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {data.length === 0 && !error ? (
        <div className="text-center py-8 bg-white rounded-md shadow-sm border">
          <p className="text-gray-500">Você ainda não tem listas de compras.</p>
        </div>
      ) : (
        <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border mb-6 sm:mb-8">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 text-sm">ID</th>
                    <th className="text-left p-2 text-sm">COMPRA</th>
                    <th className="text-left p-2 text-sm">DATA INÍCIO</th>
                    <th className="text-left p-2 text-sm">DATA FIM</th>
                    <th className="text-left p-2 text-sm">CRIADO POR</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((shoppingList) => (
                    <tr key={shoppingList.id} className="border-b">
                      <td className="p-2 text-sm whitespace-nowrap">{shoppingList.id.substring(0, 8)}</td>
                        <td className="p-2 text-sm font-medium text-blue-600 whitespace-nowrap">
                        <Link href={`/minhas-compras/${shoppingList.id}`} className="hover:underline">
                          {shoppingList.purchase.name}
                        </Link>
                        </td>
                      <td className="p-2 text-sm whitespace-nowrap">
                        {shoppingList.purchase.startDate && format(parseISO(shoppingList.purchase.startDate), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="p-2 text-sm whitespace-nowrap">
                        {shoppingList.purchase.endDate && format(parseISO(shoppingList.purchase.endDate), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="p-2 text-sm whitespace-nowrap">{shoppingList.user.name}</td>
                    </tr>
                  ))}
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}