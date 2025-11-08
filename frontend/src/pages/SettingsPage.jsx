import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaBell, FaAws } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaEnvelope className="mr-3 text-blue-600" />
            Account Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <p className="text-lg text-gray-800 font-medium">{user?.email}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Note:</strong> This is the email address where your personal daily summaries will be sent.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaBell className="mr-3 text-purple-600" />
            Notification Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Daily Summary Email</p>
                <p className="text-sm text-gray-600">Receive a daily summary of your tasks</p>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Enabled
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Task Reminders</p>
                <p className="text-sm text-gray-600">Get notified about pending tasks</p>
              </div>
              <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* AWS Integration Info */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaAws className="mr-3 text-orange-600 text-2xl" />
            AWS Integration Ready
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              This application is architected for seamless AWS integration:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>DynamoDB:</strong> Replace JSON storage with scalable database</li>
              <li><strong>Lambda:</strong> Automated daily summary generation</li>
              <li><strong>SES:</strong> Professional email delivery service</li>
              <li><strong>SNS:</strong> Real-time notifications and alerts</li>
              <li><strong>EventBridge:</strong> Scheduled task automation</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              See the AWS_INTEGRATION.md file for detailed migration steps.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
