
export async function getServerSideProps() {
  return {
    redirect: {
      destination: 'pages/login',
      permanent: false, 
    },
  };
}

export default function Home() {
  return null; 
}
