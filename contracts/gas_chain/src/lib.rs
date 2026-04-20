#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short};

#[contract]
pub struct GasChainContract;

#[contractimpl]
impl GasChainContract {
    pub fn hello(env: Env, to: Symbol) -> Symbol {
        symbol_short!("Hello")
    }

    pub fn book_cylinder(env: Env, user: Symbol) -> bool {
        // Simple booking logic simulation
        true
    }
}

mod test;
