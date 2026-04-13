import React, { useState } from 'react';

interface Transaction {
  id: number;
  amount: number;
  sender: string;
  receiver: string;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

const PaymentSection: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState(5000);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('deposit');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, amount: 1000, sender: 'John Investor', receiver: 'You', status: 'Completed', date: '2024-03-15' },
    { id: 2, amount: 500, sender: 'You', receiver: 'Sarah Startup', status: 'Completed', date: '2024-03-14' },
    { id: 3, amount: 2000, sender: 'Mike VC', receiver: 'You', status: 'Pending', date: '2024-03-13' },
  ]);

  const handleTransaction = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      amount: numAmount,
      sender: transactionType === 'deposit' ? 'You' : 'You',
      receiver: transactionType === 'deposit' ? 'Wallet' : receiverEmail || 'Unknown',
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
    };

    if (transactionType === 'deposit') {
      setWalletBalance(walletBalance + numAmount);
      newTransaction.sender = 'Bank Account';
      newTransaction.receiver = 'You';
    } else if (transactionType === 'withdraw') {
      if (numAmount > walletBalance) {
        alert('Insufficient balance');
        return;
      }
      setWalletBalance(walletBalance - numAmount);
      newTransaction.sender = 'You';
      newTransaction.receiver = 'Bank Account';
    } else if (transactionType === 'transfer') {
      if (numAmount > walletBalance) {
        alert('Insufficient balance');
        return;
      }
      if (!receiverEmail) {
        alert('Please enter receiver email');
        return;
      }
      setWalletBalance(walletBalance - numAmount);
      newTransaction.sender = 'You';
      newTransaction.receiver = receiverEmail;
    }

    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setReceiverEmail('');
    alert('Transaction completed successfully!');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payments & Wallet</h2>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
        <p className="text-sm opacity-80">Wallet Balance</p>
        <p className="text-4xl font-bold">${walletBalance.toLocaleString()}</p>
        <p className="text-sm opacity-80 mt-2">Available for funding deals</p>
      </div>

      {/* Transaction Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Make a Transaction</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <button
            onClick={() => setTransactionType('deposit')}
            className={`p-3 rounded-lg border ${
              transactionType === 'deposit' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setTransactionType('withdraw')}
            className={`p-3 rounded-lg border ${
              transactionType === 'withdraw' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Withdraw
          </button>
          <button
            onClick={() => setTransactionType('transfer')}
            className={`p-3 rounded-lg border ${
              transactionType === 'transfer' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Transfer
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="number"
            placeholder="Amount ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
          
          {transactionType === 'transfer' && (
            <input
              type="email"
              placeholder="Receiver Email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          )}
          
          <button
            onClick={handleTransaction}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Confirm {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">From</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">To</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t">
                  <td className="px-4 py-2 text-sm">{transaction.date}</td>
                  <td className="px-4 py-2 text-sm font-medium">${transaction.amount}</td>
                  <td className="px-4 py-2 text-sm">{transaction.sender}</td>
                  <td className="px-4 py-2 text-sm">{transaction.receiver}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;