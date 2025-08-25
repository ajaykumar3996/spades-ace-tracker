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

interface GameHistoryProps {
  teams: Team[];
  rounds: Round[];
}

export const GameHistory = ({ teams, rounds }: GameHistoryProps) => {
  if (rounds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg text-muted-foreground">
            No rounds played yet
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-primary">♠</span>
          Game History
          <span className="text-primary">♠</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {rounds.map((round, index) => {
            const roundNumber = index + 1;
            const team1Made = round.team1Tricks >= round.team1Bid;
            const team2Made = round.team2Tricks >= round.team2Bid;
            
            return (
              <div 
                key={round.id} 
                className="border border-border rounded-lg p-4 bg-secondary/20 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-foreground">Round {roundNumber}</h3>
                  <div className="text-sm text-muted-foreground">
                    Total: {round.team1Score + round.team2Score} points
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="font-medium text-foreground">{teams[0].name}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>Bid: {round.team1Bid}</span>
                      <span>•</span>
                      <span>Tricks: {round.team1Tricks}</span>
                      <Badge 
                        variant={team1Made ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {team1Made ? 'Made' : 'Failed'}
                      </Badge>
                    </div>
                    <div className={`text-lg font-bold ${round.team1Score > 0 ? 'text-primary' : 'text-destructive'}`}>
                      {round.team1Score > 0 ? '+' : ''}{round.team1Score}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium text-foreground">{teams[1].name}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>Bid: {round.team2Bid}</span>
                      <span>•</span>
                      <span>Tricks: {round.team2Tricks}</span>
                      <Badge 
                        variant={team2Made ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {team2Made ? 'Made' : 'Failed'}
                      </Badge>
                    </div>
                    <div className={`text-lg font-bold ${round.team2Score > 0 ? 'text-primary' : 'text-destructive'}`}>
                      {round.team2Score > 0 ? '+' : ''}{round.team2Score}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};