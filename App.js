import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Button,
} from "react-native";
import {
  Dungeon,
  generateDungeon,
  populateDungeonWithMonsters,
  placePlayerOnBottomLeftFloor
} from "./components/RandomDungeonGenerator";

const cellSize = 32;
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function App() {
  const [monster, setMonster] = useState(null);
  const [treasure, setTreasure] = useState(null);

  const [dungeon, setDungeon] = useState(() => {
    let initialDungeon = generateDungeon(
      Math.floor(screenWidth / cellSize),
      Math.floor(screenHeight / cellSize),
      1000
    );

    let monsters = [
      "skeleton",
      "skeleton",
      "skeleton",
      "skeleton",
      "skeleton",
      "goblin",
      "goblin",
      "goblin",
      "goblin",
      "goblin",
      "werewolf",
      "werewolf",
      "werewolf",
      "lich",
      "lich",
      "cerebrus",
      "dragon",
    ];
    
    populateDungeonWithMonsters(initialDungeon, monsters);

    return initialDungeon;
  });

  const initialPlayerPosition = placePlayerOnBottomLeftFloor(dungeon);

  const [playerPosition, setPlayerPosition] = useState(initialPlayerPosition);

  const handleTilePress = (x, y) => {
    if (
      Math.abs(x - playerPosition.x) <= 1 &&
      Math.abs(y - playerPosition.y) <= 1 &&
      dungeon[y][x].type !== 1 
    ) {
      
      if (dungeon[y][x].monster !== null) {
        const newDungeon = [...dungeon]; 
        newDungeon[y][x].monster = null;
        setDungeon(newDungeon);
        setMonster(null);
      }

      
      if (dungeon[y][x].treasure !== null) {
        const newDungeon = [...dungeon]; 
        newDungeon[y][x].treasure = null; 
        setDungeon(newDungeon); 
        setTreasure(null);
      }

      setPlayerPosition({ x, y });
    }
  };

  const handleCellDetails = (monster, treasure) => {
    setMonster(monster);
    setTreasure(treasure);
  };

  useEffect(() => {
    setMonster(null);
    setTreasure(null);
  }, [playerPosition]);

  const regenerateDungeon = () => {
    const newDungeon = generateDungeon(
      Math.floor(screenWidth / cellSize),
      Math.floor(screenHeight / cellSize),
      1000
    );

    let monsters = [
      "skeleton",
      "goblin",
      "skeleton",
      "goblin",
      "skeleton",
      "goblin",
      "skeleton",
      "goblin",
      "skeleton",
      "goblin",
      "werewolf",
      "werewolf",
      "werewolf",
      "lich",
      "lich",
      "cerebrus",
      "dragon",
    ];

    populateDungeonWithMonsters(newDungeon, monsters);

    const playerStartPosition = placePlayerOnBottomLeftFloor(newDungeon);
    setPlayerPosition(playerStartPosition);

    setDungeon(newDungeon);
  };

  return (
    <View style={styles.container}>
      <Dungeon
        dungeonData={dungeon}
        playerPosition={playerPosition}
        onTilePress={handleTilePress}
        onCellDetails={handleCellDetails}
      />
      <Text style={styles.cellText}>
        Monster: {monster} Treasure: {treasure}
      </Text>
      <Button title="Refresh Map" onPress={regenerateDungeon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
