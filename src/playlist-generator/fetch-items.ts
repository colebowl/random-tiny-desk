import { join } from "https://deno.land/std@0.218.0/path/mod.ts";

import type { ParsedPlaylistItem, YouTubePlaylistItem } from "../types.ts";
import { getEnvironmentVariable } from "../utils/environment.ts";

const fetchPlaylistItems = async (
  playlistId: string,
  nextPageToken?: string | null
) => {
  const youtubeApiKey = getEnvironmentVariable("YOUTUBE_API_KEY");

  const params = new URLSearchParams();

  params.append("key", youtubeApiKey);
  params.append("part", "contentDetails,snippet");
  params.append("playlistId", playlistId);
  params.append("maxResults", "50");

  let url = `https://www.googleapis.com/youtube/v3/playlistItems?${params}`;

  if (nextPageToken) {
    url += `&pageToken=${nextPageToken}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    console.error("Failed to get the playlist items");
  }

  return response.json();
};

const mapResponseItemToVideo = (item: YouTubePlaylistItem) => {
  return {
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    position: item.snippet.position,
    id: item.contentDetails.videoId,
  };
};

export const getPlaylistItems = async (
  playlistId: string,
  outputPath = "."
) => {
  try {
    const items: ParsedPlaylistItem[] = [];
    let nextPageToken: string | null = null;

    do {
      const response = await fetchPlaylistItems(playlistId, nextPageToken);

      console.log("Fetched items count:", response.items?.length || 0);
      console.log("nextPageToken:", response.nextPageToken);

      if (Array.isArray(response.items)) {
        const mappedItems = response.items.map(mapResponseItemToVideo);
        items.push(...mappedItems);
      }

      nextPageToken = response.nextPageToken;
    } while (nextPageToken && items.length < 1300);

    const filePath = join(outputPath, "items.json");

    await Deno.writeTextFile(filePath, JSON.stringify(items, null, 2));
    console.log(`Saved ${items.length} items to items.json`);

    return items;
  } catch (error) {
    console.error("Error fetching playlist items:", error);
  }
};
