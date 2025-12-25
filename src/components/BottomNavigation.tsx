import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../utils/colors';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface BottomNavigationProps {
  navigation: {
    navigate: (route: string) => void;
  };
  currentRoute: string;
}

const BottomNavigation = ({ navigation, currentRoute }: BottomNavigationProps) => {
  const navItems: NavItem[] = [
    { id: 'Home', label: 'Markets', icon: '📊' },
    { id: 'Alerts', label: 'Alerts', icon: '🔔' },
    { id: 'Settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = currentRoute === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.id)}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text
              style={[
                styles.label,
                isActive && styles.labelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingBottom: 20,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.binanceYellow,
    fontWeight: '600',
  },
});

export default BottomNavigation;

