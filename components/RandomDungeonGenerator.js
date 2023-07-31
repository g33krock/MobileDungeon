import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import wallImage from "../assets/wallblock.png";
import playerImage from "../assets/hero.png";
import goblinImage from "../assets/goblin.png";
import dragonImage from "../assets/dragon.png";
import skeletonImage from "../assets/skeleton.png";
import lichImage from "../assets/lich.png";
import werewolfImage from "../assets/werewolf.png";
import cerebrusImage from "../assets/cerebrus.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const cellSize = 32;

const config = {
  dungeon: {
    width: Math.floor(screenWidth / cellSize),
    height: Math.floor(screenHeight / cellSize),
    steps: 800,
  },
};

const specialTreasures = [
  "Arcane Armor",
  "Ice Armor",
  "Fire Armor",
  "Aura of Vengeance",
  "Aura of Protection",
  "Aura of Life",
  "Balanced Stance",
  "Aggressive Stance",
  "Defensive Stance",
  "Heroic Strike",
  "Poisoned Blade",
  "Intercede",
  "Retribution",
  "Major Heal",
  "Flurry",
  "Shield Damage Residue",
  "Siphon Life",
  "Master Plan",
  "Fire Illusion",
  "Bash",
  "Demoralize",
  "Empower",
  "Fireball",
  "Pacify",
  "Brain Freeze",
  "Iceball",
  "Feedback",
  "Cripple",
  "Holy Smite",
  "Immolation Barrier",
  "Ice Illusion",
  "Incorporeal Mist",
  "Heat Mirage",
  "Share Burden",
  "Intimidating Strike",
  "Commanding Shout",
  "Smoke Bomb",
  "Humility",
  "Blessing of Vengeance",
  "Intercede",
  "Vanish",
  "Dual Wield",
  "Hamstring",
  "Divine Shield",
  "Fear",
  "Diffuse",
  "Blessing of Protection",
  "Shield Residue",
  "Poison Trap",
];

const commonTreasures = [
  "Spell Block",
  "Shield Block",
  "Fade",
  "Poison",
  "Preparation",
  "Stealth",
  "Illusion",
  "Stab",
  "Heal",
  "Arcane Bolt",
  "Blessing of Balance",
  "Mirror Shield",
  "Smite",
  "Barrier",
  "Buff",
  "Taunt",
  "Calm",
  "Compel",
  "Strike",
  "Retreat",
  "Spell Block",
  "Shield Block",
  "Fade",
  "Poison",
  "Preparation",
  "Stealth",
  "Illusion",
  "Stab",
  "Heal",
  "Arcane Bolt",
  "Blessing of Balance",
  "Mirror Shield",
  "Smite",
  "Barrier",
  "Buff",
  "Taunt",
  "Calm",
  "Compel",
  "Strike",
  "Retreat",
];

const styles = {
  dungeon: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: { color: "white", fontSize: 12 },
  empty: { backgroundColor: "black" },
  wall: { backgroundColor: "grey" },
  floor: { backgroundColor: "brown" },
  door: { backgroundColor: "green" },
  player: { backgroundColor: "blue" },
};

function addWalls(dungeon) {
  const height = dungeon.length;
  const width = dungeon[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (dungeon[y][x].type === 2) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;

            if (
              ny >= 0 &&
              ny < height &&
              nx >= 0 &&
              nx < width &&
              dungeon[ny][nx].type === 0
            ) {
              dungeon[ny][nx] = { type: 1 };
            }
          }
        }
      }
    }
  }
}

export function generateDungeon(width, height, steps) {
  let dungeon = Array(height)
    .fill(null)
    .map(() => Array(width).fill({ type: 0, monster: null, treasure: null }));

  let x = Math.floor(width / 2);
  let y = Math.floor(height / 2);
  dungeon[y][x] = { type: 2, monster: null, treasure: null };

  for (let i = 0; i < steps; i++) {
    const direction = Math.floor(Math.random() * 4);
    switch (direction) {
      case 0:
        x++;
        break;
      case 1:
        y++;
        break;
      case 2:
        x--;
        break;
      case 3:
        y--;
        break;
    }
    x = Math.min(Math.max(x, 1), width - 2);
    y = Math.min(Math.max(y, 1), height - 2);
    if (dungeon[y][x].type === 0) {
      dungeon[y][x] = { type: 2, monster: null, treasure: null };
    }
  }
  addWalls(dungeon);
  return dungeon;
}

