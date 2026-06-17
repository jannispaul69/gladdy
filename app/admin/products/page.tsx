import Link from "next/link";
import { ShoppingBag, ExternalLink, Star } from "lucide-react";
import { createProduct, updateProduct, deleteProduct, quickStatusUpdate } from "@/app/actions/admin-products";
import DeleteButton from "@/app/admin/DeleteButton";
import UploadField from "@/app/admin/UploadField";
import ImageGalleryField from "./ImageGalleryField";
import SizeStockField from "./SizeStockField";
import StatusSelect from "./StatusSelect";

const CATEGORIES = [
  { value: "shirt",  label: "Shirt" },
  { value: "hoodie", label: "Hoodie" },
  { value: "cap",    label: "Cap" },
  { value: "mug",    label: "Tasse / Becher" },
  { value: "other",  label: "Sonstiges" },
];
const STATUSES = [
  { value: "draft",    label: "Entwurf",    color: "#fbbf24" },
  { value: "active",   label: "Aktiv",      color: "#4ade80" },
  { value: "archived", label: "Archiviert", color: "rgba(255,255,255,0.3)" },
];

type ProductRow = {
  id: string; title: string; description: string | null;
  price_cents: number; compare_at_price_cents: number | null;
  category: string; image_url: string | null;
  images: { url: string; label: string }[];
  status: string; stock_quantity: number;
  sizes: { size: string; stock: number }[];
  material: string | null; care_instructions: string | null;
  delivery_days_min: number; delivery_days_max: number;
  weight_grams: number | null; sku: string | null;
  sort_order: number; featured: boolean;
};

async function getProducts(): Promise<ProductRow[]> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const { data } = await getSupabaseAdmin().from("products").select("*").order("sort_order").order("created_at", { ascending: false });
    return (data ?? []).map(p => ({ ...p, images: p.images ?? [], sizes: p.sizes ?? [] }));
  } catch { return []; }
}

