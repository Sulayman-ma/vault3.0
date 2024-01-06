import {
  SecretMini,
  WillMini,
  LegalDocumentMini,
  MessageMini,
} from "@/components/assets/mini-cards"
import { 
  BlankCard,  
  NewAssetCard, 
} from '@/components/assets/detailed-cards'
import OtherCard from "@/components/assets/other-card";
import SecretCard from "@/components/assets/secret-card";

export const renderMiniCard = (group, assetData, setActiveAsset) => {
  switch (group) {
    case 'Will':
      return (
        <WillMini 
          setAsActive={setActiveAsset} 
          assetData={assetData}
        />
      );
    case 'Secret':
      return (
        <SecretMini 
          setAsActive={setActiveAsset} 
          assetData={assetData}
        />
      );
    case 'Legal Document':
      return (
        <LegalDocumentMini 
          setAsActive={setActiveAsset} 
          assetData={assetData}
        />
      );
    case 'Special Message':
      return (
        <MessageMini 
          setAsActive={setActiveAsset} 
          assetData={assetData}
        />
      );
  }
}

export const renderDetailedCard = (stuff) => {
  switch (stuff.group) {
    case 'new_asset':
      return <NewAssetCard />;
    case 'welcome':
      return (
        <BlankCard />
      );
    case 'Secret':
      return (
        <SecretCard assetData={stuff.assetData} />
      );
    default:  
      return (<OtherCard assetData={stuff.assetData} />);
  }
}
