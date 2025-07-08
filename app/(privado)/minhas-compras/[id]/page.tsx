interface PageProps {
  params: Promise<{ id: string }>;
}
import { settings } from '@/utils/settings';
import { cookies } from 'next/headers';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

interface ShoppingListItem {
  id: string;
  collection: string;
  quantity: number;
  unit_price: number;
  card: {
    id: number;
    name: string;
  };
}

interface ShoppingListData {
  id: string;
  userId: string;
  purchaseId: string;
  items: ShoppingListItem[];
  purchase: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    createdBy: {
      id: string;
      name: string;
    };
  };
}

export default async function ShoppingListView({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('next-auth.session-token')?.value;

  if (!token) {
    throw new Error('Não autorizado. Faça login para continuar.');
  }

  const response = await fetch(`${settings.base_api_url}/shopping-list/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `next-auth.session-token=${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  const data: ShoppingListData = await response.json();

  const calculateTotal = (items: ShoppingListItem[]) => {
    return items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
  };

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalhes da Lista de Compras</h1>
        <Link href="/minhas-compras" className="text-blue-600 hover:underline">
          Voltar para minhas compras
        </Link>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border mb-6">
        <h2 className="font-bold text-lg mb-4">{data.purchase.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Período da compra</p>
            <p className="font-medium">
              {data.purchase.startDate &&
                data.purchase.endDate &&
                `${format(parseISO(data.purchase.startDate), 'dd/MM/yyyy', { locale: ptBR })} 
                até ${format(parseISO(data.purchase.endDate), 'dd/MM/yyyy', { locale: ptBR })}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Criado por</p>
            <p className="font-medium">{data.purchase.createdBy.name}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border mb-6">
        <h2 className="font-bold text-lg mb-4">Itens da Lista</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 text-sm">CARD ID</th>
                  <th className="text-left p-2 text-sm">NOME</th>
                  <th className="text-left p-2 text-sm">COLEÇÃO</th>
                  <th className="text-right p-2 text-sm">QUANTIDADE</th>
                  <th className="text-right p-2 text-sm">PREÇO UNITÁRIO</th>
                  <th className="text-right p-2 text-sm">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2 text-sm whitespace-nowrap">{item.card.id}</td>
                    <td className="p-2 text-sm font-medium whitespace-nowrap">{item.card.name}</td>
                    <td className="p-2 text-sm">{item.collection}</td>
                    <td className="p-2 text-sm whitespace-nowrap text-right">{item.quantity}</td>
                    <td className="p-2 text-sm whitespace-nowrap text-right">
                      R$ {(item.unit_price / 100).toFixed(2)}
                    </td>
                    <td className="p-2 text-sm font-medium whitespace-nowrap text-right">
                      R$ {((item.quantity * item.unit_price) / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan={5} className="p-2 text-sm font-bold text-right">
                    Total:
                  </td>
                  <td className="p-2 text-sm font-bold text-right">
                    R$ {(calculateTotal(data.items) / 100).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
