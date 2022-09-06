import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider as ReactUIWalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
	SolletExtensionWalletAdapter,
	SolletWalletAdapter,
	TorusWalletAdapter,
	// LedgerWalletAdapter,
	// SlopeWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { notify } from "../utils/notifications";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { autoConnect } = useAutoConnect();

	// TODO: WALLET ADAPTER IN GENERAL NEEDS WORK, CONNECTING DIFFERENT WALLETS, NETWORK, REFRESH, EVENTS

	{
		/* TODO: UPDATE CLUSTER PER NETWORK SETTINGS, ADD LOCALHOST + CUSTOMNET | ADAPTER REWORK */
	}
	const network = WalletAdapterNetwork.Mainnet;
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);
	const mainnetGenesysgo = "https://thrumming-red-night.solana-mainnet.quiknode.pro/d4ee81565674a64f2997aa61833d96730bf578e8/";
	//@TODO add genesysgo rpc endpoint for mainnet https://ssc-dao.genesysgo.net/

	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter(),
			new SolletWalletAdapter({ network }),
			// new SolletExtensionWalletAdapter({ network }),
			// new TorusWalletAdapter(),
			// new LedgerWalletAdapter(),
			// new SlopeWalletAdapter(),
		],
		[network]
	);

	const onError = useCallback((error: WalletError) => {
		notify({ type: "error", message: error.message ? `${error.name}: ${error.message}` : error.name });
	}, []);

	return (
		// TODO: updates needed for updating and referencing endpoint: wallet adapter rework
		<ConnectionProvider endpoint={process.env.NEXT_PUBLIC_CLUSTER === "MAINNET" ? mainnetGenesysgo : endpoint   }>
			<WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect}>
				<ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<AutoConnectProvider>
			<WalletContextProvider>{children}</WalletContextProvider>
		</AutoConnectProvider>
	);
};
