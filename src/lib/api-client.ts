const API_KEY = process.env.HBAUTH_API_KEY!;
const BASE_URL = process.env.HBAUTH_BASE_URL!;
const CUSTOMER_ID = process.env.HBAUTH_CUSTOMER_ID!;

const TIMEOUT_MS = 15_000;

export interface HbAuthResponse {
  status: number;
  data: Record<string, unknown>;
}

export async function callHbAuth(
  endpoint: string,
  body: Record<string, unknown>
): Promise<HbAuthResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out after 15 seconds");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export { CUSTOMER_ID };
