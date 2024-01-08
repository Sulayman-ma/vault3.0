import '@/styles/globals.css'
import VaultLayout from "@/components/vault-layout"

export default function App({ Component, pageProps }) {
  return (
    <VaultLayout>
      <Component {...pageProps} />
    </VaultLayout>
  )
}
