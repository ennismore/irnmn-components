var y=Object.defineProperty;var w=(c,s,t)=>s in c?y(c,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[s]=t;var r=(c,s,t)=>w(c,typeof s!="symbol"?s+"":s,t);import{x as L}from"./iframe-C4H2_FON.js";class P{constructor(s,t={}){this.viewport=s,this.debug=!!t.debug,this._prefersReducedMotion=t.prefersReducedMotion||(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches),this._rtlScrollType=null}isRTL(){return getComputedStyle(this.viewport).direction==="rtl"}getMaxScroll(){return this.viewport.scrollWidth-this.viewport.clientWidth}getGapPx(){const s=getComputedStyle(this.viewport);return parseFloat(s.columnGap)||parseFloat(s.gap)||0}getEpsilonPx(){const s=this.getGapPx()/2||6;return Math.max(2,Math.min(12,s))}getScrollPaddingStart(){const s=getComputedStyle(this.viewport);return this.isRTL()?parseFloat(s.scrollPaddingRight)||0:parseFloat(s.scrollPaddingLeft)||0}getRTLScrollType(){if(this._rtlScrollType)return this._rtlScrollType;if(!this.viewport||getComputedStyle(this.viewport).direction!=="rtl")return this._rtlScrollType="default",this._rtlScrollType;const s=document.createElement("div");s.dir="rtl",s.style.cssText=["position:absolute","top:-9999px","left:-9999px","width:100px","height:1px","overflow:scroll","scroll-snap-type:none","contain:layout style paint","visibility:hidden"].join(";");const t=document.createElement("div");t.style.width="200px",t.style.height="1px",s.appendChild(t),document.body.appendChild(s);try{const e=s.scrollWidth-s.clientWidth;return s.scrollLeft=0,s.scrollLeft=1,s.scrollLeft===0?(this._rtlScrollType="negative",this._rtlScrollType):(s.scrollLeft=e,this._rtlScrollType=s.scrollLeft===e?"default":"reverse",this._rtlScrollType)}finally{document.body.removeChild(s)}}getScrollPosition(){const t=this.viewport.scrollLeft;if(!this.isRTL())return t;const e=this.getMaxScroll(),i=this.getRTLScrollType();return i==="negative"?-t:i==="reverse"?e-t:t}scrollToLogicalPosition(s,t={}){const e=this.viewport,i=this.getMaxScroll(),n=Math.max(0,Math.min(i,s));let o=n;if(this.isRTL()){const a=this.getRTLScrollType();a==="negative"?o=-n:a==="reverse"&&(o=i-n)}const l=t.behavior||(this._prefersReducedMotion()?"auto":"smooth");e.scrollTo({left:o,behavior:l})}resetToStartInstant(){this.scrollToLogicalPosition(0,{behavior:"auto"})}isAtStart(){return this.getScrollPosition()<=this.getEpsilonPx()}isAtEnd(){return this.getScrollPosition()>=this.getMaxScroll()-this.getEpsilonPx()}isOverflowing(){return this.viewport&&this.viewport.scrollWidth-this.viewport.clientWidth>1}resetCaches(){this._rtlScrollType=null}}class R{constructor({viewport:s,getSlides:t,scroll:e,debug:i=!1}){this.viewport=s,this.getSlides=t,this.scroll=e,this.debug=!!i,this.snapLefts=[],this.virtualPages=[]}calculateSnapLefts(){const s=this.getSlides(),t=this.scroll.isRTL(),e=this.scroll.getScrollPosition(),i=this.scroll.getEpsilonPx(),n=this.viewport.getBoundingClientRect(),o=this.scroll.getScrollPaddingStart(),l=t?n.right-o:n.left+o;return this.snapLefts=s.map(a=>{const p=a.getBoundingClientRect(),h=t?p.right:p.left,d=t?l-h:h-l,u=e+d;return Math.abs(u)<i||u<0?0:u}),this.debug&&console.info("[IRNMNCarousel] snapLefts (unclamped)",this.snapLefts),this.snapLefts}getPrevSnapPosition(s){const t=this.scroll.getEpsilonPx();for(let e=this.snapLefts.length-1;e>=0;e--)if(this.snapLefts[e]<s-t)return this.snapLefts[e];return null}getNextSnapPosition(s){const t=this.scroll.getEpsilonPx();for(let e=0;e<this.snapLefts.length;e++)if(this.snapLefts[e]>s+t)return this.snapLefts[e];return null}getClosestSnapIndex(s){let t=0,e=1/0;const i=this.scroll.getEpsilonPx();for(let n=0;n<this.snapLefts.length;n++){const o=Math.abs(this.snapLefts[n]-s);o<e-i&&(e=o,t=n)}return t}calculateVirtualPages(s){if(s!=="pages")return this.virtualPages=[],this.virtualPages;if(!this.snapLefts.length)return this.virtualPages=[],this.virtualPages;const t=this.getSlides(),e=this.scroll.getMaxScroll(),i=this.scroll.getEpsilonPx(),n=[{snapPosition:0,slideIndices:this.getVisibleSlideIndices(0)}];let o=0;for(;o<e-i;){const l=this.getNextSnapPosition(o);if(l===null){o<e-i&&n.push({snapPosition:e,slideIndices:[t.length-1]});break}const a=this.getVisibleSlideIndices(l);n.push({snapPosition:l,slideIndices:a}),o=l}return this.virtualPages=n,this.debug&&(console.info("[IRNMNCarousel] Virtual pages:",this.virtualPages.length,this.virtualPages),console.info("[IRNMNCarousel] Viewport width:",this.viewport.clientWidth),console.info("[IRNMNCarousel] Max scroll:",e)),this.virtualPages}getVisibleSlideIndices(s){const t=this.getSlides(),e=this.scroll.getEpsilonPx(),i=this.viewport.getBoundingClientRect(),n=i.left,o=i.right,l=this.scroll.getScrollPosition(),a=s-l,p=[];return t.forEach((h,d)=>{const u=h.getBoundingClientRect(),T=u.left-a;u.right-a>n+e&&T<o-e&&p.push(d)}),p}}class C{constructor(){r(this,"host",null);r(this,"ariaLiveRegion",null);r(this,"_lastAnnouncedKey",null)}mount(s){s&&(this.host=s,!(this.ariaLiveRegion&&this.host.contains(this.ariaLiveRegion))&&(this.ariaLiveRegion=document.createElement("div"),this.ariaLiveRegion.setAttribute("aria-live","polite"),this.ariaLiveRegion.setAttribute("aria-atomic","true"),this.ariaLiveRegion.classList.add("visually-hidden"),Object.assign(this.ariaLiveRegion.style,{position:"absolute",height:"1px",width:"1px",overflow:"hidden",clip:"rect(1px, 1px, 1px, 1px)",whiteSpace:"nowrap"}),this.host.appendChild(this.ariaLiveRegion)))}unmount(){this.host&&this.ariaLiveRegion&&this.host.contains(this.ariaLiveRegion)&&this.host.removeChild(this.ariaLiveRegion),this.ariaLiveRegion=null,this.host=null,this._lastAnnouncedKey=null}reset(){this._lastAnnouncedKey=null}announce(s,t){this.ariaLiveRegion&&this._lastAnnouncedKey!==s&&(this._lastAnnouncedKey=s,this.ariaLiveRegion.textContent=t)}announceSlide(s,t){const e=s+1;this.announce(`slide:${e}/${t}`,`Item ${e} of ${t}`)}announcePage(s,t){const e=s+1;this.announce(`page:${e}/${t}`,`Page ${e} of ${t}`)}}class E extends HTMLElement{constructor(){super();r(this,"CLASSNAMES",[]);r(this,"slides",[]);r(this,"currentIndex",0);r(this,"currentPageIndex",0);r(this,"viewport",null);r(this,"prevBtn",null);r(this,"nextBtn",null);r(this,"pagerCurrent",null);r(this,"pagerTotal",null);r(this,"scroll",null);r(this,"snap",null);r(this,"announcer",null);r(this,"debug",!1);r(this,"pagerMode","pages");r(this,"_abortController",null);r(this,"_signal",null);r(this,"_resizeObserver",null);r(this,"_scrollSettledTimer",null);r(this,"_scrollSettledDelay",120);r(this,"_scrollRafId",null);r(this,"connected",!1);this.CLASSNAMES=this.selectors;const t=new URLSearchParams(window.location.search);this.debug=t.has("debugCarousel"),this.debug&&console.info("[IRNMNCarousel] Constructor",this.CLASSNAMES)}get selectors(){let t=this.getAttribute("selectors");const e={};try{t=t?JSON.parse(t):{}}catch(i){return console.error("[IRNMNCarousel] Error parsing selectors:",i),e}for(const i in t)e[i.toUpperCase()]=t[i];return e}get prefersReducedMotion(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}addListener(t,e,i,n={}){t&&t.addEventListener(e,i,{...n,signal:this._signal})}connectedCallback(){if(this.connected)return;this._abortController=new AbortController,this._signal=this._abortController.signal;const t=this.initCarousel();this.connected=t}disconnectedCallback(){var t,e,i;this._scrollSettledTimer&&clearTimeout(this._scrollSettledTimer),this._scrollRafId&&cancelAnimationFrame(this._scrollRafId),(t=this.announcer)==null||t.unmount(),(e=this._abortController)==null||e.abort(),(i=this._resizeObserver)==null||i.disconnect(),this.connected=!1,this.debug&&console.info("[IRNMNCarousel] Cleaned up")}initCarousel(){const t=this.querySelector(this.CLASSNAMES.VIEWPORT);if(!t)return console.error("[IRNMNCarousel] Viewport not found"),!1;this.viewport=t,this.viewport.setAttribute("tabindex","0"),this.viewport.setAttribute("role","region"),this.viewport.setAttribute("aria-roledescription","carousel"),this.scroll=new P(this.viewport,{debug:this.debug,prefersReducedMotion:()=>this.prefersReducedMotion}),this.snap=new R({viewport:this.viewport,getSlides:()=>this.slides,scroll:this.scroll,debug:this.debug}),this.announcer=new C,this.announcer.mount(this),this.scroll.resetToStartInstant();const e=this.getAttribute("pager-mode");return(e==="slides"||e==="pages")&&(this.pagerMode=e),this.slides=Array.from(t.querySelectorAll(this.CLASSNAMES.SLIDES)),this.prevBtn=this.querySelector(this.CLASSNAMES.PREV_BUTTON),this.nextBtn=this.querySelector(this.CLASSNAMES.NEXT_BUTTON),this.pagerCurrent=this.querySelector(this.CLASSNAMES.CURRENT_SLIDE),this.pagerTotal=this.querySelector(this.CLASSNAMES.TOTAL_SLIDES),this.initSlidesAttributes(),this.snap.calculateSnapLefts(),this.snap.calculateVirtualPages(this.pagerMode),this.updateTotal(),this.syncOverflowState(),this.addScrollListener(),this.addControlsListeners(),this.addKeyboardSupport(),this.setupResizeObserver(),requestAnimationFrame(()=>{this.snap.calculateSnapLefts(),this.snap.calculateVirtualPages(this.pagerMode),this.updateTotal(),this.syncOverflowState(),this.updateActiveFromScroll()}),!0}initSlidesAttributes(){const t=this.slides.length;this.slides.forEach((e,i)=>{e.setAttribute("role","group"),e.setAttribute("aria-roledescription","slide"),e.hasAttribute("aria-label")||e.setAttribute("aria-label",`Item ${i+1} of ${t}`),e.removeAttribute("tabindex")})}updateTotal(){var t,e;this.pagerTotal&&(this.pagerMode==="pages"?this.pagerTotal.textContent=String(((e=(t=this.snap)==null?void 0:t.virtualPages)==null?void 0:e.length)||1):this.pagerTotal.textContent=String(this.slides.length))}updateActiveFromScroll({announce:t=!1}={}){var l,a;if(!((a=(l=this.snap)==null?void 0:l.snapLefts)!=null&&a.length))return;if(this.pagerMode==="pages"){this.updateActivePageFromScroll({announce:t}),this.updateControlsDisabledState();return}const e=this.scroll.getScrollPosition(),i=this.scroll.getMaxScroll(),n=this.scroll.getEpsilonPx();if(e>=i-n){this.setActiveIndex(this.slides.length-1,{announce:t}),this.updateControlsDisabledState();return}const o=this.snap.getClosestSnapIndex(e);this.setActiveIndex(o,{announce:t}),this.updateControlsDisabledState()}setActiveIndex(t,{announce:e=!1}={}){if(t===this.currentIndex){e&&this.announcer.announceSlide(t,this.slides.length);return}this.currentIndex=t,this.slides.forEach((i,n)=>{i.classList.toggle("active-slide",n===t)}),this.pagerCurrent&&(this.pagerCurrent.textContent=String(t+1)),e&&this.announcer.announceSlide(t,this.slides.length),this.dispatchEvent(new CustomEvent("carouselChange",{bubbles:!0,detail:{currentIndex:t,currentElement:this.slides[t],total:this.slides.length}}))}updateActivePageFromScroll({announce:t=!1}={}){var a,p;if(this.pagerMode!=="pages"||!((p=(a=this.snap)==null?void 0:a.virtualPages)!=null&&p.length))return;const e=this.scroll.getScrollPosition(),i=this.scroll.getMaxScroll(),n=this.scroll.getEpsilonPx();if(e>=i-n){this.setActivePageIndex(this.snap.virtualPages.length-1,{announce:t});return}let o=0,l=1/0;this.snap.virtualPages.forEach((h,d)=>{const u=Math.abs(h.snapPosition-e);u<l&&(l=u,o=d)}),this.setActivePageIndex(o,{announce:t})}setActivePageIndex(t,{announce:e=!1}={}){if(t===this.currentPageIndex){e&&this.announcer.announcePage(t,this.snap.virtualPages.length);return}this.currentPageIndex=t,this.pagerCurrent&&(this.pagerCurrent.textContent=String(t+1)),e&&this.announcer.announcePage(t,this.snap.virtualPages.length)}goPrev(){const t=this.scroll.getScrollPosition(),e=this.scroll.getEpsilonPx(),i=this.scroll.isAtEnd()?this.scroll.getMaxScroll()+e*2:t,n=this.snap.getPrevSnapPosition(i);n!==null&&this.scroll.scrollToLogicalPosition(n)}goNext(){const t=this.scroll.getScrollPosition(),e=this.snap.getNextSnapPosition(t);if(e!==null){this.scroll.scrollToLogicalPosition(e);return}this.scroll.scrollToLogicalPosition(this.scroll.getMaxScroll())}goFirst(){this.scroll.scrollToLogicalPosition(0)}goLast(){this.scroll.scrollToLogicalPosition(this.scroll.getMaxScroll())}addControlsListeners(){this.addListener(this.prevBtn,"click",()=>this.goPrev()),this.addListener(this.nextBtn,"click",()=>this.goNext())}addKeyboardSupport(){this.addListener(this.viewport,"keydown",t=>{if(!this.contains(document.activeElement)||document.activeElement&&["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;const e=this.scroll.isRTL();switch(t.key){case"ArrowRight":t.preventDefault(),e?this.goPrev():this.goNext();break;case"ArrowLeft":t.preventDefault(),e?this.goNext():this.goPrev();break;case"Home":t.preventDefault(),this.goFirst();break;case"End":t.preventDefault(),this.goLast();break}})}updateControlsDisabledState(){var t;if(!((t=this.scroll)!=null&&t.isOverflowing())){this.prevBtn&&(this.prevBtn.disabled=!0),this.nextBtn&&(this.nextBtn.disabled=!0);return}this.prevBtn&&(this.prevBtn.disabled=this.scroll.isAtStart()),this.nextBtn&&(this.nextBtn.disabled=this.scroll.isAtEnd())}syncOverflowState(){const t=this.scroll.isOverflowing();this.classList.toggle("is-overflowing",t),this.prevBtn&&(this.prevBtn.disabled=!t),this.nextBtn&&(this.nextBtn.disabled=!t)}setupResizeObserver(){this._resizeObserver=new ResizeObserver(()=>{this.connected&&(this.snap.calculateSnapLefts(),this.snap.calculateVirtualPages(this.pagerMode),this.updateTotal(),this.syncOverflowState(),this.updateActiveFromScroll())}),this._resizeObserver.observe(this.viewport)}addScrollListener(){this.addListener(this.viewport,"scroll",()=>{this._scrollRafId||(this._scrollRafId=requestAnimationFrame(()=>{this.updateActiveFromScroll({announce:!1}),this.scheduleScrollSettled(),this._scrollRafId=null}))},{passive:!0})}scheduleScrollSettled(){clearTimeout(this._scrollSettledTimer),this._scrollSettledTimer=setTimeout(()=>{this.updateActiveFromScroll({announce:!0})},this._scrollSettledDelay)}refresh(){var t;this.slides=Array.from(this.viewport.querySelectorAll(this.CLASSNAMES.SLIDES)),this.snap.calculateSnapLefts(),this.snap.calculateVirtualPages(this.pagerMode),this.updateTotal(),this.updateActiveFromScroll(),(t=this.announcer)==null||t.reset()}next(){this.goNext()}prev(){this.goPrev()}}customElements.get("irnmn-carousel")||customElements.define("irnmn-carousel",E);const A=`# IRNMNCarousel

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
`,B={title:"Components/Carousel",tags:["autodocs"],component:"irnmn-carousel",parameters:{docs:{description:{component:A}}},render:()=>L`
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
        `},g={},v={render:()=>L`
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
    `};var _,m,S;g.parameters={...g.parameters,docs:{...(_=g.parameters)==null?void 0:_.docs,source:{originalSource:"{}",...(S=(m=g.parameters)==null?void 0:m.docs)==null?void 0:S.source}}};var f,b,x;v.parameters={...v.parameters,docs:{...(f=v.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(x=(b=v.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};const O=["Default","RTL"];export{g as Default,v as RTL,O as __namedExportsOrder,B as default};
