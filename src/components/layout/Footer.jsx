function Footer({ year = new Date().getFullYear() }) {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-5 py-5 text-sm text-secondary sm:px-8 md:flex-row lg:px-0">
        <p className="text-center md:text-left">
          © {year} Politeknik Negeri Sriwijaya
        </p>
        <nav aria-label="Tautan bantuan" className="flex items-center gap-6">
          <span aria-disabled="true" title="Panduan penggunaan belum tersedia" className="cursor-not-allowed text-secondary/70">
            Panduan penggunaan
          </span>
          <span aria-disabled="true" title="Pusat bantuan belum tersedia" className="cursor-not-allowed text-secondary/70">
            Pusat bantuan
          </span>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
