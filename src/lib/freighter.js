import { isConnected, requestAccess, getAddress, signTransaction } from "@stellar/freighter-api";
import * as StellarSdk from "stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
const networkPassphrase = StellarSdk.Networks.TESTNET;

/**
 * Check if Freighter is installed and connected.
 * Handles both old (boolean) and new ({ isConnected }) API return shapes.
 */
export const checkConnection = async () => {
  try {
    const result = await isConnected();
    if (typeof result === 'boolean') return result;
    return result?.isConnected ?? false;
  } catch {
    return false;
  }
};

/**
 * Request wallet access and return the user's public key.
 */
export const retrievePublicKey = async () => {
  const accessObj = await requestAccess();
  if (typeof accessObj === 'string') return accessObj;
  if (accessObj?.error) throw new Error(accessObj.error.message || "Access denied");
  return accessObj.address;
};

/**
 * Get the XLM balance of the connected wallet.
 */
export const getBalance = async () => {
  const addressObj = await getAddress();
  if (addressObj?.error) throw new Error(addressObj.error.message);
  const address = typeof addressObj === 'string' ? addressObj : addressObj.address;
  const account = await server.loadAccount(address);
  const xlmBalance = account.balances.find((b) => b.asset_type === "native");
  return xlmBalance ? xlmBalance.balance : "0";
};

/**
 * Send XLM from the connected wallet to a destination address.
 * Uses a simple, valid payment transaction (no self-sponsorship).
 */
export const sendXLM = async (destination, amount) => {
  const addressObj = await getAddress();
  if (addressObj?.error) throw new Error(addressObj.error.message);
  const sourcePublicKey = typeof addressObj === 'string' ? addressObj : addressObj.address;

  const sourceAccount = await server.loadAccount(sourcePublicKey);

  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE, // 100 stroops minimum fee for 1 operation
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destination,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString(),
      })
    )
    .setTimeout(180) // 3 minutes for the user to sign
    .build();

  const signedResult = await signTransaction(transaction.toXDR(), { networkPassphrase });
  if (signedResult?.error) throw new Error(signedResult.error.message || "Signing failed");

  const signedTxXdr = typeof signedResult === 'string' ? signedResult : signedResult.signedTxXdr;
  const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, networkPassphrase);

  try {
    const res = await server.submitTransaction(signedTransaction);
    return res;
  } catch (error) {
    const errData = error.response?.data;
    console.error("Stellar Submission Error:", errData ? JSON.stringify(errData, null, 2) : error);
    if (errData?.extras?.result_codes) {
      const codes = errData.extras.result_codes;
      const opCodes = codes.operations ? ` (${codes.operations.join(', ')})` : '';
      throw new Error(`Transaction Failed: ${codes.transaction}${opCodes}`);
    }
    throw error;
  }
};
