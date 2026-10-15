import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Events from "@/components/sections/Events";
import Songs from "@/components/sections/Songs";
import MerchSection from "@/components/sections/MerchSection";
import BookingBanner from "@/components/sections/BookingBanner";
import Booking from "@/components/sections/Booking";
import FanCommunity from "@/components/sections/FanCommunity";
import Footer from "@/components/sections/Footer";
import { getEvents } from "@/lib/events";
import { getReleasedSongs, isNewRelease } from "@/lib/songs";

// Re-render at most every 60s so timed song releases (e.g. at midnight) and
// admin changes show up without a redeploy.
export const revalidate = 60;

export default async function Home() {
  const now = new Date();
  const [events, songs] = await Promise.all([getEvents(), getReleasedSongs(now)]);
  const newSongIds = songs.filter((s) => isNewRelease(s, now)).map((s) => s.id);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Events events={events} />
        <Songs songs={songs} newIds={newSongIds} />
        <MerchSection />
        <BookingBanner />
        <Booking />
        <FanCommunity />
      </main>
      <Footer />
    </>
  );
}
