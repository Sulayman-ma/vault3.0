import {
  Typography,
  Card,
  CardBody,
  ListItem,
  ListItemSuffix,
} from "@material-tailwind/react"
import { 
  PaperClipIcon,
  LockClosedIcon,
  KeyIcon,
  DocumentIcon,
  DocumentTextIcon,
  PlusCircleIcon
} from "@heroicons/react/24/solid"
import Link from "next/link"
import { useEffect, useState } from "react"

export function MiniCard({ setAsActive, assetData, setLoading }) {
  const [header, setHeader] = useState('')
  const [title, setTitle] = useState('')
  const [attachment, setAttachment] = useState(false)

  useEffect(() => {
    // checking for type of asset to render card details accordingly
    if (!assetData) return
    
    if (assetData.title) { setTitle(assetData.title) }
    else { setTitle(assetData.platform) }
    if (assetData.attachment) setAttachment(true)
    setHeader(assetData.group.toUpperCase())
  
    return
  }, [assetData])

  const setStuff = (e) => {
    e.preventDefault();
    setLoading(true)
    setAsActive({
      group: assetData.group,
      assetData: assetData
    });
  }

  return (
    <Link 
      onClick={setStuff}
      href=""
    >
      <Card className="w-auto max-w-[25rem] mr-2 mb-3 bg-gray-900 text-white hover:bg-gray-800">
        <CardBody>
          <ListItem 
            className="w-auto m-0" 
            color="transparent" 
            ripple={false}
            disabled
          >
            {header}
            <ListItemSuffix>
              {
                assetData.group === 'Secret' ? 
                <KeyIcon className="w-5 h-5" /> 
                :
                assetData.group === 'Will' ? 
                <LockClosedIcon className="w-5 h-5" /> 
                :
                assetData.group === 'Legal Document' ?
                <DocumentIcon className="w-5 h-5" /> 
                :
                <DocumentTextIcon className="w-5 h-5" />
              }
            </ListItemSuffix>
          </ListItem>
          <Typography className="text-center text-gray-500" variant="small">
            {title}
          </Typography>
          { 
            attachment ? (
              <ListItem 
                color="transparent" 
                ripple={false}
                disabled
              >
                Includes attachment
                <ListItemSuffix>
                  <PaperClipIcon className="w-5 h-5" />
                </ListItemSuffix>
              </ListItem>
            ) : '' 
          }
        </CardBody>
      </Card>
    </Link>
  )
}

export function NewAssetMini({ setAsActive, setLoading }) {
  const setStuff = (e) => {
    e.preventDefault();
    setLoading(true)
    setAsActive({
      group: 'new_asset',
    });
  }

  return (
    <Link 
      onClick={setStuff} 
      href=""
    >
      <Card className="w-auto max-w-[25rem] mr-2 mb-3 mt-5 text-white bg-gray-900 hover:bg-gray-800">
        <CardBody>
        <ListItem 
          className="w-auto m-0" 
          color="transparent" 
          ripple={false}
          disabled
        >
          NEW ASSET 
          <ListItemSuffix>
            <PlusCircleIcon className="w-5 h-5" />
          </ListItemSuffix>
        </ListItem>
        </CardBody>
      </Card>
    </Link>
  )
}
