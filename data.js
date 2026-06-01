const GAME_TABLES = {
  cars: {
    v1: {
      "1-1": "❌ Nada",
      "1-2": "🎫 Tarjeta LSC",
      "1-3": "🏎️ GTR",
      "1-4": "🏎️ M8",
      "1-5": "🏎️ M3",
      "1-6": "❌ Nada",
      
      "2-1": "🏎️ SKYLINE",
      "2-2": "🏎️ RX7",
      "2-3": "❌ Nada",
      "2-4": "🏎️ PENUMBRA",
      "2-5": "🏎️ MK5 SUPRA",
      "2-6": "🏎️ RAM",

      "3-1": "❌ Nada",
      "3-2": "🏎️ URUS",
      "3-3": "🎫 Tarjeta LSC",
      "3-4": "🏎️ E46",
      "3-5": "❌ Nada",
      "3-6": "🏎️ MIATA",

      "4-1": "🏎️ PORSCHE",
      "4-2": "🎫 Tarjeta LSC",
      "4-3": "🏎️ EVO 10",
      "4-4": "🏎️ GTR",
      "4-5": "🏎️ M8",
      "4-6": "❌ Nada",

      "5-1": "🏎️ M3",
      "5-2": "🏎️ SKYLINE",
      "5-3": "🏎️ RX7",
      "5-4": "🎫 Tarjeta LSC",
      "5-5": "🏎️ PENUMBRA",
      "5-6": "🏎️ MK5 SUPRA",

      "6-1": "❌ Nada",
      "6-2": "🏎️ RAM",
      "6-3": "🏎️ URUS",
      "6-4": "🏎️ E46",
      "6-5": "🏎️ MIATA",
      "6-6": "🏎️ VARIS EVO X"
    },
    v2: {
      "1-1": "❌ Nada",
      "1-2": "🏎️ VEHITWI5",
      "1-3": "🎫 Tarjeta LSC",
      "1-4": "🏎️ VEHILAM",
      "1-5": "❌ Nada",
      "1-6": "🏎️ VEHIRSC",

      "2-1": "🏎️ VEHITWI5",
      "2-2": "❌ Nada",
      "2-3": "🏎️ VEHILEON",
      "2-4": "🎫 Tarjeta LSC",
      "2-5": "🏎️ VEHIKARI",
      "2-6": "❌ Nada",

      "3-1": "🏎️ VEHIELEG",
      "3-2": "🎫 Tarjeta LSC",
      "3-3": "❌ Nada",
      "3-4": "🏎️ VEHIRSC",
      "3-5": "❌ Nada",
      "3-6": "🏎️ VEHIPAREJA",

      "4-1": "🏎️ VEHILAM",
      "4-2": "❌ Nada",
      "4-3": "🎫 Tarjeta LSC",
      "4-4": "🏎️ VEHISX",
      "4-5": "❌ Nada",
      "4-6": "🏎️ VEHIZENTO",

      "5-1": "🏎️ VEHIGOL",
      "5-2": "❌ Nada",
      "5-3": "🏎️ VEHISUPERS",
      "5-4": "🎫 Tarjeta LSC",
      "5-5": "❌ Nada",
      "5-6": "🏎️ VEHILEON",

      "6-1": "🎫 Tarjeta LSC",
      "6-2": "❌ Nada",
      "6-3": "🏎️ VEHIPURA",
      "6-4": "❌ Nada",
      "6-5": "🏎️ VEHIPERSO",
      "6-6": "❌ Nada"
    }
  },

  funkos: {
    clasico: {
      "1-1": "❌ Nada",
      "1-2": "🎫 Tarjeta LSC",
      "1-3": "🎨 KOZZY",
      "1-4": "🎨 KAPO",
      "1-5": "🎨 MARIA",
      "1-6": "❌ Nada",

      "2-1": "🎨 BOMBERO",
      "2-2": "🎨 CARLOS",
      "2-3": "❌ Nada",
      "2-4": "🎨 AXEL",
      "2-5": "🎨 JOKER",
      "2-6": "🎨 MEL",

      "3-1": "❌ Nada",
      "3-2": "🎨 NAVARRO",
      "3-3": "🎫 Tarjeta LSC",
      "3-4": "🎨 KOZZY",
      "3-5": "❌ Nada",
      "3-6": "🎨 KAPO",

      "4-1": "🎨 MARIA",
      "4-2": "🎫 Tarjeta LSC",
      "4-3": "🎨 BOMBERO",
      "4-4": "🎨 CARLOS",
      "4-5": "🎨 AXEL",
      "4-6": "❌ Nada",

      "5-1": "🎨 JOKER",
      "5-2": "🎨 MEL",
      "5-3": "🎨 NAVARRO",
      "5-4": "🎫 Tarjeta LSC",
      "5-5": "🎨 KOZZY",
      "5-6": "🎨 KAPO",

      "6-1": "❌ Nada",
      "6-2": "🎨 MARIA",
      "6-3": "🎨 BOMBERO",
      "6-4": "🎨 CARLOS",
      "6-5": "🎨 AXEL",
      "6-6": "🎨 FURIOSA"
    },
    variado: {
      "1-1": "❌ Nada",
      "1-2": "🎨 XARLY",
      "1-3": "🎫 Tarjeta LSC",
      "1-4": "🎨 JUANSANE",
      "1-5": "❌ Nada",
      "1-6": "🎨 NINI",

      "2-1": "🎨 DIEGONCREM",
      "2-2": "❌ Nada",
      "2-3": "🎨 REXPUL",
      "2-4": "🎫 Tarjeta LSC",
      "2-5": "🎨 KAKAROTO",
      "2-6": "❌ Nada",

      "3-1": "🎨 REEDA",
      "3-2": "🎫 Tarjeta LSC",
      "3-3": "❌ Nada",
      "3-4": "🎨 NEKROS",
      "3-5": "❌ Nada",
      "3-6": "🎨 XARLY",

      "4-1": "🎨 JUANSANE",
      "4-2": "❌ Nada",
      "4-3": "🎫 Tarjeta LSC",
      "4-4": "🎨 DIEGONCREM",
      "4-5": "🎨 REXPUL",
      "4-6": "❌ Nada",

      "5-1": "🎨 KAKAROTO",
      "5-2": "❌ Nada",
      "5-3": "🎨 REEDA",
      "5-4": "🎫 Tarjeta LSC",
      "5-5": "🎨 NEKROS",
      "5-6": "❌ Nada",

      "6-1": "🎫 Tarjeta LSC",
      "6-2": "🎨 NINI",
      "6-3": "❌ Nada",
      "6-4": "🎨 KAZE",
      "6-5": "❌ Nada",
      "6-6": "🎨 DANIE"
    }
  },

  plushies: {
    clasico: {
      "1-1": "❌ Nada",
      "1-2": "🎫 Tarjeta LSC",
      "1-3": "🧸 SCOOBY",
      "1-4": "🧸 NYMERIA",
      "1-5": "🧸 LEON",
      "1-6": "❌ Nada",

      "2-1": "🧸 NYMERIA",
      "2-2": "🧸 LEON",
      "2-3": "❌ Nada",
      "2-4": "🧸 SCOOBY",
      "2-5": "🎫 Tarjeta LSC",
      "2-6": "🧸 NYMERIA",

      "3-1": "❌ Nada",
      "3-2": "🧸 SCOOBY",
      "3-3": "🎫 Tarjeta LSC",
      "3-4": "🧸 NYMERIA",
      "3-5": "✨ EXCLUSIVO",
      "3-6": "🧸 LEON",

      "4-1": "🧸 NYMERIA",
      "4-2": "🎫 Tarjeta LSC",
      "4-3": "🧸 SCOOBY",
      "4-4": "🎫 Tarjeta LSC",
      "4-5": "🧸 LEON",
      "4-6": "❌ Nada",

      "5-1": "🧸 LEON",
      "5-2": "🧸 NYMERIA",
      "5-3": "❌ Nada",
      "5-4": "🎫 Tarjeta LSC",
      "5-5": "🧸 SCOOBY",
      "5-6": "🧸 NYMERIA",

      "6-1": "❌ Nada",
      "6-2": "🧸 NYMERIA",
      "6-3": "🎫 Tarjeta LSC",
      "6-4": "🧸 LEON",
      "6-5": "🎫 Tarjeta LSC",
      "6-6": "✨ EXCLUSIVO"
    },
    variado: {
      "1-1": "❌ Nada",
      "1-2": "🧸 MOTTA",
      "1-3": "🎫 Tarjeta LSC",
      "1-4": "🧸 ZOE",
      "1-5": "❌ Nada",
      "1-6": "🧸 CHARLES",

      "2-1": "🧸 GATA DESCONFIGURADA",
      "2-2": "❌ Nada",
      "2-3": "🧸 COOPER",
      "2-4": "🎫 Tarjeta LSC",
      "2-5": "🧸 PARIS",
      "2-6": "❌ Nada",

      "3-1": "🧸 MOTTA",
      "3-2": "🎫 Tarjeta LSC",
      "3-3": "❌ Nada",
      "3-4": "🧸 ZOE",
      "3-5": "❌ Nada",
      "3-6": "🧸 COOPER",

      "4-1": "🧸 GATA DESCONFIGURADA",
      "4-2": "✨ EXCLUSIVO",
      "4-3": "🎫 Tarjeta LSC",
      "4-4": "🧸 PARIS",
      "4-5": "❌ Nada",
      "4-6": "🧸 CHARLES",

      "5-1": "🧸 ZOE",
      "5-2": "❌ Nada",
      "5-3": "🧸 GATA DESCONFIGURADA",
      "5-4": "🎫 Tarjeta LSC",
      "5-5": "❌ Nada",
      "5-6": "🧸 MOTTA",

      "6-1": "🎫 Tarjeta LSC",
      "6-2": "❌ Nada",
      "6-3": "🧸 PARIS",
      "6-4": "❌ Nada",
      "6-5": "🧸 COOPER",
      "6-6": "✨ EXCLUSIVO"
    }
  }
};

