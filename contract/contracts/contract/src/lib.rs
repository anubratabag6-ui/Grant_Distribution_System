#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Map
};

#[contract]
pub struct GrantContract;

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Grants,
}

#[contractimpl]
impl GrantContract {

    // Initialize the contract with an admin
    pub fn init(env: Env, admin: Address) {

        // Admin must authorize initialization
        admin.require_auth();

        // Save admin in storage
        env.storage().instance().set(&DataKey::Admin, &admin);

        // Create empty grants map
        let grants: Map<Address, i128> = Map::new(&env);
        env.storage().instance().set(&DataKey::Grants, &grants);
    }

    // Admin assigns grant to a recipient
    pub fn assign_grant(env: Env, recipient: Address, amount: i128) {

        // Get admin from storage
        let admin: Address = env.storage().instance()
            .get(&DataKey::Admin)
            .expect("Admin not set");

        // Verify admin authorization
        admin.require_auth();

        // Get current grants map
        let mut grants: Map<Address, i128> = env.storage().instance()
            .get(&DataKey::Grants)
            .expect("Grants map not initialized");

        // Assign grant
        grants.set(recipient, amount);

        // Save updated map
        env.storage().instance().set(&DataKey::Grants, &grants);
    }

    // Recipient claims their grant
    pub fn claim_grant(env: Env, recipient: Address) -> i128 {

        // Recipient must authorize
        recipient.require_auth();

        // Get grants map
        let mut grants: Map<Address, i128> = env.storage().instance()
            .get(&DataKey::Grants)
            .expect("Grants map not initialized");

        // Check if grant exists
        let amount = match grants.get(recipient.clone()) {
            Some(value) => value,
            None => 0,
        };

        // Remove grant after claiming
        grants.remove(recipient);

        // Save updated map
        env.storage().instance().set(&DataKey::Grants, &grants);

        // Return grant amount
        amount
    }

    // View function to check grant amount
    pub fn get_grant(env: Env, recipient: Address) -> i128 {

        let grants: Map<Address, i128> = env.storage().instance()
            .get(&DataKey::Grants)
            .expect("Grants map not initialized");

        match grants.get(recipient) {
            Some(value) => value,
            None => 0,
        }
    }
}