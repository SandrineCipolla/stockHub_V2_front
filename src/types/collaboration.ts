export type StockRole = 'OWNER' | 'EDITOR' | 'VIEWER' | 'VIEWER_CONTRIBUTOR';

export type ContributionStatusValue = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Collaborator {
  id: number;
  stockId: number;
  userId: number;
  userEmail: string;
  role: StockRole;
  grantedAt: string;
  grantedBy: number | null;
}

export interface Contribution {
  id: number;
  itemId: number;
  stockId: number;
  contributedBy: number;
  suggestedQuantity: number;
  /** Backend serialise ContributionStatus comme { value: '...' } */
  status: { value: ContributionStatusValue } | ContributionStatusValue;
  createdAt: string;
  reviewedBy: number | null;
  reviewedAt: string | null;
}

export function getContributionStatus(c: Contribution): ContributionStatusValue {
  if (typeof c.status === 'string') return c.status;
  return c.status.value;
}
