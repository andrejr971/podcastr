import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';


export default function Player() {
  const [progress, setProgress] = useState(0);

  const { 
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    togglePlay,
    setPlayingState,
    playPrevious,
    playNext,
    hasPrevious,
    hasNext,
    isLooping,
    toggleLoop,
    toggleShuffle,
    isShuffling,
    clearPlayerState
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const setupProgressListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  const handleSeek = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount)
  }

  const handleEpisodeEnded = () => {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/assets/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
          <div className={styles.currentPlayer}>
            <Image 
                width={592}
                height={592}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />

            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        ): (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider 
                trackStyle={{ backgroundColor: "#04d361" }} 
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio 
            src={episode.url} 
            autoPlay
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            loop={isLooping}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? 'isActive' : ''}
          >
            <img src="/assets/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src="/assets/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/assets/pause.svg" alt="Pausar"/>
            ) : (
              <img src="/assets/play.svg" alt="Tocar"/>
            )}
          </button>
          <button
            type="button"
            disabled={!episode || !hasNext}
          >
            <img src="/assets/play-next.svg" alt="Tocar próxima" onClick={playNext} />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? 'isActive' : ''}
          >
            <img src="/assets/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}