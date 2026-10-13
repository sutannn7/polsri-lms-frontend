function WelcomeBanner({ name, semesterLabel = 'SEMESTER GANJIL 2026/2027' }) {
  return (
    <section className="overflow-hidden rounded-card bg-gradient-to-r from-primary to-primary-dark px-6 py-7 text-white shadow-card sm:px-8 sm:py-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/85">{semesterLabel}</p>
      <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
        Selamat Datang kembali, {name}!
      </h1>
      <p className="mt-3 text-sm text-white/85 sm:text-base">
        Langkah kecil hari ini, bekal besar untuk masa depan. Yuk, lanjutkan belajar!
      </p>
    </section>
  );
}

export default WelcomeBanner;