const CATEGORY_VERSIONS = {
  cars: {
    title: '🏎️ Coches',
    versions: [
      {
        id: 'v1',
        name: '🏎️ Coches Premium',
        description: 'Colección clásica de coches premium - (🏁 VARIS EVO X - GTR - URUS 🚀)'
      },
      {
        id: 'v2',
        name: '🏎️ Coches Premium 2.0',
        description: 'Nueva colección mejorada - (🚗 LEON - PERSO - GOLFITO ⛽)'
      }
    ]
  },

  funkos: {
    title: '🎨 Funkos',
    versions: [
      {
        id: 'clasico',
        name: '🎨 Funkos Coleccionables',
        description: 'Los Funkos clásicos - (😈 FURIOSA - MEL - JOKER 👑)'
      },
      {
        id: 'variado',
        name: '🎨 Funkos Variados',
        description: 'Ediciones especiales y mixtas  - (🎤 KAZE - DANIE - KAKAROTO ✨)'
      }
    ]
  },

  plushies: {
    title: '🧸 Peluches',
    versions: [
      {
        id: 'clasico',
        name: '🧸 Peluches Furioso',
        description: 'Peluches clásicos Furioso - (🖤 SCOOBY - GORDITA - FURIOSO ❤️)'
      },
      {
        id: 'variado',
        name: '🧸 Peluches Furioso 2.0',
        description: 'Peluches exclusivos 2.0 - (🐕 ZOE - GATA - GAZPACHINA 🫎)'
      }
    ]
  }
};

