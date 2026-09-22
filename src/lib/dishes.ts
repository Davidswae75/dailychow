import jollof from "@/assets/ng-jollof.jpg";
import egusi from "@/assets/ng-egusi.jpg";
import suya from "@/assets/ng-suya.jpg";
import ofada from "@/assets/ng-ofada.jpg";
import moimoi from "@/assets/ng-moimoi.jpg";
import peppersoup from "@/assets/ng-peppersoup.jpg";
import akara from "@/assets/ng-akara.jpg";
import asun from "@/assets/ng-asun.jpg";
import dodo from "@/assets/ng-dodo.jpg";
import ewaRiro from "@/assets/ng-ewa-riro.jpg";
import yamEggSauce from "@/assets/ng-yam-egg-sauce.jpg";
import okraEba from "@/assets/ng-okra-eba.jpg";
import bangaStarch from "@/assets/ng-banga-starch.jpg";
import nkwobiImg from "@/assets/ng-nkwobi.jpg";
import edikangIkong from "@/assets/ng-edikang-ikong.jpg";
import friedRice from "@/assets/ng-fried-rice.jpg";
import amalaEweduGbegiri from "@/assets/ng-amala-ewedu-gbegiri.jpg";
import ogbonoEba from "@/assets/ng-ogbono-eba.jpg";
import catfishPepperSoup from "@/assets/ng-catfish-pepper-soup.jpg";
import riceStew from "@/assets/ng-rice-stew.jpg";
import tuwoMiyanKuka from "@/assets/ng-tuwo-miyan-kuka.jpg";
import abachaImg from "@/assets/ng-abacha.jpg";
import plantainPorridge from "@/assets/ng-plantain-porridge.jpg";
import bukkaStewBeans from "@/assets/ng-bukka-stew-beans.jpg";
import grilledFishPlantain from "@/assets/ng-grilled-fish-plantain.jpg";
import afangSoup from "@/assets/ng-afang-soup.jpg";
import ohaSoup from "@/assets/ng-oha-soup.jpg";
import ekpangNkukwo from "@/assets/ng-ekpang-nkukwo.jpg";
import kilishi from "@/assets/ng-kilishi.jpg";

export type PriceBand = "0-1000" | "1000-3000" | "3000-5000" | "5000+";
export type MealTime = "breakfast" | "lunch" | "dinner" | "snack";
export type BodyType = "lean" | "average" | "curvy" | "athletic" | "big";
export type MealGoal =
  | "lighter"
  | "balanced"
  | "energy"
  | "protein"
  | "comfort"
  | "save_money";

export interface Dish {
  id: string;
  name: string;
  note: string;
  img: string;
  minutes: number;
  price: PriceBand;
  spice: 1 | 2 | 3 | 4 | 5;
  vegetarian: boolean;
  seafood: boolean;
  peanut: boolean;
  buyFriendly: boolean;
  region: string;
  category:
    | "rice"
    | "swallow"
    | "beans"
    | "street"
    | "soup"
    | "snack"
    | "grill"
    | "stew";
  mealTimes: MealTime[];
  goals: MealGoal[];
  bodyTypes: BodyType[];
  ingredients: string[];
  sides: string[];
  allergens: string[];
  nutrition: {
    calories: "light" | "moderate" | "hearty";
    protein: "low" | "medium" | "high";
    carbs: "low" | "medium" | "high";
  };
  tags: string[];
}

export const bodyTypes = [
  {
    value: "lean",
    label: "Lean frame",
    note: "Needs steady energy and enough protein.",
  },
  {
    value: "average",
    label: "Average build",
    note: "Balanced portions work best.",
  },
  {
    value: "curvy",
    label: "Curvy build",
    note: "Lighter dinners and high-satiety meals help.",
  },
  {
    value: "athletic",
    label: "Athletic build",
    note: "Protein and recovery meals matter.",
  },
  {
    value: "big",
    label: "Big build",
    note: "Filling meals with controlled starch portions.",
  },
] as const;

export const mealSlots = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
] as const;

export const priceLabel: Record<PriceBand, string> = {
  "0-1000": "Under ₦1,000",
  "1000-3000": "₦1,000–₦3,000",
  "3000-5000": "₦3,000–₦5,000",
  "5000+": "₦5,000+",
};

const commonBodyTypes: BodyType[] = [
  "lean",
  "average",
  "curvy",
  "athletic",
  "big",
];

