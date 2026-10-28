// Демонстрационный каталог. Названия, цены, размеры и описания — примерные,
// придуманы для демо и не являются ассортиментом или условиями бренда ElFoxo.

export const categories = [
  { id: 'shapki', name: 'Шапки', note: 'С помпоном, ушками и в рубчик', cover: 'beanie-pompom-milk' },
  { id: 'shlemy', name: 'Шапки-шлемы', note: 'Закрывают шею и уши', cover: 'helmet-ears-milk' },
  { id: 'panamy', name: 'Панамы', note: 'Для солнечных дней', cover: 'panama-cotton-sand' },
  { id: 'snudy', name: 'Снуды и шарфы', note: 'Вместо шарфа и в комплект', cover: 'snood-cable-mustard' },
  { id: 'aksessuary', name: 'Аксессуары', note: 'Варежки, повязки, чепчики', cover: 'mittens-rust' },
  { id: 'komplekty', name: 'Комплекты', note: 'Подобраны по цвету', cover: 'set-pompom-sage' },
];

const C = {
  milk: { key: 'milk', name: 'Молочный', hex: '#EFE6D8', bg: '#E6DCCB' },
  cream: { key: 'cream', name: 'Сливочный', hex: '#EADFCB', bg: '#DCD3C4' },
  caramel: { key: 'caramel', name: 'Карамель', hex: '#C99A6B', bg: '#EADBC8' },
  sage: { key: 'sage', name: 'Шалфей', hex: '#A9B59A', bg: '#E2E3D6' },
  rust: { key: 'rust', name: 'Рыжий', hex: '#C8693A', bg: '#EBD9C8' },
  graphite: { key: 'graphite', name: 'Графит', hex: '#5A5A5E', bg: '#DEDCD7' },
  oat: { key: 'oat', name: 'Овсяный', hex: '#D9CBB4', bg: '#E8E2D8' },
  pink: { key: 'pink', name: 'Пудровый', hex: '#D8B1A7', bg: '#EFE0DA' },
  navy: { key: 'navy', name: 'Тёмно-синий', hex: '#3E4A61', bg: '#DCDFE3' },
  beige: { key: 'beige', name: 'Бежевый', hex: '#D8C3A5', bg: '#E9DFD0' },
  grey: { key: 'grey', name: 'Серый меланж', hex: '#A7A6A3', bg: '#E3E1DC' },
  cocoa: { key: 'cocoa', name: 'Какао', hex: '#8A6A55', bg: '#E6DACD' },
  mint: { key: 'mint', name: 'Мятный', hex: '#B9CDBF', bg: '#E0E8E1' },
  sand: { key: 'sand', name: 'Песочный', hex: '#E3D3B5', bg: '#DCE3E4' },
  olive: { key: 'olive', name: 'Оливковый', hex: '#9EA27E', bg: '#E7E3D2' },
  sky: { key: 'sky', name: 'Небесный', hex: '#B7C7D3', bg: '#EDE5D8' },
  terracotta: { key: 'terracotta', name: 'Терракота', hex: '#C57B5A', bg: '#EEDFD2' },
  mustard: { key: 'mustard', name: 'Горчичный', hex: '#D4A94F', bg: '#EBE1CC' },
  lavender: { key: 'lavender', name: 'Лавандовый', hex: '#B9B0CC', bg: '#E7E3EA' },
};
const v = (k, extra = {}) => ({ ...C[k], ...extra });

const SIZES_KIDS = ['44–46', '48–50', '52–54'];

