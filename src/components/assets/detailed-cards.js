import {
  Typography,
  CardBody,
  Button,
  ButtonGroup,
} from "@material-tailwind/react"
import { useState } from "react"
import AddCredential from "@/components/assets/add-credential"
import AddSecret from "@/components/assets/add-secret"

export function NewAssetCard() {
  const [form, setForm] = useState(1);

  const swapForm = (formNum) => {
    if (formNum === 1) {
      setForm(1);
    } else {
      setForm(2);
    }
  }

  return (
    <CardBody className="w-full text-white">
      <div className="flex flex-col justify-center items-center md:flex-row md:justify-between gap-4">
        <Typography variant="h4" color="white">
          Create new asset
        </Typography>
        <ButtonGroup 
          size="sm" 
          variant="filled" 
        >
          <Button
            className="text-white bg-black"
            onClick={() => swapForm(1)}
          >
            CREDENTIAL
          </Button>
          <Button
            className="text-white bg-black"
            onClick={() => swapForm(2)}
          >
            SECRET
          </Button>
        </ButtonGroup>
      </div>
      <Typography variant="h6" color="gray" className="mt-1 font-semibold">
        Securely store valuable documents such as your will, legal documents, secrets and messages for beneficiaries
      </Typography>

      {/* swap between both forms */}
      <div className="mt-6">
        {form === 1 ? 
          <AddCredential />
          :
          <AddSecret />
        }
      </div>  
    </CardBody>
  )
}

export function BlankCard() {
  return (
    <CardBody className="flex justify-center items-center">
      <Typography 
        color="white"
        className="text-center flex justify-center items-center"
        variant="h3"
      >
        Select an asset to view
      </Typography>
    </CardBody>
  )
}
