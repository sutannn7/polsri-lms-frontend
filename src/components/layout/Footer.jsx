function Footer({
  guideHref = '#panduan-penggunaan',
  helpHref = '#pusat-bantuan',
  year = new Date().getFullYear(),
}) {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-5 py-5 text-sm text-secondary sm:px-8 md:flex-row lg:px-0">
        <p className="text-center md:text-left">
          © {year} Politeknik Negeri Sriwijaya
        </p>
        <nav aria-label="Tautan bantuan" className="flex items-center gap-6">
          <a href={guideHref} className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Panduan penggunaan
          </a>
          <a href={helpHref} className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Pusat bantuan
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
