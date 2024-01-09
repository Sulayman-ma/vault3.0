This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
The Microsoft Edge browser was used to develop this app, with the [CORS extension](https://microsoftedge.microsoft.com/addons/detail/bhjepjpgngghppolkjdhckmnfphffdag) gotten from the addons store.
Due to the nature of the application and API, certain functions in the application get blocked by CORS and the TBD DWN servers which sometimes return a 502 server response, so we advice you install a CORS extension in your browser.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open your browser at [localhost port 3000](http://localhost:3000) to see the results!

# Digital Legacy Vault
The **Digital Legacy Vault** is a decentralised web-based application built on top of [Web5](https://developer.tbd.website/docs/web5/) that offers users the ability to securely store and manage their digital assets. These digital assets are simply a group of the individual's most important documents including but not limited to legal documents, wills, special messages, secrets, passwords and even backup codes for 2FA enabled accounts.

### Assets page
This application grants users complete control and ownership over all stored assets. Allowing them to edit, share and/or delete any asset at will and at any given time.
A major feature of this platform is the ability to share any of these assets to other users. Users sharing assets are called Associates. Assets are classified into two:
- Shared: Assets can be shared upon creation with one associate at a time. They are **immutable** and copies can be sent to other users at any time.
- Private: Private assets are editable and vary per user. Copies can also be shared with others and can be modified freely.

### Associates
Information of associates can be added by registering their names and DIDs and they can be seen on the Associates page. The purpose of this page is to allow for easy copying of an associate's DID for future use. Adding an associate does not give them access to any assets in the adding user's vault and this stored information can be deleted freely.

### Notifications
All sharing done on the application is logged in the notifications page in a timeline format.

## Implementation
We built this application using the Next.js framework over 4 weeks. 
The user interface development was sped up by using material tailwind which provides ready made components based on Tailwind CSS and the application was versioned with Git, uploaded on [GitHub](https://github.com) and deployed on [Vercel](https://vercel.com).

## Challenges we ran into
The main developer was new to Next.js and not too familiar with JavaScript. Coupled with the lack of complete clarity of many of the Web5 API functions, it was a challenge worth tackling. After extensive research & trial and error, he began to find solutions to the issues and eventually completed the application.
We ran into numerous challenges that were also Next.js related, the worst of them being the inability to deploy the app to Vercel. This issue turned out to be related to the App router, and after switching to the pages router, everything worked smoothly.

## Accomplishments that we're proud of
We are very proud of the overall design and interactivity of the application. The navigation of the assets especially was tough to implement with the state management running very deep but overall it was fun.

## What we learned
Along the way we learned a lot about Nextjs, JavaScript, Web5's inner workings, and gained more understanding of decentralized identities and many more things.

## What's next for Digital Legacy Vault
The next major feature for the Digital Legacy Vault is the inclusion of blockchain using Smart contracts. A solidity script will be added, and every user will be given the option to automatically send selected assets to an associate after a defined time period has elapsed signifying their death for example or otherwise.

