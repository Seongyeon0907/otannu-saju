import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오탠누 사주 | 나, 혹시 게이일까?",
  description: "사주팔자로 알아보는 나의 게이 확률. 생년월일시만 입력하면 끝!",
  openGraph: {
    title: "오탠누 사주 | 나, 혹시 게이일까?",
    description: "사주팔자로 알아보는 나의 게이 확률",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <div className="mobile-frame">
          {children}
        </div>
      </body>
    </html>
  );
}
