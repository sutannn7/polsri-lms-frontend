const questions = [
  {
    question: 'Siapa yang dapat masuk?',
    answer: 'Gunakan NIP, NPM, atau NIK beserta kata sandi akun akademik.',
  },
  {
    question: 'Apakah data yang ditampilkan data asli?',
    answer: 'Belum. Informasi pada halaman ini belum terhubung ke sistem kampus.',
  },
  {
    question: 'Bisa dibuka di ponsel?',
    answer: 'Bisa. Tata letak landing page menyesuaikan ponsel, tablet, dan desktop.',
  },
  {
    question: 'Ada mode gelap?',
    answer: 'Ada. Tema mengikuti pengaturan perangkat dan dapat diganti dari tombol di bilah atas.',
  },
];

function Questions() {
  return (
    <section className="redesign-section redesign-faq-section" id="faq" aria-labelledby="redesign-faq-title">
      <div className="redesign-container redesign-faq-layout">
        <header className="redesign-faq-intro" data-reveal>
          <h2 id="redesign-faq-title">Pertanyaan yang sering muncul.</h2>
          <p>Jawaban tentang akun dan penggunaan LearnEase.</p>
        </header>
        <div className="redesign-faq-list">
          {questions.map(({ question, answer }, index) => (
            <details
              className="redesign-faq-item"
              data-reveal
              style={{ '--reveal-delay': `${index * 60}ms` }}
              key={question}
            >
              <summary>{question}</summary>
              <div className="redesign-faq-answer"><p>{answer}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Questions;
