
/**
 * نوع Product بیانگر اطلاعات پایه‌ای کالا، اعم از نام، توضیح، تصویر، قیمت و دسته‌بندی
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

/**
 * نوع Category جهت گروه‌بندی محصولات مشابه با آیکون نمایشی و نام فارسی
 */
export interface Category {
  id: string;
  name: string;
  icon: string;
}

/**
 * نوع CartItem مشتق شده از Product
 * شامل تعداد (quantity) جهت ثبت هر کالا در سبد خرید
 */
export interface CartItem extends Product {
  quantity: number;
}
