import { getFirestoreAdmin } from "@/lib/firebase-admin"; // Nosso helper do Admin SDK
import type { Product } from "@/lib/mockData"; // Reutilizamos a interface do contrato

export interface AdminProduct extends Product {
  deletedAt: string | null;
}

// Coleção pequena, lida inteira sem paginação — por isso o filtro de
// "não excluído" é feito aqui em memória, não com uma query
// `.where("deletedAt","==",null)` no Firestore (que não bateria com
// documentos que nunca tiveram esse campo, excluindo produtos antigos por
// engano). Se o catálogo crescer bastante, mover esse filtro pro Firestore.
function isNotDeleted(data: FirebaseFirestore.DocumentData): boolean {
  return !data.deletedAt;
}

// Função para buscar os produtos ativos
export async function getProducts(): Promise<Product[]> {
  try {
    const productsSnapshot = await getFirestoreAdmin()
      .collection("products")
      .where("ativo", "==", true) // Filtra apenas produtos ativos
      .get();

    if (productsSnapshot.empty) {
      return [];
    }

    const products: Product[] = productsSnapshot.docs
      .filter((doc) => isNotDeleted(doc.data()))
      .map((doc) => {
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

function toAdminProduct(doc: FirebaseFirestore.QueryDocumentSnapshot): AdminProduct {
  const data = doc.data();
  const deletedAt = data.deletedAt?.toDate?.() as Date | undefined;
  return {
    id: doc.id,
    nome: data.nome,
    preco: data.preco,
    imagemURL: data.imagemURL,
    ativo: data.ativo,
    deletedAt: deletedAt ? deletedAt.toISOString() : null,
  };
}

// Função para buscar todos os produtos não excluídos, usada no grid principal do admin
export async function getAllProductsForAdmin(): Promise<AdminProduct[]> {
  const productsSnapshot = await getFirestoreAdmin().collection("products").get();

  return productsSnapshot.docs.filter((doc) => isNotDeleted(doc.data())).map(toAdminProduct);
}

// Função para buscar só os produtos na lixeira (soft-deleted), usada na tela de lixeira do admin
export async function getDeletedProductsForAdmin(): Promise<AdminProduct[]> {
  const productsSnapshot = await getFirestoreAdmin().collection("products").get();

  return productsSnapshot.docs.filter((doc) => !isNotDeleted(doc.data())).map(toAdminProduct);
}

// Função para buscar um produto específico por ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docSnap = await getFirestoreAdmin().collection("products").doc(id).get();

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