const PLUSHIES_EXCLUSIVE = {
  "1": "❌ Nada",
  "2": "❌ Nada",
  "3": "🧸 PELUCHE FURIOSO",
  "4": "🧸 PELUCHE FURIOSO",
  "5": "✨ GORDITA CHIQUITINA",
  "6": "✨ GORDITA CHIQUITINA"
};

const PACKS = [
  { id: 1, name: 'PACK PREMIO PREMIO', tiradas: 5, precio: '6.000 €', description: 'Para los curiosos que quieren probar suerte sin miedo.' },
  { id: 2, name: 'PACK CARIÑO MIO', tiradas: 8, precio: '9.200 €', description: 'Para los valientes que saben que cada lanzamiento puede cambiarlo todo.' },
  { id: 3, name: 'PACK BUENIZIMO', tiradas: 12, precio: '13.800 €', description: 'Para los que vienen con ganas y no se conforman con poco.' },
  { id: 4, name: 'PACK CALLATE PUTITA', tiradas: 15, precio: '17.000 €', description: 'Para los que quieren maximizar sus oportunidades y desafiar su suerte.' },
  { id: 5, name: 'PACK MAL APARCANTE', tiradas: 18, precio: '21.600 €', description: 'Para los que no creen en límites y buscan la victoria épica.' },
  { id: 6, name: 'PACK LSC', tiradas: 22, precio: '24.500 €', description: 'Para los que quieren dominar el universo Furioso y acercarse al peluche exclusivo.' },
  { id: 7, name: 'PACK FURIOSO', tiradas: 26, precio: '30.000 €', description: 'Para los que desafían a los planetas y quieren llevarse todos los tesoros.' },
  { id: 8, name: 'PACK CUPULA', tiradas: 28, precio: '33.000 €', description: 'Para los que vienen dispuestos a arrasar el universo entero a base de tiradas.' }
];

