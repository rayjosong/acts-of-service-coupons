import React from 'react';
import {
  Coffee,
  Utensils,
  ShoppingCart,
  Package,
  Users,
  Tv,
  Gamepad2,
  Inbox,
  Star,
  ShoppingBag,
  HeartHandshake,
  Dices,
  History
} from 'lucide-react';

export const iconMap: Record<string, React.ElementType> = {
  'coffee': Coffee,
  'utensils': Utensils,
  'shopping-cart': ShoppingCart,
  'package': Package,
  'users': Users,
  'tv': Tv,
  'gamepad-2': Gamepad2,
  'inbox': Inbox,
  'star': Star,
  'shopping-bag': ShoppingBag,
  'heart-handshake': HeartHandshake,
  'dices': Dices,
  'history': History,
  // Add more icon mappings as needed
};

export const getIcon = (iconName: string): React.ElementType => {
  const icon = iconMap[iconName];
  if (!icon) {
    console.warn(`Icon "${iconName}" not found in iconMap, using default Star icon`);
    return Star;
  }
  return icon;
};