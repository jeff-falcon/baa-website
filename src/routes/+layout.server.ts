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
    "socials": socials_group{
      name,
      "links": socials_links[]{
        name,
        url,
        "icon": icon.asset->url
      }
    },
  }`;
  const data = await client.fetch(groq);
  const configData = data[0] as Config;
  return {
    config: configData
  }
}