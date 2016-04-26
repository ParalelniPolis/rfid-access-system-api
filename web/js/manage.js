document.addEventListener('DOMContentLoaded', function() {

	'use strict';

	// DOM ready.

	if (!document.querySelector('body.manage')) {
		return;
	}

	var cardIdentifierSelects = document.querySelectorAll('select[name^="identifier["]');

	if (cardIdentifierSelects) {
		for (var i = 0; i < cardIdentifierSelects.length; i++) {
			cardIdentifierSelects[i].addEventListener('change', function() {
				redirect('/manage/grant-access?card_identifier=' + encodeURIComponent(this.value));
			});
		}
	}

	var lockAccessSelectAll = document.querySelector('#grant-access-lock-select-all');

	if (lockAccessSelectAll) {

		var lockAccessCheckboxes = document.querySelectorAll('input[name="can_access_locks[]"]')

		lockAccessSelectAll.addEventListener('change', function() {
			for (var i = 0; i < lockAccessCheckboxes.length; i++) {
				lockAccessCheckboxes[i].checked = this.checked;
			}
		});
	}

});
