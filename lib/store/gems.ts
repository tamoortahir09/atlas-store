import type { GemPackage } from './types';
import { getGemProductId } from './productIds';

const gemConfigs: GemPackage[] = [
  {
    id: 1,
    name: "80 Gems",
    amount: 80,
    bonus: 0,
    price: 0.99,
    secondaryTime: 3600,
    tags: ["3x", "5x"],
    payNowProductId: getGemProductId('starter')
  },
  {
    id: 2,
    name: "1,000 Gems",
    amount: 1000,
    bonus: 100,
    price: 9.99,
    secondaryTime: 7200,
    tags: ["3x", "5x", "10x"],
    payNowProductId: getGemProductId('basic')
  },
  {
    id: 3,
    name: "2,200 Gems",
    amount: 2200,
    bonus: 400,
    price: 19.99,
    secondaryTime: 10800,
    tags: ["3x", "5x", "10x"],
    valueType: 'popular',
    payNowProductId: getGemProductId('premium')
  },
  {
    id: 4,
    name: "4,500 Gems",
    amount: 4500,
    bonus: 1000,
    price: 39.99,
    secondaryTime: 14400,
    tags: ["5x", "10x", "Premium"],
    valueType: 'best',
    payNowProductId: getGemProductId('deluxe')
  },
  {
    id: 5,
    name: "16,500 Gems",
    amount: 16500,
    bonus: 4500,
    price: 99.99,
    secondaryTime: 21600,
    tags: ["10x", "Premium", "VIP"],
    valueType: 'max',
    payNowProductId: getGemProductId('ultimate')
  }
];

export const gemConfigurations: GemPackage[] = gemConfigs;

export function getGemConfig(id: number) {
  return gemConfigurations.find(gem => gem.id === id);
}

export function getAllGemConfigs() {
  return gemConfigurations;
} 