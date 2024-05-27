import useSwap from "@/hooks/useSwap";
import useSwapStore from "@/store/useSwapStore";
import { set } from "@project-serum/anchor/dist/cjs/utils/features";
import { Button, View } from "react-native";

export default function jup() {
   const { quote, executeSwap } = useSwap();
   const {
      setInAmount,
      setInputMint,
      setOutputMint

   } = useSwapStore();
   const inputMint = "So11111111111111111111111111111111111111112";
   const outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
   const amount = 100000;
   return <View>
      <Button
         title='Go to Explore'
         onPress={async () => {
            setInputMint(outputMint)
            setOutputMint(inputMint)
            setInAmount(amount)
            await quote()
            await executeSwap()
         }}
      ></Button>
   </View>
}