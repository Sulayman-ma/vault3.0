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
  PencilIcon, 
  TrashIcon 
} from "@heroicons/react/24/solid"
import { 
  convertBase64ToFile,
  deleteRecord, 
  getBenByDid, 
} from "@/lib/crud"
import { useContext, useEffect, useState } from "react"
import { Web5Context } from "@/lib/contexts"
import CustomAlert from "@/components/alert"
import clsx from "clsx"

export default function OtherCard({ assetData }) {
  // WEB5 CONTEXT AND ASSET GROUP
  const { web5 } = useContext(Web5Context)
  const group = assetData.group

  // COMPONENT STATES
  const [deleted, setDeleted] = useState(false)
  const [benName, setBenName] = useState(null)
  const [openDialog, setOpenDialog] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    color: 'blue',
    content: '',
  });

  // GET BENEFICIARY NAME FOR AESTHETICS
  useEffect(() => {
    if (!web5) return;
    // GETTING NAME DEPENDS ON CLAIM FIELD IN CARD INFO OBJECT
    if (!assetData) return;
    if (!assetData.claim) return;
    const getBenName = async () => {
      const beneficiary = await getBenByDid(web5, assetData.claim.id)
      setBenName(beneficiary.name)
    }
    getBenName()
  }, [web5, assetData])

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
  const editAsset = () => { return }

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
          {group}
        </Typography>

        {/* EDIT AND DELETE ICONS */}
        <div className="flex flex-row gap-2">
          <Tooltip content="Edit asset">
            <IconButton onClick={editAsset} className="text-blue-400">
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
        "relative w-full text-white",
        { 'hidden' : deleted }
      )}>
        {/* ALERT COMPONENT */}
        <div className="md:w-[60%] lg:w-[50%] m-auto my-5 flex justify-center items-center">
          {
            alertInfo.open 
            && 
            <CustomAlert alertInfo={alertInfo} />
          }
        </div>
        
        {/* CARD BODY CONTENT */}
        <Typography variant="h6" color="gray" className="mt-1 font-semibold">
          TITLE : {assetData.claim.title}
        </Typography>
        <Typography variant="h6" color="gray" className="mt-1 font-semibold">
          CONTENT : {assetData.claim.credentialContent}
        </Typography>
        <Typography variant="h6" color="gray" className="mt-1 font-semibold">
          TARGET : {
            !benName ? 
            <div className="animate pulse w-30 h-2 bg-gray-900">
              &nbsp;
            </div> : benName
          }
        </Typography>
        <Tooltip content="Download asset file">
          {
            assetData.claim.attachment ? (
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
        </Tooltip>
      </CardBody>

      {/* dialog for action confirmation */}
      <Dialog open={openDialog} handler={() => setOpenDialog(!openDialog)}>
        <DialogHeader color="red">Delete Asset</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this asset?
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
