"use client";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { postLogin } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro("");
    setIsLoading(true);

    try {
      const resposta = await postLogin({ email: usuario, senha });

      if (resposta.status === 1) {
        setAuth(resposta.token_de_acesso, resposta.dados_usuario);
        router.push("/produtos");
      } else {
        setErro(resposta.message || "Usuário ou senha inválidos.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#ececec]">
      <Image
        src="/pexels-olly-3966786.jpg"
        className="absolute inset-0 object-cover"
        fill
        alt="Imagem de Fundo da tela de login"
      />
      <div className="absolute inset-0 " />

      <section className="flex flex-col relative z-10 mx-auto min-h-screen w-full max-w-245 items-center justify-center px-4 py-8">
        <div className="w-full">
          <h1 className="text-center text-2xl font-semibold text-[#75b900] sm:text-[42px]">
            Bem-vindo a Innovation Brindes
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-md bg-[#79be00] mx-auto max-w-160 px-6 py-10 shadow-[0_18px_35px_rgba(0,0,0,0.16)] sm:px-12 sm:py-12"
          >
            <div className="mx-auto w-full max-w-105 space-y-4">
              <label className="relative block">
                <span className="sr-only text-xs">Usuário</span>
                <span className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-[#616161]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={usuario}
                  onChange={(event) => setUsuario(event.target.value)}
                  placeholder="Usuário"
                  className="h-11 w-full rounded-full bg-[#ededed] pl-14 pr-5 text-sm text-[#555] outline-none placeholder:text-sm placeholder:text-[#666] focus:ring-2 focus:ring-white/60"
                  autoComplete="username"
                />
              </label>

              <label className="relative block">
                <span className="sr-only">Senha</span>
                <span className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-[#616161]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17 8h-1V6a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4Zm3 8.72V17a1 1 0 1 1-2 0v-2.28a2 2 0 1 1 2 0Z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="Senha"
                  className="h-11 w-full rounded-full bg-[#ededed] pl-14 pr-5 text-sm text-[#555] outline-none placeholder:text-sm placeholder:text-[#666] focus:ring-2 focus:ring-white/60"
                  autoComplete="current-password"
                />
              </label>

              <div className="flex items-center justify-between px-2 pt-1 text-xs text-white/95 sm:text-sm">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-3 w-3 rounded-sm border-white accent-white"
                  />
                  <span className="text-white">Manter logado</span>
                </label>
                <button type="button" className="text-white hover:underline">
                  Esqueceu a senha?
                </button>
              </div>

              {erro && (
                <p className="rounded-md bg-red-500/20 px-4 py-2 text-center text-sm text-white">
                  {erro}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mx-auto mt-6 block h-13 w-42.5 rounded-full bg-[#efefef] text-base font-bold text-[#4d4d4d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Entrando..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
