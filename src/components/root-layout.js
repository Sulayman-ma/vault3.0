import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: '400',
  preload: true,
})

export default function RootLayout({ children }) {
  return (
    <div className={`${poppins.className} overflow-auto`}>
      {children}
    </div>
  )
}
