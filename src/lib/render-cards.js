import { 
  BlankCard,  
  NewAssetCard, 
} from '@/components/assets/detailed-cards'
import DocumentCard from '@/components/assets/document-card';
import SecretCard from "@/components/assets/secret-card";

export const renderDetailedCard = (stuff, updateAsset) => {
  switch (stuff.group) {
    case 'new_asset':
      return <NewAssetCard />;
    case 'Secret':
      return (
        <SecretCard 
          assetData={stuff.assetData} 
          updateAsset={updateAsset}
        />
      );
    case '':
      return (
        <BlankCard />
      );
    default:  
      return (
        <DocumentCard 
          assetData={stuff.assetData} 
          updateAsset={updateAsset}
        />
      );
  }
}
