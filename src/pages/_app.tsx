import { useState } from 'react'
import { PlayerContext } from '../context/PlayerContext'
import Header from '../components/Header'
import '../styles/global.scss'

import styles from '../styles/app.module.scss'
import Player from '../components/Player';

interface IEpisode {
  title: string;
  members: string;
  thumbnail: string;
  duration: string;
  url: string;
}

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState<IEpisode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndext] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndext(0);
    setIsPlaying(true);
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  }

  return (
    <PlayerContext.Provider value={{
      currentEpisodeIndex,
      episodeList,
      play,
      isPlaying,
      togglePlay,
      setPlayingState
    }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
