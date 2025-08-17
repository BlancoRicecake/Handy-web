
import React, { useEffect, useMemo, useState } from "react";

/* ---------------- Mock Data ---------------- */
type Product = {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  sale?: number;
  isNew?: boolean;
  tag?: "HOT" | "BEST" | "NEW" | "SALE";
  rating?: number;
  reviews?: number;
};
const products: Product[] = [
  { id: "1", brand: "HANDY MADE", name: "Glossy Almond Tip – Milk Beige", image: "https://picsum.photos/id/1060/800/800", price: 19000, sale: 25, isNew: true, tag: "HOT", rating: 4.7, reviews: 214 },
  { id: "2", brand: "HANDY MADE", name: "Square Short – Cocoa", image: "https://picsum.photos/id/1059/800/800", price: 16000, sale: 10, tag: "SALE", rating: 4.3, reviews: 88 },
  { id: "3", brand: "HANDY LAB",  name: "Gel Press – Clear Fit", image: "https://picsum.photos/id/1070/800/800", price: 12000, isNew: true, tag: "NEW", rating: 4.5, reviews: 61 },
  { id: "4", brand: "HANDY MADE", name: "Oval Short – Mauve", image: "https://picsum.photos/id/1080/800/800", price: 21000, sale: 30, tag: "BEST", rating: 4.8, reviews: 302 },
  { id: "5", brand: "HANDY CARE", name: "Cuticle Oil – Rose", image: "https://picsum.photos/id/1084/800/800", price: 9000, rating: 4.2, reviews: 41 },
  { id: "6", brand: "HANDY MADE", name: "French Line – Ivory", image: "https://picsum.photos/id/1062/800/800", price: 18000, sale: 15, rating: 4.4, reviews: 77 },
  { id: "7", brand: "HANDY LAB",  name: "Sizer Card v2", image: "https://picsum.photos/id/1056/800/800", price: 3000, tag: "BEST", rating: 4.0, reviews: 19 },
  { id: "8", brand: "HANDY MADE", name: "Matte Coffin – Black", image: "https://picsum.photos/id/1050/800/800", price: 17000, sale: 35, tag: "SALE", rating: 4.6, reviews: 139 },
];

/* ---------------- Utils ---------------- */
const money = (n: number) => n.toLocaleString();
const toQ = (obj: Record<string, string>) =>
  "?" + new URLSearchParams(obj).toString();

/* ---------------- Tiny Router (pathname + search) ---------------- */
function useMiniRouter() {
  const getPath = () => window.location.pathname + window.location.search;
  const [path, setPath] = useState<string>(getPath());
  useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const nav = (to: string) => {
    if (to === path) return;
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };
  return { path, nav };
}

/* ---------------- Small UI ---------------- */
function Badge({ children, tone="black" }: { children: React.ReactNode; tone?: "black"|"red"|"blue" }) {
  const m = { black: "bg-black text-white", red: "bg-red-500 text-white", blue: "bg-blue-600 text-white" } as const;
  return <span className={`text-[10px] px-1.5 py-0.5 rounded ${m[tone]} leading-none`}>{children}</span>;
}
function Stars({ v=0 }: { v?: number }) {
  const full = Math.floor(v); const half = v - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({length:5}).map((_,i)=>(
        <svg key={i} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${i<full? "fill-yellow-400 stroke-yellow-400": i===full&&half? "fill-yellow-300 stroke-yellow-300":"fill-transparent stroke-gray-300"}`} strokeWidth="1.5">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"/>
        </svg>
      ))}
    </div>
  );
}

/* ---------------- Drawer ---------------- */
function Drawer({ open, onClose, children, side="right" }: { open:boolean; onClose:()=>void; children:React.ReactNode; side?: "right"|"left"|"bottom" }) {
  const cls = side==="right"
    ? "top-0 right-0 h-full w-full max-w-sm translate-x-full"
    : side==="left"
      ? "top-0 left-0 h-full w-full max-w-sm -translate-x-full"
      : "left-0 bottom-0 w-full rounded-t-2xl translate-y-full";
  const openCls = side==="bottom" ? "translate-y-0" : "translate-x-0";
  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${open?"opacity-100":"pointer-events-none opacity-0"}`} onClick={onClose}/>
      <div className={`fixed z-50 bg-white shadow-xl transition-transform ${cls} ${open?openCls:""}`}>
        {children}
      </div>
    </>
  );
}

