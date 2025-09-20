import React, { useState } from "react";
import axios from "axios";
import {
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000";

interface TransactionStatus {
  custom_order_id: string;
  school_id: string;
  student_info: {
    name: string;
    id: string;
    email: string;
  };
  status: string;
  order_amount: number;
  transaction_amount: number;
  payment_mode: string;
  payment_time: string;
  payment_message: string;
  error_message: string;
}

function TransactionStatus() {
  const [customOrderId, setCustomOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus | null>(
    null
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customOrderId.trim()) {
      setError("Please enter a custom order ID");
      return;
    }

    setLoading(true);
    setError("");
    setTransaction(null);

    try {
      const response = await axios.get(
        `${API_URL}/transactions/status/${customOrderId.trim()}`
      );

      if (response.data) {
        setTransaction(response.data);
      } else {
        setError("Transaction not found");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Transaction not found");
      } else {
        setError(
          err.response?.data?.message || "Failed to fetch transaction status"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "pending":
      case "initiated":
        return <Clock className="h-8 w-8 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "pending":
      case "initiated":
        return "text-yellow-600 dark:text-yellow-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transaction Status Checker
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Enter a custom order ID to check the current status of a transaction
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="customOrderId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Custom Order ID
            </label>
            <div className="flex space-x-4">
              <input
                id="customOrderId"
                type="text"
                value={customOrderId}
                onChange={(e) => setCustomOrderId(e.target.value)}
                placeholder="Enter custom order ID (e.g., ORDER_1234567890)"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !customOrderId.trim()}
                className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Check Status
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
              <div className="text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details */}
      {transaction && (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Transaction Details
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Order ID: {transaction.custom_order_id}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusIcon(transaction.status)}
                <span
                  className={`text-lg font-semibold uppercase ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Student Information
                </h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Name
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {transaction.student_info?.name || "Not available"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Student ID
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {transaction.student_info?.id || "Not available"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {transaction.student_info?.email || "Not available"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      School ID
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {transaction.school_id || "Not available"}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Payment Information
                </h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Order Amount
                    </dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-white">
                      {transaction.order_amount
                        ? formatCurrency(transaction.order_amount)
                        : "Not available"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Transaction Amount
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {transaction.transaction_amount
                        ? formatCurrency(transaction.transaction_amount)
                        : "Not available"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Payment Mode
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {transaction.payment_mode || "Not available"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Payment Time
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {formatDate(transaction.payment_time)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Payment Message */}
            {transaction.payment_message && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                  Payment Message
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {transaction.payment_message}
                </p>
              </div>
            )}

            {/* Error Message */}
            {transaction.error_message &&
              transaction.error_message !== "NA" && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                  <h4 className="text-sm font-medium text-red-900 dark:text-red-200 mb-2">
                    Error Message
                  </h4>
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {transaction.error_message}
                  </p>
                </div>
              )}

            {/* Status Badge */}
            <div className="mt-6 flex items-center justify-center">
              <div
                className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
                  transaction.status?.toLowerCase() === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : transaction.status?.toLowerCase() === "pending" ||
                      transaction.status?.toLowerCase() === "initiated"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : transaction.status?.toLowerCase() === "failed"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {getStatusIcon(transaction.status)}
                <span className="ml-2 uppercase">
                  {transaction.status || "Unknown Status"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionStatus;
