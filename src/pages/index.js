import { ListItem, Typography } from "@material-tailwind/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 justify-center items-center mt-30">
      <Typography variant="h6" color="white">
        Here at the home page
      </Typography>
      <Link href="/vault" className="bg-gray-900 py-3 px-4 text-orange-400 rounded-lg">
        GET STARTED
      </Link>
    </div>
  )
}
