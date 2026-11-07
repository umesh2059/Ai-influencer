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
11. [Bug: Image generation stuck "forever" (Supabase auth deadlock)](#11-bug-image-generation-stuck-forever-supabase-auth-deadlock)
12. [Bug: Red "Console Error" popup for Gemini quota errors](#12-bug-red-console-error-popup-for-gemini-quota-errors)

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

---

## 11. Bug: Image generation stuck "forever" (Supabase auth deadlock)

### Symptom

With a real (registered) account, clicking **Generate Influencer with Gemini** showed the "Synthesizing Persona" spinner for a very long time, and the result never appeared.

### Step 1: Is Gemini slow? (No)

A test script called Gemini directly with the project's key and timed every call:

| Model | Result | Time |
|---|---|---|
| `gemini-2.5-flash-image` | 429 quota exceeded | 0.4 s |
| `gemini-3.1-flash-lite-image` | 429 quota exceeded | 0.4 s |
| `gemini-3.1-flash-image` | 429 quota exceeded | 0.3 s |
| `gemini-3-pro-image` | 429 quota exceeded | 0.3 s |

The key is valid (listing models works), but it has **no image quota on any model**. Gemini rejects instantly, so the long wait had to be somewhere in **our** code.

### Step 2: What runs after the API call?

```tsx
setGeneratedFullBody(...);
await deductCredits(50);   // ← waits for a Supabase database update
setHasGenerated(true);     // ← result only shown AFTER that finishes
setIsGeneratingModel(false);
```

`deductCredits` updates the `profiles` table in Supabase. For the **demo user** it returns early, which is why the earlier demo-user test didn't catch this. For **real users**, it waits for Supabase, with no timeout.

Supabase itself was healthy (REST and auth both answered in about 0.5 s). So why would the request never finish?

### Step 3: Root cause: a deadlock in `components/AuthProvider.tsx`

```tsx
// BEFORE
supabase.auth.onAuthStateChange(async (event, session) => {
  ...
  if (event === "SIGNED_IN" && session?.user) {
    await upsertProfile(session.user);   // ❌ Supabase call INSIDE the auth callback
  }
});
```

How the deadlock happens:

1. When you register or log in, Supabase fires `SIGNED_IN` and runs this callback **while holding its internal auth lock**.
2. `upsertProfile` calls `supabase.from("profiles")...`. Every query first asks the auth system for the current session, which needs **the same lock**.
3. The callback waits for the query, and the query waits for the lock that the callback holds. **Neither can ever finish.**
4. From then on, **every Supabase request in that tab hangs**, including `deductCredits`. So the spinner never goes away.

> **What is a deadlock?** Two tasks each waiting for the other to finish first. Like two people at a door both saying "after you" forever.

That's also why the project already had workarounds such as a 2-second timeout on `getSession()` and the "Taking longer than expected?" reset button. They treated the symptom; this fixes the cause. Supabase's own docs warn: *don't call other Supabase functions inside `onAuthStateChange`; defer them with `setTimeout`.*

### The fixes

**Fix 1: Defer the Supabase call** (`components/AuthProvider.tsx`). This is the actual root-cause fix:

```tsx
// AFTER
supabase.auth.onAuthStateChange((event, session) => {   // no longer async
  ...
  if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
    const signedInUser = session.user;
    setTimeout(() => {
      upsertProfile(signedInUser);   // ✅ runs AFTER the callback has released the lock
    }, 0);
  }
});
```

`setTimeout(fn, 0)` means "run this as soon as the current work is finished". By then the auth callback has returned and released its lock, so the query can run.

**Fix 2: Don't keep the result hidden behind the database** (`app/dashboard/page.tsx`):

```tsx
setHasGenerated(true);
setIsGeneratingModel(false);
// Saved in the background: a slow database must not keep the result hidden
deductCredits(50);       // no "await"
```

The local credit count still updates instantly (`deductCredits` calls `setProfile` first). Only the database save happens in the background.

**Fix 3: Timeouts on every network wait**, so nothing can hang forever again:

| Where | Timeout | What the user sees if it's hit |
|---|---|---|
| Browser → `/api/gemini/generate` (`page.tsx`) | 90 s (`AbortSignal.timeout(90000)`) | "Image generation took longer than 90 seconds and was stopped…" |
| Server → Google Gemini (`lib/gemini.ts`) | 80 s (`AbortSignal.timeout(80000)`) | Route returns an error, which shows the "couldn't generate" notice |

The server timeout is shorter than the browser's so the server gives up first and can send back a proper error message.

**Fix 4: Progress animation runs *during* generation, not after.** Before, the 5 progress steps (5 × 600 ms = 3 s) started only **after** the images came back, which added 3 s of pure waiting. Now the animation starts at the same time as the requests:

```tsx
const progressAnimation = (async () => {
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setGenerationModelStep(i);
  }
})();                       // starts immediately, not awaited yet

// ... fetch both images ...

await progressAnimation;    // wait only for whatever time is left
```

Total time is now *max(generation, 3 s)* instead of *generation + 3 s*.

### Result

Browser test (dev server, Custom Prompt "Summer dress on a sunny beach"): the result panel appeared after **3.2 s**, with the quota notice explaining why sample images are shown.

### Why you still won't see real AI images

The key has **0 image quota** (see [section 6](#6-known-issue-gemini-api-key-has-no-image-quota)). The code is ready; to get real images, enable **billing** for the key's project in Google AI Studio (aistudio.google.com), or use a key with image quota. With billing on, real images normally take about 5–30 seconds.

### Lessons

- **Test with a real account too.** The demo user skipped the database path, so the bug was invisible in that test.
- **Never `await` a Supabase call inside `onAuthStateChange`.** Defer it with `setTimeout(..., 0)`.
- **Every network call needs a timeout.** `fetch` waits forever by default; `AbortSignal.timeout(ms)` fixes that in one line.
- **Measure before guessing.** Timing each step showed in seconds that Gemini was fast (it failed instantly) and the wait was in our code.

---

## 12. Bug: Red "Console Error" popup for Gemini quota errors

### Symptom

Clicking **Generate Influencer** in the landing-page generator ("Generator Arena") opened Next.js's red error popup:

```
Console Error
You exceeded your current quota ... limit: 0, model: gemini-2.5-flash-preview-image ...
Please retry in 22h1m3s.
    at handleGenerate (components/InteractiveInfluencerGenerator.tsx)
```

### Two separate problems

**Problem A: Google refuses the key (not a code bug).**
`limit: 0` means the free tier allows **zero** image generations for this key. "Retry in 22h" only resets the daily counter, but the limit is still 0, so waiting won't help. The only real fix is enabling **billing** in Google AI Studio (aistudio.google.com) or using a key that has image quota. See [section 6](#6-known-issue-gemini-api-key-has-no-image-quota).

**Problem B: The app handled the refusal badly (code bug).**

1. `app/api/gemini/generate/route.ts` caught Google's error and returned it **as-is** with status **500** ("server crashed"), so the client got Google's 15-line raw message.
2. `components/InteractiveInfluencerGenerator.tsx` then ran `console.error(err)`.
3. **In development, Next.js turns every `console.error` into the red error overlay.** So an error the app was *already handling* (it falls back to a preview image and shows a notification) looked like a crash.

### The fixes

**Fix 1: The API route recognises quota errors** (`app/api/gemini/generate/route.ts`):

```ts
} catch (err: any) {
  const message: string = err?.message || "";

  if (/quota|rate.?limit|RESOURCE_EXHAUSTED|\b429\b/i.test(message)) {
    console.warn("Gemini quota exceeded:", message.split("\n")[0]);
    return NextResponse.json(
      {
        error: "Your Gemini API key has no image-generation quota left. Enable billing in Google AI Studio or use a different key.",
        code: "QUOTA_EXCEEDED",
      },
      { status: 429 }   // 429 = "Too Many Requests", the correct status for quota
    );
  }
  // ...other errors still return 500 as before
}
```

Because this happens **in the route**, all three generators that call `/api/gemini/generate` get the short message:
- landing page → `components/InteractiveInfluencerGenerator.tsx`
- studio → `components/InfluencerStudio.tsx`
- dashboard → `app/dashboard/page.tsx`

**Fix 2: `console.warn` instead of `console.error` for handled failures**, in `InteractiveInfluencerGenerator.tsx` and `InfluencerStudio.tsx`:

```tsx
// console.warn, not console.error: this failure is handled below (preview image +
// notification), and console.error would open the Next.js dev error overlay
console.warn("Gemini generation failed:", err?.message || err);
```

### Key concept: `console.error` vs `console.warn` in Next.js dev

| Call | Shows in browser console | Opens red Next.js overlay (dev only) |
|---|---|---|
| `console.error(...)` | ✅ | ✅ |
| `console.warn(...)` | ✅ (yellow) | ❌ |

Rule of thumb: use `console.error` for **unexpected** bugs you want to notice. Use `console.warn` for **expected** failures the UI already handles (quota limits, offline, user cancelled, …).

### Testing

- Direct call to `/api/gemini/generate`: **HTTP 429 in 0.46 s** with the short JSON message.
- Browser test on the landing page: after clicking **Generate Influencer**, the pink notification appeared in about 1 s, *"Error: Your Gemini API key has no image-generation quota left… Using high-resolution preview."*, the preview image was shown, and **no red overlay** opened.
- The browser still logs one line, `Failed to load resource: 429 (Too Many Requests)`. That's Chrome's own network log for any non-2xx response. It isn't from our code and doesn't open the overlay.
