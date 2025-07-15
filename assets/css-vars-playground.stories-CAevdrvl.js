import{x as k}from"./iframe-W51Ka79f.js";import"./style-CSqBeIWT.js";const z=`:root {
    /* => Spacing scale */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 16px;
    --space-4: 24px;
    --space-5: 32px;
    --space-6: 48px;
    --space-7: 64px;
    --space-8: 80px;

    /* => Room card */
    --room-card-background: #ffffff;
    --room-card-padding: 0px;
    --room-card-font-family: Arial, sans-serif;
    --room-card-text-color: #000;

    /* => Slider */
    --room-card-slider-border-radius: 0px;
    --room-card-image-aspect-ratio: 16 / 9;

    /* Badge */
    --room-card-badge-bg: yellow;
    --room-card-badge-color: #000;

    /* => Slider Controls & Indicators */
    --room-card-slider-control-background: rgba(0, 0, 0, 0);
    --room-card-slider-control-color: #ffffff;
    --room-card-slider-control-size: 40px;
    --room-card-slider-control-offset: var(--space-3);
    --room-card-slider-control-padding: var(--space-2);
    --room-card-slider-control-hover-background: var(--room-card-slider-control-background);
    --room-card-slider-control-hover-color: var(--room-card-slider-control-color);

    --room-card-slider-indicator-size: 6px;
    --room-card-slider-indicator-gap: 5px;
    --room-card-slider-indicator-color: var(--room-card-slider-control-color);
    --room-card-slider-indicator-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);

    /* => 360 tour button */
    --room-card-slider-360-pos-right: var(--space-3);
    --room-card-slider-360-pos-top: var(--space-3);
    --room-card-slider-360-color: var(--room-card-slider-control-color);
    --room-card-slider-360-background: var(--room-card-slider-control-background);
    --room-card-slider-360-padding: var(--space-1) var(--space-2);
    --room-card-slider-360-radius: var(--space-1);
    --room-card-slider-360-hover-color: var(--room-card-slider-control-hover-color);
    --room-card-slider-360-hover-background: var(--room-card-slider-360-background);

    /* => Title */
    --room-card-title-font-family: var(--room-card-font-family);
    --room-card-title-font-weight: bold;
    --room-card-title-color: var(--room-card-text-color);
    --room-card-title-padding: 0;

    /* => Description */
    --room-card-description-color: var(--room-card-text-color);
    --room-card-description-padding: 0;
    --room-card-description-line-height: 1.42;

    /* => Extras */
    --room-card-extras-color: #666;
    --room-card-extras-padding: 0;
    --room-card-divider-color: #e0e0e0;
    --room-card-extras-button-radius: var(--space-1);

    /* => More button */
    --room-card-more-button-color: var(--room-card-extras-color);
    --room-card-more-button-hover-color: var(--room-card-text-color);
    --room-card-more-button-background: rgba(0, 0, 0, 0);
    --room-card-more-button-hover-background: rgba(0, 0, 0, 0.1);
    --room-card-more-button-radius: var(--space-1);

    /* => Amenities */
    --room-card-amenities-color: var(--room-card-text-color);
    --room-card-amenities-list-columns: 2;
    --room-card-amenities-list-column-gap: var(--space-4);
    --room-card-amenities-list-padding-left: var(--space-3);
    --room-card-amenities-list-dot-size: var(--space-1);
    --room-card-amenities-list-dot-top: calc(var(--space-1) * 1.5);

    /* => Modal */
    --room-modal-background:#ffffff;
    --room-modal-width: 100%;
    --room-modal-max-width: 870px;
    --room-modal-backdrop: rgba(0, 0, 0, 0.25);
    --room-modal-close-color: var(--room-card-text-color);

    /* => CTA */
    --room-card-cta-color: #fff;
    --room-card-cta-background: #000;
    --room-card-cta-border: none;
    --room-card-cta-hover-color: var(--room-card-cta-background);
    --room-card-cta-hover-background: var(--room-card-cta-color);
    --room-card-cta-hover-border: none;
    --room-card-cta-radius: var(--space-1);

    /* => Font sizes */
    --room-card-slider-360-font-size: 0.875rem;

    --room-card-global-font-size: 0.875rem;
    --room-modal-global-font-size: 1rem;

    --room-card-title-font-size: 1.125rem;
    --room-modal-title-font-size: 1.5rem;

    --room-card-cta-font-size: var(--room-card-global-font-size);
    --room-modal-cta-font-size: var(--room-modal-global-font-size);

}

@media (max-width: 959px) {
    :root {
        /* => Spacing scale */
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 18px;
        --space-5: 24px;
        --space-6: 36px;
        --space-7: 48px;
        --space-8: 60px;

        /* => Font sizes */
        --room-modal-global-font-size: 0.875rem;
    }
}

.room-card {
    display: flex;
    flex-direction: column;
    background-color: var(--room-card-background);
    padding: var(--room-card-padding);
    font-family: var(--room-card-font-family);
    color: var(--room-card-text-color);
}
/* CAROUSEL */
.room-card__slider {
    position: relative;
    width: 100%;
    display: block;
    overflow: hidden;
    border-radius: var(--room-card-slider-border-radius);
}
.room-card__slider-container {
    display: flex;
    transition: transform 0.3s ease;
    width: 100%;
}
.room-card__slider-slide {
    flex-shrink: 0;
    margin: 0;
    width: 100%;
    cursor: grab;
    padding: 0;
}
.room-card__slider-slide figure {
    aspect-ratio: var(--room-card-image-aspect-ratio);
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.room-card__slider-slide img {
    width: 100%;
    height: 100%;
    pointer-events: none;
    -drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
}
.room-card__slider:hover .room-card__slider-slide img{
    transform: scale(1.05);
}
.room-card__slider:hover .room-card__slider-navigation ,
.room-card__slider:focus-within .room-card__slider-navigation {
    opacity: 1;
}
.room-card__slider-navigation {
    opacity: 0;
    transition: opacity 0.3s ease;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
    pointer-events: none;
}
.room-card__slider-prev,
.room-card__slider-next {
    background-color: var(--room-card-slider-control-background);
    color: var(--room-card-slider-control-color);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--room-card-slider-control-size);
    height: var(--room-card-slider-control-size);
    padding: var(--room-card-slider-control-padding);
    border-radius: 50%;
    pointer-events: all;
}
.room-card__slider-prev{
    margin-left: var(--room-card-slider-control-offset);
}
.room-card__slider-next {
    margin-right: var(--room-card-slider-control-offset);
}
.room-card__slider-prev:hover,
.room-card__slider-next:hover {
    background-color: var(--room-card-slider-control-hover-background);
    color: var(--room-card-slider-control-control-color);
}
/* CAROUSEL INDICATORS */
.room-card__slider-indicators {
    position: absolute;
    bottom: var(--space-2);
    left: 50%;
    transform: translateX(-50%);
    width: calc( (5 * var(--room-card-slider-indicator-size)) + (4 * var(--room-card-slider-indicator-gap)));
    height: var(--room-card-slider-indicator-size);
    overflow: hidden;
}
.room-card__slider-indicators ul {
    position: absolute;
    top: 0;
    transform: translateX( calc( (-1 * var(--room-card-slider-indicator-size)) + (-1 * var(--room-card-slider-indicator-gap))) );
    display: flex;
    gap: var(--room-card-slider-indicator-gap);
    list-style: none;
    padding: 0;
    margin: 0;
    width: calc( (7 * var(--room-card-slider-indicator-size)) + (6 * var(--room-card-slider-indicator-gap)));
}
.room-card__slider-indicators li {
    display: block;
    width: var(--room-card-slider-indicator-size);
    height: var(--room-card-slider-indicator-size);
    background-color: var(--room-card-slider-indicator-color);
    border-radius: 50%;
    opacity: 0.5;
    box-shadow: var(--room-card-slider-indicator-box-shadow);
}
.room-card__slider-indicators li:nth-child(4) {
    opacity: 1;
}
.room-card__slider.transitioning-next .room-card__slider-indicators ul,
.room-card__slider.transitioning-prev .room-card__slider-indicators ul{
    transition: .1s transform .18s ease-in-out;
}
.room-card__slider.transitioning-next .room-card__slider-indicators ul{
    transform: translateX( calc( (-2 * var(--room-card-slider-indicator-size)) + (-2 * var(--room-card-slider-indicator-gap))) );
}
.room-card__slider.transitioning-prev .room-card__slider-indicators ul{
    transform: translateX( 0 );
}
.room-card__slider.transitioning-next .room-card__slider-indicators li,
.room-card__slider.transitioning-prev .room-card__slider-indicators li{
    transition: .1s opacity .18s ease-in-out,  .1s transform .18s ease-in-out;
}
.room-card__slider-indicators li:nth-child(1),
.room-card__slider-indicators li:nth-child(7){
    transform: scale(.5);
}
.room-card__slider-indicators li:nth-child(2),
.room-card__slider-indicators li:nth-child(6){
    transform: scale(.65);
}
.room-card__slider-indicators li:nth-child(3),
.room-card__slider-indicators li:nth-child(5){
    transform: scale(.85);
}
.room-card__slider-indicators li:nth-child(4){
    transform: scale(1);
}

.room-card__slider.transitioning-next .room-card__slider-indicators li:nth-child(5){
    transform: scale(1);
    opacity: 1;
}
.room-card__slider.transitioning-next .room-card__slider-indicators li:nth-child(4),
.room-card__slider.transitioning-next .room-card__slider-indicators li:nth-child(6){
    transform: scale(.85);
    opacity: 0.5;
}
.room-card__slider.transitioning-next .room-card__slider-indicators li:nth-child(3),
.room-card__slider.transitioning-next .room-card__slider-indicators li:nth-child(7){
    transform: scale(.65);
}
.room-card__slider.transitioning-prev .room-card__slider-indicators li:nth-child(3){
    opacity: 1;
    transform: scale(1);
}
.room-card__slider.transitioning-prev .room-card__slider-indicators li:nth-child(4),
.room-card__slider.transitioning-prev .room-card__slider-indicators li:nth-child(2){
    opacity: 0.5;
    transform: scale(.85);
}
.room-card__slider.transitioning-prev .room-card__slider-indicators li:nth-child(5),
.room-card__slider.transitioning-prev .room-card__slider-indicators li:nth-child(1){
    transform: scale(.65);
}
/* ROOM CARD 360 BUTTON */
.room-card__slider-360 {
    position: absolute;
    right: var(--room-card-slider-360-pos-right);
    bottom: var(--room-card-slider-360-pos-top);
    color: var(--room-card-slider-360-color);
    background-color: var(--room-card-slider-360-background);
    text-decoration: none;
    font-size: var(--room-card-slider-360-font-size);
    padding: var(--room-card-slider-360-padding);
    border-radius: var(--room-card-slider-360-radius);
    backdrop-filter: blur(6px);
    display: inline-flex;
    align-items: center;
    gap: .2em;
}
.room-card__slider-360:hover {
    color: var(--room-card-slider-360-hover-color);
    background-color: var(--room-card-slider-360-hover-background);
}
.room-card__slider-360 svg {
    height: 1em;
    width: auto;
    vertical-align: middle;
    fill: currentColor;
}
.room-card__badge {
    position: absolute;
    top: var(--space-3);
    left: var(--space-3);
    background-color: var(--room-card-badge-bg);
    color: var(--room-card-badge-color);
    padding: var(--space-1) var(--space-2);
    font-size: 0.750rem;
    border-radius: var(--space-1);
    line-height: 1.2;
}

/* ROOM CARD CONTENT */
.room-card__content {
    padding: var(--space-3) var(--space-2);
    font-size: var(--room-card-global-font-size);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}
.room-card__title {
    font-size: var(--room-card-title-font-size);
    font-family: var(--room-card-title-font-family);
    font-weight: var(--room-card-title-font-weight);
    color: var(--room-card-title-color);
    margin: 0;
    padding: var(--room-card-title-padding);
}
.room-card__description {
    color: var(--room-card-description-color);
    padding: var(--room-card-description-padding);
    margin:0;
    line-height: var(--room-card-description-line-height);
    display: none;
}
.room-card__extras {
    color: var(--room-card-extras-color);
    padding: var(--room-card-extras-padding);
    margin:0;
    display: block;
}
.room-card__extras__list {
    line-height: 1.6;
    padding: 0;
    margin: 0;
}
/* Clamp extras list to one line only in room card (not modal) */
.room-card .room-card__extras__list {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}
.room-card__extras__list span {
    display: inline;
    margin-right: var(--space-2);
    padding: var(--space-1) 0;
    vertical-align: middle;
}
.room-card__extras__list span:not(:last-child)::after {
    content: "";
    display: inline-block;
    width: 1px;
    height: 1rem;
    background: var(--room-card-divider-color);
    margin-left: var(--space-2);
    vertical-align: middle;
}
/* Extras button */
.btn.expand-room-modal {
    margin-top: var(--space-1);
    display: inline-block;
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    position: relative;
    padding: var(--space-1) calc( var(--space-2) + .7rem) var(--space-1) var(--space-1);
    border-radius: var(--room-card-more-button-radius);
    color: var(--room-card-more-button-color);
    background-color: var(--room-card-more-button-background);
}
.btn.expand-room-modal::before,
.btn.expand-room-modal::after {
    content: "";
    position: absolute;
    right: var(--space-1);
    bottom: 50%;
    width: .7rem;
    height: 1px;
    background: currentColor;
    border-radius: var(--space-1);
    pointer-events: none;
}
.btn.expand-room-modal::after {
    transform: rotate(90deg);
}
.btn.expand-room-modal:hover{
    color: var(--room-card-more-button-hover-color);
    background-color: var(--room-card-more-button-hover-background);
}
/* Room card amenities */
.room-card__amenities {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    list-style: none;
    padding: var(--space-4) 0 0 0;
    margin: 0;
    color: var(--room-card-amenities-color);
    border-top: 1px solid var(--room-card-divider-color);
}

.room-card__amenities-title {
    font-weight: bold;
    padding: 0;
    margin: 0;
}
.room-card__amenities-list {
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;
}
.room-card__amenities ul > li {
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
    page-break-inside: avoid;
    padding-left: var(--room-card-amenities-list-padding-left);
    position: relative;
}

/* Desktop styles for amenities */
@media (min-width: 960px) {
    .room-card__amenities-title {
        flex: 1;
    }
    .room-card__amenities-list {
        flex: 2;
        columns: var(--room-card-amenities-list-columns);
        -webkit-columns: var(--room-card-amenities-list-columns);
        -moz-columns: var(--room-card-amenities-list-columns);
        column-gap: var(--room-card-amenities-list-column-gap);
        column-fill: balance;
    }
}
.room-card__amenities ul > li::before {
    content: "";
    height: var(--room-card-amenities-list-dot-size);
    width: var(--room-card-amenities-list-dot-size);
    background-color: var(--room-card-amenities-color);
    position: absolute;
    left: 0;
    top: var(--room-card-amenities-list-dot-top);
}
.room-card__pricing{
    text-align: right;
}
.room-card__pricing-cta{
    color: var(--room-card-cta-color);
    background-color: var(--room-card-cta-background);
    text-decoration: none;
    padding: var(--space-2) var(--space-3);
    line-height: 140%;
    border-radius: var(--room-card-cta-radius);
    display: inline-block;
    font-size: var(--room-card-cta-font-size);
    border: var(--room-card-cta-border);
    cursor: pointer;
    transition: color 0.3s ease, background-color 0.3s ease, border 0.3s ease;

    @media (max-width: 959px) {
        display: block;
        width: 100%;
    }
}
.room-card__pricing-cta:hover {
    color: var(--room-card-cta-hover-color);
    background-color: var(--room-card-cta-hover-background);
    border: var(--room-card-cta-hover-border);
}

@media (min-width: 960px) {

    /* Styles for one-column layout */
    .--one-column .room-card {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: var(--space-5);
    }

    .--one-column .room-card__slider {
        flex: 1 1 auto;
        min-width: 0;
        max-width: 100%;
        align-self: flex-start;
    }

    .--one-column .room-card__content {
        flex: 0 1 510px;
        max-width: 50%;
        min-width: 510px;
        padding: 0;
        justify-content: end;
        gap : var(--space-4);
    }

    .--one-column .room-card__description {
        display: block;
    }

}

@media (max-width: 959px) {

    .room-card__content {
        padding: var(--space-3) var(--space-4);
        gap: var(--space-3);
    }

}

/* MODAL STYLES */

/* Lock body scroll when modal is open */
body.irnmn-modal-open {
    overflow: hidden;
}

.room-modal .irnmn-modal {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 1000; /* adjust as needed */
    padding: 0;
    margin: 0;
    border: none;
    align-items: center;
    justify-content: center;
}
.room-modal .irnmn-modal::backdrop {
    background-color: var(--room-modal-backdrop);
}
.room-modal .irnmn-modal--visible {
    display: flex;
}
.room-modal .irnmn-modal__container {
    all: unset;
    display: block;
    z-index: 9999;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 0;
    box-sizing: border-box;
    background-color: var(--room-modal-background);
    font-family: var(--room-card-font-family);
    color: var(--room-card-text-color);
    width: var(--room-modal-width);
    max-width: var(--room-modal-max-width);
    padding: var(--space-7) var(--space-6) 0 var(--space-6);

    @media (max-width: 959px) {
        padding: var(--space-7) 0 0 0;
    }
}
.room-modal .room-modal__inner{
    padding: 0 0 var(--space-7) 0;
    overflow: auto;
    max-height: calc( 100vh - 2 * var(--space-6) - var(--space-7) );

    @media (max-width: 959px) {
        padding: 0 0 var(--space-3) 0;
        max-height: calc( 100vh - var(--space-7) );
    }
}
.room-modal .irnmn-modal__close {
    position: fixed;
    padding: 0;
    top: var(--space-4);
    right: var(--space-6);
    height: var(--space-3);
    width: var(--space-3);
    overflow: hidden;
    text-indent: 200%;
    cursor: pointer;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9.89922 9.0002L16.7617 2.1377C17.0148 1.88457 17.0148 1.49082 16.7617 1.2377C16.5086 0.98457 16.1148 0.98457 15.8617 1.2377L8.99922 8.10019L2.13672 1.2377C1.88359 0.98457 1.48984 0.98457 1.23672 1.2377C0.983594 1.49082 0.983594 1.88457 1.23672 2.1377L8.09922 9.0002L1.23672 15.8627C0.983594 16.1158 0.983594 16.5096 1.23672 16.7627C1.34922 16.8752 1.51797 16.9596 1.68672 16.9596C1.85547 16.9596 2.02422 16.9033 2.13672 16.7627L8.99922 9.9002L15.8617 16.7627C15.9742 16.8752 16.143 16.9596 16.3117 16.9596C16.4805 16.9596 16.6492 16.9033 16.7617 16.7627C17.0148 16.5096 17.0148 16.1158 16.7617 15.8627L9.89922 9.0002Z" fill="black"/></svg>') center/60% no-repeat;
    background-color: transparent;
    background-size: contain;
    border: none;

    @media (max-width: 959px) {
        height: var(--space-4);
        width: var(--space-4);
        top: var(--space-4);
        right: var(--space-4);
    }
}
.room-modal .room-card__content{
    padding: var(--space-5) 0 0 0;
    gap: var(--space-4);
    width: auto;
    max-width: none;
    min-width: 0;
    font-size: var(--room-modal-global-font-size);

    @media (max-width: 959px) {
        padding: var(--space-4);
    }
}
.room-modal .room-card__extras{
    @media (min-width: 960px) {
        font-size: calc( var(--room-card-content-font-size) * 1.15); /* 16px */
    }
}
.room-modal .room-card__description {
    display: block;
}
.room-modal .room-card__title {
    font-size: var(--room-modal-title-font-size);
}
.room-modal .room-modal__header{
    @media (min-width: 960px) {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
.room-modal .room-card__pricing-cta {
    padding: var(--space-2) var(--space-4);
    font-size: var(--room-modal-cta-font-size);
}
.room-modal .room-modal__header .room-card__pricing{
    @media (max-width: 959px) {
        display:none;
    }
}
.room-modal .room-card__content > .room-card__pricing{
    @media (min-width: 960px) {
        display:none;
    }
}
`,C=""+new URL("all-brands-fonts-DiSmEnE4.css",import.meta.url).href,f={};let h="Global";const S=z.split(`
`);for(const o of S){const r=o.match(/\/\*\s*=>\s*(.+?)\s*\*\//);r&&(h=r[1].trim());const a=o.match(/--([a-zA-Z0-9-_]+)\s*:\s*(.+?);/);if(a){const e=`--${a[1]}`,t=a[2].trim();let i=!1,n="";const d=t.match(/^var\((--[a-zA-Z0-9-_]+)\)$/);d&&(i=!0,n=d[1]),f[e]={name:e,rawValue:t,isReference:i,referenceTarget:n,category:h}}}const u=(o,r=new Set)=>{if(r.has(o))return{};r.add(o);const a=f[o];return a?a.isReference?u(a.referenceTarget,r):a:{}},c={},v=Object.keys(f);for(const o of v){const r=f[o],a=r.isReference?u(r.referenceTarget):{};let e="text",t=r.rawValue,i="";const n=r.isReference?a.rawValue:r.rawValue;/^#[0-9a-f]{3,6}$/i.test(n)||/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*(?:\d*\.?\d+)\s*)?\)$/i.test(n)?e="color":/^\d*\.?\d+px$/.test(n)?(t=parseFloat(n),e={type:"range",min:0,max:t>100?1e3:100},i="px"):/^\d*\.?\d+rem$/.test(n)?(t=parseFloat(n),e={type:"range",min:0,max:5,step:.125},i="rem"):/^\d*\.?\d+%$/.test(n)&&(t=parseFloat(n),e={type:"range",min:0,max:100},i="%");const d=o.replace("--","").replace("room-card","").replace(/-/g," ")+(i?` (${i})`:""),m=v.filter(p=>{if(p===o)return!1;const l=u(p);if(!l)return!1;const s=l.rawValue;return e==="color"?/^#[0-9a-f]{3,6}$/i.test(s):!!(i&&s.endsWith(i)||!i&&!/^#[0-9a-f]{3,6}$/i.test(s)&&!/px|rem|%/.test(s))});c[`__switch__${o}`]={name:`${d} Mode`,control:{type:"inline-radio"},options:["Custom","Reference"],defaultValue:r.isReference?"Reference":"Custom",table:{category:r.category}},c[o]={name:` ↳ ${d}`,control:e,defaultValue:r.isReference?void 0:t,unit:i,table:{category:r.category},if:{arg:`__switch__${o}`,eq:"Custom"}},c[`__ref__${o}`]={name:` ↳ ${d} Ref`,control:{type:"select"},options:e!="text"?m:v,defaultValue:r.isReference?r.referenceTarget:m[0],table:{category:r.category},if:{arg:`__switch__${o}`,eq:"Reference"}}}const $=o=>{var r;for(const a of v){const e=o[`__switch__${a}`],t=o[`__ref__${a}`],i=o[a],n=((r=c[a])==null?void 0:r.unit)??"",d=e==="Reference"?`var(${t})`:`${i}${n}`;document.documentElement.style.setProperty(a,d)}},O={title:"Playground/Live Editor",argTypes:c},R=o=>{$(o);const r=E(o),a=Object.entries(r).map(([e,t])=>`${e}: ${t};`).join(`
`);return V(C),setTimeout(()=>{const e=document.getElementById("show-css-btn"),t=document.getElementById("css-modal"),i=document.getElementById("css-preview");e&&t&&i&&(e.onclick=()=>{i.textContent=a||"/* Aucun changement */",t.showModal()})},0),k`
      <div style="margin-bottom: 2rem; border: 1px dashed gray;">
        <irnmn-room-card
          room-code="D2A"
          checkin-date-name="checkin"
          checkout-date-name="checkout"
          date-name="checkInOutDates"
          date-locale="en"
          title="DELUXE SEA VIEW"
          description="Stay in the comfort and warmth with description dio porta dis augue parturient condimentum mi diam lacus, praesent varius ante sapien gravida vestibulum class cras integer risus."
          images='[{"url":"https://picsum.photos/id/10/300/200","alt":"Room image 1"},{"url":"https://picsum.photos/id/89/300/200","alt":"Room image 2"},{"url":"https://picsum.photos/id/12/300/200","alt":"Room image 3"}]'
          link-360="https://example.com/room-details"
          extras='["1-2 Guests", "Queen Bed", "28 m²", "City View"]'
          room-amenities='["Malin+Goetz shower amenities","High-def smart TV", "Mini-bar", "Safe", "Lavazza coffee and tea"]'
          hotel-amenities='["Spa & Wellness", "High-Speed wifi", "Luxury Concierge", "Private Parking", "Bicycle rental"]'
          labels='{"placeholder":"Add dates for prices","heading":"Select date for prices","from":"From","night":"Night","legalText":"(inc taxes and fees)","noRates":"No availability on those dates","noRatesMessage":"Please select different dates"}'
        ></irnmn-room-card>
      </div>

      <button id="show-css-btn" style="margin-bottom: 1rem; padding: 0.5rem 1rem;">
        See CSS
      </button>

      <dialog id="css-modal" style="max-width: 600px; padding: 1rem; border-radius: 8px;">
        <form method="dialog">
          <button style="float: right;">❌</button>
        </form>
        <h3>🎨 CSS Overrides</h3>
        <pre><code id="css-preview" style="background: #f4f4f4; padding: 1rem; border-radius: 5px; display: block;"></code></pre>
      </dialog>
    `},E=o=>{var a,e,t,i;const r={};for(const n of Object.keys(f)){const d=o[`__switch__${n}`],m=o[`__ref__${n}`],p=o[n],l=((a=c[n])==null?void 0:a.unit)??"",s=(e=c[`__switch__${n}`])==null?void 0:e.defaultValue,y=(t=c[n])==null?void 0:t.defaultValue,w=(i=c[`__ref__${n}`])==null?void 0:i.defaultValue;d==="Reference"?(d!==s||m!==w)&&(r[n]=`var(${m})`):d==="Custom"&&(d!==s||`${p}${l}`!=`${y}${l}`)&&(r[n]=`${p}${l}`)}return r},V=o=>{if(document.querySelector(`link[href="${o}"]`))return;const r=document.createElement("link");r.rel="stylesheet",r.href=o,document.head.appendChild(r)},g=R.bind({});g.args=Object.fromEntries(Object.entries(c).map(([o,r])=>[o,r.defaultValue]));var _,b,x;g.parameters={...g.parameters,docs:{...(_=g.parameters)==null?void 0:_.docs,source:{originalSource:`(args: Record<string, any>) => {
  applyCssVars(args);
  const changedVars = getChangedVars(args);
  const cssText = Object.entries(changedVars).map(([key, value]) => \`\${key}: \${value};\`).join('\\n');
  loadExternalFontStylesheet(allBrandsFonts);
  setTimeout(() => {
    // Set up the button to show CSS overrides
    const btn = document.getElementById('show-css-btn');
    const dlg = document.getElementById('css-modal') as HTMLDialogElement;
    const pre = document.getElementById('css-preview');
    if (btn && dlg && pre) {
      btn.onclick = () => {
        pre.textContent = cssText || '/* Aucun changement */';
        dlg.showModal();
      };
    }
  }, 0);
  return html\`
      <div style="margin-bottom: 2rem; border: 1px dashed gray;">
        <irnmn-room-card
          room-code="D2A"
          checkin-date-name="checkin"
          checkout-date-name="checkout"
          date-name="checkInOutDates"
          date-locale="en"
          title="DELUXE SEA VIEW"
          description="Stay in the comfort and warmth with description dio porta dis augue parturient condimentum mi diam lacus, praesent varius ante sapien gravida vestibulum class cras integer risus."
          images='[{"url":"https://picsum.photos/id/10/300/200","alt":"Room image 1"},{"url":"https://picsum.photos/id/89/300/200","alt":"Room image 2"},{"url":"https://picsum.photos/id/12/300/200","alt":"Room image 3"}]'
          link-360="https://example.com/room-details"
          extras='["1-2 Guests", "Queen Bed", "28 m²", "City View"]'
          room-amenities='["Malin+Goetz shower amenities","High-def smart TV", "Mini-bar", "Safe", "Lavazza coffee and tea"]'
          hotel-amenities='["Spa & Wellness", "High-Speed wifi", "Luxury Concierge", "Private Parking", "Bicycle rental"]'
          labels='{"placeholder":"Add dates for prices","heading":"Select date for prices","from":"From","night":"Night","legalText":"(inc taxes and fees)","noRates":"No availability on those dates","noRatesMessage":"Please select different dates"}'
        ></irnmn-room-card>
      </div>

      <button id="show-css-btn" style="margin-bottom: 1rem; padding: 0.5rem 1rem;">
        See CSS
      </button>

      <dialog id="css-modal" style="max-width: 600px; padding: 1rem; border-radius: 8px;">
        <form method="dialog">
          <button style="float: right;">❌</button>
        </form>
        <h3>🎨 CSS Overrides</h3>
        <pre><code id="css-preview" style="background: #f4f4f4; padding: 1rem; border-radius: 5px; display: block;"></code></pre>
      </dialog>
    \`;
}`,...(x=(b=g.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};const M=["LiveEditor"];export{g as LiveEditor,M as __namedExportsOrder,O as default};
