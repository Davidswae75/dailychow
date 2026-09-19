// bodyTypes.ts
// Simple hierarchical body types for food selection

// export type BodyTypeCategory = "Ectomorph" | "Mesomorph" | "Endomorph";

// export interface BodyType {
//   id: string;
//   name: string;
//   category: BodyTypeCategory;
//   description: string; // short & simple for users
// }

// export const bodyTypes: BodyType[] = [
  // Ectomorph
//   {
//     id: "ecto",
//     name: "Ectomorph",
//     category: "Ectomorph",
//     description: "Naturally lean and thin. Hard to gain weight or muscle."
//   },
//   {
//     id: "ecto-meso",
//     name: "Ecto-Mesomorph",
//     category: "Ectomorph",
//     description: "Lean with some natural muscle."
//   },

//   // Mesomorph
//   {
//     id: "meso",
//     name: "Mesomorph",
//     category: "Mesomorph",
//     description: "Athletic build. Gains muscle easily and stays balanced."
//   },
//   {
//     id: "meso-endo",
//     name: "Meso-Endomorph",
//     category: "Mesomorph",
//     description: "Muscular with a tendency to carry more fat."
//   },

//   // Endomorph
//   {
//     id: "endo",
//     name: "Endomorph",
//     category: "Endomorph",
//     description: "Softer, rounder build. Gains weight more easily."
//   },
//   {
//     id: "endo-meso",
//     name: "Endo-Mesomorph",
//     category: "Endomorph",
//     description: "Stocky and strong with higher fat storage."
//   },
// ];

// Optional: quick lookup by category
// export const bodyTypesByCategory = {
//   Ectomorph: bodyTypes.filter(t => t.category === "Ectomorph"),
//   Mesomorph: bodyTypes.filter(t => t.category === "Mesomorph"),
//   Endomorph: bodyTypes.filter(t => t.category === "Endomorph"),
// };


// bodyTypes.ts
// Simple hierarchical body types for food selection
// Uses everyday language so users can pick quickly

export type BodyTypeCategory = "Lean" | "Athletic" | "Softer";

export interface BodyType {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export const bodyTypes: BodyType[] = [
  // Lean
  {
    id: "lean",
    name: "Lean & Thin",
    category: "Lean",
    description: "Naturally slim. Hard to put on weight or muscle."
  },
  {
    id: "lean-athletic",
    name: "Lean & Toned",
    category: "Lean",
    description: "Slim with some natural muscle definition."
  },

  // Athletic
  {
    id: "athletic",
    name: "Athletic & Muscular",
    category: "Athletic",
    description: "Naturally strong and muscular. Builds muscle easily."
  },
  {
    id: "athletic-softer",
    name: "Athletic & Soft",
    category: "Athletic",
    description: "Muscular but carries a bit more body fat."
  },

  // Softer
  {
    id: "softer",
    name: "Softer & Rounder",
    category: "Softer",
    description: "Softer build. Gains weight more easily."
  },
  {
    id: "softer-strong",
    name: "Stocky & Strong",
    category: "Softer",
    description: "Solid and strong with higher fat storage."
  },
];

// Optional: quick lookup by category
export const bodyTypesByCategory = {
  Lean: bodyTypes.filter(t => t.category === "Lean"),
  Athletic: bodyTypes.filter(t => t.category === "Athletic"),
  Softer: bodyTypes.filter(t => t.category === "Softer"),
};

export type BodyTypesByCategory = keyof typeof bodyTypesByCategory 


export const bodyTypes2 = [
  {
    id: "lean_frame",
    name: "Lean Frame",
    category: "Lean",
  },
  {
    id: "average_build",
    name: "Average Build",
    category: "Athletic",
  },
  {
    id: "curvy_build",
    name: "Curvy Build",
    category: "Softer",
  },
  {
    id: "athletic_build",
    name: "Athletic Build",
    category: "Athletic",
  },
  {
    id: "big_build",
    name: "Big Build",
    category: "Softer",
  },
];