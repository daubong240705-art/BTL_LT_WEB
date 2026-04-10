"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import "plyr/dist/plyr.css";

type PlyrInstance = {
    destroy: () => void;
};

export default function VideoPlayer({ src }: { src: string }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        let hls: Hls | null = null;
        let player: PlyrInstance | null = null;
        let cancelled = false;
        let lastRecoverAt = 0;

        const setup = async () => {
            const { default: Plyr } = await import("plyr");
            if (cancelled || !video) return;

            if (Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: false, 
                    capLevelToPlayerSize: true,
                    capLevelOnFPSDrop: true,
                    maxDevicePixelRatio: 2,
                    maxBufferLength: 20,
                    backBufferLength: 30,
                });

                hls.attachMedia(video);

                hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                    hls?.loadSource(src);
                });

                hls.on(Hls.Events.ERROR, (_, data) => {
                    if (!hls || !data.fatal) return;

                    switch (data.type) {
                        case Hls.ErrorTypes.MEDIA_ERROR: {
                            const now = Date.now();

                            if (now - lastRecoverAt > 5000) {
                                lastRecoverAt = now;
                                hls.recoverMediaError();
                            } else {
                                hls.destroy();
                            }
                            break;
                        }

                        default:
                            hls.destroy();
                            break;
                    }
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = src;
            } else {
                video.src = src;
            }

            player = new Plyr(video, {
                seekTime: 10,
                controls: [
                    "play-large",
                    "rewind",
                    "play",
                    "fast-forward",
                    "progress",
                    "current-time",
                    "mute",
                    "volume",
                    "settings",
                    "fullscreen",
                ],
            });
        };

        setup().catch((error) => {
            console.error("Failed to initialize video player", error);
        });

        return () => {
            cancelled = true;

            hls?.destroy();
            player?.destroy();

            video.removeAttribute("src");
            video.load();
        };
    }, [src]);

    return (
        <div className="relative h-full w-full overflow-hidden rounded-xl border border-gray-700/80 bg-gray-950 shadow-2xl">
            <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-black/40 via-transparent to-black/50" />

            <video
                ref={videoRef}
                className="h-full w-full bg-black object-contain"
                playsInline
                preload="metadata"
            />

            <style jsx global>{`
        .plyr {
          height: 100%;
          --plyr-color-main: #dc2626;
          --plyr-video-control-color-hover: #ffffff;
          --plyr-video-control-background-hover: rgba(220, 38, 38, 0.9);
          --plyr-range-fill-background: #dc2626;
          --plyr-menu-background: #0f172a;
          --plyr-menu-color: #e2e8f0;
          --plyr-tooltip-background: #dc2626;
          --plyr-tooltip-color: #ffffff;
        }

        .plyr--video .plyr__control--overlaid {
          background: rgba(220, 38, 38, 0.92);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
        }

        .plyr--video .plyr__controls {
          background: linear-gradient(
            to top,
            rgba(2, 6, 23, 0.95),
            rgba(2, 6, 23, 0.35)
          );
          border-top: 1px solid rgba(148, 163, 184, 0.2);
        }

        .plyr--fullscreen:hover .plyr__controls,
        .plyr--fullscreen:focus-within .plyr__controls {
          opacity: 1 !important;
          transform: translateY(0) !important;
          pointer-events: auto !important;
        }
      `}</style>
        </div>
    );
}