export const dishes: Dish[] = [
  {
    id: "jollof",
    name: "Party jollof",
    note: "Smoky rice with pepper base and soft Sunday energy",
    img: jollof,
    minutes: 45,
    price: "1000-3000",
    spice: 3,
    vegetarian: false,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Lagos party table",
    category: "rice",
    mealTimes: ["lunch", "dinner"],
    goals: ["balanced", "comfort", "energy"],
    bodyTypes: ["lean", "average", "athletic"],
    ingredients: [
      "long-grain rice",
      "tomatoes",
      "tatase",
      "scotch bonnet",
      "onion",
      "stock",
      "thyme",
      "bay leaf",
      "curry powder",
      "chicken",
      "vegetable oil",
    ],
    sides: ["fried plantain", "coleslaw", "grilled chicken"],
    allergens: [],
    nutrition: { calories: "hearty", protein: "medium", carbs: "high" },
    tags: ["party", "smoky", "classic"],
  },
  {
    id: "egusi",
    name: "Egusi & pounded yam",
    note: "Thick melon soup for a filling, proper meal",
    img: egusi,
    minutes: 60,
    price: "3000-5000",
    spice: 3,
    vegetarian: false,
    seafood: true,
    peanut: false,
    buyFriendly: true,
    region: "South-west and south-east staple",
    category: "swallow",
    mealTimes: ["lunch", "dinner"],
    goals: ["comfort", "energy", "protein"],
    bodyTypes: ["lean", "athletic", "big"],
    ingredients: [
      "egusi",
      "palm oil",
      "ugu",
      "stockfish",
      "dry fish",
      "beef",
      "crayfish",
      "pepper",
      "onion",
      "seasoning",
      "yam flour",
    ],
    sides: ["pounded yam", "eba", "amala"],
    allergens: ["seafood"],
    nutrition: { calories: "hearty", protein: "high", carbs: "high" },
    tags: ["filling", "swallow", "soup"],
  },
  {
    id: "suya",
    name: "Suya",
    note: "Peppery evening street grill with yaji and onions",
    img: suya,
    minutes: 15,
    price: "1000-3000",
    spice: 5,
    vegetarian: false,
    seafood: false,
    peanut: true,
    buyFriendly: true,
    region: "Northern grill culture",
    category: "street",
    mealTimes: ["dinner", "snack"],
    goals: ["protein", "comfort"],
    bodyTypes: ["average", "athletic", "big"],
    ingredients: [
      "beef",
      "yaji spice",
      "groundnut powder",
      "ginger",
      "garlic",
      "cayenne",
      "salt",
      "onion",
      "tomatoes",
      "cabbage",
    ],
    sides: ["onions", "cabbage", "cold zobo"],
    allergens: ["peanut"],
    nutrition: { calories: "moderate", protein: "high", carbs: "low" },
    tags: ["quick", "buy", "pepper"],
  },
  {
    id: "ofada",
    name: "Ofada & ayamase",
    note: "Local rice with green pepper sauce and deep flavour",
    img: ofada,
    minutes: 50,
    price: "3000-5000",
    spice: 5,
    vegetarian: false,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Ogun favourite",
    category: "rice",
    mealTimes: ["lunch", "dinner"],
    goals: ["comfort", "energy"],
    bodyTypes: ["lean", "average", "athletic"],
    ingredients: [
      "ofada rice",
      "green bell pepper",
      "scotch bonnet",
      "locust beans",
      "palm oil",
      "assorted meat",
      "boiled eggs",
      "onion",
      "crayfish",
      "stock",
    ],
    sides: ["plantain", "boiled egg"],
    allergens: [],
    nutrition: { calories: "hearty", protein: "high", carbs: "high" },
    tags: ["spicy", "local rice", "sauce"],
  },
  {
    id: "moimoi",
    name: "Moi moi",
    note: "Steamed beans, soft texture, gentle but satisfying",
    img: moimoi,
    minutes: 60,
    price: "0-1000",
    spice: 1,
    vegetarian: true,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Everyday Nigerian home",
    category: "beans",
    mealTimes: ["breakfast", "lunch", "dinner"],
    goals: ["lighter", "balanced", "protein"],
    bodyTypes: ["average", "curvy", "big", "athletic"],
    ingredients: [
      "peeled beans",
      "tatase",
      "onion",
      "pepper",
      "vegetable oil",
      "seasoning",
      "egg",
      "fish",
      "crayfish",
    ],
    sides: ["pap", "custard", "jollof rice", "garri"],
    allergens: ["egg", "seafood optional"],
    nutrition: { calories: "moderate", protein: "high", carbs: "medium" },
    tags: ["veg", "cheap", "protein"],
  },
  {
    id: "peppersoup",
    name: "Goat pepper soup",
    note: "Light broth that clears the head and warms the evening",
    img: peppersoup,
    minutes: 40,
    price: "3000-5000",
    spice: 5,
    vegetarian: false,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Delta and eastern bars",
    category: "soup",
    mealTimes: ["dinner"],
    goals: ["lighter", "protein", "comfort"],
    bodyTypes: ["average", "curvy", "athletic", "big"],
    ingredients: [
      "goat meat",
      "pepper soup spice",
      "scent leaf",
      "uziza",
      "onion",
      "scotch bonnet",
      "ginger",
      "garlic",
      "seasoning",
    ],
    sides: ["boiled yam", "plantain", "agidi"],
    allergens: [],
    nutrition: { calories: "light", protein: "high", carbs: "low" },
    tags: ["light", "broth", "pepper"],
  },
  {
    id: "akara",
    name: "Akara & pap",
    note: "Morning bean fritters with soft pap",
    img: akara,
    minutes: 25,
    price: "0-1000",
    spice: 1,
    vegetarian: true,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Street breakfast",
    category: "beans",
    mealTimes: ["breakfast", "snack"],
    goals: ["balanced", "comfort"],
    bodyTypes: commonBodyTypes,
    ingredients: [
      "peeled beans",
      "onion",
      "scotch bonnet",
      "salt",
      "vegetable oil",
      "ogi",
      "sugar optional",
      "milk optional",
    ],
    sides: ["pap", "custard", "bread"],
    allergens: [],
    nutrition: { calories: "moderate", protein: "medium", carbs: "medium" },
    tags: ["breakfast", "cheap", "quick"],
  },
  {
    id: "asun",
    name: "Asun",
    note: "Smoked goat tossed in hot pepper and onions",
    img: asun,
    minutes: 35,
    price: "3000-5000",
    spice: 5,
    vegetarian: false,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "South-west small chops",
    category: "grill",
    mealTimes: ["dinner", "snack"],
    goals: ["protein", "comfort"],
    bodyTypes: ["average", "athletic", "big"],
    ingredients: [
      "goat meat",
      "habanero",
      "onion",
      "bell pepper",
      "ginger",
      "garlic",
      "vegetable oil",
      "seasoning",
    ],
    sides: ["plantain", "fried yam", "soft drink"],
    allergens: [],
    nutrition: { calories: "moderate", protein: "high", carbs: "low" },
    tags: ["small chops", "smoky", "hot"],
  },
  {
    id: "dodo",
    name: "Dodo",
    note: "Sweet fried plantain for a quick craving",
    img: dodo,
    minutes: 15,
    price: "0-1000",
    spice: 1,
    vegetarian: true,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Everywhere",
    category: "snack",
    mealTimes: ["breakfast", "lunch", "snack"],
    goals: ["comfort", "energy"],
    bodyTypes: ["lean", "average", "athletic"],
    ingredients: ["ripe plantain", "vegetable oil", "salt"],
    sides: ["eggs", "beans", "stew"],
    allergens: [],
    nutrition: { calories: "moderate", protein: "low", carbs: "high" },
    tags: ["veg", "quick", "sweet"],
  },
  {
    id: "beans-porridge",
    name: "Ewa riro",
    note: "Peppered beans porridge that holds you for hours",
    img: ewaRiro,
    minutes: 55,
    price: "0-1000",
    spice: 3,
    vegetarian: true,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Yoruba home cooking",
    category: "beans",
    mealTimes: ["lunch", "dinner"],
    goals: ["balanced", "protein", "save_money"],
    bodyTypes: ["average", "curvy", "athletic", "big"],
    ingredients: [
      "brown beans",
      "palm oil",
      "tomatoes",
      "pepper",
      "onion",
      "crayfish optional",
      "seasoning",
      "plantain optional",
    ],
    sides: ["garri", "bread", "dodo"],
    allergens: ["seafood optional"],
    nutrition: { calories: "moderate", protein: "high", carbs: "medium" },
    tags: ["cheap", "filling", "protein"],
  },
  {
    id: "yam-egg",
    name: "Boiled yam & egg sauce",
    note: "Simple market breakfast with tomato egg sauce",
    img: yamEggSauce,
    minutes: 30,
    price: "1000-3000",
    spice: 2,
    vegetarian: true,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Everyday breakfast",
    category: "stew",
    mealTimes: ["breakfast", "lunch"],
    goals: ["balanced", "energy"],
    bodyTypes: ["lean", "average", "athletic"],
    ingredients: [
      "yam",
      "eggs",
      "tomatoes",
      "onion",
      "pepper",
      "vegetable oil",
      "seasoning",
    ],
    sides: ["tea", "avocado"],
    allergens: ["egg"],
    nutrition: { calories: "moderate", protein: "medium", carbs: "high" },
    tags: ["breakfast", "home", "simple"],
  },
  {
    id: "okra-soup",
    name: "Okra soup & eba",
    note: "Draw soup with seafood notes and quick swallow comfort",
    img: okraEba,
    minutes: 35,
    price: "1000-3000",
    spice: 3,
    vegetarian: false,
    seafood: true,
    peanut: false,
    buyFriendly: true,
    region: "Southern staple",
    category: "swallow",
    mealTimes: ["lunch", "dinner"],
    goals: ["balanced", "comfort"],
    bodyTypes: ["average", "big", "athletic"],
    ingredients: [
      "okra",
      "palm oil",
      "beef",
      "fish",
      "crayfish",
      "ugu",
      "pepper",
      "onion",
      "garri",
    ],
    sides: ["eba", "semovita", "fufu"],
    allergens: ["seafood"],
    nutrition: { calories: "moderate", protein: "high", carbs: "medium" },
    tags: ["swallow", "quick soup", "draw"],
  },
  {
    id: "banga",
    name: "Banga soup & starch",
    note: "Palm fruit soup with rich Niger Delta depth",
    img: bangaStarch,
    minutes: 70,
    price: "3000-5000",
    spice: 4,
    vegetarian: false,
    seafood: true,
    peanut: false,
    buyFriendly: true,
    region: "Niger Delta",
    category: "swallow",
    mealTimes: ["lunch", "dinner"],
    goals: ["comfort", "energy"],
    bodyTypes: ["lean", "average", "athletic"],
    ingredients: [
      "palm fruit extract",
      "banga spice",
      "beletientien",
      "catfish",
      "beef",
      "crayfish",
      "pepper",
      "onion",
      "starch",
    ],
    sides: ["starch", "eba", "rice"],
    allergens: ["seafood"],
    nutrition: { calories: "hearty", protein: "high", carbs: "high" },
    tags: ["rich", "delta", "weekend"],
  },
  {
    id: "nkwobi",
    name: "Nkwobi",
    note: "Cow foot in spicy palm sauce for slow evening gist",
    img: nkwobiImg,
    minutes: 80,
    price: "3000-5000",
    spice: 4,
    vegetarian: false,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Igbo lounge classic",
    category: "street",
    mealTimes: ["dinner", "snack"],
    goals: ["comfort", "protein"],
    bodyTypes: ["average", "athletic", "big"],
    ingredients: [
      "cow foot",
      "palm oil",
      "potash",
      "ehuru",
      "utazi",
      "pepper",
      "onion",
      "crayfish optional",
    ],
    sides: ["garden egg", "onions", "cold malt"],
    allergens: ["seafood optional"],
    nutrition: { calories: "hearty", protein: "high", carbs: "low" },
    tags: ["evening", "spicy", "protein"],
  },
  {
    id: "edikangikong",
    name: "Edikang ikong",
    note: "Vegetable-rich soup with serious protein and less starch",
    img: edikangIkong,
    minutes: 65,
    price: "5000+",
    spice: 3,
    vegetarian: false,
    seafood: true,
    peanut: false,
    buyFriendly: true,
    region: "Calabar table",
    category: "soup",
    mealTimes: ["lunch", "dinner"],
    goals: ["lighter", "protein", "balanced"],
    bodyTypes: ["curvy", "athletic", "big"],
    ingredients: [
      "ugu",
      "waterleaf",
      "palm oil",
      "stockfish",
      "periwinkle",
      "beef",
      "crayfish",
      "pepper",
      "onion",
    ],
    sides: ["small eba", "wheat swallow", "plantain"],
    allergens: ["seafood"],
    nutrition: { calories: "moderate", protein: "high", carbs: "low" },
    tags: ["vegetable", "protein", "premium"],
  },
  {
    id: "fried-rice",
    name: "Nigerian fried rice",
    note: "Colourful rice with vegetables, liver and sweet crunch",
    img: friedRice,
    minutes: 45,
    price: "1000-3000",
    spice: 2,
    vegetarian: false,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Party companion",
    category: "rice",
    mealTimes: ["lunch", "dinner"],
    goals: ["balanced", "energy"],
    bodyTypes: ["lean", "average", "athletic"],
    ingredients: [
      "rice",
      "carrots",
      "green peas",
      "sweet corn",
      "spring onion",
      "liver",
      "stock",
      "curry powder",
      "thyme",
      "green pepper",
    ],
    sides: ["chicken", "coleslaw", "plantain"],
    allergens: [],
    nutrition: { calories: "hearty", protein: "medium", carbs: "high" },
    tags: ["party", "colourful", "rice"],
  },
  {
    id: "amala-ewedu",
    name: "Amala, ewedu & gbegiri",
    note: "Ibadan comfort with layered soups and soft swallow",
    img: amalaEweduGbegiri,
    minutes: 55,
    price: "1000-3000",
    spice: 3,
    vegetarian: false,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Ibadan classic",
    category: "swallow",
    mealTimes: ["lunch", "dinner"],
    goals: ["comfort", "energy"],
    bodyTypes: ["lean", "average", "big"],
    ingredients: [
      "yam flour",
      "ewedu",
      "beans",
      "pepper stew",
      "palm oil",
      "beef",
      "ponmo",
      "iru",
      "onion",
    ],
    sides: ["assorted meat", "small plantain"],
    allergens: [],
    nutrition: { calories: "hearty", protein: "medium", carbs: "high" },
    tags: ["swallow", "classic", "soup trio"],
  },
  {
    id: "eba-ogbono",
    name: "Ogbono soup & eba",
    note: "Draw soup with nutty ogbono and soft swallow",
    img: ogbonoEba,
    minutes: 45,
    price: "1000-3000",
    spice: 2,
    vegetarian: false,
    seafood: true,
    peanut: false,
    buyFriendly: true,
    region: "Across Nigeria",
    category: "swallow",
    mealTimes: ["lunch", "dinner"],
    goals: ["comfort", "balanced"],
    bodyTypes: ["average", "big", "athletic"],
    ingredients: [
      "ogbono",
      "palm oil",
      "beef",
      "dry fish",
      "crayfish",
      "ugu",
      "pepper",
      "onion",
      "garri",
    ],
    sides: ["eba", "fufu", "semovita"],
    allergens: ["seafood"],
    nutrition: { calories: "moderate", protein: "high", carbs: "medium" },
    tags: ["draw", "swallow", "comfort"],
  },
  {
    id: "catfish-peppersoup",
    name: "Catfish pepper soup",
    note: "Clean spicy fish broth for a lighter night",
    img: catfishPepperSoup,
    minutes: 35,
    price: "3000-5000",
    spice: 5,
    vegetarian: false,
    seafood: true,
    peanut: false,
    buyFriendly: true,
    region: "Waterside favourite",
    category: "soup",
    mealTimes: ["dinner"],
    goals: ["lighter", "protein"],
    bodyTypes: ["average", "curvy", "athletic", "big"],
    ingredients: [
      "catfish",
      "pepper soup spice",
      "scent leaf",
      "uziza",
      "onion",
      "scotch bonnet",
      "ginger",
      "garlic",
    ],
    sides: ["boiled yam", "plantain", "agidi"],
    allergens: ["seafood"],
    nutrition: { calories: "light", protein: "high", carbs: "low" },
    tags: ["fish", "light", "pepper"],
  },
  {
    id: "white-rice-stew",
    name: "Rice & stew",
    note: "Simple weekday rice with tomato stew and protein",
    img: riceStew,
    minutes: 35,
    price: "1000-3000",
    spice: 2,
    vegetarian: false,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Everyday home plate",
    category: "rice",
    mealTimes: ["lunch", "dinner"],
    goals: ["balanced", "comfort"],
    bodyTypes: commonBodyTypes,
    ingredients: [
      "rice",
      "tomatoes",
      "tatase",
      "pepper",
      "onion",
      "vegetable oil",
      "chicken",
      "thyme",
      "curry powder",
      "seasoning",
    ],
    sides: ["plantain", "beans", "salad"],
    allergens: [],
    nutrition: { calories: "moderate", protein: "medium", carbs: "high" },
    tags: ["weekday", "simple", "rice"],
  },
  {
    id: "tuwo-miyan-kuka",
    name: "Tuwo & miyan kuka",
    note: "Northern swallow with baobab leaf soup",
    img: tuwoMiyanKuka,
    minutes: 55,
    price: "1000-3000",
    spice: 2,
    vegetarian: false,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Northern comfort",
    category: "swallow",
    mealTimes: ["lunch", "dinner"],
    goals: ["comfort", "energy"],
    bodyTypes: ["lean", "average", "big"],
    ingredients: [
      "rice flour",
      "kuka powder",
      "dawadawa",
      "beef",
      "palm oil",
      "pepper",
      "onion",
      "seasoning",
    ],
    sides: ["beef", "small salad"],
    allergens: [],
    nutrition: { calories: "hearty", protein: "medium", carbs: "high" },
    tags: ["northern", "swallow", "earthy"],
  },
  {
    id: "abacha",
    name: "Abacha",
    note: "African salad with cassava ribbons and crunchy toppings",
    img: abachaImg,
    minutes: 25,
    price: "1000-3000",
    spice: 3,
    vegetarian: true,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Eastern favourite",
    category: "snack",
    mealTimes: ["lunch", "snack"],
    goals: ["lighter", "balanced"],
    bodyTypes: ["average", "curvy", "big"],
    ingredients: [
      "abacha",
      "ugba",
      "palm oil",
      "potash",
      "utazi",
      "garden egg",
      "onion",
      "pepper",
      "crayfish optional",
    ],
    sides: ["fish", "kpomo", "garden egg"],
    allergens: ["seafood optional"],
    nutrition: { calories: "moderate", protein: "medium", carbs: "medium" },
    tags: ["salad", "eastern", "quick"],
  },
  {
    id: "plantain-porridge",
    name: "Plantain porridge",
    note: "Ripe or unripe plantain simmered in pepper sauce",
    img: plantainPorridge,
    minutes: 40,
    price: "1000-3000",
    spice: 2,
    vegetarian: true,
    seafood: false,
    peanut: false,
    buyFriendly: false,
    region: "Home pot meal",
    category: "stew",
    mealTimes: ["lunch", "dinner"],
    goals: ["lighter", "balanced"],
    bodyTypes: ["average", "curvy", "big"],
    ingredients: [
      "plantain",
      "palm oil",
      "tomatoes",
      "pepper",
      "onion",
      "ugu",
      "crayfish optional",
      "fish optional",
    ],
    sides: ["avocado", "small fish"],
    allergens: ["seafood optional"],
    nutrition: { calories: "moderate", protein: "medium", carbs: "medium" },
    tags: ["home", "plantain", "light"],
  },
  {
    id: "bukka-stew",
    name: "Bukka stew with beans",
    note: "Deep red stew, soft beans and proper pepper aroma",
    img: bukkaStewBeans,
    minutes: 50,
    price: "1000-3000",
    spice: 4,
    vegetarian: false,
    seafood: false,
    peanut: false,
    buyFriendly: true,
    region: "Lagos bukka",
    category: "beans",
    mealTimes: ["lunch", "dinner"],
    goals: ["balanced", "protein", "comfort"],
    bodyTypes: ["average", "athletic", "big"],
    ingredients: [
      "beans",
      "tomatoes",
      "tatase",
      "scotch bonnet",
      "palm oil",
      "beef",
      "ponmo",
      "onion",
      "seasoning",
    ],
    sides: ["bread", "rice", "plantain"],
    allergens: [],
    nutrition: { calories: "hearty", protein: "high", carbs: "medium" },
    tags: ["bukka", "beans", "pepper"],
  },
  {
    id: "grilled-fish",
    name: "Grilled fish & plantain",
    note: "Peppered fish with sweet plantain and light crunch",
    img: grilledFishPlantain,
    minutes: 45,
    price: "3000-5000",
    spice: 4,
    vegetarian: false,
    seafood: true,
    peanut: false,
    buyFriendly: true,
    region: "Night grill spots",
    category: "grill",
    mealTimes: ["dinner"],
    goals: ["protein", "lighter", "balanced"],
    bodyTypes: ["average", "curvy", "athletic", "big"],
    ingredients: [
      "croaker or tilapia",
      "pepper",
      "onion",
      "ginger",
      "garlic",
      "lemon",
      "vegetable oil",
      "plantain",
      "cabbage",
    ],
    sides: ["plantain", "coleslaw", "pepper sauce"],
    allergens: ["seafood"],
    nutrition: { calories: "moderate", protein: "high", carbs: "medium" },
    tags: ["fish", "grill", "dinner"],
  },
  {
    id: "afang-soup",
    name: "Afang soup",
    note: "Efik vegetable soup layered with afang leaves and waterleaf",
    img: afangSoup,
    minutes: 60,
    price: "3000-5000",
    spice: 3,
    vegetarian: false,
    seafood: true,
    peanut: false,
    buyFriendly: true,
    region: "Calabar and Efik kitchens",
    category: "soup",
    mealTimes: ["lunch", "dinner"],
    goals: ["protein", "balanced", "comfort"],
    bodyTypes: ["curvy", "athletic", "big"],
    ingredients: [
      "afang leaves",
      "waterleaf",
      "palm oil",
      "periwinkle",
      "stockfish",
      "beef",
      "crayfish",
      "pepper",
      "onion",
      "seasoning",
    ],
    sides: ["eba", "fufu", "pounded yam"],
    allergens: ["seafood"],
    nutrition: { calories: "moderate", protein: "high", carbs: "low" },
    tags: ["vegetable", "efik", "protein"],
  },
  {
    id: "oha-soup",
    name: "Oha soup & fufu",
    note: "Delicate southeastern soup thickened with cocoyam and oha leaves",
    img: ohaSoup,
    minutes: 50,
    price: "1000-3000",
    spice: 2,
    vegetarian: false,
    seafood: true,
    peanut: false,
    buyFriendly: true,
    region: "South-east home cooking",
    category: "soup",
    mealTimes: ["lunch", "dinner"],
    goals: ["balanced", "comfort"],
    bodyTypes: ["average", "athletic", "big"],
    ingredients: [
      "oha leaves",
      "cocoyam",
      "palm oil",
      "stockfish",
      "dry fish",
      "crayfish",
      "uziza",
      "ogiri",
      "pepper",
      "seasoning",
    ],
    sides: ["fufu", "eba", "semovita"],
    allergens: ["seafood"],
    nutrition: { calories: "moderate", protein: "high", carbs: "medium" },
    tags: ["southeastern", "delicate", "swallow"],
  },
  {
    id: "ekpang-nkukwo",
    name: "Ekpang nkukwo",
    note: "Grated cocoyam parcels wrapped in leaves, slow-cooked with seafood",
    img: ekpangNkukwo,
    minutes: 90,
    price: "3000-5000",
    spice: 3,
    vegetarian: false,
    seafood: true,
    peanut: false,
    buyFriendly: false,
    region: "Cross River and Akwa Ibom",
    category: "stew",
    mealTimes: ["lunch", "dinner"],
    goals: ["comfort", "energy"],
    bodyTypes: ["lean", "average", "athletic"],
    ingredients: [
      "cocoyam",
      "cocoyam leaves",
      "palm oil",
      "periwinkle",
      "dry fish",
      "crayfish",
      "beef",
      "pepper",
      "onion",
      "seasoning",
    ],
    sides: ["extra periwinkle", "cold drink"],
    allergens: ["seafood"],
    nutrition: { calories: "hearty", protein: "high", carbs: "medium" },
    tags: ["efik", "wrapped", "weekend"],
  },
  {
    id: "kilishi",
    name: "Kilishi",
    note: "Sun-dried spiced beef sheets for a fiery protein snack",
    img: kilishi,
    minutes: 15,
    price: "1000-3000",
    spice: 4,
    vegetarian: false,
    seafood: false,
    peanut: true,
    buyFriendly: true,
    region: "Northern snack stalls",
    category: "street",
    mealTimes: ["snack", "dinner"],
    goals: ["protein", "comfort"],
    bodyTypes: ["average", "athletic", "big"],
    ingredients: [
      "beef",
      "yaji spice",
      "groundnut powder",
      "ginger",
      "garlic",
      "cayenne",
      "salt",
    ],
    sides: ["onions", "cold zobo"],
    allergens: ["peanut"],
    nutrition: { calories: "light", protein: "high", carbs: "low" },
    tags: ["northern", "dried", "spicy", "quick"],
  },
];



