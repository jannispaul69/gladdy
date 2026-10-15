/**
 * Shirt and mug photos live in /public/products, one folder per motif.
 * A product picks its motif via a tag like "motiv:dichter-zitat";
 * products without such a tag use the original Party Crew photos.
 *
 *   /products/[motif/]shirt-{men|women}-{black|white}-{front|back}.png
 *   /products/[motif/]{tasse|herztasse}-{front|left|right}.png
 */
export type ShirtColor = "black" | "white";
export type ShirtSide = "front" | "back";
export type MugAngle = "front" | "left" | "right";

type ProductLike = {
  title: string;
  image_url?: string | null;
  tags?: string[] | null;
};

export function productMotif(product: ProductLike): string | null {
  const tag = product.tags?.find((t) => t.startsWith("motiv:"));
  return tag ? tag.slice("motiv:".length) : null;
}

/** Tag marking products where the buyer enters a name to print (e.g. "It's my Cup"). */
export const PERSONALIZE_TAG = "personalisierbar";

export function isPersonalizable(product: ProductLike): boolean {
  return !!product.tags?.includes(PERSONALIZE_TAG);
}

function basePath(product: ProductLike): string {
  const motif = productMotif(product);
  return motif ? `/products/${motif}/` : "/products/";
}

export function shirtGender(product: ProductLike): "men" | "women" {
  const src = `${product.image_url ?? ""}${product.title}`.toLowerCase();
  return src.includes("women") || src.includes("damen") ? "women" : "men";
}

export function shirtImage(product: ProductLike, color: ShirtColor, side: ShirtSide): string {
  return `${basePath(product)}shirt-${shirtGender(product)}-${color}-${side}.png`;
}

export function mugImage(product: ProductLike, angle: MugAngle): string {
  const src = `${product.image_url ?? ""}${product.title}`.toLowerCase();
  const type = src.includes("herz") ? "herztasse" : "tasse";
  return `${basePath(product)}${type}-${angle}.png`;
}

/** Side shown first on shop cards: motif shirts carry their print on the back. */
export function shirtCardSide(product: ProductLike): ShirtSide {
  return productMotif(product) ? "back" : "front";
}
