import { useEffect } from "react";

const AdsenseAd = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense 로드 에러:", e);
    }
  }, []);

  return <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-4844671075935249" data-ad-slot="6468467356" data-ad-format="auto" data-full-width-responsive="true"></ins>;
};

export default AdsenseAd;
