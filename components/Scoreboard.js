import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Dial from "./Dial";

const Scoreboard = () => {
  const [health, setHealth] = useState(10);
  const [aggro, setAggro] = useState(10);
  const [poison, setPoison] = useState(0);
  const [bleed, setBleed] = useState(0);
  const [flame, setFlame] = useState(0);
  const [frost, setFrost] = useState(0);
  const [healing, setHealing] = useState(0);

  const scoreAdjuster = (score, adjuster) => {
    return score + adjuster >= 0 ? score + adjuster : 0;
  };

  return (
    <View style={styles.container}>
      <ScoreComponent
        title="Health"
        score={health}
        setScore={setHealth}
        max={20}
      />
      <ScoreComponent
        title="Aggro"
        score={aggro}
        setScore={setAggro}
        max={20}
      />
      <ScoreComponent title="Poison" score={poison} setScore={setPoison} />
      <ScoreComponent title="Bleed" score={bleed} setScore={setBleed} />
      <ScoreComponent title="Flame" score={flame} setScore={setFlame} />
      <ScoreComponent title="Frost" score={frost} setScore={setFrost} />
      <ScoreComponent title="Healing" score={healing} setScore={setHealing} />
    </View>
  );
};

const ScoreComponent = ({ title, score, setScore, max }) => {
  const tensPlace = Math.floor(score / 10);
  const onesPlace = score % 10;

  const incrementScore = (place) => {
    let newScore = score;
    if (place === "tens") {
      newScore += 10;
    } else {
      newScore += 1;
    }
    newScore = newScore > max ? max : newScore;
    setScore(newScore);
  };

  return (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreTitle}>{title}</Text>
      <Dial value={1} position="tens" />
      <Dial value={5} position="ones" />
    </View>
  );
};

const scoreAdjuster = (prev, adjuster, max = Infinity) => {
  const newValue = prev + adjuster;
  if (newValue < 0) return 0;
  if (newValue > max) return max;
  return newValue;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  scoreTitle: {
    fontSize: 18,
  },
  scoreValue: {
    fontSize: 18,
  },
});

export default Scoreboard;
