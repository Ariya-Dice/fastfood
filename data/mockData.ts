
import { Product, Category } from '../types';

/**
 * اینترفیس Branch جهت نمایش اطلاعات هویتی هر شعبه
 * شامل شناسه یکتا، نام، نشانی، وضعیت باز بودن و تصویر شاخه
*/
export interface Branch {
  id: string;
  name: string;
  address: string;
  isOpen: boolean;
  image: string;
}

/**
 * آرایه branches شامل اطلاعات نمونه برای شعب (قابل تغییر به نمونه‌های دلخواه)
 * هر شعبه شناسه یکتا، نام، آدرس، وضعیت فعال بودن و یک عکس دارد.
 */
export const branches: Branch[] = [
  {
    id: 'andarzgo',
    name: 'شعبه اندرزگو',
    address: 'خیابان مثال غربی، روبروی کوچه بهار، پلاک ۱۲۳',
    isOpen: true,
    image: '/images/restaurant-1.jpg',
  },
  {
    id: 'saadat-abad',    address: 'خیابان آزمایشی یکم، نبش کوچه امید، ساختمان ۴۲',
    isOpen: true,
    image: '/images/restaurant-2.jpg',
  },
  {
    id: 'pasdaran',
    name: 'شعبه پاسداران',
    address: 'خیابان شریعتی شمالی، دوراهی شمس، پلاک ۹۸',
    isOpen: false,
    image: '/images/restaurant-3.jpg',
  },
  {
    id: 'valiasr',
    name: 'شعبه ولیعصر',
    address: 'خیابان ولیعصر، ابتدای خیابان فلسطین، پلاک ۵۶۷',
    isOpen: true,
    image: '/images/restaurant-4.jpg',
  },
  {
    id: 'tehranpars',
    name: 'شعبه تهرانپارس',
    address: 'تهرانپارس، خیابان شهید قندی، روبروی مسجد جامع',
    isOpen: true,
    image: '/images/restaurant-1.jpg',
  },
  {
    id: 'kargar',
    name: 'شعبه خیابان کارگر',
    address: 'خیابان کارگر شمالی، نبش خیابان هفتم، پلاک ۲۳۰',
    isOpen: true,
    image: '/images/restaurant-2.jpg',
  },
  {
    id: 'shahrak-gharb',
    name: 'شعبه شهرک غرب',
    address: 'شهرک غرب، خیابان اول، نبش خیابان آزادی',
    isOpen: false,
    image: '/images/restaurant-3.jpg',
  },
  {
    id: 'niavaran',
    name: 'شعبه نیاوران',
    address: 'نیاوران، خیابان شهید باهنر، ابتدای خیابان گلاب',
    isOpen: true,
    image: '/images/restaurant-1.jpg',
  },
  {
    id: 'vanak',
    name: 'شعبه ونک',
    address: 'ونک، خیابان ملاصدرا، روبروی پارک ونک',
    isOpen: true,
    image: '/images/restaurant-2.jpg',
  },
  {
    id: 'jordan',
    name: 'شعبه اردن',
    address: 'اردن، خیابان شهید عباسی، پلاک ۴۵۰',
    isOpen: true,
    image: '/images/restaurant-3.jpg',
  },
  {
    id: 'pirouzi',
    name: 'شعبه پیروزی',
    address: 'پیروزی، خیابان چمران، ابتدای خیابان پیروزی',
    isOpen: false,
    image: '/images/restaurant-1.jpg',
  },
  {
    id: 'resalat',
    name: 'شعبه رسالت',
    address: 'رسالت، خیابان شهید محلاتی، روبروی بیمارستان',
    isOpen: true,
    image: '/images/restaurant-2.jpg',
  },
  {
    id: 'nabard',
    name: 'شعبه نبرد',
    address: 'نبرد، خیابان شهید دستغیب، پلاک ۳۴۰',
    isOpen: true,
    image: '/images/restaurant-3.jpg',
  },
  {
    id: 'shahran',
    name: 'شعبه شهران',
    address: 'شهران، خیابان شهید چوب تراش، نبش خیابان اردیبهشت',
    isOpen: true,
    image: '/images/restaurant-1.jpg',
  },
  {
    id: 'dolat-abad',
    name: 'شعبه دولت‌آباد',
    address: 'دولت‌آباد، خیابان شهید اسدی، روبروی مترو',
    isOpen: false,
    image: '/images/restaurant-2.jpg',
  },
  {
    id: 'sattarkhan',
    name: 'شعبه ستارخان',
    address: 'ستارخان، خیابان شهید مفتح، پلاک ۶۷۰',
    isOpen: true,
    image: '/images/restaurant-3.jpg',
  },
  {
    id: 'mahdieh',
    name: 'شعبه مهدیه',
    address: 'مهدیه، خیابان شهید بهشتی، ابتدای خیابان اقدسیه',
    isOpen: true,
    image: '/images/restaurant-1.jpg',
  },
  {
    id: 'gheytarieh',
    name: 'شعبه قیطریه',
    address: 'قیطریه، خیابان شهید صیاد شیرازی، پلاک ۸۹۰',
    isOpen: true,
    image: '/images/restaurant-2.jpg',
  },
  {
    id: 'zafaranieh',
    name: 'شعبه ظفرانیه',
    address: 'ظفرانیه، خیابان شهید وحید دستجردی، روبروی پارک ملت',
    isOpen: false,
    image: '/images/restaurant-3.jpg',
  },
  {
    id: 'shahrak-e-gharb',
    name: 'شعبه شهرک غرب',
    address: 'شهرک غرب، خیابان شهید همت، پلاک ۱۲۰',
    isOpen: true,
    image: '/images/restaurant-1.jpg',
  },
];

