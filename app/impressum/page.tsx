import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Impressum — GLADDY Party Crew",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <LegalLayout title="Impressum" lastUpdated="Juni 2026">
      <div className="highlight">
        Angaben gemäß § 5 TMG und § 18 MStV
      </div>

      <h2>Anbieter</h2>
      <p>
        <strong>Schwietz Holding UG (haftungsbeschränkt)</strong><br />
        <span className="placeholder">[Straße Hausnummer]</span><br />
        <span className="placeholder">[PLZ Ort]</span><br />
        Deutschland
      </p>

      <h2>Vertreten durch</h2>
      <p>Geschäftsführer: <span className="placeholder">[Vor- und Nachname]</span></p>

      <h2>Kontakt</h2>
      <p>
        E-Mail (Allgemein): <a href="mailto:info@gladdy-offiziell.de">info@gladdy-offiziell.de</a><br />
        E-Mail (Booking): <a href="mailto:booking@gladdy-offiziell.de">booking@gladdy-offiziell.de</a>
      </p>

      <h2>Handelsregister</h2>
      <p>
        Registergericht: <span className="placeholder">[Amtsgericht XY]</span><br />
        Registernummer: <span className="placeholder">[HRB XXXXX]</span>
      </p>

      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>Gemäß § 27a UStG: <span className="placeholder">[DE XXXXXXXXX]</span></p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        <span className="placeholder">[Vor- und Nachname]</span><br />
        <span className="placeholder">[Straße Hausnummer, PLZ Ort]</span>
      </p>

      <h2>EU-Streitbeilegung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr/
        </a>
      </p>
      <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach
        den allgemeinen Gesetzen verantwortlich. Nach §§ 8–10 TMG sind wir als Diensteanbieter jedoch
        nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder
        nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen
        zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
        bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
        Kenntnis einer konkreten Rechtsverletzung möglich.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
        Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
        verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
        Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
        erkennbar.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
        deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
        Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
        des jeweiligen Autors. Downloads und Kopien dieser Seite sind nur für den privaten,
        nicht kommerziellen Gebrauch gestattet.
      </p>
    </LegalLayout>
  );
}
