import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { callGeminiAI } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFinancial } from "@/context/FinancialContext";
import ReactMarkdown from "react-markdown";

interface BudgetData {
  name: string;
  amount: number;
}

const Budget = () => {
  const { financialData, updateFinancialData } = useFinancial();
  const [income, setIncome] = useState(financialData.monthlyIncome);
  const [expenses, setExpenses] = useState(financialData.monthlyExpenses);
  const [loading, setLoading] = useState(false);
  const [budgetData, setBudgetData] = useState<BudgetData[]>([]);

  // Update context only when form is submitted, not on every change
  const updateFinancialContext = () => {
    updateFinancialData({
      monthlyIncome: income,
      monthlyExpenses: expenses
    });
  };

  // Initialize component with context data only once
  useEffect(() => {
    setIncome(financialData.monthlyIncome);
    setExpenses(financialData.monthlyExpenses);
  }, [financialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    updateFinancialContext(); // Update context when form is submitted

    try {
      const prompt = `Given a monthly income of ${income} and main monthly expenses of ${expenses}, 
      create a detailed personal budget. Divide spending into categories like savings, housing, food, transportation, utilities, 
      entertainment, etc. Provide the budget as a JSON array with format: 
      [{name: "Category1", amount: value1}, {name: "Category2", amount: value2}] with NO additional text, explanation or markdown.`;

      const response = await callGeminiAI(prompt);

      // Clean the response - try to extract just the JSON part
      let jsonData;
      try {
        // Try to parse the raw response first
        jsonData = JSON.parse(response);
      } catch (error) {
        // If that fails, try to extract JSON from the response
        const jsonMatch = response.match(/\[.*\]/s);
        if (jsonMatch) {
          try {
            jsonData = JSON.parse(jsonMatch[0]);
          } catch (innerError) {
            console.error("Failed to extract JSON:", innerError);
            throw new Error("Could not extract valid JSON from the AI response");
          }
        } else {
          throw new Error("Could not find JSON data in the AI response");
        }
      }

      setBudgetData(jsonData);
      toast({
        title: "Budget Generated",
        description: "Your personalized budget has been created!",
      });
    } catch (error) {
      console.error("Error generating budget:", error);
      toast({
        title: "Error",
        description: "There was a problem generating your budget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center text-[#2b2b2b]">Financial Budget Planner</h1>

          <div className="grid grid-cols-1 gap-8">
            <Card className="animate-fade-in mx-auto w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Enter Your Financial Details</CardTitle>
                <CardDescription>
                  Provide your monthly income and expenses for a personalized budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="income">Monthly Income (₹)</Label>
                    <Input
                        id="income"
                        type="number"
                        placeholder="Enter your monthly income"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expenses">Monthly Expenses (₹)</Label>
                    <Input
                        id="expenses"
                        type="text"
                        placeholder="List your main monthly expenses"
                        value={expenses}
                        onChange={(e) => setExpenses(e.target.value)}
                        required
                    />
                    <p className="text-sm text-gray-500">
                      Enter your total monthly expenses
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Generating Budget..." : "Generate Budget"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {budgetData.length > 0 && (
                <Card className="animate-fade-in mx-auto w-full max-w-2xl">
                  <CardHeader>
                    <CardTitle>Your Personalized Budget</CardTitle>
                    <CardDescription>
                      AI-generated budget breakdown based on your financial information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={budgetData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Budget Breakdown</h3>
                      <ul className="space-y-2">
                        {budgetData.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{item.name}</span>
                              <span>₹{item.amount.toLocaleString()}</span>
                            </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
            )}
          </div>
        </div>
      </Layout>
  );
};

export default Budget;