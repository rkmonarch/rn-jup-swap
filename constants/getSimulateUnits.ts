import { AddressLookupTableAccount, ComputeBudgetProgram, Connection, PublicKey, Signer, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

export async function getSimulationUnits(
    connection: Connection,
    instructions: TransactionInstruction[],
    payer: PublicKey,
    lookupTables: AddressLookupTableAccount[]
  ): Promise<number | undefined> {
    const testInstructions = [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 }),
      ...instructions,
    ];
  
    const testVersionedTxn = new VersionedTransaction(
      new TransactionMessage({
        instructions: testInstructions,
        payerKey: payer,
        recentBlockhash: PublicKey.default.toString(),
      }).compileToV0Message(lookupTables)
    );
  
    const simulation = await connection.simulateTransaction(testVersionedTxn, {
      replaceRecentBlockhash: true,
      sigVerify: false,
    });
    if (simulation.value.err) {
      return undefined;
    }
    return simulation.value.unitsConsumed;
  }
  
  async function buildOptimalTransaction(
    connection: Connection,
    instructions: TransactionInstruction[],
    signer: Signer,
    lookupTables: AddressLookupTableAccount[]
  ) {
    const [microLamports, units, recentBlockhash] = await Promise.all([
      getPriorityFees(instructions),
      getSimulationUnits(connection, instructions, signer.publicKey, lookupTables),
      connection.getLatestBlockhash(),
    ]);
  
    instructions.unshift(ComputeBudgetProgram.setComputeUnitPrice({ microLamports }));
    if (units) {
      instructions.unshift(ComputeBudgetProgram.setComputeUnitLimit({ units }));
    }
    return {
      transaction: new VersionedTransaction(
        new TransactionMessage({
          instructions,
          recentBlockhash: recentBlockhash.blockhash,
          payerKey: signer.publicKey,
        }).compileToV0Message(lookupTables)
      ),
      recentBlockhash,
    };
  }
  
  async function getPriorityFees(instructions: TransactionInstruction[]): Promise<number> {
    return 426;
  }