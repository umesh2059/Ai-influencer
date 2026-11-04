# Dev Notes: Bug Fixes & Features (Study Guide)

A learning log of the problems fixed and features added to Influencer.AI, explained step by step: **what went wrong, why, how it was fixed, and how the code works now.**

For the overall architecture, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md).

---

## Table of Contents

1. [Bug: "Calendar is not defined" after registering](#1-bug-calendar-is-not-defined-after-registering)
2. [Why the error kept showing after the fix (browser cache)](#2-why-the-error-kept-showing-after-the-fix-browser-cache)
3. [Feature: Custom Prompt when creating a model](#3-feature-custom-prompt-when-creating-a-model)
4. [Feature: Clear message when real images can't be generated](#4-feature-clear-message-when-real-images-cant-be-generated)
5. [Bug: Gemini images were read from the wrong field](#5-bug-gemini-images-were-read-from-the-wrong-field)
6. [Known issue: Gemini API key has no image quota](#6-known-issue-gemini-api-key-has-no-image-quota)
7. [How model generation works end-to-end](#7-how-model-generation-works-end-to-end)
8. [How these were tested](#8-how-these-were-tested)
9. [Lessons & debugging checklist](#9-lessons--debugging-checklist)
10. [Open to-dos](#10-open-to-dos)

---

## 1. Bug: "Calendar is not defined" after registering

### Symptom

After signing up (or logging in), the app redirects to `/dashboard`, and the page crashed with:

```
Runtime ReferenceError
Calendar is not defined
    at DashboardPage (...)
```

### Root cause: a typo in an import

The dashboard imports its icons from `components/Icons.tsx`. The import had the wrong name:

```tsx
// app/dashboard/page.tsx (BEFORE)
import {
  Sparkles,
  Calendars      // ❌ wrong: Icons.tsx has no export called "Calendars"
  ,              // ❌ stray comma on its own line (harmless, but messy)
  Analytics,
  ...
} from "@/components/Icons";
```

`components/Icons.tsx` exports the icon as **`Calendar`** (singular):

```tsx
export const Calendar = ({ className = "", size = 24, ...props }: IconProps) => ( ... );
```

Later, the sidebar menu used `Calendar`:

```tsx
{ id: "calendar", label: "Calendar", icon: Calendar },
```

So the code **used** a name (`Calendar`) that it never **imported**. When React rendered the dashboard and reached that line, JavaScript couldn't find the variable and threw `ReferenceError: Calendar is not defined`.

### Why it showed up "when registering a new user"

The bug wasn't really about registration. Registering sends you to `/dashboard`, and **any** logged-in user opening the dashboard would crash. New users just hit it first.

### The fix

```tsx
// app/dashboard/page.tsx (AFTER)
import {
  Sparkles,
  Calendar,      // ✅ matches the export in Icons.tsx
  Analytics,
  ...
} from "@/components/Icons";
```

Committed as `ff95f51 fix calendar icon import on dashboard`.

### Key concept: named imports must match exactly

With `export const Calendar`, you must write `import { Calendar }`. The name is case-sensitive and must match exactly. `Calendars`, `calendar` or `CalendarIcon` will not work unless you rename it: `import { Calendar as CalendarIcon }`.

### How you could have caught it earlier

TypeScript reports this kind of mistake before you ever open the browser:

```bash
npx tsc --noEmit
# error TS2724: '"@/components/Icons"' has no exported member named 'Calendars'. Did you mean 'Calendar'?
```

In VS Code it also appears as a **red underline** on `Calendars`. Make it a habit to check the Problems panel (`Ctrl + Shift + M`).

---

## 2. Why the error kept showing after the fix (browser cache)

### Symptom

Even after the fix was saved and committed, the same error (same file, same line `3676:19`) kept appearing.

### Investigation (what was checked)

| Check | Result |
|---|---|
| Source file `app/dashboard/page.tsx` | ✅ Correct `Calendar` import |
| Other files using `Calendar` (`Features.tsx`, `PostSchedulerSimulator.tsx`) | ✅ Imported correctly |
| How many dev servers are running | ✅ Only one, on port 3000 |
| The compiled JS the server actually sends (downloaded with `curl`) | ✅ Contains the fixed code |
| Opened the dashboard in a separate, clean headless Chrome | ✅ Loads with no errors |

### Root cause: the browser was running old JavaScript

- **Old code** compiled to `icon: Calendar`, a bare variable that doesn't exist and throws `ReferenceError`.
- **New code** compiles to `icon: Icons["Calendar"]`, a property lookup that **cannot** throw "Calendar is not defined".

So if you still see that exact message, the browser **must** be running the old code. The open tab had loaded the broken JavaScript before the fix, and a redirect after sign-up doesn't force a fresh download.

### How to fix stale code in the browser

1. Close the browser window completely (not just the tab).
2. Test in an **incognito/private window** (`Ctrl + Shift + N`). It has no cache.
3. To clean your normal browser: open DevTools (`F12`), go to **Application**, click **Clear site data**, then right-click the reload button and choose **Empty Cache and Hard Reload**.
4. If needed, restart the dev server with a clean build cache:
   ```powershell
   # stop the server with Ctrl + C, then:
   Remove-Item -Recurse -Force .next
   npm run dev
   ```
   `.next/` is just a build cache. Next.js recreates it, and it should never be committed.

### Key concept

> If the code is fixed but the error is **identical** (same message, same line number), suspect a cache or an old tab before suspecting the code.

---

## 3. Feature: Custom Prompt when creating a model

### What it does

On **Models / Studio → Add New Model**, below the existing option chips (gender, body type, skin tone, age, hair, eye color), there is now a **Custom Prompt (optional)** box. The user can describe exactly what they want in the image:

> *"wearing a red leather jacket, standing on a neon-lit Tokyo street at night"*

The prompt is **combined** with the chosen options, so the person still matches the selected features. The prompt only adds the outfit, scene and style.

### UI parts (in `app/dashboard/page.tsx`, inside the `create-model` view)

| Part | What it does |
|---|---|
| `<textarea>` | Where the user types the prompt. Max **500** characters. |
| Character counter | Shows `29/500` and so on, next to the label. |
| 5 quick-idea chips | e.g. **+ Summer dress on a sunny beach**. Clicking fills an empty box, or appends `, summer dress on a sunny beach` to existing text (still capped at 500). |
| Helper text | Explains that the prompt is combined with the options above. |
| Result summary | After generation, the prompt is listed under the attributes (Gender, Body Type, …). |

### State added

```tsx
const [newModelCustomPrompt, setNewModelCustomPrompt] = useState("");
```

It is a normal controlled input: `value={newModelCustomPrompt}` plus `onChange={(e) => setNewModelCustomPrompt(e.target.value)}`. It is cleared when the model is saved with **Add to Active Directory**.

### How the prompt is built (inside `handleGenerateModel`)

```tsx
// A custom prompt describes the scene/outfit, so drop the default studio setting
const customDetails = newModelCustomPrompt.trim();
const setting = customDetails ? "" : "studio ";
const lighting = customDetails ? "natural lighting that matches the scene" : "studio softbox lighting";

const basePersona = `virtual influencer named ${newModelName}. Features: ${newModelGender}, ...
  ${newModelEyeColor} eyes.${customDetails ? ` Scene, outfit and styling: ${customDetails}.` : ""}
  Photorealistic render, ${lighting}, 8k resolution.`;

const portraitPrompt = `Photorealistic 8k ${setting}close-up portrait of a ${basePersona}`;
const fullBodyPrompt = `Photorealistic 8k ${setting}full-body composition of a ${basePersona}`;
```

**Why remove "studio" when there's a custom prompt?** The old prompt always said *"studio softbox lighting"*. If the user asks for *"on a sunny beach"*, the AI gets two conflicting instructions (studio vs. beach) and produces worse images. So:

- **No custom prompt:** the original studio prompt, unchanged.
- **With a custom prompt:** no "studio", and lighting that matches the scene.

### Example: the prompt actually sent to Gemini

Options: Female, Average, Medium skin, Gen Z, Straight hair, Brown eyes, plus the custom prompt *"Summer dress on a sunny beach"*:

```
Photorealistic 8k close-up portrait of a virtual influencer named Test Mia.
Features: Female, Average anatomy, Medium skin tone, Gen Z (18-24), Straight hair,
and Brown eyes. Scene, outfit and styling: Summer dress on a sunny beach.
Photorealistic render, natural lighting that matches the scene, 8k resolution.
```

Two of these are sent in parallel (`Promise.all`): a **portrait** (1:1) and a **full-body** image (3:4).

---

## 4. Feature: Clear message when real images can't be generated

### The problem before

If Gemini failed (no API key, quota exceeded, network error), the code **silently** showed random stock photos from Unsplash. With the custom prompt feature, that would look like *"the app ignored my prompt"*, which is confusing.

### What happens now

A new state holds a message:

```tsx
const [generationNotice, setGenerationNotice] = useState("");
```

After calling the API, the code checks what happened:

| Situation | How it's detected | Message shown (amber box) |
|---|---|---|
| No Gemini API key | API responds with `isSimulated: true` | "No Gemini API key is set, so these are sample images. Add your key in Settings…" |
| Quota / rate limit | Error text matches `quota`, `rate limit` or `429` | "Your Gemini API key has no image-generation quota left. Enable billing in Google AI Studio or try again later…" |
| Any other API error | `data.error` is present | "Gemini couldn't generate every image (*first 160 characters of the error*)…" |
| Network failure | the `catch` block runs | "Couldn't reach the image generator…" |

The message appears in the result panel, above the images. It is reset at the start of each new generation.

**Why the quota message is short:** Google's real quota error is about 15 lines of URLs and metric names. Showing all of it filled the whole panel, so quota errors get a short, human-readable sentence instead.

---

## 5. Bug: Gemini images were read from the wrong field

### Root cause

In `lib/gemini.ts`, the code looked for the image here:

```ts
part.inline_data?.data          // snake_case
part.inline_data.mime_type
```

But the Gemini REST API **responds in camelCase**:

```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "inlineData": { "mimeType": "image/png", "data": "iVBORw0KG..." }
      }]
    }
  }]
}
```

So even when Gemini successfully generated an image, the code wouldn't find it. It threw `"No image generated in response"`, and the app fell back to stock photos.

### The fix

Accept **both** spellings, preferring camelCase:

```ts
const imagePart = data.candidates?.[0]?.content?.parts?.find(
  (part) => part.inlineData?.data || part.inline_data?.data
);
const imageBase64 = imagePart?.inlineData?.data || imagePart?.inline_data?.data;
const imageMimeType = imagePart?.inlineData?.mimeType || imagePart?.inline_data?.mime_type || "image/png";

if (!imageBase64) {
  throw new Error("No image generated in response");
}

// returned to the browser as a data URL that <img src> can display directly
url: `data:${imageMimeType};base64,${imageBase64}`
```

The `GeminiImageResponse` TypeScript interface was updated to include both `inlineData` and `inline_data`.

### Key concept: base64 data URLs

Gemini returns the image as **base64 text**, not as a link. Formatting it as `data:image/png;base64,<text>` turns it into something an `<img src="...">` tag can show directly, with no file upload or storage needed. (Downside: these strings are large. Saving them permanently would need storage such as Supabase Storage.)

---

## 6. Known issue: Gemini API key has no image quota

While testing, Google returned:

```
You exceeded your current quota ... limit: 0, model: gemini-2.5-flash-preview-image
Quota exceeded for metric: generate_content_free_tier_requests
```

**Meaning:** the API key works, but its **free tier allows 0 image generations** for this model. That's why sample photos appear even though the code is correct.

**How to get real AI images:**
1. Go to Google AI Studio (aistudio.google.com) and enable **billing** for the project that owns the key, **or**
2. Use a different key that has image-generation quota.
3. Put the key in `.env.local` as `GEMINI_API_KEY=...` (restart `npm run dev` after editing), or paste it in **Dashboard → Settings** (stored in the browser's `localStorage` as `gemini_api_key`).

The app now shows this situation itself (see [section 4](#4-feature-clear-message-when-real-images-cant-be-generated)).

---

## 7. How model generation works end-to-end

```
┌─────────────────────────── Browser (app/dashboard/page.tsx) ───────────────────────────┐
│ 1. User picks options + (optional) types Custom Prompt                                 │
│ 2. Clicks "Generate Influencer with Gemini (-50 Credits)" → handleGenerateModel()      │
│      • validates name, checks credits ≥ 50                                             │
│      • builds portraitPrompt + fullBodyPrompt (options + custom prompt)                │
│      • sends 2 POST requests in parallel to /api/gemini/generate                       │
└────────────────────────────────────────┬───────────────────────────────────────────────┘
                                         ▼
┌──────────────────────── Server route (app/api/gemini/generate/route.ts) ──────────────┐
│ 3. Reads { prompt, aspect_ratio, apiKey } from the body                               │
│ 4. Key = key from Settings OR process.env.GEMINI_API_KEY                              │
│      • no key  → returns { isSimulated: true, sample image }                          │
│      • has key → calls submitGeminiGeneration()                                       │
└────────────────────────────────────────┬──────────────────────────────────────────────┘
                                         ▼
┌──────────────────────────────── lib/gemini.ts ────────────────────────────────────────┐
│ 5. POST to generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image     │
│      :generateContent  with response_modalities ["IMAGE", "TEXT"]                     │
│ 6. Finds the image part (inlineData / inline_data) → builds a base64 data URL         │
│ 7. Errors (quota, bad key, …) are thrown → route returns { error } with status 500    │
└────────────────────────────────────────┬──────────────────────────────────────────────┘
                                         ▼
┌─────────────────────────── Back in the browser ───────────────────────────────────────┐
│ 8. If real images came back → show them                                               │
│    Otherwise → random preset photo from INFLUENCER_PRESETS + amber notice explaining why │
│ 9. Deduct 50 credits, show "Generation Success" panel                                 │
│ 10. "Add to Active Directory" saves the model to modelsList (in memory, page state)   │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

**Why go through a server route instead of calling Gemini from the browser?** The API key in `GEMINI_API_KEY` stays on the server. If the browser called Google directly, anyone could open DevTools and steal the key.

---

## 8. How these were tested

1. **Type check:** `npx tsc --noEmit` reported no errors in `app/dashboard/page.tsx` or `lib/gemini.ts`.
2. **Real browser test (automated):** a Playwright script opened headless Chrome against the running dev server (`localhost:3000`) and:
   - logged in with the app's **demo user** (sets `ai_demo_user` in a cookie and in `localStorage`, the same as the "demo access" button), so no real account was created;
   - opened **Models / Studio → Add New Model**, typed a name, clicked the **+ Summer dress on a sunny beach** chip;
   - confirmed the textarea filled in, clicked Generate, and captured the exact prompts sent to `/api/gemini/generate`;
   - took screenshots of the form and the result panel, and confirmed there were no page errors.

   The test script lived in a temporary folder, not in this repo.

---

## 9. Lessons & debugging checklist

**When you see `X is not defined`:**
- [ ] Is `X` imported at the top of the file?
- [ ] Does the import name **exactly** match the export (spelling, singular/plural, capitals)?
- [ ] Run `npx tsc --noEmit` or check the VS Code Problems panel.

**When a fix "doesn't work":**
- [ ] Is the file actually saved? (`git diff` shows your change)
- [ ] Is the error **identical** to before (same line/column)? Then it's probably a cache.
- [ ] Try an incognito window first. It's the fastest way to rule out cache.
- [ ] Is only one dev server running, and are you on the right port?

**When an external API "doesn't work":**
- [ ] Log or show the real error message. Don't hide failures behind fallbacks.
- [ ] Check the API's real response format (camelCase vs. snake_case!).
- [ ] Check quota, billing and API key permissions in the provider's dashboard.

---

## 10. Open to-dos

- **Credits are still deducted when sample photos are shown.** Currently 50 credits are charged even if Gemini failed. Better: charge only when real images are generated.
- **Saved models are not persisted.** `modelsList` lives in React state, so models disappear on page reload. They could be saved to Supabase.
- **Generated images are base64 strings.** They'd need uploading to storage (e.g. Supabase Storage) to be kept long-term.
- Tailwind shows "canonical class" hints (e.g. `bg-gradient-to-r` can be written as `bg-linear-to-r`). These are only style suggestions, not errors.
