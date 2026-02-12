import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { SocketProvider } from "@/context/SocketContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "2 en 1 APU - Sistema de Gestión de Obras",
  description: "Sistema profesional para crear presupuestos (APU) y gestionar valuaciones de obra. Controla costos, avances y pagos en un solo lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SocketProvider>
          <ToastProvider>
            <Navbar />
            {children}
          </ToastProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
