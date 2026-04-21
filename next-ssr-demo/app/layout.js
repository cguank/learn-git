import "./globals.css";

export const metadata = {
  title: "Next.js SSR Demo",
  description: "A simple SSR demo for Next.js beginners."
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
