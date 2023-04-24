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

1. Download Development Client build [from this link](TBD)
2. Extract `appjsworkshop.app` file from the downloaded archive
3. Launch your iOS simulator
4. Drag and drop the `.app` file onto the simulator

### For iOS device

1. Scan the QR code below with your iOS phone:

![https://expo.dev/accounts/kmagiera/projects/appjs-workshop/builds/eb4c78ce-0f05-4230-8784-0eef2fe27a69](https://user-images.githubusercontent.com/726445/172498858-006a0e3e-b3a7-4c66-9825-2a7494959f08.png)

2. Click "install" button on the website that the code opens, and confirm with "install" button on the dialog that pops up after that
3. After app installation is completed navigate to "Settings" > "General" > "VPN & Device Management" section
4. Tap "650 INDUSTRIES INC." record in the "ENTERPRISE APP" section
5. Tap "Trust 650 INDUSTRIES INC." on the following page and confirm the selection when prompted
6. Make sure you can now launch "appjs-workshop" app installed on your phone

### For Android emulator

1. Download Development Client build [from this link](TBD)
2. Launch Android emulator on your computer
3. Drag and drop the downloaded `.apk` file onto emulator

### For Android device

1. Scan this QR code on your device:

![https://expo.dev/accounts/kmagiera/projects/appjs-workshop/builds/9b3a85c7-a39a-4872-b392-e3b7fa8e173](https://user-images.githubusercontent.com/726445/172498765-5bcfcb5b-cd7e-4619-be24-30056f5dbc0e.png)

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

4. The above step will print instructions on how to launch the app on phone or simulator. For iOS siulator you'll need to press "i", for Android press "a", and if you'd like to run the app on a physical device you'll need to scan the QR code that will be displayed on the command line output.

## Next step

**Go to: [Circle Gestures](./src/lessons/CircleGestures/)**
