
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";
import { join } from "node:path";

const data = JSON.parse(readFileSync("content/site.json", "utf8"));
const distDir = "dist";

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

copyIfExists("public", distDir);
copyIfExists("assets", join(distDir, "assets"));
mkdirSync(join(distDir, "assets"), { recursive: true });
cpSync("src/styles.css", join(distDir, "assets/styles.css"));
cpSync("src/app.js", join(distDir, "assets/app.js"));

writeFileSync(join(distDir, "index.html"), buildHomePage(), "utf8");
mkdirSync(join(distDir, "reserveer"), { recursive: true });
writeFileSync(join(distDir, "reserveer/index.html"), buildReserveerPage(), "utf8");
mkdirSync(join(distDir, "bedankt"), { recursive: true });
writeFileSync(join(distDir, "bedankt/index.html"), buildBedanktPage(), "utf8");
writeFileSync(join(distDir, "sitemap.xml"), buildSitemap(), "utf8");

function copyIfExists(from, to) {
  if (existsSync(from)) cpSync(from, to, { recursive: true });
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderTextBlocks(items = [], className = "stack") {
  return items
    .map((item) => `<p class="${className}__item">${escapeHtml(item)}</p>`)
    .join("");
}

function renderParagraphs(items = [], extraClass = "") {
  return items
    .map((item) => `<p class="body-copy${extraClass ? ` ${extraClass}` : ""}">${escapeHtml(item)}</p>`)
    .join("");
}

function renderList(items = [], className = "bullet-list") {
  return `<ul class="${className}">${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function renderCueList(items = []) {
  return `<div class="pain-list">${items
    .map(
      (item) => `<article class="pain-item"><span class="pain-item__cue">${escapeHtml(
        item.cue
      )}</span><p class="pain-item__text">${escapeHtml(item.text)}</p></article>`
    )
    .join("")}</div>`;
}

function renderTimeline(items = []) {
  return `<div class="timeline">${items
    .map(
      (item, index) =>
        `<div class="timeline__step"><span class="timeline__dot">${index + 1}</span><span class="timeline__label">${escapeHtml(
          item
        )}</span></div>`
    )
    .join("")}</div>`;
}

function renderCards(cards = []) {
  return `<div class="formula-cards">${cards
    .map(
      (card) => `<article class="formula-card">
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.body)}</p>
      </article>`
    )
    .join("")}</div>`;
}

function renderKnobs(items = []) {
  return `<div class="knob-grid">${items
    .map((item) => `<div class="knob-chip">${escapeHtml(item)}</div>`)
    .join("")}</div>`;
}

function renderProofBlocks(items = []) {
  return `<div class="proof-grid">${items
    .map(
      (item) => `<article class="proof-card">
        <p class="proof-card__label">${escapeHtml(item.label)}</p>
        <p class="proof-card__value">${escapeHtml(item.value)}</p>
      </article>`
    )
    .join("")}</div>`;
}

function renderSnippets(snippets = []) {
  if (!snippets.length) return "";
  return `<div class="snippet-grid">${snippets
    .map(
      (item) => `<figure class="snippet-card">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.label || "")}" loading="lazy" />
        ${item.label ? `<figcaption>${escapeHtml(item.label)}</figcaption>` : ""}
      </figure>`
    )
    .join("")}</div>`;
}

function renderFAQ(items = []) {
  return `<div class="faq-list">${items
    .map(
      (item, index) => `<details class="faq-item"${index === 0 ? " open" : ""}>
        <summary>${escapeHtml(item.question)}</summary>
        <div class="faq-item__body"><p>${escapeHtml(item.answer)}</p></div>
      </details>`
    )
    .join("")}</div>`;
}

function renderNav(isHome = false) {
  const links = data.navigation.filter((item) => !item.isButton);
  const button = data.navigation.find((item) => item.isButton);
  return `<header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/">
        ${
          data.site.logoImage
            ? `<img class="brand__logo" src="${escapeHtml(data.site.logoImage)}" alt="${escapeHtml(
                data.site.brandName
              )}" />`
            : `<span class="brand__wordmark">${escapeHtml(data.site.brandName)}</span>`
        }
        <span class="brand__tagline">${escapeHtml(data.site.tagline)}</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu openen">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Hoofdmenu">
        <ul>
          ${links
            .map((item) => { const href = item.href.startsWith("#") && !isHome ? `/${item.href}` : item.href; return `<li><a href="${escapeHtml(href)}">${escapeHtml(item.label)}</a></li>`; })
            .join("")}
        </ul>
        ${
          button
            ? `<a class="button button--header" href="${escapeHtml(button.href)}">${escapeHtml(button.label)}</a>`
            : ""
        }
      </nav>
    </div>
  </header>`;
}

function renderHeroVisual() {
  if (data.site.heroImage) {
    return `<div class="hero-visual hero-visual--image">
      <img src="${escapeHtml(data.site.heroImage)}" alt="${escapeHtml(
        data.site.heroImageAlt || data.site.brandName
      )}" />
      <div class="hero-visual__badge-stack">
        ${data.proofBar.items
          .slice(0, 3)
          .map((item) => `<span class="hero-badge">${escapeHtml(item)}</span>`)
          .join("")}
      </div>
    </div>`;
  }

  return `<div class="hero-visual hero-visual--stats" aria-hidden="true">
    <div class="hero-stat hero-stat--large">
      <span class="hero-stat__eyebrow">${escapeHtml(data.site.masterclassName)}</span>
      <strong class="hero-stat__value">Lekdicht</strong>
      <span class="hero-stat__text">Van dweilen naar grip.</span>
    </div>
    <div class="hero-stat-grid">
      ${data.proofBar.items
        .slice(0, 4)
        .map(
          (item) => `<div class="hero-stat hero-stat--small"><span class="hero-stat__mini">${escapeHtml(
            item
          )}</span></div>`
        )
        .join("")}
    </div>
  </div>`;
}

function renderStoryVisual() {
  if (data.site.storyImage) {
    return `<figure class="story-visual">
      <img src="${escapeHtml(data.site.storyImage)}" alt="${escapeHtml(
        data.site.storyImageAlt || data.site.brandName
      )}" loading="lazy" />
    </figure>`;
  }
  return `<div class="story-visual story-visual--timeline">
      <div class="story-visual__eyebrow">Van chaos naar grip</div>
      ${renderTimeline(data.story.timeline)}
    </div>`;
}

function renderAboutVisual() {
  if (data.site.aboutImage) {
    return `<figure class="about-visual">
      <img src="${escapeHtml(data.site.aboutImage)}" alt="${escapeHtml(
        data.site.aboutImageAlt || data.site.brandName
      )}" loading="lazy" />
    </figure>`;
  }
  return `<div class="about-visual about-visual--text">
      <div class="about-visual__card">
        <span class="about-visual__eyebrow">Wat je krijgt</span>
        <h3>Geen theater. Wel een mening.</h3>
        ${renderList(data.about.expectations, "bullet-list bullet-list--tight")}
      </div>
    </div>`;
}

function renderAudienceSectorChips(items = []) {
  return `<div class="sector-chips">${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
}

