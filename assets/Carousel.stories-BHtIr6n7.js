var z=Object.defineProperty;var q=(c,s,e)=>s in c?z(c,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):c[s]=e;var a=(c,s,e)=>q(c,typeof s!="symbol"?s+"":s,e);import{x as h}from"./iframe-CrMPBTju.js";class K{constructor(s,e={}){this.viewport=s,this.debug=!!e.debug,this._prefersReducedMotion=e.prefersReducedMotion||(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches),this._rtlScrollType=null}isRTL(){return getComputedStyle(this.viewport).direction==="rtl"}getMaxScroll(){return this.viewport.scrollWidth-this.viewport.clientWidth}getGapPx(){const s=getComputedStyle(this.viewport);return parseFloat(s.columnGap)||parseFloat(s.gap)||0}getEpsilonPx(){const s=this.getGapPx()/2||6;return Math.max(2,Math.min(12,s))}getScrollPaddingStart(){const s=getComputedStyle(this.viewport);return this.isRTL()?parseFloat(s.scrollPaddingRight)||0:parseFloat(s.scrollPaddingLeft)||0}getRTLScrollType(){if(this._rtlScrollType)return this._rtlScrollType;if(!this.viewport||getComputedStyle(this.viewport).direction!=="rtl")return this._rtlScrollType="default",this._rtlScrollType;const s=document.createElement("div");s.dir="rtl",s.style.cssText=["position:absolute","top:-9999px","left:-9999px","width:100px","height:1px","overflow:scroll","scroll-snap-type:none","contain:layout style paint","visibility:hidden"].join(";");const e=document.createElement("div");e.style.width="200px",e.style.height="1px",s.appendChild(e),document.body.appendChild(s);try{const t=s.scrollWidth-s.clientWidth;return s.scrollLeft=0,s.scrollLeft=1,s.scrollLeft===0?(this._rtlScrollType="negative",this._rtlScrollType):(s.scrollLeft=t,this._rtlScrollType=s.scrollLeft===t?"default":"reverse",this._rtlScrollType)}finally{document.body.removeChild(s)}}getScrollPosition(){const e=this.viewport.scrollLeft;if(!this.isRTL())return e;const t=this.getMaxScroll(),r=this.getRTLScrollType();return r==="negative"?-e:r==="reverse"?t-e:e}scrollToLogicalPosition(s,e={}){const t=this.viewport,r=this.getMaxScroll(),i=Math.max(0,Math.min(r,s));let l=i;if(this.isRTL()){const n=this.getRTLScrollType();n==="negative"?l=-i:n==="reverse"&&(l=r-i)}const o=e.behavior||(this._prefersReducedMotion()?"auto":"smooth");t.scrollTo({left:l,behavior:o})}resetToStartInstant(){this.scrollToLogicalPosition(0,{behavior:"auto"})}isAtStart(){return this.getScrollPosition()<=this.getEpsilonPx()}isAtEnd(){return this.getScrollPosition()>=this.getMaxScroll()-this.getEpsilonPx()}isOverflowing(){return this.viewport&&this.viewport.scrollWidth-this.viewport.clientWidth>1}resetCaches(){this._rtlScrollType=null}}class ${constructor({viewport:s,getSlides:e,scroll:t,debug:r=!1}){this.viewport=s,this.getSlides=e,this.scroll=t,this.debug=!!r,this.snapLefts=[],this.virtualPages=[]}calculateSnapLefts(){const s=this.getSlides(),e=this.scroll.isRTL(),t=this.scroll.getScrollPosition(),r=this.scroll.getEpsilonPx(),i=this.viewport.getBoundingClientRect(),l=this.scroll.getScrollPaddingStart(),o=e?i.right-l:i.left+l;return this.snapLefts=s.map(n=>{const p=n.getBoundingClientRect(),d=e?p.right:p.left,_=e?o-d:d-o,u=t+_;return Math.abs(u)<r||u<0?0:u}),this.debug&&console.info("[IRNMNCarousel] snapLefts (unclamped)",this.snapLefts),this.snapLefts}getPrevSnapPosition(s){const e=this.scroll.getEpsilonPx();for(let t=this.snapLefts.length-1;t>=0;t--)if(this.snapLefts[t]<s-e)return this.snapLefts[t];return null}getNextSnapPosition(s){const e=this.scroll.getEpsilonPx();for(let t=0;t<this.snapLefts.length;t++)if(this.snapLefts[t]>s+e)return this.snapLefts[t];return null}getClosestSnapIndex(s){let e=0,t=1/0;const r=this.scroll.getEpsilonPx();for(let i=0;i<this.snapLefts.length;i++){const l=Math.abs(this.snapLefts[i]-s);l<t-r&&(t=l,e=i)}return e}calculateVirtualPages(s){if(s!=="pages")return this.virtualPages=[],this.virtualPages;if(!this.snapLefts.length)return this.virtualPages=[],this.virtualPages;const e=this.getSlides(),t=this.scroll.getMaxScroll(),r=this.scroll.getEpsilonPx(),i=[{snapPosition:0,slideIndices:this.getVisibleSlideIndices(0)}];let l=0;for(;l<t-r;){const o=this.getNextSnapPosition(l);if(o===null){l<t-r&&i.push({snapPosition:t,slideIndices:[e.length-1]});break}const n=this.getVisibleSlideIndices(o);i.push({snapPosition:o,slideIndices:n}),l=o}return this.virtualPages=i,this.debug&&(console.info("[IRNMNCarousel] Virtual pages:",this.virtualPages.length,this.virtualPages),console.info("[IRNMNCarousel] Viewport width:",this.viewport.clientWidth),console.info("[IRNMNCarousel] Max scroll:",t)),this.virtualPages}getVisibleSlideIndices(s){const e=this.getSlides(),t=this.scroll.getEpsilonPx(),r=this.viewport.getBoundingClientRect(),i=r.left,l=r.right,o=this.scroll.getScrollPosition(),n=s-o,p=[];return e.forEach((d,_)=>{const u=d.getBoundingClientRect(),F=u.left-n;u.right-n>i+t&&F<l-t&&p.push(_)}),p}}class X{constructor(){a(this,"host",null);a(this,"ariaLiveRegion",null);a(this,"_lastAnnouncedKey",null)}mount(s){s&&(this.host=s,!(this.ariaLiveRegion&&this.host.contains(this.ariaLiveRegion))&&(this.ariaLiveRegion=document.createElement("div"),this.ariaLiveRegion.setAttribute("aria-live","polite"),this.ariaLiveRegion.setAttribute("aria-atomic","true"),this.ariaLiveRegion.classList.add("visually-hidden"),Object.assign(this.ariaLiveRegion.style,{position:"absolute",height:"1px",width:"1px",overflow:"hidden",clip:"rect(1px, 1px, 1px, 1px)",whiteSpace:"nowrap"}),this.host.appendChild(this.ariaLiveRegion)))}unmount(){this.host&&this.ariaLiveRegion&&this.host.contains(this.ariaLiveRegion)&&this.host.removeChild(this.ariaLiveRegion),this.ariaLiveRegion=null,this.host=null,this._lastAnnouncedKey=null}reset(){this._lastAnnouncedKey=null}announce(s,e){this.ariaLiveRegion&&this._lastAnnouncedKey!==s&&(this._lastAnnouncedKey=s,this.ariaLiveRegion.textContent=e)}announceSlide(s,e){const t=s+1;this.announce(`slide:${t}/${e}`,`Item ${t} of ${e}`)}announcePage(s,e){const t=s+1;this.announce(`page:${t}/${e}`,`Page ${t} of ${e}`)}}class j extends HTMLElement{constructor(){super();a(this,"CLASSNAMES",[]);a(this,"slides",[]);a(this,"currentIndex",-1);a(this,"currentPageIndex",-1);a(this,"viewport",null);a(this,"prevBtn",null);a(this,"nextBtn",null);a(this,"pagerCurrent",null);a(this,"pagerTotal",null);a(this,"scroll",null);a(this,"snap",null);a(this,"announcer",null);a(this,"debug",!1);a(this,"pagerMode","pages");a(this,"_abortController",null);a(this,"_signal",null);a(this,"_resizeObserver",null);a(this,"_scrollSettledTimer",null);a(this,"_scrollSettledDelay",120);a(this,"_scrollRafId",null);a(this,"connected",!1);this.CLASSNAMES=this.selectors;const e=new URLSearchParams(window.location.search);this.debug=e.has("debugCarousel"),this.debug&&console.info("[IRNMNCarousel] Constructor",this.CLASSNAMES)}get selectors(){let e=this.getAttribute("selectors");const t={};try{e=e?JSON.parse(e):{}}catch(r){return console.error("[IRNMNCarousel] Error parsing selectors:",r),t}for(const r in e)t[r.toUpperCase()]=e[r];return t}get prefersReducedMotion(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}addListener(e,t,r,i={}){e&&e.addEventListener(t,r,{...i,signal:this._signal})}connectedCallback(){if(this.connected)return;this._abortController=new AbortController,this._signal=this._abortController.signal;const e=this.initCarousel();this.connected=e}disconnectedCallback(){var e,t,r;this._scrollSettledTimer&&clearTimeout(this._scrollSettledTimer),this._scrollRafId&&cancelAnimationFrame(this._scrollRafId),(e=this.announcer)==null||e.unmount(),(t=this._abortController)==null||t.abort(),(r=this._resizeObserver)==null||r.disconnect(),this.connected=!1,this.debug&&console.info("[IRNMNCarousel] Cleaned up")}initCarousel(){const e=this.querySelector(this.CLASSNAMES.VIEWPORT);if(!e)return console.error("[IRNMNCarousel] Viewport not found"),!1;this.viewport=e,this.viewport.setAttribute("tabindex","0"),this.viewport.setAttribute("role","region"),this.viewport.setAttribute("aria-roledescription","carousel"),this.scroll=new K(this.viewport,{debug:this.debug,prefersReducedMotion:()=>this.prefersReducedMotion}),this.snap=new $({viewport:this.viewport,getSlides:()=>this.slides,scroll:this.scroll,debug:this.debug}),this.announcer=new X,this.announcer.mount(this),this.scroll.resetToStartInstant();const t=this.getAttribute("pager-mode");return(t==="slides"||t==="pages")&&(this.pagerMode=t),this.slides=Array.from(e.querySelectorAll(this.CLASSNAMES.SLIDES)),this.prevBtn=this.querySelector(this.CLASSNAMES.PREV_BUTTON),this.nextBtn=this.querySelector(this.CLASSNAMES.NEXT_BUTTON),this.pagerCurrent=this.querySelector(this.CLASSNAMES.CURRENT_SLIDE),this.pagerTotal=this.querySelector(this.CLASSNAMES.TOTAL_SLIDES),this.initSlidesAttributes(),this.snap.calculateSnapLefts(),this.snap.calculateVirtualPages(this.pagerMode),this.updateTotal(),this.syncOverflowState(),this.addScrollListener(),this.addControlsListeners(),this.addKeyboardSupport(),this.setupResizeObserver(),requestAnimationFrame(()=>{this.snap.calculateSnapLefts(),this.snap.calculateVirtualPages(this.pagerMode),this.updateTotal(),this.syncOverflowState(),this.updateActiveFromScroll()}),!0}initSlidesAttributes(){const e=this.slides.length;this.slides.forEach((t,r)=>{t.setAttribute("role","group"),t.setAttribute("aria-roledescription","slide"),t.hasAttribute("aria-label")||t.setAttribute("aria-label",`Item ${r+1} of ${e}`),t.removeAttribute("tabindex")})}updateTotal(){var e,t;this.pagerTotal&&(this.pagerMode==="pages"?this.pagerTotal.textContent=String(((t=(e=this.snap)==null?void 0:e.virtualPages)==null?void 0:t.length)||1):this.pagerTotal.textContent=String(this.slides.length))}updateActiveFromScroll({announce:e=!1}={}){var o,n;if(!((n=(o=this.snap)==null?void 0:o.snapLefts)!=null&&n.length))return;const t=this.scroll.getScrollPosition(),r=this.scroll.getMaxScroll(),i=this.scroll.getEpsilonPx();if(this.pagerMode==="pages"){this.updateActivePageFromScroll({announce:e});const p=t>=r-i?this.slides.length-1:this.snap.getClosestSnapIndex(t);this.setActiveIndex(p,{announce:!1,updatePager:!1}),this.updateControlsDisabledState();return}if(t>=r-i){this.setActiveIndex(this.slides.length-1,{announce:e}),this.updateControlsDisabledState();return}const l=this.snap.getClosestSnapIndex(t);this.setActiveIndex(l,{announce:e}),this.updateControlsDisabledState()}setActiveIndex(e,{announce:t=!1,updatePager:r=!0}={}){if(e===this.currentIndex){t&&this.announcer.announceSlide(e,this.slides.length);return}this.currentIndex=e,this.slides.forEach((i,l)=>{i.classList.toggle("active-slide",l===e)}),r&&this.pagerCurrent&&(this.pagerCurrent.textContent=String(e+1)),t&&this.announcer.announceSlide(e,this.slides.length),this.dispatchEvent(new CustomEvent("carouselChange",{bubbles:!0,detail:{currentIndex:e,currentElement:this.slides[e],total:this.slides.length}}))}updateActivePageFromScroll({announce:e=!1}={}){var n,p;if(this.pagerMode!=="pages"||!((p=(n=this.snap)==null?void 0:n.virtualPages)!=null&&p.length))return;const t=this.scroll.getScrollPosition(),r=this.scroll.getMaxScroll(),i=this.scroll.getEpsilonPx();if(t>=r-i){this.setActivePageIndex(this.snap.virtualPages.length-1,{announce:e});return}let l=0,o=1/0;this.snap.virtualPages.forEach((d,_)=>{const u=Math.abs(d.snapPosition-t);u<o&&(o=u,l=_)}),this.setActivePageIndex(l,{announce:e})}setActivePageIndex(e,{announce:t=!1}={}){if(e===this.currentPageIndex){t&&this.announcer.announcePage(e,this.snap.virtualPages.length);return}this.currentPageIndex=e,this.pagerCurrent&&(this.pagerCurrent.textContent=String(e+1)),t&&this.announcer.announcePage(e,this.snap.virtualPages.length)}goPrev(){const e=this.scroll.getScrollPosition(),t=this.scroll.getEpsilonPx(),r=this.scroll.isAtEnd()?this.scroll.getMaxScroll()+t*2:e,i=this.snap.getPrevSnapPosition(r);i!==null&&this.scroll.scrollToLogicalPosition(i)}goNext(){const e=this.scroll.getScrollPosition(),t=this.snap.getNextSnapPosition(e);if(t!==null){this.scroll.scrollToLogicalPosition(t);return}this.scroll.scrollToLogicalPosition(this.scroll.getMaxScroll())}goFirst(){this.scroll.scrollToLogicalPosition(0)}goLast(){this.scroll.scrollToLogicalPosition(this.scroll.getMaxScroll())}addControlsListeners(){this.addListener(this.prevBtn,"click",()=>this.goPrev()),this.addListener(this.nextBtn,"click",()=>this.goNext())}addKeyboardSupport(){this.addListener(this.viewport,"keydown",e=>{if(!this.contains(document.activeElement)||document.activeElement&&["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;const t=this.scroll.isRTL();switch(e.key){case"ArrowRight":e.preventDefault(),t?this.goPrev():this.goNext();break;case"ArrowLeft":e.preventDefault(),t?this.goNext():this.goPrev();break;case"Home":e.preventDefault(),this.goFirst();break;case"End":e.preventDefault(),this.goLast();break}})}updateControlsDisabledState(){var e;if(!((e=this.scroll)!=null&&e.isOverflowing())){this.prevBtn&&(this.prevBtn.disabled=!0),this.nextBtn&&(this.nextBtn.disabled=!0);return}this.prevBtn&&(this.prevBtn.disabled=this.scroll.isAtStart()),this.nextBtn&&(this.nextBtn.disabled=this.scroll.isAtEnd())}syncOverflowState(){const e=this.scroll.isOverflowing();this.classList.toggle("is-overflowing",e),this.prevBtn&&(this.prevBtn.disabled=!e),this.nextBtn&&(this.nextBtn.disabled=!e)}setupResizeObserver(){this._resizeObserver=new ResizeObserver(()=>{this.connected&&(this.snap.calculateSnapLefts(),this.snap.calculateVirtualPages(this.pagerMode),this.updateTotal(),this.syncOverflowState(),this.updateActiveFromScroll())}),this._resizeObserver.observe(this.viewport)}addScrollListener(){this.addListener(this.viewport,"scroll",()=>{this._scrollRafId||(this._scrollRafId=requestAnimationFrame(()=>{this.updateActiveFromScroll({announce:!1}),this.scheduleScrollSettled(),this._scrollRafId=null}))},{passive:!0})}scheduleScrollSettled(){clearTimeout(this._scrollSettledTimer),this._scrollSettledTimer=setTimeout(()=>{this.updateActiveFromScroll({announce:!0})},this._scrollSettledDelay)}refresh(){var e;this.slides=Array.from(this.viewport.querySelectorAll(this.CLASSNAMES.SLIDES)),this.snap.calculateSnapLefts(),this.snap.calculateVirtualPages(this.pagerMode),this.updateTotal(),this.updateActiveFromScroll(),(e=this.announcer)==null||e.reset()}next(){this.goNext()}prev(){this.goPrev()}}customElements.get("irnmn-carousel")||customElements.define("irnmn-carousel",j);const G=`# IRNMNCarousel

\`<irnmn-carousel>\` is a **scroll-snap based, variable-width carousel Web Component**.

It relies on **native scrolling + CSS scroll-snap** and adds a logical navigation layer on top: buttons, keyboard support, RTL normalization, pager handling (slides or pages), and accessible announcements.

The component is intentionally **layout-agnostic**: it does not impose markup or styles beyond what it queries via selectors.

---

## Features

- Native horizontal scrolling with CSS \`scroll-snap\`
- Variable-width slides
- **Active slide = closest left snap point**
- When reaching physical scroll end, **last slide becomes active** (logical)
- Prev / Next navigation with a virtual **END step** (\`maxScroll\`)
- Pager modes:
  - \`slides\` → slide-based indexing
  - \`pages\` → virtual page indexing
- RTL scroll normalization (Chrome / Safari / Firefox models)
- Keyboard support: Arrow keys, Home / End
- \`aria-live\` announcements (polite)
- Resize-aware (recomputes geometry on resize)
- Public API for refresh / navigation
- Emits a \`carouselChange\` event on active change

---

## Expected markup

The component discovers its internal elements through a \`selectors\` attribute (JSON).

Example:

\`\`\`html
<irnmn-carousel
  pager-mode="slides"
  selectors='{
    "viewport": ".carousel__viewport",
    "slides": ".carousel__slide",
    "prev_button": ".carousel__prev",
    "next_button": ".carousel__next",
    "current_slide": ".carousel__current",
    "total_slides": ".carousel__total"
  }'
>
  <button class="carousel__prev" type="button">Prev</button>
  <button class="carousel__next" type="button">Next</button>

  <div class="carousel__viewport">
    <div class="carousel__slide">Slide 1</div>
    <div class="carousel__slide">Slide 2</div>
    <div class="carousel__slide">Slide 3</div>
  </div>

  <div class="carousel__pager" aria-hidden="true">
    <span class="carousel__current">1</span> /
    <span class="carousel__total">0</span>
  </div>
</irnmn-carousel>
\`\`\`

---

## Required CSS (minimum)

You are responsible for applying scroll-snap and layout styles.

\`\`\`css
.carousel__viewport {
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  gap: 16px; /* used internally for epsilon heuristics */
  scroll-padding-left: 0px;
  scroll-padding-right: 0px;
}

.carousel__slide {
  flex: 0 0 auto;
  scroll-snap-align: start;
}
\`\`\`

Optional: hide controls when the carousel is not overflowing.

\`\`\`css
irnmn-carousel:not(.is-overflowing) .carousel__prev,
irnmn-carousel:not(.is-overflowing) .carousel__next {
  display: none;
}
\`\`\`

---

## Configuration

### \`selectors\` (attribute)

JSON mapping internal roles to CSS selectors.

Supported keys:

- \`viewport\` (required)
- \`slides\`
- \`prev_button\`
- \`next_button\`
- \`current_slide\`
- \`total_slides\`

---

### \`pager-mode\` (attribute)

- \`slides\`
- \`pages\`

---

## Behavior notes

### Active slide logic

- During scrolling, the component computes a logical scroll position (normalized for RTL)
- It picks the closest snap position (\`snapLefts\`) as the active index
- If the viewport is at physical end, it forces the last slide as active

### Prev/Next logic (virtual END)

- Next: goes to the next snap point; if none exists, goes to \`maxScroll\`
- Prev: goes to the previous snap point; when at end, it treats the current position as slightly *past* \`maxScroll\` so it can step back

### RTL support

RTL is detected from \`getComputedStyle(viewport).direction\`.
The component normalizes to a logical scroll space \`0 → maxScroll\` regardless of browser RTL scroll model:

- Chrome/Safari: \`scrollLeft\` is negative in RTL (\`0 → -maxScroll\`)
- Firefox: \`scrollLeft\` is reversed (\`maxScroll → 0\`)
- Rare: default (\`0 → maxScroll\`)

## Keyboard support

When the viewport (or any element inside the component) is focused:

- \`ArrowRight\` / \`ArrowLeft\` navigates (mirrored in RTL)
- \`Home\` goes to the start
- \`End\` goes to the end

Keyboard navigation is ignored when focus is inside \`input\`, \`textarea\`, or \`select\`.

---

## Events

### \`carouselChange\`

Dispatched on the host (\`<irnmn-carousel>\`) when the active slide changes.

\`\`\`js
carousel.addEventListener('carouselChange', (e) => {
  const { currentIndex, currentElement, total } = e.detail;
});
\`\`\`

---

## Public API

### \`refresh()\`
### \`next()\`
### \`prev()\`

\`\`\`js
carousel.refresh();
carousel.next();
carousel.prev();
\`\`\`

---
## Debugging

Add \`?debugCarousel=1\` to the URL to enable console logging.

## Implementation notes / known sensitivities

- Snap calculations rely on \`getBoundingClientRect()\` and current scroll position; heavy layout shifts during smooth scrolling can cause transient snap noise.
- RTL scroll type detection temporarily writes to \`scrollLeft\` to detect the browser model.
`;var b=Object.freeze,H=Object.defineProperty,J=(c,s)=>b(H(c,"raw",{value:b(c.slice())})),y;const ee={title:"Components/Carousel",tags:["autodocs"],component:"irnmn-carousel",parameters:{docs:{description:{component:G}}},render:()=>h`
        <irnmn-carousel
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <!-- Scroll-snap viewport -->
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

        </div>

        <!-- Desktop navigation arrows -->
        <button
            type="button"
            class="c-carousel__nav c-carousel__nav--prev"
        >
            ‹
        </button>

        <button
            type="button"
            class="c-carousel__nav c-carousel__nav--next"
        >
            ›
        </button>

        <!-- Mobile pagination -->
        <div class="c-carousel__pager">
            <span class="c-carousel__pagerCurrent">1</span>
            <span class="c-carousel__pagerSep">/</span>
            <span class="c-carousel__pagerTotal">4</span>
        </div>
        </irnmn-carousel>
        `},g={},m={render:()=>h`
        <div dir="rtl">
        <irnmn-carousel
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>

        <button type="button" class="c-carousel__nav c-carousel__nav--prev">‹</button>
        <button type="button" class="c-carousel__nav c-carousel__nav--next">›</button>

        <div class="c-carousel__pager">
            <span class="c-carousel__pagerCurrent">1</span>
            <span class="c-carousel__pagerSep">/</span>
            <span class="c-carousel__pagerTotal">4</span>
        </div>
        </irnmn-carousel>
        </div>
    `},v={render:()=>h`
        <irnmn-carousel
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        <button type="button" class="c-carousel__nav c-carousel__nav--prev">‹</button>
        <button type="button" class="c-carousel__nav c-carousel__nav--next">›</button>
        <div class="c-carousel__pager">
            <span class="c-carousel__pagerCurrent">1</span>
            <span class="c-carousel__pagerSep">/</span>
            <span class="c-carousel__pagerTotal">2</span>
        </div>
        </irnmn-carousel>
        `},S={render:()=>h`
        <irnmn-carousel
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        </irnmn-carousel>
        `},f={render:()=>h(y||(y=J([`
        <irnmn-carousel
        id="irnmn-carousel-demo"
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        </irnmn-carousel>
        <br/>
        <p>External button using component API :</p>
        <button id="prevBtn">Previous</button>
        <button id="nextBtn">Next</button>

        <script>
        const carousel = document.getElementById('irnmn-carousel-demo');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.addEventListener('click', () => {
            carousel.prev();
        });

        nextBtn.addEventListener('click', () => {
            carousel.next();
        });
        <\/script>
        `])))},T={render:()=>h`
        <irnmn-carousel
        pager-mode="slides"
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        <button type="button" class="c-carousel__nav c-carousel__nav--prev">‹</button>
        <button type="button" class="c-carousel__nav c-carousel__nav--next">›</button>
        <div class="c-carousel__pager">
            <span class="c-carousel__pagerCurrent">1</span>
            <span class="c-carousel__pagerSep">/</span>
            <span class="c-carousel__pagerTotal">4</span>
        </div>
        </irnmn-carousel>
        `};var x,L,w;g.parameters={...g.parameters,docs:{...(x=g.parameters)==null?void 0:x.docs,source:{originalSource:"{}",...(w=(L=g.parameters)==null?void 0:L.docs)==null?void 0:w.source}}};var E,P,R;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => html\`
        <div dir="rtl">
        <irnmn-carousel
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>

        <button type="button" class="c-carousel__nav c-carousel__nav--prev">‹</button>
        <button type="button" class="c-carousel__nav c-carousel__nav--next">›</button>

        <div class="c-carousel__pager">
            <span class="c-carousel__pagerCurrent">1</span>
            <span class="c-carousel__pagerSep">/</span>
            <span class="c-carousel__pagerTotal">4</span>
        </div>
        </irnmn-carousel>
        </div>
    \`
}`,...(R=(P=m.parameters)==null?void 0:P.docs)==null?void 0:R.source}}};var C,I,A;v.parameters={...v.parameters,docs:{...(C=v.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    return html\`
        <irnmn-carousel
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        <button type="button" class="c-carousel__nav c-carousel__nav--prev">‹</button>
        <button type="button" class="c-carousel__nav c-carousel__nav--next">›</button>
        <div class="c-carousel__pager">
            <span class="c-carousel__pagerCurrent">1</span>
            <span class="c-carousel__pagerSep">/</span>
            <span class="c-carousel__pagerTotal">2</span>
        </div>
        </irnmn-carousel>
        \`;
  }
}`,...(A=(I=v.parameters)==null?void 0:I.docs)==null?void 0:A.source}}};var N,B,M;S.parameters={...S.parameters,docs:{...(N=S.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => {
    return html\`
        <irnmn-carousel
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        </irnmn-carousel>
        \`;
  }
}`,...(M=(B=S.parameters)==null?void 0:B.docs)==null?void 0:M.source}}};var O,D,W;f.parameters={...f.parameters,docs:{...(O=f.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => {
    return html\`
        <irnmn-carousel
        id="irnmn-carousel-demo"
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        </irnmn-carousel>
        <br/>
        <p>External button using component API :</p>
        <button id="prevBtn">Previous</button>
        <button id="nextBtn">Next</button>

        <script>
        const carousel = document.getElementById('irnmn-carousel-demo');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.addEventListener('click', () => {
            carousel.prev();
        });

        nextBtn.addEventListener('click', () => {
            carousel.next();
        });
        <\/script>
        \`;
  }
}`,...(W=(D=f.parameters)==null?void 0:D.docs)==null?void 0:W.source}}};var V,U,k;T.parameters={...T.parameters,docs:{...(V=T.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => {
    return html\`
        <irnmn-carousel
        pager-mode="slides"
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        <button type="button" class="c-carousel__nav c-carousel__nav--prev">‹</button>
        <button type="button" class="c-carousel__nav c-carousel__nav--next">›</button>
        <div class="c-carousel__pager">
            <span class="c-carousel__pagerCurrent">1</span>
            <span class="c-carousel__pagerSep">/</span>
            <span class="c-carousel__pagerTotal">4</span>
        </div>
        </irnmn-carousel>
        \`;
  }
}`,...(k=(U=T.parameters)==null?void 0:U.docs)==null?void 0:k.source}}};const te=["Default","RTL","FewSlides","NoControls","externalControls","PagerSlidesMode"];export{g as Default,v as FewSlides,S as NoControls,T as PagerSlidesMode,m as RTL,te as __namedExportsOrder,ee as default,f as externalControls};
