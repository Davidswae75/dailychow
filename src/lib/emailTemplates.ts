/**
 * HTML bodies for EmailJS. Each EmailJS template holds just `{{{html}}}` (triple
 * braces render raw HTML); these functions build that HTML, so the design lives here.
 *
 *   emailjs.send(serviceId, templateId, {
 *     to_email: user.email,
 *     subject: "Welcome to Daily Chow",
 *     html: welcomeEmail({ name: user.fullName }),
 *   });
 *
 * Mail clients only agree on tables and inline styles, so that's all this uses.
 * Colours are hex versions of the tokens in src/assets/styles.css (no oklch in email).
 */
import type { Dish, MealTime } from "./dishes";

const c = {
  cream: "#F5EEE4",
  paper: "#FDF9F4",
  terracottaDeep: "#9C4422",
  olive: "#6B7254",
  saffron: "#E8A93A",
  charcoal: "#2B2420",
  ink: "#6E625A",
  line: "#E6DBCD",
};
const display = "Fraunces,Georgia,'Times New Roman',serif";
const sans = "'DM Sans',Helvetica,Arial,sans-serif";

const siteUrl = () => window.location.origin;
/** Dish images are bundled asset paths; email needs absolute URLs. */
const absolute = (path: string) => new URL(path, siteUrl()).href;

/** Raw HTML goes out through {{{ }}}, so every user value must be escaped. */
const esc = (value: unknown) =>
  String(value ?? "").replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

const firstName = (name: string) => name.trim().split(/\s+/)[0] || "there";

// ---------- Building blocks ----------

const button = (href: string, label: string) =>
  `<a href="${esc(href)}" style="display:inline-block;background:${c.terracottaDeep};color:${c.paper};font-family:${sans};font-weight:700;font-size:16px;text-decoration:none;padding:14px 28px;border-radius:99px;">${esc(label)}</a>`;

const heading = (text: string) =>
  `<h1 style="margin:0 0 8px;font-family:${display};font-size:30px;line-height:36px;font-weight:700;color:${c.charcoal};">${text}</h1>`;

const paragraph = (text: string, extra = "") =>
  `<p style="margin:0 0 22px;font-size:15px;line-height:23px;color:${c.ink};${extra}">${text}</p>`;

const label = (text: string) =>
  `<p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${c.olive};">${esc(text)}</p>`;

/** The card every email sits in: brand header (or a hero image), body, footer line. */
function layout({ preview, body, hero, footer }: { preview: string; body: string; hero?: { src: string; alt: string }; footer: string }) {
  const top = hero
    ? `<tr><td><img src="${esc(hero.src)}" alt="${esc(hero.alt)}" width="520" style="display:block;width:100%;height:auto;max-height:260px;object-fit:cover;border:0;border-radius:28px 28px 0 0;"></td></tr>`
    : `<tr><td style="padding:28px 32px 0;"><a href="${esc(siteUrl())}" style="font-family:${display};font-size:20px;font-weight:700;color:${c.terracottaDeep};text-decoration:none;">Daily Chow</a></td></tr>`;

  return `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.cream};font-family:${sans};color:${c.charcoal};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${c.paper};border:1px solid ${c.line};border-radius:28px;">
      ${top}
      <tr><td style="padding:${hero ? "24px" : "16px"} 32px 32px;">${body}</td></tr>
    </table>
    <p style="margin:18px 0 0;font-size:12px;line-height:18px;color:${c.ink};">${esc(footer)}</p>
  </td></tr>
</table>`;
}

// ---------- Emails ----------

