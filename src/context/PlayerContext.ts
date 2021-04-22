import { createContext } from "react";

interface IEpisode {
  title: string;
  members: string;
  thumbnail: string;
  duration: string;
  url: string;
}

interface IPlayerContextData {
  episodeList: IEpisode[];
  currentEpisodeIndex: number;
  play(episode: IEpisode): void;
  setPlayingState(state: boolean): void;
  togglePlay(): void;
  isPlaying: boolean;
}

export const PlayerContext = createContext<IPlayerContextData>({} as IPlayerContextData);
