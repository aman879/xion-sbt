#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::{ContractError, QueryError};
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{Config, Sbt, CONFIG, SBTS, SBT_ID_COUNTER};

//xion10xe9anrxl5a835t0tmaw369yu7y8eq4640fewmvrtc4rtu6vnhqqez949m
// version info for migration info
const CONTRACT_NAME: &str = "crates.io:sbt-contract";
const CONTRACT_VERSION: &str = "0.1.0";


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    let config = Config {
        owner: info.sender,
    };

    CONFIG.save(deps.storage, &config)?;

    SBT_ID_COUNTER.save(deps.storage, &0)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::MintSbt { uri } => mint_sbt(deps, info, uri),
    }
}

pub fn mint_sbt(
    deps: DepsMut,
    info: MessageInfo,
    uri: String,
) -> Result<Response, ContractError> {

    let mut sbt_id = SBT_ID_COUNTER.load(deps.storage)?;
    SBTS.save(deps.storage, sbt_id, &Sbt {
        sbt_id,
        owner: info.sender,
        uri,
    })?;
    sbt_id += 1;
    SBT_ID_COUNTER.save(deps.storage, &sbt_id)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetSbt { id } => to_json_binary(&query_sbt(deps, id)),
        QueryMsg::GetSbtCounter {  } => to_json_binary(&query_sbt_id_counter(deps)?),
        QueryMsg::GetOwner {  } => to_json_binary(&query_contract_owner(deps)?),
    }
}

pub fn query_sbt(deps: Deps, id: u64) -> Result<Sbt, QueryError> {
    SBTS.load(deps.storage, id).map_err(|_| QueryError::InvalidTokenId {  })
}

pub fn query_sbt_id_counter(deps: Deps) -> StdResult<u64> {
    SBT_ID_COUNTER.load(deps.storage)
}

pub fn query_contract_owner(deps: Deps) -> StdResult<Config> {
    CONFIG.load(deps.storage)
}

