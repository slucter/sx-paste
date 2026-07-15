import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat paste baru",
  description: "Tempel teks, lalu simpan untuk mendapatkan link singkat yang bisa dibagikan.",
  alternates: { canonical: "/new" },
};

export default function NewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
