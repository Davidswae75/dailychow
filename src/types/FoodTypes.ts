// nigerianFoods.ts
// Extensive list of popular Nigerian cooked foods
// Grouped by fundamental base ingredient for easy selection

export type FoodCategory =
  | "Rice"
  | "Yam"
  | "Cassava / Swallow"
  | "Plantain"
  | "Beans"
  | "Soups & Stews"
  | "Corn / Maize"
  | "Other Staples";

export interface FoodType {
  id: string;
  name: string;
  category: FoodCategory;
  description?: string; // short optional note
}

export const nigerianFoods: FoodType[] = [
  // ========== RICE ==========
  { id: "jollof-rice", name: "Jollof Rice", category: "Rice", description: "Classic party rice in tomato-pepper sauce" },
  { id: "fried-rice", name: "Fried Rice", category: "Rice", description: "Colourful rice with veggies, liver or prawns" },
  { id: "coconut-rice", name: "Coconut Rice", category: "Rice", description: "Rice cooked with coconut milk" },
  { id: "ofada-rice", name: "Ofada Rice", category: "Rice", description: "Local brown rice usually with ayamase stew" },
  { id: "white-rice-stew", name: "White Rice & Stew", category: "Rice", description: "Plain rice served with tomato stew" },
  { id: "native-jollof", name: "Native / Palm Oil Jollof", category: "Rice", description: "Jollof made with palm oil and local spices" },
  { id: "coconut-jollof", name: "Coconut Jollof Rice", category: "Rice", description: "Jollof cooked with coconut milk" },
  { id: "rice-and-beans", name: "Rice and Beans", category: "Rice", description: "Rice cooked together with beans" },
  { id: "tuwo-shinkafa", name: "Tuwo Shinkafa", category: "Rice", description: "Soft rice swallow popular in the North" },

  // ========== YAM ==========
  { id: "pounded-yam", name: "Pounded Yam (Iyan)", category: "Yam", description: "Smooth stretchy swallow made from boiled yam" },
  { id: "yam-porridge", name: "Yam Porridge (Asaro)", category: "Yam", description: "Soft yam cooked in palm oil and pepper" },
  { id: "boiled-yam", name: "Boiled Yam", category: "Yam", description: "Plain boiled yam served with sauce or stew" },
  { id: "fried-yam", name: "Fried Yam", category: "Yam", description: "Deep-fried yam slices" },
  { id: "roasted-yam", name: "Roasted Yam", category: "Yam", description: "Charcoal-roasted yam (often with fish)" },
  { id: "yam-and-egg", name: "Yam and Egg Sauce", category: "Yam", description: "Boiled or fried yam with egg sauce" },
  { id: "yam-pepper-soup", name: "Yam Pepper Soup", category: "Yam", description: "Spicy yam cooked in pepper soup broth" },

  // ========== CASSAVA / SWALLOW ==========
  { id: "eba", name: "Eba (Garri)", category: "Cassava / Swallow", description: "Garri mixed with hot water into swallow" },
  { id: "fufu", name: "Fufu (Akpu)", category: "Cassava / Swallow", description: "Soft fermented cassava swallow" },
  { id: "amala", name: "Amala", category: "Cassava / Swallow", description: "Dark swallow from yam or plantain flour" },
  { id: "semolina", name: "Semolina / Semovita", category: "Cassava / Swallow", description: "Smooth wheat-based swallow" },
  { id: "wheat-swallow", name: "Wheat Swallow", category: "Cassava / Swallow", description: "Whole wheat flour swallow" },
  { id: "pounded-cassava", name: "Pounded Cassava", category: "Cassava / Swallow", description: "Traditional cassava fufu" },
  { id: "lafun", name: "Lafun", category: "Cassava / Swallow", description: "White cassava flour swallow" },

  // ========== PLANTAIN ==========
  { id: "dodo", name: "Fried Plantain (Dodo)", category: "Plantain", description: "Ripe plantain fried until golden" },
  { id: "boiled-plantain", name: "Boiled Plantain", category: "Plantain", description: "Soft boiled ripe or unripe plantain" },
  { id: "plantain-porridge", name: "Plantain Porridge", category: "Plantain", description: "Unripe plantain cooked in palm oil sauce" },
  { id: "plantain-and-egg", name: "Plantain and Egg", category: "Plantain", description: "Fried or boiled plantain with egg sauce" },
  { id: "boli", name: "Boli (Roasted Plantain)", category: "Plantain", description: "Charcoal-roasted plantain" },
  { id: "plantain-chips", name: "Plantain Chips", category: "Plantain", description: "Thin crispy fried plantain slices" },

  // ========== BEANS ==========
  { id: "moi-moi", name: "Moi Moi (Moin Moin)", category: "Beans", description: "Steamed bean pudding" },
  { id: "akara", name: "Akara", category: "Beans", description: "Deep-fried bean cakes / fritters" },
  { id: "beans-porridge", name: "Beans Porridge", category: "Beans", description: "Soft cooked beans in palm oil and pepper" },
  { id: "ewa-agoyin", name: "Ewa Agoyin", category: "Beans", description: "Mashed beans with special pepper sauce" },
  { id: "beans-and-plantain", name: "Beans and Plantain", category: "Beans", description: "Beans cooked with ripe plantain" },
  { id: "adalu", name: "Adalu", category: "Beans", description: "Beans and corn cooked together" },
  { id: "okpa", name: "Okpa", category: "Beans", description: "Bambara nut pudding (popular in the East)" },

  // ========== SOUPS & STEWS ==========
  { id: "egusi-soup", name: "Egusi Soup", category: "Soups & Stews", description: "Melon seed soup with vegetables and meat" },
  { id: "okro-soup", name: "Okro / Okra Soup", category: "Soups & Stews", description: "Draw soup made with okra" },
  { id: "ogbono-soup", name: "Ogbono Soup", category: "Soups & Stews", description: "Draw soup from ground ogbono seeds" },
  { id: "efo-riro", name: "Efo Riro", category: "Soups & Stews", description: "Yoruba vegetable stew" },
  { id: "edikang-ikong", name: "Edikang Ikong", category: "Soups & Stews", description: "Rich vegetable soup with ugu and waterleaf" },
  { id: "afang-soup", name: "Afang Soup", category: "Soups & Stews", description: "Vegetable soup with afang leaves" },
  { id: "oha-soup", name: "Oha / Ora Soup", category: "Soups & Stews", description: "Igbo soup with oha leaves" },
  { id: "bitterleaf-soup", name: "Bitterleaf Soup (Ofe Onugbu)", category: "Soups & Stews", description: "Classic Igbo bitterleaf soup" },
  { id: "pepper-soup", name: "Pepper Soup", category: "Soups & Stews", description: "Light spicy broth (fish, goat, chicken)" },
  { id: "banga-soup", name: "Banga Soup (Ofe Akwu)", category: "Soups & Stews", description: "Palm fruit soup" },
  { id: "ewedu", name: "Ewedu Soup", category: "Soups & Stews", description: "Jute leaf soup (usually with amala)" },
  { id: "gbegiri", name: "Gbegiri", category: "Soups & Stews", description: "Bean soup (often with ewedu and stew)" },
  { id: "nsala-soup", name: "Nsala Soup (White Soup)", category: "Soups & Stews", description: "Light soup without palm oil" },
  { id: "tomato-stew", name: "Tomato Stew (Obe Ata)", category: "Soups & Stews", description: "Everyday red stew for rice or yam" },
  { id: "ayamase", name: "Ayamase (Ofada Stew)", category: "Soups & Stews", description: "Green pepper stew for ofada rice" },
  { id: "fisherman-soup", name: "Fisherman Soup", category: "Soups & Stews", description: "Seafood-rich soup from the riverine areas" },

  // ========== CORN / MAIZE ==========
  { id: "ogi", name: "Ogi / Akamu / Pap", category: "Corn / Maize", description: "Fermented corn porridge" },
  { id: "tuwo-masara", name: "Tuwo Masara", category: "Corn / Maize", description: "Corn flour swallow (Northern style)" },
  { id: "agidi", name: "Agidi / Eko", category: "Corn / Maize", description: "Firm corn pudding" },
  { id: "corn-porridge", name: "Fresh Corn Porridge", category: "Corn / Maize", description: "Fresh maize cooked with vegetables" },

  // ========== OTHER STAPLES ==========
  { id: "spaghetti", name: "Nigerian Spaghetti", category: "Other Staples", description: "Spaghetti cooked in spicy tomato sauce" },
  { id: "indomie", name: "Indomie (Nigerian Style)", category: "Other Staples", description: "Instant noodles with egg, veggies and spice" },
  { id: "bread-and-stew", name: "Agege Bread & Stew", category: "Other Staples", description: "Soft bread dipped in stew or sauce" },
  { id: "suya", name: "Suya", category: "Other Staples", description: "Spicy grilled meat skewers" },
  { id: "nkwobi", name: "Nkwobi", category: "Other Staples", description: "Spicy cow foot in palm oil sauce" },
  { id: "isi-ewu", name: "Isi Ewu", category: "Other Staples", description: "Spicy goat head delicacy" },
  { id: "abacha", name: "Abacha (African Salad)", category: "Other Staples", description: "Shredded cassava salad with palm oil" },
];

// Optional: quick lookup by category
export const foodsByCategory = {
  Rice: nigerianFoods.filter(f => f.category === "Rice"),
  Yam: nigerianFoods.filter(f => f.category === "Yam"),
  "Cassava / Swallow": nigerianFoods.filter(f => f.category === "Cassava / Swallow"),
  Plantain: nigerianFoods.filter(f => f.category === "Plantain"),
  Beans: nigerianFoods.filter(f => f.category === "Beans"),
  "Soups & Stews": nigerianFoods.filter(f => f.category === "Soups & Stews"),
  "Corn / Maize": nigerianFoods.filter(f => f.category === "Corn / Maize"),
  "Other Staples": nigerianFoods.filter(f => f.category === "Other Staples"),
};

export type FoodsByCategory = keyof typeof foodsByCategory