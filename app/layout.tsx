import "./globals.css";
import { QueryProvider } from "@/providers/queryProvider";

export const metadata = {
  title: "Innova Brindes - Dinâmica",
  description: "Dinâmica da listagem de produtos com sistema de login",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
