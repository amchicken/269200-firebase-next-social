import Head from "next/head";

export default function Header({ title = "Social wep app" }) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}
