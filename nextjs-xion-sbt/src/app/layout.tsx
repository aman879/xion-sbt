"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import "@burnt-labs/abstraxion/dist/index.css";
// import address from "./contract/info.json"

const inter = Inter({ subsets: ["latin"] });

// Example XION seat contract
// const seatContractAddress = address.address;

// const legacyConfig = {
//   contracts: [
//     seatContractAddress,
//   ]
// };

const treasuryConfig = {
  treasury: "xion130p0mzev8cys7flwwcam3ktu4pjel7ymak5w788eelqx8kqh5apsfqdk4e",
  rpcUrl: "https://rpc.xion-testnet-1.burnt.com:443",

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AbstraxionProvider
          config={treasuryConfig}
        >
          {children}
        </AbstraxionProvider>
      </body>
    </html>
  );
}