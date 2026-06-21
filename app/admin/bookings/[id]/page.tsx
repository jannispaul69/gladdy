import { notFound } from "next/navigation";
import BookingDetailClient from "./BookingDetailClient";

async function getBooking(id: string) {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const { data } = await getSupabaseAdmin().from("bookings").select("*").eq("id", id).single();
    return data;
  } catch {
    return null;
  }
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) notFound();

  return <BookingDetailClient booking={booking} />;
}
