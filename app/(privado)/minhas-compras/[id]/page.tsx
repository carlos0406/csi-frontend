interface PageProps {
  params: { id: string };
}
import { cookies } from "next/headers";

export default async function ShoppingListView({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  const result = await fetch(`http://localhost:3000/shopping-list/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `next-auth.session-token=${token}`,
    },
  });

  const data = await result.json();
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 className="text-3xl mb-12">Lista de Compras</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Esta é a página da lista de compras para o ID: {id}</p>
      </div>
      {JSON.stringify(data)}
    </div>
  );
}
