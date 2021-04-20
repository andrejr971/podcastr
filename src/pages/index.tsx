import { GetServerSideProps, GetStaticProps } from "next";
import { useEffect } from "react"

interface IEpisode {
  id: string;
  title: string;
  members: string;
  published_at: Date;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  }
}

interface HomeProps {
  episodes: IEpisode[];
}

export default function Home(props) {

  return (
    <>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  )
}

export async function getStaticProps() {
  const response =  await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8
  }

}
