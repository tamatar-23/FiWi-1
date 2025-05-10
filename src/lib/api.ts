
// Gemini AI API utility functions

// Get API key from environment variables
export const GEMINI_API_KEY = "AIzaSyDY3SKcBrmkUTi4jIQhZnG_NDU0dZWKpfM";

export const callGeminiAI = async (prompt: string, model: string = "gemini-pro") => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is missing.");
    }
    
    console.log("Calling Gemini API with prompt:", prompt.substring(0, 50) + "...");
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/" + model + ":generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API Error:", error);
      throw new Error(`API request failed: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    console.log("Gemini API response received");
    
    // Extract the text content from Gemini's response structure
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error("Received empty response from Gemini");
    }
    
    return content;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

// Helper to generate budget recommendations
export const generateBudget = async (income: number, expenses: { [key: string]: number }) => {
  const totalExpenses = Object.values(expenses).reduce((sum, expense) => sum + expense, 0);
  
  const prompt = `
    As a financial advisor, create a detailed monthly budget breakdown for someone with:
    - Monthly income: $${income}
    - Current expenses: $${totalExpenses}
    
    Detailed expenses:
    ${Object.entries(expenses)
      .map(([category, amount]) => `- ${category}: $${amount}`)
      .join('\n')}
    
    Please provide:
    1. A budget allocation with specific percentages and dollar amounts for:
       - Essential expenses (housing, utilities, groceries, transportation)
       - Savings and investments
       - Debt repayment (if applicable)
       - Discretionary spending
    
    2. Two to three actionable tips to improve their financial situation
    
    Format your response as structured data that can be parsed as JSON. Use the following format:
    {
      "budget": {
        "essentials": {"percentage": number, "amount": number},
        "savings": {"percentage": number, "amount": number},
        "debt": {"percentage": number, "amount": number},
        "discretionary": {"percentage": number, "amount": number}
      },
      "tips": ["tip1", "tip2", "tip3"]
    }
  `;

  try {
    const response = await callGeminiAI(prompt);
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Could not extract valid JSON from the response");
  } catch (error) {
    console.error("Error generating budget:", error);
    throw new Error(`Failed to generate budget: ${error.message}`);
  }
};

// Helper to generate investment recommendations
export const generateInvestmentStrategy = async (
  income: number, 
  savings: number, 
  riskTolerance: "low" | "medium" | "high"
) => {
  const prompt = `
    As an investment advisor, create a personalized investment strategy for someone with:
    - Monthly income: $${income}
    - Total savings: $${savings}
    - Risk tolerance: ${riskTolerance}
    
    Please provide:
    1. Asset allocation (stocks, bonds, cash, etc.) with percentages
    2. Specific investment types suitable for their profile
    3. A monthly savings goal as a percentage of income and dollar amount
    4. Two specific investment recommendations with rationale
    
    Format your response as structured data that can be parsed as JSON. Use the following format:
    {
      "assetAllocation": {
        "stocks": number,
        "bonds": number,
        "cash": number,
        "other": number
      },
      "investmentTypes": ["type1", "type2", "type3"],
      "monthlySavingsGoal": {
        "percentage": number,
        "amount": number
      },
      "recommendations": [
        {"name": "string", "rationale": "string"},
        {"name": "string", "rationale": "string"}
      ]
    }
  `;

  try {
    const response = await callGeminiAI(prompt);
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Could not extract valid JSON from the response");
  } catch (error) {
    console.error("Error generating investment strategy:", error);
    throw new Error(`Failed to generate investment strategy: ${error.message}`);
  }
};

// Helper to calculate financial score
export const calculateFinancialScore = async (
  income: number,
  expenses: number,
  savings: number,
  debt: number,
  hasEmergencyFund: boolean,
  hasRetirementPlan: boolean
) => {
  const prompt = `
    As a financial analyst, calculate a financial health score (0-100) for someone with:
    - Monthly income: $${income}
    - Monthly expenses: $${expenses}
    - Total savings: $${savings}
    - Total debt: $${debt}
    - Has emergency fund: ${hasEmergencyFund ? "Yes" : "No"}
    - Has retirement plan: ${hasRetirementPlan ? "Yes" : "No"}
    
    Please provide:
    1. A numerical score from 0-100
    2. A category (Poor: 0-25, Fair: 26-50, Good: 51-75, Excellent: 76-100)
    3. Three specific recommendations to improve their score
    
    Format your response as structured data that can be parsed as JSON. Use the following format:
    {
      "score": number,
      "category": "string",
      "recommendations": ["string", "string", "string"]
    }
  `;

  try {
    const response = await callGeminiAI(prompt);
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Could not extract valid JSON from the response");
  } catch (error) {
    console.error("Error calculating financial score:", error);
    throw new Error(`Failed to calculate financial score: ${error.message}`);
  }
};