export const products = [
  {
    id: 'beanie-pompom', name: 'Шапка с помпоном «Облако»', category: 'shapki', price: 1890, badge: 'Хит', collection: true,
    shape: 'beanie', art: { style: 'pompom' },
    colors: [v('milk'), v('caramel', { pom: '#EFE6D8' }), v('sage', { pom: '#EFE6D8' })],
    sizes: SIZES_KIDS,
    text: 'Классическая вязаная шапка с объёмным помпоном и двойным отворотом в рубчик.',
  },
  {
    id: 'beanie-fox', name: 'Шапка «Лисёнок» с ушками', category: 'shapki', price: 2190, badge: 'Новинка', collection: true,
    shape: 'beanie', art: { style: 'fox' },
    colors: [v('rust'), v('cream'), v('graphite')],
    sizes: SIZES_KIDS,
    text: 'Тёплая шапка с ушками и нашивкой-лисичкой на отвороте.',
  },
  {
    id: 'beanie-rib', name: 'Бини в рубчик', category: 'shapki', price: 1490,
    shape: 'beanie', art: { style: 'rib' },
    colors: [v('oat'), v('pink'), v('navy')],
    sizes: SIZES_KIDS,
    text: 'Минималистичная шапка-бини плотной вязки в рубчик с широким отворотом.',
  },
  {
    id: 'beanie-soft', name: 'Шапка двойная «Мягкая»', category: 'shapki', price: 1690,
    shape: 'beanie', art: { style: 'tall' },
    colors: [v('lavender'), v('milk'), v('graphite')],
    sizes: SIZES_KIDS,
    text: 'Удлинённая шапка с узелком на макушке и двойным отворотом.',
  },
  {
    id: 'helmet-classic', name: 'Шапка-шлем «Тёплый»', category: 'shlemy', price: 2490, badge: 'Новинка', collection: true,
    shape: 'helmet', art: {},
    colors: [v('beige'), v('grey'), v('cocoa')],
    sizes: SIZES_KIDS,
    text: 'Шлем закрывает уши и шею — удобно надевать под куртку, не нужен отдельный шарф.',
  },
  {
    id: 'helmet-ears', name: 'Шлем с ушками', category: 'shlemy', price: 2690,
    shape: 'helmet', art: { ears: true },
    colors: [v('milk'), v('mint'), v('rust')],
    sizes: ['40–42', '44–46', '48–50'],
    text: 'Шлем с декоративными ушками и мягкой резинкой вокруг лица.',
  },
  {
    id: 'panama-cotton', name: 'Панама хлопковая', category: 'panamy', price: 1290,
    shape: 'panama', art: { pat: 'twill' },
    colors: [v('sand'), v('olive'), v('sky')],
    sizes: SIZES_KIDS,
    text: 'Лёгкая панама с прострочкой по полям — для прогулок в тёплую погоду.',
  },
  {
    id: 'panama-dots', name: 'Панама в горошек', category: 'panamy', price: 1390,
    shape: 'panama', art: { pat: 'dots' },
    colors: [v('pink', { alt: '#FBF6F0' }), v('navy', { alt: '#F3EEE6' })],
    sizes: SIZES_KIDS,
    text: 'Летняя панама с принтом в горошек и мягкими полями.',
  },
  {
    id: 'panama-knit', name: 'Вязаная панама', category: 'panamy', price: 1690, collection: true,
    shape: 'panama', art: { pat: 'stock' },
    colors: [v('cream'), v('terracotta')],
    sizes: SIZES_KIDS,
    text: 'Панама лицевой вязки — для прохладного межсезонья.',
  },
  {
    id: 'snood-cable', name: 'Снуд с косами', category: 'snudy', price: 1590, collection: true,
    shape: 'snood', art: { pat: 'cable' },
    colors: [v('mustard'), v('milk'), v('grey')],
    sizes: ['Единый'],
    text: 'Снуд-труба с рельефными косами: надевается через голову, не развязывается на прогулке.',
  },
  {
    id: 'scarf-walk', name: 'Шарф «Прогулка»', category: 'snudy', price: 1790,
    shape: 'scarf', art: {},
    colors: [v('caramel', { alt: '#EFE6D8' }), v('sage'), v('navy', { alt: '#C8693A' })],
    sizes: ['Единый'],
    text: 'Длинный шарф в рубчик с кисточками по краям.',
  },
  {
    id: 'mittens', name: 'Варежки на шнурке', category: 'aksessuary', price: 990,
    shape: 'mittens', art: {},
    colors: [v('rust'), v('cream'), v('navy')],
    sizes: ['1–2 года', '3–4 года', '5–6 лет'],
    text: 'Варежки на шнурке — не потеряются на горке.',
  },
  {
    id: 'headband', name: 'Повязка с узлом', category: 'aksessuary', price: 890,
    shape: 'headband', art: {},
    colors: [v('pink'), v('oat'), v('sage')],
    sizes: ['Единый'],
    text: 'Широкая вязаная повязка с узлом для межсезонья.',
  },
  {
    id: 'bonnet', name: 'Чепчик для малышей', category: 'aksessuary', price: 1190,
    shape: 'bonnet', art: {},
    colors: [v('milk'), v('mint'), v('pink')],
    sizes: ['36–38', '38–40', '40–42'],
    text: 'Нежный чепчик на завязках с мягкой подкладкой и аккуратной кромкой.',
  },
  {
    id: 'set-pompom', name: 'Комплект: шапка и снуд', category: 'komplekty', price: 3290,
    shape: 'set-snood', art: {},
    colors: [v('sage', { pom: '#EFE6D8' }), v('caramel', { pom: '#EFE6D8' }), v('lavender')],
    sizes: SIZES_KIDS,
    text: 'Шапка с помпоном и снуд одного цвета — готовый образ для прогулки.',
  },
  {
    id: 'set-fox', name: 'Комплект «Лисёнок»: шапка и варежки', category: 'komplekty', price: 2990, collection: true,
    shape: 'set-mittens', art: {},
    colors: [v('rust'), v('cream')],
    sizes: SIZES_KIDS,
    text: 'Шапка с ушками и варежки на шнурке в одном цвете.',
  },
];

export const imageOf = (p, colorKey) => `assets/img/products/${p.id}-${colorKey || p.colors[0].key}.svg`;
