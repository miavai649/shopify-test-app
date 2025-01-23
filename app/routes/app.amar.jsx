import { Page, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
  mutation StorefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
    storefrontAccessTokenCreate(input: $input) {
      userErrors {
        field
        message
      }
      shop {
        id
      }
      storefrontAccessToken {
        accessScopes {
          handle
        }
        accessToken
        title
      }
    }
  }`,
    {
      variables: {
        input: {
          title: "New Storefront Access Token",
        },
      },
    },
  );

  const data = await response.json();
  console.log(
    "🚀 ~ loader ~ storefrontAccessToken:",
    data?.data?.storefrontAccessTokenCreate?.storefrontAccessToken,
  );
  return data;
};

export default function Amar() {
  return (
    <Page>
      <Text as="span" variant="bodyMd">
        Framework
      </Text>
    </Page>
  );
}
