import { 
  Select,
  Typography,
  Option,
  Button,
  Input,
  Textarea,
  Spinner,
  Alert,
} from "@material-tailwind/react"
import { useContext, useEffect, useState } from "react";
import { 
  addCredential, 
  convertToBase64,
} from "@/lib/crud";
import { Web5Context } from "@/lib/contexts";

export default function AddCredential() {
  // WEB5 CONTEXT
  const { web5, myDid } = useContext(Web5Context)

  // COMPONENT STATES
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [size, setSize] = useState(null)
  const [isWill, setIsWill] = useState(false)
  const [isFormReady, setIsFormReady] = useState(false);
  const [partnerDID, setPartnerDID] = useState(null)
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    color: 'blue',
    content: '',
  })

  // FETCH BENEFICIARIES FOR FORM AND ENABLE SUBMIT AFTER FUNCTION RETURNS
  useEffect(() => {
    if (attachment) {
      setSize((attachment.size / (1024 * 1024)).toFixed(1))
    }
    setIsFormReady(
      (web5 !== null) && 
      title.length > 0 && 
      type.length > 0
    );

    setIsWill(title === 'Will' || title === 'Special Message')
  }, [web5, title, type, attachment, size]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // HANDLE FILE CONVERSION
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
      }

      const vcData = {
        type: type,
        title: title.trim(),
        description: description.trim(),
        attachment: base64String,
        partnerDID: partnerDID,
        myDid: myDid
      }

      const code = await addCredential(web5, vcData)

      setAlertInfo({
        open: true,
        color: `${code <= 202 ? 'green' : 'red'}`,
        content: `${code <= 202 ? 'Asset saved' : 'Failed to save asset'}`
      })
      setTitle('')
      setDescription('')
    } catch (error) {
      console.info('Error: ', error)
      setAlertInfo({
        open: true,
        color: 'red',
        content: error.message
      })
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ALERT OR SOMETHING, I'VE COMMENTED THIS EVERYWHERE AND I'M STARTING TO GET TIRED HONESTLY BUT I WON'T STOP */}
        <Alert
          open={alertInfo.open}
          onClose={() => {setAlertInfo({ open: false })}}
          color={alertInfo.color}
          className="my-5"
          variant="outlined"
        >
          {alertInfo.content}
        </Alert>
      <div className="mb-1 gap-10 grid lg:grid-cols-2">
        {/* ASSET TYPE (GROUP) */}
        <div>
          <Select
            label="Credential Type"
            size='lg'
            color='orange'
            className='text-white'
            variant="static"
            value={type}
            onChange={(e) => setType(e)}
          >
            <Option value='Will'>Will</Option>
            <Option value='Legal Document'>Legal Document</Option>
            <Option value='Special Message'>Special Message</Option>
            <Option value='Backup Codes'>Backup Codes</Option>
          </Select>
        </div>
        {/* ASSET TITLE */}
        <div>
          <Input
            size="lg"
            placeholder="Title of credential"
            label="Title"
            type="text"
            required
            className="!border-white !focus:border-orange-400 text-white"
            variant="static"
            color="orange"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* PARTNER DID */}
        <div>
          <Input
            size="lg"
            placeholder="did:ion:EiATonoOnZFGWpw17..."
            label="Recipient DID"
            type="text"
            className="!border-white !focus:border-orange-400 text-white"
            variant="static"
            color="orange"
            value={partnerDID}
            // disabled={!isWill}
            onChange={(e) => setPartnerDID(e.target.value)}
          />
        </div>
        {/* ADDITIONAL CONTENT */}
        <div>
          <Textarea
            size="lg"
            placeholder="Additional description for the asset"
            label="Description (optional)"
            className="!border-white !focus:border-orange-400 text-white"
            variant="static"
            color="orange"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {/* ATTACHMENT */}
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
            {
              attachment ? 
              attachment.size > (1 * 1024 * 1024)? 
                `Size limit exceeded : ${size}MB`
              : 'File accepted ✔️'
              : 'Allowed: PNG, JPG, PDF and plain text. Size limit: 1MB.'
            }
          </Typography>
        </div>
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
            <Spinner color="orange" className="w-5 h-5" />
            : 
            'add'
          }
        </Button>
      </div>
    </form>
  );
}
