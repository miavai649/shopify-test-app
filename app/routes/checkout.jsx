import { authenticate } from "../shopify.server";

export async function action({ request }) {
  try {
    const response = await authenticate.public.appProxy(request);
    console.log("🚀 ~ action ~ response:", response);
  } catch (error) {
    console.log(error);
    return error;
  }
}
