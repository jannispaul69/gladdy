import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — GLADDY Party Crew",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklärung" lastUpdated="Juni 2026">
      <div className="highlight">
        Diese Datenschutzerklärung informiert dich gemäß Art. 13 und 14 DSGVO darüber, wie wir
        personenbezogene Daten auf dieser Website erheben und verarbeiten.
      </div>

      <h2>1. Verantwortlicher</h2>
      <p>
        <strong>Schwietz Holding UG (haftungsbeschränkt)</strong><br />
        Grambkermoorer Landstraße 22G, 28719 Bremen<br />
        E-Mail: <a href="mailto:info@gladdy-offiziell.de">info@gladdy-offiziell.de</a>
      </p>

      <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>

      <h3>2.1 Beim Besuch der Website (Server-Logs)</h3>
      <p>
        Beim Aufrufen unserer Website werden durch den Hosting-Anbieter (Vercel Inc., 340 Pine Street,
        Suite 900, San Francisco, CA 94104, USA) automatisch Informationen in sog. Server-Log-Dateien
        gespeichert:
      </p>
      <ul>
        <li>Browsertyp und -version</li>
        <li>Verwendetes Betriebssystem</li>
        <li>Referrer-URL (zuvor besuchte Seite)</li>
        <li>Hostname des zugreifenden Rechners</li>
        <li>Uhrzeit der Serveranfrage</li>
        <li>IP-Adresse (anonymisiert)</li>
      </ul>
      <p>
        <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
        einem sicheren und stabilen Betrieb der Website). Die Daten werden nach 7 Tagen
        automatisch gelöscht.
      </p>

      <h3>2.2 Booking- und Kontaktformular</h3>
      <p>
        Wenn du über unser Booking-Formular eine Anfrage sendest, verarbeiten wir folgende Daten:
      </p>
      <ul>
        <li>Anrede, Vor- und Nachname</li>
        <li>E-Mail-Adresse und Telefonnummer</li>
        <li>Postanschrift (Straße, PLZ, Ort)</li>
        <li>Veranstaltungsdaten (Name, Ort, Datum, Besucherzahl, Stagetime)</li>
        <li>Freitext-Nachricht</li>
      </ul>
      <p>
        Diese Daten werden ausschließlich zur Bearbeitung deiner Booking-Anfrage genutzt.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) sowie
        Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bearbeitung von Anfragen).
      </p>
      <p>
        <strong>Speicherung:</strong> Daten werden in unserer Datenbank (Supabase, Server-Standort
        EU — Frankfurt, betrieben von Supabase Inc., 970 Toa Payoh North, Singapur) gespeichert.
        Eine Weitergabe an Dritte erfolgt nicht, außer zur E-Mail-Zustellung (siehe 2.3).
        Daten werden nach Erledigung der Anfrage bzw. nach Ablauf gesetzlicher Aufbewahrungsfristen
        (i. d. R. 6 Jahre nach Geschäftsjahresende) gelöscht.
      </p>

      <h3>2.3 E-Mail-Versand via Resend</h3>
      <p>
        Zur Bestätigung deiner Booking-Anfrage und zur internen Benachrichtigung nutzen wir den
        Dienst Resend (Resend Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA).
        Dabei wird deine E-Mail-Adresse an Resend übermittelt. Resend verarbeitet diese Daten
        ausschließlich zur Zustellung transaktionaler E-Mails.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO. Resend ist gemäß
        EU-US Data Privacy Framework zertifiziert.
      </p>

      <h2>3. Cookies und lokaler Speicher</h2>
      <p>
        Wir setzen folgende Cookies / Local-Storage-Einträge ein:
      </p>
      <ul>
        <li>
          <strong>gladdy_cookie_consent</strong> — Speichert deine Cookie-Einwilligung
          (localStorage). Kein Tracking. Läuft nicht ab.
        </li>
      </ul>
      <p>
        Darüber hinaus nutzen wir <strong>Vercel Analytics</strong> zur anonymen Auswertung
        von Seitenaufrufen. Dabei werden keine personenbezogenen Daten oder Cookies gesetzt.
        Die Analyse erfolgt ohne Profilerstellung.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
        an der Website-Analyse in anonymisierter Form).
      </p>

      <h2>4. Keine Weitergabe an Dritte</h2>
      <p>
        Deine personenbezogenen Daten werden nicht an Dritte verkauft oder zu Werbezwecken
        weitergegeben. Eine Weitergabe erfolgt nur soweit gesetzlich erforderlich oder zur
        Leistungserbringung notwendig (Hosting, E-Mail-Versand, Datenbank — jeweils mit
        Auftragsverarbeitungsvertrag gem. Art. 28 DSGVO).
      </p>

      <h2>5. Deine Rechte</h2>
      <p>Du hast gegenüber uns folgende Rechte:</p>
      <ul>
        <li><strong>Auskunft</strong> (Art. 15 DSGVO): Welche Daten wir über dich gespeichert haben</li>
        <li><strong>Berichtigung</strong> (Art. 16 DSGVO): Korrektur unrichtiger Daten</li>
        <li><strong>Löschung</strong> (Art. 17 DSGVO): Löschung deiner Daten soweit keine Aufbewahrungspflicht</li>
        <li><strong>Einschränkung</strong> (Art. 18 DSGVO): Verarbeitungseinschränkung</li>
        <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO): Herausgabe in maschinenlesbarem Format</li>
        <li><strong>Widerspruch</strong> (Art. 21 DSGVO): Widerspruch gegen Verarbeitung auf Basis berechtigter Interessen</li>
        <li><strong>Widerruf</strong> (Art. 7 Abs. 3 DSGVO): Widerruf erteilter Einwilligungen</li>
      </ul>
      <p>
        Zur Geltendmachung deiner Rechte wende dich an:{" "}
        <a href="mailto:info@gladdy-offiziell.de">info@gladdy-offiziell.de</a>
      </p>

      <h2>6. Beschwerderecht bei der Aufsichtsbehörde</h2>
      <p>
        Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
        Die zuständige Behörde für Nordrhein-Westfalen ist:
      </p>
      <p>
        Landesbeauftragte für Datenschutz und Informationsfreiheit NRW<br />
        Postfach 20 04 44, 40102 Düsseldorf<br />
        <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener noreferrer">www.ldi.nrw.de</a>
      </p>

      <h2>7. Aktualität dieser Datenschutzerklärung</h2>
      <p>
        Wir behalten uns vor, diese Datenschutzerklärung bei Änderungen der gesetzlichen Grundlagen
        oder unserer Verarbeitungstätigkeiten anzupassen. Die jeweils aktuelle Version ist auf dieser
        Seite abrufbar. Stand: Juni 2026.
      </p>
    </LegalLayout>
  );
}