const fmt = (c: number) => (c / 100).toFixed(2).replace(".", ",") + " €";
const label: React.CSSProperties = { display: "block", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem" };
const section: React.CSSProperties = { background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" };
const sectionTitle: React.CSSProperties = { fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", fontWeight: 500, marginBottom: "0.15rem" };

function ProductForm({ product }: { product?: ProductRow }) {
  const isEdit = !!product;
  const isShirt = ["shirt", "hoodie"].includes(product?.category ?? "");
  return (
    <div style={{ background: "#141414", border: "1px solid rgba(230,34,140,0.15)", borderRadius: "10px", padding: "1.75rem", marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "var(--font-anton)", fontSize: "1rem", letterSpacing: "0.1em", color: "#fff" }}>
          {isEdit ? "PRODUKT BEARBEITEN" : "NEUES PRODUKT"}
        </h2>
        {isEdit && (
          <Link href={`/merch/${product!.id}`} target="_blank"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
            className="hover-pink">
            <ExternalLink size={13} strokeWidth={1.75} /> Vorschau
          </Link>
        )}
      </div>

      <form action={isEdit ? updateProduct : createProduct}>
        {isEdit && <input type="hidden" name="id" value={product!.id} />}

        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>

          {/* ── Basis ── */}
          <div style={{ gridColumn: "1 / -1" }}>
            <p style={sectionTitle}>Grundinfos</p>
            <div style={{ ...section, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={label}>Name *</label>
                <input type="text" name="title" required className="input-pink" placeholder="GLADDY Party Shirt" defaultValue={product?.title} />
              </div>
              <div>
                <label style={label}>SKU / Artikelnr.</label>
                <input type="text" name="sku" className="input-pink" placeholder="GLD-001" defaultValue={product?.sku ?? ""} />
              </div>
              <div>
                <label style={label}>Kategorie</label>
                <select name="category" className="input-pink" defaultValue={product?.category ?? "other"} style={{ cursor: "pointer" }}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Status</label>
                <select name="status" className="input-pink" defaultValue={product?.status ?? "draft"} style={{ cursor: "pointer" }}>
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Sortierung</label>
                <input type="number" name="sort_order" className="input-pink" min="0" defaultValue={product?.sort_order ?? 0} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" name="featured" id="featured" defaultChecked={product?.featured} style={{ accentColor: "var(--primary)", width: "16px", height: "16px", cursor: "pointer" }} />
                <label htmlFor="featured" style={{ ...label, margin: 0, cursor: "pointer", textTransform: "none", letterSpacing: "0", fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}>
                  Featured (Homepage-Highlight)
                </label>
              </div>
            </div>
          </div>

          {/* ── Preise ── */}
          <div>
            <p style={sectionTitle}>Preise</p>
            <div style={section}>
              <div>
                <label style={label}>Preis (€) *</label>
                <input type="number" name="price" required className="input-pink" placeholder="29.99" min="0" step="0.01"
                  defaultValue={product ? (product.price_cents / 100).toFixed(2) : ""} />
              </div>
              <div>
                <label style={label}>Originalpreis (€) — für Rabatt-Anzeige</label>
                <input type="number" name="compare_at_price" className="input-pink" placeholder="39.99" min="0" step="0.01"
                  defaultValue={product?.compare_at_price_cents ? (product.compare_at_price_cents / 100).toFixed(2) : ""} />
              </div>
            </div>
          </div>

          {/* ── Lieferung ── */}
          <div>
            <p style={sectionTitle}>Lieferung & Versand</p>
            <div style={section}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
                <div>
                  <label style={label}>Lieferzeit min (Tage)</label>
                  <input type="number" name="delivery_days_min" className="input-pink" min="1" defaultValue={product?.delivery_days_min ?? 3} />
                </div>
                <div>
                  <label style={label}>Lieferzeit max (Tage)</label>
                  <input type="number" name="delivery_days_max" className="input-pink" min="1" defaultValue={product?.delivery_days_max ?? 7} />
                </div>
                <div>
                  <label style={label}>Gewicht (g)</label>
                  <input type="number" name="weight_grams" className="input-pink" min="0" placeholder="250" defaultValue={product?.weight_grams ?? ""} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Beschreibung ── */}
          <div style={{ gridColumn: "1 / -1" }}>
            <p style={sectionTitle}>Beschreibung & Produktdetails</p>
            <div style={{ ...section, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={label}>Kurzbeschreibung</label>
                <textarea name="description" className="input-pink" rows={2} placeholder="Kurze Produktbeschreibung…"
                  defaultValue={product?.description ?? ""} style={{ resize: "vertical" }} />
              </div>
              <div>
                <label style={label}>Material</label>
                <textarea name="material" className="input-pink" rows={2} placeholder="100 % Bio-Baumwolle · Ringspun · 180 g/m²"
                  defaultValue={product?.material ?? ""} style={{ resize: "vertical" }} />
              </div>
              <div>
                <label style={label}>Pflegehinweise</label>
                <textarea name="care_instructions" className="input-pink" rows={2} placeholder="30 °C Schonwaschgang · links waschen…"
                  defaultValue={product?.care_instructions ?? ""} style={{ resize: "vertical" }} />
              </div>
            </div>
          </div>

          {/* ── Bilder ── */}
          <div style={{ gridColumn: "1 / -1" }}>
            <p style={sectionTitle}>Bilder</p>
            <div style={section}>
              <div>
                <label style={label}>Hauptbild (URL oder Upload — wird automatisch aus Gallery-Bild 1 befüllt)</label>
                <UploadField name="image_url" folder="products" defaultValue={product?.image_url ?? ""} label="" />
              </div>
              <div>
                <label style={label}>Bildergalerie (mehrere Bilder mit Labels)</label>
                <ImageGalleryField defaultValue={product?.images ?? []} />
              </div>
            </div>
          </div>

          {/* ── Bestand ── */}
          <div style={{ gridColumn: "1 / -1" }}>
            <p style={sectionTitle}>Lagerbestand</p>
            <div style={section}>
              {isShirt ? (
                <>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>
                    Bestand pro Größe — Gesamtbestand wird automatisch berechnet.
                  </p>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <SizeStockField defaultValue={(product?.sizes ?? []) as any} />
                </>
              ) : (
                <div>
                  <label style={label}>Lagerbestand (Stück)</label>
                  <input type="number" name="stock_quantity" className="input-pink" min="0" defaultValue={product?.stock_quantity ?? 0} />
                </div>
              )}
            </div>
          </div>

        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button type="submit" className="btn-primary"
            style={{ padding: "0.65rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.875rem", letterSpacing: "0.04em" }}>
            {isEdit ? "Änderungen speichern" : "Produkt erstellen"}
          </button>
          <Link href="/admin/products" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Abbrechen</Link>
        </div>
      </form>
    </div>
  );
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ new?: string; edit?: string }> }) {
  const params   = await searchParams;
  const products = await getProducts();
  const editProduct = params.edit ? products.find(p => p.id === params.edit) : undefined;

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1200px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <ShoppingBag size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
            <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#fff" }}>PRODUKTE</h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>{products.length} Produkte · {products.filter(p => p.status === "active").length} aktiv</p>
        </div>
        {!params.new && !params.edit && (
          <Link href="/admin/products?new=1" className="btn-primary"
            style={{ padding: "0.6rem 1.25rem", borderRadius: "6px", fontSize: "0.85rem", textDecoration: "none", letterSpacing: "0.04em" }}>
            + Produkt hinzufügen
          </Link>
        )}
      </div>

      {(params.new === "1" || editProduct) && <ProductForm product={editProduct} />}

      {products.length === 0 ? (
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.875rem" }}>
          Noch keine Produkte angelegt.
        </div>
      ) : (
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
          <div className="admin-table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1C1C1C" }}>
                {["", "Produkt", "Kategorie", "Preis", "Bestand", "Lieferzeit", "Status", "Aktionen"].map(h => (
                  <th key={h} style={{ padding: "0.7rem 1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const status = STATUSES.find(s => s.value === product.status);
                const thumbUrl = product.images?.[0]?.url || product.image_url;
                const isShirt = ["shirt","hoodie"].includes(product.category);
                const sizeInfo = isShirt && product.sizes?.length
                  ? product.sizes.filter(s => s.stock > 0).map(s => s.size).join(" · ")
                  : null;
                return (
                  <tr key={product.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    {/* Thumb */}
                    <td style={{ padding: "0.75rem 0.75rem 0.75rem 1rem", width: "52px" }}>
                      {thumbUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumbUrl} alt="" style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.08)" }} />
                      ) : (
                        <div style={{ width: "44px", height: "44px", background: "#222", borderRadius: "6px" }} />
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        {product.featured && <Star size={11} style={{ color: "#fbbf24", flexShrink: 0 }} fill="#fbbf24" />}
                        <span style={{ fontWeight: 500 }}>{product.title}</span>
                      </div>
                      {product.sku && <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", marginTop: "0.1rem" }}>#{product.sku}</div>}
                      {sizeInfo && <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "0.1rem" }}>{sizeInfo}</div>}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
                      {CATEGORIES.find(c => c.value === product.category)?.label ?? product.category}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 500 }}>{fmt(product.price_cents)}</div>
                      {product.compare_at_price_cents && (
                        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>{fmt(product.compare_at_price_cents)}</div>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: product.stock_quantity <= 0 ? "#f87171" : "rgba(255,255,255,0.55)" }}>
                      {product.stock_quantity}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                      {product.delivery_days_min}–{product.delivery_days_max} Tage
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <StatusSelect id={product.id} status={product.status} />
                    </td>
                    <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap" }}>
                      <Link href={`/merch/${product.id}`} target="_blank"
                        style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", textDecoration: "none", marginRight: "0.75rem" }}
                        className="hover-white" title="Vorschau">
                        <ExternalLink size={13} strokeWidth={1.75} />
                      </Link>
                      <Link href={`/admin/products?edit=${product.id}`}
                        style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", marginRight: "0.75rem" }}
                        className="hover-white">Bearbeiten</Link>
                      <DeleteButton id={product.id} action={deleteProduct} confirmMessage="Produkt wirklich löschen?" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
