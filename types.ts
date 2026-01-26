export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  ageUnit: string;
  gender: 'Male' | 'Female';
  distance: string;
  image: string;
  price: string;
  location: string;
  weight: string;
  description: string;
  shelterName: string;
  shelterDistance: string;
  shelterLogo: string;
  tags: string[];
  category: 'dogs' | 'cats' | 'birds';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ApplicationData {
  name: string;
  phone: string;
  address: string;
  job: string;
  housingType: string;
  hasPets: boolean;
  reason: string;
  experience: string;
  timeCommitment: number;
  activityLevel: string;
}