/** After registration. */
export function welcomeEmail({ name }: { name: string }) {
  const steps = [
    ["Tell it about tonight", "meal, minutes, mood"],
    ["Get one confident pick", "swipe for more"],
    ["Tap “I'll have this”", "no repeats tomorrow"],
  ]
    .map(
      ([title, note], i) => `<tr>
        <td width="38" valign="top" style="padding-bottom:14px;"><div style="width:26px;height:26px;line-height:26px;border-radius:99px;background:${c.saffron};text-align:center;font-weight:700;font-size:13px;color:${c.charcoal};">${i + 1}</div></td>
        <td style="padding:3px 0 14px;font-size:15px;"><b>${title}</b> <span style="color:${c.ink};">· ${note}</span></td>
      </tr>`
    )
    .join("");

  return layout({
    preview: "Your taste profile is set. Here's how to get tonight's dish.",
    footer: "One Nigerian dish, chosen for your mood and your minutes.",
    body: `${heading(`Welcome, ${esc(firstName(name))}.`)}
      ${paragraph("Your no-go foods, pepper level and favourites are saved. Deciding what to eat now takes a few taps.")}
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${steps}</table>
      ${button(`${siteUrl()}/dashboard/pick`, "Find tonight's dish")}`,
  });
}

/** After "I'll have this": the dish, its time and what to buy. */
export function dishEmail({ name, dish, meal }: { name: string; dish: Dish; meal: MealTime }) {
  const chips = [`⏱ ${dish.minutes} mins`, dish.region, dish.category]
    .map(
      (t) => `<span style="display:inline-block;margin:0 6px 6px 0;background:${c.cream};border-radius:99px;padding:6px 14px;font-size:13px;font-weight:600;text-transform:capitalize;">${esc(t)}</span>`
    )
    .join("");

  return layout({
    preview: `${dish.name}: ${dish.note}`,
    footer: "Enjoy your chow. It's saved to your history.",
    hero: { src: absolute(dish.img), alt: dish.name },
    body: `<p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${c.terracottaDeep};">${esc(firstName(name))}'s ${esc(meal)}</p>
      ${heading(esc(dish.name))}
      ${paragraph(esc(dish.note), "margin-bottom:16px;")}
      <div style="margin-bottom:20px;">${chips}</div>
      ${label("You'll need")}
      ${paragraph(dish.ingredients.map(esc).join(" · "))}
      ${button(`${siteUrl()}/dashboard/foods/${dish.id}`, "See the full dish")}`,
  });
}

export interface PlannedDay {
  /** e.g. "Mon 20 Oct" */
  label: string;
  meals: { slot: MealTime; dish: Dish }[];
}

/** From the Planner: the week's menu and the market list. */
export function weeklyPlanEmail({
  name,
  weekRange,
  days,
  shoppingList,
}: {
  name: string;
  weekRange: string;
  days: PlannedDay[];
  shoppingList: string[];
}) {
  const menu = days
    .filter((d) => d.meals.length)
    .map(
      (d, i) => `<tr>
        <td valign="top" width="96" style="padding:10px 0;${i ? `border-top:1px solid ${c.line};` : ""}font-size:13px;font-weight:700;">${esc(d.label)}</td>
        <td style="padding:10px 0;${i ? `border-top:1px solid ${c.line};` : ""}font-size:14px;line-height:22px;">${d.meals
          .map((m) => `<span style="color:${c.ink};text-transform:capitalize;">${esc(m.slot)}</span> ${esc(m.dish.name)}`)
          .join("<br>")}</td>
      </tr>`
    )
    .join("");

  const list = shoppingList
    .map((item) => `<span style="display:inline-block;margin:0 6px 6px 0;border:1px solid ${c.line};border-radius:99px;padding:5px 12px;font-size:13px;color:${c.charcoal};">${esc(item)}</span>`)
    .join("");

  return layout({
    preview: `Your menu for ${weekRange}, plus the market list.`,
    footer: "Plans change. Swap any meal in the app.",
    body: `${heading(`Your week is planned, ${esc(firstName(name))}.`)}
      ${paragraph(esc(weekRange))}
      ${label("The menu")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;padding:4px 18px;background:${c.cream};border-radius:18px;">${menu}</table>
      ${shoppingList.length ? `${label("Market list")}<div style="margin-bottom:22px;">${list}</div>` : ""}
      ${button(`${siteUrl()}/dashboard/planner`, "Open your planner")}`,
  });
}
