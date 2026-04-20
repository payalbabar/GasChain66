#![cfg(test)]
use super::{GasChainContract, GasChainContractClient};
use soroban_sdk::{symbol_short, Env};

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, GasChainContract);
    let client = GasChainContractClient::new(&env, &contract_id);

    let words = client.hello(&symbol_short!("Dev"));
    assert_eq!(words, symbol_short!("Hello"));
}
