# Ezpz Crypto Price Alert

A React Native mobile application for tracking cryptocurrency prices and setting price alerts using the CoinGecko API.


<img width="300" height="650" alt="Simulator Screenshot - iPhone 16 Pro - 2026-01-12 at 01 20 42" src="https://github.com/user-attachments/assets/4b31f71c-8fb2-4706-a82a-f0d5f02203c7" />
<img width="300" height="650" alt="Simulator Screenshot - iPhone 16 Pro - 2026-01-12 at 01 19 05" src="https://github.com/user-attachments/assets/9d3d371b-0493-491a-b257-d80ae871fe9e" />
<img width="300" height="650" alt="Simulator Screenshot - iPhone 16 Pro - 2026-01-12 at 01 18 59" src="https://github.com/user-attachments/assets/d7f708b2-8f0f-4cf3-bf09-7c62af72d11a" />
<img width="300" height="650" alt="Simulator Screenshot - iPhone 16 Pro - 2026-01-12 at 01 18 50" src="https://github.com/user-attachments/assets/6fb6ca5f-9ade-441e-b8f0-fe98e34f69ba" />
<img width="300" height="650" alt="Simulator Screenshot - iPhone 16 Pro - 2026-01-12 at 01 18 42" src="https://github.com/user-attachments/assets/bbc70f15-b411-4d7a-a82f-286454984533" />
<img width="300" height="650" alt="Simulator Screenshot - iPhone 16 Pro - 2026-01-12 at 01 18 32" src="https://github.com/user-attachments/assets/81cadfbb-6b86-4a09-8674-87608a586a5d" />
<img width="300" height="650" alt="Simulator Screenshot - iPhone 16 Pro - 2026-01-12 at 01 18 28" src="https://github.com/user-attachments/assets/4501dcf7-b88a-498a-9c28-790fdfa3d26f" />
<img width="300" height="650" alt="Simulator Screenshot - iPhone 16 Pro - 2026-01-12 at 01 18 21" src="https://github.com/user-attachments/assets/919788d8-140b-4c64-b3bc-63c33f64cc76" />




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

