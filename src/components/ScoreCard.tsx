import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface ScoreCardProps {
  teams: Team[];
  rounds: Round[];
  currentScores: { team1: number; team2: number };
}

export const ScoreCard = ({ teams, rounds, currentScores }: ScoreCardProps) => {
  const winningTeam = currentScores.team1 > currentScores.team2 ? teams[0] : 
                     currentScores.team2 > currentScores.team1 ? teams[1] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {teams.map((team, index) => {
        const isTeam1 = index === 0;
        const score = isTeam1 ? currentScores.team1 : currentScores.team2;
        const isWinning = winningTeam?.id === team.id;
        
        return (
          <Card 
            key={team.id} 
            className={`relative overflow-hidden transition-all duration-300 ${
              isWinning ? 'ring-2 ring-primary shadow-gold' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-foreground">
                  {team.name}
                </CardTitle>
                {isWinning && (
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    Leading
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>{team.players[0]}</div>
                <div>{team.players[1]}</div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {score}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Score
                </div>
              </div>
              
              {rounds.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-sm font-medium text-foreground mb-2">Recent Rounds</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {rounds.slice(-3).reverse().map((round, roundIndex) => {
                      const bid = isTeam1 ? round.team1Bid : round.team2Bid;
                      const tricks = isTeam1 ? round.team1Tricks : round.team2Tricks;
                      const roundScore = isTeam1 ? round.team1Score : round.team2Score;
                      const made = tricks >= bid;
                      
                      return (
                        <div 
                          key={round.id} 
                          className="flex justify-between items-center text-xs bg-secondary/30 rounded p-2"
                        >
                          <span>
                            Round {rounds.length - roundIndex}: {bid} bid, {tricks} tricks
                          </span>
                          <span className={`font-medium ${made ? 'text-primary' : 'text-destructive'}`}>
                            {roundScore > 0 ? '+' : ''}{roundScore}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};