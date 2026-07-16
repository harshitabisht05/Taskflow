function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
      <div>
        <p className="text-sm text-slate-500">
          Project Management
        </p>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        U
      </div>
    </header>
  );
}

export default Header;