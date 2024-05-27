import { ScannedData } from "./blowfish";
import { create } from "zustand";

interface ISwapStore {
    inputMint: string;
    outputMint: string;
    inAmount: number;
    outAmount: number;
    quoteResponse: string;
    txHash: string;
    error: boolean;
    scannedData: ScannedData | null;
    gasFees: number;
    quote: () => void; 
    setInputMint: (inputMint: string) => void;
    setOutputMint: (outputMint: string) => void;
    setInAmount: (inAmount: number) => void;
    setOutAmount: (outAmount: number) => void;
    setError: (error: boolean) => void;
    setScannedData: (scannedData: ScannedData) => void;
    setGasFees: (gasFees: number) => void;
    setQuoteResponse: (quoteResponse: string) => void;
    setTxHash: (txHash: string) => void;
}

const useSwapStore = create<ISwapStore>((set) => ({
    inputMint: "",
    outputMint: "",
    inAmount: 0,
    outAmount: 0,
    quoteResponse: "",
    txHash: "",
    error: false,
    scannedData: null,
    gasFees: 0,
    quote: () => {},
    setInputMint: (inputMint: string) => set({ inputMint }),
    setOutputMint: (outputMint: string) => set({ outputMint }),
    setInAmount: (inAmount: number) => set({ inAmount }),
    setOutAmount: (outAmount: number) => set({ outAmount }),
    setError: (error: boolean) => set({ error }),
    setScannedData: (scannedData: ScannedData) => set({ scannedData }),
    setGasFees: (gasFees: number) => set({ gasFees }),
    setQuoteResponse: (quoteResponse: string) => set({ quoteResponse }),
    setTxHash: (txHash: string) => set({ txHash }),
}));

export default useSwapStore;