import React, { useState } from "react";
import axios from "axios";
import { CreditCard, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const API_URL = "http://localhost:5000";

interface PaymentFormData {
  school_id: string;
  amount: string;
  callback_url: string;
  student_info: {
    name: string;
    id: string;
    email: string;
  };
}

function CreatePayment() {
  const [formData, setFormData] = useState<PaymentFormData>({
    school_id: "65b0e6293e9f76a9694d84b4",
    amount: "",
    callback_url: "https://google.com",
    student_info: {
      name: "",
      id: "",
      email: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("student_info.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        student_info: {
          ...prev.student_info,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        `${API_URL}/payment/create-payment`,
        formData
      );
      setResult(response.data);

      // Optionally redirect to payment URL
      if (response.data.payment_url) {
        const openPayment = window.confirm(
          "Payment request created successfully! Do you want to open the payment page?"
        );
        if (openPayment) {
          window.open(response.data.payment_url, "_blank");
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to create payment request"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      school_id: "65b0e6293e9f76a9694d84b4",
      amount: "",
      callback_url: "https://google.com",
      student_info: {
        name: "",
        id: "",
        email: "",
      },
    });
    setResult(null);
    setError("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Payment Request
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate a new payment link for student fee collection
        </p>
      </div>

      {/* Success Result */}
      {result && (
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Payment Request Created Successfully
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                <p>
                  <strong>Order ID:</strong> {result.custom_order_id}
                </p>
                <p>
                  <strong>Collect Request ID:</strong>{" "}
                  {result.collect_request_id}
                </p>
                {result.payment_url && (
                  <div>
                    <p>
                      <strong>Payment URL:</strong>
                    </p>
                    <a
                      href={result.payment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                      {result.payment_url}
                    </a>
                  </div>
                )}
              </div>
              <button
                onClick={resetForm}
                className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 dark:text-green-200 bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700"
              >
                Create Another Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
            <div className="text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <CreditCard className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Payment Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              School ID
            </label>
            <input
              type="text"
              name="school_id"
              value={formData.school_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (INR)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              min="1"
              step="0.01"
              required
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Callback URL
          </label>
          <input
            type="url"
            name="callback_url"
            value={formData.callback_url}
            onChange={handleInputChange}
            required
            placeholder="https://your-website.com/callback"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Student Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student Name
              </label>
              <input
                type="text"
                name="student_info.name"
                value={formData.student_info.name}
                onChange={handleInputChange}
                required
                placeholder="Enter student name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student ID
              </label>
              <input
                type="text"
                name="student_info.id"
                value={formData.student_info.id}
                onChange={handleInputChange}
                required
                placeholder="Enter student ID"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Student Email
            </label>
            <input
              type="email"
              name="student_info.email"
              value={formData.student_info.email}
              onChange={handleInputChange}
              required
              placeholder="Enter student email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Create Payment Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePayment;
