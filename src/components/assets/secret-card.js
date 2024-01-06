'use client'

import {
  Typography,
  CardBody,
  Button,
  CardHeader,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
} from "@material-tailwind/react"
import {
  ArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon, 
  TrashIcon 
} from "@heroicons/react/24/solid"
import { useContext, useEffect, useState } from "react"
import { Web5Context } from "@/lib/contexts"
import { 
  deleteRecord, 
  getFileInfo 
} from "@/lib/crud"
import CustomAlert from "@/components/alert"
import Link from "next/link"

export default function SecretCard({ assetData }) {   
  // WEB5 CONTEXT AND ASSET GROUP
  const { web5 } = useContext(Web5Context)

  // COMPONENT STATES
  const [download, setDownload] = useState('')
  const [extension, setExtension] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    color: 'blue',
    content: '',
  });

  // SET DOWNLOAD LINK
  useEffect(() => {
    if (!assetData.attachment) return
    async function setDownloadLink() {
      const data = getFileInfo(assetData.attachment)
      setDownload(data.url)
      setExtension(data.extension)
    }

    setDownloadLink()
  })

  // REVEAL SECRET FOR PASSWORDS
  const revealSecret = () => { setRevealed(!revealed) }

  // SWAP DISPLAY TO ASSET EDITING
  const swapDisplay = () => { return }

  // DELETE ASSET
  const deleteAsset = async () => {
    try {
      const response = await deleteRecord(web5, assetData.recordId)
      setOpenDialog(false);
      console.info(response.status)
      if (response.status.code == 202) {
        setAlertInfo({
          open: true,
          color: 'green',
          content: 'Asset deleted'
        })
      } else {
        setAlertInfo({
          open: true,
          color: 'red',
          content: 'Failed to delete asset'
        })
      }
    } catch (error) {
      setAlertInfo({
        open: true,
        color: 'red',
        content: error
      })
    }
  }

  return (
    <>
      {/* CARD HEADER */}
      <CardHeader
        className="flex flex-row justify-evenly bg-transparent my-3 py-0 mt-3 w-full"
        shadow={false}
        color="white"
      >
        {/* HEADER TITLE */}
        <Typography variant="h3">
          Stored Secret
        </Typography>

        {/* EDIT AND DELETE ICONS */}
        <div className="flex flex-row gap-2">
          <Tooltip content="Edit asset">
            <IconButton onClick={swapDisplay} className="text-blue-400">
              <PencilIcon className="w-8 h-8" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Delete asset">
            <IconButton onClick={() => {setOpenDialog(true)}}  className="text-red-400">
              <TrashIcon className="w-8 h-8" />
            </IconButton>
          </Tooltip>
        </div>
      </CardHeader> 

      {/* CARD BODY */}
      <CardBody className="w-full text-white">
        {/* ALERT COMPONENT */}
        <div className="md:w-[60%] lg:w-[50%] m-auto my-5 flex justify-center items-center">
          <CustomAlert alertInfo={alertInfo} />
        </div>
        
        {/* CARD BODY CONTENT */}
        <Typography variant="h6" color="gray" className="mt-1 font-semibold">
          PLATFORM NAME : {assetData.platform}
        </Typography>
        <Typography variant="h6" color="gray" className="mt-1 font-semibold">
          ACCOUNT USERNAME : @{assetData.account_name}
        </Typography>
        <div className="flex flex-row justify-between mt-2">
          <Typography color="gray" className="font-semibold">
            PHRASE :  
            {revealed ? 
              <span className="text-orange-400"> 
                  {assetData.phrase}
              </span> 
              : 
              ' ********'
            }
          </Typography>
          <Tooltip content="Reveal secret">
            <IconButton onClick={revealSecret} ripple={false}>
              {
                revealed ? 
                <EyeSlashIcon className="w-10 h-10" /> :
                <EyeIcon className="w-10 h-10" />
              }
            </IconButton>
          </Tooltip>
        </div>
        {
          assetData.attachment && download ? (
            <Link
              href={download}
              download={`secret_${assetData.account_name}.${extension}`}
            >
              Download attachment
              <IconButton
                color="transparent" 
                ripple={false}
                className="mt-1 text-center"
              >
                <ArrowDownIcon className="w-6 h-6" />
              </IconButton>
            </Link>
            
          ) : ''
        }
      </CardBody>

      {/* dialog for action confirmation */}
      <Dialog open={openDialog} handler={() => setOpenDialog(!openDialog)}>
        <DialogHeader color="red">Delete Asset</DialogHeader>
        <DialogBody>
          Delete secret for {assetData.platform}?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={deleteAsset}
          >
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}
