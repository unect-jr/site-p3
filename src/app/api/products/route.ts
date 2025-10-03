import { getProducts } from "@/lib/getProdutos";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Revalida a cada 1 hora

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
