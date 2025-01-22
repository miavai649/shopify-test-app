import prisma from "../db.server";

export async function loader({ request }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const id = url.searchParams.get("id");

  const res = await prisma.session.findFirst({
    where: {
      shop: shop,
    },
  });

  if (res && res.products) {
    const products = JSON.parse(res.products);

    const product = products.find((product) => product.id === id);

    if (product) {
      return new Response(JSON.stringify(product), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ error: "Shop or products not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
