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
  Spinner,
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
  Textarea,
} from "@material-tailwind/react"
import {
  ArrowDownIcon,
  EllipsisHorizontalIcon,
  LockClosedIcon,
  ShareIcon,
} from "@heroicons/react/24/solid"
import { useContext, useEffect, useState } from "react"
import { Web5Context } from "@/lib/contexts"
import { convertToBase64, deleteRecord, sendAssetCopy, updateCredential } from "@/lib/crud"

export default function DocumentCard({ assetData, updateAsset, setBlank }) {   
  // WEB5 CONTEXT AND ASSET GROUP
  const { web5, myDid } = useContext(Web5Context)

  // COMPONENT STATES
  const [loading, setLoading] = useState(false)
  const [transferDialog, setTransferDialog] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);
  const [partnerDID, setPartnerDID] = useState('')
  const [editDialog, setEditDialog] = useState(false);
  const [attachment, setAttachment] = useState(null)
  const [size, setSize] = useState(0)
  const [formData, setFormData] = useState({ ...assetData })
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    color: 'blue',
    content: '',
  });

  useEffect(() => {
    if (attachment) {
      setSize((attachment.size / (1024 * 1024)).toFixed(1))
    }
  }, [attachment, size])

  // CAPTURE FORM DATA
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // DOWNLOAD ASSET ATTACHMENT
  const downloadFile = async () => {
    const base64String = assetData.attachment

    const file = await convertBase64ToFile(base64String, assetData.title)

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

   // TRANFER ASSET
  const executeTransfer = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const newData = {
        ...assetData,
        partnerDID: partnerDID,
        myDid: myDid
      }
      const code = await sendAssetCopy(web5, newData)
      console.info('Transfer status: ', code)
      
      setAlertInfo({
        open: true,
        color: 'green',
        content: 'Asset transfered'
      })
    } catch (error) {
      setAlertInfo({
        open: true,
        color: 'red',
        content: error.message
      })
    }
    setLoading(false)
    setTransferDialog(false)
  }

  // EDIT ASSET
  const editAsset = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const { recordId, ...newStuff } = formData

      // HANDLE FILE CONVERSION IF ANY
      let base64String = null
      if (attachment) {
        if (attachment.size > 1 * 1024 * 1024) {
          setAlertInfo({
            open: true,
            color: 'orange',
            content: 'File size limit exceeded'
          })
          return
        }
        // convert any file attachments accordingly
        base64String = await convertToBase64(attachment)
        newStuff.attachment = base64String
      }

      // carry out dwn update
      const code = await updateCredential(web5, newStuff, recordId)

      setAlertInfo({
        open: true,
        color: `${code === 202 ? 'green' : 'red'}`,
        content: `${code === 202 ? 'Asset updated' : 'Update failed'}`
      })

      // update asset data
      updateAsset(formData.group, { ...newStuff })
    } catch (error) {
      console.error(error)
      setAlertInfo({
        open: true,
        color: 'red',
        content: error.message
      })
    }
    setEditDialog(false)
    setLoading(false)
  }

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

      setBlank(true)      
      // updateAsset({ group: 'blank', assetData: {} })
    } catch (error) {
      setAlertInfo({
        open: true,
        color: 'red',
        content: error.message
      })
    }
  }

  return (
    <>
      {/* CARD HEADER */}
      <CardHeader
        className="flex flex-row justify-between bg-transparent my-3 mx-3 px-5 py-0 mt-3 w-full"
        shadow={false}
        color="white"
      >
        {/* HEADER TITLE */}
        <div className="flex flex-row justify-center items-center gap-5">
        <Typography variant="h3">
          {assetData.group}
        </Typography>
        {
          assetData.shared ?
          <Tooltip content="Shared asset">
            <ShareIcon className="w-7 h-7 text-orange-400" />
          </Tooltip> 
          : 
          <Tooltip content="Private asset">
            <LockClosedIcon className="w-7 h-7 text-blue-700" />
          </Tooltip>
        }
        </div>

        {/* EDIT AND DELETE ICONS */}
        <Popover placement="bottom">
          <PopoverHandler>
            <IconButton>
              <EllipsisHorizontalIcon className="w-10 h-10" />
            </IconButton>
          </PopoverHandler>
          <PopoverContent className="bg-black border-none w-20 flex-col flex items-center">
            {
              assetData.shared ?
              ''
              :
              <Button 
                className="bg-transparent text-white hover:shadow-none hover:text-gray-800" 
                onClick={() => {setEditDialog(true)}}
              >
                Edit
              </Button>
            }
            <Button 
              className="bg-transparent text-white hover:shadow-none hover:text-red-800" 
              onClick={() => {setTransferDialog(true)}}
            >
              Send copy
            </Button>
            <Button 
              className="bg-transparent text-white hover:shadow-none hover:text-red-800" 
              onClick={() => {setOpenDialog(true)}}
            >
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      </CardHeader> 

      {/* CARD BODY */}
      <CardBody className="relative w-full text-white">
        {/* ALERT COMPONENT */}
        <div className="md:w-[60%] lg:w-[50%] m-auto my-5 flex justify-center items-center">
          <Alert 
            open={alertInfo.open}
            onClose={() => {setAlertInfo({ open: false })}}
            color={alertInfo.color}
            className="my-5"
            variant="outlined"
          >
            {alertInfo.content}
          </Alert>
        </div>
        
        {/* CARD BODY CONTENT */}
        <Typography variant="h6" color="gray" className="mt-1 font-semibold">
        TITLE : {assetData.title}
        </Typography>
        <Typography variant="h6" color="gray" className="mt-1 font-semibold">
        {
          assetData.description ?
          <>DESCRIPTION : {assetData.description}</> : ''
        }
        </Typography>
        <Typography variant="h6" color="gray" className="mt-1 font-semibold">
        CREATED : {assetData.created}
        </Typography>
        <Tooltip content="Download attachment">
          {
            assetData.attachment ? (
            <IconButton
              color="transparent"
              ripple={true}
              className="mt-1 text-center"
              onClick={downloadFile}
            >
              <ArrowDownIcon className="w-6 h-6" />
            </IconButton>
            ) 
            : ''
          }
        </Tooltip>
      </CardBody>

      {/* dialog for action confirmation */}
      <Dialog open={openDialog} handler={() => setOpenDialog(!openDialog)}>
        <DialogHeader color="red">Delete Asset</DialogHeader>
        <DialogBody>
          Delete asset : {assetData.title}?
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
        size="xs"
        open={editDialog}
        handler={() => {setEditDialog(!editDialog)}}
        className="bg-gray-900 p-10"
      >
        <form 
          className="mt-8 mb-2 mx-auto w-full min-w-[15rem] max-w-[24rem]"
          onSubmit={editAsset}
        >
          <Typography variant="h3" color="white" className="mb-3">
            Edit document
          </Typography>
          <div className="mb-1 flex flex-col gap-14">
            <Input
              size="lg"
              label="Title"
              color="orange"
              variant="static"
              type='text'
              required
              name="title"
              value={formData.title}
              className="!border-white focus:!border-orange-400 text-white"
              onChange={handleInputChange}
            />
            <Textarea
              size="lg"
              name="description"
              label="Description (optional)"
              className="!border-white !focus:border-orange-400 text-white"
              variant="static"
              color="orange"
              value={formData.description}
              onChange={handleInputChange}
            />
            <div>
              <Input
                size="lg"
                variant="static"
                label="Attachment (optional)"
                type="file"
                className="border-none text-white"
                color="orange"
                accept="image/jpeg, image/jpg, image/png, text/plain, application/pdf"
                onChange={(e) => setAttachment(e.target.files[0])}
              />
              <Typography
                variant="small"
                color="gray"
                className="mt-2 flex items-center gap-1 font-normal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="-mt-px h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                { `Please note that uploading a file will replace the current one attached to the credential. ` }
                {
                  attachment ? 
                  attachment.size > (1 * 1024 * 1024) ? 
                    `Size limit exceeded : ${size}MB`
                  : 'File accepted ✔️'
                  : ''
                }
                </Typography>
              </div>
          </div>
          {/* SUBMIT BUTTON */}
          <div className='flex flex-row justify-evenly items-center text-center'>
            <Button 
              className="flex items-center justify-center w-2/5 md:w-1/3 lg:w-1/3 mt-6 bg-black hover:bg-gray-800"
              fullWidth
              disabled={loading}
              type='submit'
            >
              {
                loading ? 
                <Spinner color="orange"
                variant="static" className="w-5 h-5" />
                : 
                'save changes'
              }
            </Button>
            <Button 
              disabled={loading}
              onClick={() => {setEditDialog(false)}}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>

      {/* TRANSFER ASSET FORM */}
      <Dialog 
        className="bg-gray-900 py-6"
        open={transferDialog} 
        size="xs" 
        handler={() => setTransferDialog(!transferDialog)}
      >
        <form 
          onSubmit={executeTransfer}
          className="flex flex-col gap-10 mt-8 mb-2 mx-auto w-full min-w-[15rem] max-w-[24rem]"
        >
          <Input
            size="lg"
            label="Associate DID"
            placeholder="did:ion:12sd34as..."
            type='text'
            color="orange"
            variant="static"
            required
            className="!border-white focus:!border-orange-400 text-white"
            value={partnerDID}
            onChange={(e) => setPartnerDID(e.target.value)}
          />
          {/* SUBMIT BUTTON */}
          <div className='flex flex-row justify-center items-center text-center'>
            <Button 
              className="flex items-center justify-center w-2/5 md:w-1/3 lg:w-1/3 mt-6 bg-black hover:bg-gray-800"
              fullWidth
              disabled={loading}
              type='submit'
            >
              {
                loading ? 
                <Spinner color="orange" className="w-5 h-5" />
                : 
                'transfer'
              }
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  )
}
