import type { Metadata } from 'next';
import { Inter, Noto_Sans_Bengali, Hind_Siliguri } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';
import InitialLoadingScreen from '@/components/InitialLoadingScreen';
import AiAssistantChat from '@/components/AiAssistantChat';

const shurjo = localFont({
  src: [
    {
      path: '../../public/fonts/ShurjoWeb_400_v5_1.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ShurjoWeb_700_v5_1.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-shurjo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['bengali'],
  variable: '--font-noto-sans-bengali',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CD Doctors | Hospitals & Doctors in Chuadanga',
  description: 'Discover top private hospitals, clinics, diagnostic centers, and specialist doctors across Chuadanga, Bangladesh. Book doctor appointments online.',
  keywords: ['CD Doctors', 'Chuadanga Hospitals', 'Chuadanga Doctor Appointment', 'Popular Diagnostic Chuadanga', 'Chuadanga Sadar Hospital'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${shurjo.variable} ${inter.variable} ${notoSansBengali.variable} ${hindSiliguri.variable}`}>
      <body className={`${shurjo.className} min-h-screen flex flex-col bg-white text-slate-900 antialiased font-bengali overflow-x-hidden`}>
        <InitialLoadingScreen />
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0 relative z-10 bg-white">{children}</main>
        <Footer />
        <MobileBottomNav />
        <AiAssistantChat />
      </body>
    </html>
  );
}
