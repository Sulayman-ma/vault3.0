import { 
  Spinner,
  Timeline, 
  TimelineBody, 
  TimelineConnector, 
  TimelineHeader, 
  TimelineIcon, 
  TimelineItem, 
  Typography
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { Web5Context } from "@/lib/contexts";
import { getNotifications } from "@/lib/crud";

export default function Page() {
  const { web5 } = useContext(Web5Context)

  const [notifications, setNotifications] = useState(null)

  useEffect(() => {
    if(!web5) return

    const fetchData = async () => {
      const data = await getNotifications(web5)
      setNotifications(data)
    }

    fetchData()
  }, [web5])

  return (
    <div className="mb-20 m-auto">
      <Timeline className="flex justify-center items-center gap-5 text-white">
        <Typography variant="h3" color="white">
          Notifications
        </Typography>

        {
          !notifications ?
          <div className="flex justify-center items-center">
            <Spinner className="w-100 h-100" color="orange" />
          </div>
          :
          notifications && notifications.length === 0 ?
          <div className="flex justify-center items-center">
            <Typography variant="h5" color="white">
              Notifications are empty
            </Typography>
          </div>
          :
          notifications.map((notif, index) => (
            <TimelineItem key={index}>
              <TimelineConnector />
              <TimelineHeader className="h-3">
                <TimelineIcon />
                <Typography variant="h6" color="blue-gray" className="leading-none text-white">
                  {/* notification title */}
                  {notif.message}
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8">
                <Typography variant="small" color="gary" className="font-normal text-gray-600">
                  {/* timestamp of notification */}
                  {notif.timestamp}
                </Typography>
              </TimelineBody>
            </TimelineItem>
          ))
        }
      </Timeline>
    </div>
  )
}
