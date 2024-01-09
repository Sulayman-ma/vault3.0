export const legacyVaultProtocol = {
  protocol: "https://legacy-vault/protocol",
  published: true,
  types: {
    pass: {
      schema: "https://legacy-vault/pass-phrase",
      dataFormats: ["application/json"],
    },
    credential: {
      schema: "https://legacy-vault/credential",
      dataFormats: ['text/plain', 'application/json']
    },
    beneficiary: {
      schema: "https://legacy-vault/beneficiary",
      dataFormats: ['application/json']
    },
    request: {
      schema: "https://legacy-vault/request",
      dataFormats: ['application/json']
    },
    notification: {
      schema: "https://legacy-vault/notification",
      dataFormats: ['text/plain']
    },
  },
  structure: {
    pass: {
      $actions: [
        { who: "author", of: "pass", can: "read" },
        { who: "author", of: "pass", can: "write" },
      ],
    },
    credential: {
      $actions: [
        { who: "anyone", can: "write" },
        { who: "author", of: "credential", can: "read" },
        { who: "recipient", of: "credential", can: "read" },
      ]
    },
    beneficiary: {
      $actions: [
        { who: "author", of: "beneficiary", can: "write" },
        { who: "anyone", can: "read" },
      ]
    },
    request: {
      $actions: [
        { who: "anyone", can: "read" },
        { who: "anyone", can: "write" },
      ]
    },
    notification: {
      $actions: [
        { who: "anyone", can: "read" },
        { who: "anyone", can: "write" },
      ]
    },
  }
}

export async function queryForProtocol(web5) {
  return await web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: legacyVaultProtocol.protocol,
      },
    },
  });
}

export async function installProtocolLocally(web5, protocolDefinition) {
  return await web5.dwn.protocols.configure({
    message: {
      definition: protocolDefinition,
    },
  });
}

export async function configureProtocol(web5, myDid) {
  const protocolDefinition = legacyVaultProtocol;

  const { protocols: localProtocol, status: localProtocolStatus } = 
    await queryForProtocol(web5);
  if (
    localProtocolStatus.code !== 200 || 
    localProtocol.length === 0 
  ) {
    const { protocol, status } = await installProtocolLocally(web5, protocolDefinition);
    console.log("Protocol installed locally", protocol, status);

    const { status: configureRemoteStatus } = await protocol.send(myDid);
    console.log("Did the protocol install on the remote DWN?", configureRemoteStatus);
  } else {
    console.log("Protocol already installed");
  }
}
