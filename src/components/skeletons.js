import {
  Card,
  CardBody,
  ListItem,
} from "@material-tailwind/react"

export function MiniCardSkeleton() {
  return (
    <Card className="w-auto max-w-[20rem] mr-2 mb-3 p-0 bg-gray-900 animate-pulse">
      <CardBody>
        <ListItem disabled={true} className="bg-gray-800 p-0 mb-2 rounded-lg hover:bg-transparent">
          &nbsp;
        </ListItem>
        <ListItem disabled={true} className="w-2/3 mb-2 bg-gray-800 p-0 rounded-lg hover:bg-transparent">
          &nbsp;
        </ListItem>
        <ListItem disabled={true} className="bg-gray-800 p-0 rounded-lg hover:bg-transparent">
          &nbsp;
        </ListItem>
      </CardBody>
    </Card>
  )
}

export function BeneficiariesTableSkeleton() {
  return (
    <tbody className="animate-pulse">
      <tr className="w-full">
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
      </tr>
      <tr className="w-full">
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
      </tr>
      <tr className="w-full">
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
        <td className="bg-gray-800 w-[90%] m-auto">&nbsp;</td>
      </tr>
    </tbody>
  )
}
