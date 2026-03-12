# Hou Ze Binnen — Netlify-ready site met CMS

Dit pakket is gemaakt om op **Netlify** te draaien.

## De 2 routes

### Route A — Snel live, zonder CMS
1. Pak het zipbestand uit.
2. Open de map `dist` na het bouwen, of run lokaal eerst `npm install` en daarna `npm run build`.
3. Ga naar Netlify Drop en sleep de map `dist` erin.
4. Je site staat live.

Nadeel:
- je kunt dan **niet** makkelijk teksten bewerken via `/admin/`.

### Route B — Aanbevolen: live + makkelijk zelf bewerken via CMS
1. Maak een GitHub-account aan.
2. Maak een nieuwe repository aan, bijvoorbeeld `hou-ze-binnen-site`.
3. Upload **alle bestanden uit deze map** naar die repository.
4. Log in bij Netlify.
5. Kies **Add new project** en verbind je GitHub-repository.
6. Netlify leest `netlify.toml` automatisch uit. Normaal hoef je build command en publish folder dus niet meer zelf in te vullen.
7. Laat de site deployen.

## CMS aanzetten in Netlify
Na de eerste deploy:

1. Open je site in Netlify.
2. Ga naar **Project configuration → Identity** en zet **Identity** aan.
3. Ga daarna naar **Project configuration → Identity → Services → Git Gateway** en zet **Git Gateway** aan.
4. Ga naar **Identity → Invite users** en nodig je eigen e-mailadres uit.
5. Open daarna jouw site op `/admin/`
   Bijvoorbeeld:
   `https://jouwdomein.nl/admin/`
6. Accepteer de uitnodiging uit je mail en log in.

Vanaf dan kun je:
- teksten aanpassen
- prijzen wijzigen
- FAQ’s wijzigen
- foto's uploaden
- logo’s vervangen
- proof-snippers toevoegen

## Waar pas je wat aan in de CMS?
- **Site** = merknaam, CTA, mailadres, adres, logo/foto’s
- **Hero** = hoofdkop en intro bovenaan
- **Bewijsstrook** = de cijfers direct onder de hero
- **Herken je dit** = pijnpunten
- **Praktische info** = datum, locatie en prijzen
- **Reserveer pagina** = formulierteksten
- **FAQ** = veelgestelde vragen

## Formulieren
De reserveerpagina gebruikt **Netlify Forms**.

Na deploy:
1. Ga in Netlify naar **Forms**
2. Zet **form detection** aan
3. Nieuwe aanmeldingen zie je daarna in Netlify terug

## Foto's en logo's vervangen
1. Log in op `/admin/`
2. Kies **Site inhoud**
3. Upload je bestanden bij:
   - Hero afbeelding
   - Verhaal afbeelding
   - Over Samir afbeelding
4. Publiceer / save

## Belangrijk
- De CMS werkt alleen goed als je site via **GitHub → Netlify** is gekoppeld.
- Sleep je alleen een losse map naar Netlify Drop, dan heb je geen echte CMS-workflow.

## Lokaal testen
Als je iemand hebt die even kan helpen:
```bash
npm install
npm run build
```

Daarna staat de gebouwde site in `dist`.
