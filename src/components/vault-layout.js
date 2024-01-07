import Header from "@/components/header";
import { useEffect, useState } from "react";
import { Web5Context } from "@/lib/contexts";
import { configureProtocol } from "@/lib/protocols";
import RootLayout from "@/components/root-layout";

export default function VaultLayout({ children }) {
  const [web5, setWeb5] = useState(null)
  const [myDid, setMyDid] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  // connecting to web5 and retaining Web5 object for usage
  useEffect(() => {
    const initWeb5 = async () => {
      try {
        console.info('Connecting to web5')
        const { Web5 } = await import('@web5/api')
        const { web5, did: myDid } = await Web5.connect({ 
          sync: '5s',
          techPreview: {
            dwnEndpoints: [
              "http://localhost:2222"
            ]
          }
        })
  
        setWeb5(web5)
        setMyDid(myDid)
        if (web5 && myDid) {
          console.info('Web5 connection established')
          setIsConnected(true)
          await configureProtocol(web5, myDid)
        } 
      } catch (error) {
        console.error('Web5 failed to connect', error)
      }
    }
    initWeb5()
  }, []);

  return (
    <RootLayout>
      <Web5Context.Provider value={{
        web5: web5,
        myDid: myDid,
        isConnected: isConnected
      }}>
        <Header />
        <div className="flex-1 p-8 bg-black h-auto scroll-disabled">
          {children}
        </div>
        {/* <Footer /> */}
      </Web5Context.Provider>
    </RootLayout>
  )
}
