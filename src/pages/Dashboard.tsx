import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiCall } from '@/services/api';
import { DashboardStats, MonthlyMetric, LoanApplication } from '@/types';
import StatCard from '@/components/ui/StatCard';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { 
  Users, 
  DollarSign, 
  FileText, 
  TrendingUp,
  Banknote,
  PiggyBank,
  Building,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDate, capitalize } from '@/utils/format';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user, isAdmin, isVerifier } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLoans, setRecentLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      if (!showRefreshToast) setLoading(true);
      
      if (isVerifier || isAdmin) {
        const [statsResponse, recentLoansResponse] = await Promise.all([
          apiCall.get<{ stats: DashboardStats }>('/dashboard/stats'),
          apiCall.get<{ recentLoans: LoanApplication[] }>('/dashboard/recent-loans?limit=5')
        ]);
        
        setStats(statsResponse.data.stats);
        setRecentLoans(recentLoansResponse.data.recentLoans);
      } else {
        const userDashboard = await apiCall.get<any>('/dashboard/user');
        const userStats = userDashboard.data.userStats;
        setStats({
          totalUsers: 1,
          totalBorrowers: 1,
          totalLoans: userStats.totalApplications,
          cashDisbursed: userStats.totalApprovedAmount,
          cashReceived: userStats.totalApprovedAmount * 1.15,
          savings: userStats.totalApprovedAmount * 0.8,
          repaidLoans: userStats.approvedApplications,
          otherAccounts: 1,
          pendingLoans: userStats.pendingApplications,
          verifiedLoans: 0,
          approvedLoans: userStats.approvedApplications,
          rejectedLoans: userStats.rejectedApplications,
          activeUsers: 1,
          loanApprovalRate: userStats.totalApplications > 0 ? (userStats.approvedApplications / userStats.totalApplications) * 100 : 0,
          averageLoanAmount: userStats.approvedApplications > 0 ? userStats.totalApprovedAmount / userStats.approvedApplications : 0
        });
        setRecentLoans(userDashboard.data.recentApplications || []);
      }
      
      if (showRefreshToast) {
        toast.success('Dashboard updated successfully!');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (showRefreshToast) {
        toast.error('Failed to refresh dashboard');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isVerifier, isAdmin]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!isAdmin && !isVerifier) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData, isAdmin, isVerifier]);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getDashboardTitle = () => {
    if (isAdmin) return 'Admin Dashboard';
    if (isVerifier) return 'Verifier Dashboard';
    return 'My Dashboard';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getDashboardTitle()}</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
          {(isAdmin || isVerifier) && (
            <p className="text-xs text-gray-500 mt-1">
              🔄 Auto-refreshes every 30 seconds
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
          {user?.role && (
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white">
              <span className="text-lg font-bold">{user.firstName?.charAt(0)}</span>
            </div>
          )}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Users"
            value={stats.totalUsers}
            icon={<Users className="h-6 w-6" />}
            formatType="number"
            iconBgColor="bg-blue-500"
          />
          <StatCard
            title="Borrowers"
            value={stats.totalBorrowers}
            icon={<Users className="h-6 w-6" />}
            formatType="number"
            iconBgColor="bg-green-500"
          />
          <StatCard
            title="Cash Disbursed"
            value={stats.cashDisbursed}
            icon={<Banknote className="h-6 w-6" />}
            formatType="currency"
            iconBgColor="bg-primary-500"
          />
          <StatCard
            title="Cash Received"
            value={stats.cashReceived}
            icon={<TrendingUp className="h-6 w-6" />}
            formatType="currency"
            iconBgColor="bg-green-500"
          />

          <StatCard
            title="Savings"
            value={stats.savings}
            icon={<PiggyBank className="h-6 w-6" />}
            formatType="currency"
            iconBgColor="bg-blue-500"
          />
          <StatCard
            title="Repaid Loans"
            value={stats.repaidLoans}
            icon={<FileText className="h-6 w-6" />}
            formatType="number"
            iconBgColor="bg-green-500"
          />
          <StatCard
            title="Other Accounts"
            value={stats.otherAccounts}
            icon={<Building className="h-6 w-6" />}
            formatType="number"
            iconBgColor="bg-gray-500"
          />
          <StatCard
            title="Loans"
            value={stats.totalLoans}
            icon={<CreditCard className="h-6 w-6" />}
            formatType="number"
            iconBgColor="bg-primary-500"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Loans</h2>
            <div className="flex space-x-2">
              <button className="text-sm text-gray-500 hover:text-gray-700">Sort</button>
              <button className="text-sm text-gray-500 hover:text-gray-700">Filter</button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {recentLoans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-medium text-gray-600">User Details</th>
                    <th className="text-left py-3 font-medium text-gray-600">Customer Name</th>
                    <th className="text-left py-3 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLoans.map((loan) => (
                    <tr key={loan._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                            {loan.applicantFirstName?.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-600">
                            {typeof loan.userId === 'object' ? loan.userId.email : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div>
                          <p className="font-medium">
                            {loan.applicantFirstName} {loan.applicantLastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(loan.loanAmount)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 text-gray-600">
                        <div>
                          <p>{formatDate(loan.createdAt)}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(loan.createdAt).toLocaleTimeString('en-IN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant={loan.status as any}>
                          {capitalize(loan.status)}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <button className="text-gray-400 hover:text-gray-600">
                          •••
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No loan applications found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 