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

export function WillMini({ setAsActive, assetData }) {
  return (
    <Link 
      onClick={() => {
          setAsActive({
            group: 'Will',
            assetData: assetData
          })
        }
      } 
      href=""
    >
      <Card className="w-auto max-w-[25rem] mr-2 mb-3 text-white bg-orange-700">
        <CardBody>
          <ListItem 
            className="w-auto ml-0 p-0" 
            ripple={false}
            disabled
          >
            WILL
            <ListItemSuffix>
              <LockClosedIcon className="w-5 h-5 m-auto" />
            </ListItemSuffix>
          </ListItem>
          { assetData.claim.attachment ? (
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
          ) : '' }
        </CardBody>
      </Card>
    </Link>
  )
}

export function SecretMini({ setAsActive, assetData }) {
  return (
    <Link 
      onClick={() => {
          setAsActive({
            group: 'Secret',
            assetData: assetData
          })
        }
      } 
      href=""
    >
      <Card className="w-auto max-w-[25rem] mr-2 mb-3 bg-gray-900 text-white hover:bg-gray-800">
        <CardBody>
          <ListItem 
            className="w-auto ml-0 p-0" 
            color="transparent" 
            ripple={false}
            disabled
          >
            SECRET
            <ListItemSuffix>
              <KeyIcon className="w-5 h-5 m-auto" />
            </ListItemSuffix>
          </ListItem>
          <Typography className="text-gray-500" variant="h6">
            {assetData.platform}
          </Typography>
          { assetData.attachment ? (
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
          ) : '' }
        </CardBody>
      </Card>
    </Link>
  )
}

export function MessageMini({ setAsActive, assetData }) {
  return (
    <Link 
      onClick={() => {
          setAsActive({
            group: 'Special Message',
            assetData: assetData
          })
        }
      } 
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
            MESSAGE
            <ListItemSuffix>
              <DocumentTextIcon className="w-5 h-5 m-auto" />
            </ListItemSuffix>
          </ListItem>
          { assetData.claim.attachment ? (
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
          ) : '' }
        </CardBody>
      </Card>
    </Link>
  )
}

export function LegalDocumentMini({ setAsActive, assetData }) {
  return (
    <Link 
      onClick={() => {
          setAsActive({
            group: 'Legal Document',
            assetData: assetData
          })
        }
      } 
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
            LEGAL DOCUMENT
            <ListItemSuffix>
              <DocumentIcon className="w-5 h-5 m-auto" />
            </ListItemSuffix>
          </ListItem>
          { assetData.claim.attachment ? (
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
          ) : '' }
        </CardBody>
      </Card>
    </Link>
  )
} 

export function MiniCard({ setAsActive, assetData, setLoading }) {
  const [header, setHeader] = useState('')
  const [title, setTitle] = useState('')
  const [attachment, setAttachment] = useState(false)

  useEffect(() => {
    // checking for type of asset to render card details accordingly
    if (!assetData) return
    if (assetData.claim) {
      setTitle(`${assetData.claim.title.substring(0, 10)}...`)
      if (assetData.claim.attachment) setAttachment(true)
    } else { 
      setTitle(assetData.platform)
      if (assetData.attachment) setAttachment(true)
    }
    setHeader(assetData.group.toUpperCase())
    return

  }, [assetData])

  return (
    <Link 
      onClick={() => {
        setAsActive({
          group: assetData.group,
          assetData: assetData
        });
        setLoading(true)
      }}
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
              <DocumentIcon className="w-5 h-5" />
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

export function NewAssetMini({ setAsActive }) {
  return (
    <Link 
        onClick={() => {
            setAsActive({
            group: 'new_asset',
          })
        }
      } 
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
