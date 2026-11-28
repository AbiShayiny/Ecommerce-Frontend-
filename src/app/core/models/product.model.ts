export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
  active: boolean;
}

export interface Product {
  id: string;
  sku: string;
  modelNumber?: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  supplierId: string;
  supplierName: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  gallery: string[];
  shortDescription: string;
  specs: Record<string, string>;
  warranty?: string;
  pickupBranches: string[];
  featured: boolean;
  active: boolean;
  approvalStatus?: 'Active' | 'Pending' | 'Rejected';
  rejectionReason?: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: number;
  comment: string;
  status: 'Approved' | 'Hidden';
  createdAt: string;
}