function renderPriceCard() {
  const highlight = data.practical.prices.find((item) => item.highlight);
  const rest = data.practical.prices.filter((item) => !item.highlight);
  return `<div class="price-card">
      <div class="price-card__badge">Eerste groep</div>
      <p class="price-card__label">${escapeHtml(highlight?.label || "")}</p>
      <p class="price-card__price">${escapeHtml(highlight?.value || "")}</p>
      <ul class="price-card__meta">
        ${data.practical.details.map((item) => `<li><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></li>`).join("")}
      </ul>
      <div class="price-card__secondary">
        ${rest.map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join("")}
      </div>
      <a class="button button--full" href="${escapeHtml(data.site.ctaPath)}">${escapeHtml(data.site.ctaLabel)}</a>
      <p class="price-card__microcopy">${escapeHtml(data.practical.microcopy)}</p>
    </div>`;
}

function renderFooter() {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <p class="footer-brand">${escapeHtml(data.site.brandName)}</p>
        <p class="footer-tagline">${escapeHtml(data.site.tagline)}</p>
        <p class="footer-note">${escapeHtml(data.site.footerNote)}</p>
      </div>
      <div class="footer-meta">
        <p><strong>KVK:</strong> ${escapeHtml(data.site.kvk)}</p>
        <p><strong>E-mail:</strong> <a href="mailto:${escapeHtml(data.site.primaryEmail)}">${escapeHtml(data.site.primaryEmail)}</a></p>
        <p><strong>Adres:</strong> ${escapeHtml(data.site.addressLine)}</p>
        <p><strong>Postcode:</strong> ${escapeHtml(data.site.postalCode)}</p>
        <p><strong>Plaats:</strong> ${escapeHtml(data.site.city)}</p>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>© ${year} ${escapeHtml(data.site.brandName)}</p>
      </div>
    </div>
  </footer>`;
}

function structuredDataHome() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faq.items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": data.site.brandName,
    "url": data.site.siteUrl
  };
  return `<script type="application/ld+json">${JSON.stringify(website)}</script>
<script type="application/ld+json">${JSON.stringify(faq)}</script>`;
}

function pageTemplate({
  title,
  description,
  canonicalPath,
  mainClass = "",
  bodyContent,
  pageType = "website",
  noIndex = false,
  extraHead = "",
  showSticky = true,
  isHome = false
}) {
  const canonical = `${data.site.siteUrl.replace(/\/$/, "")}${canonicalPath}`;
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="#7d1635" />
  <meta property="og:type" content="${escapeHtml(pageType)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:image" content="${escapeHtml(data.site.siteUrl.replace(/\/$/, "") + data.site.ogImage)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(data.site.siteUrl.replace(/\/$/, "") + data.site.ogImage)}" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <link rel="icon" href="${escapeHtml(data.site.faviconPath)}" type="image/svg+xml" />
  <link rel="preload" href="/assets/styles.css" as="style" />
  <link rel="stylesheet" href="/assets/styles.css" />
  ${noIndex ? '<meta name="robots" content="noindex,nofollow" />' : ""}
  ${extraHead}
</head>
<body>
  <a class="skip-link" href="#main">Direct naar inhoud</a>
  ${renderNav(isHome)}
  <main id="main" class="${escapeHtml(mainClass)}">
    ${bodyContent}
  </main>
  ${renderFooter()}
  ${showSticky ? `<a class="sticky-cta" href="${escapeHtml(data.site.ctaPath)}">${escapeHtml(data.site.ctaLabel)}</a>` : ""}
  <script src="/assets/app.js" defer></script>
</body>
</html>`;
}

