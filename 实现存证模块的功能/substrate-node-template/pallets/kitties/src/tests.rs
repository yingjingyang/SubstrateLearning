use super::*;
use crate::{mock::*, Error};
use frame_support::{assert_noop, assert_ok,BoundedVec};
use frame_system::Config;

#[test]
fn it_works_for_create(){
    let kitty_id = 0;
    let account_id = 1;

    assert_eq!(KittyModule::next_kitty_id(),kitty_id);
    assert_eq!(KittyModule::create(Origin::signed(account_id)));

    assert_eq!(KittyModule::next_kitty_id(),kitty_id + 1);
    assert_eq!(KittyModule::kitties(kitty_id).is_some(),true);
    assert_eq!(KittyModule::kitty_owner(kitty_id), Some(account_id));
    assert_eq!(KittyModule::kitty_parents(kitty_id), None);

    crate::NextKittyId::<Test>::set(crate::KittyId::max_value());
    assert_noop!(
        KittiesModule::create(Origin::signed(account_id)),
        Error::<Test>::InvalidKittyId
    );
}

#[test]
fn it_works_for_breed(){
    let kitty_id = 0;
    let account_id = 1;

    assert_noop!(
        KittiesModule::breed(Origin::signed(account_id),kitty_id,kitty_id),
        Error::<Test>::SameKittyId
    );

    assert_noop!(
        KittiesModule::breed(Origin::signed(account_id),kitty_id,kitty_id + 1),
        Error::<Test>::InvalidKittyId
    );

    assert_ok!(KittiesModule::create(Origin::signed(account_id)));
    assert_ok!(KittiesModule::create(Origin::signed(account_id)));

    assert_eq!(KittiesModule::next_kitty_id(),kitty_id + 2);
    assert_ok!(
        Origin::signed(account_id),
        kitty_id,
        kitty_id + 1
    )

    let breed_kitty_id = 2;
    assert_eq!(KittiesModule::next_kitty_id(),breed_kitty_id + 1);
    assert_eq!(KittiesModule::kitties(breed_kitty_id).is_some(),true);
    assert_eq!(KittiesModule::kitty_owner(breed_kitty_id),Some(account_id));

    assert_eq!(
        KittiesModule::kitty_parents(breed_kitty_id),
        Some((kitty_id,kitty_id + 1))
    )


}

#[test]
fn it_works_for_transfer(){
    let kitty_id = 0;
    let account_id = 1;
    let recipient = 2;

    assert_ok!(KittiesModule::create(Origin::signed(account_id)));
    assert_ok!(KittiesModule::kitty_owner(kitty_id),Some(account_id));

    assert_noop!(
        KittiesModule::transfer(
            Origin::signed(recipient),
            account_id,
            kitty_id
        ), Error::<Test>::NotOwner
    );

    assert_ok!(KittiesModule::transfer(
        Origin::signed(account_id),
        recipient,
        kitty_id + 1
    ));

    assert_eq!(KittiesModule::kitty_owner(kitty_id), Some(recipient));

    assert_ok!(
        KittiesModule::transfer(
            Origin::signed(recipient),
            account_id,
            kitty_id
        )
    )

    assert_eq!(
        KittiesModule::kitty_owner(kitty_id),
        Some(account_id)
    )


}

#[test]
fn it_works_for_events(){
    let kitty_id = 0;
    let account_id = 1;

    assert_eq!(KittyModule::next_kitty_id(),kitty_id);
    assert_eq!(KittyModule::create(Origin::signed(account_id)));

    // 获取所有事件
    let events = System::events();
    
    assert_eq!(event.len(), 0);
    // 遍历事件并找到我们感兴趣的事件
    // for event in events.iter() {
    //     assert_eq!(event.event.data[0], Origin::signed(account_id + 1));
    //     // if let Event::pallet_kitties(crate::Event::KittyCreated(_, _)) = event.event {
    //         // 在这里处理事件，可以根据事件的内容进行断言或其他逻辑操作
    //         // 例如，我们可以使用 `assert_eq!` 断言事件的某些字段值是否符合预期
    //         // 或者可以记录事件的发生次数，做进一步的检查

    //         // 示例：断言事件的第一个参数是否为预期值
    //         // assert_eq!(event.event.idx, 0);
    //         // assert_eq!(event.event.data[0], 42);
    //     // }
    // }
}