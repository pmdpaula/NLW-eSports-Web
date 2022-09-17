import * as Checkbox from '@radix-ui/react-checkbox';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import axios from 'axios';
import { CaretDown, Check, GameController } from 'phosphor-react';
import { FormEvent, useEffect, useState } from 'react';

import { Game } from '../../App';
import { Input } from '../Form/Input/Input';

const CreateAdModal = (): JSX.Element => {
  const [games, setGames] = useState<Game[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [gamesInput, setGamesInput] = useState('');
  const [useVoiceChannel, setUseVoiceChannel] = useState<boolean>(false);

  useEffect(() => {
    axios('http://localhost:3333/games')
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        console.log('Erro ao resgatar dados dos jogos.', error);
      });
  }, []);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleCreateAd = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    // TODO: Validação (react-hook-form)
    if (data.name === null) {
      alert('Formulário vazio');
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
      await axios.post(`http://localhost:3333/games/${gamesInput}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hoursStart: data.hoursStart,
        hoursEnd: data.hoursEnd,
        useVoiceChannel,
      });

      alert('Anúncio criado com sucesso!');
    } catch (error) {
      console.log(error);
      alert(`Erro ao cria anúncio!`);
    }
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/40 inset-0 fixed" />

      <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
        <Dialog.Title className="text-3xl font-black">
          Publique um anúncio
        </Dialog.Title>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form className="mt-8 flex flex-col gap-4" onSubmit={handleCreateAd}>
          <div className="flex flex-col gap-2">
            <label htmlFor="game" className="font-semibold">
              Qual o game?
            </label>
            <Select.Root onValueChange={setGamesInput}>
              <Select.SelectTrigger
                id="game"
                name="game"
                aria-label="Game"
                className={`bg-zinc-900 py-3 px-4 rounded text-small flex justify-between ${
                  gamesInput.length !== 0 ? 'text-white' : 'text-zinc-500'
                }`}
              >
                <Select.SelectValue placeholder="Selecione um game" />
                <Select.SelectIcon>
                  <CaretDown size={24} className="text-zinc-400" />
                </Select.SelectIcon>
              </Select.SelectTrigger>

              <Select.SelectPortal>
                <Select.SelectContent className="bg-zinc-900 rounded overflow-hidden">
                  <Select.SelectScrollUpButton>
                    <CaretDown size={24} />
                  </Select.SelectScrollUpButton>
                  <Select.SelectViewport className="py-2 px-1">
                    <Select.SelectGroup>
                      {games.map((game) => {
                        return (
                          <Select.SelectItem
                            key={game.id}
                            className="flex items-center justify-between py-2 px-3 m-1 bg-zinc-900 text-zinc-500 cursor-pointer rounded hover:bg-zinc-800 hover:text-white"
                            value={game.id}
                          >
                            <Select.SelectItemText>
                              {game.title}
                            </Select.SelectItemText>
                            <Select.SelectItemIndicator>
                              <Check size={24} className="text-emerald-500" />
                            </Select.SelectItemIndicator>
                          </Select.SelectItem>
                        );
                      })}
                    </Select.SelectGroup>
                  </Select.SelectViewport>
                </Select.SelectContent>
              </Select.SelectPortal>
            </Select.Root>
            {/* <select
              id="game"
              className="bg-zinc-900 rounded text-sm placeholder:text-zinc-500"
            >
              <option disabled selected value="">
                Selecione o game que deseja jogar
              </option>
            </select> */}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name">Seu nome (ou nickname)</label>
            <Input
              id="name"
              name="name"
              placeholder="Como te chamam dentro do game?"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
              <Input
                id="yearsPlaying"
                name="yearsPlaying"
                type="number"
                placeholder="Tudo bem ser Zero"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="discord">Qual seu Discord?</label>
              <Input id="discord" name="discord" placeholder="Usuario#0000" />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="weekDays">Quando costuma jogar?</label>
              <ToggleGroup.Root
                type="multiple"
                className="grid grid-cols-4 gap-2"
                onValueChange={setWeekDays}
                value={weekDays}
              >
                <ToggleGroup.Item
                  value="0"
                  title="Domingo"
                  className={`w-8 h-8 rounded 
                  ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  D
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="1"
                  title="Segunda-feira"
                  className={`w-8 h-8 rounded 
                  ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  S
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="2"
                  title="Terça-feira"
                  className={`w-8 h-8 rounded 
                  ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  T
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="3"
                  title="Quarta-feira"
                  className={`w-8 h-8 rounded 
                  ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  Q
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="4"
                  title="Quinta-feira"
                  className={`w-8 h-8 rounded 
                  ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  Q
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="5"
                  title="Sexta-feira"
                  className={`w-8 h-8 rounded 
                  ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  S
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="6"
                  title="Sábado"
                  className={`w-8 h-8 rounded 
                  ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  S
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="hoursStart">Qual o horário do dia?</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="hoursStart"
                  name="hoursStart"
                  type="time"
                  placeholder="De"
                />
                <Input
                  id="hoursEnd"
                  name="hoursEnd"
                  type="time"
                  placeholder="Até"
                />
              </div>
            </div>
          </div>

          <label className="mt-2 flex items-center gap-2 text-sm">
            <Checkbox.Root
              checked={useVoiceChannel}
              onCheckedChange={(checked) => {
                if (checked === true) {
                  setUseVoiceChannel(true);
                } else {
                  setUseVoiceChannel(false);
                }
              }}
              // name="useVoiceChannel"
              className="w-6 h-6 p-1 rounded bg-zinc-900"
            >
              <Checkbox.Indicator>
                <Check className="w-4 h-4 text-emerald-400" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            Costumo me conectar com chat de voz
          </label>

          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close
              type="button"
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
              onClick={() => setWeekDays([])}
            >
              Cancelar
            </Dialog.Close>
            <button
              type="submit"
              className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"
            >
              <GameController size={24} /> Encontrar duo
            </button>
          </footer>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default CreateAdModal;
