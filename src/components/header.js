// THIS FILE HAS SOME OF THE MOST MESSED UP CSS OF THE ENTIRE PROJECT
// SOME THINGS ARE USEFUL, SOME AREN'T BUT I'M TIRED OF WASTING TIME HERE
// SO I'M GONNA LEAVE IT LIKE THIS, THANK YOU FOR READING THIS

import { 
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { 
  HomeIcon,
  UserPlusIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { Web5Connected } from "@/components/connected-web5";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname()
  
  return (
    // MEDIUM TO LARGE SCREENS HAVE THE TOP SIDE FULL NAVIGATION
    // MOBILES AND SMALL SCREENS ALIKE WILL HAVE THE BOTTOM BAR NAVIGATION
    <>
      {/* WIDE NAVIGATION */}
      <div className="hidden md:flex flex-row p-1 mb-0 w-full justify-center">
        <List className="text-white flex flex-row">
          <Link href="/vault">
            <ListItem 
              selected={pathname === '/vault' ? true : false} 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
            >
              <ListItemPrefix>
                <HomeIcon className="h-5 w-5" />
              </ListItemPrefix>
              Home
            </ListItem>
          </Link>
          <Link href="/vault/assets">
            <ListItem 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
              selected={pathname === '/vault/assets' ? true : false} 
            >
              <ListItemPrefix>
                <Square3Stack3DIcon className="h-5 w-5" />
              </ListItemPrefix>
              Assets
            </ListItem>
          </Link>
          <Link href="/vault/beneficiaries">
            <ListItem 
              selected={pathname === '/vault/beneficiaries' ? true : false} 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
            >
              <ListItemPrefix>
                <UserPlusIcon className="h-5 w-5" />
              </ListItemPrefix>
              Beneficiaries
            </ListItem>
          </Link>
          <Web5Connected />
        </List>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden">
        <List className="fixed w-full bottom-0 z-10 text-white flex flex-row justify-evenly px-3 bg-black py-1">
          <Link href="/vault">
            <ListItem 
              selected={pathname === '/vault' ? true : false} 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
            >
              <HomeIcon className="h-5 w-5" />
            </ListItem>
          </Link>
          <Link href="/vault/assets">
            <ListItem 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
              selected={pathname === '/vault/assets' ? true : false} 
            >
              <Square3Stack3DIcon className="h-5 w-5" />
            </ListItem>
          </Link>
          <Link href="/vault/beneficiaries">
            <ListItem
              selected={pathname === '/vault/beneficiaries' ? true : false} 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
            >
              <UserPlusIcon className="h-5 w-5" />
            </ListItem>
          </Link>

          {/* WEB5 CONNECTION INDICATOR */}
          <Web5Connected  />
        </List>
      </div>
    </>
    
  )
}
