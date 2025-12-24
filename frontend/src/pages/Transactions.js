import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, DollarSign, LogOut } from 'lucide-react';
import { toast } from 'sonner';

function Transactions() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    transaction_type: 'expense',
    category: '',
    transaction_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const companyId = user?.company_id;
      const response = await api.getTransactions(companyId);
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
        company_id: user?.company_id,
        transaction_date: new Date(formData.transaction_date).toISOString(),
      });
      toast.success('Transaction created');
      setShowForm(false);
      setFormData({
        description: '',
        amount: '',
        transaction_type: 'expense',
        category: '',
        transaction_date: new Date().toISOString().split('T')[0],
      });
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to create transaction');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-primary">Global CFO LLC</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(user?.role === 'client' ? '/dashboard' : '/admin')} className="h-10 px-4 rounded-sm">
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => { logout(); navigate('/login'); }} data-testid="logout-btn" className="h-10 px-4 rounded-sm">
              <LogOut className="h-4 w-4 mr-2" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl tracking-tight font-bold text-primary">Transactions</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            data-testid="add-transaction-btn"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-none font-bold uppercase tracking-wide"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {showForm && (
          <Card className="border border-slate-200 shadow-none rounded-md mb-8">
            <CardHeader>
              <CardTitle>New Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Transaction description"
                    className="h-11 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    placeholder="0.00"
                    className="h-11 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Type</label>
                  <Select
                    value={formData.transaction_type}
                    onValueChange={(value) => setFormData({ ...formData, transaction_type: value })}
                  >
                    <SelectTrigger className="h-11 rounded-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Optional"
                    className="h-11 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Date</label>
                  <Input
                    type="date"
                    value={formData.transaction_date}
                    onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                    required
                    className="h-11 rounded-sm"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    type="submit"
                    data-testid="submit-transaction-btn"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-none font-bold uppercase tracking-wide"
                  >
                    Create Transaction
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="h-11 rounded-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="border border-slate-200 shadow-none rounded-md">
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-slate-600">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-center py-8 text-slate-600">No transactions found</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-sm"
                    data-testid={`transaction-item-${txn.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${
                        txn.transaction_type === 'income' ? 'bg-emerald-50' : 'bg-red-50'
                      }`}>
                        <DollarSign className={`h-5 w-5 ${
                          txn.transaction_type === 'income' ? 'text-emerald-600' : 'text-red-600'
                        }`} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{txn.description}</p>
                        <p className="text-xs text-slate-600">
                          {txn.transaction_type} • {new Date(txn.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-bold ${
                        txn.transaction_type === 'income' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {txn.transaction_type === 'income' ? '+' : '-'}${txn.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-600">{txn.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Transactions;
