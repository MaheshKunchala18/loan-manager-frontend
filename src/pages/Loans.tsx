import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, FileText, Filter, ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { apiCall } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { LoanApplication } from '@/types';
import { formatCurrency, formatDate, capitalize } from '@/utils/format';
import { toast } from 'react-hot-toast';

const Loans: React.FC = () => {
  const { isVerifier, isAdmin } = useAuth();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      if (isVerifier || isAdmin) {
        const response = await apiCall.get<{ applications: LoanApplication[] }>('/loans');
        setLoans(response.data.applications);
      } else {
        const response = await apiCall.get<{ applications: LoanApplication[] }>('/loans/my-applications');
        setLoans(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (applicationId: string) => {
    try {
      await apiCall.put(`/loans/${applicationId}/verify`, {
        action: 'verify'
      });
      toast.success('Application verified successfully!');
      fetchLoans();
    } catch (error) {
      console.error('Error verifying application:', error);
      toast.error('Failed to verify application');
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      await apiCall.put(`/loans/${applicationId}/approve`, {
        action: 'approve'
      });
      toast.success('Application approved successfully!');
      fetchLoans();
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (applicationId: string, isApproval = false) => {
    try {
      const endpoint = isApproval ? `/loans/${applicationId}/approve` : `/loans/${applicationId}/verify`;
      await apiCall.put(endpoint, {
        action: 'reject'
      });
      toast.success('Application rejected successfully!');
      fetchLoans();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.applicantFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.applicantLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.reasonForLoan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBalanceDisplay = () => {
    const totalApproved = loans
      .filter(loan => loan.status === 'approved')
      .reduce((sum, loan) => sum + loan.loanAmount, 0);
    
    return formatCurrency(totalApproved);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isVerifier || isAdmin ? 'All Loans' : 'My Loans'}
          </h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-gray-500">🏠 Home</span>
            <span className="text-gray-500">💰 Payments</span>
            <span className="text-gray-500">📊 Budget</span>
            <span className="text-gray-500">💳 Card</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">🔔</span>
          <span className="text-gray-600">💬</span>
          <span className="text-gray-600">👤 User</span>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-green-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">BALANCE</p>
              <p className="text-3xl font-bold text-gray-900">{getBalanceDisplay()}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Borrow Cash</Button>
              <Button variant="outline" size="sm">Transact</Button>
              <Button variant="outline" size="sm">Deposit Cash</Button>
            </div>
          </div>
          
          {!isVerifier && !isAdmin && (
            <div className="mt-4">
              <Link to="/apply-loan">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Get a Loan
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for loans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Applied Loans</h2>
          
          {filteredLoans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-600 font-medium">Loan Officer</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Amount</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Date Applied</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.map((loan) => (
                    <tr key={loan._id} className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {loan.applicantFirstName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {loan.applicantFirstName} {loan.applicantLastName}
                            </p>
                            <p className="text-sm text-gray-600">{loan.employmentStatus}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-medium">
                        {formatCurrency(loan.loanAmount)}
                      </td>
                      <td className="py-4 text-gray-600">
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
                      <td className="py-4">
                        <Badge variant={loan.status as any}>
                          {capitalize(loan.status)}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          {isVerifier && loan.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleVerify(loan._id)}
                              >
                                Verify
                              </Button>
                              <Button 
                                size="sm" 
                                variant="danger"
                                onClick={() => handleReject(loan._id, false)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {isAdmin && loan.status === 'verified' && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(loan._id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="danger"
                                onClick={() => handleReject(loan._id, true)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost">View</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No loans found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No loans match your search criteria.' : 'You haven\'t applied for any loans yet.'}
              </p>
              {!isVerifier && !isAdmin && !searchTerm && (
                <Link to="/apply-loan">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply for Your First Loan
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Loans; 