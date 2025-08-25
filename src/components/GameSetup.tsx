import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Team {
  id: string;
  name: string;
  players: [string, string];
}

interface GameSetupProps {
  onStartGame: (teams: Team[]) => void;
}

export const GameSetup = ({ onStartGame }: GameSetupProps) => {
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Team 1", players: ["", ""] },
    { id: "2", name: "Team 2", players: ["", ""] }
  ]);

  const updateTeamName = (id: string, name: string) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, name } : team
    ));
  };

  const updatePlayer = (teamId: string, playerIndex: 0 | 1, playerName: string) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            players: team.players.map((player, idx) => 
              idx === playerIndex ? playerName : player
            ) as [string, string]
          }
        : team
    ));
  };

  const canStartGame = teams.every(team => 
    team.name.trim() && team.players.every(player => player.trim())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-table-green to-felt-green flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-card/95 backdrop-blur border-border shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-3">
            <span className="text-4xl">♠</span>
            Spades Squad Tracker
            <span className="text-4xl">♠</span>
          </CardTitle>
          <p className="text-muted-foreground">Set up your teams to start tracking scores</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {teams.map((team) => (
            <div key={team.id} className="space-y-4 p-4 rounded-lg bg-secondary/50 border border-border">
              <div>
                <Label htmlFor={`team-${team.id}`} className="text-sm font-medium">
                  Team Name
                </Label>
                <Input
                  id={`team-${team.id}`}
                  value={team.name}
                  onChange={(e) => updateTeamName(team.id, e.target.value)}
                  placeholder="Enter team name"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`player1-${team.id}`} className="text-sm font-medium">
                    Player 1
                  </Label>
                  <Input
                    id={`player1-${team.id}`}
                    value={team.players[0]}
                    onChange={(e) => updatePlayer(team.id, 0, e.target.value)}
                    placeholder="Player name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`player2-${team.id}`} className="text-sm font-medium">
                    Player 2
                  </Label>
                  <Input
                    id={`player2-${team.id}`}
                    value={team.players[1]}
                    onChange={(e) => updatePlayer(team.id, 1, e.target.value)}
                    placeholder="Player name"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-4">
            <Button 
              onClick={() => onStartGame(teams)}
              disabled={!canStartGame}
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};