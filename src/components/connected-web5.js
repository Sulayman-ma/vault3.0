import clsx from "clsx";
import { useContext } from "react";
import { Web5Context } from "@/lib/contexts";
import { Typography } from "@material-tailwind/react";

export function Web5Connected() {

  const { isConnected } = useContext(Web5Context)

  return(
    <div className="flex items-center">
      <div className={clsx(
        "w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center mr-2",
        {
          "bg-green-700": isConnected,
          "animate-pulse bg-blue-800": !isConnected,
        },
      )}>
      </div>
      {
        <Typography 
          variant="small"
          color="gray"
          className={clsx(
            "uppercase font-smallcaps hidden md:block"
          )}
        >
          {
            isConnected ? 'web5 connected' : 'connecting'
          }
        </Typography>
      }
    </div>
  )
}
