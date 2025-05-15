
interface PageProps {
  params: { id: string };
}

export default function ShoppingList({ params }: PageProps) {
 const { id } = params;
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 className="text-3xl mb-12">Lista de Compras</h1>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p>Esta é a página da lista de compras para o ID: {id}</p>
      </div>
    </div>
  );
}