import ky, { Options, ResponsePromise } from "ky";

let api = ky.create({
  credentials: "include",
});

async function handleResponse<T>(response: ResponsePromise): Promise<T> {
  try {
    const res = await response;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return res.json<T>();
    } else {
      return response.text() as Promise<T>;
    }
  } catch (err: any) {
    if (err.name === "HTTPError") {
      throw await err.response.json();
    }
    throw err;
  }
}
export function get<T>(url: string, options?: Options): Promise<T> {
  return handleResponse<T>(api.get(url, options));
}

export function post<T>(url: string, options?: Options): Promise<T> {
  return handleResponse(api.post(url, options));
}

export function patch<T>(url: string, options?: Options): Promise<T> {
  return handleResponse(api.patch(url, options));
}
