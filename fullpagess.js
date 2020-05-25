function main() {
  const e = Array.from || ((e) => [].slice.call(e)),
    t =
      window.unescape ||
      function (e) {
        return e;
      },
    s = Promise.prototype.then.bind(Promise.resolve()),
    n = window.requestAnimationFrame || s || queueMicrotask;
  function r(e) {
    n(() => n(e));
  }
  function o(e, t, s) {
    return new Promise((n) => {
      let r;
      const o = (e) => {
        clearTimeout(r), n(e);
      };
      e.addEventListener(t, o, { once: !0 }),
        e.addEventListener("error", () => o({ IS_ERROR: !0 }), { once: !0 }),
        (r = setTimeout(o, s || 5e3));
    });
  }
  const i = [
      "margin",
      "marginLeft",
      "marginTop",
      "marginBottom",
      "marginRight",
    ],
    a = {},
    l = a.hasOwnProperty,
    c =
      "assign" in Object
        ? a.constructor.assign
        : function (e) {
            for (let t = 1; t < arguments.length; t++) {
              const s = arguments[t];
              for (const t in s) l.call(s, t) && (e[t] = s[t]);
            }
            return e;
          },
    h = { data: 1, blob: 1 };
  function d(e, t) {
    const s = getComputedStyle(e),
      n = [];
    for (const e of s) {
      const t = s.getPropertyValue(e);
      t && n.push(`${e}:${t};`);
    }
    t.style.cssText = n.join("");
  }
  class u {
    transform(e, t, s) {
      return this._inline(e, t, s && s.options.timeout).then((e) => ({
        node: e,
      }));
    }
    test(e) {
      return "IMG" === e.tagName && !h[e.src.substr(0, 4)];
    }
    static requestRenderer(e) {
      const t = new u();
      e.tapRenderProcess(t);
    }
    _inline(e, t, s) {
      if (!(e instanceof HTMLImageElement || e instanceof HTMLVideoElement))
        return Promise.resolve(e);
      if ("blob" === e.src.substr(0, 4)) {
        const n = this._draw(t),
          r = new Image();
        r.style.cssText = e.style.cssText;
        const i = o(r, "load", s);
        return (r.src = n.c.toDataURL()), e.replaceWith(r), i.then(() => r);
      }
      const n = o(e, "load", s).then((t) => {
        if (t.IS_ERROR) return;
        const n = this._draw(e),
          r = n.c;
        if (
          !(function (e) {
            try {
              return !e.getImageData(0, 0, 1, 1);
            } catch (e) {
              return !0;
            }
          })(n.ctx)
        ) {
          const t = o(e, "load", s),
            n = r.toDataURL();
          return (e.src = n), t.then(() => e);
        }
      });
      return (e.crossOrigin = "anonymous"), n;
    }
    _draw(e) {
      const t = document.createElement("canvas");
      (t.height = e.videoHeight || e.height),
        (t.width = e.videoWidth || e.width);
      const s = t.getContext("2d");
      return s.drawImage(e, 0, 0), { ctx: s, c: t };
    }
  }
  class _ {
    test(e) {
      return "VIDEO" === e.tagName;
    }
    transform(e, t) {
      const s = new u();
      return s.transform(e, t).then((n) => {
        const r = new Image();
        if (((r.style.cssText = e.style.cssText), null == n.node)) {
          const n = e.poster;
          if (n) return (r.src = n), e.replaceWith(r), s.transform(r, t);
        }
        return (r.src = e.src), e.replaceWith(r), { node: r };
      });
    }
    static requestRenderer(e) {
      const t = new _();
      e.tapRenderProcess(t);
    }
  }
  class m {
    constructor() {
      this._inlineProps = [
        "backgroundImage",
        "borderImageSource",
        "content",
        "cursor",
        "listStyleImage",
        "mask",
      ];
    }
    static requestRenderer(e) {
      const t = new m();
      e.tapRenderProcess(t);
    }
    _getInlinableImage(e) {
      const t = (e.split("url(")[1] || "")
        .split(")")[0]
        .trim()
        .replace(/['"]/g, "");
      if ("http" === t.substr(0, 4).toLowerCase()) return t;
    }
    test(e) {
      return this._inlineProps.some((t) => e.style[t].indexOf("url(") > -1);
    }
    transform(e, t) {
      const s = e.style;
      return Promise.all(
        this._inlineProps.map((e) => {
          const n = this._getInlinableImage(s[e]);
          if (n) {
            const r = new Image();
            return (
              (r.src = n),
              new u().transform(r, t).then(() => (s[e] = `url('${r.src}')`))
            );
          }
        })
      ).then(() => ({ node: e }));
    }
  }
  const g = { SCRIPT: 1, STYLE: 1, HEAD: 1, NOSCRIPT: 1 };
  let DOMShot = (() => {
    class s {
      constructor(e, t) {
        (this._img = null),
          (this._imgReadyForCanvas = null),
          (this._width = null),
          (this._height = null),
          (this._svg = null),
          (this._canvas = document.createElement("canvas")),
          (this._canvasContext = this._canvas.getContext("2d")),
          (this._canvasState = null),
          (this._sourceNode = null),
          (this._clonedNode = null),
          (this._sourceChildren = null),
          (this._clonedChildren = null),
          (this._xmlSerializer = new XMLSerializer()),
          (this._nodeTraversalHooks = []),
          (this.options = c(t || {}, {
            inlineImages: !0,
            inlineVideos: !0,
            timeout: 5e3,
            dimensionGetter: "scroll",
          })),
          e && this.from(e),
          this.options.inlineImages &&
            (u.requestRenderer(this), m.requestRenderer(this)),
          this.options.inlineVideos && _.requestRenderer(this);
      }
      _reset() {
        (this._imgReadyForCanvas = null),
          (this._clonedChildren = null),
          (this._sourceChildren = null),
          (this._clonedChildren = null),
          (this._sourceNode = null),
          (this._clonedNode = null);
      }
      _clone() {
        const t = this._sourceNode.cloneNode(!0);
        (this._clonedNode = t),
          (this._sourceChildren = e(this._sourceNode.querySelectorAll("*"))),
          (this._clonedChildren = e(this._clonedNode.querySelectorAll("*"))),
          t.scroll({
            left: this._sourceNode.scrollLeft,
            top: this._sourceNode.scrollTop,
          });
      }
      _generateSVG() {
        const e = this._sourceNode,
          s = this._clonedNode;
        let n, r;
        if ("offset" === this.options.dimensionGetter) {
          const t = e.offsetWidth,
            s = e.clientHeight;
          (n = Math.max(e.offsetWidth, e.clientWidth)), (r = Math.max(t, s));
        } else (n = e.scrollWidth), (r = e.scrollHeight);
        s.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        const i = this._xmlSerializer.serializeToString(s);
        (this._svg = `<?xml version='1.0' encoding='UTF-8' ?><svg\n    xmlns="http://www.w3.org/2000/svg"\n      width="${n}"\n      height="${r}">\n      <foreignObject width="100%" height="100%" x="0" y="0">${i}</foreignObject>\n    </svg>\n   `),
          (this._img = new Image(n, r)),
          (this._imgReadyForCanvas = o(
            this._img,
            "load",
            this.options.timeout
          )),
          (this._img.src =
            "data:image/svg+xml;charset=utf-8;base64," +
            btoa(t(encodeURIComponent(this._svg)))),
          (this._width = n),
          (this._height = r);
      }
      _fillCanvas() {
        this._canvasState !== s.DRAWN &&
          (this._canvasContext.drawImage(this._img, 0, 0),
          (this._canvasState = s.DRAWN),
          this._reset());
      }
      _generateCanvas() {
        if (this._canvasState === s.DRAWN) return;
        const e = document.createElement("canvas"),
          t = e.getContext("2d");
        (e.height = this._height),
          (e.width = this._width),
          (this._canvas = e),
          (this._canvasContext = t);
      }
      _drawImage() {
        return new Promise((e, t) => {
          this._canvasState === s.DRAW_PENDING &&
            t("Please call Screenshot first"),
            r(() => (this._fillCanvas(), e(this)));
        });
      }
      _processChildNodes() {
        const e = this._sourceChildren,
          t = [];
        return (
          this._clonedChildren.forEach((s, n) => {
            if (g[s.tagName] || "none" === s.style.display) return s.remove();
            t.push(this._sequentiallyRunTraversalHook(s, e[n]));
          }),
          Promise.all(t)
        );
      }
      _sequentiallyRunTraversalHook(e, t) {
        return new Promise((s) => {
          const n = this._nodeTraversalHooks,
            r = n.length;
          let o = -1;
          const i = () => {
            if (++o == r) return s();
            const a = n[o];
            a.test(e)
              ? a.transform(e, t, this).then((t) => {
                  (e = t.node), i();
                })
              : i();
          };
          i();
        });
      }
      tapRenderProcess(e) {
        this._nodeTraversalHooks.push(e);
      }
      from(e) {
        return (
          this._reset(),
          (this._width = this._height = 0),
          (this._canvasState = s.DRAW_PENDING),
          (this._sourceNode = e),
          this
        );
      }
      screenshot() {
        return (
          this._clone(),
          new Promise((e) => {
            if (!this._clonedNode)
              throw new Error("No source node has been specified");
            !(function (e, t) {
              for (let s = 0; s < e.length; s++) d(t[s], e[s]);
            })(this._clonedChildren, this._sourceChildren),
              this._processChildNodes().then(() => {
                var t, s;
                return (
                  d(this._sourceNode, this._clonedNode),
                  (t = this._clonedNode).style.background ||
                    t.style.backgroundImage ||
                    t.style.backgroundColor ||
                    (this._clonedNode.style.background = (function e(t) {
                      if (!t) return;
                      const s = t.parentElement;
                      return s && s.style
                        ? s.style.background ||
                            s.style.backgroundColor ||
                            s.style.backgroundImage ||
                            e(s)
                        : void 0;
                    })(this._sourceNode)),
                  (s = this._clonedNode),
                  i.forEach((e) => (s.style[e] = "")),
                  this._generateSVG(),
                  this._imgReadyForCanvas.then(() => {
                    (this._imgReadyForCanvas = null),
                      this._generateCanvas(),
                      this._fillCanvas(),
                      e(this);
                  })
                );
              });
          })
        );
      }
      toDataUri(e, t) {
        return new Promise((s) =>
          this._drawImage().then(() =>
            r(() => s(this._canvas.toDataURL(e || "image/jpeg", t || 1)))
          )
        );
      }
      toBlob(e, t) {
        return new Promise((s) =>
          this._drawImage().then(() =>
            r(() => this._canvas.toBlob(s, e || "image/jpeg", t || 1))
          )
        );
      }
    }
    return (s.DRAW_PENDING = 0), (s.DRAWN = 1), s;
  })();

  async function screenshot() {
    const shot = new DOMShot(document.documentElement, {
      drawImgTagsOnCanvas: true,
    });
    await shot.screenshot();
    return URL.createObjectURL(await shot.toBlob("image/png"));
  }

  function download(url) {
    Object.assign(document.createElement("a"), {
      download: `image-${+new Date()}`,
      href: url,
    }).click();
  }

  (async () => download(await screenshot()))();
}

main();