export function populateDungeonWithMonsters(dungeon, monsters) {
  const isSafeToPlaceMonster = (dungeon, x, y) => {
    const height = dungeon.length;
    const width = dungeon[0].length;
    
    if (
      y >= 0 &&
      y < height &&
      x >= 0 &&
      x < width &&
      dungeon[y][x].monster !== null
    ) {
      return false;
    }

    return true;
  };

  for (let y = 0; y < dungeon.length; y++) {
    for (let x = 0; x < dungeon[y].length; x++) {
      if (dungeon[y][x].type === 2 && isSafeToPlaceMonster(dungeon, x, y)) {
        if (monsters.length > 0 && Math.random() < 0.1) {
          dungeon[y][x].monster = monsters.pop();
        }
      }
    }
  }
}

export function placePlayerOnBottomLeftFloor(dungeon) {
  const height = dungeon.length;
  const width = dungeon[0].length;

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      if (dungeon[y][x].type === 2) {
        return {x, y}; 
      }
    }
  }
  throw new Error('No floor tile found to place the player.');
}





export function Dungeon({
  dungeonData,
  playerPosition,
  onTilePress,
  onCellDetails,
}) {
  const [localDungeonData, setLocalDungeonData] = useState(dungeonData);

  useEffect(() => {
    setLocalDungeonData(dungeonData);
  }, [dungeonData]);

  const handleTilePress = (x, y) => {
    onTilePress(x, y);
  };

  return (
    <View style={styles.dungeon}>
      {localDungeonData.map((row, y) =>
        row.map((cell, x) => {
          const tileID = `tile-${x}-${y}`;
          const isPlayer = x === playerPosition.x && y === playerPosition.y;
          const isInPlayerRange =
            Math.abs(x - playerPosition.x) <= 2 &&
            Math.abs(y - playerPosition.y) <= 2;

          let cellStyle;
          let CellComponent = TouchableOpacity;
          let extraProps = {};

          if (isInPlayerRange) {
            switch (cell.type) {
              case 1:
                cellStyle = styles.wall;
                CellComponent = ImageBackground;
                extraProps = {
                  resizeMode: "cover",
                  source: wallImage,
                };
                break;
              case 2:
                cellStyle = styles.floor;
                if (isPlayer) {
                  CellComponent = ImageBackground;
                  extraProps = {
                    resizeMode: "cover",
                    source: playerImage,
                  };
                } else if (cell.monster === "goblin") {
                  CellComponent = ImageBackground;
                  extraProps = {
                    resizeMode: "cover",
                    source: goblinImage,
                  };
                } else if (cell.monster === "dragon") {
                  CellComponent = ImageBackground;
                  extraProps = {
                    resizeMode: "cover",
                    source: dragonImage,
                  };
                } else if (cell.monster === "skeleton") {
                  CellComponent = ImageBackground;
                  extraProps = {
                    resizeMode: "cover",
                    source: skeletonImage,
                  };
                } else if (cell.monster === "lich") {
                  CellComponent = ImageBackground;
                  extraProps = {
                    resizeMode: "cover",
                    source: lichImage,
                  };
                } else if (cell.monster === "werewolf") {
                  CellComponent = ImageBackground;
                  extraProps = {
                    resizeMode: "cover",
                    source: werewolfImage,
                  };
                } else if (cell.monster === "cerebrus") {
                  CellComponent = ImageBackground;
                  extraProps = {
                    resizeMode: "cover",
                    source: cerebrusImage,
                  };
                }
                break;
              case 3:
                cellStyle = styles.floor;
                if (isPlayer) {
                  CellComponent = ImageBackground;
                  extraProps = {
                    resizeMode: "cover",
                    source: playerImage,
                  };
                }
                break;
              default:
                cellStyle = styles.empty;
            }
          } else {
            cellStyle = styles.empty;
          }

          return (
            <TouchableOpacity
              key={tileID}
              onPress={() => {
                handleTilePress(x, y);
                if (cell.monster) {
                  onCellDetails(cell.monster, cell.treasure);
                }
              }}
              disabled={cell.type === 1}
              style={[styles.cell, cellStyle]}
            >
              <CellComponent
                key={tileID}
                onPress={() => {
                  handleTilePress(x, y);
                  if (cell.monster) {
                    onCellDetails(cell.monster, cell.treasure);
                  }
                }}
                disabled={cell.type === 1}
                style={[styles.cell, cellStyle]}
                {...extraProps}
              />
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}
