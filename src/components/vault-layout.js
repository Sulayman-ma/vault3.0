import Header from "@/components/header";
import { useEffect, useState } from "react";
import { Web5Context } from "@/lib/contexts";
import { configureProtocol } from "@/lib/protocols";
import { Square3Stack3DIcon } from "@heroicons/react/24/solid";
import { Spinner } from "@material-tailwind/react";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: '400',
  preload: true,
})

export default function VaultLayout({ children }) {
  const [web5, setWeb5] = useState(null)
  const [myDid, setMyDid] = useState(null)


  // connecting to web5 and retaining Web5 object for usage
  useEffect(() => {
    const initWeb5 = async () => {
      try {
        console.info('Connecting to web5')
        const { Web5 } = await import('@web5/api')
        const { web5, did: myDid } = await Web5.connect({ sync: '5s' })
  
        setWeb5(web5)
        setMyDid(myDid)
        if (web5 && myDid) {
          console.info('Web5 connection established')
          await configureProtocol(web5, myDid)
        } 
      } catch (error) {
        console.error('Web5 failed to connect', error)
      }
    }
    initWeb5()
  }, []);

  return (
    <main className={`${poppins.className}`}>
      {/* APP LOADING ANIMATION ON MAIN LAYOUT */}
      {
        !web5 ?
        (<div className="flex flex-col gap-10 justify-center items-center h-screen text-white">
          <Square3Stack3DIcon className="w-20 h-20 animate-pulse" />
          Connecting to Vault...
          <Spinner className="w-15 h-15" color="orange" />
        </div>)
        :
        <Web5Context.Provider value={{
          web5: web5,
          myDid: myDid
        }}>
          <Header />
          <div className="flex-1 p-8 bg-black h-auto scroll-disabled">
            {children}
          </div>
          {/* <Footer /> */}
        </Web5Context.Provider>
      }
    </main>
  )
}
