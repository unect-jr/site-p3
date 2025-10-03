// 1. O Contrato de Dados (Interface TypeScript)
export interface Product {
  id: string;
  nome: string;
  preco: number;
  imagemURL: string;
  ativo: boolean;
}

// 2. Os Dados Falsos (Mock Data)
// Um array de objetos que seguem a interface 'Product'.
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_001",
    nome: "Treinamento",
    preco: 1000,
    imagemURL:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1170&auto=format&fit=crop", // Placeholder image
    ativo: true,
  },
  {
    id: "prod_002",
    nome: "Monitor",
    preco: 1000,
    imagemURL:
      "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?q=80&w=1174&auto=format&fit=crop", // Placeholder image
    ativo: true,
  },
  {
    id: "prod_003",
    nome: "Piloto Automático",
    preco: 1000,
    imagemURL:
      "https://images.unsplash.com/photo-1498887960847-2a5e46312788?q=80&w=1169&auto=format&fit=crop", // Placeholder image
    ativo: true,
  },
  {
    id: "prod_004",
    nome: "Antena",
    preco: 1000,
    imagemURL:
      "https://images.unsplash.com/photo-1590896083082-3bc8f8188030?q=80&w=1330&auto=format&fit=crop", // Placeholder image
    ativo: true,
  },
  {
    id: "prod_005",
    nome: "Repotenciamento",
    preco: 1000,
    imagemURL:
      "https://images.unsplash.com/photo-1467733238130-bb6846885316?q=80&w=1335&auto=format&fit=crop", // Placeholder image
    ativo: true,
  },
  {
    id: "prod_006",
    nome: "Mapas",
    preco: 1000,
    imagemURL:
      "https://images.unsplash.com/photo-1478860409698-8707f313ee8b?q=80&w=1170&auto=format&fit=crop",
    ativo: true,
  },
];
