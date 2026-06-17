import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Events from "@/components/sections/Events";
import Songs from "@/components/sections/Songs";
import MerchSection from "@/components/sections/MerchSection";
import BookingBanner from "@/components/sections/BookingBanner";
import Booking from "@/components/sections/Booking";
import FanCommunity from "@/components/sections/FanCommunity";
import Pressekit from "@/components/sections/Pressekit";
import Footer from "@/components/sections/Footer";
import { getEvents } from "@/lib/events";

export default async function Home() {
  const events = await getEvents();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Events events={events} />
        <Songs />
        <MerchSection />
        <BookingBanner />
        <Booking />
        <FanCommunity />
      </main>
      <Pressekit />
      <Footer />
    </>
  );
}
