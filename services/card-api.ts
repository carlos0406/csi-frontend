// Simulação de uma API de cartas Yu-Gi-Oh!
// Em um ambiente real, isso seria substituído por chamadas reais à API

interface Card {
  id: string
  name: string
  rarity: string
  set: string
  image?: string
}

// Banco de dados simulado de cartas
const cardDatabase: Card[] = [
  { id: "1", name: "Blue-Eyes White Dragon", rarity: "Ultra Rare", set: "Legend of Blue Eyes White Dragon" },
  { id: "2", name: "Dark Magician", rarity: "Ultra Rare", set: "Legend of Blue Eyes White Dragon" },
  { id: "3", name: "Exodia the Forbidden One", rarity: "Ultra Rare", set: "Legend of Blue Eyes White Dragon" },
  { id: "4", name: "Black Luster Soldier", rarity: "Ultra Rare", set: "Invasion of Chaos" },
  { id: "5", name: "Chaos Emperor Dragon - Envoy of the End", rarity: "Secret Rare", set: "Invasion of Chaos" },
  { id: "6", name: "Elemental HERO Neos", rarity: "Ultra Rare", set: "Power of the Elements" },
  { id: "7", name: "Stardust Dragon", rarity: "Ultra Rare", set: "Duelist Genesis" },
  { id: "8", name: "Number 39: Utopia", rarity: "Ultra Rare", set: "Generation Force" },
  { id: "9", name: "Odd-Eyes Pendulum Dragon", rarity: "Ultra Rare", set: "Duelist Alliance" },
  { id: "10", name: "Firewall Dragon", rarity: "Secret Rare", set: "Code of the Duelist" },
  { id: "11", name: "Decode Talker", rarity: "Ultra Rare", set: "Code of the Duelist" },
  { id: "12", name: "Masked HERO Dark Law", rarity: "Super Rare", set: "The New Challengers" },
  { id: "13", name: "Masked HERO Anki", rarity: "Ultra Rare", set: "The New Challengers" },
  { id: "14", name: "Masked HERO Vapor", rarity: "Ultra Rare", set: "Generation Force" },
  { id: "15", name: "Masked HERO Goka", rarity: "Secret Rare", set: "Generation Force" },
  { id: "16", name: "Elemental HERO Stratos", rarity: "Ultra Rare", set: "Gladiator's Assault" },
  { id: "17", name: "Elemental HERO Absolute Zero", rarity: "Ultra Rare", set: "Duelist Revolution" },
  { id: "18", name: "Red-Eyes Black Dragon", rarity: "Ultra Rare", set: "Legend of Blue Eyes White Dragon" },
  { id: "19", name: "Dark Magician Girl", rarity: "Ultra Rare", set: "Magician's Force" },
  { id: "20", name: "Pot of Greed", rarity: "Common", set: "Legend of Blue Eyes White Dragon" },
]

export function searchCards(query: string): Card[] {
  if (!query) return []
  const results = cardDatabase.filter((card) => card.name.toLowerCase().includes(query.toLowerCase()))
  return results
}

export async function getCardById(id: string): Promise<Card | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return cardDatabase.find((card) => card.id === id)
}

// Função para obter todas as raridades disponíveis
  export const Allrarities = [
    "Common",
    "Rare",
    "Super Rare",
    "Ultra Rare",
    "Secret Rare",
    "Ultimate Rare",
    "Ghost Rare",
    "Gold Rare",
    "Premium Gold Rare",
    "Gold Secret Rare",
    "Platinum Rare",
    "Platinum Secret Rare",
    "Mosaic Rare",
    "Starfoil Rare",
    "Duel Terminal Rare",
    "Collector’s Rare",
    "Starlight Rare",
    "Prismatic Secret Rare (nome antigo de Starlight no OCG)",
    "Quarter Century Secret Rare",
    "Extra Secret Rare",
    "Ghost/Gold Rare",
    "10000 Secret Rare",
    "Millennium Rare (mais comum no OCG, mas conhecida no TCG)",
  ]

// Função para obter todos os sets disponíveis
export function getAvailableSets(): string[] {
  const sets = new Set<string>()
  cardDatabase.forEach((card) => sets.add(card.set))
  return Array.from(sets)
}
