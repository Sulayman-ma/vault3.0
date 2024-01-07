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
  Input
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
import { deleteRecord, updateRecord } from "@/lib/crud"

export default function SecretCard({ assetData, updateAsset }) {   
  // WEB5 CONTEXT AND ASSET GROUP
  const { web5 } = useContext(Web5Context)

  // COMPONENT STATES
  const [loading, setLoading] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    color: 'blue',
    content: '',
  });
  const [formData, setFormData] = useState({
    platform: assetData.platform,
    account_name: assetData.account_name,
    phrase: assetData.phrase,
    recordId: assetData.recordId,
    group: assetData.group,
  })

  // CAPTURE FORM DATA
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

  // EDIT ASSET
  const editAsset = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      // carry out dwn update
      const code = await updateRecord(web5, formData)

      setAlertInfo({
        open: true,
        color: `${code === 202 ? 'green' : 'red'}`,
        content: `${code === 202 ? 'Asset updated' : 'Update failed'}`
      })
      // update asset data prop and get it to rerender
      updateAsset(formData)
    } catch (error) {
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
    } catch (error) {
      setAlertInfo({
        open: true,
        color: 'red',
        content: error.message
      })
    }
    updateAsset({ group: 'welcome' })
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
            <IconButton onClick={() => {setEditDialog(!editDialog)}} className="text-blue-400">
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
          onSubmit={editAsset}
        >
          <Typography variant="h3" color="white" className="mb-3">
            Edit asset
          </Typography>
          <div className="mb-1 flex flex-col gap-14">
            <Input
              size="lg"
              label="Platform name"
              color="orange"
              variant="static"
              type='text'
              required
              name="platform"
              value={formData.platform}
              className="!border-white focus:!border-orange-400 text-white"
              onChange={handleInputChange}
            />
            <Input
              size="lg"
              label="Account name"
              color="orange"
              variant="static"
              type='text'
              required
              name="account_name"
              value={formData.account_name}
              className="!border-white focus:!border-orange-400 text-white"
              onChange={handleInputChange}
            />
            <Input
              size="lg"
              label="Phrase"
              color="orange"
              variant="static"
              type='password'
              required
              name="phrase"
              value={formData.phrase}
              className="!border-white focus:!border-orange-400 text-white"
              onChange={handleInputChange}
            />
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
            <Button onClick={() => {setEditDialog(false)}}>
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  )
}
