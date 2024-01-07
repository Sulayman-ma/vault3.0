import { 
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { 
  UserPlusIcon,
  HomeIcon,
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
          <Link href="/assets">
            <ListItem 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
              selected={pathname === '/assets' ? true : false} 
            >
              <ListItemPrefix>
                <HomeIcon className="h-5 w-5" />
              </ListItemPrefix>
              Assets
            </ListItem>
          </Link>
          <Link href="/beneficiaries">
            <ListItem 
              selected={pathname === '/beneficiaries' ? true : false} 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
            >
              <ListItemPrefix>
                <UserPlusIcon className="h-5 w-5" />
              </ListItemPrefix>
              Beneficiaries
            </ListItem>
          </Link>
          {/* <Web5Connected /> */}
        </List>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden">
        <List className="fixed w-full bottom-0 z-10 text-white flex flex-row justify-evenly px-3 bg-black py-1">
          <Link href="/assets">
            <ListItem 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
              selected={pathname === '/assets' ? true : false} 
            >
              <HomeIcon className="h-7 w-7" />
            </ListItem>
          </Link>
          <Link href="/beneficiaries">
            <ListItem
              selected={pathname === '/beneficiaries' ? true : false} 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
            >
              <UserPlusIcon className="h-7 w-7" />
            </ListItem>
          </Link>

          {/* WEB5 CONNECTION INDICATOR */}
          {/* <Web5Connected  /> */}
        </List>
      </div>
    </>
    
  )
}
