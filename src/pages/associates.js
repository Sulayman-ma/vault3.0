import { 
  Typography,
  Dialog,
  Button,
  Input,
  IconButton,
  Spinner,
  Alert,
} from "@material-tailwind/react"
import { useContext, useEffect, useState } from "react"
import { Web5Context } from "@/lib/contexts"
import { addBeneficiary } from "@/lib/crud"
import { DidIonMethod } from "@web5/dids"
import { UserPlusIcon } from "@heroicons/react/24/solid"
import ListPartners from "@/components/partners/list-partners"

export default function Page() {
  // WEB5 CONTEXT
  const { web5 } = useContext(Web5Context)

  // COMPONENT STATES
  const [loading, setLoading] = useState(false)
  const [benName, setBenName] = useState('');
  const [benDid, setBenDid] = useState('');
  const [isFormReady, setIsFormReady] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    color: 'blue',
    content: '',
  });

  // ENABLING FORM ONLY WHEN IT'S FILLED
  useEffect(() => {
    if(!web5) return
    setIsFormReady(
      (web5 !== null) && 
      benName.length > 0 && 
      (benDid.length > 0)
    );
  }, [web5, benName, benDid])

  // FOR DEVELOPMENT, REMOVE DURING PRODUCTION MAYBE
  // SETS A DUMMY DID WHILE FILLING THE FORM
  // useEffect(() => {
  //   if(!web5) return
  //   setDummyDid()
  // }, [web5]);

  // RANDOM ACTIONS HANDLERS AND STUFF
  const setDummyDid = async () => {
    const dummyDid = await DidIonMethod.create()
    setBenDid(dummyDid.document.id)
  }

  const checkDID = async (benDid) => {
    const response = await web5.did.resolve(benDid)
    if (response.didDocument) { return true }
    else { false }
  }

  const handleSubmit = async (e) => {
    setLoading(true)
    try {
      e.preventDefault();
      if (!benName.trim()) {
        setAlertInfo({
          open: true,
          color: 'orange',
          content: 'Please enter a associate name'
        })
        return;
      }

      const valid = await checkDID(benDid)
      if (!valid) {
        setAlertInfo({
          open: true,
          color: 'orange',
          content: 'DID is invalid'
        })
        setOpenDialog(false)
        setLoading(false)
        return
      }

      let recordData = {
        benName: benName,
        benDid: benDid,
      }
      const code = await addBeneficiary(web5, recordData);

      setAlertInfo({
        open: true,
        color: `${code === 202 ? 'green' : 'red'}`,
        content: `${code === 202 ? 'Associate added' : 'Failed to add'}`
      })
      setBenName('')
      setBenDid('')
    } catch (error) {
      console.error(error)
      setAlertInfo({
        open: true,
        color: 'red',
        content: error.message
      })
    }
    setOpenDialog(false)
    setLoading(false)
  };

  // BENEFICIARIES PAGE SHOULD ONLY RENDER ALL SAVED BENEFICIARIES AND THE FORM TO ADD A NEW BENEFICIARY IS GOING TO BE A DIALOG FORM FROM MATERIAL TAILWIND
  return(
    <div>
      {/* ADD NEW BENEFICIARY */}
      <div className="flex justify-evenly items-center">
        <Typography variant="h3" color="white">
          Vault Associates
        </Typography>
        <IconButton
          onClick={() => {setOpenDialog(!openDialog)}}
        >
          <UserPlusIcon className="w-5 h-5" />
        </IconButton>
      </div>

      {/* SHARED ALERT FOR BOTH COMPONENTS */}
      <div className="w-[80%] md:w-[50%] lg:w-[40%] m-auto my-5 flex justify-center items-center">
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

      {/* BENEFICIARIES TABLE */}
      <ListPartners setAlertInfo={setAlertInfo} />

      {/* ADD BENEFICIARY DIALOG FORM */}
      <Dialog 
        size="xs"
        open={openDialog}
        handler={() => {setOpenDialog(!openDialog)}}
        className="bg-gray-900 p-10"
      >
        <form 
          className="mt-8 mb-2 mx-auto w-full min-w-[15rem] max-w-[24rem]"
          onSubmit={handleSubmit}
        >
          <Typography variant="h3" color="white" className="mb-3">
            Add a new associate
          </Typography>
          <div className="mb-1 flex flex-col gap-14">
            <Input
              size="lg"
              label="Associate Name"
              color="orange"
              variant="static"
              placeholder="John Trabajo Joe"
              type='text'
              required
              className="!border-white focus:!border-orange-400 text-white"
              onChange={(e) => setBenName(e.target.value)}
            />
            <Input
              size="lg"
              label="Associate DID"
              placeholder="did:ion:12sd34as..."
              type='text'
              color="orange"
              variant="static"
              required
              className="!border-white focus:!border-orange-400 text-white"
              value={benDid}
              onChange={(e) => setBenDid(e.target.value)}
            />
          </div>
          {/* SUBMIT BUTTON */}
          <div className='flex flex-row justify-center items-center text-center'>
            <Button 
              className="flex items-center justify-center w-2/5 md:w-1/3 lg:w-1/3 mt-6 bg-black hover:bg-gray-800"
              fullWidth
              disabled={!isFormReady || loading}
              type='submit'
            >
              {
                loading ? 
                <Spinner color="orange"
                variant="static" className="w-5 h-5" />
                : 
                'add'
              }
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
