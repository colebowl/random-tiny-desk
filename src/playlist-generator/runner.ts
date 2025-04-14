import { getEnvironmentVariable } from "../utils/environment.ts";
import { getPlaylistItems } from "./fetch-items.ts";

const playlistId = getEnvironmentVariable("PLAYLIST_ID");

getPlaylistItems(playlistId);
