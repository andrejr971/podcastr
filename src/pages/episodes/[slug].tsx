import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import api from '../../services/api';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';
import Link from 'next/link';
import styles from './episodes.module.scss';
import Image from 'next/image';

interface IEpisode {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  publishedAt: string;
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
  return (
    <div className={styles.wrapper}>
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

          <button type="button">
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
  return {
    paths: [],
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