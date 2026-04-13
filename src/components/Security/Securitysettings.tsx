import React, { useState } from 'react';

const SecuritySettings: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');

  // Password strength checker
  const checkPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.match(/[a-z]/)) strength++;
    if (pwd.match(/[A-Z]/)) strength++;
    if (pwd.match(/[0-9]/)) strength++;
    if (pwd.match(/[^a-zA-Z0-9]/)) strength++;
    
    if (pwd.length === 0) return { text: 'No password', color: 'gray', width: 0 };
    if (strength <= 2) return { text: 'Weak', color: 'red', width: 25 };
    if (strength <= 4) return { text: 'Medium', color: 'yellow', width: 50 };
    return { text: 'Strong', color: 'green', width: 100 };
  };

  const strength = checkPasswordStrength(password);

  const handlePasswordChange = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (strength.text === 'Weak') {
      alert('Please use a stronger password');
      return;
    }
    alert('Password changed successfully!');
    setPassword('');
    setConfirmPassword('');
  };

  // 2FA Mockup
  const enable2FA = () => {
    const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(mockOTP);
    setShowOTPInput(true);
    alert(`Your OTP is: ${mockOTP} (Demo)`);
  };

  const verifyOTP = () => {
    if (otp === generatedOTP) {
      setIs2FAEnabled(true);
      setShowOTPInput(false);
      setOtp('');
      alert('2FA enabled successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const disable2FA = () => {
    setIs2FAEnabled(false);
    alert('2FA disabled successfully!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

      {/* Password Strength Meter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Enter new password"
            />
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300`}
                  style={{ 
                    width: `${strength.width}%`,
                    backgroundColor: strength.color === 'red' ? '#ef4444' : strength.color === 'yellow' ? '#eab308' : '#22c55e'
                  }}
                />
              </div>
              <p className={`text-sm mt-1 text-${strength.color}-600`}>
                Password Strength: {strength.text}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Use at least 8 characters with uppercase, lowercase, number and special character
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Confirm new password"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            onClick={handlePasswordChange}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* 2FA Mockup */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication (2FA)</h3>
        
        {!is2FAEnabled ? (
          <div>
            <p className="text-gray-600 mb-4">
              Add an extra layer of security to your account by enabling 2FA.
            </p>
            {!showOTPInput ? (
              <button
                onClick={enable2FA}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Enable 2FA
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Enter the OTP sent to your registered email
                </p>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-48"
                  maxLength={6}
                />
                <div className="flex gap-2">
                  <button
                    onClick={verifyOTP}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Verify OTP
                  </button>
                  <button
                    onClick={() => setShowOTPInput(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-600">✓</span>
              <span className="text-green-600 font-medium">2FA is enabled</span>
            </div>
            <button
              onClick={disable2FA}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Disable 2FA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;