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

- The route button opens Google Maps directions for the entered origin and destination. Google Maps provides current route options; an embedded map is not shown inside the app.
- Voice recognition fills the transcript preview. Use **Use this text** to put the recognized phrase into the first empty route field.
- Google Maps directions open through a URL and require no API key in this app. No embedded map, ride-hailing service, or Supabase integration is connected.

## Next steps

1. Improve spoken-place parsing so a phrase like “Dhone nunchi Hyderabad vellali” fills both route fields.
2. Consider an embedded map and in-app route details if a maps provider/API key is configured.
3. Add optional text-to-speech responses and route alternatives.

## Security

Do not commit API keys, access tokens, passwords, or personal data.