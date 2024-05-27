
export async function scanTransaction(tx: string, address: string) {

    const response = await fetch(
        'https://api.blowfish.xyz/solana/v0/mainnet/scan/transactions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': "",
                'X-Api-Version': '2023-06-05'
            },
            body: JSON.stringify(
                {
                    "transactions": [tx],
                    "metadata": {
                        "origin": "https://jup.ag/"
                    },
                    "simulatorConfig": {
                        "guarantee": {
                            "enabled": true
                        }
                    }

                }),

        }
    );
    const data = await response.json()
    const transactions = data.aggregated.expectedStateChanges[address] || [];

    return transactions.map((transaction: TransactionData) => ({
        humanReadableDiff: transaction.humanReadableDiff,
        suggestedColor: transaction.suggestedColor,
        rawInfo: transaction.rawInfo,
    }));
}

interface TransactionData {
    humanReadableDiff: string;
    suggestedColor: string;
    rawInfo: {
        kind: string;
        data: {
            asset: {
                symbol: string;
                name: string;
                decimals: number;
                price: {
                    source: string;
                    updatedAt: number;
                    dollarValuePerToken: number;
                };
                imageUrl: string;
            };
            diff: {
                sign: string;
                digits: number;
            };
            counterparty: string;
        };
    };
}
