import { Box, Page, Button, InlineGrid, Card, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";
import { useSubmit, useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// loader function
export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const res = await db.session.findUnique({
    where: {
      id: session.id,
    },
    select: {
      products: true,
    },
  });

  return JSON.parse(res.products);
}

// action function
export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const res = await request.formData();

  const products = await res.get("products");

  return await db.session.update({
    where: {
      id: session.id,
    },
    data: {
      products,
    },
  });
}

export default function AdditionalPage() {
  const [products, setProducts] = useState([]);

  const data = useLoaderData();
  console.log("🚀 ~ AdditionalPage ~ data:", data[0]?.variants[0]);

  const submit = useSubmit();

  const handleSelectProduct = async () => {
    const selected = await shopify.resourcePicker({
      type: "product",
      action: "select",
      filter: {
        archived: false,
        draft: false,
        variants: true,
      },
      multiple: true,
      selectionIds: data?.map((product) => {
        return {
          id: product?.id,
          variants: product?.variants?.map((variant) => {
            return {
              id: variant?.id,
            };
          }),
        };
      }),
    });

    if (selected) {
      setProducts(selected);
    } else {
      console.log("Picker was cancelled by the user");
    }
  };

  const handleSubmit = async () => {
    console.log("submit button clicked");

    submit(
      { products: JSON.stringify(products) },
      {
        method: "post",
      },
    );
    setProducts([]);
  };

  return (
    <Page>
      <TitleBar title="Additional page" />
      <Button onClick={handleSelectProduct}>Select Product</Button>
      <Button disabled={products.length < 1} onClick={handleSubmit}>
        Submit
      </Button>

      <InlineGrid gap="400" columns={3}>
        {products.map((product) => (
          <Card key={product.id}>
            <h1>{product.title}</h1>
          </Card>
        ))}
      </InlineGrid>
    </Page>
  );
}
