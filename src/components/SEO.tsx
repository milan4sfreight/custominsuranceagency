import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  image?: string;
  url?: string;
  imageWidth?: number;
  imageHeight?: number;
};

const setMeta = (selector: string, attr: string, key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export const SEO = ({ title, description, image, url, imageWidth, imageHeight }: SEOProps) => {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

    const finalUrl = url || window.location.origin + window.location.pathname;
    setMeta('meta[property="og:url"]', "property", "og:url", finalUrl);

    if (image) {
      setMeta('meta[property="og:image"]', "property", "og:image", image);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
      setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
      if (imageWidth) {
        setMeta('meta[property="og:image:width"]', "property", "og:image:width", String(imageWidth));
      }
      if (imageHeight) {
        setMeta('meta[property="og:image:height"]', "property", "og:image:height", String(imageHeight));
      }
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", finalUrl);
  }, [title, description, image, url, imageWidth, imageHeight]);

  return null;
};

export default SEO;
