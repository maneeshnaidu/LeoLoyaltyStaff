export interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: Category;
}

interface Category {
  id: number;
  name: string;
  image: string;
}

export interface CategoryType {
  id: number;
  name: string;
  image: string;
}

export interface CartItemType {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface NotificationType {
  id: number;
  customer: string;
  orderNumber: string;
  points: number;
  transactionType: string;
  outletAddress: string;
  createdOn: Date | string;
}

export interface VendorType {
  id: number;
  name: string;
  address: number;
  phone: string;
  images: string[];
  category: Category;
}

export interface OutletType {
  id: number;
  name: string;
  description: string;
  category: string;
  coverImageUrl: string;
  address: number;
  phoneNumber: string;
}

export interface LoyaltyCardType {
  id: number;
  vendorId: number;
  vendorName: string;
  vendorLogo: string;
  points: number;
  maxPoints: number;
}

export interface QueryObject {
  role?: string,
  userCode?: number,
  vendorId?: number,
  outletId?: number,
  category?: string,
  title?: string,
  address?: string,
  isLatest?: boolean,
  createdDate?: Date
}

export interface RewardType {
  id: string;
  title: string;
  description: string;
  expiryDate?: string;
}

export type UpdatePointsDto = {
  customerCode: number,
  rewardId: number,
  vendorId: number,
  outletId: number,
  orderId: number,
  point: number,
}