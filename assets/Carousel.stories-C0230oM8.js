var A=Object.defineProperty;var w=(n,a,t)=>a in n?A(n,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[a]=t;var r=(n,a,t)=>w(n,typeof a!="symbol"?a+"":a,t);import{x as L}from"./iframe-DsAnWhEh.js";class C extends HTMLElement{constructor(){super();r(this,"CLASSNAMES",[]);r(this,"slides",[]);r(this,"snapLefts",[]);r(this,"currentIndex",0);r(this,"viewport",null);r(this,"prevBtn",null);r(this,"nextBtn",null);r(this,"pagerCurrent",null);r(this,"pagerTotal",null);r(this,"ariaLiveRegion",null);r(this,"debug",!1);r(this,"_rtlScrollType",null);r(this,"_abortController",null);r(this,"_signal",null);r(this,"_resizeObserver",null);r(this,"_lastAnnouncedIndex",null);r(this,"_scrollSettledTimer",null);r(this,"_scrollSettledDelay",120);r(this,"connected",!1);this.CLASSNAMES=this.selectors;const t=new URLSearchParams(window.location.search);this.debug=t.get("debugCarousel"),this.debug&&console.info("[IRNMNCarousel] Constructor",this.CLASSNAMES)}get selectors(){let t=this.getAttribute("selectors"),e=[];try{t=JSON.parse(t)}catch(s){console.error("[IRNMNCarousel] Error parsing selectors:",s)}for(let s in t)e[s.toUpperCase()]=t[s];return e}get prefersReducedMotion(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}addListener(t,e,s,i={}){if(!t)return;const l={...i,signal:this._signal};t.addEventListener(e,s,l)}getGapPx(){const t=getComputedStyle(this.viewport);return parseFloat(t.columnGap)||parseFloat(t.gap)||0}getEpsilonPx(){const t=this.getGapPx()/2;return Math.max(2,Math.min(12,t||6))}isRTL(){return getComputedStyle(this.viewport).direction==="rtl"}getMaxScroll(){return this.viewport.scrollWidth-this.viewport.clientWidth}getScrollPosition(){const e=this.viewport.scrollLeft;if(!this.isRTL())return e;const s=this.getMaxScroll(),i=this.getRTLScrollType();return i==="negative"?-e:i==="reverse"?s-e:e}scrollToLogicalPosition(t){const e=this.viewport,s=this.getMaxScroll(),i=Math.max(0,Math.min(s,t));let l=i;if(this.isRTL()){const o=this.getRTLScrollType();o==="negative"?l=-i:o==="reverse"&&(l=s-i)}e.scrollTo({left:l,behavior:this.prefersReducedMotion?"auto":"smooth"})}getRTLScrollType(){if(this._rtlScrollType)return this._rtlScrollType;if(!this.viewport||getComputedStyle(this.viewport).direction!=="rtl")return this._rtlScrollType="default",this._rtlScrollType;const t=this.viewport,e=t.scrollLeft;if(t.scrollLeft=0,t.scrollLeft=1,t.scrollLeft===0)this._rtlScrollType="negative";else{const s=t.scrollWidth-t.clientWidth;t.scrollLeft=s,this._rtlScrollType=t.scrollLeft===s?"default":"reverse"}return t.scrollLeft=e,this._rtlScrollType}getPrevSnapPosition(t){const e=this.getEpsilonPx();let s=null;for(let i=0;i<this.snapLefts.length;i++)this.snapLefts[i]<t-e&&(s=this.snapLefts[i]);return s}getNextSnapPosition(t){const e=this.getEpsilonPx();for(let s=0;s<this.snapLefts.length;s++)if(this.snapLefts[s]>t+e)return this.snapLefts[s];return null}getClosestSnapIndex(t){let e=0,s=1/0;const i=this.getEpsilonPx();for(let l=0;l<this.snapLefts.length;l++){const o=Math.abs(this.snapLefts[l]-t);o<s-i&&(s=o,e=l)}return e}isAtStart(){return this.getScrollPosition()<=this.getEpsilonPx()}isAtEnd(){return this.getScrollPosition()>=this.getMaxScroll()-this.getEpsilonPx()}isOverflowing(){return this.viewport&&this.viewport.scrollWidth-this.viewport.clientWidth>1}syncOverflowState(){const t=this.isOverflowing();this.classList.toggle("is-overflowing",t),this.prevBtn&&(this.prevBtn.disabled=!t),this.nextBtn&&(this.nextBtn.disabled=!t),this.debug&&console.info("[IRNMNCarousel] Overflow:",t)}connectedCallback(){this.connected||(this.connected=!0,this._abortController=new AbortController,this._signal=this._abortController.signal,this.initCarousel(),this.ariaLiveRegion=document.createElement("div"),this.ariaLiveRegion.setAttribute("aria-live","polite"),this.ariaLiveRegion.setAttribute("aria-atomic","true"),this.ariaLiveRegion.classList.add("visually-hidden"),Object.assign(this.ariaLiveRegion.style,{position:"absolute",height:"1px",width:"1px",overflow:"hidden",clip:"rect(1px, 1px, 1px, 1px)",whiteSpace:"nowrap"}),this.appendChild(this.ariaLiveRegion))}disconnectedCallback(){var t,e;(t=this._abortController)==null||t.abort(),(e=this._resizeObserver)==null||e.disconnect(),this.connected=!1,this.debug&&console.info("[IRNMNCarousel] Cleaned up")}initCarousel(){const t=this.querySelector(this.CLASSNAMES.VIEWPORT);if(!t){console.error("[IRNMNCarousel] Viewport not found");return}this.viewport=t,this.viewport.setAttribute("tabindex","0"),this.viewport.setAttribute("role","region"),this.viewport.setAttribute("aria-roledescription","carousel"),this._rtlScrollType=null,this.slides=Array.from(t.querySelectorAll(this.CLASSNAMES.SLIDES)),this.prevBtn=this.querySelector(this.CLASSNAMES.PREV_BUTTON),this.nextBtn=this.querySelector(this.CLASSNAMES.NEXT_BUTTON),this.pagerCurrent=this.querySelector(this.CLASSNAMES.CURRENT_SLIDE),this.pagerTotal=this.querySelector(this.CLASSNAMES.TOTAL_SLIDES),this.updateTotal(),this.initSlidesAttributes(),this.calculateSnapLefts(),this.syncOverflowState(),this.addScrollListener(),this.addControlsListeners(),this.addKeyboardSupport(),this.setupResizeObserver(),requestAnimationFrame(()=>{this.calculateSnapLefts(),this.syncOverflowState(),this.updateActiveFromScroll()}),this.addListener(window,"load",()=>{this.calculateSnapLefts(),this.updateActiveFromScroll()},{once:!0})}updateTotal(){this.pagerTotal&&(this.pagerTotal.textContent=String(this.slides.length)),this.pagerCurrent&&(this.pagerCurrent.textContent="1")}initSlidesAttributes(){const t=this.slides.length;this.slides.forEach((e,s)=>{e.setAttribute("role","group"),e.setAttribute("aria-roledescription","slide"),e.hasAttribute("aria-label")||e.setAttribute("aria-label",`Item ${s+1} of ${t}`),e.removeAttribute("tabindex")})}getScrollPaddingStart(){const t=getComputedStyle(this.viewport);return this.isRTL()?parseFloat(t.scrollPaddingRight)||0:parseFloat(t.scrollPaddingLeft)||0}calculateSnapLefts(){const t=this.isRTL(),e=this.getScrollPosition(),s=this.getEpsilonPx(),i=this.viewport.getBoundingClientRect(),l=this.getScrollPaddingStart(),o=t?i.right-l:i.left+l;this.snapLefts=this.slides.map(T=>{const h=T.getBoundingClientRect(),d=t?h.right:h.left,b=t?o-d:d-o,u=e+b;return Math.abs(u)<s||u<0?0:u}),this.debug&&console.info("[IRNMNCarousel] snapLefts (unclamped)",this.snapLefts)}setupResizeObserver(){this._resizeObserver=new ResizeObserver(()=>{this.calculateSnapLefts(),this.syncOverflowState(),this.updateActiveFromScroll()}),this._resizeObserver.observe(this.viewport)}addScrollListener(){let t=!1;const e=()=>{t||(t=!0,requestAnimationFrame(()=>{this.syncOverflowState(),this.updateActiveFromScroll({announce:!1}),this.scheduleScrollSettled(),t=!1}))};this.addListener(this.viewport,"scroll",e,{passive:!0})}scheduleScrollSettled(){this._scrollSettledTimer&&clearTimeout(this._scrollSettledTimer),this._scrollSettledTimer=window.setTimeout(()=>{this.updateActiveFromScroll({announce:!0})},this._scrollSettledDelay)}updateActiveFromScroll({announce:t=!1}={}){if(!this.snapLefts.length)return;const e=this.getScrollPosition();if(this.isAtEnd()){this.setActiveIndex(this.slides.length-1,{announce:t}),this.updateControlsDisabledState();return}const s=this.getClosestSnapIndex(e);this.setActiveIndex(s,{announce:t}),this.updateControlsDisabledState()}updateControlsDisabledState(){if(!this.isOverflowing()){this.prevBtn&&(this.prevBtn.disabled=!0),this.nextBtn&&(this.nextBtn.disabled=!0);return}this.prevBtn&&(this.prevBtn.disabled=this.isAtStart()),this.nextBtn&&(this.nextBtn.disabled=this.isAtEnd())}setActiveIndex(t,{announce:e=!1}={}){if(t===this.currentIndex){e&&this.announceActiveIndex(t);return}this.currentIndex=t,this.slides.forEach((s,i)=>{s.classList.toggle("active-slide",i===t)}),this.pagerCurrent&&(this.pagerCurrent.textContent=String(t+1)),e&&this.announceActiveIndex(t),this.dispatchEvent(new CustomEvent("carouselChange",{bubbles:!0,detail:{currentIndex:t,currentElement:this.slides[t],total:this.slides.length}})),this.debug&&console.info("[IRNMNCarousel] Active index",t)}announceActiveIndex(t){this.ariaLiveRegion&&this._lastAnnouncedIndex!==t&&(this._lastAnnouncedIndex=t,this.ariaLiveRegion.textContent=`Item ${t+1} of ${this.slides.length}`)}addControlsListeners(){this.addListener(this.prevBtn,"click",()=>{const t=this.getScrollPosition(),e=this.getEpsilonPx(),s=this.isAtEnd()?this.getMaxScroll()+e*2:t,i=this.getPrevSnapPosition(s);i!==null&&this.scrollToLogicalPosition(i)}),this.addListener(this.nextBtn,"click",()=>{const t=this.getScrollPosition(),e=this.getNextSnapPosition(t);if(e!==null){this.scrollToLogicalPosition(e);return}this.scrollToLogicalPosition(this.getMaxScroll())})}addKeyboardSupport(){this.addListener(this.viewport,"keydown",t=>{var s,i,l,o;if(!this.contains(document.activeElement)||document.activeElement&&["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;const e=this.isRTL();switch(t.key){case"ArrowRight":t.preventDefault(),e?(s=this.prevBtn)==null||s.click():(i=this.nextBtn)==null||i.click();break;case"ArrowLeft":t.preventDefault(),e?(l=this.nextBtn)==null||l.click():(o=this.prevBtn)==null||o.click();break;case"Home":t.preventDefault(),this.scrollToLogicalPosition(0);break;case"End":t.preventDefault(),this.scrollToLogicalPosition(this.getMaxScroll());break}})}refresh(){this.viewport&&(this._lastAnnouncedIndex=null,this.slides=Array.from(this.viewport.querySelectorAll(this.CLASSNAMES.SLIDES)),this.updateTotal(),this.calculateSnapLefts(),this.updateActiveFromScroll(),this.debug&&console.info("[IRNMNCarousel] Refreshed"))}}customElements.get("irnmn-carousel")||customElements.define("irnmn-carousel",C);const y={title:"Components/Carousel",tags:["autodocs"],component:"irnmn-carousel",render:()=>L`
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
        `},c={},p={render:()=>L`
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
    `};var g,_,v;c.parameters={...c.parameters,docs:{...(g=c.parameters)==null?void 0:g.docs,source:{originalSource:"{}",...(v=(_=c.parameters)==null?void 0:_.docs)==null?void 0:v.source}}};var S,f,m;p.parameters={...p.parameters,docs:{...(S=p.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
}`,...(m=(f=p.parameters)==null?void 0:f.docs)==null?void 0:m.source}}};const R=["Default","RTL"];export{c as Default,p as RTL,R as __namedExportsOrder,y as default};
