import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/admin-products";
import DeleteButton from "@/app/admin/DeleteButton";

const CATEGORIES = [
  { value: "shirt", label: "Shirt" },
  { value: "hoodie", label: "Hoodie" },
  { value: "cap", label: "Cap" },
  { value: "mug", label: "Tasse / Becher" },
  { value: "other", label: "Sonstiges" },
];

const PRODUCT_STATUSES = [
  { value: "draft", label: "Entwurf" },
  { value: "active", label: "Aktiv" },
  { value: "archived", label: "Archiviert" },
];

const STATUS_COLORS: Record<string, string> = {
  draft: "#fbbf24",
  active: "#4ade80",
  archived: "rgba(255,255,255,0.3)",
};

type ProductRow = {
  id: string;
  title: string;
  description: string | null;
  price_cents: number;
  category: string;
  image_url: string | null;
  status: string;
  stock_quantity: number;
};

async function getProducts(): Promise<ProductRow[]> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function ProductForm({ product }: { product?: ProductRow }) {
  const isEdit = !!product;
  const priceValue = product ? (product.price_cents / 100).toFixed(2) : "";
  return (
    <div style={{ background: "#141414", border: "1px solid rgba(230,34,140,0.15)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.75rem" }}>
      <h2 style={{ fontFamily: "var(--font-anton)", fontSize: "0.95rem", letterSpacing: "0.1em", color: "#fff", marginBottom: "1.25rem" }}>
        {isEdit ? "PRODUKT BEARBEITEN" : "NEUES PRODUKT"}
      </h2>
      <form action={isEdit ? updateProduct : createProduct}>
        {isEdit && <input type="hidden" name="id" value={product.id} />}
        <div style={{ display: "grid", gap: "0.875rem", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          <div style={{ gridColumn: "span 2" }}>
            <label style={labelStyle}>Name *</label>
            <input type="text" name="title" required className="input-pink" placeholder="GLADDY-Shirt" defaultValue={product?.title} />
          </div>
          <div>
            <label style={labelStyle}>Preis (€) *</label>
            <input type="number" name="price" required className="input-pink" placeholder="29.99" min="0" step="0.01" defaultValue={priceValue} />
          </div>
          <div>
            <label style={labelStyle}>Kategorie</label>
            <select name="category" className="input-pink" defaultValue={product?.category ?? "other"} style={{ cursor: "pointer" }}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Lagerbestand</label>
            <input type="number" name="stock_quantity" className="input-pink" min="0" defaultValue={product?.stock_quantity ?? 0} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" className="input-pink" defaultValue={product?.status ?? "draft"} style={{ cursor: "pointer" }}>
              {PRODUCT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={labelStyle}>Bild-URL</label>
            <input type="url" name="image_url" className="input-pink" placeholder="https://..." defaultValue={product?.image_url ?? ""} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={labelStyle}>Beschreibung</label>
            <textarea name="description" className="input-pink" rows={2} placeholder="Kurze Produktbeschreibung..." defaultValue={product?.description ?? ""} style={{ resize: "vertical" }} />
          </div>
        </div>
        <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button type="submit" className="btn-primary" style={submitBtnStyle}>{isEdit ? "Speichern" : "Erstellen"}</button>
          <Link href="/admin/products" style={cancelStyle}>Abbrechen</Link>
        </div>
      </form>
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts();
  const editProduct = params.edit ? products.find(p => p.id === params.edit) : undefined;

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <ShoppingBag size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
            <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#fff" }}>PRODUKTE</h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>{products.length} Produkte</p>
        </div>
        {!params.new && !params.edit && (
          <Link href="/admin/products?new=1" className="btn-primary" style={{ padding: "0.6rem 1.25rem", borderRadius: "6px", fontSize: "0.85rem", textDecoration: "none", letterSpacing: "0.04em" }}>
            + Produkt hinzufügen
          </Link>
        )}
      </div>

      {(params.new === "1" || editProduct) && <ProductForm product={editProduct} />}

      {products.length === 0 ? (
        <div style={emptyState}>Noch keine Produkte angelegt.</div>
      ) : (
        <div style={tableWrapper}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1C1C1C" }}>
                {["Produkt", "Kategorie", "Preis", "Bestand", "Status", "Aktionen"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500 }}>{product.title}</div>
                    {product.description && (
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>
                    {CATEGORIES.find(c => c.value === product.category)?.label ?? product.category}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{formatPrice(product.price_cents)}</td>
                  <td style={{ ...tdStyle, color: product.stock_quantity <= 0 ? "#f87171" : "rgba(255,255,255,0.55)" }}>
                    {product.stock_quantity}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500, background: `${STATUS_COLORS[product.status]}22`, color: STATUS_COLORS[product.status] }}>
                      {PRODUCT_STATUSES.find(s => s.value === product.status)?.label ?? product.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    <Link href={`/admin/products?edit=${product.id}`} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", marginRight: "0.75rem" }} className="hover-white">
                      Bearbeiten
                    </Link>
                    <DeleteButton id={product.id} action={deleteProduct} confirmMessage="Produkt wirklich löschen?" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" };
const submitBtnStyle: React.CSSProperties = { padding: "0.6rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.875rem", letterSpacing: "0.04em" };
const cancelStyle: React.CSSProperties = { fontSize: "0.85rem", color: "rgba(255,255,255,0.3)", textDecoration: "none" };
const tableWrapper: React.CSSProperties = { background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" };
const thStyle: React.CSSProperties = { padding: "0.7rem 1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 500 };
const tdStyle: React.CSSProperties = { padding: "0.875rem 1rem", fontSize: "0.875rem" };
const emptyState: React.CSSProperties = { background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.875rem" };
