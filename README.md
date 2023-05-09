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

1. Download Development Client build [from this link](https://expo.dev/artifacts/eas/omoRWYr3CgfSyWxwETxxzk.tar.gz)
2. Extract `AppjsWorkshop2023.app` file from the downloaded archive
3. Launch your iOS simulator
4. Drag and drop the `.app` file onto the simulator

### For iOS device

1. Scan the QR code below with your iOS phone:


![https://expo.dev/register-device/1374127c-1559-4652-a0bc-7a773fd4c0bd](https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/726445/0619f950-c03a-4d72-a878-70b1f1f2afdf)

2. Click "Download Profile" button on the website that the code opens, and confirm with "Allow" button on the dialog that pops up after that
3. Follow the instructions on the website to install the provisioning profile – go to Settings and click "Profile Downloaded", then click "Install" on the dialog. If the "Profile downloaded" doesn't show on the main Settings screen, you may see it under "General" > "VPN & Device Management".
4. The above steps will register your device with provisioning profile, after this step you will need to wait for us to create a new development client build that you'll be able to install on your device.

### For Android emulator

1. Download Development Client build [from this link](https://expo.dev/artifacts/eas/hSt7Y1YYW3yUggD5D9z6ay.apk)
2. Launch Android emulator on your computer
3. Drag and drop the downloaded `.apk` file onto emulator

### For Android device

1. Scan this QR code on your device:

![https://expo.dev/artifacts/eas/hSt7Y1YYW3yUggD5D9z6ay.apk](https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/726445/e13906a5-f782-4cd5-96f9-3ded5239ddd9)

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
yarn start
```

4. The above step will print instructions on how to launch the app on phone or simulator. For iOS simulator you'll need to press "i", for Android press "a", and if you'd like to run the app on a physical device you'll need to scan the QR code that will be displayed on the command line output.

## Next step

**Go to: [Circle Gestures](./src/lessons/CircleGestures/)**
