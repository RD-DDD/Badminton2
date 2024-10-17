import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Plus, Trash2, Copy } from 'lucide-react';

const BadmintonRotationApp = () => {
  const [players, setPlayers] = useState(['', '']);
  const [pattern, setPattern] = useState([]);
  const [shareableLink, setShareableLink] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const playersParam = urlParams.get('players');
    if (playersParam) {
      setPlayers(playersParam.split(','));
    }
  }, []);

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    setPlayers([...players, '']);
  };

  const removePlayer = (index) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  const generatePattern = () => {
    const filledPlayers = players.filter(player => player.trim() !== '');
    if (filledPlayers.length < 8) {
      alert('Please enter at least 8 player names.');
      return;
    }

    const newPattern = [];
    let allPlayers = [...filledPlayers];

    while (allPlayers.length > 0) {
      const playingPlayers = allPlayers.splice(0, 8);
      const restingPlayers = [...allPlayers];
      newPattern.push({ playing: playingPlayers, resting: restingPlayers });

      if (allPlayers.length < 8) {
        allPlayers = [...allPlayers, ...filledPlayers];
      }
    }

    setPattern(newPattern);

    const playersString = filledPlayers.join(',');
    const shareableUrl = `${window.location.origin}${window.location.pathname}?players=${encodeURIComponent(playersString)}`;
    setShareableLink(shareableUrl);
  };

  const copyShareableLink = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert('Shareable link copied to clipboard!');
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Badminton Rotation App</h1>
      <div className="space-y-2 mb-4">
        {players.map((player, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              placeholder={`Player ${index + 1}`}
              value={player}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
            />
            <Button variant="outline" size="icon" onClick={() => removePlayer(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addPlayer} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Player
        </Button>
      </div>
      <Button onClick={generatePattern} className="mb-4">Generate Pattern</Button>
      {shareableLink && (
        <div className="mb-4 flex items-center space-x-2">
          <Input value={shareableLink} readOnly />
          <Button onClick={copyShareableLink}>
            <Copy className="mr-2 h-4 w-4" /> Copy Link
          </Button>
        </div>
      )}
      {pattern.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pattern.map((round, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Round {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Playing:</strong> {round.playing.join(', ')}</p>
                <p><strong>Resting:</strong> {round.resting.join(', ') || 'None'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadmintonRotationApp;