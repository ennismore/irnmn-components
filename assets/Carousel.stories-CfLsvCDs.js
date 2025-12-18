var x=Object.defineProperty;var y=(a,l,t)=>l in a?x(a,l,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[l]=t;var r=(a,l,t)=>y(a,typeof l!="symbol"?l+"":l,t);import{x as b}from"./iframe-Dp2vCPKT.js";class w extends HTMLElement{constructor(){super();r(this,"CLASSNAMES",[]);r(this,"slides",[]);r(this,"snapLefts",[]);r(this,"currentIndex",0);r(this,"viewport",null);r(this,"prevBtn",null);r(this,"nextBtn",null);r(this,"pagerCurrent",null);r(this,"pagerTotal",null);r(this,"ariaLiveRegion",null);r(this,"debug",!1);r(this,"_rtlScrollType",null);r(this,"_abortController",null);r(this,"_signal",null);r(this,"_resizeObserver",null);r(this,"_lastAnnouncedIndex",null);r(this,"_scrollSettledTimer",null);r(this,"_scrollSettledDelay",120);r(this,"connected",!1);this.CLASSNAMES=this.selectors;const t=new URLSearchParams(window.location.search);this.debug=t.get("debugCarousel"),this.debug&&console.info("[IRNMNCarousel] Constructor",this.CLASSNAMES)}get selectors(){let t=this.getAttribute("selectors"),e=[];try{t=JSON.parse(t)}catch(s){console.error("[IRNMNCarousel] Error parsing selectors:",s)}for(let s in t)e[s.toUpperCase()]=t[s];return e}get prefersReducedMotion(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}addListener(t,e,s,i={}){if(!t)return;const n={...i,signal:this._signal};t.addEventListener(e,s,n)}getGapPx(){const t=getComputedStyle(this.viewport);return parseFloat(t.columnGap)||parseFloat(t.gap)||0}getEpsilonPx(){const t=this.getGapPx()/2;return Math.max(2,Math.min(12,t||6))}isRTL(){return getComputedStyle(this.viewport).direction==="rtl"}getMaxScroll(){return this.viewport.scrollWidth-this.viewport.clientWidth}getScrollPosition(){const e=this.viewport.scrollLeft;if(!this.isRTL())return e;const s=this.getMaxScroll(),i=this.getRTLScrollType();return i==="negative"?-e:i==="reverse"?s-e:e}scrollToLogicalPosition(t){const e=this.viewport,s=this.getMaxScroll(),i=Math.max(0,Math.min(s,t));let n=i;if(this.isRTL()){const o=this.getRTLScrollType();o==="negative"?n=-i:o==="reverse"&&(n=s-i)}e.scrollTo({left:n,behavior:this.prefersReducedMotion?"auto":"smooth"})}getRTLScrollType(){if(this._rtlScrollType)return this._rtlScrollType;if(!this.viewport||getComputedStyle(this.viewport).direction!=="rtl")return this._rtlScrollType="default",this._rtlScrollType;const t=document.createElement("div");t.dir="rtl",t.style.cssText=["position:absolute","top:-9999px","left:-9999px","width:100px","height:1px","overflow:scroll","scroll-snap-type:none","contain:layout style paint","visibility:hidden"].join(";");const e=document.createElement("div");e.style.width="200px",e.style.height="1px",t.appendChild(e),document.body.appendChild(t);const s=t.scrollWidth-t.clientWidth;return t.scrollLeft=0,t.scrollLeft=1,t.scrollLeft===0?(this._rtlScrollType="negative",document.body.removeChild(t),this._rtlScrollType):(t.scrollLeft=s,this._rtlScrollType=t.scrollLeft===s?"default":"reverse",document.body.removeChild(t),this._rtlScrollType)}getPrevSnapPosition(t){const e=this.getEpsilonPx();let s=null;for(let i=0;i<this.snapLefts.length;i++)this.snapLefts[i]<t-e&&(s=this.snapLefts[i]);return s}getNextSnapPosition(t){const e=this.getEpsilonPx();for(let s=0;s<this.snapLefts.length;s++)if(this.snapLefts[s]>t+e)return this.snapLefts[s];return null}getClosestSnapIndex(t){let e=0,s=1/0;const i=this.getEpsilonPx();for(let n=0;n<this.snapLefts.length;n++){const o=Math.abs(this.snapLefts[n]-t);o<s-i&&(s=o,e=n)}return e}isAtStart(){return this.getScrollPosition()<=this.getEpsilonPx()}isAtEnd(){return this.getScrollPosition()>=this.getMaxScroll()-this.getEpsilonPx()}isOverflowing(){return this.viewport&&this.viewport.scrollWidth-this.viewport.clientWidth>1}syncOverflowState(){const t=this.isOverflowing();this.classList.toggle("is-overflowing",t),this.prevBtn&&(this.prevBtn.disabled=!t),this.nextBtn&&(this.nextBtn.disabled=!t),this.debug&&console.info("[IRNMNCarousel] Overflow:",t)}connectedCallback(){this.connected||(this.connected=!0,this._abortController=new AbortController,this._signal=this._abortController.signal,this.initCarousel(),this.ariaLiveRegion=document.createElement("div"),this.ariaLiveRegion.setAttribute("aria-live","polite"),this.ariaLiveRegion.setAttribute("aria-atomic","true"),this.ariaLiveRegion.classList.add("visually-hidden"),Object.assign(this.ariaLiveRegion.style,{position:"absolute",height:"1px",width:"1px",overflow:"hidden",clip:"rect(1px, 1px, 1px, 1px)",whiteSpace:"nowrap"}),this.appendChild(this.ariaLiveRegion))}disconnectedCallback(){var t,e;(t=this._abortController)==null||t.abort(),(e=this._resizeObserver)==null||e.disconnect(),this.connected=!1,this.debug&&console.info("[IRNMNCarousel] Cleaned up")}initCarousel(){const t=this.querySelector(this.CLASSNAMES.VIEWPORT);if(!t){console.error("[IRNMNCarousel] Viewport not found");return}this.viewport=t,this.viewport.setAttribute("tabindex","0"),this.viewport.setAttribute("role","region"),this.viewport.setAttribute("aria-roledescription","carousel"),this._rtlScrollType=null,this.slides=Array.from(t.querySelectorAll(this.CLASSNAMES.SLIDES)),this.prevBtn=this.querySelector(this.CLASSNAMES.PREV_BUTTON),this.nextBtn=this.querySelector(this.CLASSNAMES.NEXT_BUTTON),this.pagerCurrent=this.querySelector(this.CLASSNAMES.CURRENT_SLIDE),this.pagerTotal=this.querySelector(this.CLASSNAMES.TOTAL_SLIDES),this.updateTotal(),this.initSlidesAttributes(),this.calculateSnapLefts(),this.syncOverflowState(),this.addScrollListener(),this.addControlsListeners(),this.addKeyboardSupport(),this.setupResizeObserver(),requestAnimationFrame(()=>{this.calculateSnapLefts(),this.syncOverflowState(),this.updateActiveFromScroll()}),this.addListener(window,"load",()=>{this.calculateSnapLefts(),this.updateActiveFromScroll()},{once:!0})}updateTotal(){this.pagerTotal&&(this.pagerTotal.textContent=String(this.slides.length)),this.pagerCurrent&&(this.pagerCurrent.textContent="1")}initSlidesAttributes(){const t=this.slides.length;this.slides.forEach((e,s)=>{e.setAttribute("role","group"),e.setAttribute("aria-roledescription","slide"),e.hasAttribute("aria-label")||e.setAttribute("aria-label",`Item ${s+1} of ${t}`),e.removeAttribute("tabindex")})}getScrollPaddingStart(){const t=getComputedStyle(this.viewport);return this.isRTL()?parseFloat(t.scrollPaddingRight)||0:parseFloat(t.scrollPaddingLeft)||0}calculateSnapLefts(){const t=this.isRTL(),e=this.getScrollPosition(),s=this.getEpsilonPx(),i=this.viewport.getBoundingClientRect(),n=this.getScrollPaddingStart(),o=t?i.right-n:i.left+n;this.snapLefts=this.slides.map(L=>{const d=L.getBoundingClientRect(),h=t?d.right:d.left,T=t?o-h:h-o,u=e+T;return Math.abs(u)<s||u<0?0:u}),this.debug&&console.info("[IRNMNCarousel] snapLefts (unclamped)",this.snapLefts)}setupResizeObserver(){this._resizeObserver=new ResizeObserver(()=>{this.calculateSnapLefts(),this.syncOverflowState(),this.updateActiveFromScroll()}),this._resizeObserver.observe(this.viewport)}addScrollListener(){let t=!1;const e=()=>{t||(t=!0,requestAnimationFrame(()=>{this.updateActiveFromScroll({announce:!1}),this.scheduleScrollSettled(),t=!1}))};this.addListener(this.viewport,"scroll",e,{passive:!0})}scheduleScrollSettled(){this._scrollSettledTimer&&clearTimeout(this._scrollSettledTimer),this._scrollSettledTimer=window.setTimeout(()=>{this.updateActiveFromScroll({announce:!0})},this._scrollSettledDelay)}updateActiveFromScroll({announce:t=!1}={}){if(!this.snapLefts.length)return;const e=this.getScrollPosition();if(this.isAtEnd()){this.setActiveIndex(this.slides.length-1,{announce:t}),this.updateControlsDisabledState();return}const s=this.getClosestSnapIndex(e);this.setActiveIndex(s,{announce:t}),this.updateControlsDisabledState()}updateControlsDisabledState(){if(!this.isOverflowing()){this.prevBtn&&(this.prevBtn.disabled=!0),this.nextBtn&&(this.nextBtn.disabled=!0);return}this.prevBtn&&(this.prevBtn.disabled=this.isAtStart()),this.nextBtn&&(this.nextBtn.disabled=this.isAtEnd())}setActiveIndex(t,{announce:e=!1}={}){if(t===this.currentIndex){e&&this.announceActiveIndex(t);return}this.currentIndex=t,this.slides.forEach((s,i)=>{s.classList.toggle("active-slide",i===t)}),this.pagerCurrent&&(this.pagerCurrent.textContent=String(t+1)),e&&this.announceActiveIndex(t),this.dispatchEvent(new CustomEvent("carouselChange",{bubbles:!0,detail:{currentIndex:t,currentElement:this.slides[t],total:this.slides.length}})),this.debug&&console.info("[IRNMNCarousel] Active index",t)}announceActiveIndex(t){this.ariaLiveRegion&&this._lastAnnouncedIndex!==t&&(this._lastAnnouncedIndex=t,this.ariaLiveRegion.textContent=`Item ${t+1} of ${this.slides.length}`)}addControlsListeners(){this.addListener(this.prevBtn,"click",()=>{const t=this.getScrollPosition(),e=this.getEpsilonPx(),s=this.isAtEnd()?this.getMaxScroll()+e*2:t,i=this.getPrevSnapPosition(s);i!==null&&this.scrollToLogicalPosition(i)}),this.addListener(this.nextBtn,"click",()=>{const t=this.getScrollPosition(),e=this.getNextSnapPosition(t);if(e!==null){this.scrollToLogicalPosition(e);return}this.scrollToLogicalPosition(this.getMaxScroll())})}addKeyboardSupport(){this.addListener(this.viewport,"keydown",t=>{var s,i,n,o;if(!this.contains(document.activeElement)||document.activeElement&&["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;const e=this.isRTL();switch(t.key){case"ArrowRight":t.preventDefault(),e?(s=this.prevBtn)==null||s.click():(i=this.nextBtn)==null||i.click();break;case"ArrowLeft":t.preventDefault(),e?(n=this.nextBtn)==null||n.click():(o=this.prevBtn)==null||o.click();break;case"Home":t.preventDefault(),this.scrollToLogicalPosition(0);break;case"End":t.preventDefault(),this.scrollToLogicalPosition(this.getMaxScroll());break}})}refresh(){this.viewport&&(this._lastAnnouncedIndex=null,this.slides=Array.from(this.viewport.querySelectorAll(this.CLASSNAMES.SLIDES)),this.updateTotal(),this.calculateSnapLefts(),this.updateActiveFromScroll(),this.debug&&console.info("[IRNMNCarousel] Refreshed"))}}customElements.get("irnmn-carousel")||customElements.define("irnmn-carousel",w);const C=`# IRNMNCarousel

\`<irnmn-carousel>\` is a scroll-snap based, variable-width carousel implemented as a Web Component.
It uses native scrolling + CSS scroll-snap, and provides button/keyboard navigation, RTL support, and an aria-live announcement of the active item.

## Features

- Native horizontal scroll with \`scroll-snap\`
- Variable-width slides
- Active slide = closest **start** snap point
- When reaching physical scroll end, **last slide becomes active** (logical)
- Prev/Next navigation supports a virtual **END** step (\`maxScroll\`)
- RTL scroll normalization (Chrome/Safari negative model, Firefox reverse model)
- Keyboard support: Arrow keys, Home/End
- \`aria-live\` announcements (polite)

## Expected markup

The component queries internal elements using a \`selectors\` attribute (JSON).
Example:

\`\`\`html
<irnmn-carousel
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
    <!-- ... -->
  </div>

  <div class="carousel__pager" aria-hidden="true">
    <span class="carousel__current">1</span> /
    <span class="carousel__total">0</span>
  </div>
</irnmn-carousel>
\`\`\`

### Required CSS (minimum)

You must apply horizontal layout + scroll-snap on the viewport and snap points on slides:

\`\`\`css
.carousel__viewport {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  display: flex;
  gap: 16px; /* used for epsilon heuristics */
  scroll-padding-left: 0px;
  scroll-padding-right: 0px; /* for RTL start padding */
}

.carousel__slide {
  scroll-snap-align: start;
  flex: 0 0 auto;
}
\`\`\`

Optional: hide controls when not overflowing via the host class:

\`\`\`css
irnmn-carousel:not(.is-overflowing) .carousel__prev,
irnmn-carousel:not(.is-overflowing) .carousel__next {
  display: none;
}
\`\`\`

## Configuration

### \`selectors\` (attribute)

A JSON object mapping internal roles to CSS selectors. Keys are uppercased internally.

Supported keys (by this implementation):

- \`viewport\`
- \`slides\`
- \`prev_button\`
- \`next_button\`
- \`current_slide\`
- \`total_slides\`

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

## Events

### \`carouselChange\`

Dispatched on the host (\`<irnmn-carousel>\`) when the active slide changes.

\`\`\`js
carousel.addEventListener('carouselChange', (e) => {
  const { currentIndex, currentElement, total } = e.detail;
});
\`\`\`

\`detail\`:

- \`currentIndex\` (number)
- \`currentElement\` (HTMLElement)
- \`total\` (number)

## Public API

### \`refresh()\`

Re-scans slides and recomputes geometry/state.

\`\`\`js
document.querySelector('irnmn-carousel')?.refresh();
\`\`\`

## Debugging

Add \`?debugCarousel=1\` to the URL to enable console logging.

## Implementation notes / known sensitivities

- Snap calculations rely on \`getBoundingClientRect()\` and current scroll position; heavy layout shifts during smooth scrolling can cause transient snap noise.
- RTL scroll type detection temporarily writes to \`scrollLeft\` to detect the browser model.

## License

Internal / project-specific.
`,R={title:"Components/Carousel",tags:["autodocs"],component:"irnmn-carousel",parameters:{docs:{description:{component:C}}},render:()=>b`
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
        `},c={},p={render:()=>b`
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
    `};var g,v,_;c.parameters={...c.parameters,docs:{...(g=c.parameters)==null?void 0:g.docs,source:{originalSource:"{}",...(_=(v=c.parameters)==null?void 0:v.docs)==null?void 0:_.source}}};var m,S,f;p.parameters={...p.parameters,docs:{...(m=p.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(f=(S=p.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};const N=["Default","RTL"];export{c as Default,p as RTL,N as __namedExportsOrder,R as default};
