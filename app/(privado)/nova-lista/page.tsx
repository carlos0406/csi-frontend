"use client"

import type React from "react"
import { number, z } from "zod"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { usePurchases } from "@/hooks/usePurchases"
import { useToast } from "@/hooks/use-toast"
import { useCards } from "@/hooks/useCards"
import { ApiCard, createShoppingList } from "@/utils/api"
import { useRarities } from "@/hooks/useRarities"

const itemSchema = z.object({
  cardId: z.number().min(1, { message: "Select a card" }),
  cardName: z.string().min(1, { message: "Card name is required" }),
  rarityId: z.string().min(1, { message: "Select a rarity" }),
  rarityName: z.string().min(1, { message: "Rarity name is required" }),
  collection: z.string().min(1, { message: "Select a collection" }),
  quantity: z.number().min(1, { message: "Minimum quantity is 1" }),
  unit_price: z.number().min(0, { message: "Price must be non-negative" }),
})

const formSchema = z.object({
  purchaseId: z.string().min(1, { message: "Select a purchase" }),
  items: z.array(itemSchema).min(1, { message: "Add at least one item to the list" }),
})

interface CardOption {
  value: string
  label: string
}

export default function NovaLista() {
  const router = useRouter()
  const { toast } = useToast()
  const [collectionOptions, setCollectionOptions] = useState<CardOption[]>([])
  const {isLoading:isLoadingCard,cards,setCardQuery} = useCards()
  const {isLoading:isLoadingRarities,rarities} = useRarities()
  const cardOption = cards?.map((card: ApiCard) => ({
    value: card.id,
    label: card.name,
  }))
  const raritiesOptions = rarities?.map((rarity) => ({
    value: rarity.id,
    label: rarity.name,
  }))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseId: "",
      items: [],
    },
  })

  const newItemForm = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      cardId: 0,
      cardName: "",
      rarityId: "",
      rarityName: "",
      collection: "",
      quantity: 1,
      unit_price: 0,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  

  const handleCardSelect = (cardId: number) => {
    const selectedCard = cards?.find((card) => card.id === cardId)
    console.log(selectedCard)
    if (selectedCard) {
      newItemForm.setValue("cardId", selectedCard.id)
      newItemForm.setValue("cardName", selectedCard.name)
      newItemForm.clearErrors("cardId")
      newItemForm.clearErrors("cardName")
      setCollectionOptions(
        Array.from(new Set(selectedCard.card_sets)).map((set: string) => ({
          value: set,
          label: set,
        }))
      )
    }
  }

  const addItem = () => {
    newItemForm.handleSubmit((data) => {
      append(data)
      newItemForm.reset({
        cardId: 0,
        cardName: "",
        rarityId: "",
        rarityName: "",
        collection: "",
        quantity: 1,
        unit_price: 0,
      })
    })()
  }

  async function onSubmit (data: z.infer<typeof formSchema>) {
    try{
    await createShoppingList(data)
    toast({
      title: "Sucesso!",
      description: "Lista de compras criada com sucesso!",
    })
    } catch (error) {
      console.error("Error creating shopping list:", error)
      toast({
        title: "Erro!",
        description: "Falha ao criar lista de compras.",
        variant: "destructive",
      })
    }
    // router.push("/listas-compra")
  }

  const { purchases, error, isLoading: isLoadPurchases } = usePurchases()
  const purchaseOptions = purchases?.data.map((purchase) => ({
    value: purchase.id,
    label: purchase.name,
  })) || []

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Nova Lista de Compra</h1>
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="purchaseId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label htmlFor="purchaseId">Selecione Compra</Label>
                  <FormControl>
                    <Combobox
                      options={isLoadPurchases ? [] : purchaseOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Selecione uma compra"
                      emptyMessage="Nenhuma compra encontrada."
                      loading={isLoadPurchases}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">Adicionar Item</h3>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="cardId">Carta</Label>
                  <FormField
                    control={newItemForm.control}
                    name="cardId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Combobox
                            options={cardOption?? []}
                            value={field.value}
                            onChange={handleCardSelect}
                            shouldFilter={false}
                            placeholder="Buscar carta..."
                            emptyMessage="Nenhuma carta encontrada. Digite para buscar."
                            loading={isLoadingCard}
                            onSearch={setCardQuery}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rarity">Raridade</Label>
                  <FormField
                    control={newItemForm.control}
                    name="rarityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Combobox
                            options={raritiesOptions?? []}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value)
                              // Also set the rarity name
                              const selectedRarity = rarities?.find(rarity => rarity.id === value)
                              if (selectedRarity) {
                                newItemForm.setValue("rarityName", selectedRarity.name)
                              }
                              newItemForm.clearErrors("rarityId")
                              newItemForm.clearErrors("rarityName")
                            }}
                            placeholder="Selecione a raridade"
                            emptyMessage="Nenhuma raridade disponível."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="collection">Coleção</Label>
                  <FormField
                    control={newItemForm.control}
                    name="collection"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Combobox
                            options={collectionOptions}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value)
                              newItemForm.clearErrors("collection")
                            }}
                            placeholder="Selecione a coleção"
                            emptyMessage="Nenhuma coleção disponível."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <FormField
                    control={newItemForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number.parseInt(e.target.value) || 0)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_price">Preço Unitário</Label>
                  <FormField
                    control={newItemForm.control}
                    name="unit_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="unit_price"
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number.parseFloat(e.target.value) || 0)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={addItem}
                className="bg-gray-800 hover:bg-gray-700 text-white h-12 sm:h-10 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
            {form.formState.errors.items && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm">{form.formState.errors.items.message}</p>
              </div>
            )}
            {fields.length > 0 && (
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
                        {fields.map((item, index) => {
                          const itemData = form.getValues(`items.${index}`)
                          return (
                            <tr key={item.id} className="border-b">
                              <td className="p-2 text-sm">{itemData.cardName}</td>
                              <td className="p-2 text-sm">{itemData.rarityName}</td>
                              <td className="p-2 text-sm">{itemData.collection}</td>
                              <td className="p-2 text-sm">{itemData.quantity}</td>
                              <td className="p-2 text-sm">R$ {itemData.unit_price.toFixed(2)}</td>
                              <td className="p-2 text-sm">
                                R$ {(itemData.quantity * itemData.unit_price).toFixed(2)}
                              </td>
                              <td className="p-2 text-sm">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
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
        </Form>
      </div>
    </div>
  )
}