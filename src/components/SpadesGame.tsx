import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GameSetup } from "./GameSetup";
import { ScoreCard } from "./ScoreCard";
import { RoundInput } from "./RoundInput";
import { GameHistory } from "./GameHistory";

interface Team {
  id: string;
  name: string;
  players: [string, string];
}

interface Round {
  id: string;
  team1Bid: number;
  team1Tricks: number;
  team2Bid: number;
  team2Tricks: number;
  team1Score: number;
  team2Score: number;
}

interface RoundData {
  team1Bid: number;
  team1Tricks: number;
  team2Bid: number;
  team2Tricks: number;
}

const calculateScore = (bid: number, tricks: number): number => {
  if (tricks >= bid) {
    // Made the bid: 10 points per bid + 1 point per overtrick
    return (bid * 10) + (tricks - bid);
  } else {
    // Failed the bid: -10 points per bid
    return -(bid * 10);
  }
};

export const SpadesGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentScores, setCurrentScores] = useState({ team1: 0, team2: 0 });
  const [showHistory, setShowHistory] = useState(false);

  const handleStartGame = (gameTeams: Team[]) => {
    setTeams(gameTeams);
    setGameStarted(true);
  };

  const handleSubmitRound = (roundData: RoundData) => {
    const team1Score = calculateScore(roundData.team1Bid, roundData.team1Tricks);
    const team2Score = calculateScore(roundData.team2Bid, roundData.team2Tricks);

    const newRound: Round = {
      id: Date.now().toString(),
      ...roundData,
      team1Score,
      team2Score,
    };

    const newRounds = [...rounds, newRound];
    setRounds(newRounds);

    // Update total scores
    setCurrentScores({
      team1: currentScores.team1 + team1Score,
      team2: currentScores.team2 + team2Score,
    });
  };

  const handleNewGame = () => {
    setGameStarted(false);
    setTeams([]);
    setRounds([]);
    setCurrentScores({ team1: 0, team2: 0 });
    setShowHistory(false);
  };

  if (!gameStarted) {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  const isGameComplete = currentScores.team1 >= 500 || currentScores.team2 >= 500;
  const winner = currentScores.team1 >= 500 ? teams[0] : 
                currentScores.team2 >= 500 ? teams[1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-table-green to-felt-green p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-card/95 backdrop-blur border-border">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <span className="text-3xl">♠</span>
                Spades Squad Tracker
              </CardTitle>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm"
                >
                  {showHistory ? 'Hide' : 'Show'} History
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNewGame}
                  className="text-sm"
                >
                  New Game
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>Round {rounds.length + 1}</span>
              <span>•</span>
              <span>Target: 500 points</span>
              {isGameComplete && (
                <>
                  <span>•</span>
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    Game Complete!
                  </Badge>
                </>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Winner announcement */}
        {isGameComplete && winner && (
          <Card className="border-primary bg-primary/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-primary mb-2">
                  🎉 {winner.name} Wins! 🎉
                </h2>
                <p className="text-lg text-foreground">
                  {winner.players[0]} & {winner.players[1]} have reached 500 points!
                </p>
                <div className="mt-4">
                  <Button onClick={handleNewGame} className="bg-primary hover:bg-primary/90">
                    Start New Game
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Score Cards */}
        <ScoreCard 
          teams={teams} 
          rounds={rounds} 
          currentScores={currentScores}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Round Input */}
          {!isGameComplete && (
            <RoundInput
              teams={teams}
              roundNumber={rounds.length + 1}
              onSubmitRound={handleSubmitRound}
            />
          )}

          {/* Game History */}
          {showHistory && (
            <GameHistory teams={teams} rounds={rounds} />
          )}
        </div>
      </div>
    </div>
  );
};