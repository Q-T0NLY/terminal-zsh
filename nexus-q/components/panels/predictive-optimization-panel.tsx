"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Target, Brain, AlertCircle, ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"

const predictions = [
  {
    id: 1,
    metric: "CPU Usage",
    current: 45,
    predicted: 72,
    confidence: 89,
    trend: "up",
    recommendation: "Scale up compute resources",
  },
  {
    id: 2,
    metric: "Memory",
    current: 68,
    predicted: 85,
    confidence: 92,
    trend: "up",
    recommendation: "Increase memory allocation",
  },
  {
    id: 3,
    metric: "Response Time",
    current: 145,
    predicted: 98,
    confidence: 85,
    trend: "down",
    recommendation: "Optimization working well",
  },
  {
    id: 4,
    metric: "Error Rate",
    current: 2.3,
    predicted: 1.1,
    confidence: 78,
    trend: "down",
    recommendation: "Continue current strategy",
  },
]

const forecastData = [
  { time: "Now", actual: 45, predicted: 45, lower: 40, upper: 50 },
  { time: "+1h", actual: null, predicted: 52, lower: 47, upper: 57 },
  { time: "+2h", actual: null, predicted: 58, lower: 52, upper: 64 },
  { time: "+3h", actual: null, predicted: 65, lower: 58, upper: 72 },
  { time: "+4h", actual: null, predicted: 72, lower: 64, upper: 80 },
  { time: "+5h", actual: null, predicted: 68, lower: 60, upper: 76 },
  { time: "+6h", actual: null, predicted: 62, lower: 54, upper: 70 },
]

const optimizationOpportunities = [
  {
    id: 1,
    title: "Database Query Optimization",
    impact: "High",
    savings: "35% faster",
    effort: "Medium",
    status: "recommended",
  },
  {
    id: 2,
    title: "Cache Strategy Improvement",
    impact: "High",
    savings: "40% reduction",
    effort: "Low",
    status: "recommended",
  },
  {
    id: 3,
    title: "Auto-scaling Configuration",
    impact: "Medium",
    savings: "25% cost reduction",
    effort: "Low",
    status: "in-progress",
  },
  {
    id: 4,
    title: "API Response Compression",
    impact: "Medium",
    savings: "30% bandwidth",
    effort: "Low",
    status: "completed",
  },
]

const anomalyData = [
  { time: "00:00", value: 45, anomaly: false },
  { time: "04:00", value: 42, anomaly: false },
  { time: "08:00", value: 58, anomaly: false },
  { time: "12:00", value: 92, anomaly: true },
  { time: "16:00", value: 65, anomaly: false },
  { time: "20:00", value: 48, anomaly: false },
]

export function PredictiveOptimizationPanel() {
  const [selectedMetric, setSelectedMetric] = useState("cpu")

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Predictive Optimization</h2>
          <p className="text-muted-foreground">AI-powered performance forecasting and optimization recommendations</p>
        </div>
        <Button>
          <Brain className="mr-2 h-4 w-4" />
          Run Analysis
        </Button>
      </div>

      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {predictions.map((prediction) => (
              <motion.div key={prediction.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{prediction.metric}</CardTitle>
                        <CardDescription>Next 4 hours prediction</CardDescription>
                      </div>
                      {prediction.trend === "up" ? (
                        <ArrowUp className="h-5 w-5 text-red-500" />
                      ) : (
                        <ArrowDown className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="text-2xl font-bold">{prediction.current}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Predicted</p>
                        <p className="text-2xl font-bold">{prediction.predicted}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-medium">{prediction.confidence}%</span>
                      </div>
                      <Progress value={prediction.confidence} />
                    </div>

                    <div className="p-3 bg-accent rounded-lg">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {prediction.recommendation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Opportunities</CardTitle>
              <CardDescription>AI-identified improvements ranked by impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationOpportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <div className="flex-1">
                        <p className="font-medium">{opportunity.title}</p>
                        <p className="text-sm text-muted-foreground">Expected savings: {opportunity.savings}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge
                          variant={
                            opportunity.impact === "High"
                              ? "default"
                              : opportunity.impact === "Medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {opportunity.impact} Impact
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{opportunity.effort} Effort</p>
                      </div>
                      <Badge
                        variant={
                          opportunity.status === "completed"
                            ? "default"
                            : opportunity.status === "in-progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {opportunity.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground mt-1">Per month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Performance Gain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">42%</div>
                <p className="text-xs text-muted-foreground mt-1">Average improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">Active recommendations</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection</CardTitle>
              <CardDescription>AI-powered detection of unusual patterns and behaviors</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Scatter data={anomalyData.filter((d) => !d.anomaly)} fill="#3b82f6" name="Normal" />
                  <Scatter data={anomalyData.filter((d) => d.anomaly)} fill="#ef4444" name="Anomaly" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Anomalies</CardTitle>
                <CardDescription>Detected unusual patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: "12:34 PM", type: "CPU Spike", severity: "high" },
                    { time: "10:15 AM", type: "Memory Leak", severity: "medium" },
                    { time: "08:22 AM", type: "Network Latency", severity: "low" },
                  ].map((anomaly, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle
                          className={`h-5 w-5 ${anomaly.severity === "high" ? "text-red-500" : anomaly.severity === "medium" ? "text-yellow-500" : "text-blue-500"}`}
                        />
                        <div>
                          <p className="font-medium">{anomaly.type}</p>
                          <p className="text-sm text-muted-foreground">{anomaly.time}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          anomaly.severity === "high"
                            ? "destructive"
                            : anomaly.severity === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {anomaly.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detection Stats</CardTitle>
                <CardDescription>Anomaly detection performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Detection Accuracy</span>
                    <span className="font-medium">94.5%</span>
                  </div>
                  <Progress value={94.5} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">False Positive Rate</span>
                    <span className="font-medium">2.1%</span>
                  </div>
                  <Progress value={2.1} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Response Time</span>
                    <span className="font-medium">1.2s</span>
                  </div>
                  <Progress value={80} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Forecasting</CardTitle>
              <CardDescription>6-hour prediction with confidence intervals</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="upper" stackId="1" stroke="none" fill="#3b82f6" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="lower" stackId="1" stroke="none" fill="#3b82f6" fillOpacity={0.1} />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">91.2%</div>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Prediction Horizon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">6h</div>
                <p className="text-xs text-muted-foreground mt-1">Maximum reliable range</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Model Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground mt-1">Current prediction</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
