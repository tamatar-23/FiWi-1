
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { callGeminiAI } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { useFinancial } from "@/context/FinancialContext";

const Investments = () => {
  const { financialData, updateFinancialData } = useFinancial();
  const [income, setIncome] = useState(financialData.monthlyIncome);
  const [savings, setSavings] = useState(financialData.monthlySavings);
  const [riskProfile, setRiskProfile] = useState(financialData.riskProfile || "medium");
  const [loading, setLoading] = useState(false);
  const [strategyResult, setStrategyResult] = useState("");
  
  // Update context when values change
  useEffect(() => {
    if (income || savings) {
      updateFinancialData({
        monthlyIncome: income,
        monthlySavings: savings,
        riskProfile
      });
    }
  }, [income, savings, riskProfile, updateFinancialData]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const prompt = `Based on a monthly income of ₹${income}, monthly savings of ₹${savings}, and a ${riskProfile} risk tolerance, 
      provide a detailed investment strategy for an Indian investor. 
      Include specific investment vehicles available in India (like mutual funds, PPF, stocks, etc.), 
      suggested allocation percentages, expected returns, and a brief explanation of why this strategy 
      suits their risk profile. Format the response as paragraphs with headers.`;
      
      const response = await callGeminiAI(prompt);
      setStrategyResult(response);
      toast({
        title: "Investment Strategy Generated",
        description: "Your personalized investment strategy has been created!",
      });
    } catch (error) {
      console.error("Error generating investment strategy:", error);
      toast({
        title: "Error",
        description: "There was a problem generating your investment strategy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#2b2b2b]">Investment Strategy Generator</h1>
        
        <div className="grid grid-cols-1 gap-8">
          <Card className="animate-fade-in mx-auto w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Tell Us About Your Financial Situation</CardTitle>
              <CardDescription>
                Provide details for a personalized investment strategy
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
                  <Label htmlFor="savings">Monthly Savings (₹)</Label>
                  <Input
                    id="savings"
                    type="number"
                    placeholder="Enter your monthly savings"
                    value={savings}
                    onChange={(e) => setSavings(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Risk Tolerance</Label>
                  <RadioGroup 
                    value={riskProfile} 
                    onValueChange={setRiskProfile}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="risk-low" />
                      <Label htmlFor="risk-low">Low (Conservative)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="risk-medium" />
                      <Label htmlFor="risk-medium">Medium (Balanced)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="risk-high" />
                      <Label htmlFor="risk-high">High (Aggressive)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Generating Strategy..." : "Generate Investment Strategy"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {strategyResult && (
            <Card className="animate-fade-in mx-auto w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Your Investment Strategy</CardTitle>
                <CardDescription>
                  AI-generated investment recommendations based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {strategyResult.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('#')) {
                      const headerText = paragraph.replace(/^#+\s/, '');
                      return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{headerText}</h3>;
                    } else {
                      return <p key={index} className="mb-3">{paragraph}</p>;
                    }
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Investments;
