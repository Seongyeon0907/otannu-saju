import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "이쪽 사주 - 사주광인 이쪽이 만든 사주",
  description: "사주광인 이쪽 개발자가 만든 사주. 생년월일시만 입력하면 끝!",
  openGraph: {
    title: "이쪽 사주 - 사주광인 이쪽이 만든 사주",
    description: "사주광인 이쪽 개발자가 만든 사주",
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
