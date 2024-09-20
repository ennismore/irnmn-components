// Temp approach to import Hls 
import Hls from './vendor/hls.light.min.js';

class IrnmnVideo extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupVideo();
        this.setupButton();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <video
                autoplay="${this.getAttribute('autoplay') === 'true'}"
                id="${this.getAttribute('video-id') || ''}"
                controls
                ${this.getAttribute('plays-inline') === 'true' ? 'playsinline' : ''}
                ${this.getAttribute('loop') === 'true' ? 'loop' : ''}
                ${this.hasAttribute('muted') ? 'muted' : ''}
                ${this.getAttribute('cross-origin') ? `crossorigin="${this.getAttribute('cross-origin')}"` : ''}
                poster="${this.getAttribute('poster') || ''}"
                src="${this.getAttribute('src') || ''}" 
            >
            </video>
            <slot></slot>
        `;
    }

    /**
     * Sets up the video element based on the video source type.
     *
     * If the video source is HLS, it initializes HLS streaming using the HlsVideo library.
     * For non-HLS sources, it starts playing the video natively.
     *
     * @returns {void}
     */
    setupVideo() {

        if (this.getAttribute('video-source') !== 'hls' || ! Hls.isSupported() ) {
            return;
        }

        const video = this.shadowRoot.querySelector('video');
        const hls = new Hls();
        hls.loadSource(video.src);
        hls.attachMedia(video);

    }

    /**
     * Sets up the play/pause button for the video element.
     *
     * If a button is present in the component, it links to the video player.
     * When the button is clicked, the video will toggle between play and pause.
     *
     * @returns {void} 
     */
    setupButton() {
    
        const video = this.shadowRoot.querySelector('video');
        const button = this.querySelector('button');

        button?.addEventListener('click', () => {
            
            // Toggle play/pause state
            video.paused ? video.play() : video.pause();
        
            // Update button class and title for UI and Accessibility purposes
            button.classList.toggle('--paused', video.paused);
            button.title = video.paused ? 'Pause video' : 'Play video';

        });

    }
}

customElements.define('irnmn-video', IrnmnVideo);