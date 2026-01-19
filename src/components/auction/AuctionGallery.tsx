/**
 * AuctionGallery - Wrapper for MediaGallery
 *
 * @deprecated Use MediaGallery from @letitrip/react-library/media instead
 */

import type { MediaGalleryProps } from "../media/MediaGallery";
import { MediaGallery } from "../media/MediaGallery";

export interface GalleryMedia {
  url: string;
  type: "image" | "video";
  alt?: string;
}

export interface AuctionGalleryProps
  extends Omit<MediaGalleryProps, "resourceName"> {
  auctionName: string;
}

export function AuctionGallery({ auctionName, ...props }: AuctionGalleryProps) {
  return <MediaGallery resourceName={auctionName} {...props} />;
}
