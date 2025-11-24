"use client";

import { Terminal, CreditCard, Activity, DollarSign, Users, Search, Bell } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartAreaGradient } from "@/components/ChartAreaGradient"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-foreground selection:text-background flex flex-col">
      
      {/* Header */}
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Link href="/" className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              <span>GRAVITY-ERC20-PAYMENT</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-12 text-sm ml-auto mr-12">
            <Link href="/dashboard" className="hover:underline decoration-2 underline-offset-4 font-bold text-primary">./dashboard</Link>
            <Link href="/#about" className="hover:underline decoration-2 underline-offset-4">./about</Link>
            <Link href="/#features" className="hover:underline decoration-2 underline-offset-4">./features</Link>
            <Link href="/#testimonials" className="hover:underline decoration-2 underline-offset-4">./testimonials</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2 font-mono">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              0x1234...5678
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 space-y-8 p-8 pt-6 container mx-auto">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8 w-[200px] lg:w-[300px]" />
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Select defaultValue="30">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button>Download Report</Button>
          </div>
        </div>

        {/* Tabs (Visual only for now) */}
        <div className="flex items-center space-x-4 border-b border-border pb-4">
          <Button variant="secondary" className="rounded-full px-6">Overview</Button>
          <Button variant="ghost" className="rounded-full px-6">Analytics</Button>
          <Button variant="ghost" className="rounded-full px-6">Reports</Button>
          <Button variant="ghost" className="rounded-full px-6">Notifications</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Merchants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart Area */}
          <div className="col-span-4">
            <ChartAreaGradient />
          </div>

          {/* Recent Sales */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                You made 265 sales this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", token: "USDC" },
                  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", token: "ETH" },
                  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", token: "USDT" },
                  { name: "William Kim", email: "will@email.com", amount: "+$99.00", token: "DAI" },
                  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", token: "USDC" }
                ].map((sale, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {sale.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{sale.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.email}
                      </p>
                    </div>
                    <div className="ml-auto font-medium flex flex-col items-end">
                      <span>{sale.amount}</span>
                      <span className="text-[10px] text-muted-foreground">{sale.token}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
