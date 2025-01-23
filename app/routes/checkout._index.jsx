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

  const storefrontAccessToken =
    data?.data?.storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken;

  if (!storefrontAccessToken) {
    throw new Error("Failed to create or retrieve Storefront Access Token.");
  }

  const storefrontApiUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`;

  const cartResponse = await fetch(storefrontApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({
      query: `#graphql
        mutation cartCreate($input: CartInput) {
          cartCreate(input: $input) {
            cart {
              checkoutUrl
              id
              lines(first: 5) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                      }
                    }
                  }
                }
              }
              
            }
            userErrors {
              field
              message
            }
          }
        }`,
      variables: {
        input: {
          lines: [
            {
              quantity: 1,
              merchandiseId: "gid://shopify/ProductVariant/42030867939364",
            },
          ],
        },
      },
    }),
  });

  const cartData = await cartResponse.json();

  return cartData;
};
