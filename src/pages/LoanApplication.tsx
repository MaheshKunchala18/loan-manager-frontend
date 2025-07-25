import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiCall } from '@/services/api';
import { LoanApplicationForm } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';

const LoanApplication: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoanApplicationForm>();

  const onSubmit = async (data: LoanApplicationForm) => {
    setLoading(true);
    try {
      await apiCall.post('/loans', data);
      toast.success('Loan application submitted successfully!');
      navigate('/loans');
    } catch (error: any) {
      setError('root', { 
        message: error.response?.data?.message || 'Failed to submit application' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for a Loan</h1>
          <p className="text-gray-600">Fill out the form below to submit your loan application</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold">Apply for a Loan</h2>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">M</span>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold">A</span>
                      </div>
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-xs font-bold">S</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">HOW FAST DO YOU</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First name of applicant"
                      placeholder="Enter first name"
                      {...register('applicantFirstName', {
                        required: 'First name is required',
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: 'Only letters and spaces allowed',
                        },
                      })}
                      error={errors.applicantFirstName?.message}
                    />

                    <Input
                      label="Last name of applicant"
                      placeholder="Enter last name"
                      {...register('applicantLastName', {
                        required: 'Last name is required',
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: 'Only letters and spaces allowed',
                        },
                      })}
                      error={errors.applicantLastName?.message}
                    />
                  </div>

                  <Input
                    label="Employment status"
                    as="select"
                    {...register('employmentStatus', {
                      required: 'Employment status is required',
                    })}
                    error={errors.employmentStatus?.message}
                  >
                    <option value="">Select employment status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="student">Student</option>
                    <option value="retired">Retired</option>
                  </Input>

                  <Input
                    label="Reason for loan"
                    as="textarea"
                    rows={4}
                    placeholder="Please explain why you need this loan"
                    {...register('reasonForLoan', {
                      required: 'Reason for loan is required',
                      minLength: {
                        value: 10,
                        message: 'Please provide at least 10 characters',
                      },
                    })}
                    error={errors.reasonForLoan?.message}
                  />

                  <Input
                    label="Employment address"
                    placeholder="Enter your complete employment address"
                    {...register('employmentAddress', {
                      required: 'Employment address is required',
                      minLength: {
                        value: 10,
                        message: 'Please provide a complete address',
                      },
                    })}
                    error={errors.employmentAddress?.message}
                  />

                  <Input
                    label="Loan Amount (₹)"
                    type="number"
                    placeholder="Enter loan amount"
                    min="1000"
                    max="10000000"
                    {...register('loanAmount', {
                      required: 'Loan amount is required',
                      min: {
                        value: 1000,
                        message: 'Minimum loan amount is ₹1,000',
                      },
                      max: {
                        value: 10000000,
                        message: 'Maximum loan amount is ₹1,00,00,000',
                      },
                    })}
                    error={errors.loanAmount?.message}
                  />

                  {errors.root && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{errors.root.message}</p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/loans')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Submit Application
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Loan Information</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Interest Rate</p>
                    <p className="text-lg font-semibold">12% - 18% per annum</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Processing Time</p>
                    <p className="text-lg font-semibold">2-5 business days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Minimum Amount</p>
                    <p className="text-lg font-semibold">₹1,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Maximum Amount</p>
                    <p className="text-lg font-semibold">₹10,00,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Required Documents</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Valid ID proof (Aadhar/PAN/Passport)</li>
                  <li>• Address proof</li>
                  <li>• Income proof (Salary slips/ITR)</li>
                  <li>• Bank statements (3 months)</li>
                  <li>• Employment verification</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Why Choose CreditSea?</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Quick approval process</li>
                  <li>• Competitive interest rates</li>
                  <li>• Flexible repayment options</li>
                  <li>• No hidden charges</li>
                  <li>• 24/7 customer support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication; 