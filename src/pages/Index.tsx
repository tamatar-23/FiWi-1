
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { PiggyBank, TrendingUp, MessageCircle, BarChart } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <section className="py-12 text-center">
          <div className="animate-fade-in space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-800">
              Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">FinancialWise</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Your personal AI-powered financial planning assistant that helps you make smarter decisions about your money
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/budget" className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-lg transform hover:-translate-y-1">
                Get Started
              </Link>
              <Link to="/chat" className="bg-white hover:bg-gray-50 text-green-700 border border-green-600 px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-lg transform hover:-translate-y-1">
                Ask AI Assistant
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Link to="/budget" className="transform transition-all duration-300 hover:scale-105">
              <Card className="h-full hover:shadow-lg transition-shadow border-green-100 overflow-hidden group relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <PiggyBank size={60} className="text-green-500 opacity-20" />
                </div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-green-700">Budget Planner</CardTitle>
                  <CardDescription>Create a personalized budget</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  Get AI-generated budget recommendations based on your income and expenses.
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/investments" className="transform transition-all duration-300 hover:scale-105">
              <Card className="h-full hover:shadow-lg transition-shadow border-green-100 overflow-hidden group relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp size={60} className="text-green-500 opacity-20" />
                </div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-green-700">Investment Plan</CardTitle>
                  <CardDescription>Plan your investments</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  Receive tailored investment recommendations based on your financial goals and risk tolerance.
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/chat" className="transform transition-all duration-300 hover:scale-105">
              <Card className="h-full hover:shadow-lg transition-shadow border-green-100 overflow-hidden group relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageCircle size={60} className="text-green-500 opacity-20" />
                </div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-green-700">Financial Assistant</CardTitle>
                  <CardDescription>Chat with our AI</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  Get answers to your financial questions and personalized advice.
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/score" className="transform transition-all duration-300 hover:scale-105">
              <Card className="h-full hover:shadow-lg transition-shadow border-green-100 overflow-hidden group relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart size={60} className="text-green-500 opacity-20" />
                </div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-green-700">Financial Score</CardTitle>
                  <CardDescription>Check your financial health</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  Calculate your financial wellness score and get tips for improvement.
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-16 bg-green-50 p-8 rounded-xl shadow-sm border border-green-100">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Why Choose FinancialWise?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4">
                <h3 className="font-semibold text-green-700 mb-2">Smart Budgeting</h3>
                <p className="text-gray-600">AI-powered budget recommendations tailored to your specific financial situation.</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-green-700 mb-2">Investment Insights</h3>
                <p className="text-gray-600">Get personalized investment strategies based on your goals and risk tolerance.</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-green-700 mb-2">Financial Education</h3>
                <p className="text-gray-600">Learn financial concepts and get answers to your questions from our AI assistant.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