function buildHomePage() {
  const body = `
  <section class="hero" id="masterclass">
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="section-kicker">${escapeHtml(data.hero.kicker)}</p>
        <h1>${escapeHtml(data.hero.title)}</h1>
        ${renderParagraphs(data.hero.paragraphs)}
        <p class="hero-proof">${escapeHtml(data.hero.proof)}</p>
        <div class="hero-cta-group">
          <a class="button button--primary" href="${escapeHtml(data.site.ctaPath)}">${escapeHtml(data.site.ctaLabel)}</a>
          <p class="microcopy">${escapeHtml(data.hero.microcopy)}</p>
        </div>
      </div>
      ${renderHeroVisual()}
    </div>
  </section>

  <section class="proof-bar">
    <div class="container">
      <p class="proof-bar__label">${escapeHtml(data.proofBar.label)}</p>
      <div class="proof-bar__items">${data.proofBar.items
        .map((item) => `<span>${escapeHtml(item)}</span>`)
        .join("")}</div>
    </div>
  </section>

  <section class="section section--pain">
    <div class="container narrow">
      <h2>${escapeHtml(data.pain.title)}</h2>
      ${renderCueList(data.pain.items)}
      <p class="section-closing">${escapeHtml(data.pain.closing)}</p>
    </div>
  </section>

  <section class="section section--story">
    <div class="container story-grid">
      <div class="story-copy">
        <h2>${escapeHtml(data.story.title)}</h2>
        ${renderParagraphs(data.story.paragraphs)}
        <blockquote class="pull-quote">${escapeHtml(data.story.pullQuote)}</blockquote>
      </div>
      ${renderStoryVisual()}
    </div>
  </section>

  <section class="section section--turning-point">
    <div class="container narrow">
      <h2>${escapeHtml(data.turningPoint.title)}</h2>
      ${renderParagraphs(data.turningPoint.paragraphs)}
      ${renderList(data.turningPoint.factors, "bullet-list bullet-list--split")}
      <p class="body-copy">${escapeHtml(data.turningPoint.outcomesIntro)}</p>
      ${renderList(data.turningPoint.outcomes, "bullet-list")}
    </div>
  </section>

  <section class="section section--formula">
    <div class="container">
      <div class="section-heading">
        <h2>${escapeHtml(data.formula.title)}</h2>
        <p class="body-copy">${escapeHtml(data.formula.intro)}</p>
      </div>
      ${renderCards(data.formula.cards)}
      <div class="knob-section">
        <p class="body-copy">${escapeHtml(data.formula.knobIntro)}</p>
        ${renderKnobs(data.formula.knobs)}
      </div>
      <p class="section-closing">${escapeHtml(data.formula.closing)}</p>
    </div>
  </section>

  <section class="section section--dark section--savings">
    <div class="container narrow">
      <h2>${escapeHtml(data.savings.title)}</h2>
      ${renderList(data.savings.items, "bullet-list bullet-list--accent")}
      <p class="section-closing section-closing--light">${escapeHtml(data.savings.closing)}</p>
    </div>
  </section>

  <section class="section section--agenda">
    <div class="container agenda-grid">
      <div>
        <h2>${escapeHtml(data.agenda.title)}</h2>
        <p class="body-copy">${escapeHtml(data.agenda.closing)}</p>
      </div>
      <div>
        ${renderList(data.agenda.items, "bullet-list bullet-list--boxed")}
      </div>
    </div>
  </section>

  <section class="section section--lens">
    <div class="container two-col">
      <div>
        <h2>${escapeHtml(data.lens.title)}</h2>
        <h3 class="subhead">Na deze dag kijk je anders naar:</h3>
        ${renderList(data.lens.seeDifferently, "bullet-list")}
      </div>
      <div>
        <h3 class="subhead">En je gaat naar huis met:</h3>
        ${renderList(data.lens.takeHome, "bullet-list")}
      </div>
    </div>
  </section>

  <section class="section section--proof">
    <div class="container">
      <div class="section-heading">
        <h2>${escapeHtml(data.proof.title)}</h2>
        ${renderParagraphs(data.proof.intro)}
      </div>
      ${renderList(data.proof.beliefs, "belief-list")}
      <p class="body-copy">${escapeHtml(data.proof.bridge)}</p>
      ${renderProofBlocks(data.proof.proofBlocks)}
      ${renderSnippets(data.proof.snippetImages)}
      <p class="section-closing">${escapeHtml(data.proof.closing)}</p>
    </div>
  </section>

  <section class="section section--audience" id="voor-wie">
    <div class="container two-col">
      <div class="audience-card">
        <h2>${escapeHtml(data.audience.title)}</h2>
        <p class="body-copy">${escapeHtml(data.audience.intro)}</p>
        ${renderList(data.audience.fitItems, "bullet-list")}
        ${renderAudienceSectorChips(data.audience.sectors)}
        <p class="audience-closing">${escapeHtml(data.audience.closing)}</p>
      </div>
      <div class="audience-card audience-card--not">
        <h2>${escapeHtml(data.notFor.title)}</h2>
        ${renderList(data.notFor.items, "bullet-list")}
      </div>
    </div>
  </section>

  <section class="section section--pricing" id="praktische-info">
    <div class="container pricing-grid">
      <div class="pricing-copy">
        <h2>${escapeHtml(data.practical.title)}</h2>
        ${renderParagraphs(data.practical.copy)}
      </div>
      ${renderPriceCard()}
    </div>
  </section>

  <section class="section section--about" id="over-samir">
    <div class="container about-grid">
      <div class="about-copy">
        <h2>${escapeHtml(data.about.title)}</h2>
        <p class="body-copy">${escapeHtml(data.about.intro)}</p>
        ${renderParagraphs(data.about.paragraphs)}
        <div class="two-col">
          <div>
            <h3 class="subhead">${escapeHtml(data.about.beliefsTitle)}</h3>
            ${renderList(data.about.beliefs, "bullet-list")}
          </div>
          <div>
            <h3 class="subhead">${escapeHtml(data.about.expectationsTitle)}</h3>
            ${renderList(data.about.expectations, "bullet-list")}
          </div>
        </div>
        <a class="button button--secondary" href="${escapeHtml(data.site.ctaPath)}">${escapeHtml(data.site.ctaLabel)}</a>
      </div>
      ${renderAboutVisual()}
    </div>
  </section>

  <section class="section section--faq">
    <div class="container narrow">
      <h2>${escapeHtml(data.faq.title)}</h2>
      ${renderFAQ(data.faq.items)}
    </div>
  </section>

  <section class="section section--final-cta">
    <div class="container narrow">
      <h2>${escapeHtml(data.finalCta.title)}</h2>
      ${renderParagraphs(data.finalCta.paragraphs)}
      <a class="button button--primary" href="${escapeHtml(data.site.ctaPath)}">${escapeHtml(data.site.ctaLabel)}</a>
      <p class="microcopy">${escapeHtml(data.finalCta.microcopy)}</p>
    </div>
  </section>`;
  return pageTemplate({
    title: data.site.siteTitle,
    description: data.site.metaDescription,
    canonicalPath: "/",
    bodyContent: body,
    extraHead: structuredDataHome(),
    showSticky: true,
    isHome: true
  });
}