export interface PickProfile {
  goal: string | null;
  budget_range: string | null;
  cook_time: string | null;
  cook_or_buy: string | null;
  dietary: string[] | null;
  spice_level: number | null;
  favourite_dishes: string[] | null;
}

const priceOrder: PriceBand[] = ["0-1000", "1000-3000", "3000-5000", "5000+"];

export function getDishById(id: string) {
  return dishes.find((dish) => dish.id === id) ?? null;
}

export function scoreDishes(
  profile: PickProfile,
  bodyType?: BodyType | null
): Dish[] {
  const dietary = profile.dietary ?? [];
  const budgetIdx = profile.budget_range
    ? priceOrder.indexOf(profile.budget_range as PriceBand)
    : 1;
  const maxMinutes =
    profile.cook_time === "quick_15"
      ? 20
      : profile.cook_time === "up_to_45"
      ? 50
      : 999;
  const favourites = profile.favourite_dishes ?? [];

  const eligible = dishes.filter((d) => {
    if (dietary.includes("vegetarian") && !d.vegetarian) return false;
    if (dietary.includes("no_seafood") && d.seafood) return false;
    if (dietary.includes("peanut_allergy") && d.peanut) return false;
    return true;
  });

  const scored = eligible.map((d) => {
    let score = 0;
    const reasons: string[] = [];

    if (profile.budget_range) {
      const dishIdx = priceOrder.indexOf(d.price);
      if (dishIdx <= (budgetIdx < 0 ? 1 : budgetIdx)) {
        score += 3;
        reasons.push("inside your budget");
      }
    }
    if (profile.cook_time && d.minutes <= maxMinutes) {
      score += 2;
      reasons.push(
        profile.cook_time === "quick_15" ? "ready in minutes" : "fits your time"
      );
    }
    if (profile.cook_or_buy === "buy" && d.buyFriendly) {
      score += 1;
      reasons.push("easy to buy near you");
    }
    if (profile.spice_level != null) {
      const gap = Math.abs(d.spice - profile.spice_level);
      if (gap === 0) {
        score += 2;
        reasons.push("matches your pepper level");
      } else if (gap === 1) {
        score += 1;
      }
    }
    if (favourites.includes(d.id)) {
      score += 2;
      reasons.push("one of your favourites");
    }
    if (profile.goal === "save_money" && d.price === "0-1000") {
      score += 2;
      reasons.push("kind to your pocket");
    }
    if (
      (profile.goal === "lose" || profile.goal === "healthier") &&
      d.goals.includes("lighter")
    ) {
      score += 2;
      reasons.push("on the lighter side");
    }
    if (profile.goal === "gain" && d.goals.includes("energy")) {
      score += 2;
      reasons.push("good energy for weight gain");
    }
    if (bodyType && d.bodyTypes.includes(bodyType)) {
      score += 2;
      reasons.push("fits your body type setting");
    }

    return { dish: d, score, reasons };
  });

  scored.sort((a, b) => b.score - a.score || a.dish.minutes - b.dish.minutes);
  return scored.map((s) => s.dish);
}

