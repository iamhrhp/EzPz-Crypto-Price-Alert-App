# Ezpz Crypto Price Alert

A React Native mobile application for tracking cryptocurrency prices and setting price alerts using the CoinGecko API.

![photo_2025-12-26_00-15-18](https://github.com/user-attachments/assets/1bdcdadc-fd82-43ac-befb-cb3d02865465)

![photo_2025-12-26_00-15-22](https://github.com/user-attachments/assets/3a33008b-9aa1-4a44-ad83-cd415c58f4c6)

![photo_2025-12-26_00-15-26](https://github.com/user-attachments/assets/7ffeebe1-99bd-49b0-8548-1d4aabc16e45)

![photo_2025-12-26_00-15-29](https://github.com/user-attachments/assets/5676449b-07a7-44d0-8ad2-a493fb202f1b)

![photo_2025-12-26_00-15-34](https://github.com/user-attachments/assets/e2e6a267-fc14-4414-8148-6cdad4514f55)

![photo_2025-12-26_00-15-37](https://github.com/user-attachments/assets/d56378c4-71f3-4ea5-b127-b04efa334a52)

![photo_2025-12-26_00-15-39](https://github.com/user-attachments/assets/1df722ff-6f3e-47e4-98c1-d04a7f04e1eb)


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