function buildReserveerPage() {
  const fields = data.formPage.fields
    .map((field) => {
      const required = field.required ? " required" : "";
      const inputId = `field-${field.name}`;
      if (field.type === "textarea") {
        return `<div class="form-field">
          <label for="${escapeHtml(inputId)}">${escapeHtml(field.label)}</label>
          <textarea id="${escapeHtml(inputId)}" name="${escapeHtml(field.name)}" rows="5"${required}></textarea>
        </div>`;
      }
      return `<div class="form-field">
        <label for="${escapeHtml(inputId)}">${escapeHtml(field.label)}</label>
        <input id="${escapeHtml(inputId)}" type="${escapeHtml(field.type)}" name="${escapeHtml(field.name)}"${required} />
      </div>`;
    })
    .join("");
  const body = `
  <section class="form-hero">
    <div class="container narrow">
      <p class="section-kicker">${escapeHtml(data.site.masterclassName)}</p>
      <h1>${escapeHtml(data.formPage.title)}</h1>
      ${renderParagraphs(data.formPage.intro)}
    </div>
  </section>

  <section class="section section--form">
    <div class="container form-grid">
      <div class="form-card">
        <form name="masterclass-aanmelding" method="POST" action="/bedankt/" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="masterclass-aanmelding" />
          <p class="hidden-field">
            <label>Laat dit veld leeg: <input name="bot-field" /></label>
          </p>
          ${fields}
          <div class="form-field form-field--checkbox">
            <label class="checkbox-label">
              <input type="checkbox" name="updates" value="ja" />
              <span>${escapeHtml(data.formPage.checkboxLabel)}</span>
            </label>
          </div>
          <button class="button button--primary button--full" type="submit">${escapeHtml(data.formPage.buttonLabel)}</button>
          <p class="microcopy">${escapeHtml(data.formPage.microcopy)}</p>
        </form>
      </div>
      <aside class="form-side-card">
        <h2>${escapeHtml(data.practical.title)}</h2>
        <ul class="price-card__meta">
          ${data.practical.details.map((item) => `<li><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></li>`).join("")}
        </ul>
        <div class="price-card__secondary">
          ${data.practical.prices.map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join("")}
        </div>
        <p class="microcopy">${escapeHtml(data.practical.microcopy)}</p>
      </aside>
    </div>
  </section>`;
  return pageTemplate({
    title: `${data.formPage.title} | ${data.site.brandName}`,
    description: data.site.metaDescription,
    canonicalPath: "/reserveer/",
    bodyContent: body,
    showSticky: false,
    isHome: false
  });
}

function buildBedanktPage() {
  const body = `
  <section class="thank-you">
    <div class="container narrow thank-you-card">
      <p class="section-kicker">${escapeHtml(data.site.brandName)}</p>
      <h1>${escapeHtml(data.thankYouPage.title)}</h1>
      ${renderParagraphs(data.thankYouPage.paragraphs)}
      <a class="button button--primary" href="/">${escapeHtml(data.thankYouPage.buttonLabel)}</a>
    </div>
  </section>`;
  return pageTemplate({
    title: `${data.thankYouPage.title} | ${data.site.brandName}`,
    description: data.site.metaDescription,
    canonicalPath: "/bedankt/",
    bodyContent: body,
    noIndex: true,
    showSticky: false,
    isHome: false
  });
}

function buildSitemap() {
  const urls = ["/", "/reserveer/"];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${escapeHtml(data.site.siteUrl.replace(/\/$/, "") + path)}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;
}
