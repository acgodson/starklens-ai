export type SwapIntent = {
    id: string;
    creator: string;
    status: string;
    created_at: number;
    updated_at: number;
    from: {
      address: string;
      ticker: string;
      amount: number;
    };
    to: {
      address: string;
      ticker: string;
      amount: number;
    };
    rate: number;
    deadline: number;
    gated: {
      account?: {
        address: string;
      };
      in_collection?: {
        address: string;
      };
      min_balance?: {
        address: string;
        amount: number;
      };
      token_id?: {
        address: string;
        ids: number[];
      };
    };
    notes?: string;
  };