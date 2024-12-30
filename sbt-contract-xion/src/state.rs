use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

pub const CONFIG: Item<Config> = Item::new("config");
pub const SBT_ID_COUNTER: Item<u64> = Item::new("sbt_id_counter");
pub const SBTS: Map<u64, Sbt> = Map::new("sbts");

#[derive(Deserialize, Serialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Config {
    pub owner: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Sbt {
    pub sbt_id: u64,
    pub owner: Addr,
    pub uri: String,
}
