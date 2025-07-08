$((function () {
	
	$(document).on('keydown', '[role="option"]', function(e) {
		var option = $(this).find('span').text();
		if (e.keyCode ==13 && $(this).hasClass('selected')) {
		  $(this).attr("aria-label",  option + "selected");
		} else if (e.keyCode == 13){
		  $(this).attr("aria-label", option + "unselected");
		} else if(e.keyCode == 27){
			$(this).parent('ul').hide();
		}
	  });


	// Tool Tip wave tool issues fixing
	// $('#ui-datepicker-div').attr('role', 'application');
	setTimeout(() => {
		var tooltipContent = '<span id="component-1057" class="d-none">Tooltip Content</span>';
		$('#ext-comp-1055').append(tooltipContent);
	}, 3000);

	let lastClickedAnchor;
	// Available Fileds Focus
	$(document).on('keydown', '.sideMneu', function (event) {
		if (event.keyCode === 13 || event.key === 'Enter') {
			lastClickedAnchor = this;
			setTimeout(function () {
				$('.cls-custom-tab .active').attr("tabindex", "0").focus();
			}, 1000);
		}

	});

	$(document).on('keydown', '.cls-proceed', function (event) {
		if (event.keyCode === 9 || event.key === 'Tab') {
			$('.cls-list').attr("tabindex", "0").focus();
		}
	});
	// Data table Button focus
	$(document).on('keydown', '.cls-jumb-page-btn', function (event) {
		if (event.keyCode === 38 || event.key === 'ArrowUp') {
			lastClickedAnchor = this;
			setTimeout(function () {
				$('.cls-save-report').attr("tabindex", "0").focus();
			}, 100);
		}
	});
}));

// date Picker tab
// Event handler for keyboard navigation inside the datepicker calendar
function getCurrentDate() {
	const currentDate = new Date();
	const day = currentDate.getDate().toString().padStart(2, '0');
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const month = monthNames[currentDate.getMonth()];
	const year = currentDate.getFullYear();
	return `${day} ${month} ${year}`;
}
setTimeout(() => {
	$(document).ready(function () {
		$(document).on('focus', '.ui-datepicker-calendar td a', function (event) {
			const day = $(this).text();
			const currentMonth = $(this).parent().attr('data-month'); // Get the current month // Get the current month
			const year = $('.ui-datepicker-title .ui-datepicker-year').val(); // Get the current year
			const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			const month = monthNames[parseInt(currentMonth, 10)];
			$(this).attr('aria-label', `${day} ${month} ${year}`);
			$(this).attr('aria-live', 'assertive');
		});
		
		var lastSelectedOption = null;
		$(document).on("keydown", '.ui-datepicker-calendar td a', function(e) {
			var currentMonthValue = parseInt($('.ui-datepicker-month').val());
			var $yearSelect = $('#ui-datepicker-div .ui-datepicker-year');
			var yearOptions = $yearSelect.find('option');
			var currentYearIndex = yearOptions.index(lastSelectedOption);

			if (e.shiftKey && e.which === 33) { // Shift + Page Up
				if (lastSelectedOption !== null && currentYearIndex > 0) {
					$yearSelect.val(yearOptions.eq(currentYearIndex - 1).val()).change();
					$('.ui-datepicker-calendar td a').eq(0).focus();
				}
				e.preventDefault(); // Prevent the default behavior
			}

			if (e.shiftKey && e.which === 34) { // Shift + Page Down
				if (lastSelectedOption !== null && currentYearIndex < yearOptions.length - 1) {
					$yearSelect.val(yearOptions.eq(currentYearIndex + 1).val()).change();
					$('.ui-datepicker-calendar td a').eq(0).focus();
				}
				e.preventDefault(); // Prevent the default behavior
			}
			lastSelectedOption = $yearSelect.find('option:selected');
		});

		$(document).on('keydown', '.ui-datepicker-calendar td a', function (event) {
			var $currentLink = $(this);
			var $currentCell = $currentLink.closest('td');
			console.log($currentCell, "$currentCell");
			if ($currentCell.length > 0) {
				if ($(this).is(':focus')) {
					console.log("focused-navigation");
					switch (event.keyCode) {
						case 36: // Home
							event.preventDefault();
							//   $currentCell.siblings().first().find('a').focus();
							$currentCell.closest('tr').find('a:not(.ui-state-disabled)').first().focus();
							break;
						case 35: // End
							event.preventDefault();
							//   $currentCell.siblings().last().find('a').focus();
							$currentCell.closest('tr').find('a:not(.ui-state-disabled)').last().focus();
							break;
						case 37: // Left arrow
							console.log("left");
							event.preventDefault();
							$currentCell.prev('td').find('a').focus();
							break;
						case 38: // Up arrow
							event.preventDefault();
							$currentCell.closest('tr').prev('tr').find('td:eq(' + $currentCell.index() + ') a').focus();
							break;
						case 39: // Right arrow
							console.log("right");
							//   event.preventDefault();
							$currentCell.next('td').find('a').focus();
							break;
						case 40: // Down arrow
							event.preventDefault();
							$currentCell.closest('tr').next('tr').find('td:eq(' + $currentCell.index() + ') a').focus();
							break;
						case 33: // Page Up
							event.preventDefault();
							$('.ui-datepicker-prev').trigger('click').focus(); // Trigger click event on the previous month button and focus on it
							setTimeout(function () {
								$('#ui-datepicker-div .ui-datepicker-calendar td a').first().focus(); // Focus on the first link of the new month
							}, 0);
							break;
						case 34: // Page Down
							event.preventDefault();
							$('.ui-datepicker-next').trigger('click').focus(); // Trigger click event on the next month button and focus on it
							setTimeout(function () {
								$('#ui-datepicker-div .ui-datepicker-calendar td a').first().focus(); // Focus on the first link of the new month
							}, 0);
							break;
						case 13: // Enter
							$currentLink.click();
							focusNextElement($(this)); 
							break;
					}
				}
			}
		});
	});
	

}, 3000);
function focusNextElement() {
    var $nextElement = $('.cls-check[tabindex="0"]').first();
    if ($nextElement.length) {
        $nextElement.focus();
    }
}