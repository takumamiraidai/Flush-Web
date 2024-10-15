import { Inter, Lusitana, Noto_Serif_JP,Train_One} from 'next/font/google';
import "./global.css";
 
export const inter = Inter({ subsets: ['latin'] });
 
export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const notojp = Noto_Serif_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const train = Train_One({
  weight: ["400", "400"],
  subsets: ["latin"],
  display: "swap",
});