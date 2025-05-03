import Link from "next/link"
import { ShoppingCart, List, Plus, Search } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Sistema de Organização de Compras Yu-Gi-Oh!</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded shadow-sm border">
          <div className="flex items-start gap-3 mb-4">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            <div>
              <h2 className="font-medium text-lg">Criar Nova Compra</h2>
              <p className="text-sm text-gray-600">Crie uma nova compra definindo período e detalhes</p>
            </div>
          </div>
          <Link href="/nova-compra">
            <button className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
              Criar Compra
            </button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow-sm border">
          <div className="flex items-start gap-3 mb-4">
            <List className="h-6 w-6 text-gray-700" />
            <div>
              <h2 className="font-medium text-lg">Todas as compras</h2>
              <p className="text-sm text-gray-600">Visualize e gerencie as compras</p>
            </div>
          </div>
          <Link href="/compras">
            <button className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
              Ver Listas
            </button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow-sm border">
          <div className="flex items-start gap-3 mb-4">
            <Plus className="h-6 w-6 text-gray-700" />
            <div>
              <h2 className="font-medium text-lg">Nova Lista de Compra</h2>
              <p className="text-sm text-gray-600">Adicione cartas à sua lista de compras</p>
            </div>
          </div>
          <Link href="/nova-lista">
            <button className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
              Criar Lista
            </button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow-sm border">
          <div className="flex items-start gap-3 mb-4">
            <Search className="h-6 w-6 text-gray-700" />
            <div>
              <h2 className="font-medium text-lg">Visualizar Lista</h2>
              <p className="text-sm text-gray-600">Veja os detalhes de uma lista específica</p>
            </div>
          </div>
          <Link href="/listas-compra">
            <button className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
              Visualizar
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
