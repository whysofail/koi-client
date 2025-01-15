interface Breeder {
  id: number;
  name: string;
  code: string;
  website: string | null;
  location: string | null;
  contact: string | null;
  created_at: string;
  updated_at: string;
}

interface Variety {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

interface Bloodline {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

interface Koi {
  id: number;
  code: string;
  nickname: string | null;
  birthdate: string | null;
  gender: "Male" | "Female";
  breeder_id: number;
  bloodline_id: number;
  variety_id: number;
  sequence: number;
  size: string;
  price_buy_idr: number | null;
  price_buy_jpy: number | null;
  price_sell_idr: number | null;
  price_sell_jpy: number | null;
  seller: string;
  handler: string;
  purchase_date: string | null;
  location: string | null;
  photo: string;
  video: string;
  trophy: string | null;
  certificate: string | null;
  sell_date: string | null;
  buyer_name: string | null;
  death_date: string | null;
  death_note: string | null;
  status: "Available" | string; // You might want to add other possible status values
  created_at: string;
  updated_at: string;
  breeder: Breeder;
  variety: Variety;
  bloodline: Bloodline;
  history: any[];
}

// For the data array
export interface KoiData {
  data: Koi[];
}
