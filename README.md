# Ezpz Crypto Price Alert

A React Native mobile application for tracking cryptocurrency prices and setting price alerts using the CoinGecko API.

## Features

- 📊 Real-time cryptocurrency price tracking
- 🔔 Price alert notifications
- 💾 Local storage for alerts and settings
- 📱 Support for both Android and iOS
- 🎨 Modern and intuitive UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on Android:
```bash
npm run android
```

4. Run on iOS:
```bash
npm run ios
```

## Project Structure

```
EzpzCryptoPriceAlert/
├── src/
│   ├── api/
│   │   └── coinGeckoApi.js      # CoinGecko API integration
│   ├── components/
│   │   └── CryptoCard.js        # Reusable crypto card component
│   ├── screens/
│   │   ├── HomeScreen.js        # Main screen with crypto list
│   │   ├── SettingsScreen.js    # App settings
│   │   └── AlertScreen.js       # Manage price alerts
│   └── utils/
│       ├── storage.js           # AsyncStorage helpers
│       └── formatters.js        # Currency and number formatters
├── App.js                        # Main app entry with navigation
├── package.json
└── app.json                      # Expo configuration
```

## API Usage

The app uses the CoinGecko API (free tier) to fetch cryptocurrency data. No API key is required for basic usage.

## Dependencies

- **expo**: React Native framework
- **@react-navigation/native**: Navigation library
- **axios**: HTTP client for API calls
- **@react-native-async-storage/async-storage**: Local storage

## License

MIT

