import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

// pages/notes/[id].js
const Note = () => {
  const router = useRouter();

  // useEffect(() => {
  //   router.push('?id=4', '', { shallow: true });
  // }, []);

  useEffect(() => {
    console.log(router.query);
  }, [router.query]);

  return (
     <div>
      <h1>Note - {router.query?.id}</h1>
      <Link href='?id=5' shallow>link</Link>
    </div>
  );
};
export default Note;

export const getServerSideProps = async () => {
  console.log('getServerSideProps');
  return { props: {} };
};