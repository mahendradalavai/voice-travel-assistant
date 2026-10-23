# Voice Travel Assistant

A simple, voice-first travel assistant prototype built with React Native and Expo. The interface is designed to be calm, uncluttered, accessible to local users, and Telugu-friendly.

## First version

- Telugu / Indian English interface toggle
- Starting point and destination fields
- Large microphone control and speech transcript preview
- Simple route form validation
- Soft, nature-inspired green palette and large touch targets

## Tech stack

- React Native + Expo
- TypeScript
- `expo-speech-recognition` for native speech recognition

## Run locally

Use a recent Node.js LTS release, then install dependencies:

```bash
npm install
npx expo install --check
npx expo run:android
```

The speech-recognition package uses native Android/iOS capabilities. **Expo Go is not sufficient for this feature**; build and run a development client with the native module included. On Android, enable microphone permission when prompted. Speech recognition availability and supported languages depend on the device's installed speech services.

For a development server after the native app has been built:

```bash
npx expo start --dev-client
```

## Current prototype limitations

- The route button validates and previews the entered places; it does not fetch real directions yet.
- Voice recognition fills the transcript preview. Use **Use this text** to put the recognized phrase into the first empty route field.
- No maps provider, ride-hailing service, API key, or Supabase integration is connected in this version.

## Next steps

1. Improve spoken-place parsing so a phrase like “Dhone nunchi Hyderabad vellali” fills both route fields.
2. Add a maps/directions provider after deciding on the required coverage and budget.
3. Add optional text-to-speech responses and route alternatives.

## Security

Do not commit API keys, access tokens, passwords, or personal data.