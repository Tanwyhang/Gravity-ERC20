"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUpRight, Coins, TrendingUp, Zap, Globe, ArrowDownRight, Clock, Users, Gauge } from "lucide-react";
import { ChartAreaGradient } from "@/components/ChartAreaGradient";
import { Badge } from "@/components/ui/badge";
import { TokenETH, TokenARB, TokenMATIC, TokenOP, TokenUSDC, TokenDAI, TokenUSDT } from '@web3icons/react';
import PixelBlast from "@/components/PixelBlast";

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="relative overflow-hidden border-2 group">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <PixelBlast pixelSize={4} pixelSizeJitter={0.5} color="#8A2BE2" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Coins className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">125,847 MNEE</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-3 w-3 text-primary" />
              <p className="text-xs text-muted-foreground font-medium">
                +20.1% from last month
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ≈ $189,771 USD
            </p>
          </CardContent>
        </Card>

        {/* Payment Links */}
        <Card className="relative overflow-hidden border-2 group hover:border-primary/50 transition-colors">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <PixelBlast pixelSize={4} pixelSizeJitter={0.5} color="#8A2BE2" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Payment Links</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">2,350</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-3 w-3 text-primary" />
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">+18%</span> from last month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="relative overflow-hidden border-2 group hover:border-primary/50 transition-colors">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <PixelBlast pixelSize={4} pixelSizeJitter={0.5} color="#8A2BE2" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">98.7%</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-3 w-3 text-primary" />
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">+0.4%</span> improvement
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Avg Transaction */}
        <Card className="relative overflow-hidden border-2 group hover:border-primary/50 transition-colors">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <PixelBlast pixelSize={4} pixelSizeJitter={0.5} color="#8A2BE2" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">53.5 MNEE</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowDownRight className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                <span className="text-muted-foreground font-medium">-2.3%</span> from last month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Top Performers */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Main Chart */}
        <div className="col-span-4">
          <ChartAreaGradient />
        </div>

        {/* Top Payment Links */}
        <Card className="col-span-3 border-2 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <PixelBlast pixelSize={4} pixelSizeJitter={0.5} color="#8A2BE2" />
          </div>
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>
                  Highest earning payment links this month
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <div className="h-2 w-2 rounded-full bg-primary mr-1.5 animate-pulse" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-5">
              {[
                { name: "NFT Mint Event", id: "/vlftnqm", amount: "12,450", token: "ETH→USDC", growth: "+24%", icon: TokenETH },
                { name: "Premium Sub", id: "/abc123x", amount: "8,920", token: "ARB→DAI", growth: "+18%", icon: TokenARB },
                { name: "Creator Donation", id: "/donate01", amount: "6,780", token: "MATIC", growth: "+31%", icon: TokenMATIC },
                { name: "Consulting", id: "/consult", amount: "5,340", token: "OP→USDT", growth: "+12%", icon: TokenOP },
                { name: "Digital Product", id: "/prod789", amount: "3,890", token: "BASE", growth: "+9%", icon: Coins }
              ].map((sale, i) => (
                <div key={i} className="flex items-center group hover:bg-muted/50 -mx-3 px-3 py-2.5 rounded-lg transition-all border border-transparent hover:border-border">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                      <sale.icon className="h-6 w-6 text-primary" variant="mono" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background" />
                  </div>
                  <div className="ml-3 space-y-0.5 flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-none truncate">{sale.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground font-mono">{sale.id}</p>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-semibold">
                        {sale.token}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-bold text-sm">{sale.amount}</div>
                    <div className="text-[10px] text-primary font-bold">{sale.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chain Distribution & Token Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Chain Distribution */}
        <Card className="border-2 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <PixelBlast pixelSize={4} pixelSizeJitter={0.5} color="#8A2BE2" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle>Source Chain Distribution</CardTitle>
            <CardDescription>Where payments are coming from</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              {[
                { chain: "ETH", percentage: 42, color: "bg-primary", txCount: "5,124", Icon: TokenETH },
                { chain: "ARB", percentage: 23, color: "bg-primary/80", txCount: "2,805", Icon: TokenARB },
                { chain: "MATIC", percentage: 18, color: "bg-primary/60", txCount: "2,196", Icon: TokenMATIC },
                { chain: "OP", percentage: 12, color: "bg-primary/40", txCount: "1,464", Icon: TokenOP },
                { chain: "BASE", percentage: 5, color: "bg-primary/20", txCount: "610", Icon: Coins }
              ].map((chain, i) => (
                <div key={i} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
                        <chain.Icon className="h-5 w-5 text-primary" variant="mono" />
                      </div>
                      <span className="font-semibold text-sm">{chain.chain}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-xs font-medium">{chain.txCount} tx</span>
                      <span className="font-bold text-sm min-w-[3rem] text-right">{chain.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden border border-border">
                    <div 
                      className={`h-full ${chain.color} transition-all duration-700 ease-out`}
                      style={{ width: `${chain.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Converting Tokens */}
        <Card className="border-2 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <PixelBlast pixelSize={4} pixelSizeJitter={0.5} color="#8A2BE2" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle>Top Converting Tokens</CardTitle>
            <CardDescription>Most popular input tokens</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-3.5">
              {[
                { token: "USDC", volume: "45,230 MNEE", percentage: 36, Icon: TokenUSDC },
                { token: "ETH", volume: "32,120 MNEE", percentage: 26, Icon: TokenETH },
                { token: "USDT", volume: "21,450 MNEE", percentage: 17, Icon: TokenUSDT },
                { token: "MATIC", volume: "15,890 MNEE", percentage: 13, Icon: TokenMATIC },
                { token: "DAI", volume: "11,157 MNEE", percentage: 8, Icon: TokenDAI }
              ].map((token, i) => (
                <div key={i} className="flex items-center justify-between group hover:bg-muted/50 -mx-3 px-3 py-2.5 rounded-lg transition-all border border-transparent hover:border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                      <token.Icon className="h-5 w-5 text-primary" variant="mono" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{token.token}</div>
                      <div className="text-xs text-muted-foreground">{token.volume}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{token.percentage}%</div>
                    <div className="text-xs text-muted-foreground">of volume</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 hover:border-primary/50 transition-colors relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <PixelBlast pixelSize={4} pixelSizeJitter={0.5} color="#8A2BE2" />
          </div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Settlement Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">2.3s</div>
            <p className="text-xs text-muted-foreground mt-1">Via LiFi routing</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:border-primary/50 transition-colors relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <PixelBlast pixelSize={4} pixelSizeJitter={0.5} color="#ffffff" />
          </div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cross-Chain %</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground mt-1">Multi-hop conversions</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <PixelBlast pixelSize={4} pixelSizeJitter={0.5} color="#ffffff" />
          </div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unique Payers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground mt-1">+324 this month</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <PixelBlast pixelSize={4} pixelSizeJitter={0.5} color="#ffffff" />
          </div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gas Saved</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">$4,290</div>
            <p className="text-xs text-muted-foreground mt-1">Via optimization</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
