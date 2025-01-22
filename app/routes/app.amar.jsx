import { Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { storefront, liquid } = await authenticate.public.appProxy(request);

  if (!storefront) {
    return new Response();
  }

  const response = await storefront.graphql(
    `#graphql
    query productTitle {
      products(first: 1) {
        nodes {
          title
        }
      }
    }`,
  );
  const body = await response.json();

  const title = body.data.products.nodes[0].title;

  return title;
};

export default function AmarPage() {
  return (
    <Page>
      <h1>hello world</h1>
    </Page>
  );
}
