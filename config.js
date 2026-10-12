/* =====================================================================
   BRAIDS & MORE BEAUTY SALON — SITE SETTINGS
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to change:
     • salon name & tagline
     • WhatsApp number, phone number
     • location / map / opening hours / social links
     • EVERY picture on the website
     • hairstyle menu, lengths and sizes

   HOW TO CHANGE A PICTURE
     Option 1: replace the file inside the "images" folder, keeping the
               same file name (e.g. images/hero.jpg).
     Option 2: change the path below, e.g.  hero: "images/my-photo.jpg"
     Option 3: use a full web link, e.g.    hero: "https://example.com/photo.jpg"
   If a picture cannot load, the website shows a soft pink fallback
   instead of a broken image.
   ===================================================================== */

/* ---------- 1. WHATSAPP NUMBER (required for booking) ----------------
   International format, digits only, NO plus sign, NO spaces.
   Tanzania example: 255712345678
   Until you change it, the booking form will tell the visitor that
   WhatsApp is not set up yet instead of opening a broken link.        */
const WHATSAPP_NUMBER = "255764913509";

/* ---------- 2. EVERYTHING ELSE --------------------------------------- */
window.SALON_CONFIG = {

  /* --- Salon identity --- */
  name: "AGUSTA SALOON",
  shortName: "GUSTRA",
  tagline: "Beauty Salon",
  taglineSw: "Saluni ya Urembo",        // shown when the visitor picks Swahili (optional)

  /* --- Contact details --- */
  contact: {
    phone: "+255 761 445 201",          // shown on the page AND used for click-to-call
    email: "",                          // optional, leave "" to hide

    /* Physical location (shown in the footer). */
    locationLines: [
      "Mwenge",
      "Dar-es-salaam, Tanzania"
    ],
    /* Opening hours — edit freely (sample values, please replace).
       daySw / timeSw are the Swahili versions (optional). */
    hours: [
      { day: "Monday – Saturday", daySw: "Jumatatu – Jumamosi", time: "8:00 AM – 7:00 PM", timeSw: "Saa 2:00 asubuhi – Saa 1:00 jioni" },
      { day: "Sunday",            daySw: "Jumapili",            time: "By appointment",    timeSw: "Kwa miadi" }
    ],

    /* Social media: paste the full link, or leave "" to hide that icon. */
    social: {
      instagram: "",
      facebook: "",
      tiktok: "https://www.tiktok.com/@agustar111?_r=1&_t=ZS-9ARkcb7bfLo",
      youtube: ""
    }
  },

  /* --- Appointment time slots offered in the booking form --- */
  booking: {
    firstSlot: "08:00",   // 24-hour clock
    lastSlot: "18:00",
    slotMinutes: 60
  },

  /* --- PICTURES ---------------------------------------------------- */
  images: {
    logo: "images/logo.svg",
    hero: "images/hero.jpg"      // big photo at the top of the page
  },

  /* --- Hairstyle menu: 6 categories. Each has its own card photo. --- */
  categories: [
    {
      id: "braids", letter: "A", title: "Braids", photo: "images/cat-braids.jpg",
      services: [
        "Box Braids", "Knotless Braids", "Boho Braids", "Goddess Braids",
        "Fulani Braids", "Ghana Braids", "Lemonade Braids", "Tribal Braids",
        "Stitch Braids", "Feed-in Braids", "Micro Braids", "Jumbo Braids",
        "Invisible Braids", "Butterfly Braids"
      ]
    },
    {
      id: "cornrows", letter: "B", title: "Cornrows & Lines", photo: "images/cat-cornrows.jpg",
      services: [
        "Straight-back Lines", "Curved Lines", "Zigzag Lines", "Stitch Cornrows",
        "Feed-in Cornrows", "Small, Medium & Large Lines"
      ]
    },
    {
      id: "twists", letter: "C", title: "Twists", photo: "images/cat-twists.jpg",
      services: [
        "Senegalese Twists", "Passion Twists", "Spring Twists", "Marley Twists",
        "Havana Twists", "Mini, Medium & Jumbo Twists"
      ]
    },
    {
      id: "crochet", letter: "D", title: "Crochet", photo: "images/cat-crochet.jpg",
      services: ["Crochet Braids", "Crochet Curls", "Crochet Twists", "Crochet Faux Locs"]
    },
    {
      id: "locs", letter: "E", title: "Locs", photo: "images/cat-locs.jpg",
      services: ["Faux Locs", "Soft Locs", "Butterfly Locs", "Goddess Locs", "Distressed Locs"]
    },
    {
      id: "natural", letter: "F", title: "Natural Hair", photo: "images/cat-natural.jpg",
      services: ["Afro", "Flat Twists", "Two-Strand Twists", "Finger Coils", "Bantu Knots", "Wash and Go"]
    }
  ],

  /* --- Hair length and size options --- */
  lengths: ["Short", "Shoulder-length", "Mid-back", "Waist-length", "Hip-length"],
  sizes: ["Micro", "Small", "Medium", "Large", "Jumbo"],

  /* --- Gallery: add, remove or reorder freely.
         category must be one of: braids, cornrows, twists, crochet, locs, natural
         alt = English description, altSw = Swahili description (optional) --- */
  gallery: [
    { src: "images/gallery-1.jpg", alt: "Long knotless braids with gold cuffs", altSw: "Misuko mirefu ya knotless yenye vikuku vya dhahabu", category: "braids" },
    { src: "images/gallery-2.jpg", alt: "Cornrows styled into a high bun", altSw: "Cornrows zilizokusanywa juu kama kifundo", category: "cornrows" },
    { src: "images/gallery-3.jpg", alt: "Red and black curly-ended braids", altSw: "Misuko myekundu na myeusi yenye ncha za kujikunja", category: "crochet" },
    { src: "images/gallery-4.jpg", alt: "Braided top knot with gold cuffs", altSw: "Kifundo cha misuko juu chenye vikuku vya dhahabu", category: "braids" },
    { src: "images/gallery-5.jpg", alt: "Curly twists with a side part", altSw: "Twists za kujikunja zenye mgawanyo pembeni", category: "twists" },
    { src: "images/gallery-6.jpg", alt: "Bantu knots", altSw: "Bantu knots", category: "natural" },
    { src: "images/cat-braids.jpg", alt: "Box braids with a soft curl finish", altSw: "Box braids zenye ncha laini za kujikunja", category: "braids" },
    { src: "images/cat-cornrows.jpg", alt: "Neat curved cornrow lines", altSw: "Mistari nadhifu iliyopinda ya cornrows", category: "cornrows" },
    { src: "images/cat-twists.jpg", alt: "Senegalese-style twists", altSw: "Twists za mtindo wa Senegalese", category: "twists" },
    { src: "images/cat-crochet.jpg", alt: "Crochet curls", altSw: "Crochet curls", category: "crochet" },
    { src: "images/cat-locs.jpg", alt: "Butterfly locs", altSw: "Butterfly locs", category: "locs" },
    { src: "images/cat-natural.jpg", alt: "Natural afro curls", altSw: "Nywele za asili za afro zilizojikunja", category: "natural" }
  ]
};
