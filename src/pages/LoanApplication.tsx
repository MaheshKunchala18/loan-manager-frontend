import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { apiCall } from '@/services/api';
import { LoanApplicationForm } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';

const LoanApplication: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for a Loan</h1>
          <p className="text-gray-600">Fill out the form below to submit your loan application</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
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
                  {/* Personal Information */}
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
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">{errors.root.message}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Submit
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chart placeholder */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-4">Chart</h3>
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-xs">Loan statistics will be</p>
                    <p className="text-xs">displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Any personal and credit information presented will be used to 
                      ascertain the decisions from our lines and will be released to them along with the 
                      information of a call requesting background.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">3</div>
                      <div className="text-xs text-gray-500">STEPS TO APPLY</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication; 