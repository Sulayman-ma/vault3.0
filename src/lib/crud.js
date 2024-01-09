import { VerifiableCredential } from "@web5/credentials";
import { DidIonMethod } from "@web5/dids";
import { legacyVaultProtocol as lvp } from "./protocols";

export async function addCredential(web5, vcData) {
  try {
    const portableDid = await DidIonMethod.create()
    const didString = portableDid.did
    const { type, partnerDID, myDid, ...rest } = vcData
    
    // create VC object
    const vc = await VerifiableCredential.create({
      type: type,
      issuer: didString,
      subject: didString,
      data: rest
    });

    // sign VC with portable DID
    const signedVcJwt = await vc.sign({ did: portableDid })

    console.info('we made it this far at least')
    // create record for signed VC and store here
    const response = await web5.dwn.records.write({
      data: signedVcJwt,
      message: {
        protocol: lvp.protocol,
        protocolPath: "credential",
        schema: lvp.types.credential.schema,
        dataFormat: 'text/plain',
        recipient: partnerDID,
        author: myDid
      }
    })

    // send to the partner if specified
    if (partnerDID) {
      const send = await response.record.send(partnerDID)
      console.info('Shared to associate: ', send)
      const notification = await sendNotification(web5, partnerDID, myDid)
    }

    return response.status.code
  } catch (error) {
    console.error('Add credential failed:', error)
  }
}

export async function addSecret(web5, recordData) {
  try {
    const response = await web5.dwn.records.create({
      data: {
        group: 'Secret',
        payload: recordData,
      },
      message: {
        protocol: lvp.protocol,
        protocolPath: "pass",
        schema: lvp.types.pass.schema,
        dataFormat: 'application/json'
      }
    })
    // await response.record.send()
    console.info(response.status.code)

    return response.status.code
  } catch (error) {
    console.error('Add pass failed:', error)
    throw new Error('Failed to add entry')
  }
}

export async function addBeneficiary(web5, recordData) {
  try {
    const response = await web5.dwn.records.create({
      data: recordData,
      message: {
        protocol: lvp.protocol,
        protocolPath: "beneficiary",
        schema: lvp.types.beneficiary.schema,
        dataFormat: 'application/json'
      }
    })

    return response.status.code
  } catch (error) {
    console.error('Add partner failed:', error)
  }
}

export async function getSecrets(web5) {
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: lvp.protocol,
          schema: lvp.types.pass.schema,
        },
      },
    });
  
    if (response.status.code === 200) {
      const phrases = await Promise.all(
        response.records.map(async (record) => {
          const dwnData = await record.data.json();
          const payload = dwnData.payload;
          const details = {
            group: dwnData.group,
            recordId: record.id,
            ...payload
          }
          return details;
        })
      );
      return phrases
    }
  } catch (error) {
    console.error('Failed to fetch secrets:', error)
  }
}

export async function getCredentials(web5) {
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: "https://legacy-vault/protocol",
          schema: "https://legacy-vault/credential",
          dataFormat: 'text/plain'
        },
      },
    });
    
    if (response.status.code === 200) {
      const docs = await Promise.all(
        // retrieve payload and other necessary data for the credentials
        response.records.map(async (record) => {
          const signedJwt = await record.data.text();
          const vc = VerifiableCredential.parseJwt({ vcJwt: signedJwt })
          const vcDetails = vc.vcDataModel.credentialSubject
          const details = {
            group: vc.type,
            recordId: record.id,
            ...vcDetails,
            created: vc.vcDataModel.issuanceDate
          }
          return details;
        })
      );
      // console.info('Credentials fetched: ', docs)
      return docs
    }
  } catch (error) {
    console.error('Failed to fetch credentials:', error)
  }
}

export async function getAssets(web5) {
  try {
    const credentials = await getCredentials(web5)
    const secrets = await getSecrets(web5)
    const assets = [...credentials, ...secrets]
  
    const renderData = assets.reduce((acc, asset) => {
      let match = acc.find(group => group.group === asset.group)
      // create group if it does not exist
      if (!match) {
        match = {group: asset.group, records: []}
        acc.push(match)
      }
      // add data to corresponding group's records array
      match.records.push(asset)
      return acc;
    }, [])
    // console.log(renderData);
    return renderData
  } catch (error) {
    console.error('Failed to get assets:', error)
  }
}

export async function getAssetByType(web5, type) {
  const assets = await getAssets(web5)

  const find = assets.find(match => match.group === type)

  return find.records
}

export async function getBenByDid(web5, did) {
  try {
    const beneficiaries = await getBeneficiaries(web5)
    const match = await beneficiaries.find(data => data.did === did)
    if (match === undefined) {
      return {name: 'Personal'}
    } else { return match }
  } catch (error) {
    console.error('Get beneficiary name failed: ', error)
    throw new Error(error.message)
  }
}

