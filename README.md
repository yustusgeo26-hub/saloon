# Braids & More Beauty Salon — Website

A complete, free-to-host landing page: hairstyle menu, length/size selector, gallery with lightbox, and an appointment form that sends the request to your WhatsApp. No server, database, paid service or build step.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure |
| `style.css` | Design (colours are variables at the top) |
| `script.js` | All behaviour (you normally never edit this) |
| **`translations.js`** | **Every word of the site in English and Swahili** |
| **`config.js`** | **The one file you edit: contacts, location, pictures, menu** |
| `images/` | All pictures |

## Languages (English / Swahili)

Visitors switch with the **EN | SW** button at the top. Their choice is remembered, and phones set to Swahili open the site in Swahili automatically. You can also share a Swahili link by adding `?lang=sw` to the address.

- To fix or improve any wording, open `translations.js` and edit the text after `sw:`. Keep `{curly words}` unchanged.
- Hairstyle names (Box Braids, etc.) are not translated on purpose; change them in `config.js`.
- In `config.js` you can also give Swahili versions of the tagline (`taglineSw`), opening hours (`daySw`, `timeSw`) and gallery descriptions (`altSw`).
- The WhatsApp message is written in the language the visitor chose.
- Please have a Swahili speaker check the translations once, and adjust any word you would say differently.

## 1. Run it on your computer

Double-click `index.html`. That's it.

## 2. First thing to do — open `config.js`

1. **WhatsApp number** (line `const WHATSAPP_NUMBER = ...`): international format, digits only, no `+`, e.g. `255712345678`.
   Until you set this, the booking form politely says WhatsApp is not set up instead of opening a broken link.
2. **Phone** (`contact.phone`) — used for the displayed number and the click-to-call button.
3. **Location** (`contact.locationLines`) — shown in the footer.
4. **Opening hours** (`contact.hours`) — the ones included are samples, please replace them.
5. **Social links** (`contact.social`) — paste full links; empty ones are hidden.

Contact details appear in the page footer. Phone, WhatsApp, email and social links stay hidden until you fill them in, so there are no dead links. The location and opening hours show exactly what is written in `config.js` (currently sample text), so please replace them.

## 3. Changing pictures

Every picture is listed in `config.js`:

- `images.hero`, `images.logo`
- each menu category's `photo`
- every gallery photo (`gallery` list — add, remove or reorder freely)

Two ways to change one: **replace the file in `images/` using the same file name**, or **change the path** in `config.js` (a local file like `images/my-photo.jpg`, or a full web link). If a picture fails to load, a soft pink picture appears instead of a broken icon.

Tips: use JPG or WebP, around 1200 px wide for the hero and 800 px for others, under 300 KB each. Only use photos you own or have permission to use (your own clients, with their consent).

> **Important:** the sample photos that come with this site were cut from the design mock-up and are small. Replace them with your own real, high-quality salon photos before launch.

## 4. Changing the menu

Edit `categories` in `config.js`: rename a category, add or remove hairstyles, change the photo. The menu, booking dropdown and WhatsApp messages all update automatically. Lengths and sizes are the `lengths` and `sizes` lists.

## 5. How booking works

1. The customer picks a hairstyle, length and size (tap in the menu, or use the form).
2. They enter their name, choose hairstyle, length, size, date and time (all checked) and can add notes. Their phone number is not asked for — WhatsApp already shows it.
3. WhatsApp opens with the full request already written. **The request is only sent when the customer presses Send in WhatsApp**, so the page never claims a booking is confirmed — the salon replies to confirm.
4. "Request Price on WhatsApp" works the same way with the chosen style, length and size. Prices are never shown on the site.

## 6. Put it online for free

Any of these work with the whole folder, no settings needed:

- **Netlify Drop** — go to app.netlify.com/drop and drag the folder in.
- **Cloudflare Pages** — "Create project" → "Upload assets".
- **GitHub Pages** — upload the files to a repository, then Settings → Pages → deploy from `main`.

After a change to `config.js` or an image, upload the folder again.

## 7. Browser support

Current Chrome, Edge, Firefox, Safari (iPhone and Android). Fonts load from Google Fonts; if blocked, the site falls back to standard fonts and still works.
