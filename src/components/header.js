import { 
  Button,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { 
  UserPlusIcon,
  HomeIcon,
  CheckIcon,
  ClipboardIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { Web5Context } from "@/lib/contexts";

export default function Header() {
  const pathname = usePathname()
  const { myDid } = useContext(Web5Context)

  const [didCopied, setDidCopied] = useState(false)

  // COPY DID TO CLIPBOARD
  const handleCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(myDid);
      setDidCopied(true);
      console.log("DID copied to clipboard");

      setTimeout(() => {
        setDidCopied(false);
      }, 3000); //disable copy for 3 seconds
    } catch (err) {
      console.log("Failed to copy DID: " + err);
    }
  }
  
  return (
    // MEDIUM TO LARGE SCREENS HAVE THE TOP SIDE FULL NAVIGATION
    // MOBILES AND SMALL SCREENS ALIKE WILL HAVE THE BOTTOM BAR NAVIGATION
    <>
      {/* WIDE NAVIGATION */}
      <div className="hidden md:flex flex-row p-1 mb-0 w-full justify-center">
        <List className="text-white flex flex-row">
          <Link href="/">
            <ListItem 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
              selected={pathname === '/' ? true : false} 
            >
              <ListItemPrefix>
                <HomeIcon className="h-5 w-5" />
              </ListItemPrefix>
              Assets
            </ListItem>
          </Link>
          <Link href="/partners">
            <ListItem 
              selected={pathname === '/partners' ? true : false} 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
            >
              <ListItemPrefix>
                <UserPlusIcon className="h-5 w-5" />
              </ListItemPrefix>
              Partners
            </ListItem>
          </Link>
          <ListItem 
            className="text-blue-300 hover:bg-transparent hover:text-blue-800 focus:bg-transparent"
            onClick={handleCopy}
            disabled={didCopied}
          >
            <ListItemPrefix>
            {
              didCopied ?
              <>Copied {<CheckIcon className="w-5 h-5" />}</>
              :
              <>Copy DID {<ClipboardDocumentListIcon className="w-5 h-5" />}</>
            }
            </ListItemPrefix>
          </ListItem>
        </List>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden">
        <List className="fixed w-full bottom-0 z-10 text-white flex flex-row justify-evenly px-3 bg-black py-1">
          <Link href="/">
            <ListItem 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
              selected={pathname === '/' ? true : false} 
            >
              <HomeIcon className="h-7 w-7" />
            </ListItem>
          </Link>
          <Link href="/partners">
            <ListItem
              selected={pathname === '/partners' ? true : false} 
              className="text-gray-200 hover:bg-gray-500 hover:text-gray-200 focus:text-gray-200 focus:bg-gray-500"
            >
              <UserPlusIcon className="h-7 w-7" />
            </ListItem>
          </Link>
          <div>
          <ListItem 
            className="text-blue-300 hover:bg-transparent hover:text-blue-800 focus:bg-transparent"
            onClick={handleCopy}
            disabled={didCopied}
          >
            <ListItemPrefix>
            {
              didCopied ?
              <>Copied {<CheckIcon className="w-5 h-5" />}</>
              :
              <>Copy DID {<ClipboardDocumentListIcon className="w-5 h-5" />}</>
            }
            </ListItemPrefix>
          </ListItem>
          </div>
        </List>
      </div>
    </>
    
  )
}
