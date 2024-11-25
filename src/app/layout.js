import localFont from "next/font/local";
import { Poppins } from 'next/font/google';

import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'], // Specify the weights you want to use
  subsets: ['latin'],
  display: 'swap', // Ensures text is visible while the font loads
  variable: '--font-poppins', // Define a CSS variable for Poppins
});


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "melodyVe",
  description: "Created by JF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
