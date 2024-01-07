import { 
  Button, 
  Card, 
  Dialog, 
  DialogBody, 
  DialogFooter, 
  DialogHeader, 
  Spinner, 
  Typography 
} from "@material-tailwind/react";
import { useState, useContext, useEffect } from "react";
import { Web5Context } from "@/lib/contexts";
import { deleteRecord, getBeneficiaries } from "@/lib/crud";
import clsx from "clsx";

export default function ListBeneficiaries({ setAlertInfo }) {
  // WEB5 CONTEXT
  const { web5 } = useContext(Web5Context)

  // COMPONENT STATES
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState(null)
  const [removeData, setRemoveData] = useState({
    benName: '',
    recordId: ''
  });

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
  const handleRemove = (benName, recordId) => {
    setRemoveData({
      benName: benName,
      recordId: recordId,
    })
    setOpenDialog(true)
  }

  const removeBeneficiary = async () => {
    setLoading(true)
    try {
      const code = await deleteRecord(web5, removeData.recordId)
      
      setOpenDialog(false)
      setAlertInfo({
        open: true,
        color: 'green',
        content: 'Beneficiary removed'
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

  const TABLE_HEAD = ['Name', 'DID', 'Relationship', '']

  return (
    <>
      {
        !beneficiaries ?
        <div className="flex justify-center items-center">
          <Spinner className="w-100 h-100" color="orange" />
        </div>
        :
        beneficiaries && beneficiaries.length > 0 ? (
        <Card color="transparent" className="h-full overflow-y-auto">
          <table className="m-auto w-[20rem] md:w-80% table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className={clsx(
                      "border-b border-white-100 bg-white-50 p-4",
                    )}
                  >
                    <Typography
                      variant="paragraph"
                      color="white"
                      className="font-semibold leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {
              beneficiaries.map(({ recordId, name, relationship, did }) => {
                const classes = "p-4 border-b border-white-50";
    
                return (
                  <tr key={recordId}>
                    <td className={classes}>
                      <Typography
                        variant="paragraph"
                        color="white"
                        className="font-semibold"
                      >
                        {name}
                      </Typography>
                    </td>
                    <td className={`${classes}`}>
                      <Typography
                        variant="paragraph"
                        color="white"
                        className="font-semibold"
                      >
                        {did ? (did.substring(0, 20) + '...') : 'No DID'}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="paragraph"
                        color="white"
                        className="font-semibold"
                      >
                        {relationship}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Button
                        variant="gradient"
                        color="red"
                        className="font-medium"
                        onClick={() => {handleRemove(name, recordId)}}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        </Card>
        ) 
        : 
        <div className="flex justify-center items-center">
          <Typography variant="h5" color="white">
            No beneficiaries saved
          </Typography>
        </div>
      }

      {/* CONFIRM REMOVE BENEFICIARY DIALOG */}
      <Dialog open={openDialog} handler={() => setOpenDialog(!openDialog)}>
            <DialogHeader color="red">Remove Beneficiary</DialogHeader>
            <DialogBody>
            {
                loading ? 
                <Spinner color="orange" className="w-30 h-30" />
                : 
                'Are you sure you want to remove {removeData.benName} from list?'
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
    </>
  )
}
