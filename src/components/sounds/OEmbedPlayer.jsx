import { useEffect, useState } from 'react';

export default function OEmbedPlayer({ artistName, trackName }) {
  const { oembedData, setOembedData } = useState("");

  useEffect(async () => {
    try {
      const oembedParams = new URLSearchParams(
        {
          url: `https://soundcloud.com/${artistName}/${trackName}`,
          format: "json"
        }
      );
      const fetchOembedData = await fetch('https://soundcloud.com/oembed/' + oembedParams.toString());
      await fetchOembedData.json();
      setOembedData(oembedData);
    } catch (e) {
      console.error(`Unable to fetch OEmbed for track ${artistName}/${trackName}`);
      return null;
    }
  }, []);
}