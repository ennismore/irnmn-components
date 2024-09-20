# `<irnmn-video>` Custom Video Component

This component renders a video player with customizable features like autoplay, inline playback, looping, cross-origin support, and video control button integration. It supports both HLS streaming and native video playback.

## Attributes

- `autoplay` (boolean): Automatically starts playing the video when the component is loaded. 
- `video-source` (string): Determines the type of video source (e.g., 'hls' for HLS streaming).
- `plays-inline` (boolean): Allows the video to play inline on mobile devices.
- `loop` (boolean): Enables looping of the video.
- `cross-origin` (string): Specifies the cross-origin policy for the video (e.g., 'anonymous').
- `video-id` (string): Unique identifier for the video element.
- `muted` (boolean): Mutes the video by default.
- `className` (string): Class name applied to the video element.
- `src` (string): The source of the video file. If `video-source` is 'hls', it uses HLS streaming; otherwise, it uses the provided video file.
- `poster` (string): URL of the poster image displayed before the video plays.

## Slotted Content

- `<button>`: A play/pause button inside the `<irnmn-video>` component that allows users to control the playback of the video.

## Example Usage

```html
<irnmn-video 
    autoplay="true"
    video-source="hls"
    plays-inline="true"
    loop="true"
    cross-origin="anonymous"
    video-id="wp-block-delano-hero-2__video"
    muted
    className="wp-block-delano-hero-2__video" 
    src="https://example.com/video.m3u8" 
    poster="https://example.com/poster.jpg"
>
    <button
        title="Pause video"
        className="wp-block-delano-hero-2__video-button"
    ></button>
</irnmn-video>