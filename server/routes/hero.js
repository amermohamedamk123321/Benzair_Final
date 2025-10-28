import { Router } from "express";
import { randomUUID } from "crypto";
import storage from "../storage.js";
import { saveImageUpload } from "../uploads-handler.js";

const router = Router();

const defaultSlideUrls = [
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F7cef4eecf9b946548d39691b0297da24?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F22a88ae9eb42463b94adf1d5fb5b181a?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F2404c03e5db14d62b21f414d1cab7477?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Faa6f78dc41404377a433acf90bce1cd4?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F8119f13e81b147ad8564a9440170aef4?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fce396255f7154c3e8c00f1eceed3dada?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2F93f25b5bc43d489e865a9019e2865136?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F13a4766942d54028b94747b6985a55d1%2Fdbe6e39c9dab457b9f348d9067a8bdd7?format=webp&width=800"
];

const defaultTexts = {
  en: {
    title: "Benazir Yakta Trading Company  .  Active since 2017",
    lead: "We are here to enhance global access to high-quality Afghan agricultural products while supporting women’s economic empowerment and promoting ethical, sustainable business practices.",
    values: "We believe in Quality Excellence, Sustainability, Women’s Empowerment, and Fair Trade.",
    services: "Services: Processing, packaging, and exporting premium dried fruits, nuts and spices; farmer training; creating jobs and empowering women; export partnerships in the UK, Switzerland, France, Dubai and India."
  },
  fa: {
    title: "شرکت بنظر یکتا بازرگانی  .  فعال از سال ۲۰۱۷",
    lead: "ما برای افزایش دسترسی جهانی به محصولات کشاورزی با‌کیفیت افغانستان ت��اش می‌کنیم و در عین حال از توانمندسازی اقتصادی زنان و ترویج شیوه‌های اخلاقی و پایدار حمایت می‌کنیم.",
    values: "ما به برتری کیفیت، پایداری، توانمندسازی زنان و تجارت عادلانه باور داریم.",
    services: "خدمات: فرآوری، بسته‌بندی و صادرات میوه‌های خشک، خشکبار و ادویه‌جات ممتاز؛ آموزش کشاورزان؛ ایجاد اشتغال و توانمندسازی زنان؛ همکاری‌های صادراتی در بریتانیا، سوئیس، فرانسه، دبی و هند."
  }
};

const createSlide = (url) => ({ id: randomUUID(), url: String(url || "").trim() });

// Load persisted hero state from disk (fallback to defaults)
let heroState = storage.load('hero', {
  slides: defaultSlideUrls.map(createSlide),
  texts: { ...defaultTexts }
});

// Ensure slides are sanitized on startup
heroState.slides = sanitizeSlides(heroState.slides);
heroState.texts = sanitizeTexts(heroState.texts);

function sanitizeSlides(slides) {
  if (!Array.isArray(slides)) return [];
  const cleaned = slides
    .map((slide) => {
      if (!slide || typeof slide !== "object") return null;
      const url = typeof slide.url === "string" ? slide.url.trim() : "";
      if (!url) return null;
      const id = typeof slide.id === "string" && slide.id.trim().length > 0 ? slide.id.trim() : randomUUID();
      return { id, url };
    })
    .filter(Boolean)
    .slice(0, 20);
  // Return cleaned array even if empty — allow admin to clear all slides
  return cleaned;
}

function sanitizeTexts(texts) {
  if (!texts || typeof texts !== "object") return heroState.texts;
  const result = { ...heroState.texts };
  for (const lang of Object.keys(defaultTexts)) {
    const incoming = texts[lang];
    if (!incoming || typeof incoming !== "object") continue;
    result[lang] = {
      title: typeof incoming.title === "string" ? incoming.title : result[lang].title,
      lead: typeof incoming.lead === "string" ? incoming.lead : result[lang].lead,
      values: typeof incoming.values === "string" ? incoming.values : result[lang].values,
      services: typeof incoming.services === "string" ? incoming.services : result[lang].services
    };
  }
  return result;
}

router.get("/", (_req, res) => {
  res.json(heroState);
});

router.put("/", (req, res) => {
  const { slides, texts } = req.body || {};
  if (slides !== undefined) {
    heroState.slides = sanitizeSlides(slides);
  }
  if (texts !== undefined) {
    heroState.texts = sanitizeTexts(texts);
  }
  // persist
  storage.save('hero', heroState);
  res.json(heroState);
});

router.post("/slides", (req, res) => {
  let { url } = req.body || {};
  if (typeof url !== "string" || !url.trim()) {
    return res.status(400).json({ error: "url is required" });
  }
  url = url.trim();
  // If client sent a data URL, save it to server uploads and use the file path
  if (url.startsWith('data:image/')) {
    const saved = saveDataUrlToUploads(url);
    if (saved) url = saved;
  }
  const slide = createSlide(url);
  heroState.slides.push(slide);
  storage.save('hero', heroState);
  res.status(201).json(slide);
});

router.delete("/slides/:id", (req, res) => {
  const { id } = req.params;
  const before = heroState.slides.length;
  heroState.slides = heroState.slides.filter((slide) => slide.id !== id);
  if (before === heroState.slides.length) {
    return res.status(404).json({ error: "Slide not found" });
  }
  storage.save('hero', heroState);
  res.status(204).send();
});

router.put("/texts/:lang", (req, res) => {
  const { lang } = req.params;
  if (!(lang in defaultTexts)) {
    return res.status(400).json({ error: "Unsupported language" });
  }
  const { title, lead, values, services } = req.body || {};
  heroState.texts[lang] = {
    title: typeof title === "string" ? title : heroState.texts[lang].title,
    lead: typeof lead === "string" ? lead : heroState.texts[lang].lead,
    values: typeof values === "string" ? values : heroState.texts[lang].values,
    services: typeof services === "string" ? services : heroState.texts[lang].services
  };
  res.json(heroState.texts[lang]);
});

export const heroStore = heroState;
export default router;
