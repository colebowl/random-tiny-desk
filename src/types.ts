export type YouTubePlaylistItem = {
  kind: "youtube#playlistItem";
  etag: string;
  id: string;
  snippet: {
    publishedAt: string; // ISO 8601 datetime string
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
  contentDetails: {
    videoId: string;
    startAt: string;
    endAt: string;
    note: string;
    videoPublishedAt: string; // ISO 8601 datetime string
  };
  status: {
    privacyStatus: string;
  };
};

export type ParsedPlaylistItem = {
  title: string;
  description: string;
  publishedAt: string;
  position: number;
  id: string;
};