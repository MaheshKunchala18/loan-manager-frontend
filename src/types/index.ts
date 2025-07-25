export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'verifier' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplication {
  _id: string;
  userId: string | User;
  applicantFirstName: string;
  applicantLastName: string;
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired';
  employmentAddress: string;
  reasonForLoan: string;
  loanAmount: number;
  status: 'pending' | 'verified' | 'approved' | 'rejected';
  verifiedBy?: string | User;
  approvedBy?: string | User;
  rejectedBy?: string | User;
  verificationDate?: string;
  approvalDate?: string;
  rejectionDate?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'verifier' | 'admin';
}

export interface LoanApplicationForm {
  applicantFirstName: string;
  applicantLastName: string;
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired';
  employmentAddress: string;
  reasonForLoan: string;
  loanAmount: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalBorrowers: number;
  totalLoans: number;
  cashDisbursed: number;
  cashReceived: number;
  savings: number;
  repaidLoans: number;
  otherAccounts: number;
  pendingLoans: number;
  verifiedLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  activeUsers: number;
  loanApprovalRate: number;
  averageLoanAmount: number;
}

export interface MonthlyMetric {
  month: string;
  loansReleased: number;
  outstandingLoans: number;
  repaymentsCollected: number;
  totalApplications: number;
  totalAmount: number;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  success?: boolean;
}

export interface PaginationResponse<T> {
  applications?: T[];
  users?: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalApplications?: number;
    totalUsers?: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface StatusColors {
  pending: string;
  verified: string;
  approved: string;
  rejected: string;
} 