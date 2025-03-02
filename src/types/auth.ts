export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface NonceResponse {
  message: string;
  data: {
    nonce: string;
  };
}

export interface User {
  id: string;
  wallet_address: string;
  username: string;
  email?: string;
  profile_picture?: string;
  referral_code?: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}