const API_BASE_URL = "http://localhost:8080/api/v1";

export interface SpinPackage {
  id: string;
  name: string;
  spins: number;
  priceSOL: number;
  bonusSpins?: number;
  description?: string;
}

export interface CreateTransactionResponse {
  transaction: string; // base64 encoded
  packageInfo: SpinPackage;
  totalSpins: number;
  message: string;
}

export interface VerifyTransactionResponse {
  transaction: {
    user_id: string;
    transaction_signature: string;
    package_id: string;
    sol_amount: number;
    total_spins_received: number;
    status: string;
  };
  message: string;
}

class SolSpinPurchaseService {
  private getHeaders(accessToken?: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  // 1. Lấy danh sách gói spin
  async getSpinPackages(): Promise<{ packages: SpinPackage[] }> {
    const response = await fetch(`${API_BASE_URL}/sol-spin-purchases/packages`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch spin packages");
    }

    return data.data;
  }

  // 2. Tạo transaction
  async createSpinPurchaseTransaction(
    accessToken: string,
    packageId: string,
    userWalletAddress: string
  ): Promise<CreateTransactionResponse> {
    const response = await fetch(`${API_BASE_URL}/sol-spin-purchases/create`, {
      method: "POST",
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({
        package_id: packageId,
        user_wallet_address: userWalletAddress,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create transaction");
    }

    return data.data;
  }

  // 3. Xác thực transaction
  async verifyTransaction(
    accessToken: string,
    transactionSignature: string,
    packageId: string,
    userWalletAddress: string
  ): Promise<VerifyTransactionResponse> {
    const response = await fetch(`${API_BASE_URL}/sol-spin-purchases/verify`, {
      method: "POST",
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({
        transaction_signature: transactionSignature,
        package_id: packageId,
        user_wallet_address: userWalletAddress,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify transaction");
    }

    return data.data;
  }

  // 4. Kiểm tra số dư ví
  async getWalletBalance(walletAddress: string): Promise<{
    wallet_address: string;
    balance_sol: number;
    balance_lamports: number;
  }> {
    const response = await fetch(
      `${API_BASE_URL}/sol-spin-purchases/wallet/${walletAddress}/balance`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get wallet balance");
    }

    return data.data;
  }

  // 5. Lấy lịch sử giao dịch user
  async getUserTransactions(accessToken: string, page = 1, limit = 10) {
    const response = await fetch(
      `${API_BASE_URL}/sol-spin-purchases/transactions?page=${page}&limit=${limit}`,
      {
        headers: this.getHeaders(accessToken),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get user transactions");
    }

    return data.data;
  }
}

export const solSpinPurchaseService = new SolSpinPurchaseService();
