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
  Alert,
} from "@material-tailwind/react"
import {
  ArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon, 
  TrashIcon 
} from "@heroicons/react/24/solid"
import { useContext, useState } from "react"
import { Web5Context } from "@/lib/contexts"
import { deleteRecord } from "@/lib/crud"
import CustomAlert from "@/components/alert"
import clsx from "clsx"

export default function SecretCard({ assetData }) {   
  // WEB5 CONTEXT AND ASSET GROUP
  const { web5 } = useContext(Web5Context)

  // COMPONENT STATES
  const [deleted, setDeleted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    color: 'blue',
    content: '',
  });

  // REVEAL SECRET FOR PASSWORDS
  const revealSecret = () => { setRevealed(!revealed) }

  // DOWNLOAD ASSET ATTACHMENT
  const downloadFile = async () => {
    const base64String = assetData.claim.attachment

    const file = await convertBase64ToFile(base64String, assetData.claim.title)

    const temp = window.URL.createObjectURL(file)

    // creating download anchor
    const anchor = document.createElement('a');
    anchor.href = temp;
    anchor.download = file.name;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);

    // simulating click to download
    anchor.click();

    // remove anchor
    document.body.removeChild(anchor);
    return
  }

  // SWAP DISPLAY TO ASSET EDITING
  const swapDisplay = () => { return }

  // DELETE ASSET
  const deleteAsset = async () => {
    try {
      const code = await deleteRecord(web5, assetData.recordId)
      setOpenDialog(false);

      setAlertInfo({
        open: true,
        color: `${code === 202 ? 'green' : 'red'}`,
        content: `${code === 202 ? 'Asset deleted' : 'Failed to delete asset'}`
      })
    } catch (error) {
      setAlertInfo({
        open: true,
        color: 'red',
        content: 'Failed to delete asset'
      })
    }
    // hide content body after delete
    setDeleted(true)
  }

  return (
    <>
      {/* CARD HEADER */}
      <CardHeader
        className="flex flex-row justify-evenly bg-transparent my-3 mx-3 py-0 mt-3 w-full"
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
      <CardBody className={clsx(
        "w-full text-white",
        { 'hidden' : deleted }
      )}>
        {/* ALERT COMPONENT */}
        <div className="md:w-[60%] lg:w-[50%] m-auto my-5 flex justify-center items-center">
          <Alert 
            open={alertInfo.open}
            onClose={setAlertInfo({ open: false })}
            color={alertInfo.color}
            className="my-5"
            variant="outlined"
          >
            {alertInfo.content}
          </Alert>
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
          <IconButton
            color="transparent"
            ripple={true}
            className="mt-1 text-center"
            onClick={downloadFile}
          >
            <ArrowDownIcon className="w-6 h-6" />
          </IconButton>
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

      {/* EDIT ASSET DIALOG FORM */}
      <Dialog 
        size="md"
        open={editDialog}
        handler={() => {setEditDialog(!editDialog)}}
        className="bg-gray-900 p-10"
      >
        <form 
          className="mt-8 mb-2 mx-auto w-full min-w-[15rem] max-w-[24rem]"
          onSubmit={handleSubmit}
        >
          
        </form>
      </Dialog>
    </>
  )
}
