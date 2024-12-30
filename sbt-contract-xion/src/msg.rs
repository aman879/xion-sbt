use cosmwasm_schema::{cw_serde, QueryResponses};
use crate::state::{Config, Sbt};

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    MintSbt {uri: String},
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {

    #[returns(Sbt)]
    GetSbt {id: u64},

    #[returns(u64)]
    GetSbtCounter {},

    #[returns(Config)]
    GetOwner {},
}
