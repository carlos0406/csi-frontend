"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { searchCards, getAvailableRarities, getAvailableSets } from "@/services/card-api"

interface Item {
  id: number
  carta: string
  cartaNome: string
  raridade: string
  colecao: string
  quantidade: number
  precoUnitario: number
}

interface CardOption {
  value: string
  label: string
}

export default function NovaLista() {
  const router = useRouter()
  const [compra, setCompra] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [novoItem, setNovoItem] = useState<Omit<Item, "id">>({
    carta: "",
    cartaNome: "",
    raridade: "",
    colecao: "",
    quantidade: 1,
    precoUnitario: 0,
  })

  // Estado para as opções de cartas
  const [cardOptions, setCardOptions] = useState<CardOption[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Estado para as opções de raridade e coleção
  const [raridadeOptions, setRaridadeOptions] = useState<CardOption[]>([])
  const [colecaoOptions, setColecaoOptions] = useState<CardOption[]>([])

  // Carregar opções de raridade e coleção
  useEffect(() => {
    // Carregar raridades
    const raridades = getAvailableRarities().map((raridade) => ({
      value: raridade,
      label: raridade,
    }))
    setRaridadeOptions(raridades)

    // Carregar coleções
    const colecoes = getAvailableSets().map((set) => ({
      value: set,
      label: set,
    }))
    setColecaoOptions(colecoes)
  }, [])

  const handleItemChange = (field: keyof Omit<Item, "id">, value: string | number) => {
    setNovoItem((prev) => ({ ...prev, [field]: value }))
  }

  const handleCardSearch = async (query: string) => {
    if (query.length < 5) {
      setCardOptions([]) // Limpa as opções se o texto for menor que 5 caracteres
      return
    }
  
    setIsSearching(true) // Ativa o estado de carregamento
  
    try {
      const response = await fetch(`http://localhost:3000/cards?name=${query}`)
      const results = await response.json()
  
      const options = results.map((card: { id: string; name: string }) => ({
        value: card.id,
        label: card.name,
      }))
  
      setCardOptions(options)
    } catch (error) {
      console.error("Erro ao buscar cartas:", error)
      setCardOptions([]) // Limpa as opções em caso de erro
    } finally {
      setIsSearching(false) // Desativa o estado de carregamento
    }
   
  }

  const handleCardSelect = (cardId: string) => {
    const selectedCard = cardOptions.find((option) => option.value === cardId)
    if (selectedCard) {
      handleItemChange("carta", cardId)
      handleItemChange("cartaNome", selectedCard.label)
    }
  }

  const adicionarItem = () => {
    if (!novoItem.carta || !novoItem.raridade || !novoItem.colecao) {
      alert("Preencha todos os campos do item")
      return
    }

    setItems((prev) => [...prev, { ...novoItem, id: Date.now() }])
    setNovoItem({
      carta: "",
      cartaNome: "",
      raridade: "",
      colecao: "",
      quantidade: 1,
      precoUnitario: 0,
    })
  }

  const removerItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!compra) {
      alert("Selecione uma compra")
      return
    }
    if (items.length === 0) {
      alert("Adicione pelo menos um item à lista")
      return
    }

    console.log("Lista criada:", { compra, items })
    alert("Lista de compra criada com sucesso!")
    router.push("/listas-compra")
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Nova Lista de Compra</h1>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="compra">Selecione Compra</Label>
            <Select value={compra} onValueChange={setCompra}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma compra" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compra1">COMPRA DE ABRIL II</SelectItem>
                <SelectItem value="compra2">COMPRA DE MAIO</SelectItem>
                <SelectItem value="compra3">COMPRA DE JUNHO</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Adicionar Item</h3>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="carta">Carta</Label>
                <Combobox
                  options={cardOptions}
                  value={novoItem.carta}
                  onChange={handleCardSelect}
                  placeholder="Buscar carta..."
                  emptyMessage="Nenhuma carta encontrada. Digite para buscar."
                  loading={isSearching}
                  onSearch={handleCardSearch}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="raridade">Raridade</Label>
                <Combobox
                  options={raridadeOptions}
                  value={novoItem.raridade}
                  onChange={(value) => handleItemChange("raridade", value)}
                  placeholder="Selecione a raridade"
                  emptyMessage="Nenhuma raridade disponível."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="colecao">Coleção</Label>
                <Combobox
                  options={colecaoOptions}
                  value={novoItem.colecao}
                  onChange={(value) => handleItemChange("colecao", value)}
                  placeholder="Selecione a coleção"
                  emptyMessage="Nenhuma coleção disponível."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  value={novoItem.quantidade}
                  onChange={(e) => handleItemChange("quantidade", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precoUnitario">Preço Unitário</Label>
                <Input
                  id="precoUnitario"
                  type="number"
                  min="0"
                  step="0.01"
                  value={novoItem.precoUnitario}
                  onChange={(e) => handleItemChange("precoUnitario", Number.parseFloat(e.target.value))}
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={adicionarItem}
              className="bg-gray-800 hover:bg-gray-700 text-white h-12 sm:h-10 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>

          {items.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">Itens Adicionados</h3>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-2 text-sm">Carta</th>
                        <th className="text-left p-2 text-sm">Raridade</th>
                        <th className="text-left p-2 text-sm">Coleção</th>
                        <th className="text-left p-2 text-sm">Qtd</th>
                        <th className="text-left p-2 text-sm">Preço Unit.</th>
                        <th className="text-left p-2 text-sm">Total</th>
                        <th className="text-left p-2 text-sm">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-2 text-sm">{item.cartaNome}</td>
                          <td className="p-2 text-sm">{item.raridade}</td>
                          <td className="p-2 text-sm">{item.colecao}</td>
                          <td className="p-2 text-sm">{item.quantidade}</td>
                          <td className="p-2 text-sm">R$ {item.precoUnitario.toFixed(2)}</td>
                          <td className="p-2 text-sm">R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</td>
                          <td className="p-2 text-sm">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removerItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white h-12 sm:h-10 w-full sm:w-auto">
            Criar Lista de Compra
          </Button>
        </form>
      </div>
    </div>
  )
}
