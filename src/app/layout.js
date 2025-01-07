import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SessionProvider } from './components/SessionProvider';
import './globals.css';
import { getServerSession } from 'next-auth';
import { GoogleAnalytics } from '@next/third-parties/google'

const poppins = Poppins({
	weight: ['300', '400', '500', '600', '700'], // Specify the weights you want to use
	subsets: ['latin'],
	display: 'swap', // Ensures text is visible while the font loads
	variable: '--font-poppins', // Define a CSS variable for Poppins
});

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata = {
	title: 'melodyVe',
	description: 'Created by JF',
};

export default async function RootLayout({ children }) {
	const session = await getServerSession();
	return (
		<html lang='en'>
			<body className={poppins.className}>
<SessionProvider session={session}>
					<Navbar />
	
					{children}
					<Footer />
				</SessionProvider>
				<GoogleAnalytics gaId={`process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`} />
			</body>
		</html>
	);
}
