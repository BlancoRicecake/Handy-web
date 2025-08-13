import React, { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  sale?: number;
  isNew?: boolean;
  tag?: "HOT" | "BEST" | "NEW" | "SALE";
  gender?: "MEN" | "WOMEN" | "UNISEX";
};

const sample: Product[] = [
  { id: "1", brand: "HANDY MADE", name: "Glossy Almond Tip – Milk Beige", image: "https://picsum.photos/id/1060/600/600", price: 19000, sale: 25, isNew: true, tag: "HOT", gender: "WOMEN" },
  { id: "2", brand: "HANDY MADE", name: "Square Short – Cocoa", image: "https://picsum.photos/id/1059/600/600", price: 16000, sale: 10, tag: "SALE", gender: "UNISEX" },
  { id: "3", brand: "HANDY LAB",  name: "Gel Press – Clear Fit", image: "https://picsum.photos/id/1070/600/600", price: 12000, isNew: true, tag: "NEW", gender: "UNISEX" },
  { id: "4", brand: "HANDY MADE", name: "Oval Short – Mauve", image: "https://picsum.photos/id/1080/600/600", price: 21000, sale: 30, tag: "BEST", gender: "WOMEN" },
  { id: "5", brand: "HANDY CARE", name: "Cuticle Oil – Rose", image: "https://picsum.photos/id/1084/600/600", price: 9000, gender: "UNISEX" },
  { id: "6", brand: "HANDY MADE", name: "French Line – Ivory", image: "https://picsum.photos/id/1062/600/600", price: 18000, sale: 15, gender: "WOMEN" },
  { id: "7", brand: "HANDY LAB",  name: "Sizer Card v2", image: "https://picsum.photos/id/1056/600/600", price: 3000, tag: "BEST", gender: "UNISEX" },
  { id: "8", brand: "HANDY MADE", name: "Matte Coffin – Black", image: "https://picsum.photos/id/1050/600/600", price: 17000, sale: 35, tag: "SALE", gender: "MEN" },
];

const money = (n: number) => n.toLocaleString();

type BadgeProps = { children: React.ReactNode; tone?: "black" | "red" | "blue" };
function Badge({ children, tone = "black" }: BadgeProps) {
  const map = { black: "bg-black text-white", red: "bg-red-500 text-white", blue: "bg-blue-600 text-white" };
  return <span className={`text-[10px] px-1.5 py-0.5 rounded ${map[tone]} leading-none`}>{children}</span>;
}

function Heart({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-5 h-5 ${filled ? "fill-red-500 stroke-red-500" : "stroke-gray-700 fill-transparent"}`} strokeWidth="1.5">
      <path d="M12 21s-6.716-4.385-9.193-7.43C.977 10.459 2.2 7 5.42 7c1.83 0 2.96 1.044 3.58 2.062C9.62 8.044 10.75 7 12.58 7c3.22 0 4.443 3.459 2.613 6.57C18.716 16.615 12 21 12 21Z"/>
    </svg>
  );
}

export default function App() {
  const [tab, setTab] = useState<"RECO" | "BEST" | "NEW">("RECO");
  const [gender, setGender] = useState<"ALL" | "MEN" | "WOMEN" | "UNISEX">("ALL");
  const [sort, setSort] = useState<"POPULAR" | "LATEST" | "LOW" | "HIGH" | "SALE">("POPULAR");

  useEffect(() => {
    // _blank 링크를 같은 창으로 강제 (WebView 호환)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (a && a.getAttribute("target") === "_blank") {
        e.preventDefault();
        window.location.assign(a.href);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const filtered = useMemo(() => {
    let items = sample.slice();
    if (gender !== "ALL") items = items.filter(p => (p.gender ?? "UNISEX") === gender || p.gender === "UNISEX");
    switch (sort) {
      case "LOW": items.sort((a,b)=> (a.sale? a.price*(100-a.sale)/100:a.price) - (b.sale? b.price*(100-b.sale)/100:b.price)); break;
      case "HIGH": items.sort((a,b)=> (b.sale? b.price*(100-b.sale)/100:b.price) - (a.sale? a.price*(100-a.sale)/100:a.price)); break;
      case "SALE": items.sort((a,b)=> (b.sale ?? 0) - (a.sale ?? 0)); break;
      case "LATEST": items.reverse(); break;
      default: break;
    }
    return items;
  }, [gender, sort]);

  return (
    <div className="min-h-screen bg-white">
      {/* header */}
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="text-xl font-extrabold tracking-tight">Handy</div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <button className="rounded-full border px-2.5 py-1">Search</button>
            <button className="rounded-full border px-2.5 py-1">Cart</button>
          </div>
        </div>

        {/* tabs */}
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex gap-3 py-2 text-sm">
            {[
              { k: "RECO", label: "Recommend" },
              { k: "BEST", label: "Best" },
              { k: "NEW", label: "New" },
            ].map(({k,label}) => (
              <button
                key={k}
                onClick={()=>setTab(k as any)}
                className={`rounded-full px-3 py-1.5 ${tab===k? "bg-black text-white":"bg-gray-100"}`}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* filters */}
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 text-[13px]">
            {["ALL","WOMEN","MEN","UNISEX"].map(g => (
              <button key={g} onClick={()=>setGender(g as any)}
                className={`whitespace-nowrap rounded-full border px-3 py-1 ${gender===g? "bg-black text-white border-black":"border-gray-300"}`}>
                {g}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              {[
                {k:"POPULAR", label:"Popular"},
                {k:"LATEST", label:"Latest"},
                {k:"LOW", label:"Low Price"},
                {k:"HIGH", label:"High Price"},
                {k:"SALE", label:"Sale %"},
              ].map(s=>(
                <button key={s.k} onClick={()=>setSort(s.k as any)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 ${sort===s.k? "bg-gray-900 text-white border-gray-900":"border-gray-300"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* grid */}
      <main className="mx-auto max-w-6xl px-4 py-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map(p => (
            <div className="group" key={p.id}>
              <div className="relative overflow-hidden rounded-xl bg-gray-100">
                <img src={p.image} alt={p.name} className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute left-2 top-2 flex gap-1">
                  {p.isNew && <Badge tone="blue">NEW</Badge>}
                  {p.tag === "HOT" && <Badge tone="red">HOT</Badge>}
                  {p.tag === "BEST" && <Badge>BEST</Badge>}
                  {p.tag === "SALE" && <Badge tone="red">SALE</Badge>}
                  {p.sale ? <Badge tone="red">{p.sale}%</Badge> : null}
                </div>
              </div>
              <button className="mt-1 rounded-full bg-white p-1.5 shadow ring-1 ring-black/10">
                <div className="flex items-center gap-1">
                  <Heart />
                  <span className="text-xs text-gray-600">Like</span>
                </div>
              </button>
              <div className="mt-2 space-y-0.5">
                <div className="text-[11px] text-gray-500">{p.brand}</div>
                <div className="text-[13px] leading-snug min-h-[34px] overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                  {p.name}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-[15px] font-bold">{money(p.sale ? Math.round(p.price * (100 - p.sale) / 100) : p.price)}원</div>
                  {p.sale ? <div className="text-[12px] text-gray-400 line-through">{money(p.price)}원</div> : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center py-8">
          <button onClick={()=>alert("Load more… (hook to API later)")} className="rounded-full border px-5 py-2 text-sm hover:bg-gray-50">
            Load more
          </button>
        </div>
      </main>

      <footer className="border-t py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Handy — Inspired by commerce grid UI.
      </footer>
    </div>
  );
}