/* ---------------- Top Dark Nav (Cart 링크 제거) ---------------- */
// (C) TopDarkNav 전체 교체
function TopDarkNav({ onOpenCategories, onGo }:{
  onOpenCategories: ()=>void; onGo:(to:string)=>void;
}) {
  const items: {label:string; to:string}[] = [
    {label:"BRANDS", to:"/brands"},
    {label:"SNAP", to:"/snap"},
    {label:"NEWS", to:"/news"},
  ];
  return (
    <div className="hidden md:block bg-[#161616] text-gray-300 text-xs">
      <div className="mx-auto max-w-7xl h-8 flex items-center justify-between px-4">
        <button onClick={onOpenCategories} className="flex items-center gap-2 text-white hover:opacity-90">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"/></svg>
          <span className="font-semibold tracking-wide">Categories</span>
        </button>

        <nav className="hidden lg:flex items-center gap-4">
          {items.map(x=>(
            <a
              key={x.label}
              href={x.to}
              onClick={(e)=>{e.preventDefault(); onGo(x.to);}}
              className="hover:text-white"
            >
              {x.label}
            </a>
          ))}
        </nav>

        {/* 우측 메뉴: Help / My / Likes / Login / Sign up (Cart는 없음) */}
        <div className="flex items-center gap-3">
          <a href="/help"  onClick={(e)=>{e.preventDefault(); onGo("/help");}}  className="hover:text-white">Help</a>
          <a href="/my"    onClick={(e)=>{e.preventDefault(); onGo("/my");}}    className="hover:text-white">My</a>
          <a href="/likes" onClick={(e)=>{e.preventDefault(); onGo("/likes");}} className="hover:text-white">Likes</a>
          <a href="/login" onClick={(e)=>{e.preventDefault(); onGo("/login");}} className="hover:text-white">Login</a>
          <a href="/signup"onClick={(e)=>{e.preventDefault(); onGo("/signup");}}className="hover:text-white">Sign up</a>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Header (중앙 서치 + 장바구니 버튼 유지) ---------------- */
function MainHeader({ cartCount, onCart, onGo }: { cartCount:number; onCart:()=>void; onGo:(to:string)=>void }) {
  const [q,setQ]=useState("");
  const gnb = [
    {label:"랭킹", to:"/ranking"},
    {label:"세일", to:"/sale"},
    {label:"브랜드", to:"/brands"},
    {label:"추천", to:"/recommend"},
    {label:"신상", to:"/new"},
    {label:"트렌드", to:"/trend"},
  ];
  const submitSearch = () => {
    onGo("/search" + toQ({ q }));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
<div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center h-16 px-4">
        <div className="justify-self-start">
          <a className="text-2xl font-extrabold tracking-tight" href="/" onClick={(e)=>{e.preventDefault(); onGo("/");}}>Handy</a>
        </div>

<div className="justify-self-center w-full max-w-2xl">
          <div className="flex items-center gap-2 rounded-full border px-3 py-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-gray-500" strokeWidth="2" fill="none">
              <circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>
            </svg>
            <input
              value={q}
              onChange={e=>setQ(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==="Enter") submitSearch(); }}
              placeholder="검색어를 입력하세요"
              className="w-full text-sm outline-none placeholder:text-gray-400"
            />
            <button onClick={submitSearch} className="text-xs rounded border px-2 py-1">Search</button>
          </div>
        </div>

        <div className="justify-self-end">
          <button onClick={onCart} className="rounded-full border px-3 py-1.5 text-sm">
            장바구니 ({cartCount})
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 overflow-x-auto">
        <div className="flex gap-4 py-2 text-sm whitespace-nowrap">
          {gnb.map(x=>(
            <a key={x.label} href={x.to} onClick={(e)=>{e.preventDefault(); onGo(x.to);}} className="text-gray-700 hover:text-black">{x.label}</a>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero3({ onGo }:{ onGo:(to:string)=>void }) {
  const tiles = [
    { img:"https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1200", title:"라이브 특가", sub:"오늘 21시", tag:"포스트맨", to:"/promo/live" },
    { img:"https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?q=80&w=1200", title:"카테고리데이", sub:"셔츠 & 팬츠", tag:"데일리, 계절 외", to:"/promo/categoryday" },
    { img:"https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200", title:"견고한 데님 셔츠", sub:"최대 20% 할인", tag:"디앤슬로우", to:"/promo/denim" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 mt-3">
      <div className="grid md:grid-cols-3 gap-3">
        {tiles.map((t,i)=>(
          <a key={i} href={t.to} onClick={(e)=>{e.preventDefault(); onGo(t.to);}} className="relative group rounded-lg overflow-hidden bg-gray-100">
            <img src={t.img} className="h-[220px] md:h-[280px] w-full object-cover transition-transform duration-300 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
            <div className="absolute left-3 bottom-3 text-white">
              <div className="text-lg md:text-xl font-semibold">{t.title}</div>
              <div className="text-sm text-gray-200">{t.sub}</div>
              <div className="mt-1 inline-block rounded bg-white/90 px-2 py-0.5 text-xs text-black">{t.tag}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Product cards/sections ---------------- */
function ProductCard({ p, onOpen, onAdd }: { p: Product; onOpen:(id:string)=>void; onAdd:(id:string)=>void }) {
  const salePrice = p.sale ? Math.round(p.price*(100-p.sale)/100) : p.price;
  return (
    <div className="w-[160px] md:w-[200px] shrink-0">
      <button onClick={()=>onOpen(p.id)} className="block w-full text-left">
        <div className="relative rounded-lg overflow-hidden bg-gray-100">
          <img src={p.image} className="aspect-[3/4] w-full object-cover hover:scale-[1.02] transition-transform"/>
          <div className="absolute left-2 top-2 flex gap-1">
            {p.isNew && <Badge tone="blue">NEW</Badge>}
            {p.tag==="HOT" && <Badge tone="red">HOT</Badge>}
            {p.tag==="BEST" && <Badge>BEST</Badge>}
            {p.tag==="SALE" && <Badge tone="red">SALE</Badge>}
            {p.sale ? <Badge tone="red">{p.sale}%</Badge> : null}
          </div>
        </div>
      </button>
      <div className="mt-2 space-y-0.5">
        <div className="text-[11px] text-gray-500">{p.brand}</div>
        <div className="text-[13px] leading-snug h-[34px] overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">{p.name}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-[15px] font-bold">{money(salePrice)}원</div>
          {p.sale ? <div className="text-[12px] text-gray-400 line-through">{money(p.price)}원</div> : null}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1"><Stars v={p.rating ?? 0}/><span className="text-[11px] text-gray-500">({p.reviews ?? 0})</span></div>
          <button onClick={()=>onAdd(p.id)} className="rounded-full border px-3 py-1 text-xs bg-white hover:bg-gray-50">담기</button>
        </div>
      </div>
    </div>
  );
}
function SectionRow({ title, items, onOpen, onAdd }:{
  title:string; items:Product[]; onOpen:(id:string)=>void; onAdd:(id:string)=>void;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base md:text-lg font-semibold">{title}</h2>
        <a href="#" onClick={(e)=>e.preventDefault()} className="text-xs text-gray-500">더보기</a>
      </div>
      <div className="flex gap-4 overflow-x-auto snap-x pb-2">
        {items.map(p=> <div key={p.id} className="snap-start"><ProductCard p={p} onOpen={onOpen} onAdd={onAdd}/></div>)}
      </div>
    </section>
  );
}

/* ---------------- Product Grid (목록 페이지에서 사용) ---------------- */
function ProductGrid({ title, items, onOpen, onAdd }:{
  title:string; items:Product[]; onOpen:(id:string)=>void; onAdd:(id:string)=>void;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-6">
      <h2 className="text-base md:text-lg font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map(p=>(
          <div key={p.id}>
            <ProductCard p={p} onOpen={onOpen} onAdd={onAdd}/>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Detail ---------------- */
// (C) 상세페이지 업그레이드
function Detail({
  id,
  onBack,
  onAdd,
}: {
  id: string;
  onBack: () => void;
  onAdd: (id: string) => void;
}) {
  const p = products.find((x) => x.id === id);
  if (!p) return <div className="p-6">Not found</div>;

  const salePrice = p.sale ? Math.round(p.price * (100 - p.sale) / 100) : p.price;

  // 이미지 갤러리(썸네일)
  const images = React.useMemo(
    () => [
      p.image,
      `https://picsum.photos/seed/${id}-1/800/800`,
      `https://picsum.photos/seed/${id}-2/800/800`,
      `https://picsum.photos/seed/${id}-3/800/800`,
    ],
    [id, p.image]
  );
  const [imgIdx, setImgIdx] = React.useState(0);

  // 옵션/수량
  const [shape, setShape] = React.useState<string>("라운드");
  const [length, setLength] = React.useState<string>("Short");
  const [qty, setQty] = React.useState<number>(1);
  const addToCart = () => {
    for (let i = 0; i < qty; i++) onAdd(p.id);
  };

  // 좋아요/공유
  const [liked, setLiked] = React.useState(false);
  const share = async () => {
    const url = window.location.href;
    if ((navigator as any).share) {
      try { await (navigator as any).share({ title: p.name, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); alert("링크가 복사되었어요!"); } catch {
        alert("공유를 지원하지 않는 브라우저입니다.");
      }
    }
  };

  // 탭
  const tabs = ["상세정보", "리뷰", "Q&A", "배송/반품"] as const;
  type TabKey = typeof tabs[number];
  const [tab, setTab] = React.useState<TabKey>("상세정보");

  // 내부 이동(추천 영역 등에서 사용) — 라우터 nav 없이도 동작하게
  const goTo = (to: string) => {
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* 브레드크럼 + 뒤로가기 */}
      <div className="mb-3 flex items-center gap-3 text-sm text-gray-500">
        <button onClick={onBack} className="underline">← Back</button>
        <span className="select-none">/</span>
        <button onClick={() => goTo("/")} className="hover:underline">Home</button>
        <span>/</span>
        <button className="hover:underline" onClick={() => goTo("/brands")}>{p.brand}</button>
      </div>

      {/* 상단 그리드: 갤러리 / 정보 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 갤러리 */}
        <div>
          <div className="relative overflow-hidden rounded-lg bg-gray-100">
            <img
              src={images[imgIdx]}
              className="w-full aspect-[3/4] object-cover"
            />
            {/* 좌우 이동(간단) */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
              <button
                onClick={() => setImgIdx((v) => (v - 1 + images.length) % images.length)}
                className="rounded-full bg-white/80 p-2 shadow hover:bg-white"
                aria-label="prev"
              >‹</button>
              <button
                onClick={() => setImgIdx((v) => (v + 1) % images.length)}
                className="rounded-full bg-white/80 p-2 shadow hover:bg-white"
                aria-label="next"
              >›</button>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`rounded-md overflow-hidden border ${i === imgIdx ? "border-black" : "border-transparent"}`}
              >
                <img src={src} className="aspect-square object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 정보 */}
        <div className="space-y-3">
          <div className="text-xs text-gray-500">{p.brand}</div>
          <h1 className="text-xl font-semibold">{p.name}</h1>

          <div className="flex items-end gap-2">
            <div className="text-2xl font-bold">{money(salePrice)}원</div>
            {p.sale ? (
              <>
                <div className="text-sm text-gray-400 line-through">{money(p.price)}원</div>
                <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white">{p.sale}%</span>
              </>
            ) : null}
          </div>

          {/* 간단 메타 */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>⭐ {(p.rating ?? 4.5).toFixed(1)}</span>
            <span className="text-gray-400">|</span>
            <span>리뷰 {(p.reviews ?? 0).toLocaleString()}개</span>
            <span className="text-gray-400">|</span>
            <span>무료배송</span>
          </div>

          {/* 옵션 */}
          <div className="pt-2 space-y-2">
            <div>
              <div className="mb-1 text-sm text-gray-600">쉐입</div>
              <div className="flex flex-wrap gap-2">
                {["라운드", "아몬드", "스퀘어", "오벌", "코핀"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`rounded border px-3 py-1 text-sm ${shape === s ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-600">길이</div>
              <div className="flex flex-wrap gap-2">
                {["Short", "Medium", "Long"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setLength(s)}
                    className={`rounded border px-3 py-1 text-sm ${length === s ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 수량 */}
          <div className="flex items-center gap-3 pt-2">
            <div className="text-sm text-gray-600">수량</div>
            <div className="inline-flex items-center rounded border">
              <button className="px-3 py-1" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
              <div className="w-10 text-center">{qty}</div>
              <button className="px-3 py-1" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>

          {/* 구매 버튼 */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button onClick={addToCart} className="rounded-lg border py-2">장바구니 담기</button>
            <button
              onClick={() => {
                try { (window as any).ReactNativeWebView?.postMessage(JSON.stringify({ type: "checkout", id: p.id, qty })); } catch {}
                alert("바로구매(데모)");
              }}
              className="rounded-lg bg-black py-2 text-white"
            >
              바로구매
            </button>
          </div>

          {/* 도구 */}
          <div className="flex items-center gap-3 text-sm pt-1">
            <button onClick={() => setLiked((v) => !v)} className="underline">{liked ? "♥ 찜됨" : "♡ 찜하기"}</button>
            <button onClick={share} className="underline">공유</button>
            <button
              onClick={() => { try { (window as any).ReactNativeWebView?.postMessage(JSON.stringify({ type: "open-sizing", productId: p.id })); } catch {} }}
              className="underline"
            >
              사이징(앱)
            </button>
          </div>

          {/* 간략 정보 */}
          <ul className="list-disc pl-5 text-sm text-gray-700 pt-2 space-y-1">
            <li>옵션: {shape} / {length}</li>
            <li>구성품: 네일 팁 세트, 접착 젤, 파일, 프렙 패드</li>
            <li>제조국: KR</li>
          </ul>
        </div>
      </div>

      {/* 상세/리뷰/Q&A/배송 탭 */}
      <div className="mt-8">
        <div className="border-b">
          <div className="mx-auto max-w-6xl px-4 flex gap-6">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`-mb-px border-b-2 pb-3 text-sm ${tab === t ? "border-black font-semibold" : "border-transparent text-gray-500 hover:text-black"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6 text-sm leading-7 text-gray-700">
          {tab === "상세정보" && (
            <div className="space-y-3">
              <p>견고한 접착력과 편안한 착용감을 가진 핸디 네일 팁. 데일리부터 스페셜데이까지 다양한 스타일을 손쉽게 연출하세요.</p>
              <table className="w-full text-left text-sm">
                <tbody className="[&>tr>td]:py-2">
                  <tr><td className="w-28 text-gray-500">재질</td><td>ABS, UV Gel</td></tr>
                  <tr><td className="text-gray-500">텍스쳐</td><td>매트/글로시</td></tr>
                  <tr><td className="text-gray-500">호환</td><td>핸디 젤/자석 악세사리</td></tr>
                </tbody>
              </table>
              <img src={`https://picsum.photos/seed/${id}-detail/1200/600`} className="w-full rounded-lg" />
            </div>
          )}
          {tab === "리뷰" && (
            <div className="space-y-4">
              <div className="text-gray-800 font-medium">사용자 리뷰 (샘플)</div>
              {[1,2,3].map((i)=>(
                <div key={i} className="rounded border p-3">
                  <div className="flex items-center justify-between">
                    <div>⭐ 4.{i} / 5</div>
                    <div className="text-xs text-gray-500">2025-08-0{i}</div>
                  </div>
                  <p className="mt-2">착용감이 좋고 색감이 예뻐요. 재구매 의사 있습니다.</p>
                </div>
              ))}
            </div>
          )}
          {tab === "Q&A" && (
            <div className="space-y-3">
              <div className="rounded border p-3">
                <div className="text-sm font-medium">Q. 손톱이 짧아도 가능한가요?</div>
                <div className="mt-1 text-gray-700">A. 네, 동봉된 젤과 팁 길이 옵션으로 조절 가능합니다.</div>
              </div>
              <div className="rounded border p-3">
                <div className="text-sm font-medium">Q. 물에 자주 닿아도 되나요?</div>
                <div className="mt-1 text-gray-700">A. 24시간 이후에는 일상 생활에서 무리 없이 사용할 수 있습니다.</div>
              </div>
            </div>
          )}
          {tab === "배송/반품" && (
            <div className="space-y-2">
              <p>평일 14시 이전 주문 시 당일 출고됩니다. (주말/공휴일 제외)</p>
              <p>단순 변심 반품은 수령 후 7일 이내 미개봉 상태에 한해 가능합니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 모바일 하단 고정 구매바 */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white p-3 md:hidden">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-3">
          <div className="text-base font-semibold">{money(salePrice)}원</div>
          <div className="flex gap-2">
            <button onClick={addToCart} className="rounded-lg border px-4 py-2 text-sm">장바구니</button>
            <button
              onClick={() => {
                try { (window as any).ReactNativeWebView?.postMessage(JSON.stringify({ type: "checkout", id: p.id, qty })); } catch {}
                alert("바로구매(데모)");
              }}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Cart Drawer ---------------- */
function CartDrawer({ open, onClose, items, onRemove, onCheckout }:{
  open:boolean; onClose:()=>void; items:{id:string; qty:number}[]; onRemove:(id:string)=>void; onCheckout:(total:number)=>void;
}) {
  const rows = items.map(c=>({ qty:c.qty, p: products.find(s=>s.id===c.id)! })).filter(x=>x.p);
  const total = rows.reduce((a, {qty,p}) => a + qty * (p.sale? Math.round(p.price*(100-p.sale)/100):p.price), 0);
  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${open?"opacity-100":"pointer-events-none opacity-0"}`} onClick={onClose}/>
      <div className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-xl transition-transform ${open?"translate-x-0":"translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <div className="text-lg font-semibold">Cart</div>
            <button onClick={onClose} className="text-sm text-gray-500">Close</button>
          </div>
          <div className="flex-1 overflow-auto divide-y">
            {rows.length===0 && <div className="p-6 text-sm text-gray-500">Empty</div>}
            {rows.map(({qty,p})=>(
              <div key={p.id} className="flex items-center gap-3 p-3">
                <img src={p.image} className="h-16 w-16 rounded object-cover"/>
                <div className="flex-1">
                  <div className="text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.brand}</div>
                </div>
                <div className="w-16 text-right text-sm">{qty}개</div>
                <div className="w-24 text-right text-sm">{money((p.sale? Math.round(p.price*(100-p.sale)/100):p.price)*qty)}원</div>
                <button onClick={()=>onRemove(p.id)} className="ml-2 rounded border px-2 py-1 text-xs">Remove</button>
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <div>Total</div><div className="font-semibold">{money(total)}원</div>
            </div>
            <button onClick={()=>onCheckout(total)} className="w-full rounded-lg bg-black py-2 text-white">Checkout in app</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- Category Drawer (정렬 개선 + 네비게이션) ---------------- */
type CatItem = { name: string; bg: string; icon?: string };
// (C) 규격화된 카테고리 썸네일
type CatThumbSize = "sm" | "md" | "lg";
function CatThumb({
  item,
  size = "sm",
  shape = "circle", // "circle" | "rounded" | "square"
}: {
  item: CatItem & { iconUrl?: string };
  size?: CatThumbSize;
  shape?: "circle" | "rounded" | "square";
}) {
  const S = {
    sm: { wrap: "w-16", box: "h-10 w-10", label: "text-[10px] mt-1.5 min-h-[20px]" },
    md: { wrap: "w-20", box: "h-12 w-12", label: "text-[11px] mt-2 min-h-[28px]" },
    lg: { wrap: "w-24", box: "h-16 w-16", label: "text-[12px] mt-2.5 min-h-[30px]" },
  }[size];

  const shapeCls =
    shape === "circle" ? "rounded-full" : shape === "rounded" ? "rounded-xl" : "rounded-none";

  return (
    <div className={`flex ${S.wrap} flex-col items-center select-none`}>
      <div
        className={`${S.box} ${shapeCls} ${item.bg} flex items-center justify-center text-base`}
        style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)" }}
      >
        {item.iconUrl ? (
          <img src={item.iconUrl} alt="" className={`h-full w-full ${shapeCls} object-cover`} />
        ) : (
          <span>{item.icon ?? ""}</span>
        )}
      </div>
      <div className={`${S.label} w-full text-center leading-snug break-keep`}>{item.name}</div>
    </div>
  );
}

function CategoryDrawer({ open, onClose, onGo }:{ open:boolean; onClose:()=>void; onGo:(to:string)=>void }) {
  const G = {
    style: ["신상","심플","화려","아트","트렌디","클래식","시즌","테마","키치","네츄럴"],
    color: ["레드 계열","핑크 계열","블루 계열","그린 계열","뉴트럴","블랙/화이트"],
    texture: ["글리터","크롬/메탈","매트","벨벳","젤","자석"],
    shape: ["라운드","아몬드","오벌","스틸레토","스퀘어","코핀"],
    length: ["Long","Medium","Short"],
    tpo: ["데일리","파티","웨딩","공연","Special day"],
    ab: ["아티스트","브랜드"],
    nation: ["K네일","J네일","A네일"],
  } as const;

  const toObj = (name:string) => ({ name, bg:"bg-gradient-to-br from-zinc-200 to-zinc-400", icon:"" });
// (C) 간격을 한 곳에서 관리하는 Block
const CAT_SPACING = {
  // 제목과 아이콘 묶음 사이 간격
  titleGap: "mt-4",         // 예: "mt-2", "mt-4", "mt-[12px]"
  // 블록과 블록 사이 간격
  blockGap: "mb-5",         // 예: "mb-6", "mb-[24px]"
  // 아이콘들 가로/세로 간격(원한다면 같이 관리)
  iconGapX: "gap-x-6",      // 예: "gap-x-5", "gap-x-[22px]"
  iconGapY: "gap-y-7",      // 예: "gap-y-6", "gap-y-[28px]"
};

const Block = ({ title, items, group }: { title: string; items: string[]; group: string }) => (
  <div className={CAT_SPACING.blockGap}>
    <div className="text-sm font-semibold">{title}</div>
    <div className={`${CAT_SPACING.titleGap} flex flex-wrap ${CAT_SPACING.iconGapX} ${CAT_SPACING.iconGapY}`}>
      {items.map((name) => {
        const it = toObj(name);
        const to = `/cat/${encodeURIComponent(group)}/${encodeURIComponent(name)}`;
        return (
          <button key={name} onClick={() => { onGo(to); onClose(); }} className="text-left">
            {/* CatThumb는 이전에 안내한 대로 shrink-0 포함 */}
            <CatThumb item={it} size="md" shape="circle" />
          </button>
        );
      })}
    </div>
  </div>
);


  return (
    <Drawer open={open} onClose={onClose} side="left">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <div className="text-lg font-semibold">Categories</div>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <Block title="디자인 / 스타일" items={[...G.style]} group="style"/>
          <Block title="컬러" items={[...G.color]} group="color"/>
          <Block title="텍스쳐" items={[...G.texture]} group="texture"/>
          <Block title="쉐입" items={[...G.shape]} group="shape"/>
          <Block title="길이" items={[...G.length]} group="length"/>
          <Block title="TPO (Time / Place / Occasion)" items={[...G.tpo]} group="tpo"/>
          <Block title="아티스트 / 브랜드" items={[...G.ab]} group="ab"/>
          <Block title="나라" items={[...G.nation]} group="nation"/>
        </div>
      </div>
    </Drawer>
  );
}

/* ---------------- Mega Footer (링크도 라우팅) ---------------- */
function FooterMega({ onGo }:{ onGo:(to:string)=>void }) {
  const cols = [
    { h: "어바웃 HANDY", items: ["회사 소개", "비즈니스 소개", "뉴스룸", "채용 정보", "공지사항"], base:"/about" },
    { h: "파트너 지원", items: ["입점 문의", "광고/제휴 문의", "협찬 문의", "공동/대량 구매 문의", "제조/생산 문의", "이미지/저작권 문의"], base:"/partner" },
    { h: "고객 지원", items: ["1:1 문의하기", "FAQ 자주 묻는 질문", "고객센터 9611-1711", "운영시간: 평일 09:00 ~ 18:00 (12:00~13:00 제외)", "cs@handy.com"], base:"/support" },
  ];
  const policy = [
    {label:"개인정보처리방침", to:"/policy/privacy"},
    {label:"이용약관", to:"/policy/terms"},
    {label:"결제대행 위탁사", to:"/policy/pg"},
    {label:"분쟁해결기준", to:"/policy/dispute"},
    {label:"영상정보처리기기 운영·관리방침", to:"/policy/cctv"},
  ];

  return (
    <footer className="mt-10 bg-[#f5f5f5] text-[#666]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-5">
          {cols.map((c) => (
            <div key={c.h}>
              <div className="mb-2 text-sm font-semibold text-[#333]">{c.h}</div>
              <ul className="space-y-1 text-[13px]">
                {c.items.map((it) => (
                  <li key={it}>
                    <a href={`${c.base}/${encodeURIComponent(it)}`} onClick={(e)=>{e.preventDefault(); onGo(`${c.base}/${encodeURIComponent(it)}`);}} className="hover:underline">{it}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="my-6 h-px bg-[#e5e5e5]" />

        <div className="text-[12px] leading-6 text-[#777]">
          <div className="text-[#444] font-medium">© MUSINSA ALL RIGHTS RESERVED</div>
          <p className="mt-2">
            에르모세아르 | 대표자: 김동현 | 주소: 경기도 용인시 기흥구 공세로 150-29, B01-G160호 | 통신판매업 신고번호: 2024-용인기흥-2437 |
            사업자등록번호: 106-16-34319(사업자정보확인)
          </p>
    
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {policy.map((p)=>(
              <a key={p.label} href={p.to} onClick={(e)=>{e.preventDefault(); onGo(p.to);}} className="underline">{p.label}</a>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[#888]">
            {["윤리·준법경영 국제 표준 통합 인증","안전보건경영시스템 국제 인증","정보보호 관리체계 ISMS 인증"].map((c)=>(
              <span key={c} className="inline-flex items-center gap-2 rounded-full border px-2 py-1">
                <span className="h-4 w-4 rounded-full bg-[#ddd]" /> {c}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-8 text-[#888]">
            {["YT","IG","X","TikTok","Blog"].map((k)=>(
              <a key={k} href={`/sns/${k.toLowerCase()}`} onClick={(e)=>{e.preventDefault(); onGo(`/sns/${k.toLowerCase()}`);}} className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ddd] text-[10px]">{k}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Simple Pages ---------------- */
function TitleBar({ title, desc }:{ title:string; desc?:string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-5">
      <h1 className="text-xl font-semibold">{title}</h1>
      {desc && <p className="text-sm text-gray-500 mt-1">{desc}</p>}
    </div>
  );
}

/* ---------------- App ---------------- */
/* ===== SNAP PAGE ===== */
/* ===== SNAP PAGE (업데이트) ===== */
function SnapPage({ onGo, onOpen }: { onGo: (to: string) => void; onOpen: (id: string) => void }) {
  // URL 기반 활성 탭 결정
  const pathname = window.location.pathname;
  type TabKey = "snap" | "today" | "ranking" | "following";
  const active: TabKey =
    pathname.startsWith("/snap/today")
      ? "today"
      : pathname.startsWith("/snap/ranking")
      ? "ranking"
      : pathname.startsWith("/snap/following")
      ? "following"
      : "snap";

  // 데모용 이미지
  const all = [
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200",
    "https://images.unsplash.com/photo-1520975922233-2c2a7b93c6f0?q=80&w=1200",
    "https://images.unsplash.com/photo-1520975858862-3151d0b43fd2?q=80&w=1200",
    "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=1200",
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200",
    "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
    "https://images.unsplash.com/photo-1520975915280-38b9f19f3a3f?q=80&w=1200",
    "https://images.unsplash.com/photo-1520975921483-978f3254b1c0?q=80&w=1200",
  ];

  // 탭별 정렬/선별(데모 로직)
  const pick = (arr: string[]) => arr.slice(0, 12);
  const images =
    active === "today"
      ? pick([...all]) // 최신순 느낌(원본)
      : active === "ranking"
      ? pick([...all].reverse()) // 인기순 느낌(역순)
      : active === "following"
      ? pick([...all].filter((_, i) => i % 2 === 0)) // 팔로우 피드 느낌
      : pick([...all]);

  // 좋아요 토글
  const [liked, setLiked] = React.useState<Set<number>>(new Set());
  const toggleLike = (i: number) =>
    setLiked((prev) => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  // 예쁜 필터 아이콘 & 칩
  const FilterIcon = () => (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
  const Chevron = () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const Chip = ({ label }: { label: string }) => (
    <button className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm bg-white hover:bg-gray-50">
      <span>{label}</span>
      <Chevron />
    </button>
  );

  // 정렬 라벨(탭에 따라 다르게 보이게)
  const sortLabel = active === "today" ? "최신순" : active === "ranking" ? "좋아요순" : "인기순";

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 py-5">
        {/* 상단 타이틀 + 우측 아이콘 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">SNAP</h1>
          <div className="flex items-center gap-5 text-gray-700">
            {/* 아이콘만 유지 */}
            <svg viewBox="0 0 24 24" className="h-5 w-5"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M15 17H9a5 5 0 0 1-5-5V9a7 7 0 1 1 14 0v3a5 5 0 0 0 5 5h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            <svg viewBox="0 0 24 24" className="h-5 w-5"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M4 20a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </div>
        </div>

        {/* 탭 */}
        <div className="mt-5 flex items-end gap-6 text-[15px]">
          <button className={`pb-2 ${active === "snap" ? "border-b-2 border-black font-semibold" : "text-gray-500 hover:text-black"}`} onClick={()=>onGo("/snap")}>스냅</button>
          <button className={`pb-2 ${active === "today" ? "border-b-2 border-black font-semibold" : "text-gray-500 hover:text-black"}`} onClick={()=>onGo("/snap/today")}>투데이</button>
          <button className={`pb-2 ${active === "ranking" ? "border-b-2 border-black font-semibold" : "text-gray-500 hover:text-black"}`} onClick={()=>onGo("/snap/ranking")}>랭킹</button>
          <button className={`pb-2 ${active === "following" ? "border-b-2 border-black font-semibold" : "text-gray-500 hover:text-black"}`} onClick={()=>onGo("/snap/following")}>팔로잉</button>
        </div>

        {/* 필터 칩 (남/여, 키/몸무게 제거) */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* 더 예쁜 필터 버튼 */}
          <button className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 bg-white/80 backdrop-blur shadow-sm hover:bg-white">
            <FilterIcon />
            <span className="text-sm">필터</span>
          </button>

          {[ "계절", "스타일", "TPO", "카테고리", "브랜드"].map((x) => (
            <Chip key={x} label={x} />
          ))}
        </div>

        {/* 개수/정렬 */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>1,036,126개</div>
          <button className="inline-flex items-center gap-1">{sortLabel} <Chevron/></button>
        </div>

        {/* 사진 그리드 */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, i) => (
            <div key={i} className="relative group">
              <button onClick={() => onOpen(String((i % products.length) + 1))} className="block w-full" title="상세 보기">
                <img src={src} className="w-full aspect-[3/4] object-cover rounded" />
              </button>
              <button onClick={() => toggleLike(i)} className="absolute bottom-2 right-2" aria-label="like">
                <svg viewBox="0 0 24 24" className={`w-6 h-6 drop-shadow ${liked.has(i) ? "fill-red-500" : "fill-white/70"}`}>
                  <path d="M12 21s-6.7-4.35-9.3-8.04C.48 9.7 2.01 6 5.39 6c1.7 0 3.02.91 3.88 2.02C10.13 6.91 11.45 6 13.15 6c3.38 0 4.91 3.7 2.69 6.96C18.7 16.65 12 21 12 21z" stroke="white" strokeWidth="1"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== MY PAGE (대시보드) ===== */
function MyPage({
  onGo,
  onOpen,
}: {
  onGo: (to: string) => void;
  onOpen: (id: string) => void;
}) {
  // 샘플 사용자 / 집계
  const me = {
    nickname: "speed1",
    level: "HANDY+",
    points: 2300,
    coupons: 2,
    ordersWaiting: 0,
    shipping: 0,
    cs: 0,
    likes: 23,
  };

  // 작은 유틸
  const Right = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const Stat = ({
    label,
    value,
    to,
  }: {
    label: string;
    value: string;
    to: string;
  }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        onGo(to);
      }}
      className="flex-1 rounded-lg border bg-white p-3 text-left hover:bg-gray-50"
    >
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-base font-semibold">{value}</div>
    </a>
  );

  const LinkRow = ({
    title,
    to,
    note,
  }: {
    title: string;
    to: string;
    note?: string;
  }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        onGo(to);
      }}
      className="flex items-center justify-between border-b py-3 text-sm hover:bg-gray-50"
    >
      <div className="flex items-center gap-2">
        <span>{title}</span>
        {note ? (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {note}
          </span>
        ) : null}
      </div>
      <Right />
    </a>
  );

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section className="mt-6 rounded-lg border bg-white">
      <div className="border-b px-4 py-3 text-[15px] font-semibold">
        {title}
      </div>
      <div className="px-4">{children}</div>
    </section>
  );

  // 최근 본 상품(샘플 데이터 사용)
  const recent = products.slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      {/* 상단 요약 바 */}
      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">내 정보</div>
            <div className="mt-1 text-lg font-semibold">
              {me.nickname} <span className="text-gray-400">/</span>{" "}
              <span className="text-blue-600">{me.level}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href="/my/settings"
              onClick={(e) => {
                e.preventDefault();
                onGo("/my/settings");
              }}
              className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              설정
            </a>
            <a
              href="/logout"
              onClick={(e) => {
                e.preventDefault();
                alert("로그아웃(데모)");
              }}
              className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              로그아웃
            </a>
          </div>
        </div>

        {/* 요약 통계 4분할 */}
        <div className="mt-3 flex gap-2">
          <Stat label="주문/배송" value={`${me.ordersWaiting}건`} to="/my/orders" />
          <Stat label="배송중" value={`${me.shipping}건`} to="/my/shipping" />
          <Stat label="포인트" value={`${me.points.toLocaleString()}P`} to="/my/points" />
          <Stat label="쿠폰" value={`${me.coupons}장`} to="/my/coupons" />
        </div>

        {/* 프로모션 배너 */}
        <a
          href="/promo/plus"
          onClick={(e) => {
            e.preventDefault();
            onGo("/promo/plus");
          }}
          className="mt-4 block rounded-lg bg-blue-600 px-4 py-3 text-white"
        >
          <div className="text-sm opacity-90">핸디플러스 멤버</div>
          <div className="text-[15px] font-semibold">
            멤버십 최대 10% 적립 혜택
          </div>
        </a>
      </div>

      {/* 최근 본 / 위시리스트 요약 */}
      <Section title="최근 본">
        {recent.length === 0 ? (
          <div className="py-6 text-sm text-gray-500">최근 본 상품이 없습니다.</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto py-3">
            {recent.map((p) => (
              <button
                key={p.id}
                onClick={() => onOpen(p.id)}
                className="w-[140px] shrink-0 text-left"
                title={p.name}
              >
                <img
                  src={p.image}
                  className="aspect-[3/4] w-full rounded object-cover"
                />
                <div className="mt-1 line-clamp-2 text-xs">{p.name}</div>
              </button>
            ))}
          </div>
        )}
      </Section>

      {/* 주문/반품/리뷰 등 주요 메뉴 */}
      <Section title="주문·배송 / 반품·교환">
        <div className="divide-y">
          <LinkRow title="주문 내역" to="/my/orders" />
          <LinkRow title="반품/교환 내역" to="/my/claims" />
          <LinkRow title="취소 내역" to="/my/cancel" />
        </div>
      </Section>

      <Section title="리뷰·좋아요">
        <div className="divide-y">
          <LinkRow title="내 리뷰 관리" to="/my/reviews" />
          <LinkRow title="좋아요(위시리스트)" to="/likes" note={`${me.likes}`} />
        </div>
      </Section>

      <Section title="혜택 / 결제">
        <div className="divide-y">
          <LinkRow title="쿠폰" to="/my/coupons" note={`${me.coupons}장`} />
          <LinkRow title="포인트" to="/my/points" note={`${me.points.toLocaleString()}P`} />
          <LinkRow title="결제수단 관리" to="/my/payments" />
        </div>
      </Section>

      <Section title="고객센터 / 설정">
        <div className="divide-y">
          <LinkRow title="1:1 문의" to="/support/contact" />
          <LinkRow title="FAQ" to="/support/faq" />
          <LinkRow title="알림/푸시 설정" to="/my/notifications" />
          <LinkRow title="회원정보 수정" to="/my/settings" />
        </div>
      </Section>
    </div>
  );
}
/* ===== LIKES PAGE ===== */
function LikesPage({
  onGo,
  onOpen,
}: {
  onGo: (to: string) => void;
  onOpen: (id: string) => void;
}) {
  // 데모용 좋아요 상품(3개) — 필요 시 서버/스토리지 연동으로 교체
  const initial = products.slice(0, 3).map((p) => p.id);
  const [liked, setLiked] = React.useState<string[]>(initial);
  const likedProducts = products.filter((p) => liked.includes(p.id));

  // 탭 카운트 (샘플)
  const counts = {
    goods: likedProducts.length,
    brand: 1,
    snap: 0,
    folder: 0,
  };

  const toggleLike = (id: string) =>
    setLiked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const Chip = ({ label, active }: { label: string; active?: boolean }) => (
    <button
      className={`rounded-md border px-3 py-1.5 text-sm ${
        active ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  const Switch = ({ label }: { label: string }) => (
    <label className="inline-flex select-none items-center gap-2 text-sm">
      <input type="checkbox" className="peer sr-only" />
      <span className="h-5 w-9 rounded-full bg-gray-300 peer-checked:bg-black transition-colors relative">
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white peer-checked:translate-x-4 transition-transform" />
      </span>
      {label}
    </label>
  );

  const HeartBtn = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 drop-shadow ${active ? "fill-red-500" : "fill-white/80"}`}>
      <path
        d="M12 21s-6.7-4.35-9.3-8.04C.48 9.7 2.01 6 5.39 6c1.7 0 3.02.91 3.88 2.02C10.13 6.91 11.45 6 13.15 6c3.38 0 4.91 3.7 2.69 6.96C18.7 16.65 12 21 12 21z"
        stroke="white"
        strokeWidth="1"
      />
    </svg>
  );

  const LikeCard = ({ p }: { p: Product }) => {
    const salePrice = p.sale ? Math.round(p.price * (100 - p.sale) / 100) : p.price;
    const loved = liked.includes(p.id);
    return (
      <div className="rounded-lg bg-white overflow-hidden border">
        <div className="relative">
          <button onClick={() => onOpen(p.id)} className="block w-full">
            <img src={p.image} className="w-full aspect-[3/2] object-cover" />
          </button>
          <button
            onClick={() => toggleLike(p.id)}
            className="absolute bottom-2 right-2"
            aria-label="like"
            title="좋아요"
          >
            <HeartBtn active={loved} />
          </button>
          {/* 좌상단 뱃지(예: '굿딜') */}
          <div className="absolute left-2 top-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] text-white">
            굿딜
          </div>
        </div>
        <div className="p-3 text-sm">
          <div className="text-gray-500">{p.brand}</div>
          <div className="mt-0.5 line-clamp-2">{p.name}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-base font-semibold">{salePrice.toLocaleString()}원</div>
            {p.sale ? (
              <>
                <div className="text-xs text-gray-400 line-through">{p.price.toLocaleString()}원</div>
                <span className="text-xs text-red-600 font-semibold">{p.sale}%</span>
              </>
            ) : null}
          </div>
          <div className="mt-1 text-xs text-gray-600">
            ♥ {(p.reviews ?? 0).toLocaleString()} · ★ {(p.rating ?? 4.5).toFixed(1)}
          </div>
          <div className="mt-2">
            <span className="rounded border px-2 py-0.5 text-xs text-gray-600">무료반품</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <h1 className="text-xl font-semibold">좋아요</h1>

      {/* 상단 탭 */}
      <div className="mt-3 flex items-end gap-6 text-[15px]">
        <button className="pb-2 font-semibold border-b-2 border-black">
          상품 {counts.goods}
        </button>
        <button className="pb-2 text-gray-500 hover:text-black" onClick={() => onGo("/likes/brands")}>
          브랜드 {counts.brand}
        </button>
        <button className="pb-2 text-gray-500 hover:text-black" onClick={() => onGo("/likes/snap")}>
          스냅 {counts.snap}
        </button>
        <button className="pb-2 text-gray-500 hover:text-black" onClick={() => onGo("/likes/folders")}>
          내폴더 {counts.folder}
        </button>
      </div>

      {/* 카테고리 칩 + 우측 정렬 */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Chip label="전체" active />
            {/* 파란 말풍선 */}
            <div className="absolute left-0 top-[110%] whitespace-nowrap rounded bg-blue-600 px-2 py-1 text-xs text-white shadow">
              폴더를 만들고<br />공유할 수 있어요
            </div>
          </div>
          {["신발", "아우터", "상의", "바지", "액세서리"].map((x) => (
            <Chip key={x} label={x} />
          ))}
          <div className="ml-3 flex items-center gap-4">
            <Switch label="세일중" />
            <Switch label="품절제외" />
          </div>
        </div>
        <button className="inline-flex items-center gap-1 rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
          담은순
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 카드 그리드 */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {likedProducts.map((p) => (
          <LikeCard key={p.id} p={p} />
        ))}
        {likedProducts.length === 0 && (
          <div className="col-span-full rounded border bg-white p-6 text-center text-sm text-gray-500">
            좋아요한 상품이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
/* ===== NEWS DATA & UI ===== */
type NewsCategory = "event" | "nail" | "handy" | "update";
type NewsPost = {
  slug: string;
  title: string;
  category: NewsCategory;
  date: string; // YYYY-MM-DD
  cover: string;
  excerpt: string;
  tags: string[];
  body?: string[];
};

const newsPosts: NewsPost[] = [
  {
    slug: "grand-opening-popup",
    title: "HANDY 팝업 스토어 GRAND OPEN",
    category: "event",
    date: "2025-08-14",
    cover: "https://images.unsplash.com/photo-1515165562835-c3b8c0f0b3a0?q=80&w=1200",
    excerpt: "주말 한정 사은품 증정 · 무료 사이징 부스 운영!",
    tags: ["오프라인", "사은품", "이벤트"],
    body: [
      "8/16(토)~8/18(월) 성수 팝업에서 사이징 상담과 신상 라인을 체험하세요.",
      "현장 구매 고객 대상 한정 굿즈 증정(소진 시 종료).",
      "운영시간: 11:00~20:00, 입장 무료.",
    ],
  },
  {
    slug: "nail-art-howto-french-line",
    title: "3분 완성: 프렌치 라인 네일 아트 가이드",
    category: "nail",
    date: "2025-08-10",
    cover: "https://images.unsplash.com/photo-1616394584738-74e3d9a4b6e8?q=80&w=1200",
    excerpt: "초보도 가능한 라인 잡기 · 톤 추천 · 유지 팁까지.",
    tags: ["튜토리얼", "프렌치", "팁"],
    body: [
      "베이스는 미색·아이보리 톤이 가장 무난합니다.",
      "라인은 얇게 두 번 겹칠수록 번짐이 적어요.",
      "마무리 탑젤은 큐티클 포함해 얇게 1코트.",
    ],
  },
  {
    slug: "handy-app-0-9-0",
    title: "HANDY 앱 0.9.0 업데이트 — 사이징 카드 v2",
    category: "update",
    date: "2025-08-05",
    cover: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1200",
    excerpt: "카메라 보정·측정 정확도 개선, 알림함 신설.",
    tags: ["앱 업데이트", "사이징"],
    body: [
      "새 사이징 카드 v2를 사용하면 측정 오차가 평균 23% 감소합니다.",
      "푸시 알림함에서 배송/쿠폰/이벤트를 한 곳에서 확인.",
      "버그 픽스 및 성능 향상.",
    ],
  },
  {
    slug: "handy-collab-artist",
    title: "ARTIST 콜라보 캡슐 컬렉션 공개",
    category: "handy",
    date: "2025-08-02",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
    excerpt: "국내 아티스트 3인과 함께한 리미티드 아트 팁.",
    tags: ["콜라보", "신상"],
    body: [
      "각 아티스트의 드로잉을 팁 표면에 UV 인쇄로 구현했습니다.",
      "8월 한정 수량으로 판매합니다.",
    ],
  },
  {
    slug: "end-summer-deal",
    title: "END OF SUMMER DEAL — 최대 40% 세일",
    category: "event",
    date: "2025-08-01",
    cover: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200",
    excerpt: "시즌오프 + 베스트 라인 묶음 혜택.",
    tags: ["세일", "프로모션"],
    body: ["기간: 8/1~8/20", "일부 품목 제외, 재고 소진 시 조기 종료될 수 있습니다."],
  },
  {
    slug: "nail-trend-aw25",
    title: "AW25 네일 트렌드 리포트",
    category: "handy",
    date: "2025-07-30",
    cover: "https://images.unsplash.com/photo-1520975924531-8b6a9bcd5f43?q=80&w=1200",
    excerpt: "네츄럴 텍스처와 미니멀 파스텔 톤이 부상.",
    tags: ["트렌드", "리포트"],
    body: ["톤온톤 그라데이션과 매트 텍스처 조합이 키 포인트.", "라운드·아몬드 쉐입이 강세입니다."],
  },
];

const catLabel: Record<NewsCategory, string> = {
  event: "이벤트",
  nail: "네일아트",
  handy: "HANDY 소식",
  update: "업데이트",
};

function CategoryPill({ c }: { c: NewsCategory }) {
  const map = {
    event: "bg-pink-600",
    nail: "bg-emerald-600",
    handy: "bg-indigo-600",
    update: "bg-amber-600",
  } as const;
  return <span className={`text-[11px] px-2 py-0.5 rounded text-white ${map[c]}`}>{catLabel[c]}</span>;
}

function ArticleCard({
  p,
  onGo,
}: {
  p: NewsPost;
  onGo: (to: string) => void;
}) {
  return (
    <article className="rounded-lg overflow-hidden border bg-white hover:shadow-sm transition">
      <button onClick={() => onGo(`/news/${p.slug}`)} className="block w-full text-left">
        <img src={p.cover} className="w-full aspect-[16/9] object-cover" />
      </button>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <CategoryPill c={p.category} />
          <div className="text-[11px] text-gray-500">{p.date}</div>
        </div>
        <h3 className="mt-1 text-[15px] font-semibold line-clamp-2">{p.title}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{p.excerpt}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {p.tags.map((t) => (
            <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600">
              #{t}
            </span>
          ))}
        </div>
        <button
          onClick={() => onGo(`/news/${p.slug}`)}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          자세히 보기 →
        </button>
      </div>
    </article>
  );
}

/* ===== NEWS LIST ===== */
function NewsPage({
  onGo,
  onOpenProduct,
}: {
  onGo: (to: string) => void;
  onOpenProduct: (id: string) => void;
}) {
  const [tab, setTab] = React.useState<NewsCategory | "all">("all");
  const [show, setShow] = React.useState(6); // Load more

  const counts = {
    all: newsPosts.length,
    event: newsPosts.filter((p) => p.category === "event").length,
    nail: newsPosts.filter((p) => p.category === "nail").length,
    handy: newsPosts.filter((p) => p.category === "handy").length,
    update: newsPosts.filter((p) => p.category === "update").length,
  };

  const filtered =
    tab === "all" ? newsPosts : newsPosts.filter((p) => p.category === tab);

  const featured = filtered.slice(0, 3);
  const rest = filtered.slice(3, show);

  const TabBtn = ({
    k,
    label,
  }: {
    k: NewsCategory | "all";
    label: string;
  }) => {
    const active = tab === k;
    return (
      <button
        onClick={() => {
          setTab(k);
          setShow(6);
        }}
        className={`pb-2 text-[15px] ${
          active
            ? "border-b-2 border-black font-semibold"
            : "text-gray-500 hover:text-black"
        }`}
      >
        {label}
        <span className="ml-1 text-gray-400 text-[13px]">
          {counts[k as keyof typeof counts]}
        </span>
      </button>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">NEWS</h1>
          <p className="text-sm text-gray-600">이벤트 · 네일 아트 튜토리얼 · HANDY 관련 소식</p>
        </div>
        {/* 간단 검색 (데모) */}
        <div className="hidden md:block w-64">
          <div className="flex items-center gap-2 rounded-full border px-3 py-1.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-gray-500" strokeWidth="2" fill="none">
              <circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>
            </svg>
            <input placeholder="뉴스 검색" className="w-full text-sm outline-none"/>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="mt-5 flex items-end gap-6">
        <TabBtn k="all" label="전체" />
        <TabBtn k="event" label="이벤트" />
        <TabBtn k="nail" label="네일아트" />
        <TabBtn k="handy" label="HANDY 소식" />
        <TabBtn k="update" label="업데이트" />
      </div>

      {/* 특집 히어로(상단 3개) */}
      <section className="mt-5 grid gap-3 md:grid-cols-3">
        {featured.map((p) => (
          <ArticleCard key={p.slug} p={p} onGo={onGo} />
        ))}
      </section>

      {/* 태그/바로가기/이벤트 타임라인(간단) */}
      <section className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold mb-2">추천 태그</div>
          <div className="flex flex-wrap gap-2">
            {["신상", "세일", "프렌치", "사이징", "팁", "콜라보"].map((t) => (
              <button
                key={t}
                onClick={() => onGo(`/news?tag=${encodeURIComponent(t)}`)}
                className="rounded-full border px-3 py-1 text-sm bg-white hover:bg-gray-50"
              >
                #{t}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold mb-2">다가오는 이벤트</div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>성수 팝업 · 사이징 부스</span>
              <span className="text-gray-500">8/16</span>
            </li>
            <li className="flex items-center justify-between">
              <span>콜라보 런칭 라이브</span>
              <span className="text-gray-500">8/20</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 일반 목록 */}
      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <ArticleCard key={p.slug} p={p} onGo={onGo} />
        ))}
      </section>

      {/* Load more */}
      {show < filtered.length && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShow((s) => s + 6)}
            className="rounded-full border px-5 py-2 text-sm bg-white hover:bg-gray-50"
          >
            더 보기
          </button>
        </div>
      )}

      {/* 하단 뉴스레터 CTA */}
      <section className="mt-8 rounded-xl bg-gradient-to-r from-zinc-900 to-gray-800 p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">HANDY 뉴스레터</div>
            <p className="text-sm text-white/80">이벤트와 신상 소식을 가장 먼저 받아보세요.</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2 rounded-full bg-white px-3 py-2">
            <input placeholder="이메일 주소" className="w-full text-sm text-black outline-none"/>
            <button onClick={()=>alert("구독 신청(데모)")} className="rounded-full bg-black px-4 py-1.5 text-sm">구독</button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===== NEWS ARTICLE DETAIL ===== */
function NewsArticle({
  slug,
  onGo,
  onOpenProduct,
}: {
  slug: string;
  onGo: (to: string) => void;
  onOpenProduct: (id: string) => void;
}) {
  const p = newsPosts.find((x) => x.slug === slug);
  if (!p) return <div className="mx-auto max-w-3xl px-4 py-10">존재하지 않는 기사입니다.</div>;

  const related = newsPosts.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);

  const share = async () => {
    const url = window.location.href;
    if ((navigator as any).share) {
      try { await (navigator as any).share({ title: p.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("링크가 복사되었습니다.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button onClick={()=>onGo("/news")} className="text-sm underline">← NEWS로 돌아가기</button>
      <div className="mt-3 flex items-center justify-between">
        <CategoryPill c={p.category}/>
        <div className="text-xs text-gray-500">{p.date}</div>
      </div>
      <h1 className="mt-2 text-2xl font-semibold">{p.title}</h1>
      <img src={p.cover} className="mt-3 w-full rounded-lg object-cover" />
      <div className="prose prose-sm mt-4 max-w-none">
        {(p.body ?? []).map((para, i)=> <p key={i}>{para}</p>)}
      </div>
      <div className="mt-4 flex items-center gap-2">
        {p.tags.map(t => <span key={t} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">#{t}</span>)}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={share} className="rounded border px-3 py-1.5 text-sm">공유</button>
        <button onClick={()=>onGo("/brands")} className="rounded border px-3 py-1.5 text-sm">브랜드 둘러보기</button>
      </div>

      {/* 연관 기사 */}
      {related.length > 0 && (
        <section className="mt-8">
          <div className="mb-2 text-sm font-semibold">연관 소식</div>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map(r => <ArticleCard key={r.slug} p={r} onGo={onGo}/>)}
          </div>
        </section>
      )}
    </div>
  );
}
/* ===== HELP (고객센터) ===== */
type Faq = { q: string; a: string };
const faqs: Faq[] = [
  { q: "주문/배송 조회는 어디서 하나요?", a: "MY > 주문 내역에서 실시간 배송상태를 확인할 수 있어요. 앱에서는 알림함에서도 확인 가능합니다." },
  { q: "반품/교환은 어떻게 신청하나요?", a: "MY > 반품/교환 내역에서 신청하세요. 수거지와 사유를 입력하면 접수됩니다. 포장 상태를 꼭 확인해 주세요." },
  { q: "결제수단 변경/영수증 발급이 가능한가요?", a: "결제 완료 후 수단 변경은 불가합니다. 현금영수증/세금계산서는 MY > 결제/영수증에서 발급됩니다." },
  { q: "계정/비밀번호를 잊어버렸어요.", a: "로그인 화면에서 '비밀번호 재설정'을 이용하세요. 이메일 인증이 어려우면 고객센터로 연락 주세요." },
  { q: "사이징 기능이 동작하지 않아요.", a: "앱 권한(카메라/저장공간)을 허용했는지 확인하고, 조명 환경에서 다시 시도해 보세요. 계속 안 되면 1:1 상담으로 문의해 주세요." },
];

function HelpPage({ onGo }: { onGo: (to: string) => void }) {
  const tel = "1544-7199";
  const email = "cs@handy.com";
  const mailto = `mailto:${email}?subject=${encodeURIComponent("[HANDY] 문의")}&body=${encodeURIComponent("안녕하세요, 문의드립니다.\n\n주문번호:\n내용:")}`;

  const openChat = () => {
    // 웹에선 /support/contact 로 이동, 앱에선 브릿지 메세지 전송
    try { (window as any).ReactNativeWebView?.postMessage(JSON.stringify({ type: "open-chat" })); } catch {}
    onGo("/support/contact");
  };

  const [query, setQuery] = React.useState("");
  const filtered = faqs.filter(f => {
    const q = query.trim();
    return q === "" || (f.q + f.a).toLowerCase().includes(q.toLowerCase());
  });

  const ActionBtn = ({ icon, label, href, onClick }:{
    icon: React.ReactNode; label: string; href?: string; onClick?: ()=>void;
  }) => (
    href ? (
      <a href={href} className="flex-1 rounded-xl border bg-white px-4 py-3 text-center hover:bg-gray-50">
        <div className="mx-auto mb-1 h-6 w-6">{icon}</div>
        <div className="text-sm font-medium">{label}</div>
      </a>
    ) : (
      <button onClick={onClick} className="flex-1 rounded-xl border bg-white px-4 py-3 hover:bg-gray-50">
        <div className="mx-auto mb-1 h-6 w-6">{icon}</div>
        <div className="text-sm font-medium">{label}</div>
      </button>
    )
  );

  const PhoneI = () => (<svg viewBox="0 0 24 24" className="h-6 w-6"><path d="M5 3h4l2 5-3 2a14 14 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" fill="currentColor"/></svg>);
  const MailI  = () => (<svg viewBox="0 0 24 24" className="h-6 w-6"><path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>);
  const ChatI  = () => (<svg viewBox="0 0 24 24" className="h-6 w-6"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>);

  const FAQItem = ({ f }: { f: Faq }) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="rounded-lg border bg-white">
        <button onClick={() => setOpen(v=>!v)} className="w-full px-4 py-3 text-left">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{f.q}</span>
            <span className="text-gray-400">{open ? "−" : "+"}</span>
          </div>
        </button>
        {open && <div className="px-4 pb-4 text-sm text-gray-700">{f.a}</div>}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-semibold tracking-tight">HELP</h1>
      <p className="text-sm text-gray-600">문의 유형을 선택하거나 FAQ에서 빠르게 답을 찾으세요.</p>

      {/* 핵심 액션 */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <ActionBtn icon={<PhoneI/>} label={`고객센터 연결 (${tel})`} href={`tel:${tel}`} />
        <ActionBtn icon={<MailI/>}  label="이메일 보내기" href={mailto} />
        <ActionBtn icon={<ChatI/>}  label="1:1 상담 연결" onClick={openChat} />
      </div>

      {/* 운영 정보 / 안내 */}
      <div className="mt-3 rounded-lg bg-gray-100 px-4 py-3 text-xs text-gray-700">
        상담시간: 평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00) · 토/일/공휴일 휴무
      </div>

      {/* 검색 */}
      <div className="mt-5">
        <div className="flex items-center gap-2 rounded-full border px-4 py-2 bg-white">
          <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-gray-500" strokeWidth="2" fill="none">
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>
          </svg>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="FAQ 검색 (예: 반품, 영수증, 배송)"
            className="w-full text-sm outline-none"
          />
        </div>
      </div>

      {/* FAQ 리스트 */}
      <div className="mt-4 space-y-2">
        {filtered.map((f, i) => <FAQItem key={i} f={f} />)}
        {filtered.length === 0 && (
          <div className="rounded-lg border bg-white px-4 py-6 text-center text-sm text-gray-500">
            검색 결과가 없습니다. 키워드를 바꿔보거나 1:1 상담을 이용하세요.
          </div>
        )}
      </div>

      {/* 추가 안내 */}
      <div className="mt-6 rounded-xl bg-gradient-to-r from-zinc-900 to-gray-800 p-5 text-white">
        <div className="text-[15px] font-semibold">해결이 안 되시나요?</div>
        <p className="mt-1 text-sm text-white/80">주문 번호를 준비하시면 더 빠르게 도와드릴 수 있어요.</p>
        <div className="mt-3 flex gap-2">
          <a href={`tel:${tel}`} className="rounded-full bg-white px-4 py-1.5 text-sm text-black">고객센터 전화</a>
          <button onClick={openChat} className="rounded-full bg-white/10 px-4 py-1.5 text-sm">1:1 상담</button>
        </div>
      </div>
    </div>
  );
}
/* ===== LOGIN PAGE ===== */
function LoginPage({ onGo }: { onGo: (to: string) => void }) {
  const [id, setId] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [auto, setAuto] = React.useState(false);
  const [showPw, setShowPw] = React.useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!id || !pw) return alert("아이디와 비밀번호를 입력하세요.");
    // TODO: 실제 인증 연동
    alert(`로그인(데모): ${id}${auto ? " (자동로그인)" : ""}`);
    onGo("/");
  };

  const oauth = (provider: "kakao" | "apple" | "google" | "naver") => {
    try {
      (window as any).ReactNativeWebView?.postMessage(
        JSON.stringify({ type: "oauth", provider })
      );
    } catch {}
    // 데모: 해당 경로로 라우팅만
    onGo(`/auth/${provider}`);
  };

  // 간단 아이콘
  const KakaoI = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M12 4C7.58 4 4 6.9 4 10.47c0 2.2 1.47 4.13 3.68 5.26L6.8 19.9a.6.6 0 0 0 .9.69l3.76-2.2c.18.01.36.02.54.02 4.42 0 8-2.9 8-6.47C20 6.9 16.42 4 12 4z"
        fill="currentColor"
      />
    </svg>
  );
  const AppleI = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M16.36 12.2c0-2.3 1.88-3.35 1.96-3.4-1.08-1.58-2.75-1.8-3.35-1.82-1.42-.14-2.8.83-3.53.83-.74 0-1.86-.81-3.05-.79-1.57.02-3  .91-3.8 2.31-1.63 2.83-.42 7.02 1.17 9.32.78 1.12 1.71 2.38 2.93 2.34 1.18-.05 1.63-.76 3.06-.76s1.83.76 3.06.73c1.27-.02 2.07-1.14 2.84-2.26.89-1.29 1.26-2.54 1.27-2.6-.03-.01-2.43-.93-2.56-3.9zM14.9 4.9c.64-.77 1.08-1.85.96-2.93- .92.04-2.03.61-2.69 1.38-.59.69-1.11 1.78-.97 2.83 1.02.08 2.06-.52 2.7-1.28z"
        fill="currentColor"
      />
    </svg>
  );
  const GoogleI = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#EA4335" d="M12 10.2v3.84h5.45C17.02 16.9 14.77 18.6 12 18.6a6.6 6.6 0 1 1 0-13.2c1.78 0 3.39.68 4.64 1.78l2.62-2.62A10.5 10.5 0 0 0 12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5c5.4 0 9.9-3.9 10.35-9.0.05-.54.05-1.08.05-1.3H12z"/>
      <path fill="#4285F4" d="M23.35 12.2c0-.43-.04-.86-.1-1.26H12v3.84h6.4a5.5 5.5 0 0 1-2.38 3.62l3.62 2.8c2.11-1.95 3.31-4.83 3.31-9z"/>
      <path fill="#FBBC05" d="M6.64 14.26a6.6 6.6 0 0 1 0-4.52L3.02 6.9a10.5 10.5 0 0 0 0 10.2l3.62-2.84z"/>
      <path fill="#34A853" d="M12 22.5c2.77 0 5.1-.92 6.8-2.5l-3.62-2.8c-1 .7-2.26 1.1-3.18 1.1a6.6 6.6 0 0 1-6.36-4.0L3.02 17.1C4.73 20.4 8.1 22.5 12 22.5z"/>
    </svg>
  );
  const NaverI = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="24" height="24" rx="4" fill="#03C75A" />
      <path d="M8 7h3.5l3 4.7V7H18v10h-3.5l-3-4.7V17H8V7z" fill="white" />
    </svg>
  );

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="rounded-lg bg-gray-100 px-4 py-3 text-[15px] font-semibold">
        로그인/회원가입
      </div>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="아이디"
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
        />

        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
            className="w-full rounded-lg border px-4 py-3 pr-10 text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-label="비밀번호 표시 전환"
          >
            {showPw ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white"
        >
          로그인
        </button>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={auto}
              onChange={(e) => setAuto(e.target.checked)}
            />
            자동 로그인
          </label>
          <div className="flex items-center gap-2">
            <a
              href="/find/id"
              onClick={(e) => {
                e.preventDefault();
                onGo("/find/id");
              }}
              className="hover:underline"
            >
              아이디 찾기
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/find/pw"
              onClick={(e) => {
                e.preventDefault();
                onGo("/find/pw");
              }}
              className="hover:underline"
            >
              비밀번호 찾기
            </a>
          </div>
        </div>
      </form>

      {/* 소셜 로그인 */}
      <div className="mt-4 space-y-2">
        <button
          onClick={() => oauth("kakao")}
          className="w-full rounded-lg bg-[#FEE500] py-3 text-sm font-medium text-black inline-flex items-center justify-center gap-2"
        >
          <KakaoI /> 카카오 로그인
        </button>
        <button
          onClick={() => oauth("apple")}
          className="w-full rounded-lg bg-white border py-3 text-sm font-medium inline-flex items-center justify-center gap-2"
        >
          <AppleI /> Apple 로그인
        </button>
        <button
          onClick={() => oauth("google")}
          className="w-full rounded-lg bg-white border py-3 text-sm font-medium inline-flex items-center justify-center gap-2"
        >
          <GoogleI /> Google 로그인
        </button>
        <button
          onClick={() => oauth("naver")}
          className="w-full rounded-lg py-3 text-sm font-medium text-white inline-flex items-center justify-center gap-2"
          style={{ backgroundColor: "#03C75A" }}
        >
          <NaverI /> NAVER 로그인
        </button>
      </div>

      {/* 가입 유도 */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <span className="text-sm text-gray-700">가입만 해도 즉시 20% 할인</span>
        <button
          onClick={() => onGo("/signup")}
          className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          회원가입
        </button>
      </div>

      {/* 비회원 주문 조회 */}
      <div className="mt-10 text-center text-sm">
        <span className="text-gray-600 mr-2">비회원으로 주문하셨나요?</span>
        <a
          href="/guest/orders"
          onClick={(e) => {
            e.preventDefault();
            onGo("/guest/orders");
          }}
          className="underline"
        >
          비회원 주문 조회
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const { path, nav } = useMiniRouter();
/* ===== BRANDS PAGE ===== */
function BrandsPage({
  onGo,
  onOpen,
  onAdd,
}: {
  onGo: (to: string) => void;
  onOpen: (id: string) => void;
  onAdd: (id: string) => void;
}) {
  // 상단 필터 탭(스냅샷 느낌의 칩들)
  const tabs = [
    { label: "브랜드 랭킹", key: "rank" },
    { label: "장바구니 BEST", key: "cartbest" },
    { label: "핸디 추천 PICK", key: "pick" },
    { label: "핸서 태그", key: "tag" },
    { label: "신상 특집", key: "new" },
  ];
  const url = new URL(window.location.href);
  const tab = url.searchParams.get("tab") ?? "rank";

  const TabChip = ({ label, active, to }: { label: string; active?: boolean; to: string }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        onGo(to);
      }}
      className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm ${
        active ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
      }`}
    >
      {label}
    </a>
  );

  // 브랜드 섹션 (샘플로 3개)
  const brandNames = ["HANDY MADE", "HANDY LAB", "HANDY CARE"] as const;
  const byBrand = (name: string) => products.filter((p) => p.brand === name);

  const BrandRow = ({ name }: { name: string }) => {
    const items = byBrand(name);
    if (items.length === 0) return null;
    return (
      <section className="mt-6">
        <div className="mb-2 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <div className="text-[15px] font-semibold">{name}</div>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">핫딜</span>
          </div>
          <a
            href={`/brand/${encodeURIComponent(name)}`}
            onClick={(e) => {
              e.preventDefault();
              onGo(`/brand/${encodeURIComponent(name)}`);
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            브랜드 프로필
          </a>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map((p) => (
            <div key={p.id} className="snap-start">
              <ProductCard p={p} onOpen={onOpen} onAdd={onAdd} />
            </div>
          ))}
        </div>
      </section>
    );
  };

  // 정렬/기간(우측 드롭다운처럼 보이는 버튼)
  const DropBtn = ({ label }: { label: string }) => (
    <button className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-sm bg-white hover:bg-gray-50">
      {label}
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 py-5">
        {/* 필터 칩들 */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <TabChip key={t.key} label={t.label} active={tab === t.key} to={`/brands?tab=${t.key}`} />
          ))}
        </div>

        {/* 상단 보조 바: 업데이트/정렬 */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <div>13시간 전</div>
          <div className="flex items-center gap-2">
            <DropBtn label="최근 1일" />
            <DropBtn label="관심순" />
          </div>
        </div>

        {/* 브랜드 묶음 섹션들 */}
        {brandNames.map((name) => (
          <BrandRow key={name} name={name} />
        ))}
      </div>

      {/* 우측 플로팅 버튼 */}
      <div className="fixed right-6 bottom-6 flex flex-col items-center gap-3">
        <button className="h-12 w-12 rounded-full bg-white border text-xl leading-none">⬆</button>
        <button className="h-10 px-4 rounded-full bg-white border text-sm">전체</button>
      </div>
    </div>
  );
}

  // Cart
  const [cart, setCart] = useState<{id:string; qty:number}[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const add = (id:string) => setCart(prev=>{
    const i = prev.findIndex(x=>x.id===id);
    if(i>=0){ const next=[...prev]; next[i]={...next[i], qty: next[i].qty+1}; return next; }
    return [...prev, {id, qty:1}];
  });
  const remove = (id:string) => setCart(prev=>prev.filter(x=>x.id!==id));
  const count = cart.reduce((a,c)=>a+c.qty,0);
  const checkout = (total:number)=>{ try{ (window as any).ReactNativeWebView?.postMessage(JSON.stringify({type:"checkout", total})); }catch{}; setDrawer(false); };

  /* --------- Routing map --------- */
  const [pathname, search] = useMemo(()=>{
    const u = new URL(window.location.href);
    return [u.pathname, u.search] as const;
  }, [path]);

  const q = useMemo(()=> new URLSearchParams(search), [search]);

  // helper screens
  const openProduct = (id:string)=> nav(`/p/${id}`);
  const addProduct = (id:string)=> add(id);

  let screen: React.ReactNode;

  // Product detail
  const mDetail = pathname.match(/^\/p\/(.+)$/);
  if (mDetail) {
    screen = <Detail id={decodeURIComponent(mDetail[1])} onBack={()=>history.back()} onAdd={addProduct}/>;
  } else if (pathname.startsWith("/brands")) {
  screen = (
    <BrandsPage
      onGo={nav}
      onOpen={openProduct}
      onAdd={addProduct}
    />
  );
}
 else if (pathname.startsWith("/snap")) {
    screen = screen = <SnapPage onGo={nav} onOpen={openProduct} />;
  } else if (pathname.startsWith("/news")) {
  const m = pathname.match(/^\/news\/(.+)$/);
  if (m) {
    // 기사 상세
    screen = <NewsArticle slug={decodeURIComponent(m[1])} onGo={nav} onOpenProduct={openProduct} />;
  } else {
    // 목록
    screen = <NewsPage onGo={nav} onOpenProduct={openProduct} />;
  }
} 
 else if (pathname.startsWith("/ranking")) {
    screen = (<><TitleBar title="랭킹"/><ProductGrid title="Top Rated" items={[...products].sort((a,b)=>(b.rating??0)-(a.rating??0))} onOpen={openProduct} onAdd={addProduct}/></>);
  } else if (pathname.startsWith("/sale")) {
    screen = (<><TitleBar title="세일"/><ProductGrid title="할인 중" items={products.filter(p=>p.sale)} onOpen={openProduct} onAdd={addProduct}/></>);
  } else if (pathname.startsWith("/recommend")) {
    screen = (<><TitleBar title="추천"/><ProductGrid title="회원님을 위한 추천" items={[...products]} onOpen={openProduct} onAdd={addProduct}/></>);
  } else if (pathname.startsWith("/new")) {
    screen = (<><TitleBar title="신상"/><ProductGrid title="방금 등록된 상품" items={products.filter(p=>p.isNew)} onOpen={openProduct} onAdd={addProduct}/></>);
  } else if (pathname.startsWith("/trend")) {
    screen = (<><TitleBar title="트렌드"/><ProductGrid title="지금 뜨는 상품" items={[...products].sort((a,b)=>(b.sale??0)-(a.sale??0))} onOpen={openProduct} onAdd={addProduct}/></>);
  } else if (pathname.startsWith("/promo/")) {
    const slug = pathname.split("/").pop();
    screen = (<><TitleBar title={`프로모션: ${slug}`} desc="프로모션 기획전"/><SectionRow title="기획전 상품" items={[...products]} onOpen={openProduct} onAdd={addProduct}/></>);
  } else if (pathname.startsWith("/cat/")) {
    const parts = pathname.split("/").slice(2).map(decodeURIComponent);
    const [group, name] = parts;
    screen = (<><TitleBar title={`${group?.toUpperCase()} / ${name}`} desc="카테고리 결과"/><ProductGrid title="카테고리 상품" items={[...products]} onOpen={openProduct} onAdd={addProduct}/></>);
  } else if (pathname.startsWith("/search")) {
    const keyword = q.get("q") ?? "";
    screen = (<><TitleBar title={`검색: ${keyword || "전체"}`} desc="검색 결과"/><ProductGrid title="검색 결과" items={[...products]} onOpen={openProduct} onAdd={addProduct}/></>);
} else if (pathname.startsWith("/help")) {
  screen = <HelpPage onGo={nav} />;
  } else if (pathname.startsWith("/likes")) {
  screen = <LikesPage onGo={nav} onOpen={openProduct} />;
  } else if (pathname.startsWith("/my")) {
  screen = <MyPage onGo={nav} onOpen={openProduct} />;
}  else if (pathname.startsWith("/login")) {
  screen = <LoginPage onGo={nav} />;
}


 else {
    // Home
    screen = (
      <>
        <Hero3 onGo={nav}/>
        <SectionRow title="신상 제품" items={[...products].reverse()} onOpen={openProduct} onAdd={addProduct}/>
        <SectionRow title="회원님을 위한 추천상품" items={products} onOpen={openProduct} onAdd={addProduct}/>
        <SectionRow title="시즌 트렌드 상품" items={[...products].sort((a,b)=>(b.sale??0)-(a.sale??0))} onOpen={openProduct} onAdd={addProduct}/>
      </>
    );
  }

  return (
  <>
    {/* 앱(WebView)에서만 숨길 요소 */}
    <div data-apphide="true">
      <TopDarkNav onOpenCategories={() => setCatOpen(true)} onGo={nav} />
    </div>
    <div data-apphide="true">
      <MainHeader cartCount={count} onCart={() => setDrawer(true)} onGo={nav} />
    </div>

    {/* 본문은 절대 숨김 래퍼 안에 넣지 않기 */}
    {screen}

    <FooterMega onGo={nav} />
    <CartDrawer
      open={drawer}
      onClose={() => setDrawer(false)}
      items={cart}
      onRemove={remove}
      onCheckout={checkout}
    />
    <CategoryDrawer
      open={catOpen}
      onClose={() => setCatOpen(false)}
      onGo={nav}
    />
  </>
);
}