export function reasonsFor(
  dish: Dish,
  profile: PickProfile,
  bodyType?: BodyType | null
): string[] {
  const reasons: string[] = [];
  if (
    profile.budget_range &&
    priceOrder.indexOf(dish.price) <=
      priceOrder.indexOf(profile.budget_range as PriceBand)
  ) {
    reasons.push("it's inside your budget");
  }
  if (profile.cook_time === "quick_15" && dish.minutes <= 20)
    reasons.push("it's ready fast");
  if (profile.cook_time === "up_to_45" && dish.minutes <= 50)
    reasons.push("it fits your evening");
  if (
    profile.spice_level != null &&
    Math.abs(dish.spice - profile.spice_level) === 0
  ) {
    reasons.push("the pepper level is exactly yours");
  }
  if ((profile.favourite_dishes ?? []).includes(dish.id))
    reasons.push("it's on your favourites list");
  if (bodyType && dish.bodyTypes.includes(bodyType))
    reasons.push("it matches your body type setting");
  if (reasons.length === 0) reasons.push("it's a solid plate any night");
  return reasons;
}

export function dishMatchesDateRange(eatenAt: string, days: number | "all") {
  if (days === "all") return true;
  const date = new Date(eatenAt).getTime();
  if (Number.isNaN(date)) return false;
  return Date.now() - date <= days * 24 * 60 * 60 * 1000;
}
