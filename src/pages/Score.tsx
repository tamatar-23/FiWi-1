import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { callGeminiAI } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { useFinancial } from "@/context/FinancialContext";

interface ScoreResult {
  score: number;
  category: string;
  tips: string[];
}

const Score = () => {
  const { financialData, updateFinancialData } = useFinancial();
  const [monthlyIncome, setMonthlyIncome] = useState(financialData.monthlyIncome);
  const [monthlySavings, setMonthlySavings] = useState(financialData.monthlySavings);
  const [monthlyExpenses, setMonthlyExpenses] = useState(financialData.monthlyExpenses);
  const [totalDebt, setTotalDebt] = useState(financialData.totalDebt);
  const [loading, setLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

  // Initialize component with context data only once
  useEffect(() => {
    setMonthlyIncome(financialData.monthlyIncome);
    setMonthlySavings(financialData.monthlySavings);
    setMonthlyExpenses(financialData.monthlyExpenses);
    setTotalDebt(financialData.totalDebt);
  }, [financialData]);

  // Update context only when form is submitted, not on every change
  const updateFinancialContext = () => {
    updateFinancialData({
      monthlyIncome,
      monthlySavings,
      monthlyExpenses,
      totalDebt
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    updateFinancialContext(); // Update context when form is submitted

    try {
      const prompt = `Based on the following financial information for an Indian user:
      - Monthly Income: ₹${monthlyIncome}
      - Monthly Savings: ₹${monthlySavings}
      - Monthly Expenses: ₹${monthlyExpenses}
      - Total Debt: ₹${totalDebt}
      
      Calculate a financial health score from 0-100, categorize it (Poor: 0-25, Fair: 26-50, Good: 51-75, Excellent: 76-100),
      and provide 3-5 specific tips to improve their financial health.
      
      Return only a JSON object with this exact format, with NO other text, explanations or markdown:
      {
        "score": [number],
        "category": "[category]",
        "tips": ["tip1", "tip2", "tip3"]
      }`;

      const response = await callGeminiAI(prompt);

      // Clean the response - try to extract just the JSON part
      let parsedResult: ScoreResult;
      try {
        // Try to parse the raw response first
        parsedResult = JSON.parse(response);
      } catch (error) {
        // If that fails, try to extract JSON from the response
        // Look for content between curly braces
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedResult = JSON.parse(jsonMatch[0]);
          } catch (innerError) {
            console.error("Failed to extract JSON:", innerError);
            throw new Error("Could not extract valid JSON from the AI response");
          }
        } else {
          throw new Error("Could not find JSON data in the AI response");
        }
      }

      setScoreResult(parsedResult);
      toast({
        title: "Financial Score Generated",
        description: `Your financial health score is ${parsedResult.score} (${parsedResult.category})`,
      });
    } catch (error) {
      console.error("Error calculating financial score:", error);
      toast({
        title: "Error",
        description: "There was a problem calculating your financial score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 25) return "bg-red-500";
    if (score <= 50) return "bg-orange-500";
    if (score <= 75) return "bg-green-500";
    return "bg-green-500";
  };

  return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center text-[#2b2b2b]">Financial Score Calculator</h1>

          <div className="grid grid-cols-1 gap-8">
            <Card className="animate-fade-in mx-auto w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Enter Your Financial Information</CardTitle>
                <CardDescription>
                  Provide your financial details to calculate your financial health score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                    <Input
                        id="monthlyIncome"
                        type="number"
                        placeholder="Enter your monthly income"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlySavings">Monthly Savings (₹)</Label>
                    <Input
                        id="monthlySavings"
                        type="number"
                        placeholder="Enter your monthly savings"
                        value={monthlySavings}
                        onChange={(e) => setMonthlySavings(e.target.value)}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyExpenses">Monthly Expenses (₹)</Label>
                    <Input
                        id="monthlyExpenses"
                        type="number"
                        placeholder="Enter your monthly expenses"
                        value={monthlyExpenses}
                        onChange={(e) => setMonthlyExpenses(e.target.value)}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalDebt">Total Debt (₹)</Label>
                    <Input
                        id="totalDebt"
                        type="number"
                        placeholder="Enter your total debt"
                        value={totalDebt}
                        onChange={(e) => setTotalDebt(e.target.value)}
                        required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Calculating..." : "Calculate Financial Score"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {scoreResult && (
                <Card className="animate-fade-in mx-auto w-full max-w-2xl">
                  <CardHeader>
                    <CardTitle>Your Financial Health Score</CardTitle>
                    <CardDescription>
                      Based on your provided financial information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">{scoreResult.score}</div>
                      <div className="text-xl font-medium">{scoreResult.category}</div>
                    </div>

                    <div>
                      <Progress
                          value={scoreResult.score}
                          className={getScoreColor(scoreResult.score)}
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span>Poor</span>
                        <span>Fair</span>
                        <span>Good</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Improvement Tips</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {scoreResult.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
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

export default Score;