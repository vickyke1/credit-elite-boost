import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Calculator } from "lucide-react";

interface CreditAccount {
  id: string;
  cardDescription: string;
  ageInYears: number;
  creditLimit: number;
  amountOwed: number;
}

export const TradelineCalculator = () => {
  const [accounts, setAccounts] = useState<CreditAccount[]>([
    {
      id: "1",
      cardDescription: "Visa ending in 1234",
      ageInYears: 2.5,
      creditLimit: 10000,
      amountOwed: 2500,
    },
  ]);

  const addAccount = () => {
    const newAccount: CreditAccount = {
      id: Date.now().toString(),
      cardDescription: "",
      ageInYears: 0,
      creditLimit: 0,
      amountOwed: 0,
    };
    setAccounts([...accounts, newAccount]);
  };

  const removeAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const updateAccount = (id: string, field: keyof CreditAccount, value: string | number) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, [field]: value } : account
    ));
  };

  const calculateAverageAge = () => {
    if (accounts.length === 0) return 0;
    const totalAge = accounts.reduce((sum, account) => sum + account.ageInYears, 0);
    return (totalAge / accounts.length).toFixed(2);
  };

  const calculateOverallUtilization = () => {
    const totalLimit = accounts.reduce((sum, account) => sum + account.creditLimit, 0);
    const totalOwed = accounts.reduce((sum, account) => sum + account.amountOwed, 0);
    if (totalLimit === 0) return 0;
    return ((totalOwed / totalLimit) * 100).toFixed(2);
  };

  const calculateIndividualUtilization = (account: CreditAccount) => {
    if (account.creditLimit === 0) return 0;
    return ((account.amountOwed / account.creditLimit) * 100).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Calculator className="h-8 w-8 text-primary" />
          Tradeline Calculator
        </h1>
        <p className="text-muted-foreground mb-6">
          Calculate your average age of accounts and utilization ratios. Enter your revolving credit accounts 
          (credit cards) including both open and closed accounts. Do not enter installment loans, auto loans, 
          student loans, or mortgages.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Age of Accounts</CardTitle>
            <CardDescription>Average age across all revolving accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{calculateAverageAge()} years</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overall Utilization</CardTitle>
            <CardDescription>Total balance ÷ Total credit limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{calculateOverallUtilization()}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Accounts</CardTitle>
            <CardDescription>Number of revolving accounts entered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary-foreground">{accounts.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revolving Credit Accounts</CardTitle>
          <CardDescription>Enter your credit card accounts (both open & closed)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Card Description</th>
                  <th className="text-left p-2 font-medium">Age (Years)</th>
                  <th className="text-left p-2 font-medium">Credit Limit</th>
                  <th className="text-left p-2 font-medium">Amount Owed</th>
                  <th className="text-left p-2 font-medium">Individual Utilization</th>
                  <th className="text-left p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-b">
                    <td className="p-2">
                      <Input
                        placeholder="e.g., Visa ending in 1234"
                        value={account.cardDescription}
                        onChange={(e) => updateAccount(account.id, "cardDescription", e.target.value)}
                        className="min-w-[200px]"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="2.5"
                        value={account.ageInYears || ""}
                        onChange={(e) => updateAccount(account.id, "ageInYears", parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        placeholder="10000"
                        value={account.creditLimit || ""}
                        onChange={(e) => updateAccount(account.id, "creditLimit", parseInt(e.target.value) || 0)}
                        className="w-28"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        placeholder="2500"
                        value={account.amountOwed || ""}
                        onChange={(e) => updateAccount(account.id, "amountOwed", parseInt(e.target.value) || 0)}
                        className="w-28"
                      />
                    </td>
                    <td className="p-2">
                      <div className="font-medium text-center">
                        {calculateIndividualUtilization(account)}%
                      </div>
                    </td>
                    <td className="p-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAccount(account.id)}
                        disabled={accounts.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <Button onClick={addAccount} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How to Use This Calculator</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Get a recent copy of your credit report</li>
            <li>Identify your revolving accounts (credit cards) including closed accounts</li>
            <li>Calculate the age of each account in years (e.g., 2.5 years, 3.2 years)</li>
            <li>Enter the card description to identify each account (optional)</li>
            <li>Enter the credit limit for each account</li>
            <li>Enter the current amount owed on each account</li>
            <li>Add hypothetical new tradelines to see how they would affect your metrics</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};