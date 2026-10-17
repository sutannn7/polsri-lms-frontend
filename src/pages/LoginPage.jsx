 import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleHelp, LockKeyhole, UserRound } from "lucide-react";
import Accordion from "../components/ui/Accordion";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
 import useAuth from "../hooks/useAuth";

 function LoginPage() {
   const { login } = useAuth();
   const navigate = useNavigate();
   const errorSummaryRef = useRef(null);
   const errorSummaryId = useId();
   const [id, setId] = useState("");
   const [password, setPassword] = useState("");
   const [errors, setErrors] = useState({});
   const [formError, setFormError] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
     if (Object.keys(errors).length > 0) errorSummaryRef.current?.focus();
   }, [errors]);

   async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!id.trim()) nextErrors.id = "NIP / NPM / NIK wajib diisi.";
    if (!password) nextErrors.password = "Kata sandi wajib diisi.";
    else if (password.length < 6)
      nextErrors.password = "Kata sandi minimal 6 karakter.";

    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    try {
      await login(id, password);
      navigate("/beranda", { replace: true });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Login gagal. Silakan coba kembali.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <header className="mb-8 text-left">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-main sm:text-4xl">
          Masuk ke LearnEase LMS
        </h1>
        <p className="mt-3 max-w-[38ch] text-base leading-7 text-secondary">
          Masuk dengan NIP, NPM, atau NIK dan kata sandi akun akademik Anda.
        </p>
      </header>

      <form noValidate onSubmit={handleSubmit} className="space-y-5" aria-busy={isLoading}>
        {Object.keys(errors).length > 0 ? (
          <div
            ref={errorSummaryRef}
            id={errorSummaryId}
            tabIndex={-1}
            role="alert"
            aria-label="Periksa isian formulir"
            className="rounded-card border border-danger/30 bg-danger-badge p-4 text-sm text-danger-text outline-none focus-visible:ring-2 focus-visible:ring-danger"
          >
            <p className="font-semibold">Periksa kembali isian berikut:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {errors.id ? <li><a className="underline underline-offset-2" href="#login-id">NIP / NPM / NIK</a></li> : null}
              {errors.password ? <li><a className="underline underline-offset-2" href="#login-password">Kata Sandi</a></li> : null}
            </ul>
          </div>
        ) : null}
        <Input
          id="login-id"
          label="NIP / NPM / NIK"
          placeholder="NIP / NPM / NIK"
          autoComplete="username"
          leftIcon={<UserRound size={18} />}
          className="text-base"
          containerClassName="[&>label]:text-base [&>p[role=alert]]:text-sm"
          value={id}
          onChange={(event) => setId(event.target.value)}
          error={errors.id}
          required
          disabled={isLoading}
        />
        <Input
          id="login-password"
          label="Kata Sandi"
          placeholder="Masukkan kata sandi"
          autoComplete="current-password"
          leftIcon={<LockKeyhole size={18} />}
          type="password"
          className="text-base"
          containerClassName="[&>label]:text-base [&>p[role=alert]]:text-sm"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          required
          disabled={isLoading}
        />

        <div className="flex justify-end">
          <button
            type="button"
            disabled
            title="Pemulihan kata sandi belum tersedia"
            className="min-h-11 cursor-not-allowed rounded-sm text-sm font-semibold text-secondary/70 disabled:opacity-100"
          >
            Lupa kata sandi?
          </button>
        </div>

        {formError ? (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="md"
          rightArrow
          disabled={isLoading}
          className="min-h-12 w-full text-base"
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      <div className="mt-6">
        <Accordion
          title={
            <span className="inline-flex items-center gap-2">
              <CircleHelp
                size={18}
                aria-hidden="true"
                className="text-primary"
              />
              Butuh Bantuan Login?
            </span>
          }
          className="shadow-none"
        >
          <p>
            Pastikan NIP, NPM, atau NIK dan kata sandi telah diisi. Untuk
            bantuan akses, hubungi pengelola LMS Politeknik Negeri Sriwijaya.
          </p>
        </Accordion>
      </div>

      <p className="mt-8 text-center text-xs text-secondary">
        © {new Date().getFullYear()} Politeknik Negeri Sriwijaya
      </p>
    </div>
  );
}

export default LoginPage;
