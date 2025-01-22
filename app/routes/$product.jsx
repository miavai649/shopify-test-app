import prisma from "../db.server";

export async function loader({ params }) {
  const res = await prisma.session.findFirst({
    where: {
      shop: params.product,
    },
    select: {
      products: true,
    },
  });

  // const data = JSON.parse(res);

  return JSON.parse(res.products);
}
