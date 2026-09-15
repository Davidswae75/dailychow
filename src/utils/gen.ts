import { toast } from "vue-sonner";

export const scrollPage = (id: string) => {

  const getID = document.getElementById(id);
  
  if (!getID) {
    toast.info("Document ID Not Found");
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