// Temp approach to import Hls
import Hls from './vendor/hls.light.min.js';

class IrnmnVideo extends HTMLElement {
    static get observedAttributes() {
        return ['src'];
    }

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupVideo();
        this.setupButton();
    }

    /**
     * Handles changes to observed attributes and triggers necessary updates.
     *
     * This method is called whenever one of the observed attributes changes.
     * It ensures the component is updated accordingly.
     *
     * @param {string} name - The name of the attribute being changed (e.g., 'src').
     * @param {string} oldValue - The previous value of the attribute.
     * @param {string} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.connectedCallback();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                video{
                    width: 100%;
                    min-height: 100%;
                    min-width: 100%;
                    -o-object-fit: cover;
                    object-fit: cover;
                    overflow: hidden;
                    position: relative;
                }
            </style>
            <video
                ${this.getAttribute('video-autoplay') ? 'autoplay' : ''}
                id="${this.getAttribute('video-id') || ''}"
                ${this.getAttribute('video-controls') ? 'controls' : ''}
                ${this.getAttribute('plays-inline') === 'true' ? 'playsinline' : ''}
                ${this.getAttribute('video-loop') === 'true' ? 'loop' : ''}
                ${this.hasAttribute('video-muted') ? 'muted' : ''}
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
        if (this.getAttribute('video-source') !== 'hls' || !Hls.isSupported()) {
            return;
        }

        const video = this.shadowRoot.querySelector('video');
        const hls = new Hls();
        hls.loadSource(video.src);
        hls.attachMedia(video);

        if (this.getAttribute('video-autoplay') === 'true') {
            video.play();
        }
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
