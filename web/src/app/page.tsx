"use client";

import { Terminal, CreditCard, QrCode, Zap, ExternalLink } from "lucide-react"
import { TokenETH, TokenUNI, TokenARB, TokenUSDC, TokenUSDT, TokenDAI } from "@web3icons/react"
import Image from "next/image"
import Link from "next/link"
import { AuroraBackground } from "@/components/ui/shadcn-io/aurora-background"
import { QrScanAnimation } from "@/components/QrScanAnimation"
import { LaptopClickAnimation } from "@/components/LaptopClickAnimation"
import { IntroAnimation } from "@/components/IntroAnimation"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { paymentThemes, generatePaymentUrl } from "@/lib/themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentModal, PaymentModalConfig } from "@/components/PaymentModal"
import { QRCode } from "@/components/ui/shadcn-io/qr-code"
import { WalletConnectButton } from "@/components/WalletConnectButton"
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 800])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 700])

  const demoPaymentUrl = "http://localhost:3000/pay/kslwjq2?primaryColor=%23360740&backgroundColor=%23ff85c2&textColor=%23000000&borderColor=%2399ceff&borderRadius=12&buttonStyle=solid&tokenSymbol=ETH&tokenAmount=0.0402&merchantName=GRAVITY_PAY&transactionId=%23DEMO123&customTitle=DEMO+PAYMENT&recipientAddress=0x0ce3580766DcdDAf281DcCE968885A989E9B0e99&showTransactionId=true&animation=pulse&usdAmount=99.99&customThumbnail=https%3A%2F%2Fmwtzwo37egeya3fd.public.blob.vercel-storage.com%2Fkaiju-kingz-kaiju-V0KhO0S4xMTwH4f8EkymjqgO9R0Mrg.gif";

  const modalConfigsWithThumbnail: PaymentModalConfig[] = [
    {
      primaryColor: "#f97316", // Orange
      backgroundColor: "#fff7ed", // Pale Orange
      textColor: "#000000",
      borderColor: "#c2410c",
      borderRadius: 16,
      buttonStyle: "glow",
      tokenSymbol: "ETH",
      tokenAmount: "0.05",
      merchantName: "CHARITY_FUND",
      transactionId: "#DONATE-001",
      customTitle: "DONATE_LOVE",
      recipientAddress: "0x123...abc",
      showTransactionId: true,
      animation: "pulse",
      customThumbnail: "/Memes/kaijukingz-nft-collectibles.gif"
    },
    {
      primaryColor: "#243370", // Walrus Theme
      backgroundColor: "#d6fffa",
      textColor: "#000000",
      borderColor: "#030303",
      borderRadius: 17,
      buttonStyle: "solid",
      tokenSymbol: "USDC",
      tokenAmount: "50.00",
      merchantName: "CONCERT_TIX",
      transactionId: "#TICKET-882",
      customTitle: "VIP_ACCESS",
      recipientAddress: "0x456...def",
      showTransactionId: true,
      animation: "pulse",
      customThumbnail: "/Memes/gifs-4-moons-contest-sequel-top-10-best-moon-meme-gifs-will-v0-hyfdvpwknshb1.gif"
    },
    {
      primaryColor: "#ec4899", // Pink
      backgroundColor: "#fdf2f8", // Pale Pink
      textColor: "#000000",
      borderColor: "#be185d",
      borderRadius: 12,
      buttonStyle: "glow",
      tokenSymbol: "MNEE",
      tokenAmount: "1000",
      merchantName: "GAME_STORE",
      transactionId: "#GAME-999",
      customTitle: "LEVEL_UP",
      recipientAddress: "0x789...ghi",
      showTransactionId: true,
      animation: "bounce",
      customThumbnail: "/Memes/kaiju-kingz-kaiju.gif"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-foreground selection:text-background relative overflow-hidden">
      <IntroAnimation />
      
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Terminal className="h-5 w-5" />
            <span>GRAVITY-ERC20-PAYMENT</span>
          </div>
          <nav className="hidden md:flex gap-12 text-sm ml-auto mr-12">
            <Link href="/dashboard" className="hover:underline decoration-2 underline-offset-4 font-bold text-primary">./dashboard</Link>
            <a href="#about" className="hover:underline decoration-2 underline-offset-4">./about</a>
            <a href="#features" className="hover:underline decoration-2 underline-offset-4">./features</a>
            <a href="#testimonials" className="hover:underline decoration-2 underline-offset-4">./testimonials</a>
          </nav>
          <div className="flex items-center gap-4">
            <WalletConnectButton />
            <div className="text-xs text-muted-foreground hidden sm:block">
              v1.0.0-beta
            </div>
          </div>
        </div>
      </header>

      <main className="relative" ref={containerRef}>
        {/* Hero Section */}
        <AuroraBackground className="min-h-[calc(100vh-4rem)] h-auto bg-background dark:bg-background text-foreground">
          <section className="space-y-12 pt-12 flex flex-col items-center text-center relative z-10 w-full">
            <div className="space-y-8 w-full flex flex-col items-center">
              <div className="relative w-[30vw] h-[30vw] min-w-[300px] min-h-[300px]">
                <Image 
                  src="/logo.png" 
                  alt="Gravity Logo" 
                  fill
                  sizes="(max-width: 1000px) 300px, 30vw"
                  className="object-contain dark:invert"
                  priority
                />
              </div>
              <p className="text-muted-foreground text-sm font-mono justify-center max-w-2xl px-4">
                Pulling everything together
              </p>
            </div>
            
            

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.div whileHover={isConnected ? { scale: 1.05 } : {}} whileTap={isConnected ? { scale: 0.95 } : {}}>
                {isConnected ? (
                  <Link href="/create" className="bg-foreground text-background px-8 py-3 text-sm font-bold hover:bg-foreground/90 transition-colors inline-block text-center shadow-lg hover:shadow-xl">
                    [ CREATE ]
                  </Link>
                ) : (
                  <button disabled className="bg-foreground/50 text-background/50 px-8 py-3 text-sm font-bold cursor-not-allowed inline-block text-center shadow-none">
                    [ CREATE ]
                  </button>
                )}
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="border border-border px-8 py-3 text-sm font-bold hover:bg-muted/50 transition-colors shadow-sm hover:shadow-md bg-background"
              >
                [ WHITEPAPER ]
              </motion.button>
            </div>

            {/* Crypto Partnerships Marquee */}
            <h4 className="text-sm font-mono text-muted-foreground mb-8 tracking-widest uppercase mt-12 text-center">[ SUPPORTED_ECOSYSTEMS ]</h4>
            <div className="w-full mb-12 relative overflow-hidden -mx-4">
              <div className="relative flex w-full overflow-hidden bg-muted/20 rounded-xl py-8">
                <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused] items-center">
                  {[...Array(4)].map((_, setIndex) => (
                    <div key={setIndex} className="flex shrink-0 gap-16 items-center">
                      {[
                        { icon: <TokenETH className="w-24 h-24" variant="mono" /> },
                        { icon: <TokenUNI className="w-24 h-24" variant="mono" /> },
                        { icon: <TokenARB className="w-24 h-24" variant="mono" /> },
                        { icon: <TokenUSDC className="w-24 h-24" variant="mono" /> },
                        { icon: <TokenUSDT className="w-24 h-24" variant="mono" /> },
                        { icon: <TokenDAI className="w-24 h-24" variant="mono" /> }
                      ].map((partner, i) => (
                        <div key={`${setIndex}-${i}`} className="flex items-center justify-center p-4 rounded-lg transition-all duration-300">
                          {partner.icon}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* Gradient edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
              </div>
            </div>
          </section>
        </AuroraBackground>

            {/* Payment Modal Mockups */}
            <div ref={containerRef} className="relative w-full py-12">
              {/* Floating Shapes */}
              <motion.div style={{ y: y1 }} className="absolute -left-20 -top-20 z-10 w-[500px] h-[500px] pointer-events-none opacity-90 hidden lg:block backdrop-invert bg-white/30 brightness-125 [mask-image:url(/shapecylinder.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]">
                  <Image src="/shapecylinder.png" alt="" fill className="object-contain opacity-60" />
              </motion.div>
              <motion.div style={{ y: y2 }} className="absolute -right-40 top-20 z-30 w-[600px] h-[600px] pointer-events-none opacity-90 hidden lg:block backdrop-invert bg-white/30 brightness-125 [mask-image:url(/shapestar.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]">
                  <Image src="/shapestar.png" alt="" fill className="object-contain opacity-60" />
              </motion.div>
              <motion.div style={{ y: y3 }} className="absolute -left-40 bottom-150 z-30 w-[450px] h-[450px] pointer-events-none opacity-80 hidden lg:block backdrop-invert bg-white/30 brightness-125 [mask-image:url(/shapetube.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]">
                  <Image src="/shapetube.png" alt="" fill className="object-contain opacity-60" />
              </motion.div>
              <motion.div style={{ y: y4 }} className="absolute right-0 -top-40 z-10 w-[400px] h-[400px] pointer-events-none opacity-80 hidden lg:block backdrop-invert bg-white/30 brightness-125 [mask-image:url(/shapespring.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]">
                  <Image src="/shapespring.png" alt="" fill className="object-contain opacity-60" />
              </motion.div>

              <h4 className="text-sm font-mono text-muted-foreground mb-8 tracking-widest uppercase text-center relative z-20">[ PAYMENT_MODALS ]</h4>
              
              {/* Row 1: 3 Modals with Thumbnail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto mb-12 z-20 mt-6 relative px-4">
                {modalConfigsWithThumbnail.map((config, i) => (
                  <div key={i} className="transform hover:scale-105 transition-transform duration-300 will-change-transform">
                    <PaymentModal
                      isOpen={true}
                      onClose={() => {}}
                      amountUSD={config.tokenAmount === "0.05" ? "124.50" : config.tokenAmount === "50.00" ? "50.00" : "100.00"}
                      config={config}
                      inline={true}
                    />
                  </div>
                ))}
              </div>

              {/* Demo Payment QR Code */}
              <div className="flex flex-col items-center justify-center w-full mb-20 z-20 relative">
                <h4 className="text-sm font-mono text-muted-foreground mb-8 tracking-widest uppercase text-center">[ SCAN_TO_PAY_DEMO ]</h4>
                <motion.div 
                  className="p-4 bg-white rounded-xl shadow-lg border-2"
                  animate={{ 
                    borderColor: ["rgba(0,0,0,0.05)", "rgba(236, 72, 153, 0.5)", "rgba(0,0,0,0.05)"],
                    boxShadow: ["0 10px 15px -3px rgba(0, 0, 0, 0.1)", "0 0 25px 5px rgba(236, 72, 153, 0.4)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-64 h-64">
                    <QRCode 
                      data={demoPaymentUrl}
                      foreground="#000000"
                      background="#ffffff"
                      robustness="M"
                    />
                  </div>
                </motion.div>
                <p className="mt-4 text-sm text-muted-foreground font-mono">Scan to experience the payment flow</p>
              </div>
            </div>

            {/* Floating App Mockup */}
            <h4 className="text-sm font-mono text-muted-foreground mb-8 tracking-widest uppercase mt-20 text-center">[ DASHBOARD_VIEW ]</h4>
            <div className="relative w-full max-w-5xl mx-auto mb-20 px-4 [perspective:2000px]">
              <div className="relative rounded-xl border border-border bg-card/50 backdrop-blur-xl p-2 shadow-2xl transition-all duration-1000 ease-out hover:[transform:rotateX(0deg)] [transform:rotateX(20deg)] group">
                <div className="rounded-lg border border-border bg-background/80 p-4 h-[400px] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">GRAVITY_DASHBOARD</div>
                  </div>

                  {/* Mockup Content */}
                  <div className="grid grid-cols-12 gap-6 h-full">
                    <div className="col-span-3 border-r border-border pr-4 space-y-3 hidden sm:block">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-full bg-muted/20 rounded" />
                      ))}
                    </div>
                    <div className="col-span-12 sm:col-span-9 space-y-6">
                      <div className="h-40 w-full bg-gradient-to-r from-muted/10 to-muted/5 rounded border border-border/50 relative overflow-hidden">
                         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/10 to-transparent" />
                         <div className="absolute bottom-4 left-4 text-2xl font-bold">$1,240,500.00</div>
                         <div className="absolute bottom-4 right-4 text-xs text-green-500">+12.5%</div>
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-12 w-full border border-border/50 rounded flex items-center px-4 justify-between bg-card/50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted/20" />
                              <div className="w-24 h-2 bg-muted/20 rounded" />
                            </div>
                            <div className="w-16 h-2 bg-green-500/20 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Reflection/Glow */}
              <div className="absolute -inset-4 bg-gradient-to-t from-primary/20 to-transparent blur-3xl -z-10 opacity-30" />
            </div>

            {/* Payment Flow Animations */}
            <h4 className="text-sm font-mono text-muted-foreground mb-24 tracking-widest uppercase mt-12 text-center">[ PAYMENT_FLOWS ]</h4>
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto mb-24 z-20 px-4 items-center">
               <div className="flex flex-col items-center">
                 <QrScanAnimation />
               </div>
               <div className="flex flex-col items-center">
                 <LaptopClickAnimation />
               </div>
            </div>
          
        

        {/* Features Grid */}
        <section id="features" className="mb-20 space-y-8 relative z-10 bg-background">
          <div className="border-b border-border pb-2 container mx-auto px-4 text-center">
            <h2 className="text-xl font-bold">SYSTEM_MODULES</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 container mx-auto px-4">
            {[
              {
                title: "UNIVERSAL_PAYMENT",
                desc: "Accept USDC, USDT, DAI, or any ERC20. Automatic Uniswap conversion to your preferred settlement token.",
                icon: CreditCard
              },
              {
                title: "QR_VERIFICATION",
                desc: "Cryptographically signed receipts generated as QR codes. Instant offline verification for events.",
                icon: QrCode
              },
              {
                title: "ZERO_CONFIG",
                desc: "No backend required. Fully decentralized architecture running on Ethereum Sepolia.",
                icon: Zap
              }
            ].map((feature, i) => (
              <div key={i} className="border border-border p-12 space-y-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <feature.icon className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-2">MODULE_0{i + 1}</div>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Marquee Testimonials */}
        <section id="testimonials" className="space-y-8 overflow-hidden relative z-10 mb-20 bg-background">
          <div className="border-b border-border pb-2 container mx-auto px-4 text-center">
            <h2 className="text-xl font-bold">COMMUNITY_FEEDBACK</h2>
          </div>
          
          <div className="relative flex w-full overflow-hidden bg-background/50 py-10">
            <div className="flex w-max animate-marquee gap-8 hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex shrink-0 gap-8">
                  {[
                    {
                      name: "Satoshi Chen",
                      username: "@satoshi_eth",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
                      review: "Finally, a payment system that actually works for crypto events. No more gas headaches!"
                    },
                    {
                      name: "Maria Rodriguez",
                      username: "@maria_defi",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
                      review: "The QR verification is incredible - scanned tickets instantly even with no internet connection."
                    },
                    {
                      name: "James Wilson",
                      username: "@jweb3_dev",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
                      review: "Zero config setup saved us weeks of development time. Just plug and play!"
                    },
                    {
                      name: "Aisha Patel",
                      username: "@aisha_crypto",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
                      review: "Accepting any ERC20 token while getting USDC back? Game changer for our conference."
                    },
                    {
                      name: "Kai Nakamura",
                      username: "@kai_nft",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
                      review: "The receipt system is verifiable and cryptographically secure. No more disputes!"
                    }
                  ].map((testimonial, i) => (
                    <div key={`${setIndex}-${i}`} className="w-[300px] border border-border bg-card p-6 space-y-4 hover:border-foreground/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-sm">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.username}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "{testimonial.review}"
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 mt-24 relative z-10 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            © 2025 GRAVITY_PROTOCOL. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-foreground text-muted-foreground transition-colors">GITHUB</a>
            <a href="#" className="hover:text-foreground text-muted-foreground transition-colors">TWITTER</a>
            <a href="#" className="hover:text-foreground text-muted-foreground transition-colors">DISCORD</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
