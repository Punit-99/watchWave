import { useEffect, useRef } from "react";
import cloudinary from "cloudinary-video-player/light";
import "cloudinary-video-player/cld-video-player.min.css";

const VideoPlayer = () => {
  const cloudinaryRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = cloudinary;
    const player = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "pusocloud",
      publicId: "2519660-uhd_3840_2160_24fps_dvtpx6",
      controls: true,
      autoplay: true,
      hideContextMenu: true,
      autoplayMode: "always",
      preload: "auto",
      pictureInPictureToggle: true,
      showLogo: false,
      playbackRates: [0.5, 1, 1.5, 2], // ✅ Speed Control
      showJumpControls: true,
      textTracks: {
        caption: [
          {
            label: "English",
            language: "en",
            kind: "captions",
            src: "https://res.cloudinary.com/pusocloud/raw/upload/v1741617936/s2_y8dcfz.srt",
          },
          {
            label: "Hindi",
            language: "hn",
            kind: "captions",
            src: "https://res.cloudinary.com/pusocloud/raw/upload/v1741617936/s2_y8dcfz.srt",
          },
        ],
      },
      // sourceTypes: ["hls"], // ✅ Enable Adaptive Streaming
      source: {
        publicId: "2519660-uhd_3840_2160_24fps_dvtpx6",
        sourceTypes: ["webm/vp9", "mp4/h264", "mp4/h265"],
      },
    });

    // ✅ Add Quality Selector like YouTube
    player.on("qualityChanged", (event) => {
      console.log("Switched to quality:", event.quality);
    });

    // ✅ Handle Subtitle Track Change
    player.on("textTrackChange", (event) => {
      console.log("Subtitle Changed to:", event.label);
    });
  }, []);

  return (
    <div className="h-20 w-20">
      <h3 className="text-white">Cloudinary Video Player</h3>
      <video className="cld-video-player" ref={videoRef} autoPlay />
    </div>
  );
};

export default VideoPlayer;
