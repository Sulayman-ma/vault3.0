import { Alert } from "@material-tailwind/react"
import { useState } from "react"

export default function CustomAlert({ alertInfo }) {
  const [localOpen, setLocalOpen] = useState(alertInfo.open)
  const dismiss = () => {
    setLocalOpen(false)
  }

  return (
    <Alert 
      open={alertInfo.open}
      onClose={setAlertInfo({ open: false })}
      color={alertInfo.color}
      className="my-5"
      variant="outlined"
    >
      {alertInfo.content}
    </Alert>
  )
}
