import useSwapStore from "@/store/useSwapStore";
import "react-native-get-random-values";
import {
    Connection,
    Keypair,
    VersionedTransaction,
} from "@solana/web3.js";
import base58 from "bs58";
import { Buffer } from "buffer";
import { scanTransaction } from "./useBlowfish";

export default function useSwap() {
    const connection = new Connection("https://api.mainnet-beta.solana.com");

    const {
        inputMint,
        outputMint,
        inAmount,
        quoteResponse,
        setQuoteResponse,
        setTxHash,
        setError,
        setScannedData
    } = useSwapStore();

    const userPayer = Keypair.fromSecretKey(
        base58.decode('')
    );

    async function quote() {
        try {
            const quoteResponse = await (
                await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${inAmount}&slippageBps=50`
                )
            ).json();

            const { swapTransaction } = await (
                await fetch('https://quote-api.jup.ag/v6/swap', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        quoteResponse,
                        userPublicKey: userPayer.publicKey.toBase58(),
                        wrapAndUnwrapSol: true,
                    })
                })
            ).json();

            setQuoteResponse(swapTransaction);

            const scaned = await scanTransaction(swapTransaction, userPayer.publicKey.toBase58());

            setScannedData(scaned);

            const instructions = await (
                await fetch('https://quote-api.jup.ag/v6/swap-instructions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        quoteResponse,
                        userPublicKey: userPayer.publicKey.toBase58(),
                    })
                })
            ).json();

            // const simulate =
            //     (await getSimulationUnits(connection, instructions, userPayer.publicKey, [])) ?? 0;
            // const gasFees = simulate / 1000000000;
            // console.log(gasFees);

        } catch (error) {
            console.error(error)
        }
    }

    async function executeSwap() {
        try {
            const swapTransactionBuf = Buffer.from(quoteResponse, 'base64');
            var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
            transaction.sign([userPayer]);
            const rawTransaction = transaction.serialize()

            const txid = await connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
                maxRetries: 2
            });
            setTxHash(txid);
            await connection.confirmTransaction(txid);
            console.log(`https://solscan.io/tx/${txid}`);
        } catch (error) {
            setError(true);
            console.error(error)
        }
    }

    return { quote, executeSwap }
}