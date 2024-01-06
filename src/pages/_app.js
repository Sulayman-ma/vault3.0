import '@/styles/globals.css'
import RootLayout from "@/components/root-layout"
import VaultLayout from "@/components/vault-layout"
import { usePathname } from 'next/navigation';

export default function App({ Component, pageProps }) {
  const pathname = usePathname()

  switch (pathname) {
    case '/':
      return (
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      );
    default:
      return (
        <VaultLayout>
          <Component {...pageProps} />
        </VaultLayout>
      )
  }
}
