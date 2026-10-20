import { useToast } from "vue-toastification";

export const scrollPage = (id: string) => {

  const getID = document.getElementById(id);
  
  if (!getID) {
    useToast().info("Document ID Not Found");
    return;
  }

  getID.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

// Utility function to access nested properties
export function getNestedValue(object: Record<string, any>, path: string) {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      object
    );
}
  
export function setNestedValue(obj: Record<string, any>, path: string, value: any) {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}
/**
 * A random id. `crypto.randomUUID` only exists on HTTPS or localhost, so a phone
 * on the dev server's LAN address (or an older iOS) falls back to `getRandomValues`.
 */
export function uuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
