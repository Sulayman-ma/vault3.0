import { 
  Button, 
  Card, 
  CardBody, 
  Dialog, 
  DialogBody, 
  DialogFooter, 
  DialogHeader, 
  IconButton, 
  Option, 
  Popover, 
  PopoverContent, 
  PopoverHandler, 
  Select, 
  Spinner, 
  Tooltip, 
  Typography 
} from "@material-tailwind/react";
import { useState, useContext, useEffect } from "react";
import { Web5Context } from "@/lib/contexts";
import { transferAssetGroup, deleteRecord, getBeneficiaries } from "@/lib/crud";

import { CheckIcon, ClipboardIcon, EllipsisHorizontalIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function ListPartners({ setAlertInfo }) {
  // WEB5 CONTEXT
  const { web5 } = useContext(Web5Context)

  // COMPONENT STATES
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [transferDialog, setTransferDialog] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState(null)
  const [removeId, setRemoveId] = useState('');
  const [type, setType] = useState('')
  const [partnerDID, setPartnerDID] = useState('')
  const [didCopied, setDidCopied] = useState(false)

  // FETCH BENEFICIARIES TO RENDER
  useEffect(() => {
    if(!web5) return;
    try {
      let timer = setTimeout(async () => {
        const beneficiariesData = await getBeneficiaries(web5);
        setBeneficiaries(beneficiariesData);
      }, 2000); // run every 2 seconds
  
      return () => clearTimeout(timer)
    } catch (error) {
      console.error(error.message)
    }
  }, [web5, beneficiaries])

  // CLICK ACTION HANDLERS
  const handleRemove = (recordId) => {
    setRemoveId(recordId)
    setOpenDialog(true)
  }

  const handleTransfer = (did) => {
    setPartnerDID(did)
    setTransferDialog(true)
  }

  // COPY DID TO CLIPBOARD
  const handleCopy = async (did) => {
    try {
      await navigator.clipboard.writeText(did);
      setDidCopied(true);
      console.log("DID copied to clipboard");

      setTimeout(() => {
        setDidCopied(false);
      }, 3000);
    } catch (err) {
      console.log("Failed to copy DID: " + err);
    }
  }

  const executeTransfer = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const code = await transferAssetGroup(web5, type, partnerDID)

      setAlertInfo({
        open: true,
        color: `${code === 202 ? 'green' : 'red'}`,
        content: `${code === 202 ? 'Assets transfered' : 'Transfer failed'}`
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

  const removeBeneficiary = async () => {
    setLoading(true)
    try {
      const code = await deleteRecord(web5, removeId)
      
      setOpenDialog(false)
      setAlertInfo({
        open: true,
        color: 'green',
        content: 'Partner removed'
      })
    } catch (error) {
      setAlertInfo({
        open: true,
        color: 'red',
        content: error.message
      })
    }
    setLoading(false)
  };

  return (
    <>
      <div className="flex justify-center items-center">
      {
        !beneficiaries ?
        <div className="flex justify-center items-center">
          <Spinner className="w-100 h-100" color="orange" />
        </div>
        :
        beneficiaries && beneficiaries.length === 0 ?
        <div className="flex justify-center items-center">
          <Typography variant="h5" color="white">
            No partners added
          </Typography>
        </div>
        :
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {
            beneficiaries.map(({ name, did, recordId }, index) => {
            const classes = "bg-transparent text-white hover:shadow-none hover:text-gray-800";

            return (
              <Card 
                key={index} 
                className="w-auto max-w-[35rem] bg-gray-900 text-white"
              >
                <CardBody>
                  {/* name and options icon */}
                  <div className="flex justify-between gap-10">
                    <Typography variant="h6" color="white" className="font-semibold">
                      {name}
                    </Typography>
                    <IconButton
                      className={`${classes} hover:text-red-800`}  
                      onClick={() => {handleRemove(recordId)}}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </IconButton>
                  </div>
                  
                  {/* truncated DID */}
                  <Typography
                    variant="small"
                    color="white"
                    className="font-semibold"
                  >
                    {`${did.substring(0, 20)}...`}
                  </Typography>

                  {/* copy DID button */}
                  <Tooltip content="Copy DID">
                    <IconButton
                      onClick={() => {handleCopy}} // copy function here
                    >
                      {
                        didCopied ?
                        <CheckIcon className="w-5 h-5" />
                        :
                        <ClipboardIcon className="w-5 h-5" />
                      }
                      
                    </IconButton>
                  </Tooltip>
                </CardBody>
              </Card>
            )
            })
          }
        </div>
      }
      </div>

      {/* CONFIRM REMOVE BENEFICIARY DIALOG */}
      <Dialog open={openDialog} handler={() => setOpenDialog(!openDialog)}>
        <DialogHeader color="red">Remove Partner</DialogHeader>
        <DialogBody className="flex items-center justify-center text-center">
        {
            loading ? 
            <Spinner color="orange" className="w-30 h-30" />
            : 
            'Are you sure you want to remove partner from list?'
          }
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="black"
            onClick={() => setOpenDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={removeBeneficiary}
          >
            Remove
          </Button>
        </DialogFooter>
      </Dialog>

      {/* HANDLE TRANSFER ASSETS */}
      <Dialog open={transferDialog} handler={() => setTransferDialog(!transferDialog)}>
        <DialogHeader color="red">Transfer assets to partner</DialogHeader>
        <form onSubmit={executeTransfer}>
          <Select
            label="Asset Type"
            size='lg'
            color='orange'
            className='text-white'
            variant="static"
            value={type}
            onChange={(e) => setType(e)}
          >
            <Option value='Secret'>Secret</Option>
            <Option value='Will'>Will</Option>
            <Option value='Legal Document'>Legal Document</Option>
            <Option value='Special Message'>Special Message</Option>
            <Option value='Backup Codes'>Backup Codes</Option>
          </Select>
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
