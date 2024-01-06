import {
  Typography,
  Button,
  Input,
  Spinner
} from "@material-tailwind/react"
import CustomAlert from '@/components/alert';
import { useState, useEffect, useContext } from 'react';
import { addSecret } from '@/lib/crud';
import { Web5Context } from '@/lib/contexts';

export default function AddSecret() {
  // WEB5 CONTEXT
  const { web5 } = useContext(Web5Context)

  // COMPONENT STATES
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
    setLoading(true)
    try {
      e.preventDefault();
      const recordData = {
        account_name: accountName,
        phrase: phrase,
        platform: platform
      }
      const record = await addSecret(web5, recordData);
      setAlertInfo({
        open: true,
        color: 'green',
        content: 'Secret saved'
      })
      setAccountName("");
      setPhrase("");
      setPlatform("");
    } catch (error) {
      setAlertInfo({
        open: true,
        color: 'red',
        content: error
      })
    }
    setLoading(false)
  };

  return (    
    <form 
      onSubmit={handleSubmit} 
      className='lg:w-1/2 m-auto'
    >
      {
        alertInfo.open && <CustomAlert alertInfo={alertInfo} />
      }
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
      </div>
      {/* SUBMIT BUTTON */}
      <div className='flex flex-row justify-center items-center text-center'>
        <Button 
          className="flex items-center justify-center w-2/5 md:w-1/3 lg:w-1/3 mt-6 bg-black hover:bg-gray-800"
          fullWidth
          disabled={!isFormReady}
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
