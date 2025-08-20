import type { Rank, TagInventory, InventoryItem } from '../../types/index';
import { getRankProductId } from './productIds';

// Helper function to create inventory item
function createItem(position: number, shortname: string, quantity: number): InventoryItem {
  return { position, shortname, quantity };
}

// Helper function to create tag inventory with explicit weapons and resources sections
function createTagInventory(tag: string, weapons: InventoryItem[], resources: InventoryItem[]): TagInventory {
  return { 
    tag, 
    weapons: weapons,
    resources: resources 
  };
}

// Helper function to create tag configuration
function createTagConfiguration(
  tag: string,
  teleportTimer: number, // 1
  homeAmount: number, // 2
  loadoutCoolDown: number, // 3
  loadoutTimer: number, // 4
  teleportLimit: number, // 5
  rpBoost: number, // 6
  rpMultiplier: number, // 7
  extraGems: number, // 8
  queueSkip: boolean, // 1
  hqmUpgrade: boolean, // 2
  craftUncraftable: boolean, // 3
  customColor: boolean, // 4
  kits: boolean // 5
) {
  return {
    tag,
    teleportTimer,
    homeAmount,
    loadoutCoolDown,
    loadoutTimer,
    teleportLimit,
    rpBoost,
    rpMultiplier,
    extraGems,
    queueSkip,
    hqmUpgrade,
    craftUncraftable,
    customColor,
    kits
  };
}

// Item display name mapping
const itemDisplayNames: { [shortname: string]: string } = {
  'rifle.ak': 'AK-47 Assault Rifle',
  'rifle.bolt': 'Bolt Action Rifle',
  'pistol.m92': 'M92 Pistol',
  'lmg.m249': 'M249 Light Machine Gun',
  'ammo.rifle': 'Rifle Ammunition',
  'ammo.pistol': 'Pistol Ammunition',
  'metal.facemask': 'Metal Facemask',
  'metal.plate.torso': 'Metal Chestplate',
  'roadsign.kilt': 'Road Sign Kilt',
  'explosive.timed': 'Timed Explosive Charge',
  'wood': 'Wood',
  'stones': 'Stone',
  'metal.fragments': 'Metal Fragments',
  'cloth': 'Cloth'
};

// Helper function to create item with display name
function createItemWithDisplayName(position: number, shortname: string, quantity: number) {
  return {
    position,
    shortname,
    displayName: itemDisplayNames[shortname] || shortname,
    quantity
  };
}

