import { GetStaticProps } from "next";
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import api from "../services/api";
import convertDurationToTimeString from "../utils/convertDurationToTimeString";

import styles from './home.module.scss';
import { usePlayer } from "../context/PlayerContext";

interface IEpisode {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  publishedAt: string;
  durationAsString: string;
  url: string;
  duration: number;
  file: {
    url: string;
    type: string;
    duration: number;
  }
}

interface HomeProps {
  lastetEpisodes: IEpisode[];
  allEpisodes: IEpisode[];
}

export default function Home({ allEpisodes, lastetEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...lastetEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.lastetEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {lastetEpisodes.map((episode, index) => (
            <li key={episode.id}>
                <Image 
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>
                      {episode.title}
                    </a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/assets/play-green.svg" alt="Tocar episodio"/>
                </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcat</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td style={{ width: 72 }}>
                  <Image 
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td> 
                  <Link href={`/episodes/${episode.id}`}>
                    <a>
                      {episode.title}
                    </a>
                  </Link>
                </td>
                <td>
                  {episode.members}
                </td>
                <td style={{ width: 100 }}>
                  {episode.publishedAt}
                </td>
                <td>
                  {episode.durationAsString}
                </td>
                <td>
                  <button type="button" onClick={() => playList(episodeList, index + lastetEpisodes.length)}>
                    <img src="/assets/play-green.svg" alt="Tocar episodio"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { data } =  await api.get('episodes', {
    params: {
      _limit : 12,
      _sort : 'published_at',
      _order : 'desc'
    }
  });

  const episodes: IEpisode[] = data.map((episode: IEpisode) => ({
    ...episode,
    publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
      locale: ptBR
    }),
    duration: Number(episode.file.duration),
    url: episode.file.url,
    durationAsString: convertDurationToTimeString(Number(episode.file.duration))
  }));

  const lastetEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      lastetEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }

}
