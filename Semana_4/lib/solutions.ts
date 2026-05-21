export type SolutionStatus = "submitted" | "reviewing" | "accepted" | "rejected" | string;

export type SolutionRow = {
  id: string;
  developer_id: string;
  problem_id: string | null;
  title: string;
  description: string;
  price: number | string;
  demo_url: string | null;
  status: SolutionStatus | null;
  created_at?: string;
};
