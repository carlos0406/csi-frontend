import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getPurchases } from '@/utils/api';
import { PaginationComponent } from '@/components/pagination';
import { cookies } from 'next/headers';

type Props = {
  searchParams: Promise<{
    page: number;
  }>;
};

export default async function ListasCompra({ searchParams }: Props) {
  const { page } = await searchParams;
  const response = await getPurchases({ page });
  const { data: purchases, ...pagination } = response.data;
  const cookieStore = await cookies();

  const token =
    cookieStore.get('next-auth.session-token')?.value ||
    cookieStore.get('__Secure-next-auth.session-token')?.value;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/users/admin`;

  const { ok: isAdmin } = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `next-auth.session-token=${token}`,
    },
  });

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Compras cadastradas{!isAdmin && ' (Admin)'}</h1>
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border mb-6 sm:mb-8">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 text-sm">COMPRA</th>
                  <th className="text-left p-2 text-sm">DATA INÍCIO</th>
                  <th className="text-left p-2 text-sm">DATA FIM</th>
                  {isAdmin && <th className="text-left p-2 text-sm">AÇÕES</th>}
                </tr>
              </thead>
              <tbody>
                {purchases.map(lista => (
                  <tr key={lista.id} className="border-b">
                    <td className="p-2 text-sm font-medium text-blue-600 whitespace-nowrap">
                      {lista.name}
                    </td>
                    <td className="p-2 text-sm whitespace-nowrap">
                      {lista.startDate &&
                        format(parseISO(lista.startDate), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                    </td>
                    <td className="p-2 text-sm whitespace-nowrap">
                      {lista.endDate &&
                        format(parseISO(lista.endDate), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                    </td>

                    {isAdmin && (
                      <td className="p-2 text-sm whitespace-nowrap text-blue-600 ">
                        <Link href={`/compras/${lista.id}`} className="hover:text-blue-950">
                          Visualizar detalhes
                        </Link>
                        {' | '}
                        <Link href={`/compras/${lista.id}/final`} className="hover:text-blue-950">
                          Relátorio final
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationComponent
              currentPage={pagination.page}
              pageSize={10}
              totalRecords={pagination.total}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link href="/nova-compra">
          <Button className="bg-gray-800 hover:bg-gray-700 text-white">Nova Compra</Button>
        </Link>
      </div>
    </div>
  );
}
