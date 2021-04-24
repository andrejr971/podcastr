import { createContext, useContext, useState } from "react";

interface IEpisode {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

interface IPlayerContextData {
  episodeList: IEpisode[];
  currentEpisodeIndex: number;
  play(episode: IEpisode): void;
  setPlayingState(state: boolean): void;
  playList(list: IEpisode[], index: number): void;
  togglePlay(): void;
  toggleLoop(): void;
  toggleShuffle(): void;
  playNext(): void;
  playPrevious(): void;
  clearPlayerState(): void;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface PlayerContextProviderProps {
  children: React.ReactNode
}

export const PlayerContext = createContext<IPlayerContextData>({} as IPlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState<IEpisode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndext] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const play = (episode: IEpisode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndext(0);
    setIsPlaying(true);
  }

  const playList = (list: IEpisode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndext(index);
    setIsPlaying(true);
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  }

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  }

  const clearPlayerState = () => {
    setEpisodeList([]);
    setCurrentEpisodeIndext(0);
    setIsPlaying(false);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  const playNext = () => {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndext(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndext(currentEpisodeIndex + 1);
    }

  }

  const playPrevious = () => {
    if (!hasPrevious) {
      return;
    }

    setCurrentEpisodeIndext(currentEpisodeIndex - 1);
  }

  return (
    <PlayerContext.Provider value={{
      currentEpisodeIndex,
      episodeList,
      play,
      isPlaying,
      togglePlay,
      setPlayingState,
      playList,
      playNext,
      playPrevious,
      hasPrevious,
      hasNext,
      toggleLoop,
      isLooping,
      toggleShuffle,
      isShuffling,
      clearPlayerState,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer(): IPlayerContextData {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error('Context not found');
  }

  return context;
}