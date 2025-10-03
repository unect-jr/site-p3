import { firestoreAdmin } from "@/lib/firebase-admin"; // Nosso helper do Admin SDK
import type { Product } from "@/lib/mockData"; // Reutilizamos a interface do contrato

// Função para buscar os produtos ativos
export async function getProducts(): Promise<Product[]> {
  try {
    const productsSnapshot = await firestoreAdmin
      .collection("products")
      .where("ativo", "==", true) // Filtra apenas produtos ativos
      .get();

    if (productsSnapshot.empty) {
      return [];
    }

    const products: Product[] = productsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nome: data.nome,
        preco: data.preco,
        imagemURL: data.imagemURL,
        ativo: data.ativo,
      } as Product; // Type assertion para garantir a conformidade
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Em um app de produção, você poderia logar este erro em um serviço (Sentry, etc.)
    return []; // Retorna um array vazio em caso de erro para não quebrar a página
  }
}

// Função para buscar um produto específico por ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docSnap = await firestoreAdmin.collection("products").doc(id).get();

    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data() as Omit<Product, "id">; // Pega os dados e os trata como Produto sem o ID
    return { id: docSnap.id, ...data };
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    return null;
  }
}
