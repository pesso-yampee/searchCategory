const searchBox = '.search-box'; // 絞り込む項目を選択するエリア
const listItem = '.js-work';   // 絞り込み対象のアイテム
const hideClass = 'is-hide';     // 絞り込み対象外の場合に付与されるclass名
const current = 'current';

$(function () {
  // 絞り込み項目を変更した時
  $('input[type="checkbox"]').on('change', function () {
    search_filter($(this));
  });
  $('.check-test').on('click', function () {
    search_category($(this));
  });
});

/**
 * リストの絞り込みを行う
 */
function search_category(target) {
  // すべてのspan要素から「current」クラスを削除
  $(searchBox).find('label').find('span').removeClass(current);
  // すべてのチェックボックスからチェックを外す
  $('.category').find('label').find('input[type = "checkbox"]').removeAttr('checked').prop('checked', false).change();
  // チェックを入れたい要素にチェックを入れる
  target.attr('checked', true).prop('checked', true).change();
  // クリックした要素の隣接するspan要素が「current」クラスを持っていない場合
  if (target.parent().find('span').hasClass(current) === false) {
    target.parent().find('span').addClass(current);
  }
}
function search_filter() {
  // 非表示状態を解除
  $(listItem).removeClass(hideClass);

  for (let i = 0; i < $(searchBox).length; i++) {
    const name = $(searchBox).eq(i).find('input').attr('name');
    // inputで選択されているname属性の値を取得
    const searchData = get_selected_input_items(name);
    // 選択されているname属性の値がない場合は飛ばす
    if (searchData.length === 0 || searchData[0] === 'all') {
      continue;
    }
    // リスト内の各アイテムをチェック
    for (let j = 0; j < $(listItem).length; j++) {
      // アイテムに設定しているdata属性の値を取得
      const itemData = get_setting_values_in_item($(listItem).eq(j), name);
      // 絞り込み対象かどうかを調べる
      const check = array_match_check(itemData, searchData);
      if (!check) {
        $(listItem).eq(j).addClass(hideClass);
      }
    }
  }
}

/**
 * inputで選択されている値の一覧を取得する
 * @param  {String} name 対象にするinputのname属性の値
 * @return {Array}       選択されているinputのvalue属性の値
 */
function get_selected_input_items(name) {
  const searchData = [];
  $('[name=' + name + ']:checked').each(function () {
    searchData.push($(this).val());
  });
  return searchData;
}

/**
 * リスト内のアイテムに設定している値の一覧を取得する
 * @param  {Object} target 対象にするアイテムのjQueryオブジェクト
 * @param  {String} data   対象にするアイテムのdata属性の名前
 * @return {Array}         対象にするアイテムのdata属性の値
 */
function get_setting_values_in_item(target, data) {
  let itemData = target.data(data);
  if (!Array.isArray(itemData)) {
    itemData = [itemData];
  }
  return itemData;
}

/**
 * 2つの配列内で一致する文字列があるかどうかを調べる
 * @param  {Array} arr1 調べる配列1
 * @param  {Array} arr2 調べる配列2
 * @return {Boolean}    一致する値があるかどうか
 */
function array_match_check(arr1, arr2) {
  // 絞り込み対象かどうかを調べる
  let arrCheck = false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) >= 0) {
      arrCheck = true;
      break;
    }
  }
  return arrCheck;
}