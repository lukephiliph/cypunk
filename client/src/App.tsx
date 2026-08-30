import { useState } from 'react';

import CharacterSelect from './characters/CharacterSelect';
import Game from './game/Game';

import { joinWorld } from './api/backend';

function App() {
  const [selectedCharacter, setSelectedCharacter] =
    useState<string | null>(null);

  const [playerId, setPlayerId] =
    useState<string | null>(null);

  const [joining, setJoining] =
    useState(false);

  const handleCharacterSelect = async (
    characterId: string
  ) => {
    try {
      setJoining(true);

      const player = await joinWorld(characterId);

      setSelectedCharacter(player.character_id);
      setPlayerId(player.player_id);
    } catch (error) {
      console.error(
        'Could not join Cyberdane:',
        error
      );
    } finally {
      setJoining(false);
    }
  };

  if (!selectedCharacter || !playerId) {
    return (
      <>
        <CharacterSelect
          onSelect={handleCharacterSelect}
        />

        {joining && (
          <div className="joining-world">
            Entering Cyberdane...
          </div>
        )}
      </>
    );
  }

  return (
    <Game
      characterId={selectedCharacter}
      playerId={playerId}
    />
  );
}

export default App;