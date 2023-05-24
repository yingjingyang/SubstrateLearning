use super::*;
use crate::{mock::*, Error};
use frame_support::{assert_noop, assert_ok,BoundedVec};
use frame_system::Config;

#[test]
fn create_claim_works() {
	new_test_ext().execute_with(|| {
		let claim = vec![0,1];
        let claimBound = BoundedVec::try_from(claim.clone()).unwrap();

        assert_ok!(PoeModule::create_claim(RuntimeOrigin::signed(1),claim.clone()));

        assert_eq!(
            Proofs::<Test>::get(&claimBound),
            Some((1,frame_system::Pallet::<Test>::block_number()))
        )
	});
}

#[test]
fn create_claim_failed_when_claim_already_exist() {
	new_test_ext().execute_with(|| {
		let claim = vec![0,1];
        let _= PoeModule::create_claim(RuntimeOrigin::signed(1),claim.clone());

        assert_noop!(
            PoeModule::create_claim(RuntimeOrigin::signed(1),claim.clone()),
            Error::<Test>::ProofAlreadyExist
        );
	});
}

#[test]
fn revoke_claim_works() {
	new_test_ext().execute_with(|| {
		let claim = vec![0,1];
        let _= PoeModule::create_claim(RuntimeOrigin::signed(1),claim.clone());

        assert_ok!(PoeModule::remove_claim(RuntimeOrigin::signed(1),claim.clone()));

	});
}

#[test]
fn revoke_claim_notworks_when_claim_not_exist() {
	new_test_ext().execute_with(|| {
		let claim = vec![0,1];

        assert_noop!(PoeModule::remove_claim(RuntimeOrigin::signed(1),claim.clone()),
        Error::<Test>::ClaimNotExist
        );

	});
}

#[test]
fn transfer_claim_works() {
	new_test_ext().execute_with(|| {
		let claim = vec![0,1];
        let newClaimer = 2u64;
        let _= PoeModule::create_claim(RuntimeOrigin::signed(1),claim.clone());

        assert_ok!(PoeModule::transfer_claim(RuntimeOrigin::signed(1),claim.clone(),newClaimer));

	});
}


#[test]
fn transfer_claim_not_works() {
	new_test_ext().execute_with(|| {
		let claim = vec![0,1];
        let newClaimer = 2u64;

        assert_noop!(PoeModule::transfer_claim(RuntimeOrigin::signed(1),claim.clone(),newClaimer),
        Error::<Test>::ClaimNotExist
        );

	});
}