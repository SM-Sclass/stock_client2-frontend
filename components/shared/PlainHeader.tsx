import Link from "next/link";

function PlainHeader() {
  return (
    <header className="fixed top-0 z-40 w-full bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        <Link
          href="/"
          className='flex items-center gap-3 group'
        >
          <h1 className="font-black text-white text-2xl tracking-tighter">
            STOCK<span className="text-primary italic">TRACKER</span>
          </h1>
        </Link>
      </div>
    </header>
  );
}

export default PlainHeader;