const PRODUCTS = {
  'BEBIDAS': [
    { name: 'FURIOSOS NITROSO', price: 120, special: true },
    { name: 'GAZPACHO FURIOSOS', price: 120, special: true },
    { name: 'FURIOSO ULTRA RED', price: 120, special: true },
    { name: 'FURIOSO MANGO', price: 120, special: true },
    { name: 'FURIOSO ULTRA VIOLET', price: 120, special: true },
    { name: 'AGUA', price: 85 },
    { name: 'COLA', price: 70 },
    { name: 'COLA CAO', price: 70 },
    { name: 'ENERGETICA', price: 75 },
    { name: 'LECHE', price: 65 },
    { name: 'MONSTRUOSA', price: 75 },
    { name: 'PHANTA', price: 70 },
    { name: 'REFRESCO', price: 70 },
    { name: 'CHOCOLATE CALIENTE', price: 70 },
    { name: 'HORCHATA', price: 75 },
    { name: 'LIMONADA', price: 70 },
    { name: 'BEBIDA DEPORTISTA', price: 75 },
    { name: 'TONICA', price: 75 },
    { name: 'YOGUR', price: 75 },
    { name: 'BUBLE TEA', price: 70 },
    { name: 'ZUMO DE NARANJA', price: 70 },
    { name: 'ZUMO FRUTAL', price: 75 },
    { name: 'SMOOTHIE FRUTAL', price: 75 },
  ],
  'CAFES': [
    { name: 'CAFE', price: 70 },
    { name: 'CAFE MOCA', price: 70 },
    { name: 'CAFE CON CANELA', price: 70 },
    { name: 'CAFE AMERICANO', price: 70 },
    { name: 'CAFE CON LECHE', price: 70 },
    { name: 'CAFE CON MIEL', price: 70 },
  ],
  'COMIDAS': [
    { name: 'EMPANADA', price: 90 },
    { name: 'HUEVOS CON PATATAS FRITAS', price: 85 },
    { name: 'MILANESA', price: 75 },
    { name: 'NOODLES DE POLLO', price: 70 },
    { name: 'QUESADILLAS', price: 90 },
    { name: 'TORTA ASADA', price: 70 },
    { name: 'TORTA DE PICADILLO', price: 70 },
    { name: 'TORTILLA DE PATATAS', price: 70 },
  ],
  'SANDWICHES': [
    { name: 'TAMAGO FURIOSO', price: 120, special: true },
    { name: 'SANDWICH CHORIZO', price: 90 },
    { name: 'SANDWICH JAMON', price: 90 },
    { name: 'SANDWICH COMPLETO', price: 90 },
    { name: 'SANDWICH QUESO', price: 90 },
    { name: 'SANDWICH VEGETAL', price: 90 },
    { name: 'BOCADILLO DE LOMO', price: 90 },
  ],
  'APERITIVOS': [
    { name: 'PANCHITOS FURIOSOS', price: 120, special: true },
    { name: 'DIABLOS FURIOSOS', price: 120, special: true },
    { name: 'PIPAS FURIOSAS', price: 120, special: true },
    { name: 'FURIOSOS COOKIES', price: 120, special: true },
    { name: 'BOL DE ACEITUNAS', price: 70 },
    { name: 'BOL DE CEREALES', price: 70 },
    { name: 'BOL DE JUDIAS', price: 75 },
    { name: 'BOL DE CHIPS', price: 70 },
    { name: 'BOLSA DE FRUTOS SECOS', price: 70 },
    { name: 'BOLSA DE GOMINOLAS', price: 70 },
    { name: 'BOLSA DE PATATAS CHIPS', price: 70 },
    { name: 'CHUPA NUTS', price: 40 },
    { name: 'GALLETAS DE MERENGUE', price: 75 },
    { name: 'PALITOS DE CHOCOLATE', price: 65 },
    { name: 'SNOOKERS', price: 75 },
    { name: 'PAQUETE DE HUESAZOS', price: 85 },
    { name: 'PAQUETE DE TIK TAK', price: 85 },
    { name: 'PATATAS TEXMEX', price: 70 },
    { name: 'BARRA ENERGETICA', price: 85 },
  ],
  'POSTRES': [
    { name: 'CHURROS', price: 70 },
    { name: 'TORTITAS', price: 75 },
    { name: 'CREP', price: 75 },
    { name: 'ARROZ CON LECHE', price: 70 },
    { name: 'FLAN', price: 75 },
    { name: 'FRESAS CON NATA', price: 75 },
    { name: 'PASTEL DE QUESO', price: 85 },
    { name: 'PROFITEROLES', price: 75 },
    { name: 'TROTA BOUCHE', price: 70 },
    { name: 'MACEDONIA', price: 70 },
    { name: 'ALGODON DE AZUCAR', price: 75 },
    { name: 'NAPOLITANA', price: 75 },
    { name: 'PASTELITO', price: 75 },
    { name: 'CEREALES CON MIEL', price: 75 },
    { name: 'CROISSANT', price: 50 },
    { name: 'DINERO COOKIES', price: 85 },
    { name: 'YOGUR CON MIEL', price: 75 },
    { name: 'MAGDALENA', price: 75 },
    { name: 'DONUT', price: 75 },
  ],
  'OTROS': [
    { name: 'KIT LSC', price: 500 },
    { name: 'BOLSA VACIA', price: 65},
    { name: 'CAJA VACIA', price: 100},
    { name: 'CARTAS UNO', price: 10000},
  ],
};

function normalizeString(str) {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function findProduct(query) {
  for (let category in PRODUCTS) {
    const product = PRODUCTS[category].find(p => normalizeString(p.name) === normalizeString(query));
    if (product) return product;
  }
  return null;
}