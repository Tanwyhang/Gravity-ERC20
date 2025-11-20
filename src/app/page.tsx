import { Terminal } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-foreground selection:text-background">
      <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Terminal className="h-5 w-5" />
            <span>GRAVITY-ERC20</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#about" className="hover:underline decoration-2 underline-offset-4">./about</a>
            <a href="#features" className="hover:underline decoration-2 underline-offset-4">./features</a>
            <a href="#install" className="hover:underline decoration-2 underline-offset-4">./install</a>
          </nav>
          <div className="text-xs text-muted-foreground hidden sm:block">
            v1.0.0-beta
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-24">
        {/* Hero Section */}
        <section className="space-y-8 pt-12">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">$ init gravity-protocol</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-3xl">
              PAYMENT INFRASTRUCTURE
              <br />
              FOR THE DECENTRALIZED WEB.
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
            Accept any ERC20 token. Generate verifiable receipts. 
            Zero friction payment links for events and commerce.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-foreground text-background px-8 py-3 text-sm font-bold hover:bg-foreground/90 transition-colors">
              [ START_APP ]
            </button>
            <button className="border border-border px-8 py-3 text-sm font-bold hover:bg-muted/50 transition-colors">
              [ READ_DOCS ]
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="space-y-8">
          <div className="border-b border-border pb-2">
            <h2 className="text-xl font-bold">SYSTEM_MODULES</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "UNIVERSAL_PAYMENT",
                desc: "Accept USDC, USDT, DAI, or any ERC20. Automatic Uniswap conversion to your preferred settlement token."
              },
              {
                title: "QR_VERIFICATION",
                desc: "Cryptographically signed receipts generated as QR codes. Instant offline verification for events."
              },
              {
                title: "ZERO_CONFIG",
                desc: "No backend required. Fully decentralized architecture running on Ethereum Sepolia."
              }
            ].map((feature, i) => (
              <div key={i} className="border border-border p-6 space-y-4 hover:bg-muted/30 transition-colors">
                <div className="text-xs text-muted-foreground">MODULE_0{i + 1}</div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Terminal Install Demo */}
        <section id="install" className="space-y-8">
           <div className="border-b border-border pb-2">
            <h2 className="text-xl font-bold">QUICK_START</h2>
          </div>
          
          <div className="bg-card border border-border p-6 font-mono text-sm overflow-x-auto">
            <div className="flex gap-2 text-muted-foreground mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-green-500">➜</span>
                <span className="text-blue-500">~</span>
                <span>git clone https://github.com/gravity/erc20-pay.git</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500">➜</span>
                <span className="text-blue-500">~</span>
                <span>cd erc20-pay</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500">➜</span>
                <span className="text-blue-500">erc20-pay</span>
                <span>npm install</span>
              </div>
              <div className="text-muted-foreground pt-2">
                [+] Installing dependencies...<br/>
                [+] Verifying smart contracts...<br/>
                [+] Setup complete.
              </div>
              <div className="flex gap-2 pt-2">
                <span className="text-green-500">➜</span>
                <span className="text-blue-500">erc20-pay</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 mt-24">
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