// Rank configurations
const rankConfigs: Rank[] = [
  {
    id: getRankProductId(1) || "276430864861114368", // PayNow ID for position 1
    position: 1,
    price: 11.99, // Fallback price, will be overridden by PayNow
    name: "1",
    displayName: "VIP", // Fallback display name, will be overridden by PayNow
    benefits: ["Basic teleportation", "Home system", "Small inventory boost"],
    containerColor: "bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50",
    valueColor: "text-gray-100",
    description: "Basic rank with essential features",
    threePoints: "• Basic teleportation • Home system • Small inventory boost",
    nameColor: "text-gray-100",
    tags: ["3x", "5x", "10x"],
    configurations: [
      createTagConfiguration("3x", 30, 1, 60, 60, 5, 0, 1, 100, true, false, false, true, false),
      createTagConfiguration("5x", 25, 2, 50, 50, 8, 10, 1.2, 150, true, false, false, true, false),
      createTagConfiguration("10x", 20, 3, 45, 45, 12, 15, 1.5, 200, true, false, false, true, false)
    ],
    inventories: [
      createTagInventory("3x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 1)
        ],
        // Resources section
        [
          createItem(1, "ammo.rifle", 100), 
          createItem(2, "wood", 1000)
        ]
      ),
      createTagInventory("5x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 1)
        ],
        // Resources section
        [
          createItem(1, "ammo.rifle", 150), 
          createItem(2, "wood", 1500)
        ]
      ),
createTagInventory("10x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 3), 
          createItem(2, "hmlmg", 2), 
          createItem(3, "rifle.l96", 2),
          createItem(4, "rifle.bolt", 1), 
          createItem(5, "ammo.rifle", 1024),
          createItem(6, "largemedkit", 20), 
          createItem(7, "barricade.wood.cover", 20),
          createItem(8, "syringe.medical", 40), 
          createItem(9, "sleepingbag", 5),
          createItem(10, "metal.facemask", 1), 
          createItem(11, "hoodie", 1),
          createItem(12, "roadsign.kilt", 1), 
          createItem(13, "metal.plate.torso", 1),
          createItem(14, "tactical.gloves", 1), 
          createItem(15, "pants", 1),
          createItem(16, "shoes.boots", 1) 
        ],
        // Resources section
        [
          createItem(1, "sulfur.ore", 200000), 
          createItem(2, "sulfur.ore", 100000), 
          createItem(3, "wood", 500000), 
          createItem(4, "stones", 350000),
          createItem(5, "metal.ore", 325000),
          createItem(6, "metal.fragments", 85000),
          createItem(7, "hq.metal.ore", 6500),
          createItem(8, "metal.refined", 2500),
          createItem(9, "scrap", 10000),
          createItem(10, "lowgradefuel", 35000),
          createItem(11, "cloth", 20000),
          createItem(12, "leather", 20000),
          createItem(13, "charcoal", 150000)
        ]
      )
    ]
  },
  {
    id: getRankProductId(2) || "276430881923543040", // PayNow ID for position 2
    position: 2,
    price: 22.99, // Fallback price, will be overridden by PayNow
    name: "2",
    displayName: "Prime", // Fallback display name, will be overridden by PayNow
    benefits: ["Faster Teleports", "Multiple Homes", "Queue Priority", "10 Gems/Hour"],
    containerColor: "bg-gradient-to-b from-blue-800 to-blue-900 border border-blue-700/50",
    valueColor: "text-blue-100",
    description: "Enhanced gameplay with better perks",
    threePoints: "• Faster teleports • Multiple homes • Queue priority • 10 Gems/Hour",
    nameColor: "text-blue-100",
    tags: ["3x", "5x", "10x"],
    configurations: [
      createTagConfiguration("3x", 0, 0, 43200, 0, 0, 0, 0, 10, true, false, false, true, true),
      createTagConfiguration("5x", 12, 6, 64800, 0, 0, 0, 3, 10, true, false, false, true, true),
      createTagConfiguration("10x", 14, 5, 64800, 0, 0, 0, 3, 10, true, false, false, true, true)
    ],
    inventories: [
      createTagInventory("3x", 
        // Weapons section
        [
          createItem(1, "smg.thompson", 1), 
          createItem(2, "ammo.pistol", 128), 
          createItem(3, "barricade.wood.cover", 5),
          createItem(4, "knife.combat", 1),
          createItem(5, "syringe.medical", 6),
          createItem(6, "bandage", 3),
          createItem(7, "coffeecan.helmet", 1),
          createItem(8, "hoodie", 1),
          createItem(9, "roadsign.kilt", 1),
          createItem(10, "roadsign.jacket", 1),
          createItem(11, "tactical.gloves", 1),
          createItem(12, "pants", 1),
          createItem(13, "shoes.boots", 1)
        ],
        // Resources section
        [
          createItem(1, "sulfur.ore", 4000), 
          createItem(2, "sulfur", 2000), 
          createItem(3, "wood", 25000), 
          createItem(4, "stones", 10000),
          createItem(5, "metal.ore", 4000),
          createItem(6, "metal.fragments", 2500),
          createItem(7, "hq.metal.ore", 80),
          createItem(8, "metal.refined", 40),
          createItem(9, "scrap", 800),
          createItem(10, "lowgradefuel", 1000),
          createItem(11, "cloth", 1000),
          createItem(12, "leather", 500),
          createItem(13, "gears", 4),
          createItem(14, "techparts", 4),
          createItem(15, "smgbody", 3),
          createItem(16, "roadsigns", 4),
          createItem(17, "sewingkit", 12),
          createItem(18, "metalspring", 5),
        ]
      ),
      createTagInventory("5x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 4),
          createItem(2, "rifle.l96", 1),
          createItem(3, "lmg.m249", 1), 
          createItem(4, "ammo.rifle", 1536),
          createItem(5, "largemedkit", 6), 
          createItem(6, "barricade.wood.cover", 10),
          createItem(7, "syringe.medical", 24),
          createItem(8, "bandage", 1),
          createItem(9, "sleepingbag", 5),
          createItem(10, "metal.facemask", 1), 
          createItem(11, "hoodie", 1),
          createItem(12, "roadsign.kilt", 1), 
          createItem(13, "metal.plate.torso", 1),
          createItem(14, "tactical.gloves", 1), 
          createItem(15, "pants", 1),
          createItem(16, "shoes.boots", 1) 
        ],
        // Resources section
        [
          createItem(1, "sulfur.ore", 100000), 
          createItem(2, "sulfur", 50000), 
          createItem(3, "wood", 350000), 
          createItem(4, "stones", 250000),
          createItem(5, "metal.ore", 10000),
          createItem(6, "metal.fragments", 20000),
          createItem(7, "hq.metal.ore", 8000),
          createItem(8, "metal.refined", 2000),
          createItem(9, "scrap", 6000),
          createItem(10, "lowgradefuel", 30000),
          createItem(11, "cloth", 12500),
          createItem(12, "leather", 12500)
        ]
      ),
      createTagInventory("10x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 3), 
          createItem(2, "hmlmg", 2), 
          createItem(3, "rifle.l96", 2),
          createItem(4, "rifle.bolt", 1), 
          createItem(5, "ammo.rifle", 1024),
          createItem(6, "largemedkit", 20), 
          createItem(7, "barricade.wood.cover", 20),
          createItem(8, "syringe.medical", 40), 
          createItem(9, "sleepingbag", 5),
          createItem(10, "metal.facemask", 1), 
          createItem(11, "hoodie", 1),
          createItem(12, "roadsign.kilt", 1), 
          createItem(13, "metal.plate.torso", 1),
          createItem(14, "tactical.gloves", 1), 
          createItem(15, "pants", 1),
          createItem(16, "shoes.boots", 1) 
        ],
        // Resources section
        [
          createItem(1, "sulfur.ore", 200000), 
          createItem(2, "sulfur", 100000), 
          createItem(3, "wood", 500000), 
          createItem(4, "stones", 350000),
          createItem(5, "metal.ore", 325000),
          createItem(6, "metal.fragments", 85000),
          createItem(7, "hq.metal.ore", 6500),
          createItem(8, "metal.refined", 2500),
          createItem(9, "scrap", 10000),
          createItem(10, "lowgradefuel", 35000),
          createItem(11, "cloth", 20000),
          createItem(12, "leather", 20000),
          createItem(13, "charcoal", 150000)
        ]
      )
    ]
  },
  {
    id: getRankProductId(3) || "276430881357312000", // PayNow ID for position 3
    position: 3,
    price: 35.99, // Fallback price, will be overridden by PayNow
    name: "3",
    displayName: "Mythic", // Fallback display name, will be overridden by PayNow
    benefits: ["Faster Teleports","Multiple Homes", "Queue Priority", "15 Gems/Hour"],
    containerColor: "bg-gradient-to-b from-purple-800 to-purple-900 border border-purple-700/50",
    valueColor: "text-purple-100",
    description: "Premium features for serious players",
    threePoints: "• Better Resources • Extended limits • 15 Gems/Hour",
    nameColor: "text-purple-100",
    tags: ["3x", "5x", "10x"],
    configurations: [
      createTagConfiguration("3x", 0, 0, 43200, 0, 0, 0, 0, 15, true, false, false, true, true),
      createTagConfiguration("5x", 10, 9, 64800, 0, 0, 0, 4, 15, true, false, false, true, true),
      createTagConfiguration("10x", 10, 7, 64800, 0, 0, 0, 4, 15, true, false, false, true, true)
    ],
    inventories: [
      createTagInventory("3x", 
        // Weapons section
        [
          createItem(1, "smg.mp5", 1), 
          createItem(2, "ammo.pistol", 256), 
          createItem(3, "largemedkit", 3),
          createItem(4, "barricade.wood.cover", 10),
          createItem(5, "syringe.medical", 12),
          createItem(6, "bandage", 6),
          createItem(7, "coffeecan.helmet", 1),
          createItem(8, "hoodie", 1),
          createItem(9, "roadsign.kilt", 1),
          createItem(10, "roadsign.jacket", 1),
          createItem(11, "tactical.gloves", 1),
          createItem(12, "pants", 1),
          createItem(13, "shoes.boots", 1)
        ],
        // Resources section
        [
          createItem(1, "sulfur.ore", 4000), 
          createItem(2, "sulfur", 2000), 
          createItem(3, "wood", 30000), 
          createItem(4, "stones", 15000),
          createItem(5, "metal.ore", 6000),
          createItem(6, "metal.fragments", 4000),
          createItem(7, "hq.metal.ore", 150),
          createItem(8, "metal.refined", 100),
          createItem(9, "scrap", 1500),
          createItem(10, "lowgradefuel", 1500),
          createItem(11, "cloth", 2000),
          createItem(12, "leather", 1000),
          createItem(13, "gears", 12),
          createItem(14, "techparts", 8),
          createItem(15, "smgbody", 10),
          createItem(16, "roadsigns", 12),
          createItem(17, "sewingkit", 20),
          createItem(18, "metalspring", 12),
          createItem(19, "metalpipe", 20)
        ]
      ),
      createTagInventory("5x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 4), 
          createItem(2, "hmlmg", 1), 
          createItem(3, "lmg.m249", 1), 
          createItem(4, "ammo.rifle", 1536),
          createItem(5, "largemedkit", 8), 
          createItem(6, "barricade.wood.cover", 10),
          createItem(7, "syringe.medical", 24), 
          createItem(8, "bandage", 12),
          createItem(9, "sleepingbag", 5),
          createItem(10, "metal.facemask", 1), 
          createItem(11, "hoodie", 1),
          createItem(12, "roadsign.kilt", 1), 
          createItem(13, "metal.plate.torso", 1),
          createItem(14, "tactical.gloves", 1), 
          createItem(15, "pants", 1),
          createItem(16, "shoes.boots", 1)
        ],
        // Resources section
        [
          createItem(1, "sulfur.ore", 180000), 
          createItem(2, "sulfur", 90000), 
          createItem(3, "wood", 455500), 
          createItem(4, "stones", 325000),
          createItem(5, "metal.ore", 130000),
          createItem(6, "metal.fragments", 26000),
          createItem(7, "hq.metal.ore", 10400),
          createItem(8, "metal.refined", 2600),
          createItem(9, "scrap", 10000),
          createItem(10, "lowgradefuel", 39000),
          createItem(11, "cloth", 16250),
          createItem(12, "leather", 16250),
          createItem(13, "charcoal", 125000)
        ]
      ),
      createTagInventory("10x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 4), 
          createItem(2, "hmlmg", 3),
          createItem(3, "rifle.l96", 3),
          createItem(4, "lmg.m249", 1),
          createItem(5, "ammo.rifle", 1024),
          createItem(6, "largemedkit", 20), 
          createItem(7, "barricade.wood.cover", 20),
          createItem(8, "syringe.medical", 40), 
          createItem(9, "sleepingbag", 5),
          createItem(10, "metal.facemask", 1),
          createItem(11, "hoodie", 1),
          createItem(12, "roadsign.kilt", 1),
          createItem(13, "metal.plate.torso", 1),
          createItem(14, "tactical.gloves", 1),
          createItem(15, "pants", 1)
        ],
        // Resources section
        [
            createItem(1, "sulfur.ore", 300000), 
            createItem(2, "sulfur", 135000), 
            createItem(3, "wood", 650000), 
            createItem(4, "stones", 450000),
            createItem(5, "metal.ore", 400000),
            createItem(6, "metal.fragments", 125000),
            createItem(7, "hq.metal.ore", 8500),
            createItem(8, "metal.refined", 4000),
            createItem(9, "scrap", 15000),
            createItem(10, "lowgradefuel", 50000),
            createItem(11, "cloth", 30000),
            createItem(12, "leather", 30000),
            createItem(13, "charcoal", 200000)
        ]
      )
    ]
  },
  {
    id: getRankProductId(4) || "276430880849805312", // PayNow ID for position 4
    position: 4,
    price: 44.99, // Fallback price, will be overridden by PayNow
    name: "4",
    displayName: "Vanguard", // Fallback display name, will be overridden by PayNow
    benefits: ["Faster Teleports","More Homes", "Premium kits", "20 Gems/Hour"],
    containerColor: "bg-gradient-to-b from-red-800 to-red-900 border border-red-700/50",
    valueColor: "text-red-100",
    description: "Top-tier rank with exclusive benefits",
    threePoints: "• Faster Teleports • HQM Upgrades • Premium kits • 20 Gems/Hour",
    nameColor: "text-red-100",
    tags: ["3x", "5x", "10x"],
    configurations: [
      createTagConfiguration("3x", 0, 0, 43200, 0, 0, 0, 0, 20, true, false, false, true, true),
      createTagConfiguration("5x", 10, 9, 64800, 0, 0, 0, 5, 20, true, true, true, true, true),
      createTagConfiguration("10x", 10, 9, 64800, 0, 0, 0, 5, 20, true, true, true, true, true)
    ],
    inventories: [
      createTagInventory("3x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 1), 
          createItem(2, "hmlmg", 1), 
          createItem(3, "ammo.rifle", 256), 
          createItem(4, "largemedkit", 6),
          createItem(5, "barricade.wood.cover", 10),
          createItem(6, "syringe.medical", 18),
          createItem(7, "metal.facemask", 1),
          createItem(8, "hoodie", 1),
          createItem(9, "roadsign.kilt", 1),
          createItem(10, "metal.plate.torso", 1),
          createItem(11, "tactical.gloves", 1),
          createItem(12, "pants", 1),
          createItem(13, "shoes.boots", 1)
        ],
        // Resources section
        [
          createItem(1, "sulfur.ore", 6000), 
          createItem(2, "sulfur", 3000), 
          createItem(3, "wood", 50000), 
          createItem(4, "stones", 25000),
          createItem(5, "metal.ore", 8000  ),
          createItem(6, "metal.fragments", 5000),
          createItem(7, "hq.metal.ore", 300),
          createItem(8, "metal.refined", 200),
          createItem(9, "scrap", 3000),
          createItem(10, "lowgradefuel", 2000),
          createItem(11, "cloth", 2000),
          createItem(12, "leather", 2000),
          createItem(13, "gears", 20),
          createItem(14, "techparts", 8),
          createItem(15, "riflebody", 4),
          createItem(16, "roadsigns", 20),
          createItem(17, "sewingkit", 40),
          createItem(18, "metalspring", 16),
          createItem(19, "metalpipe", 32)
        ]
      ),
      createTagInventory("5x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 6), 
          createItem(2, "hmlmg", 2),
          createItem(3, "rifle.l96", 2),
          createItem(4, "lmg.m249", 2),
          createItem(5, "ammo.rifle", 1536),
          createItem(6, "largemedkit", 8), 
          createItem(7, "barricade.wood.cover", 10),
          createItem(8, "syringe.medical", 24),
          createItem(9, "bandage", 12),
          createItem(10, "sleepingbag", 2),
          createItem(11, "metal.facemask", 1),
          createItem(12, "hoodie", 1),
          createItem(13, "roadsign.kilt", 1),
          createItem(14, "metal.plate.torso", 1),
          createItem(15, "tactical.gloves", 1),
          createItem(16, "pants", 1)
        ],
        // Resources section
        [
          createItem(1, "sulfur.ore", 180000), 
          createItem(2, "sulfur", 90000), 
          createItem(3, "wood", 455500), 
          createItem(4, "stones", 325000),
          createItem(5, "metal.ore", 130000),
          createItem(6, "metal.fragments", 26000),
          createItem(7, "hq.metal.ore", 10400),
          createItem(8, "metal.refined", 2600),
          createItem(9, "scrap", 10000),
          createItem(10, "lowgradefuel", 39000),
          createItem(11, "cloth", 16250),
          createItem(12, "leather", 16250),
          createItem(13, "charcoal", 125000),
          createItem(14, "techparts", 50),
          createItem(15, "riflebody", 50),
          createItem(16, "roadsigns", 150),
          createItem(17, "sewingkit", 200),
          createItem(18, "metalspring", 150),
          createItem(19, "metalpipe", 200),
          createItem(20, "gingerbreadsuit", 1)
        ]
      ),
      createTagInventory("10x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 5), 
          createItem(2, "hmlmg", 4),
          createItem(3, "rifle.l96", 4),
          createItem(4, "lmg.m249", 2),
          createItem(5, "ammo.rifle", 1536),
          createItem(6, "largemedkit", 24), 
          createItem(7, "barricade.wood.cover", 20),
          createItem(8, "syringe.medical", 40), 
          createItem(9, "sleepingbag", 5),
          createItem(10, "metal.facemask", 1),
          createItem(11, "hoodie", 1),
          createItem(12, "roadsign.kilt", 1),
          createItem(13, "metal.plate.torso", 1),
          createItem(14, "tactical.gloves", 1),
          createItem(15, "pants", 1)
        ],
        // Resources section
        [
          createItem(1, "sulfur.ore", 450000), 
          createItem(2, "sulfur", 185000), 
          createItem(3, "wood", 800000), 
          createItem(4, "stones", 650000),
          createItem(5, "metal.ore", 550000),
          createItem(6, "metal.fragments", 175000),
          createItem(7, "hq.metal.ore", 10000),
          createItem(8, "metal.refined", 5500),
          createItem(9, "scrap", 25000),
          createItem(10, "lowgradefuel", 85000),
          createItem(11, "cloth", 45000),
          createItem(12, "leather", 45000),
          createItem(13, "charcoal", 250000)
        ]
      )
    ]
  },
  {
    id: getRankProductId(5) || "276430880359071744", // PayNow ID for position 5
    position: 5,
    price: 84.99, // Fallback price, will be overridden by PayNow
    name: "5",
    displayName: "Champion", // Fallback display name, will be overridden by PayNow
    benefits: ["No cooldowns", "Unlimited access", "Exclusive perks", "30 Gems/Hour"],
    containerColor: "bg-gradient-to-b from-yellow-800 to-yellow-900 border-2 border-yellow-500/30",
    valueColor: "text-yellow-500",
    description: "Ultimate rank with all features unlocked",
    threePoints: "• No cooldowns • Unlimited access • Exclusive perks • 30 Gems/Hour",
    nameColor: "text-yellow-500",
    tags: ["3x", "5x", "10x"],
    configurations: [
      createTagConfiguration("3x", 0, 0, 43200, 0, 0, 0, 0, 30, true, true, true, true, true),
      createTagConfiguration("5x", 1, 28, 64800, 0, 0, 0, 7, 30, true, true, true, true, true),
      createTagConfiguration("10x", 1, 28, 64800, 0, 0, 0, 7, 30, true, true, true, true, true)
    ],
    inventories: [
      createTagInventory("3x", 
        // Weapons section
        [
          createItem(1, "lmg.m249", 1), 
          createItem(2, "rifle.l96", 1), 
          createItem(3, "ammo.rifle", 256), 
          createItem(4, "largemedkit", 6),
          createItem(5, "barricade.wood.cover", 10),
          createItem(6, "syringe.medical", 18),
          createItem(7, "metal.facemask", 1),
          createItem(8, "hoodie", 1),
          createItem(9, "roadsign.kilt", 1),
          createItem(10, "metal.plate.torso", 1),
          createItem(11, "tactical.gloves", 1),
          createItem(12, "pants", 1),
          createItem(13, "shoes.boots", 1)
        ],
        // Resources section
        [
          createItem(1, "sulfur.ore", 15000), 
          createItem(2, "sulfur", 5000), 
          createItem(3, "wood", 100000), 
          createItem(4, "stones", 50000),
          createItem(5, "metal.ore", 15000  ),
          createItem(6, "metal.fragments", 10000),
          createItem(7, "hq.metal.ore", 500),
          createItem(8, "metal.refined", 300),
          createItem(9, "scrap", 5000),
          createItem(10, "lowgradefuel", 3000),
          createItem(11, "cloth", 3000),
          createItem(12, "leather", 3000),
          createItem(13, "gears", 40),
          createItem(14, "techparts", 25),
          createItem(15, "riflebody", 10),
          createItem(16, "roadsigns", 40),
          createItem(17, "sewingkit", 60),
          createItem(18, "metalspring", 40),
          createItem(19, "metalpipe", 60)
        ]
      ),
      createTagInventory("5x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 10), 
          createItem(2, "hmlmg", 5),
          createItem(3, "rifle.l96", 5),
          createItem(4, "lmg.m249", 5),
          createItem(5, "ammo.rifle", 5000),
          createItem(6, "largemedkit", 30), 
          createItem(7, "barricade.wood.cover", 30),
          createItem(8, "syringe.medical", 50),
          createItem(9, "sleepingbag", 2),
          createItem(10, "metal.facemask", 1),
          createItem(11, "hoodie", 1),
          createItem(12, "roadsign.kilt", 1),
          createItem(13, "metal.plate.torso", 1),
          createItem(14, "tactical.gloves", 1),
          createItem(15, "pants", 1)
        ],
        // Resources section
        [
          createItem(1, "stones", 1000000),
          createItem(2, "wood", 1000000), 
          createItem(3, "charcoal", 500000),
          createItem(4, "cloth", 55000),
          createItem(5, "leather", 55000),
          createItem(6, "lowgradefuel", 85000),
          createItem(7, "metal.refined", 15000),
          createItem(8, "sulfur", 600000), 
          createItem(9, "metal.fragments", 250000),
          createItem(10, "scrap", 30000),
          createItem(11, "riflebody", 300),
          createItem(12, "techparts", 350),
          createItem(13, "roadsigns", 500),
          createItem(14, "sewingkit", 500),
          createItem(15, "metalspring", 400),
          createItem(16, "metalpipe", 500)
        ]
      ),
      createTagInventory("10x", 
        // Weapons section
        [
          createItem(1, "rifle.ak", 10), 
          createItem(2, "hmlmg", 5),
          createItem(3, "rifle.l96", 5),
          createItem(4, "lmg.m249", 5),
          createItem(5, "ammo.rifle", 5000),
          createItem(6, "largemedkit", 30), 
          createItem(7, "barricade.wood.cover", 30),
          createItem(8, "syringe.medical", 50),
          createItem(9, "sleepingbag", 2),
          createItem(10, "metal.facemask", 1),
          createItem(11, "hoodie", 1),
          createItem(12, "roadsign.kilt", 1),
          createItem(13, "metal.plate.torso", 1),
          createItem(14, "tactical.gloves", 1),
          createItem(15, "pants", 1)
        ],
        // Resources section
        [
          createItem(1, "stones", 1500000),
          createItem(2, "wood", 1500000), 
          createItem(3, "charcoal", 1000000),
          createItem(4, "cloth", 100000),
          createItem(5, "leather", 100000),
          createItem(6, "lowgradefuel", 125000),
          createItem(7, "metal.refined", 35000),
          createItem(8, "sulfur", 1200000), 
          createItem(9, "metal.fragments", 1000000),
          createItem(10, "scrap", 75000),
          createItem(11, "riflebody", 600),
          createItem(12, "techparts", 650),
          createItem(13, "roadsigns", 1000),
          createItem(14, "sewingkit", 1000),
          createItem(15, "metalspring", 750),
          createItem(16, "metalpipe", 750),
        ]
      )
    ]
  }
];

export const rankConfigurations: Rank[] = rankConfigs;

export function getRankConfig(id: string | number) {
  return rankConfigurations.find(rank => rank.id === id);
}

export function getAllRankConfigs() {
  return rankConfigurations.sort((a, b) => a.position - b.position);
} 