import './styles/main.css';

import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import { useEffect, useState } from 'react';

import logoImg from './assets/logo-nlw-esports.png';
import CreateAdBanner from './components/CreateAdBanner/CreateAdBanner';
import CreateAdModal from './components/CreateAdModal/CreateAdModal';
import GameBanner from './components/GameBanner/GameBanner';

export interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  };
}

const App = (): JSX.Element => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    axios('http://localhost:3333/games')
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        console.log('Erro ao resgatar dados dos jogos.', error);
      });
  }, []);

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoImg} alt="" />
      <h1 className="text-6xl text-white font-black mt-20">
        Seu{' '}
        <span className="text-transparent bg-nlw-gradient bg-clip-text">
          duo
        </span>{' '}
        está aqui.
      </h1>
      {/* // TODO: Keen Slider para criar um carrousel */}
      <div className="grid grid-cols-6 gap-6 mt-16">
        {games.map((game) => (
          <GameBanner
            key={game.id}
            bannerUrl={game.bannerUrl}
            title={game.title}
            adsCount={game._count.ads}
          />
        ))}
      </div>
      <Dialog.Root>
        <CreateAdBanner />
        <CreateAdModal />
      </Dialog.Root>
    </div>
  );
};

export default App;
