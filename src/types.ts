export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBadge?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  searchKeywords: string;
  category: string;
  iconName: string;
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    lightBg: string;
  };
  description: string;
  startingPrice: string;
  typicalDuration: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  reviews: ReviewItem[];
}

export interface BookingRequest {
  id: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  preferredTime: string;
  message?: string;
  status: 'Confirmed' | 'Technician Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedWorker?: {
    name: string;
    rating: number;
    phone: string;
    avatar: string;
  };
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: 'homeowner' | 'technician';
  avatar?: string;
  joinedDate?: string;
}
