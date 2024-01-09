import {
  Button,
  Input,
  Spinner,
  Alert,
  Checkbox
} from "@material-tailwind/react"
import { useState, useEffect, useContext } from 'react';
import { addPublicSecret, addSecret } from '@/lib/crud';
import { Web5Context } from '@/lib/contexts';
import clsx from "clsx";

export default function AddSecret() {
  // WEB5 CONTEXT
  const { web5 } = useContext(Web5Context)

  // COMPONENT STATES
  const [partnerDID, setPartnerDID] = useState('')
  const [shared, setShared] = useState(false)
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [phrase, setPhrase] = useState('');
  const [platform, setPlatform] = useState('');
  const [isFormReady, setIsFormReady] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    color: 'blue',
    content: '',
  })
  
  // DISABLE SUBMIT IF WEB5 IS UNAVAILABLE AND ANY FIELD IS EMPTY
  useEffect(() => {
    setIsFormReady((
      web5 !== null) && 
      accountName.length > 0 && 
      phrase.length > 0
    );
  }, [web5, accountName, phrase]);

  // CLICK ACTION HANDLERS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const timestamp = new Date(Date.now()).toISOString();
      if (!shared) {
        const recordData = {
          account_name: accountName.trim(),
          phrase: phrase,
          platform: platform.trim(),
          created: timestamp,
        }
        const record = await addSecret(web5, recordData);
        setAlertInfo({
          open: true,
          color: 'green',
          content: 'Secret saved'
        })
      } else {
        const recordData = {
          account_name: accountName.trim(),
          phrase: phrase,
          platform: platform.trim(),
          created: timestamp,
          shared: shared,
          partnerDID: partnerDID
        }
        const record = await addPublicSecret(web5, recordData);
        setAlertInfo({
          open: true,
          color: 'green',
          content: 'Secret saved and shared'
        })
      }
      
      setAccountName("");
      setPhrase("");
      setPlatform("");
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
    <form 
      onSubmit={handleSubmit} 
      className='lg:w-1/2 m-auto'
    >
      <Alert 
        open={alertInfo.open}
        onClose={() => {setAlertInfo({ open: false })}}
        color={alertInfo.color}
        className="my-5"
        variant="outlined"
      >
        {alertInfo.content}
      </Alert>
      <div className="mb-1 grid gap-14">
        <Input
          size="lg"
          label="Platform"
          variant="static"
          placeholder="Platform of secret"
          type='text'
          className="!border-white focus:!border-orange-400 text-white"
          color="orange"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />
        <Input
          size="lg"
          label="Account username"
          variant="static"
          placeholder="Account name"
          type='text'
          className="!border-white focus:!border-orange-400 text-white"
          color="orange"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
        <Input
          size="lg"
          label="Secret Phrase"
          variant="static"
          placeholder="********"
          type='password'
          className="!border-white focus:!border-orange-400 text-white"
          color="orange"
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
        />
        {/* ASSOCIATE DID */}
        {/* <Checkbox
          label="Shared"
          value={shared}
          color="orange"
          onChange={() => {setShared(!shared)}}
        />
        <div className={shared ? '' : 'hidden'}>
          <Input
            size="lg"
            placeholder="did:ion:EiATonoOnZFGWpw17..."
            label="Associate DID (optional)"
            type="text"
            className={clsx(
              "!border-white !focus:border-orange-400 text-white"
            )}
            variant="static"
            color="orange"
            value={partnerDID}
            onChange={(e) => setPartnerDID(e.target.value)}
          />
        </div> */}
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
};
