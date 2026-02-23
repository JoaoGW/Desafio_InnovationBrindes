"use client";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

export default function Header() {
  const date = new Date().toDateString();

  return (
    <header className="w-full bg-[#76b900]">
      <div className="mx-auto flex h-22 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center">
          <Image
            src="/logo-innovation.png"
            alt="Innovation Brindes"
            width={100}
            height={50}
            priority
            className="h-auto cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-4 text-white">
          <div className="hidden items-center gap-4 text-sm md:flex">
            <Mail className="cursor-pointer" />
            <Phone className="cursor-pointer" />
          </div>

          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-[#dcdcdc] text-xl font-bold text-[#5f5f5f]">
            <Image
              src="/foto_perfil.jpg"
              width={56}
              height={56}
              alt="Foto de Perfil do Usuário Autenticado"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="hidden text-right leading-tight md:block">
            <p className="text-[20px] font-semibold text-[#f4f4f4]">
              Ana Carol Machado
            </p>
            <p className="text-[12px] text-[#e7ffd0]">{date}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
