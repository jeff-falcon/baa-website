import { getClient } from "$lib/sanity";
import type { Config } from "$lib/types";

export const config = {
  isr: {
    expiration: 60,
  }
}

export const trailingSlash = 'never'

export async function load() {
  const client = getClient();
  const groq = `*[_type == "config"]{
    "contactInfo": contact_info,
    "artistContactInfo": artist_contact_info,
    "socials": socials_group{
      name,
      "links": socials_links[]{
        name,
        url,
        "icon": icon.asset->url
      }
    },
    "artistMenu": artists[]->{
      name,
      "slug": "/artists/" + slug.current,
    }
  }`;
  const data = await client.fetch(groq);
  const configData = data[0] as Config;
  return {
    config: configData
  }
}