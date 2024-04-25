export function getUserId() {
  return localStorage.getItem("userId") || process.env.USER_ID || "";
}
