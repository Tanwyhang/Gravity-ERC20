import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Gravity Payment Links',
  projectId: 'YOUR_PROJECT_ID', // TODO: Replace with actual project ID or env var
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
