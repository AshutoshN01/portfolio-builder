import { LenisProvider } from '@components/LenisProvider';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';

export function RootLayout({ children }) {
  return (
    <LenisProvider>
      <div className="flex flex-col min-h-screen bg-background text-white selection:bg-accent-muted selection:text-white">
        {/* Navigation Layer */}
        <Navbar />

        {/* Dynamic Route Content */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Footer Layer */}
        <Footer />
      </div>
    </LenisProvider>
  );
}
