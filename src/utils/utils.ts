export const URL = `${process.env.VUE_APP_SOCKET_HOST ||
  "http://localhost"}:${process.env.VUE_APP_SOCKET_PORT || "3000"}`;

export function sortNamesAlphabetically(...names: string[]): string {
  return names.sort((a: string, b: string) => a.localeCompare(b)).join("");
}
