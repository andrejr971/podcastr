import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import Head from 'next/head';
import ptBR from 'date-fns/locale/pt-BR'
import api from '../../services/api';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';
import Link from 'next/link';
import styles from './episodes.module.scss';
import Image from 'next/image';
import { usePlayer } from '../../context/PlayerContext';

interface IEpisode {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  publishedAt: string;
  url: string;
  duration: number;
  durationAsString: string;
  file: {
    url: string;
    type: string;
    duration: number;
  }
}

interface EpisodeProps {
  episode: IEpisode;
}

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href='/'>
            <button type="button">
              <img src="/assets/arrow-left.svg" alt="Voltar"/>
            </button>
          </Link>

          <Image
            className={styles.thumbnail}
            width={700}
            height={160}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit="cover"
          />

          <button type="button" onClick={() => play(episode)}>
            <img src="/assets/play.svg" alt="Tocar episódio"/>
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div className={styles.description} dangerouslySetInnerHTML={{ __html :episode.description }} />
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } =  await api.get('episodes', {
    params: {
      _limit : 12,
      _sort : 'published_at',
      _order : 'desc'
    }
  });

  const paths = data.map((episode: IEpisode) => ({
    params: {
      slug: episode.id
    }
  }));


  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<EpisodeProps> = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`episodes/${slug}`);

  const episode = {
    ...data,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR
    }),
    duration: Number(data.file.duration),
    url: data.file.url,
    durationAsString: convertDurationToTimeString(Number(data.file.duration))
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, //24 hours
  }
}