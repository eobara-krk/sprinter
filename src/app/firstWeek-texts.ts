export class FirstWeekTexts {
static dzien1: string = `<div style="font-family:'Arial', Helvetica, sans-serif; font-size:13px; color:#2e2e2e; background:#f4f6f9;">
  <div style="max-width:620px; margin:0 auto; background:#fff; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">

<h2 style="font-family:'Arial', Helvetica, sans-serif; font-size:15px; color:#34495e; margin:0 0 10px 0;">
  &#128206; W załączniku znajdziesz plik Excel z <strong>dwoma arkuszami</strong> dotyczącymi naruszeń w szablonach mail/sms.
</h2>
<p style="font-family:'Arial', Helvetica, sans-serif; font-size:13px; color:#2e2e2e; margin:0 0 10px 0;">
  <strong>&#10060; Nie piszemy na sztywno danych firmy, do tego służą tagi</strong>
</p>

    <!-- Pierwszy arkusz -->
    <table style="width:600px; border-collapse:collapse; border:none; border-radius:4px; overflow:hidden; table-layout: fixed;">
      <colgroup>
        <col style="width:45%;">
        <col style="width:55%;">
      </colgroup>
      <thead>
        <tr style="background:#e8f4ff;">
          <th colspan="2" style="text-align:left; font-family:'Arial', Helvetica, sans-serif; font-size:16px; border-bottom:1px solid #3498db;">&#128196; Pierwszy arkusz: <strong>Własne naruszenia</strong></th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="white-space: nowrap; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:600;">&#128309; nazwa firmy</td><td style="word-break: break-word;"><code>[KRUK.nazwa]</code></td></tr>
        <tr><td style="white-space: nowrap; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:600;">&#127970; ulica siedziby</td><td style="word-break: break-word;"><code>[KRUK.siedziba.ulica]</code></td></tr>
        <tr><td style="white-space: nowrap; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:600;">&#128238; kod pocztowy siedziby</td><td style="word-break: break-word;"><code>[KRUK.siedziba.kod]</code></td></tr>
        <tr><td style="white-space: nowrap; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:600;">&#128238; miasto siedziby</td><td style="word-break: break-word;"><code>[KRUK.siedziba.miasto]</code></td></tr>
      </tbody>
    </table>

    <!-- Drugi arkusz -->
	<br><br>
    <table style="width:600px; border-collapse:collapse; border:none; border-radius:4px; overflow:hidden; table-layout: fixed;" background-color:#ffecec;">
      <colgroup>
        <col style="width:50%;">
        <col style="width:50%;">
      </colgroup>
      <thead>
        <tr style="background:#ffecec;">
          <th colspan="2" style="text-align:left; font-family:'Arial', Helvetica, sans-serif; font-size:16px; border-bottom:1px solid #e74c3c;">&#128196; Drugi arkusz: <strong>INKASO naruszenia</strong></th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="white-space: nowrap; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:600;">&#128309; nazwa firmy</td><td style="word-break: break-word;"><code>[KRUK.nazwa]</code></td></tr>
        <tr><td style="white-space: nowrap; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:600;">&#128236; adres korespondencyjny ulica</td><td style="word-break: break-word;"><code>[KRUK.Inkaso.adres.ulica]</code></td></tr>
        <tr><td style="white-space: nowrap; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:600;">&#128236; adres korespondencyjny kod i miasto</td><td style="word-break: break-word;"><code>[KRUK.Inkaso.adres.kod.miasto]</code></td></tr>
      </tbody>
    </table>

    <!-- Do weryfikacji -->
	<br><br>
    <table style="width:600px; border-collapse:collapse; border:none; border-radius:4px; overflow:hidden; table-layout: fixed;">
      <colgroup>
        <col style="width:50%;">
        <col style="width:50%;">
      </colgroup>
      <thead>
        <tr style="background:#fdfcf3;">
          <th colspan="2" style="text-align:left; font-family:'Arial', Helvetica, sans-serif; font-size:16px; border-bottom:1px solid #f39c12;">&#128270; Do weryfikacji</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="2" style="white-space: nowrap; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:600;">&#10067; czy nie ma starego adresu: Wołowska 8</td>
        </tr>
        <tr>
          <td colspan="2" style="white-space: nowrap; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:600;">&#10071; nie pisz na sztywno Bolkowska 3 / Legnicka 48 C-D : należy użyć tagów</td>
        </tr>
      </tbody>
    </table>

  </div>
</div>`;

static dzien2: string = `<div style="font-family: 'Lato', sans-serif; font-size: 16px; color: #2e2e2e; background-color: #f4f6f9; padding: 30px; line-height: 1.6;">
  <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 20px; border: 1px solid #d0d0d0;">

    <h2 style="font-size: 20px; color: #34495e; margin-bottom: 16px;">
      &#128206; Aktualizacja linków Google Fonts i języka w mailach
    </h2>

    <p style="margin-bottom: 16px;">
      W Excelu znajduje się lista szablonów maili (tylko własne), które zawierają <strong>stary link do czcionki Lato</strong> lub ustawienie <code>lang="en"</code>.
      Aby poprawnie wyświetlały się polskie znaki oraz używana była aktualna czcionka, należy zastosować poniższe zmiany w kodzie maili.
    </p>

    <pre style="background-color:#f5f5dc; border-radius:6px; padding:15px; font-family:'Fira Code', monospace; color:#1e3a8a; font-size:14px; white-space: pre-wrap; line-height:1.5; overflow-x:auto;">
&lt;link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&amp;subset=latin-ext&amp;display=swap" rel="stylesheet"&gt;
&lt;html lang="pl"&gt;
    </pre>

    <div style="margin-top:10px; color: #34495e; font-size: 14px; line-height:1.5;">
      <strong>Wyjaśnienie:</strong>
      <ul style="padding-left: 18px; margin-top: 6px;">
        <li>
          <code>&lt;link href="https://fonts.googleapis.com/css2?family=Lato:..." rel="stylesheet"&gt;</code> – aktualizuje czcionkę <strong>Lato</strong> w wagach 400 (normal) i 700 (bold) z polskimi znakami (<code>latin-ext</code>). <strong>display=swap</strong> sprawia, że tekst wyświetla się natychmiast, nawet podczas ładowania czcionki.
        </li>
        <li>
          <code>&lt;html lang="pl"&gt;</code> – ustawia język dokumentu na polski, co poprawia wyświetlanie polskich znaków oraz dostępność.
        </li>
      </ul>
      <p style="margin-top:6px;">
        Dzięki temu Twój mail będzie wyświetlał się poprawnie w większości klientów pocztowych, a polskie znaki nie będą „rozjeżdżać się”.
      </p>
    </div>

    <p style="margin-top: 16px; color: red; font-size: 14px;">
      &#9888; Nieużycie powyższych zmian może spowodować <strong>niepoprawne wyświetlanie polskich znaków</strong> lub użycie przestarzałej czcionki.
    </p>

  </div>
</div>`;



  static dzien3: string = `<div style="font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 16px; color: #2e2e2e; background-color: #f4f6f9; padding: 40px; line-height: 1.6;">
  <div style="max-width: 750px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 30px;">

    <h2 style="font-size: 20px; color: #34495e; margin-bottom: 20px;">
      &#128206; W załączniku znajduje się plik Excel zawierający <strong>dwa arkusze</strong> dotyczące użycia niedozwolonych znaków w szablonach SMS.
    </h2>

    <p style="font-weight: bold; margin-bottom: 16px;">&#10060; Unikaj użycia następujących znaków:</p>

    <div style="overflow-x: auto;">
<table style="width:600px; border-collapse:collapse; border:none; border-radius:4px; overflow:hidden; table-layout: fixed;" background-color: #fefefe;">
      <colgroup>
        <col style="width:20%;">
        <col style="width:80%;">
      </colgroup>
       <thead>
  <tr style="background-color: #ecf5ff;">
    <th style="padding: 12px 16px; border-radius: 8px 0 0 8px; font-weight: 600; color: #2c3e50; text-align: left;">Znak</th>
    <th style="padding: 12px 16px; border-radius: 0 8px 8px 0; font-weight: 600; color: #2c3e50; text-align: left;">Opis</th>
  </tr>
</thead>

        <tbody>
          <tr style="background-color: #ffffff; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
            <td style="padding: 12px 16px; border-radius: 8px 0 0 8px;">&#8222;</td>
            <td style="padding: 12px 16px; border-radius: 0 8px 8px 0;">dolny cudzysłów</td>
          </tr>
          <tr style="background-color: #ffffff; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
            <td style="padding: 12px 16px; border-radius: 8px 0 0 8px;">&#8212;</td>
            <td style="padding: 12px 16px; border-radius: 0 8px 8px 0;">długi myślnik (em dash)</td>
          </tr>
        </tbody>
      </table>
    </div>

<p style="margin-top: 30px; color: red;">
  Powyższe znaki psują wysyłkę SMS, prosimy o stosowanie górnego cudzysłowu (<code>"</code>) czy minusa (<code>-</code>).
</p>
    </p>

  </div>
</div>`;


}
