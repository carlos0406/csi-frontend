interface PageProps {
  params: { id: string };
}
import { settings } from '@/utils/settings';
import { cookies } from 'next/headers';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface PurchaseItem {
  id: string;
  purchase: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export default async function ShoppingListView({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('next-auth.session-token')?.value;

  if (!token) {
    throw new Error('Não autorizado. Faça login para continuar.');
  }

  const response = await fetch(`${settings.base_api_url}/shopping-list/purchase/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `next-auth.session-token=${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  const data = (await response.json()) as PurchaseItem[];

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Participantes da Compra</h1>
        <Link href="/minhas-compras" className="text-blue-600 hover:underline">
          Voltar para minhas compras
        </Link>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border mb-6">
        <h2 className="font-bold text-lg mb-4">{data[0]?.purchase?.name || 'Compra'}</h2>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Período da compra</p>
            <p className="font-medium">
              {data[0]?.purchase?.startDate &&
                data[0]?.purchase?.endDate &&
                `${format(parseISO(data[0].purchase.startDate), 'dd/MM/yyyy', { locale: ptBR })}
                até ${format(parseISO(data[0].purchase.endDate), 'dd/MM/yyyy', { locale: ptBR })}`}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border mb-6">
        <h2 className="font-bold text-lg mb-4">Participantes</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 text-sm">USUÁRIO</th>
                  <th className="text-left p-2 text-sm">NOME</th>
                  <th className="text-center p-2 text-sm">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2 text-sm whitespace-nowrap">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={item.user.image} alt={item.user.name} />
                        <AvatarFallback>{item.user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="p-2 text-sm font-medium whitespace-nowrap">{item.user.name}</td>
                    <td className="p-2 text-sm whitespace-nowrap text-center">
                      <Link href={`/minhas-compras/${item.id}`}>
                        <Button variant="outline">Ver Lista de Compras</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
