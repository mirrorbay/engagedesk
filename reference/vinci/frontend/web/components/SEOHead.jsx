import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SEOHead = ({
  title,
  description,
  keywords,
  image = "/1.png",
  type = "website",
  noIndex = false,
}) => {
  const location = useLocation();
  const baseUrl = "https://davincifocus.com";
  const currentUrl = `${baseUrl}${location.pathname}`;

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description
    if (description) {
      updateMetaTag("name", "description", description);
    }

    // Update keywords
    if (keywords) {
      updateMetaTag("name", "keywords", keywords);
    }

    // Update canonical URL
    updateLinkTag("canonical", currentUrl);

    // Update Open Graph tags
    updateMetaTag("property", "og:title", title || document.title);
    updateMetaTag("property", "og:description", description || "");
    updateMetaTag("property", "og:url", currentUrl);
    updateMetaTag("property", "og:image", `${baseUrl}${image}`);
    updateMetaTag("property", "og:type", type);

    // Update Twitter tags
    updateMetaTag("property", "twitter:title", title || document.title);
    updateMetaTag("property", "twitter:description", description || "");
    updateMetaTag("property", "twitter:url", currentUrl);
    updateMetaTag("property", "twitter:image", `${baseUrl}${image}`);

    // Update robots tag
    if (noIndex) {
      updateMetaTag("name", "robots", "noindex, nofollow");
    } else {
      updateMetaTag("name", "robots", "index, follow");
    }
  }, [title, description, keywords, image, type, noIndex, currentUrl]);

  const updateMetaTag = (attribute, name, content) => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (element) {
      element.setAttribute("content", content);
    } else {
      element = document.createElement("meta");
      element.setAttribute(attribute, name);
      element.setAttribute("content", content);
      document.head.appendChild(element);
    }
  };

  const updateLinkTag = (rel, href) => {
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (element) {
      element.setAttribute("href", href);
    } else {
      element = document.createElement("link");
      element.setAttribute("rel", rel);
      element.setAttribute("href", href);
      document.head.appendChild(element);
    }
  };

  return null; // This component doesn't render anything
};

export default SEOHead;
