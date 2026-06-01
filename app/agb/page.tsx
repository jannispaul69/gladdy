import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "AGB — GLADDY Party Crew",
  robots: { index: false },
};

export default function AGBPage() {
  return (
    <LegalLayout title="Allgemeine Geschäftsbedingungen" lastUpdated="Juni 2026">
      <div className="highlight">
        Allgemeine Geschäftsbedingungen (AGB) für Künstler-Buchungen der Schwietz Holding UG
        (haftungsbeschränkt), nachfolgend „Anbieter" genannt.
      </div>

      <h2>§ 1 Geltungsbereich</h2>
      <p>
        Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge über die Buchung des
        Künstlers GLADDY (vertreten durch die Schwietz Holding UG) für Auftritte, Live-Events,
        Veranstaltungen und sonstige künstlerische Dienstleistungen. Abweichende Bedingungen
        des Auftraggebers werden nur anerkannt, wenn der Anbieter diesen ausdrücklich und
        schriftlich zugestimmt hat.
      </p>

      <h2>§ 2 Vertragsschluss</h2>
      <p>
        (1) Die Buchungsanfrage über das Online-Formular oder per E-Mail stellt ein unverbindliches
        Angebot des Auftraggebers dar.
      </p>
      <p>
        (2) Ein verbindlicher Vertrag kommt erst durch eine schriftliche Auftragsbestätigung
        (E-Mail oder Buchungsvertrag) des Anbieters zustande.
      </p>
      <p>
        (3) Mündliche Abreden bedürfen der schriftlichen Bestätigung durch den Anbieter.
      </p>

      <h2>§ 3 Leistungsumfang</h2>
      <p>
        (1) Der Anbieter stellt den Künstler GLADDY für den vereinbarten Auftritt zur Verfügung.
        Umfang, Dauer (Stagetime) und technische Anforderungen werden im Buchungsvertrag
        individuell festgelegt.
      </p>
      <p>
        (2) Zur ordnungsgemäßen Durchführung des Auftritts hat der Auftraggeber auf seine Kosten
        bereitzustellen: PA-Anlage, Bühne, Licht, Monitore sowie etwaige im Technischen Rider
        spezifizierten Anforderungen. Der Technische Rider ist Bestandteil des Buchungsvertrages.
      </p>
      <p>
        (3) Soundcheck und Aufbauzeit werden gesondert vereinbart und sind in der Stagetime
        nicht enthalten.
      </p>

      <h2>§ 4 Vergütung und Zahlungsbedingungen</h2>
      <p>
        (1) Die Vergütung (Gage) wird im Buchungsvertrag festgelegt. Alle Preise verstehen sich
        zzgl. der gesetzlichen Umsatzsteuer, sofern diese anfällt.
      </p>
      <p>
        (2) Eine Anzahlung von <strong>50 % der vereinbarten Gage</strong> ist innerhalb von
        14 Tagen nach Vertragsschluss fällig. Die Restzahlung ist spätestens{" "}
        <strong>7 Tage vor dem Veranstaltungsdatum</strong> zu leisten, sofern nicht schriftlich
        anders vereinbart.
      </p>
      <p>
        (3) Reise- und Übernachtungskosten werden — sofern nicht anders vereinbart —
        zusätzlich zur Gage nach tatsächlichem Aufwand berechnet.
      </p>
      <p>
        (4) Bei Zahlungsverzug ist der Anbieter berechtigt, Verzugszinsen in Höhe von 9 Prozentpunkten
        über dem Basiszinssatz (§ 247 BGB) zu berechnen.
      </p>

      <h2>§ 5 Stornierung durch den Auftraggeber</h2>
      <p>
        Bei Absage eines bestätigten Buchungsvertrages durch den Auftraggeber gelten folgende
        Stornierungsgebühren (bezogen auf die vereinbarte Netto-Gage):
      </p>
      <ul>
        <li>Absage bis 60 Tage vor dem Veranstaltungstermin: <strong>25 %</strong></li>
        <li>Absage bis 30 Tage vor dem Veranstaltungstermin: <strong>50 %</strong></li>
        <li>Absage bis 14 Tage vor dem Veranstaltungstermin: <strong>75 %</strong></li>
        <li>Absage weniger als 14 Tage vor dem Veranstaltungstermin: <strong>100 %</strong></li>
      </ul>
      <p>
        Dem Auftraggeber bleibt der Nachweis vorbehalten, dass ein geringerer Schaden entstanden ist.
      </p>

      <h2>§ 6 Stornierung durch den Anbieter</h2>
      <p>
        (1) Der Anbieter ist berechtigt, den Vertrag zu stornieren bei höherer Gewalt
        (Krankheit, Unfall, behördliche Verbote, Naturkatastrophen o. Ä.), die eine Durchführung
        des Auftritts unmöglich machen. In diesem Fall werden bereits geleistete Zahlungen
        vollständig erstattet.
      </p>
      <p>
        (2) Der Anbieter haftet nicht für Folgeschäden, die dem Auftraggeber durch eine
        gerechtfertigte Stornierung entstehen.
      </p>

      <h2>§ 7 Pflichten des Auftraggebers</h2>
      <p>Der Auftraggeber verpflichtet sich:</p>
      <ul>
        <li>alle erforderlichen behördlichen Genehmigungen und GEMA-Anmeldungen auf eigene Kosten einzuholen</li>
        <li>für ausreichend Sicherheitspersonal zu sorgen</li>
        <li>dem Künstler eine angemessene Umkleide / Backstage-Bereich zur Verfügung zu stellen</li>
        <li>die technischen Anforderungen gemäß Technischem Rider zu erfüllen</li>
        <li>Ton- und Bildaufnahmen des Auftritts nur mit ausdrücklicher schriftlicher Genehmigung des Anbieters zu fertigen oder zu veröffentlichen</li>
      </ul>

      <h2>§ 8 Bild- und Tonaufnahmen / Nutzungsrechte</h2>
      <p>
        (1) Der Künstler behält alle Rechte an seinen Darbietungen. Mitschnitte jeglicher Art
        (Foto, Video, Audio) für kommerzielle Nutzung oder Veröffentlichung in sozialen Medien
        bedürfen der schriftlichen Einwilligung des Anbieters.
      </p>
      <p>
        (2) Nicht-kommerzielle Fotos und Videos von Besuchern für den privaten Gebrauch sind
        gestattet, sofern keine explizite Untersagung durch den Anbieter erfolgt.
      </p>
      <p>
        (3) Pressefotos und Artwork des Künstlers für Veranstaltungswerbung dürfen mit schriftlicher
        Genehmigung des Anbieters und unter Nennung des Namens GLADDY genutzt werden.
      </p>

      <h2>§ 9 Haftung</h2>
      <p>
        (1) Der Anbieter haftet uneingeschränkt bei Vorsatz und grober Fahrlässigkeit sowie
        bei Verletzung von Leben, Körper und Gesundheit.
      </p>
      <p>
        (2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher
        Vertragspflichten (Kardinalpflichten), und zwar begrenzt auf den vorhersehbaren,
        vertragstypischen Schaden.
      </p>
      <p>
        (3) Die Haftung des Anbieters für Sach- und Vermögensschäden ist der Höhe nach
        auf die vereinbarte Vergütung begrenzt.
      </p>

      <h2>§ 10 Datenschutz</h2>
      <p>
        Die Verarbeitung personenbezogener Daten im Rahmen der Vertragsanbahnung und
        -abwicklung erfolgt gemäß unserer{" "}
        <a href="/datenschutz">Datenschutzerklärung</a>.
      </p>

      <h2>§ 11 Schlussbestimmungen</h2>
      <p>
        (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
      </p>
      <p>
        (2) Erfüllungsort und Gerichtsstand ist — soweit gesetzlich zulässig — der Sitz des Anbieters.
      </p>
      <p>
        (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der
        übrigen Bestimmungen unberührt. Die unwirksame Klausel ist durch eine wirksame zu ersetzen,
        die dem wirtschaftlichen Zweck am nächsten kommt.
      </p>
      <p>
        (4) Änderungen und Ergänzungen dieser AGB bedürfen der Schriftform.
      </p>

      <p style={{ marginTop: "2.5rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.35)" }}>
        Schwietz Holding UG (haftungsbeschränkt) · Stand: Juni 2026
      </p>
    </LegalLayout>
  );
}
