 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleHelp, LockKeyhole, UserRound } from "lucide-react";
import Accordion from "../components/ui/Accordion";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PolsriLogo from "../components/ui/PolsriLogo";
import useAuth from "../hooks/useAuth";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      <header className="mb-7 flex flex-col items-center text-center">
        <PolsriLogo size={64} className="mb-3 hidden md:block" />
        <h1 className="text-2xl font-bold text-main sm:text-3xl">
          Masuk ke LearnEase LMS
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-secondary">
          Masuk dengan NIP, NPM, atau NIK dan kata sandi akun akademik Anda.
        </p>
      </header>

      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="login-id"
          label="NIP / NPM / NIK"
          placeholder="Masukkan NIP / NPM / NIK"
          autoComplete="username"
          leftIcon={<UserRound size={18} />}
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
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          required
          disabled={isLoading}
        />

        <div className="flex justify-end">
          <button
            type="button"
            aria-disabled="true"
            title="Pemulihan kata sandi belum tersedia"
            className="cursor-not-allowed rounded-sm text-sm font-semibold text-secondary/70"
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
          className="w-full"
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
          className="shadow-card"
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
