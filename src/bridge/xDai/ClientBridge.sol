// SPDX-License-Identifier: BSD-3-CLAUSE
pragma solidity 0.6.9;
pragma experimental ABIEncoderV2;

import { BaseBridge } from "../BaseBridge.sol";
import { BaseRelayRecipient } from "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import { ContextUpgradeSafe } from "@openzeppelin/contracts-ethereum-package/contracts/GSN/Context.sol";

// note BaseRelayRecipient must come after OwnerPausableUpgradeSafe (in BaseBridge) so its _msgSender() takes precedence
// (yes, the ordering is reversed comparing to Python)
contract ClientBridge is BaseBridge, BaseRelayRecipient {
    //**********************************************************//
    //   The order of below state variables can not be changed  //
    //**********************************************************//

    //prettier-ignore
    string public override versionRecipient;

    //**********************************************************//
    //  The order of above state variables can not be changed   //
    //**********************************************************//

    //
    // PUBLIC
    //
    function initialize(
        address _ambBridge,
        address _multiTokenMediator,
        address _trustedForwarder
    ) public initializer {
        __BaseBridge_init(_ambBridge, _multiTokenMediator);

        trustedForwarder = _trustedForwarder;
        versionRecipient = "1.0.0"; // we are not using it atm
    }

    //
    // INTERNAL VIEW FUNCTIONS
    //
    // prettier-ignore
    function _msgSender() internal override(BaseRelayRecipient, ContextUpgradeSafe) view returns (address payable) {
        return super._msgSender();
    }
}