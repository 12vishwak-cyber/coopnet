import imgTomatoes from "@/assets/products/tomatoes.jpg";
import imgMilk from "@/assets/products/milk.jpg";
import imgChips from "@/assets/products/chips.jpg";
import imgRice from "@/assets/products/rice.jpg";
import imgPaneer from "@/assets/products/paneer.jpg";
import imgCookingOil from "@/assets/products/cooking-oil.jpg";
import imgBananas from "@/assets/products/bananas.jpg";
import imgCurd from "@/assets/products/curd.jpg";
import imgWheatFlour from "@/assets/products/wheat-flour.jpg";
import imgSugar from "@/assets/products/sugar.jpg";
import imgJaggery from "@/assets/products/jaggery.jpg";
import imgIdliBatter from "@/assets/products/idli-batter.jpg";
import imgPickle from "@/assets/products/pickle.jpg";

const u = (id: string) => `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;

type ProductImageSet = {
  cover: string;
  gallery?: string[];
};

const gallery = (cover: string, extras: string[] = []): ProductImageSet => ({
  cover,
  gallery: [cover, ...extras],
});

export type Category =
  | "Vegetables"
  | "Fruits"
  | "Dairy"
  | "Snacks"
  | "Essentials"
  | "Bakery"
  | "Beverages"
  | "Specials"
  | "Fashion"
  | "Pharmacy"
  | "Electronics"
  | "Home"
  | "Personal Care";

export const CATEGORIES: Category[] = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Snacks",
  "Essentials",
  "Bakery",
  "Beverages",
  "Specials",
  "Fashion",
  "Pharmacy",
  "Electronics",
  "Home",
  "Personal Care",
];

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  seller: string;
  sellerId: string;
  image: string;
  gallery?: string[];
  description: string;
  tag?: string;
  category: Category;
};

type DraftProduct = Omit<Product, 'image' | 'gallery'> & {
  images: ProductImageSet;
};

const sellerImageSets = {
  vegetables: {
    tomatoes: gallery(imgTomatoes, [u('photo-1592924357228-91a4daadcfea'), u('photo-1518977956812-cd3dbadaaf31')]),
    spinach: gallery(u('photo-1576045057995-568f588f82fb'), [u('photo-1518843875459-f738682238a6'), u('photo-1506807803488-8eafc15316c7')]),
    potatoes: gallery(u('photo-1518977676601-b53f82aba655'), [u('photo-1590165482129-1b8b27698780'), u('photo-1615485925600-97fcc2c34a0c')]),
    onions: gallery(u('photo-1508747703725-719777637510'), [u('photo-1467019972079-a273e1bc9173'), u('photo-1618512496248-a07fe83aa8cb')]),
    broccoli: gallery(u('photo-1459411621453-7b03977f4bfc'), [u('photo-1457296898342-cdd24585d095'), u('photo-1550332781-aecd27f743e5')]),
    capsicum: gallery(u('photo-1563565375-f3fdfdbefa83'), [u('photo-1528825871115-3581a5387919'), u('photo-1594282486552-05a8bb9e6d7f')]),
    cucumbers: gallery(u('photo-1604977046806-87b51900a3a9'), [u('photo-1449300079323-02e209d9d3a6'), u('photo-1557844352-761f2565b576')]),
    carrots: gallery(u('photo-1447175008436-170170753d52'), [u('photo-1488459716781-31db52582fe9'), u('photo-1598170845058-32b9d6a5da37')]),
    cauliflower: gallery(u('photo-1510627498534-cf7e9002facc'), [u('photo-1568584711271-7c1f3f0fbf74'), u('photo-1603048719539-9ecb4c8af83d')]),
    beans: gallery(u('photo-1447175008436-054170c2e979'), [u('photo-1567375698348-5d9d5ae99de0'), u('photo-1540420773420-3366772f4999')]),
  },
  fruits: {
    bananas: gallery(imgBananas, [u('photo-1571771894821-ce9b6c11b08e'), u('photo-1603833665858-e61d17a86224')]),
    apples: gallery(u('photo-1567306226416-28f0efdc88ce'), [u('photo-1570913149827-d2ac84ab3f9a'), u('photo-1569870499705-504209102861')]),
    oranges: gallery(u('photo-1547514701-42782101795e'), [u('photo-1611080626919-7cf5a9dbab5b'), u('photo-1502741338009-cac2772e18bc')]),
    pomegranates: gallery(u('photo-1541344999736-83eca272f6fc'), [u('photo-1546549032-9571cd6b27df'), u('photo-1519996529931-28324d5a630e')]),
    mangoes: gallery(u('photo-1553279768-865429fa0078'), [u('photo-1591073113125-e46713c829ed'), u('photo-1601493700631-2b16ec4b4716')]),
    grapes: gallery(u('photo-1537640538966-79f369143f8f'), [u('photo-1515778767554-53f2f57bb37c'), u('photo-1543528176-61b239494933')]),
    strawberries: gallery(u('photo-1464965911861-746a04b4bca6'), [u('photo-1518635017498-87f514b751ba'), u('photo-1464226184884-fa280b87c399')]),
    watermelon: gallery(u('photo-1563114773-84221bd62daa'), [u('photo-1563114773-9fa6b6f55d00'), u('photo-1598025362874-494f9a49fbf3')]),
    guava: gallery(u('photo-1605027990121-cbae9e0642df'), [u('photo-1601493700631-2b16ec4b4716'), u('photo-1603048719539-9ecb4c8af83d')]),
    avocados: gallery(u('photo-1519162808019-7de1683fa2ad'), [u('photo-1546549032-9571cd6b27df'), u('photo-1601493700631-2b16ec4b4716')]),
  },
  dairy: {
    milk: gallery(imgMilk, [u('photo-1550583724-b2692b85b150'), u('photo-1628088062854-d1870b4553da')]),
    paneer: gallery(imgPaneer, [u('photo-1631452180519-c014fe946bc7'), u('photo-1601050690597-df0568f70950')]),
    curd: gallery(imgCurd, [u('photo-1488477181946-6428a0291777'), u('photo-1515003197210-e0cd71810b5f')]),
    butter: gallery(u('photo-1589985270958-d2f3eb0e64dd'), [u('photo-1608198093002-ad4e005484ec'), u('photo-1600891964599-f61ba0e24092')]),
    cheese: gallery(u('photo-1486297678162-eb2a19b0a32d'), [u('photo-1452195100486-9cc805987862'), u('photo-1618164436241-4473940d1f5c')]),
    greekYogurt: gallery(u('photo-1488477181946-6428a0291777'), [u('photo-1515003197210-e0cd71810b5f'), u('photo-1571212515416-fef01fc43637')]),
    lassi: gallery(u('photo-1571167561994-2b117f3b13c5'), [u('photo-1553787499-6f9133244958'), u('photo-1464306076886-da185f6a9d05')]),
    idliBatter: gallery(imgIdliBatter, [u('photo-1589302168068-964664d93dc0'), u('photo-1628294896516-9c1cb4b8dfae')]),
  },
  snacks: {
    chips: gallery(imgChips, [u('photo-1621447504864-d8686e12698c'), u('photo-1512152272829-e3139592d56f')]),
    cookies: gallery(u('photo-1499636136210-6f4ee915583e'), [u('photo-1558961363-fa8fdf82db35'), u('photo-1519864600265-abb23847ef2c')]),
    trailMix: gallery(u('photo-1505252585461-04db1eb84625'), [u('photo-1512621776951-a57141f2eefd'), u('photo-1473093226795-af9932fe5856')]),
    nachos: gallery(u('photo-1513456852971-30c0b8199d4d'), [u('photo-1513442542250-854d436a73f2'), u('photo-1473093295043-cdd812d0e601')]),
    granolaBar: gallery(u('photo-1511690078903-71dc5a49f5e3'), [u('photo-1498837167922-ddd27525d352'), u('photo-1498837167922-ddd27525d352')]),
    roastedMakhana: gallery(u('photo-1515003197210-e0cd71810b5f'), [u('photo-1488477181946-6428a0291777'), u('photo-1499636136210-6f4ee915583e')]),
    khakhra: gallery(u('photo-1601050690597-df0568f70950'), [u('photo-1589302168068-964664d93dc0'), u('photo-1618164436241-4473940d1f5c')]),
    energyBites: gallery(u('photo-1499636136210-6f4ee915583e'), [u('photo-1512621776951-a57141f2eefd'), u('photo-1505252585461-04db1eb84625')]),
  },
  essentials: {
    rice: gallery(imgRice, [u('photo-1586201375761-83865001e31c'), u('photo-1516684732162-798a0062be99')]),
    oil: gallery(imgCookingOil, [u('photo-1474979266404-7eaacbcd87c5'), u('photo-1506807803488-8eafc15316c7')]),
    flour: gallery(imgWheatFlour, [u('photo-1601050690597-df0568f70950'), u('photo-1515003197210-e0cd71810b5f')]),
    sugar: gallery(imgSugar, [u('photo-1582719478250-c89cae4dc85b'), u('photo-1589302168068-964664d93dc0')]),
    jaggery: gallery(imgJaggery, [u('photo-1618164436241-4473940d1f5c'), u('photo-1600891964599-f61ba0e24092')]),
    dal: gallery(u('photo-1615485290382-441e4d049cb5'), [u('photo-1601050690597-df0568f70950'), u('photo-1589302168068-964664d93dc0')]),
    salt: gallery(u('photo-1518110925495-5fe2c4f0d2b8'), [u('photo-1515003197210-e0cd71810b5f'), u('photo-1600891964599-f61ba0e24092')]),
    tea: gallery(u('photo-1495474472287-4d71bcdd2085'), [u('photo-1515823064-d6e0c04616a7'), u('photo-1515443961218-a51367888e4b')]),
    poha: gallery(u('photo-1589302168068-964664d93dc0'), [u('photo-1601050690597-df0568f70950'), u('photo-1628294896516-9c1cb4b8dfae')]),
    soap: gallery(u('photo-1584305574647-acf3d335c7e9'), [u('photo-1526948531399-320e7e40f0ca'), u('photo-1607006483225-1f2fd0b5b188')]),
  },
  bakery: {
    sourdough: gallery(u('photo-1509440159596-0249088772ff'), [u('photo-1549931319-a545dcf3bc73'), u('photo-1506084868230-bb9d95c24759')]),
    croissant: gallery(u('photo-1623334044303-241021148842'), [u('photo-1517433670267-08bbd4be890f'), u('photo-1509440159596-0249088772ff')]),
    redVelvet: gallery(u('photo-1586985289688-ca3cf47d3e6e'), [u('photo-1559620192-032c4bc4674e'), u('photo-1533134242443-d4fd215305ad')]),
    garlicBread: gallery(u('photo-1573140247632-f8fd74997d5c'), [u('photo-1619531040576-f9416740661f'), u('photo-1549931319-a545dcf3bc73')]),
    baguette: gallery(u('photo-1608198093002-ad4e005484ec'), [u('photo-1506084868230-bb9d95c24759'), u('photo-1549931319-a545dcf3bc73')]),
    cinnamonRoll: gallery(u('photo-1509440159596-0249088772ff'), [u('photo-1504754524776-8f4f37790ca0'), u('photo-1523294587484-bae6cc870010')]),
    muffin: gallery(u('photo-1486427944299-d1955d23e34d'), [u('photo-1464306076886-da185f6a9d05'), u('photo-1495214783159-3503fd1b572d')]),
    brownie: gallery(u('photo-1606313564200-e75d5e30476c'), [u('photo-1541783245831-57d6fb0926d3'), u('photo-1509440159596-0249088772ff')]),
    coffee: gallery(u('photo-1517701604599-bb29b565090c'), [u('photo-1495474472287-4d71bcdd2085'), u('photo-1512568400610-62da28bc8a13')]),
  },
  pharmacy: {
    paracetamol: gallery(u('photo-1584308666744-24d5c474f2ae'), [u('photo-1587854692152-cbe660dbde88'), u('photo-1576602976047-174e57a47881')]),
    vitaminC: gallery(u('photo-1550572017-edd951b55104'), [u('photo-1587854692152-cbe660dbde88'), u('photo-1584308666744-24d5c474f2ae')]),
    sanitizer: gallery(u('photo-1584744982491-665216d95f8b'), [u('photo-1587854692152-cbe660dbde88'), u('photo-1584308666744-24d5c474f2ae')]),
    thermometer: gallery(u('photo-1631549916768-4119b2e5f926'), [u('photo-1584308666744-24d5c474f2ae'), u('photo-1576602976047-174e57a47881')]),
    bandages: gallery(u('photo-1607619056574-7b8d3ee536b2'), [u('photo-1587854692152-cbe660dbde88'), u('photo-1584308666744-24d5c474f2ae')]),
    proteinPowder: gallery(u('photo-1593095948071-474c5cc2989d'), [u('photo-1512621776951-a57141f2eefd'), u('photo-1502741338009-cac2772e18bc')]),
    faceMasks: gallery(u('photo-1584634731339-252c581abfc5'), [u('photo-1584744982491-665216d95f8b'), u('photo-1584308666744-24d5c474f2ae')]),
    painReliefSpray: gallery(u('photo-1628771065518-0d82f1938462'), [u('photo-1587854692152-cbe660dbde88'), u('photo-1584308666744-24d5c474f2ae')]),
  },
  fashion: {
    tshirt: gallery(u('photo-1521572163474-6864f9cf17ab'), [u('photo-1483985988355-763728e1935b'), u('photo-1496747611176-843222e1e57c')]),
    jeans: gallery(u('photo-1542272604-787c3835535d'), [u('photo-1473966968600-fa801b869a1a'), u('photo-1475180098004-ca77a66827be')]),
    sneakers: gallery(u('photo-1542291026-7eec264c27ff'), [u('photo-1460353581641-37baddab0fa2'), u('photo-1525966222134-fcfa99b8ae77')]),
    kurta: gallery(u('photo-1610030469983-98e550d6193c'), [u('photo-1496747611176-843222e1e57c'), u('photo-1529139574466-a303027c1d8b')]),
    hoodie: gallery(u('photo-1556821840-3a63f95609a7'), [u('photo-1512436991641-6745cdb1723f'), u('photo-1503342217505-b0a15ec3261c')]),
    toteBag: gallery(u('photo-1542291026-7eec264c27ff'), [u('photo-1529139574466-a303027c1d8b'), u('photo-1503342217505-b0a15ec3261c')]),
    summerDress: gallery(u('photo-1496747611176-843222e1e57c'), [u('photo-1529139574466-a303027c1d8b'), u('photo-1515886657613-9f3515b0c78f')]),
    sunglasses: gallery(u('photo-1511499767150-a48a237f0083'), [u('photo-1517841905240-472988babdf9'), u('photo-1512436991641-6745cdb1723f')]),
  },
  electronics: {
    earbuds: gallery(u('photo-1606220945770-b5b6c2c55bf1'), [u('photo-1546435770-a3e426bf472b'), u('photo-1510557880182-3d4d3cba35a5')]),
    charger: gallery(u('photo-1583863788434-e58a36330cf0'), [u('photo-1511707171634-5f897ff02aa9'), u('photo-1510557880182-3d4d3cba35a5')]),
    stand: gallery(u('photo-1601784551446-20c9e07cdbdb'), [u('photo-1511707171634-5f897ff02aa9'), u('photo-1517336714739-489689fd1ca8')]),
    powerBank: gallery(u('photo-1609091839311-d5365f9ff1c5'), [u('photo-1511707171634-5f897ff02aa9'), u('photo-1510557880182-3d4d3cba35a5')]),
    bluetoothSpeaker: gallery(u('photo-1546435770-a3e426bf472b'), [u('photo-1517336714739-489689fd1ca8'), u('photo-1606220945770-b5b6c2c55bf1')]),
    smartWatch: gallery(u('photo-1523275335684-37898b6baf30'), [u('photo-1511707171634-5f897ff02aa9'), u('photo-1511556532299-8f662fc26c06')]),
    keyboard: gallery(u('photo-1511467687858-23d96c32e4ae'), [u('photo-1517336714739-489689fd1ca8'), u('photo-1527443154391-507e9dc6c5cc')]),
    mouse: gallery(u('photo-1527814050087-3793815479db'), [u('photo-1517336714739-489689fd1ca8'), u('photo-1511467687858-23d96c32e4ae')]),
  },
  home: {
    bottle: gallery(u('photo-1602143407151-7111542de6e8'), [u('photo-1517701604599-bb29b565090c'), u('photo-1511920170033-f8396924c348')]),
    bedsheet: gallery(u('photo-1522771739844-6a9f6d5f14af'), [u('photo-1505693416388-ac5ce068fe85'), u('photo-1505693416388-ac5ce068fe85')]),
    pan: gallery(u('photo-1584990347449-a5d9f800a783'), [u('photo-1516600164266-f3b8166ae679'), u('photo-1556909114-f6e7ad7d3136')]),
    candle: gallery(u('photo-1602874801007-bd458bb1b8b6'), [u('photo-1517701604599-bb29b565090c'), u('photo-1511920170033-f8396924c348')]),
    storageBox: gallery(u('photo-1582582429416-f6f8a486cb89'), [u('photo-1505693416388-ac5ce068fe85'), u('photo-1584990347449-a5d9f800a783')]),
    lamp: gallery(u('photo-1505693416388-ac5ce068fe85'), [u('photo-1484101403633-562f891dc89a'), u('photo-1511920170033-f8396924c348')]),
    organiser: gallery(u('photo-1511920170033-f8396924c348'), [u('photo-1582582429416-f6f8a486cb89'), u('photo-1505693416388-ac5ce068fe85')]),
    planter: gallery(u('photo-1485955900006-10f4d324d411'), [u('photo-1484101403633-562f891dc89a'), u('photo-1511920170033-f8396924c348')]),
    towels: gallery(u('photo-1616628182509-6f2c4f7d5961'), [u('photo-1522771739844-6a9f6d5f14af'), u('photo-1505693416388-ac5ce068fe85')]),
    cleaner: gallery(u('photo-1583947582886-f40ec95dd752'), [u('photo-1526948531399-320e7e40f0ca'), u('photo-1607006483225-1f2fd0b5b188')]),
  },
  personalCare: {
    faceWash: gallery(u('photo-1556228720-195a672e8a03'), [u('photo-1556228578-8c89e6adf883'), u('photo-1570194065650-d99fb4bedf0a')]),
    shampoo: gallery(u('photo-1631730486572-226d1f595b68'), [u('photo-1522335789203-aabd1fc54bc9'), u('photo-1556228720-195a672e8a03')]),
    sunscreen: gallery(u('photo-1556228578-8c89e6adf883'), [u('photo-1570194065650-d99fb4bedf0a'), u('photo-1556228720-195a672e8a03')]),
    lotion: gallery(u('photo-1570194065650-d99fb4bedf0a'), [u('photo-1522335789203-aabd1fc54bc9'), u('photo-1556228578-8c89e6adf883')]),
    deodorant: gallery(u('photo-1620916566398-39f1143ab7be'), [u('photo-1570194065650-d99fb4bedf0a'), u('photo-1522335789203-aabd1fc54bc9')]),
    razor: gallery(u('photo-1621605815971-fbc98d665033'), [u('photo-1620916566398-39f1143ab7be'), u('photo-1570194065650-d99fb4bedf0a')]),
    lipBalm: gallery(u('photo-1522335789203-aabd1fc54bc9'), [u('photo-1556228720-195a672e8a03'), u('photo-1556228578-8c89e6adf883')]),
    toothbrush: gallery(u('photo-1559591937-abc4c9f1d2f2'), [u('photo-1621605815971-fbc98d665033'), u('photo-1620916566398-39f1143ab7be')]),
  },
  beverages: {
    coldBrew: gallery(u('photo-1517701604599-bb29b565090c'), [u('photo-1495474472287-4d71bcdd2085'), u('photo-1512568400610-62da28bc8a13')]),
    limeSoda: gallery(u('photo-1556679343-c7306c1976bc'), [u('photo-1470337458703-46ad1756a187'), u('photo-1513558161293-cdaf765ed2fd')]),
    mangoJuice: gallery(u('photo-1622597467836-f3285f2131b8'), [u('photo-1470337458703-46ad1756a187'), u('photo-1513558161293-cdaf765ed2fd')]),
    kombucha: gallery(u('photo-1513558161293-cdaf765ed2fd'), [u('photo-1470337458703-46ad1756a187'), u('photo-1556679343-c7306c1976bc')]),
    coconutWater: gallery(u('photo-1536939459926-301728717817'), [u('photo-1524593166156-312f362cada0'), u('photo-1536939459926-301728717817')]),
  },
  specials: {
    jaggery: gallery(imgJaggery, [u('photo-1618164436241-4473940d1f5c'), u('photo-1600891964599-f61ba0e24092')]),
    idliBatter: gallery(imgIdliBatter, [u('photo-1589302168068-964664d93dc0'), u('photo-1628294896516-9c1cb4b8dfae')]),
    pickle: gallery(imgPickle, [u('photo-1601050690597-df0568f70950'), u('photo-1589302168068-964664d93dc0')]),
    milletMix: gallery(u('photo-1615485290382-441e4d049cb5'), [u('photo-1515003197210-e0cd71810b5f'), u('photo-1600891964599-f61ba0e24092')]),
    ghee: gallery(u('photo-1618164436241-4473940d1f5c'), [u('photo-1589302168068-964664d93dc0'), u('photo-1601050690597-df0568f70950')]),
    acharCombo: gallery(u('photo-1601050690597-df0568f70950'), [u('photo-1589302168068-964664d93dc0'), u('photo-1618164436241-4473940d1f5c')]),
  },
};

const DRAFT_PRODUCTS: DraftProduct[] = [
  { id: 'p1', category: 'Vegetables', name: 'Fresh Tomatoes', price: 20, originalPrice: 28, unit: '1 kg', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.vegetables.tomatoes, description: 'Firm, glossy vine tomatoes ideal for curries, salads, and daily cooking.', tag: 'Fresh pick' },
  { id: 'p2', category: 'Vegetables', name: 'Baby Spinach', price: 26, originalPrice: 34, unit: '250 g', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.vegetables.spinach, description: 'Tender spinach leaves washed and packed for quick saag, soups, and smoothies.', tag: 'Leafy green' },
  { id: 'p3', category: 'Vegetables', name: 'Farm Potatoes', price: 29, unit: '1 kg', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.vegetables.potatoes, description: 'Starchy all-rounder potatoes great for fries, sabzi, and stuffing.' },
  { id: 'p4', category: 'Vegetables', name: 'Red Onions', price: 32, originalPrice: 38, unit: '1 kg', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.vegetables.onions, description: 'Sharp, sweet red onions sourced from the morning mandi.', tag: 'Daily staple' },
  { id: 'p5', category: 'Vegetables', name: 'Broccoli Crowns', price: 52, unit: '400 g', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.vegetables.broccoli, description: 'Crisp broccoli florets with tight heads, perfect for stir-fries.' },
  { id: 'p6', category: 'Vegetables', name: 'Green Capsicum', price: 36, unit: '500 g', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.vegetables.capsicum, description: 'Crunchy capsicum with balanced sweetness for pasta, pizza, and Chinese.' },
  { id: 'p7', category: 'Vegetables', name: 'English Cucumbers', price: 30, unit: '2 pcs', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.vegetables.cucumbers, description: 'Hydrating seed-light cucumbers for salads, sandwiches, and raita.', tag: 'Hydrating' },
  { id: 'p8', category: 'Vegetables', name: 'Orange Carrots', price: 34, unit: '500 g', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.vegetables.carrots, description: 'Sweet winter carrots for halwa, salads, and snacks.' },
  { id: 'p9', category: 'Vegetables', name: 'Cauliflower', price: 41, unit: '1 head', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.vegetables.cauliflower, description: 'Dense florets with mild flavor for roasting and curry dishes.' },
  { id: 'p10', category: 'Vegetables', name: 'French Beans', price: 38, unit: '250 g', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.vegetables.beans, description: 'Thin, crisp beans trimmed and ready for sautéing.' },

  { id: 'p11', category: 'Fruits', name: 'Bananas', price: 40, unit: '6 pcs', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.fruits.bananas, description: 'Naturally sweet bananas with even ripeness for breakfast and shakes.', tag: 'Fast moving' },
  { id: 'p12', category: 'Fruits', name: 'Royal Gala Apples', price: 129, originalPrice: 149, unit: '4 pcs', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.fruits.apples, description: 'Juicy apples with a crisp bite and mild sweetness.' },
  { id: 'p13', category: 'Fruits', name: 'Nagpur Oranges', price: 98, unit: '1 kg', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.fruits.oranges, description: 'Bright citrus with high juice content and easy peel.' },
  { id: 'p14', category: 'Fruits', name: 'Pomegranates', price: 142, unit: '2 pcs', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.fruits.pomegranates, description: 'Ruby red arils packed with juice and crunch.' },
  { id: 'p15', category: 'Fruits', name: 'Alphonso Mangoes', price: 239, originalPrice: 289, unit: '2 pcs', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.fruits.mangoes, description: 'Rich, fragrant mangoes with buttery flesh.', tag: 'Seasonal' },
  { id: 'p16', category: 'Fruits', name: 'Seedless Grapes', price: 86, unit: '500 g', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.fruits.grapes, description: 'Firm, sweet grapes chilled and ready to snack.' },
  { id: 'p17', category: 'Fruits', name: 'Strawberries', price: 149, unit: '200 g', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.fruits.strawberries, description: 'Bright berries with a sweet-tart finish, packed fresh.' },
  { id: 'p18', category: 'Fruits', name: 'Watermelon Cubes', price: 79, unit: '500 g', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.fruits.watermelon, description: 'Ready-to-eat chilled watermelon pieces for quick refreshment.' },
  { id: 'p19', category: 'Fruits', name: 'Pink Guava', price: 73, unit: '500 g', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.fruits.guava, description: 'Soft pink guavas with a fragrant tropical aroma.' },
  { id: 'p20', category: 'Fruits', name: 'Hass Avocados', price: 199, unit: '2 pcs', seller: 'Priya Fresh Mart', sellerId: 's2', images: sellerImageSets.fruits.avocados, description: 'Creamy avocados for toast, salads, and dips.' },

  { id: 'p21', category: 'Dairy', name: 'Whole Milk', price: 30, unit: '500 ml', seller: 'Lakshmi Dairy', sellerId: 's4', images: sellerImageSets.dairy.milk, description: 'Fresh full-cream milk pasteurised early every morning.' },
  { id: 'p22', category: 'Dairy', name: 'Fresh Paneer', price: 90, unit: '200 g', seller: 'Lakshmi Dairy', sellerId: 's4', images: sellerImageSets.dairy.paneer, description: 'Soft paneer with a rich milky bite, ideal for curries.', tag: 'Made today' },
  { id: 'p23', category: 'Dairy', name: 'Homestyle Curd', price: 25, originalPrice: 35, unit: '400 g', seller: 'Lakshmi Dairy', sellerId: 's4', images: sellerImageSets.dairy.curd, description: 'Thick-set curd with natural tang and creamy texture.' },
  { id: 'p24', category: 'Dairy', name: 'Salted Butter', price: 58, unit: '100 g', seller: 'Lakshmi Dairy', sellerId: 's4', images: sellerImageSets.dairy.butter, description: 'Table butter with a light salty finish for toast and baking.' },
  { id: 'p25', category: 'Dairy', name: 'Cheddar Slices', price: 125, unit: '200 g', seller: 'Lakshmi Dairy', sellerId: 's4', images: sellerImageSets.dairy.cheese, description: 'Melty cheddar slices for burgers, sandwiches, and rolls.' },
  { id: 'p26', category: 'Dairy', name: 'Greek Yogurt', price: 74, unit: '170 g', seller: 'Lakshmi Dairy', sellerId: 's4', images: sellerImageSets.dairy.greekYogurt, description: 'Protein-rich strained yogurt with a smooth, dense body.' },
  { id: 'p27', category: 'Dairy', name: 'Sweet Lassi', price: 42, unit: '300 ml', seller: 'Lakshmi Dairy', sellerId: 's4', images: sellerImageSets.dairy.lassi, description: 'Chilled Punjabi-style lassi with a silky finish.' },
  { id: 'p28', category: 'Dairy', name: 'Fresh Idli Batter', price: 40, unit: '1 L', seller: 'Lakshmi Dairy', sellerId: 's4', images: sellerImageSets.dairy.idliBatter, description: 'Fermented rice and urad batter ready for soft idlis and dosas.', tag: 'Breakfast hero' },

  { id: 'p29', category: 'Snacks', name: 'Masala Chips', price: 10, originalPrice: 15, unit: 'Pack', seller: 'Ravi General Store', sellerId: 's1', images: sellerImageSets.snacks.chips, description: 'Thin potato chips seasoned with a spicy Indian masala.' },
  { id: 'p30', category: 'Snacks', name: 'Butter Cookies', price: 89, unit: '200 g', seller: 'Ravi General Store', sellerId: 's1', images: sellerImageSets.snacks.cookies, description: 'Crisp tea-time cookies with a buttery, crumbly texture.' },
  { id: 'p31', category: 'Snacks', name: 'Trail Mix', price: 149, originalPrice: 179, unit: '250 g', seller: 'Ravi General Store', sellerId: 's1', images: sellerImageSets.snacks.trailMix, description: 'A balanced mix of nuts, seeds, and dried fruit.', tag: 'Healthy pick' },
  { id: 'p32', category: 'Snacks', name: 'Corn Nachos', price: 65, unit: '150 g', seller: 'Ravi General Store', sellerId: 's1', images: sellerImageSets.snacks.nachos, description: 'Crispy corn nachos made for dips and movie nights.' },
  { id: 'p33', category: 'Snacks', name: 'Granola Bar', price: 35, unit: '1 pc', seller: 'Ravi General Store', sellerId: 's1', images: sellerImageSets.snacks.granolaBar, description: 'Oats and honey bar for a quick on-the-go bite.' },
  { id: 'p34', category: 'Snacks', name: 'Roasted Makhana', price: 99, unit: '120 g', seller: 'Ravi General Store', sellerId: 's1', images: sellerImageSets.snacks.roastedMakhana, description: 'Fox nuts tossed in pepper and pink salt.' },
  { id: 'p35', category: 'Snacks', name: 'Khakhra Chips', price: 55, unit: '150 g', seller: 'Ravi General Store', sellerId: 's1', images: sellerImageSets.snacks.khakhra, description: 'Roasted wheat crisps with a light, savoury crunch.' },
  { id: 'p36', category: 'Snacks', name: 'Energy Bites', price: 120, unit: '6 pcs', seller: 'Ravi General Store', sellerId: 's1', images: sellerImageSets.snacks.energyBites, description: 'No-bake cacao and dates bites packed for instant energy.' },
  { id: 'p37', category: 'Beverages', name: 'Fresh Lime Soda', price: 60, unit: '350 ml', seller: 'Ravi General Store', sellerId: 's1', images: sellerImageSets.beverages.limeSoda, description: 'Tangy, fizzy lime soda chilled and ready to sip.' },
  { id: 'p38', category: 'Beverages', name: 'Kombucha Citrus', price: 130, unit: '300 ml', seller: 'Ravi General Store', sellerId: 's1', images: sellerImageSets.beverages.kombucha, description: 'Sparkling kombucha with citrus zest and a clean finish.' },

  { id: 'p39', category: 'Essentials', name: 'Basmati Rice', price: 85, originalPrice: 110, unit: '1 kg', seller: 'Kumar Groceries', sellerId: 's3', images: sellerImageSets.essentials.rice, description: 'Aged basmati rice with long grains and fragrant aroma.' },
  { id: 'p40', category: 'Essentials', name: 'Cooking Oil', price: 180, originalPrice: 210, unit: '1 L', seller: 'Kumar Groceries', sellerId: 's3', images: sellerImageSets.essentials.oil, description: 'Sunflower cooking oil with a light, neutral profile.' },
  { id: 'p41', category: 'Essentials', name: 'Wheat Flour', price: 48, unit: '1 kg', seller: 'Kumar Groceries', sellerId: 's3', images: sellerImageSets.essentials.flour, description: 'Stone-ground atta for soft rotis and daily meals.' },
  { id: 'p42', category: 'Essentials', name: 'Sugar', price: 45, unit: '1 kg', seller: 'Kumar Groceries', sellerId: 's3', images: sellerImageSets.essentials.sugar, description: 'Refined white sugar for tea, desserts, and baking.' },
  { id: 'p43', category: 'Specials', name: 'Organic Jaggery', price: 65, originalPrice: 80, unit: '500 g', seller: 'Kumar Groceries', sellerId: 's3', images: sellerImageSets.specials.jaggery, description: 'Unrefined jaggery blocks rich in caramel notes.', tag: 'Local favourite' },
  { id: 'p44', category: 'Essentials', name: 'Toor Dal', price: 140, unit: '1 kg', seller: 'Kumar Groceries', sellerId: 's3', images: sellerImageSets.essentials.dal, description: 'Cleaned premium toor dal for everyday dal tadka.' },
  { id: 'p45', category: 'Essentials', name: 'Iodized Salt', price: 24, unit: '1 kg', seller: 'Kumar Groceries', sellerId: 's3', images: sellerImageSets.essentials.salt, description: 'Fine iodized salt sealed for kitchen freshness.' },
  { id: 'p46', category: 'Essentials', name: 'Masala Tea', price: 129, unit: '250 g', seller: 'Kumar Groceries', sellerId: 's3', images: sellerImageSets.essentials.tea, description: 'Aromatic tea blend with cardamom, ginger, and spices.' },
  { id: 'p47', category: 'Specials', name: 'Mango Pickle', price: 120, originalPrice: 150, unit: '250 g', seller: 'Kumar Groceries', sellerId: 's3', images: sellerImageSets.specials.pickle, description: 'Spicy homemade-style mango pickle matured in mustard oil.', tag: 'Homemade' },

  { id: 'p48', category: 'Essentials', name: 'Flattened Rice Poha', price: 52, unit: '500 g', seller: 'Ahmed Provisions', sellerId: 's5', images: sellerImageSets.essentials.poha, description: 'Medium-thick poha for quick breakfasts and evening snacks.' },
  { id: 'p49', category: 'Essentials', name: 'Bath Soap Pack', price: 84, unit: '4 pcs', seller: 'Ahmed Provisions', sellerId: 's5', images: sellerImageSets.essentials.soap, description: 'Fresh fragrance bathing soap multipack for the family.' },
  { id: 'p50', category: 'Specials', name: 'Millet Dosa Mix', price: 110, unit: '500 g', seller: 'Ahmed Provisions', sellerId: 's5', images: sellerImageSets.specials.milletMix, description: 'High-fiber millet batter mix for crisp dosas.' },
  { id: 'p51', category: 'Specials', name: 'Village Ghee', price: 265, unit: '250 ml', seller: 'Ahmed Provisions', sellerId: 's5', images: sellerImageSets.specials.ghee, description: 'Slow-cooked cow ghee with a nutty aroma and golden color.' },
  { id: 'p52', category: 'Specials', name: 'Achar Combo', price: 179, unit: '3 jars', seller: 'Ahmed Provisions', sellerId: 's5', images: sellerImageSets.specials.acharCombo, description: 'Three local pickles in one tasting pack for family meals.', tag: 'Craft batch' },
  { id: 'p53', category: 'Snacks', name: 'Dry Fruit Mix', price: 220, unit: '250 g', seller: 'Ahmed Provisions', sellerId: 's5', images: sellerImageSets.snacks.trailMix, description: 'Premium almond, cashew, and raisin mix for gifting and snacking.' },
  { id: 'p54', category: 'Beverages', name: 'Tender Coconut Water', price: 70, unit: '1 pc', seller: 'Ahmed Provisions', sellerId: 's5', images: sellerImageSets.beverages.coconutWater, description: 'Fresh tender coconut with naturally sweet, cooling water.' },
  { id: 'p55', category: 'Beverages', name: 'Mango Juice', price: 55, unit: '300 ml', seller: 'Ahmed Provisions', sellerId: 's5', images: sellerImageSets.beverages.mangoJuice, description: 'Pulp-rich mango drink with smooth texture and summer flavour.' },

  { id: 'p56', category: 'Bakery', name: 'Fresh Sourdough Loaf', price: 90, originalPrice: 120, unit: '400 g', seller: 'Sweet Crumb Bakers', sellerId: 's6', images: sellerImageSets.bakery.sourdough, description: 'Crackly sourdough loaf with open crumb and slight tang.', tag: 'Hot bake' },
  { id: 'p57', category: 'Bakery', name: 'Chocolate Croissant', price: 60, unit: '1 pc', seller: 'Sweet Crumb Bakers', sellerId: 's6', images: sellerImageSets.bakery.croissant, description: 'Buttery laminated pastry layered around dark chocolate.' },
  { id: 'p58', category: 'Bakery', name: 'Red Velvet Cake', price: 450, originalPrice: 550, unit: '500 g', seller: 'Sweet Crumb Bakers', sellerId: 's6', images: sellerImageSets.bakery.redVelvet, description: 'Moist red velvet sponge with cream cheese frosting.', tag: 'Celebration' },
  { id: 'p59', category: 'Bakery', name: 'Garlic Bread', price: 80, unit: 'Pack of 4', seller: 'Sweet Crumb Bakers', sellerId: 's6', images: sellerImageSets.bakery.garlicBread, description: 'Soft bread brushed with roasted garlic butter and herbs.' },
  { id: 'p60', category: 'Bakery', name: 'French Baguette', price: 95, unit: '1 pc', seller: 'Sweet Crumb Bakers', sellerId: 's6', images: sellerImageSets.bakery.baguette, description: 'Long crusty baguette with airy crumb and chewy bite.' },
  { id: 'p61', category: 'Bakery', name: 'Cinnamon Roll', price: 85, unit: '1 pc', seller: 'Sweet Crumb Bakers', sellerId: 's6', images: sellerImageSets.bakery.cinnamonRoll, description: 'Soft cinnamon roll topped with glossy cream glaze.' },
  { id: 'p62', category: 'Bakery', name: 'Blueberry Muffin', price: 70, unit: '1 pc', seller: 'Sweet Crumb Bakers', sellerId: 's6', images: sellerImageSets.bakery.muffin, description: 'Tender bakery muffin packed with blueberries.' },
  { id: 'p63', category: 'Bakery', name: 'Fudge Brownie', price: 95, unit: '2 pcs', seller: 'Sweet Crumb Bakers', sellerId: 's6', images: sellerImageSets.bakery.brownie, description: 'Dense, glossy brownie squares with deep cocoa flavour.' },
  { id: 'p64', category: 'Beverages', name: 'Cold Brew Coffee', price: 120, unit: '300 ml', seller: 'Sweet Crumb Bakers', sellerId: 's6', images: sellerImageSets.bakery.coffee, description: 'Smooth cold brew made from arabica beans, served chilled.' },

  { id: 'p65', category: 'Pharmacy', name: 'Paracetamol 500mg', price: 25, unit: 'Strip of 10', seller: 'MediCare Plus', sellerId: 's7', images: sellerImageSets.pharmacy.paracetamol, description: 'Fast relief tablets for fever and general body pain.' },
  { id: 'p66', category: 'Pharmacy', name: 'Vitamin C Tablets', price: 180, originalPrice: 220, unit: '60 tabs', seller: 'MediCare Plus', sellerId: 's7', images: sellerImageSets.pharmacy.vitaminC, description: 'Daily immunity support tablets with 1000 mg vitamin C.' },
  { id: 'p67', category: 'Pharmacy', name: 'Hand Sanitizer', price: 65, unit: '200 ml', seller: 'MediCare Plus', sellerId: 's7', images: sellerImageSets.pharmacy.sanitizer, description: 'Quick-drying 70% alcohol sanitizer with aloe.' },
  { id: 'p68', category: 'Pharmacy', name: 'Digital Thermometer', price: 220, originalPrice: 280, unit: '1 unit', seller: 'MediCare Plus', sellerId: 's7', images: sellerImageSets.pharmacy.thermometer, description: 'Fast-read digital thermometer with fever alert beep.' },
  { id: 'p69', category: 'Pharmacy', name: 'Bandage Strips', price: 42, unit: '20 pcs', seller: 'MediCare Plus', sellerId: 's7', images: sellerImageSets.pharmacy.bandages, description: 'Flexible first-aid strips with breathable adhesive.' },
  { id: 'p70', category: 'Pharmacy', name: 'Protein Powder', price: 899, unit: '500 g', seller: 'MediCare Plus', sellerId: 's7', images: sellerImageSets.pharmacy.proteinPowder, description: 'Chocolate whey blend for recovery and daily protein goals.' },
  { id: 'p71', category: 'Pharmacy', name: 'Face Masks', price: 149, unit: '10 pcs', seller: 'MediCare Plus', sellerId: 's7', images: sellerImageSets.pharmacy.faceMasks, description: 'Soft triple-layer masks packed for daily protection.' },
  { id: 'p72', category: 'Pharmacy', name: 'Pain Relief Spray', price: 189, unit: '120 ml', seller: 'MediCare Plus', sellerId: 's7', images: sellerImageSets.pharmacy.painReliefSpray, description: 'Cooling spray for muscle strain, cramps, and stiffness.' },

  { id: 'p73', category: 'Electronics', name: 'Wireless Earbuds', price: 1499, originalPrice: 2499, unit: '1 pair', seller: 'TechHub Express', sellerId: 's9', images: sellerImageSets.electronics.earbuds, description: 'Compact earbuds with 24-hour battery and clear voice pickup.', tag: 'Best seller' },
  { id: 'p74', category: 'Electronics', name: 'Fast Charger 25W', price: 599, originalPrice: 899, unit: '1 unit', seller: 'TechHub Express', sellerId: 's9', images: sellerImageSets.electronics.charger, description: 'USB-C fast charger with stable thermal control.' },
  { id: 'p75', category: 'Electronics', name: 'Phone Stand', price: 249, unit: '1 unit', seller: 'TechHub Express', sellerId: 's9', images: sellerImageSets.electronics.stand, description: 'Adjustable aluminium stand for desks, kitchens, and work calls.' },
  { id: 'p76', category: 'Electronics', name: 'Power Bank 10000mAh', price: 999, originalPrice: 1499, unit: '1 unit', seller: 'TechHub Express', sellerId: 's9', images: sellerImageSets.electronics.powerBank, description: 'Slim power bank with 22.5W quick charge output.' },
  { id: 'p77', category: 'Electronics', name: 'Bluetooth Speaker', price: 1299, unit: '1 unit', seller: 'TechHub Express', sellerId: 's9', images: sellerImageSets.electronics.bluetoothSpeaker, description: 'Portable speaker with punchy bass and all-day battery.' },
  { id: 'p78', category: 'Electronics', name: 'Smart Watch', price: 1999, originalPrice: 2799, unit: '1 unit', seller: 'TechHub Express', sellerId: 's9', images: sellerImageSets.electronics.smartWatch, description: 'Fitness-first watch with AMOLED screen and call support.' },
  { id: 'p79', category: 'Electronics', name: 'Mechanical Keyboard', price: 2499, unit: '1 unit', seller: 'TechHub Express', sellerId: 's9', images: sellerImageSets.electronics.keyboard, description: 'Compact keyboard with tactile switches and RGB lighting.' },
  { id: 'p80', category: 'Electronics', name: 'Wireless Mouse', price: 799, unit: '1 unit', seller: 'TechHub Express', sellerId: 's9', images: sellerImageSets.electronics.mouse, description: 'Silent click mouse with ergonomic shape and long battery life.' },

  { id: 'p81', category: 'Fashion', name: 'Cotton T-Shirt', price: 399, originalPrice: 599, unit: '1 pc', seller: 'Threadline Studio', sellerId: 's8', images: sellerImageSets.fashion.tshirt, description: 'Breathable heavyweight cotton tee with a clean everyday fit.', tag: 'Trending' },
  { id: 'p82', category: 'Fashion', name: 'Slim Fit Jeans', price: 1299, originalPrice: 1899, unit: '1 pc', seller: 'Threadline Studio', sellerId: 's8', images: sellerImageSets.fashion.jeans, description: 'Stretch denim jeans cut for all-day comfort.' },
  { id: 'p83', category: 'Fashion', name: 'Canvas Sneakers', price: 899, unit: '1 pair', seller: 'Threadline Studio', sellerId: 's8', images: sellerImageSets.fashion.sneakers, description: 'Minimal low-top sneakers with cushioned footbed.' },
  { id: 'p84', category: 'Fashion', name: 'Silk Kurta', price: 1499, originalPrice: 2200, unit: '1 pc', seller: 'Threadline Studio', sellerId: 's8', images: sellerImageSets.fashion.kurta, description: 'Festive silk kurta with subtle woven detailing.' },
  { id: 'p85', category: 'Fashion', name: 'Oversized Hoodie', price: 1299, unit: '1 pc', seller: 'Threadline Studio', sellerId: 's8', images: sellerImageSets.fashion.hoodie, description: 'Brush-back fleece hoodie with a relaxed streetwear fit.' },
  { id: 'p86', category: 'Fashion', name: 'Minimal Tote Bag', price: 699, unit: '1 pc', seller: 'Threadline Studio', sellerId: 's8', images: sellerImageSets.fashion.toteBag, description: 'Structured everyday tote in durable canvas with inside pockets.' },
  { id: 'p87', category: 'Fashion', name: 'Summer Dress', price: 1599, originalPrice: 1999, unit: '1 pc', seller: 'Threadline Studio', sellerId: 's8', images: sellerImageSets.fashion.summerDress, description: 'Flowy midi dress with soft drape and fresh prints.' },
  { id: 'p88', category: 'Fashion', name: 'Polarized Sunglasses', price: 799, unit: '1 pc', seller: 'Threadline Studio', sellerId: 's8', images: sellerImageSets.fashion.sunglasses, description: 'Retro-inspired sunglasses with UV-protected lenses.' },

  { id: 'p89', category: 'Home', name: 'Steel Water Bottle', price: 449, originalPrice: 699, unit: '750 ml', seller: 'HomeStyle Bazaar', sellerId: 's10', images: sellerImageSets.home.bottle, description: 'Insulated steel bottle that stays cold for long commutes.' },
  { id: 'p90', category: 'Home', name: 'Bedsheet Set', price: 899, originalPrice: 1299, unit: 'Queen size', seller: 'HomeStyle Bazaar', sellerId: 's10', images: sellerImageSets.home.bedsheet, description: 'Cotton bedsheet set with two soft pillow covers.' },
  { id: 'p91', category: 'Home', name: 'Non-stick Pan', price: 599, unit: '26 cm', seller: 'HomeStyle Bazaar', sellerId: 's10', images: sellerImageSets.home.pan, description: 'Everyday non-stick pan with even heating and easy cleanup.' },
  { id: 'p92', category: 'Home', name: 'Scented Candle', price: 349, originalPrice: 449, unit: '200 g', seller: 'HomeStyle Bazaar', sellerId: 's10', images: sellerImageSets.home.candle, description: 'Lavender soy candle that lifts a room without overpowering it.' },
  { id: 'p93', category: 'Home', name: 'Storage Boxes', price: 799, unit: 'Set of 3', seller: 'HomeStyle Bazaar', sellerId: 's10', images: sellerImageSets.home.storageBox, description: 'Stackable storage boxes for wardrobes and shelf organisation.' },
  { id: 'p94', category: 'Home', name: 'Bedside Lamp', price: 1199, unit: '1 pc', seller: 'HomeStyle Bazaar', sellerId: 's10', images: sellerImageSets.home.lamp, description: 'Warm bedside lamp with fabric shade and clean silhouette.' },
  { id: 'p95', category: 'Home', name: 'Desk Organiser', price: 499, unit: '1 pc', seller: 'HomeStyle Bazaar', sellerId: 's10', images: sellerImageSets.home.organiser, description: 'Minimal desk tray for notes, chargers, and small essentials.' },
  { id: 'p96', category: 'Home', name: 'Ceramic Planter', price: 549, unit: '1 pc', seller: 'HomeStyle Bazaar', sellerId: 's10', images: sellerImageSets.home.planter, description: 'Matte ceramic planter with drainage plate for indoor greens.' },
  { id: 'p97', category: 'Home', name: 'Bath Towels', price: 699, unit: '2 pcs', seller: 'HomeStyle Bazaar', sellerId: 's10', images: sellerImageSets.home.towels, description: 'Soft absorbent towel set in premium combed cotton.' },
  { id: 'p98', category: 'Home', name: 'Surface Cleaner', price: 199, unit: '500 ml', seller: 'HomeStyle Bazaar', sellerId: 's10', images: sellerImageSets.home.cleaner, description: 'Fresh fragrance multipurpose cleaner for kitchen and glass.' },

  { id: 'p99', category: 'Personal Care', name: 'Face Wash', price: 199, originalPrice: 249, unit: '100 ml', seller: 'GlowKart', sellerId: 's11', images: sellerImageSets.personalCare.faceWash, description: 'Vitamin C face wash with gentle foam and fresh citrus scent.' },
  { id: 'p100', category: 'Personal Care', name: 'Shampoo', price: 299, unit: '340 ml', seller: 'GlowKart', sellerId: 's11', images: sellerImageSets.personalCare.shampoo, description: 'Tea-tree shampoo for scalp refresh and daily cleansing.' },
  { id: 'p101', category: 'Personal Care', name: 'Sunscreen SPF 50', price: 499, originalPrice: 649, unit: '50 g', seller: 'GlowKart', sellerId: 's11', images: sellerImageSets.personalCare.sunscreen, description: 'Featherlight SPF 50 sunscreen with no white cast.', tag: 'Daily wear' },
  { id: 'p102', category: 'Personal Care', name: 'Body Lotion', price: 349, unit: '250 ml', seller: 'GlowKart', sellerId: 's11', images: sellerImageSets.personalCare.lotion, description: 'Shea butter lotion with long-lasting hydration.' },
  { id: 'p103', category: 'Personal Care', name: 'Deodorant Spray', price: 249, unit: '150 ml', seller: 'GlowKart', sellerId: 's11', images: sellerImageSets.personalCare.deodorant, description: 'Fresh deodorant spray with all-day odour control.' },
  { id: 'p104', category: 'Personal Care', name: 'Precision Razor', price: 199, unit: '1 unit', seller: 'GlowKart', sellerId: 's11', images: sellerImageSets.personalCare.razor, description: 'Close-shave razor with comfort grip and replaceable heads.' },
  { id: 'p105', category: 'Personal Care', name: 'Berry Lip Balm', price: 149, unit: '1 pc', seller: 'GlowKart', sellerId: 's11', images: sellerImageSets.personalCare.lipBalm, description: 'Nourishing tinted lip balm with berry fragrance.' },
  { id: 'p106', category: 'Personal Care', name: 'Bamboo Toothbrush', price: 99, unit: '2 pcs', seller: 'GlowKart', sellerId: 's11', images: sellerImageSets.personalCare.toothbrush, description: 'Soft-bristle bamboo toothbrush pair with eco packaging.' },
];

export const PRODUCTS: Product[] = DRAFT_PRODUCTS.map(({ images, ...product }) => ({
  ...product,
  image: images.cover,
  gallery: images.gallery,
}));

export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id);

export const getProductsBySellerId = (sellerId: string) => PRODUCTS.filter((p) => p.sellerId === sellerId);

export const discountPct = (p: Pick<Product, 'price' | 'originalPrice'>) =>
  p.originalPrice && p.originalPrice > p.price
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;

export const CATEGORY_META: Record<Category, { label: string; labelClass: string; image: string }> = {
  Vegetables: { label: 'Fresh', labelClass: 'bg-emerald-500', image: u('photo-1518977676601-b53f82aba655') },
  Fruits: { label: 'Daily', labelClass: 'bg-orange-500', image: u('photo-1610832958506-aa56368176cf') },
  Dairy: { label: 'Daily', labelClass: 'bg-sky-500', image: u('photo-1628088062854-d1870b4553da') },
  Snacks: { label: 'Quick', labelClass: 'bg-amber-500', image: u('photo-1621447504864-d8686e12698c') },
  Essentials: { label: 'Staples', labelClass: 'bg-violet-500', image: u('photo-1604908176997-125f25cc6f3d') },
  Bakery: { label: 'Hot', labelClass: 'bg-rose-500', image: u('photo-1509440159596-0249088772ff') },
  Beverages: { label: 'Cold', labelClass: 'bg-cyan-500', image: u('photo-1517701604599-bb29b565090c') },
  Specials: { label: 'Local', labelClass: 'bg-fuchsia-500', image: u('photo-1565299624946-b28f40a0ae38') },
  Fashion: { label: 'Style', labelClass: 'bg-pink-500', image: u('photo-1483985988355-763728e1935b') },
  Pharmacy: { label: '24x7', labelClass: 'bg-red-500', image: u('photo-1576602976047-174e57a47881') },
  Electronics: { label: 'New', labelClass: 'bg-indigo-500', image: u('photo-1498049794561-7780e7231661') },
  Home: { label: 'Cozy', labelClass: 'bg-teal-500', image: u('photo-1556909114-f6e7ad7d3136') },
  'Personal Care': { label: 'Glow', labelClass: 'bg-fuchsia-400', image: u('photo-1556228453-efd6c1ff04f6') },
};
