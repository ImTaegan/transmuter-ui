// Next, React
import { FC, useEffect, useState } from "react";
import Link from "next/link";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop";
import pkg from "../../../package.json";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import { PlusIcon } from "@heroicons/react/solid";
import useTransmuterStore from "../../stores/useTransmuterStore";
import {TransmuterSDK} from "@gemworks/transmuter-ts";
import { SolanaProvider } from "@saberhq/solana-contrib";
import { PublicKey } from "@solana/web3.js";

//existing transmuters
interface TransmuterCardProps {
	items: any[];
}
export function TransmuterCard({ items }: TransmuterCardProps) {
	return (
		<ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-6 xl:gap-x-8">
			{items.map((item, index) => (
				<li key={index} className="relative">
					<Link href={`/transmuter/${item?.publicKey.toBase58()}`}>
						<div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-200 text-gray-500 hover:opacity-75 focus-within:ring-2  transiton-all duration-150 ease-in focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
							<h2 className="pl-4 pt-4 text-lg font-semibold">Transmuter {index}</h2>
							{/* <img src={file.source} alt="" className="object-cover pointer-events-none group-hover:opacity-75" /> */}
							<button type="button" className="absolute inset-0 focus:outline-none">
								<span className="sr-only">View details for {item.title}</span>
							</button>
						</div>
					</Link>
				</li>
			))}
		</ul>
	);
}

//create new transmuter

export function CreateTransmuterCard() {
	return (
		<Link href={`/transmuter/create`}>
			{/* <div className="text-center group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-indigo-500 text-indigo-50 hover:opacity-75 focus-within:ring-2  transiton-all duration-150 ease-in focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">

            <h2 className="pl-4 pt-4 text-md break-words font-semibold">Create New Transmuter </h2>
      
            <button type="button" className="absolute inset-0 focus:outline-none">
              <span className="sr-only">View details for </span>
            </button>
          </div> */}
			<button
				type="button"
				className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				<PlusIcon className=" mr-3 h-10 w-10" aria-hidden="true" />
				Create New Transmuter
			</button>
		</Link>
	);
}

export const TransmutersView: FC = ({}) => {
	const wallet = useWallet();
	const { connection } = useConnection();

	const transmuterClient = useTransmuterStore((s) => s.transmuterClient);

	const [transmuters, setTransmuters] = useState<any[]>([]);
	const { initTransmuterClient } = useTransmuterStore();

	useEffect(() => {
		if (wallet.publicKey && transmuterClient === null) {
			initTransmuterClient(wallet, connection);
		}
	}, [wallet.publicKey, connection]);

	useEffect(() => {
		if (transmuterClient) {
			getTransmuters(transmuterClient);
		}
	}, [transmuterClient])

	async function getTransmuters(sdk_: TransmuterSDK) {
		const accounts = await sdk_.programs.Transmuter.account.transmuter.all();

		const transmuters = accounts.filter((account) => account.account.owner.toBase58() == wallet.publicKey.toBase58());

		setTransmuters(transmuters);
	}

	// async function initSDK() {
	// 	const provider = SolanaProvider.init({
	// 		connection,
	// 		wallet,
	// 	});

	// 	return TransmuterSDK.load({ provider });
	// };


	async function initTransmuter_() {
		const { transmuterWrapper, tx } = await transmuterClient.initTransmuter(wallet.publicKey);
		await tx.confirm();
	}

	return (
		<div className="py-10">
			<header>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold leading-tight text-gray-900">Transmuters</h1>

					<button
						onClick={() => {
							initTransmuter_();
						}}
						disabled={!wallet.publicKey}
						type="button"
						className="mt-10 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 disabled:opacity-75 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						<PlusIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
						Create Transmuter
					</button>
				</div>
			</header>
			<main>
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					{/* Replace with your content */}
					<div className="px-4 py-8 sm:px-0">
						<TransmuterCard items={transmuters} />
					</div>
				</div>
			</main>
		</div>
	);
};
