# The Reanimated Workshop – App.js Conference 2023

## Hosted by

- Catalin Miron ([@mironcatalin](https://twitter.com/mironcatalin))
- Krzysztof Magiera ([@kzzzf](https://twitter.com/kzzzf))

## Setup

During this workshop we will work with an Expo / React Native app published in this repo.
In order to make setup more seamless we have prepared a so-called Expo's development client builds that include all the native code for all the dependencies that are used as a part of the workshop.

You should be able to use iOS simulator, Android emulator, or any modern Andorid or iOS phone to perform the exercises, however, we recommend that you stick to one choice to avoid additional setup steps you may need to do in the future.
If you choose to work with an emulator (either iOS or Android) make sure that you have that emulator installed and configured as setting it up is outside of this setup scope.

## Before you begin

use the below command to install [Expo CLI](https://docs.expo.dev/workflow/expo-cli/):

```bash
npm install -g expo-cli
```

Or make sure it is up to date if you have it installed already:

```bash
expo --version
```

## Preparing device or simulator

Depending on what device or simulator you choose to use, you'll need to install custom made Development Client application in your environment.
Follow one of the sections below for detailed instructions.

### For iOS simulator

1. Download Development Client build [from this link](https://storage.googleapis.com/turtle-v2-artifacts/production/4e288b26-ee67-4bcc-b377-19e014217554/ddfad155-dea8-4c18-be00-c70f3aba64ab/application-b50203bd-dcbb-4687-81eb-a6821c8658b1.tar.gz?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=www-production%40exponentjs.iam.gserviceaccount.com%2F20230509%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230509T103403Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=71d72a21277e3fd1b9827faa1c35f9fe67bfbf8730b38a0f179919f0f02bdc26f5edd5cec7b01b75af268be5d3e84975593109fad7ee9b875026417379861bf58b5242d068790a54c4d460e08c20561910853f917b6641d8965bdb45359642b7d11222ae5e110526889279376dcd81d124cc52041666f2ee5646b1611ed6093c67d1aa9112e31fd85084fd9bb5ee0230720472c12576f08f0c813cab3d554c5b6c52d7cbec864a57c120edc2ea75cdd136d1482fde612fe7aa9687ed6da6ad54ded35213c7e3fb93424d1e205aded873d9181a950d28696c3066033f05052740ac2398673d344944be7cb6d4d9b4863d35cfd3e51ba3eb13cb35cbd8fd36ec0d)
2. Extract `appjsworkshop.app` file from the downloaded archive
3. Launch your iOS simulator
4. Drag and drop the `.app` file onto the simulator

### For iOS device

1. Scan the QR code below with your iOS phone:

![https://expo.dev/register-device/1374127c-1559-4652-a0bc-7a773fd4c0bd](/QRs/ios.svg)

2. Click "Download Profile" button on the website that the code opens, and confirm with "Allow" button on the dialog that pops up after that
3. Follow the instructions on the website to install the provisioning profile – go to Settings and click "Profile Downloaded", then click "Install" on the dialog.
4. The above steps will register your device with provisioning profile, after this step you will need to wait for us to create a new development client build that you'll be able to install on your device.

### For Android emulator

1. Download Development Client build [from this link](https://expo.dev/artifacts/eas/hpj5oMjmb4Kp95Mu94WXz4.apk)
2. Launch Android emulator on your computer
3. Drag and drop the downloaded `.apk` file onto emulator

### For Android device

1. Scan this QR code on your device:

![https://expo.dev/accounts/catalinmiron/projects/AppjsWorkshop2023/builds/84d376ff-aefb-4339-9403-f571a9a3b259](/QRs/android.svg)

2. Tap "install" button on the website that opens after scannig the code

## Running the app

After completing Development Client installation step, you now should be able to clone this repo and launch the app.
Follow the below steps from the terminal:

1. Clone the repo:

```bash
git clone git@github.com:software-mansion-labs/appjs-2023-workshop-reanimated.git && cd appjs-2023-workshop-reanimated
```

2. Install project dependencies (run the below command from the project main directory):

```bash
yarn
```

3. Launch the app with Expo CLI:

```bash
expo start --dev-client
```

4. The above step will print instructions on how to launch the app on phone or simulator. For iOS simulator you'll need to press "i", for Android press "a", and if you'd like to run the app on a physical device you'll need to scan the QR code that will be displayed on the command line output.

## Next step

**Go to: [Circle Gestures](./src/lessons/CircleGestures/)**
