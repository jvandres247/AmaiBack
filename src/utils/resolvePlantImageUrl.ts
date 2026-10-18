/** Resolve stored object paths against the publicly reachable S3 bucket URL. */
export const resolvePlantImageUrl = (imageUrl: string): string => {
  const baseUrl = process.env.S3_PUBLIC_BASE_URL?.replace(/\/+$/, "");

  // Keep existing external image URLs and environments without S3 configured.
  if (!baseUrl || /^https?:\/\//i.test(imageUrl)) return imageUrl;

  const key = imageUrl.replace(/^\/+/, "");
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl}/${encodedKey}`;
};
