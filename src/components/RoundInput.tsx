import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Team {
  id: string;
  name: string;
  players: [string, string];
}

interface RoundData {
  team1Bid: number;
  team1Tricks: number;
  team2Bid: number;
  team2Tricks: number;
}

interface RoundInputProps {
  teams: Team[];
  roundNumber: number;
  onSubmitRound: (roundData: RoundData) => void;
}

export const RoundInput = ({ teams, roundNumber, onSubmitRound }: RoundInputProps) => {
  const { toast } = useToast();
  const [roundData, setRoundData] = useState<RoundData>({
    team1Bid: 0,
    team1Tricks: 0,
    team2Bid: 0,
    team2Tricks: 0,
  });

  const updateValue = (field: keyof RoundData, value: string) => {
    const numValue = Math.max(0, Math.min(13, parseInt(value) || 0));
    setRoundData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = () => {
    // Validate that bids and tricks are reasonable
    if (roundData.team1Bid + roundData.team2Bid > 13) {
      toast({
        title: "Invalid Bids",
        description: "Total bids cannot exceed 13 tricks.",
        variant: "destructive",
      });
      return;
    }

    if (roundData.team1Tricks + roundData.team2Tricks !== 13) {
      toast({
        title: "Invalid Tricks",
        description: "Total tricks must equal 13.",
        variant: "destructive",
      });
      return;
    }

    onSubmitRound(roundData);
    
    // Reset for next round
    setRoundData({
      team1Bid: 0,
      team1Tricks: 0,
      team2Bid: 0,
      team2Tricks: 0,
    });

    toast({
      title: "Round Complete",
      description: `Round ${roundNumber} has been recorded.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-primary">
          Round {roundNumber}
        </CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Enter bids and tricks taken for this round
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team, index) => {
            const isTeam1 = index === 0;
            const bidField = isTeam1 ? 'team1Bid' : 'team2Bid';
            const tricksField = isTeam1 ? 'team1Tricks' : 'team2Tricks';
            
            return (
              <div key={team.id} className="space-y-4 p-4 rounded-lg bg-secondary/30 border border-border">
                <h3 className="font-semibold text-foreground text-center">{team.name}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`bid-${team.id}`} className="text-sm font-medium">
                      Bid
                    </Label>
                    <Input
                      id={`bid-${team.id}`}
                      type="number"
                      min="0"
                      max="13"
                      value={roundData[bidField]}
                      onChange={(e) => updateValue(bidField, e.target.value)}
                      className="mt-1 text-center text-lg font-semibold"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`tricks-${team.id}`} className="text-sm font-medium">
                      Tricks
                    </Label>
                    <Input
                      id={`tricks-${team.id}`}
                      type="number"
                      min="0"
                      max="13"
                      value={roundData[tricksField]}
                      onChange={(e) => updateValue(tricksField, e.target.value)}
                      className="mt-1 text-center text-lg font-semibold"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {roundData[bidField] <= roundData[tricksField] ? 'Made bid' : 'Failed bid'}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {team.players[0]} & {team.players[1]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="text-center text-sm text-muted-foreground">
            Total bids: {roundData.team1Bid + roundData.team2Bid} / 13 | 
            Total tricks: {roundData.team1Tricks + roundData.team2Tricks} / 13
          </div>
          
          <Button 
            onClick={handleSubmit}
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
            disabled={roundData.team1Tricks + roundData.team2Tricks !== 13}
          >
            Complete Round
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};