/**
 * آرایه categories جهت تعریف دسته‌بندی‌های اصلی محصولات
 * هر دسته دارای شناسه، نام و یک آیکون نمایشی می‌باشد.
 */
export const categories: Category[] = [
  // دسته‌بندی محصولات نمونه (به دلخواه قابل تغییر است)
  { id: 'burgers', name: 'برگرها', icon: '🍔' }, // ایموجی صرفاً جهت نمایش گرافیکی است
  { id: 'pizzas', name: 'پیتزاها', icon: '🍕' },
  { id: 'sides', name: 'پیش‌غذا و کناری', icon: '🍟' },
  { id: 'beverages', name: 'نوشیدنی‌ها', icon: '🥤' },
  { id: 'salads', name: 'سالادها', icon: '🥗' },
];

/**
 * آرایه products برای نمایش نمونه محصولات هر دسته
 * هر محصول دارای شناسه یکتا، نام، توضیح، قیمت، تصویر و دسته‌بندی مرتبط است.
 * قیمت‌ها و توضیحات صرفاً جهت تست عملکرد پروژه هستند.
 */
export const products: Product[] = [
  // برگرها (Burgers) - 15 محصول
  {
    id: '1',
    name: 'جوسی برگر',
    description: 'گوشت تازه گوساله، پنیر چدار دوبل، سوسیس ویژه، کاهو، گوجه، خیارشور و سس مخصوص فست‌فودیـو',
    price: 385000,
    image: '/images/burger-1.jpg',
    category: 'burgers',
  },
  {
    id: '2',
    name: 'ماشروم برگر',
    description: 'گوشت گوساله، سس قارچ دست‌ساز با خامه تازه، پنیر سوئیسی ذوب شده و پیاز کاراملی',
    price: 410000,
    image: '/images/burger-2.jpg',
    category: 'burgers',
  },
  {
    id: '7',
    name: 'بکلون برگر',
    description: 'گوشت گوساله ۲۵۰ گرم، بیکن ترد، پنیر چدار، پیاز سرخ شده، کاهو تازه و سس بکلون',
    price: 445000,
    image: '/images/burger-3.jpg',
    category: 'burgers',
  },
  {
    id: '8',
    name: 'چیکن برگر',
    description: 'فیله مرغ سوخاری ترد، پنیر گودا، سالاد کلم، گوجه و سس مایونز مخصوص',
    price: 320000,
    image: '/images/burger-1.jpg',
    category: 'burgers',
  },
  {
    id: '9',
    name: 'فیله برگر',
    description: 'فیله گوشت گوساله درجه یک، پنیر گرویر، پیاز سرخ شده، گوجه و سس تارتار',
    price: 480000,
    image: '/images/burger-2.jpg',
    category: 'burgers',
  },
  {
    id: '10',
    name: 'دوگانه برگر',
    description: 'دو لایه گوشت گوساله، پنیر دوبل، بیکن، پیاز کاراملی و سس مخصوص',
    price: 520000,
    image: '/images/burger-3.jpg',
    category: 'burgers',
  },
  {
    id: '11',
    name: 'وسترن برگر',
    description: 'گوشت گوساله، پیاز سرخ شده، فلفل دلمه، بیکن و سس وسترن',
    price: 395000,
    image: '/images/burger-1.jpg',
    category: 'burgers',
  },
  {
    id: '12',
    name: 'سیر برگر',
    description: 'گوشت گوساله، پنیر پارمزان، سیر کنفیت، کاهو و سس سیر',
    price: 365000,
    image: '/images/burger-2.jpg',
    category: 'burgers',
  },
  {
    id: '13',
    name: 'ترافیکی برگر',
    description: 'سه لایه گوشت، پنیر سه گانه، سبزیجات مخلوط و سس ترافیکی',
    price: 580000,
    image: '/images/burger-3.jpg',
    category: 'burgers',
  },
  {
    id: '14',
    name: 'کلاسیک برگر',
    description: 'گوشت گوساله، پنیر چدار، کاهو، گوجه، خیارشور و سس کلاسیک',
    price: 340000,
    image: '/images/burger-1.jpg',
    category: 'burgers',
  },
  {
    id: '15',
    name: 'اسپایسی برگر',
    description: 'گوشت گوساله تند، پنیر جالاپینو، فلفل چیلی و سس تند مخصوص',
    price: 375000,
    image: '/images/burger-2.jpg',
    category: 'burgers',
  },
  {
    id: '16',
    name: 'وگ برگر',
    description: 'برگر گیاهی با سویا، پنیر گیاهی، سبزیجات تازه و سس گیاهی',
    price: 290000,
    image: '/images/burger-3.jpg',
    category: 'burgers',
  },
  {
    id: '17',
    name: 'بوفالو برگر',
    description: 'گوشت گوساله، پنیر بلو، پیاز حلقه‌ای و سس بوفالو',
    price: 425000,
    image: '/images/burger-1.jpg',
    category: 'burgers',
  },
  {
    id: '18',
    name: 'کارامل برگر',
    description: 'گوشت گوساله، پنیر کاراملایز، پیاز کاراملی و سس کارامل',
    price: 395000,
    image: '/images/burger-2.jpg',
    category: 'burgers',
  },
  {
    id: '19',
    name: 'پروتئین برگر',
    description: 'گوشت گوساله ۳۰۰ گرم، پنیر پروتئین، اسفناج و سس پروتئین',
    price: 450000,
    image: '/images/burger-3.jpg',
    category: 'burgers',
  },

  // پیتزاها (Pizzas) - 12 محصول
  {
    id: '3',
    name: 'پیتزا پپرونی',
    description: 'پپرونی تند ممتاز، پنیر موزارلا کشسان، فلفل دلمه تازه و سس گوجه فرنگی ایتالیایی مخصوص',
    price: 450000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },
  {
    id: '20',
    name: 'پیتزا مرغ',
    description: 'فیله مرغ سوخاری، پنیر موزارلا، قارچ، فلفل دلمه و سس مخصوص',
    price: 420000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },
  {
    id: '21',
    name: 'پیتزا گوشت',
    description: 'گوشت چرخ کرده، سوسیس، بیکن، پنیر چدار و پیاز',
    price: 480000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },
  {
    id: '22',
    name: 'پیتزا چهار فصل',
    description: 'چهار قسمت متفاوت: مرغ، گوشت، قارچ و سبزیجات',
    price: 500000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },
  {
    id: '23',
    name: 'پیتزا مارگاریتا',
    description: 'سس گوجه، پنیر موزارلا تازه، ریحان و روغن زیتون',
    price: 380000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },
  {
    id: '24',
    name: 'پیتزا سبزیجات',
    description: 'قارچ، فلفل دلمه، گوجه، زیتون، ریحان و پنیر',
    price: 395000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },
  {
    id: '25',
    name: 'پیتزا تند',
    description: 'پپرونی تند، فلفل چیلی، پنیر جالاپینو و سس تند',
    price: 435000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },
  {
    id: '26',
    name: 'پیتزا کارامل',
    description: 'گوشت، پنیر کاراملایز، پیاز کاراملی و سس کارامل',
    price: 460000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },
  {
    id: '27',
    name: 'پیتزا کینگ',
    description: 'گوشت، مرغ، سوسیس، قارچ، فلفل و پنیر سه گانه',
    price: 550000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },
  {
    id: '28',
    name: 'پیتزا مدیترانه',
    description: 'زیتون سیاه، پنیر فتا، گوجه، ریحان و روغن زیتون',
    price: 410000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },
  {
    id: '29',
    name: 'پیتزا پنیر',
    description: 'پنیر چهارگانه: موزارلا، چدار، پارمزان و گودا',
    price: 400000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },
  {
    id: '30',
    name: 'پیتزا خانواده',
    description: 'اندازه بزرگ خانوادگی با توپینگ کامل و پنیر فراوان',
    price: 620000,
    image: '/images/pizza-1.jpg',
    category: 'pizzas',
  },

  // پیش‌غذا و کناری (Sides) - 10 محصول
  {
    id: '4',
    name: 'سیب زمینی مخصوص',
    description: 'سیب زمینی خلال درشت ترد، سس پنیر چدار داغ، بیکن ترد خرد شده و پیازچه تازه',
    price: 185000,
    image: '/images/fries-1.jpg',
    category: 'sides',
  },
  {
    id: '31',
    name: 'سالاد کلم',
    description: 'سالاد کلم تازه با سس مخصوص، خردل و سرکه',
    price: 95000,
    image: '/images/salad-1.jpg',
    category: 'sides',
  },
  {
    id: '32',
    name: 'حلقه پیاز',
    description: 'حلقه‌های پیاز ترد با سس مخصوص',
    price: 145000,
    image: '/images/onion-rings.jpg',
    category: 'sides',
  },
  {
    id: '33',
    name: 'بال مرغ',
    description: 'بال مرغ سوخاری با سس بوفالو و سس مایونز',
    price: 220000,
    image: '/images/chicken-wings.jpg',
    category: 'sides',
  },
  {
    id: '34',
    name: 'موزارلا استیک',
    description: 'استیک پنیر موزارلا ترد با سس گوجه',
    price: 195000,
    image: '/images/fries-1.jpg',
    category: 'sides',
  },
  {
    id: '35',
    name: 'نان سیر',
    description: 'نان مخصوص با سیر و کره و پنیر پارمزان',
    price: 125000,
    image: '/images/bread-1.jpg',
    category: 'sides',
  },
  {
    id: '36',
    name: 'چیپس سیب زمینی',
    description: 'چیپس سیب زمینی ترد با نمک دریا',
    price: 135000,
    image: '/images/fries-1.jpg',
    category: 'sides',
  },
  {
    id: '37',
    name: 'سس‌های متنوع',
    description: 'مجموعه ۴ سس: مایونز، کچاپ، خردل و بوفالو',
    price: 75000,
    image: '/images/sauces.jpg',
    category: 'sides',
  },
  {
    id: '38',
    name: 'نان تست',
    description: 'نان تست گرم با کره و پنیر',
    price: 105000,
    image: '/images/bread-1.jpg',
    category: 'sides',
  },
  {
    id: '39',
    name: 'سالاد سبز',
    description: 'سالاد سبز تازه با سس vinaigrette',
    price: 110000,
    image: '/images/salad-1.jpg',
    category: 'sides',
  },

  // نوشیدنی‌ها (Beverages) - 8 محصول
  {
    id: '5',
    name: 'نوشابه قوطی',
    description: 'انواع نوشیدنی سرد نمونه مانند نوشابه مشکی، پرتقالی یا لیمویی - برای تست پروژه',
    price: 35000,
    image: '/images/drink-1.jpg',
    category: 'beverages',
  },
  {
    id: '40',
    name: 'نوشابه خانواده',
    description: 'نوشابه ۲ لیتری مشکی، سفید یا پرتقالی',
    price: 85000,
    image: '/images/drink-1.jpg',
    category: 'beverages',
  },
  {
    id: '41',
    name: 'آب معدنی',
    description: 'آب معدنی طبیعی سرد و تازه',
    price: 25000,
    image: '/images/drink-2.jpg',
    category: 'beverages',
  },
  {
    id: '42',
    name: 'چای سرد',
    description: 'چای سیاه یا سبز سرد با لیمو',
    price: 55000,
    image: '/images/drink-2.jpg',
    category: 'beverages',
  },
  {
    id: '43',
    name: 'قهوه سرد',
    description: 'قهوه سرد لاته یا آمریکانو',
    price: 75000,
    image: '/images/drink-2.jpg',
    category: 'beverages',
  },
  {
    id: '44',
    name: 'شیک شکلات',
    description: 'شیک شکلات سرد با خامه و شکلات',
    price: 95000,
    image: '/images/drink-2.jpg',
    category: 'beverages',
  },
  {
    id: '45',
    name: 'شیک توت فرنگی',
    description: 'شیک توت فرنگی تازه با خامه',
    price: 95000,
    image: '/images/drink-2.jpg',
    category: 'beverages',
  },
  {
    id: '46',
    name: 'آب میوه طبیعی',
    description: 'آب میوه طبیعی پرتقال، سیب یا انار',
    price: 65000,
    image: '/images/drink-1.jpg',
    category: 'beverages',
  },

  // سالادها (Salads) - 10 محصول
  {
    id: '6',
    name: 'سالاد سزار',
    description: 'کاهو تازه، فیله مرغ سرخ شده آزمایشی، نان تست شده، پنیر پارمزان نمونه و سس مخصوص پروژه',
    price: 295000,
    image: '/images/salad-1.jpg',
    category: 'salads',
  },
  {
    id: '47',
    name: 'سالاد یونانی',
    description: 'گوجه، خیار، زیتون، پنیر فتا و روغن زیتون',
    price: 265000,
    image: '/images/salad-1.jpg',
    category: 'salads',
  },
  {
    id: '48',
    name: 'سالاد مرغ',
    description: 'فیله مرغ گریل شده، کاهو، گوجه، خیار و سس لیمو',
    price: 315000,
    image: '/images/salad-1.jpg',
    category: 'salads',
  },
  {
    id: '49',
    name: 'سالاد تون ماهی',
    description: 'تون ماهی، کاهو، گوجه، خیار، زیتون و سس مایونز',
    price: 285000,
    image: '/images/salad-1.jpg',
    category: 'salads',
  },
  {
    id: '50',
    name: 'سالاد مدیترانه',
    description: 'سبزیجات مدیترانه‌ای با روغن زیتون و سرکه بالزامیک',
    price: 275000,
    image: '/images/salad-1.jpg',
    category: 'salads',
  },
  {
    id: '51',
    name: 'سالاد میوه',
    description: 'میوه‌های فصل تازه با سس مخصوص',
    price: 245000,
    image: '/images/salad-1.jpg',
    category: 'salads',
  },
  {
    id: '52',
    name: 'سالاد فصل',
    description: 'سبزیجات فصل با سس vinaigrette',
    price: 225000,
    image: '/images/salad-1.jpg',
    category: 'salads',
  },
  {
    id: '53',
    name: 'سالاد آووکادو',
    description: 'آووکادو تازه، گوجه، خیار و سس مخصوص',
    price: 335000,
    image: '/images/salad-1.jpg',
    category: 'salads',
  },
  {
    id: '54',
    name: 'سالاد پروتئین',
    description: 'فیله مرغ، گوشت، آجیل و سبزیجات تازه',
    price: 365000,
    image: '/images/salad-1.jpg',
    category: 'salads',
  },
  {
    id: '55',
    name: 'سالاد رژیمی',
    description: 'سبزیجات تازه بدون سس چرب با سس لیمو',
    price: 195000,
    image: '/images/salad-1.jpg',
    category: 'salads',
  },
];
