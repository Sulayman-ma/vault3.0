import { 
  BlankCard,  
  NewAssetCard, 
} from '@/components/assets/detailed-cards'
import OtherCard from "@/components/assets/other-card";
import SecretCard from "@/components/assets/secret-card";

export const renderDetailedCard = (stuff, updateAsset) => {
  switch (stuff.group) {
    case 'new_asset':
      return <NewAssetCard />;
    case 'welcome':
      return (
        <BlankCard />
      );
    case 'Secret':
      return (
        <SecretCard 
          assetData={stuff.assetData} 
          updateAsset={updateAsset}
        />
      );
    default:  
      return (
      <OtherCard 
        assetData={stuff.assetData} 
        updateAsset={updateAsset}
      />
      );
  }
}