export async function getBeneficiaries(web5) {
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: lvp.protocol,
          schema: lvp.types.beneficiary.schema,
        },
      },
    });
    
    if (response.status.code === 200) {
      const beneficiaries = await Promise.all(
        response.records.map(async (record) => {
          const payload = await record.data.json();
          const details = {
            recordId: record.id,
            name: payload.benName,
            did: payload.benDid,
          }
          return details;
        })
      );
      return beneficiaries
    }
  } catch (error) {
    console.error('Failed to get partners:', error)
  }
}

export async function updateRecord(web5, newData, recordId) {
  try {    
    const { group, ...rest } = newData 
    const { record } = await web5.dwn.records.read({
      message: {
        filter: {
          recordId: recordId
        },
      },
    })

    const response = await record.update({
      data: {
        group: group,
        payload: rest
      }
    });

    return response.status.code
  } catch (error) {
    console.error('Update record failed: ', error)
  }
}

export async function updateCredential(web5, newData, recordId) {
  try {
    const { record } = await web5.dwn.records.read({
      message: {
        filter: {
          recordId: recordId
        }
      }
    })

    const portableDid = await DidIonMethod.create()
    const didString = portableDid.did

    const { group, ...rest } = newData

    // create VC object
    const vc = await VerifiableCredential.create({
      type: newData.group,
      issuer: didString,
      subject: didString,
      data: rest
    });

    // sign VC with portable DID
    const signedVcJwt = await vc.sign({ did: portableDid })

    // update credential record with new signed credential
    const response = await record.update({ data: signedVcJwt });

    return response.status.code
  } catch (error) {
    console.error('Update record failed: ', error)
  }
}

export async function deleteRecord(web5, recordId) {
  try {
    const response = await web5.dwn.records.delete({
      message: {
        recordId: recordId
      },
    });
  
    return response.status.code
  } catch (error) {
    console.error('Delete record failed:', error)
  }
}

export async function convertToBase64(file) {
  // CONVERT IMAGE FILE TO BASE64 STRING
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function convertBase64ToFile(base64String, title) {
  // console.info('Converting the base64 string to a file...')
  // setting filename
  const { extension, mimeType } = getFileInfo(base64String)
  const fileName = `${title}.${extension}`

  // creating byte array for whatever reason I cannot remember
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const file = new File(
    byteArrays, 
    fileName, 
    { type: mimeType }
  );
  return file;
}

export function getFileInfo(base64String) {
  // CONVERT BASE64 STRING TO ITS APPROPRIATE FILE DATA
  let mimeType = null
  var data = base64String.substring(0, 5);
  // console.info('Head of base64 string', data)
  switch (data.toUpperCase()) {
    case "IVBOR":
      mimeType = "image/png";
      break
    case "/9J/4":
      mimeType = "image/jpeg";
      break
    case "JVBER" || "%PDF-":
      mimeType = "application/pdf";
      break
    default:
      mimeType = "text/plain";
  }

  const extension = 
  `${mimeType.startsWith('text') ? 'text' : mimeType.split('/')[1]}`

  return {
    mimeType: mimeType,
    extension: extension
  }
}

export async function sendNotification(web5, partnerDID, myDid) {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  // CREATE NOTIFICATION
  const { record } = await web5.dwn.records.write({
    data: {
      message: 
      `Shared asset from [${myDid.substring(0, 25)}...]`,
      timestamp: `${currentDate} ${currentTime}`,
    },
    message: {
      protocol: lvp.protocol,
      protocolPath: "notification",
      schema: lvp.types.notification.schema,
      dataFormat: 'application/json',
      recipient: partnerDID,
      author: myDid
    }
  })

  // SEND NOTIFICATION TO THE RECEIVING REMOTE DWN
  const response = await record.send(partnerDID)

  return response.status.code
}

export async function getNotifications(web5) {
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: lvp.protocol,
          schema: lvp.types.notification.schema,
        },
      },
    });
  
    if (response.status.code === 200) {
      const notifs = await Promise.all(
        response.records.map(async (record) => {
          const dwnData = await record.data.json();
          return dwnData;
        })
      );
      console.info(notifs)
      return notifs
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  }
}

export async function debugSentAssets(web5, receivingDID) {
  try {
    const response = await web5.dwn.records.query({
      from: receivingDID,
      message: {
        filter: {
          protocol: "https://legacy-vault/protocol",
          schema: "https://legacy-vault/credential",
          dataFormat: 'text/plain'
        },
      },
    });
    
    if (response.status.code === 200) {
      const docs = await Promise.all(
        // retrieve payload and other necessary data for the credentials
        response.records.map(async (record) => {
          const signedJwt = await record.data.text();
          const vc = VerifiableCredential.parseJwt({ vcJwt: signedJwt })
          const vcDetails = vc.vcDataModel.credentialSubject
          const details = {
            group: vc.type,
            recordId: record.id,
            ...vcDetails,
            created: vc.vcDataModel.issuanceDate
          }
          return details;
        })
      );
      return docs
    }
  } catch (error) {
    console.error('Failed to fetch send assets:', error)
  }
}
