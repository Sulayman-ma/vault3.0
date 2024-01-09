import { useEffect, useState } from "react"
import { BlankCard, NewAssetCard } from "./detailed-cards"
import SecretCard from "./secret-card"
import DocumentCard from "./document-card"

export default function AssetCanvas({ activeCard }) {
  /* 
  for the purpose of editing and deleting, activeCard is not directly
  modified, instead it is used locally as a state in the canvas
  component
  */
  const [assetData, setAssetData] = useState({})
  const [group, setGroup] = useState('')
  const [blank, setBlank] = useState(false)

  const docs = [
    'Will', 
    'Legal Document', 
    'Special Message', 
    'Backup Codes'
  ]

  useEffect(() => {
    setGroup(activeCard.group)
    setAssetData(activeCard.assetData)
  }, [activeCard])

  const updateAsset = (group, newData) => {
    setGroup(group)
    setAssetData(newData)
  } 

  return (
    <>
      {
        // render blank card
        blank ?
        <BlankCard />
        :
        // render new asset form
        group === 'new_asset' ?
        <NewAssetCard />
        :
        // render secret asset canvas
        group === 'Secret' ?
        <SecretCard 
          assetData={assetData} 
          updateAsset={updateAsset}
          setBlank={setBlank}
        />
        :
        docs.includes(group) ?
        // render docs canvas
        <DocumentCard
          assetData={assetData}
          updateAsset={updateAsset}
          setBlank={setBlank}
        /> 
        : 
        <BlankCard />
      }
    </>
  )
}
