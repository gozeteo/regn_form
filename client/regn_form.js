// Start functions
// Initialize filepicker
Meteor.startup(function() {
	filepicker.setKey('AMfJlBtH6RHWPiaNaVhO6z');
	filepicker.constructWidget(document.getElementById('attachment'));
});

// Get Answers collection
Meteor.subscribe("answers");


Template.main.email_verified = function() {
	return Meteor.users.findOne({
		_id: Meteor.userId()
	}, {
		emails: {
			$slice: 0
		}
	}).emails[0].verified;
};

Template.survey_tabs.surveys = function() {
	return surveys;
};

Template.survey_tabs.helpers({
	isText: function(qfield) {
		if (qfield === 'text') {
			return true;
		} else {
			return false;
		}
	},
	isCheckBox: function(qfield) {
		if (qfield === 'checkbox') {
			return true;
		} else {
			return false;
		}
	},
	isRadio: function(qfield) {
		if (qfield === 'radio') {
			return true;
		} else {
			return false;
		}
	},
	isPara: function(qfield) {
		if (qfield === 'para') {
			return true;
		} else {
			return false;
		}
	}
});

Template.survey_tabs.rendered = function() {
	// $('#survey_tabs a:first').tab('show'); // Show first tab on initial load
	$('#survey_tabs li:first').addClass('active');
	$('#survey_content div:first').addClass('in active');
	$('#section_tabs li:first').addClass('active');
	$('#section_content div:first').addClass('in active');
	var apane = $('#survey_content div.tab-pane.fade.active.in div.active');
	var fpane = $('#survey_content div.tab-pane.fade.active.in div.tab-pane').first();
	var lpane = $('#survey_content div.tab-pane.fade.active.in div.tab-pane').last();

	// This needs to happen on click of survey tab

	if (apane.get(0).id === fpane.get(0).id) {
		console.log('rendering');
		//$('.previous').addClass('disabled');
		$('.previous').hide();
	}

	if (apane.get(0).id === lpane.get(0).id) {
		console.log('rendering');
		//$('.previous').addClass('disabled');
		$('.next').hide();
	}
	var survey_id = $('#survey_content div.tab-pane.fade.in.active').get(0).id;
	var pdform = '#pdform_' + survey_id;

	function fillInputFields(element) {
		console.log(element.name);
		var el = element.name;
		var a = Answers.findOne({
			user_id: Meteor.userId()
		});
		var v = a[el];
		console.log('setting ' + el + ' to ' + v);
		$('#' + el).val(v);

		if (element.type !== "radio") {

			$('#' + el).val(v);
		} else {
			$('#' + v).prop('checked', true);
		}

		if (a.submitted === true) {
			_.values($(pdform + ' input')).forEach(function(element) {
				$('#' + element.id).prop('readonly', true)
			});
		}
	}

	var answers = $(pdform).serializeArray();

	// Handle radio buttons

	var r = ($(pdform + ' input[type=radio]'));
	_.values(r).forEach(function(element) {
		if (element.type === "radio") {
			var rval = $('#' + element.id + ':checked').val();
			// 		console.log(element.name);
			// 		console.log('radio field ' + element.name);
			// 			console.log('radio setting' + rval + ' to true');
			// 			$('#' + rval).prop('checked', true);

			answers.push({
				name: element.name,
				type: 'radio'
			});


		}
	});
	console.log('render answers', answers);

	answers.forEach(fillInputFields);
};

Template.survey_tabs.events({
	'click .next-section-btn': function() {
		save_form_vals();

		var apane = $('#section_content div.tab-pane.active');
		console.log(apane);
		apane.removeClass('in active');
		// $('#PersonalDetails').removeClass('in active');
		apane.next().addClass('in active');

		var fpane = $('#section_content div.tab-pane').first();
		var lpane = $('#section_content div.tab-pane').last();
		// var npane = $('#section_content div.tab-pane.active').next();
		// var ppane = $('#section_content div.tab-pane.active').prev();
		var npane = $('#survey_content div.tab-pane.fade.active.in div.active').next();
		var ppane = $('#survey_content div.tab-pane.fade.active.in div.active').prev();

		var atab = $('#survey_content div.tab-pane.fade.active.in ul.nav li.active');
		var ntab = $('#survey_content div.tab-pane.fade.active.in ul.nav li.active').next();
		var ptab = $('#survey_content div.tab-pane.fade.active.in ul.nav li.active').prev();

		atab.removeClass('active');
		ntab.addClass('active');

		// if (npane.get(0).id === fpane.get(0).id) {
		if (npane.get(0) !== undefined) {
			$('.next').show();

		} else {
			// $('.next').hide();

			// $('#section_content div.tab-pane.active .next').addClass("alert alert-danger");
			$('#section_content div.tab-pane.active .next a').html("Final Submit");
			$('#section_content div.tab-pane.active .next a').removeClass('next-section-btn');
			$('#section_content div.tab-pane.active .next a').addClass('final-submit-btn');
			$('#section_content div.tab-pane.active .next a').addClass("alert alert-danger");

			$('#section_content div.tab-pane.active .next').removeClass("next");
			$('#section_content div.tab-pane.active .final_submit').show();
		}

		if (ppane.get(0) !== undefined) {
			$('.previous').show();
		} else {
			$('.previous').hide();
		}

		return false;
	},
	'click .prev-section-btn': function() {
		save_form_vals();
		var apane = $('#section_content div.tab-pane.active');
		apane.removeClass('in active');
		apane.prev().addClass('in active');

		var atab = $('#survey_content div.tab-pane.fade.active.in ul.nav li.active');
		var ntab = $('#survey_content div.tab-pane.fade.active.in ul.nav li.active').next();
		var ptab = $('#survey_content div.tab-pane.fade.active.in ul.nav li.active').prev();

		atab.removeClass('active');
		ptab.addClass('active');

		var npane = $('#survey_content div.tab-pane.fade.active.in div.active').next()
		var ppane = $('#survey_content div.tab-pane.fade.active.in div.active').prev()

		// var npane = $('#section_content div.tab-pane.active').next();
		// var ppane = $('#section_content div.tab-pane.active').prev();

		if (npane.get(0) !== undefined) {
			$('.next').show();
		} else {
			$('.next').hide();
		}

		if (ppane.get(0) !== undefined) {
			$('.previous').show();
		} else {
			$('.previous').hide();
		}

		return false;

	},
	'click #survey_tabs li a': function() {
		console.log('clicked');
		console.log(this.sections[0].section_id);
		var section_id = this.sections[0].section_id;
		console.log($('#' + section_id + ' li'));
		var survey_id = $('#survey_content div.tab-pane.fade.in.active').get(0).id;


		var apane = $('#survey_content div.tab-pane.fade.active.in div.active');
		var fpane = $('#survey_content div.tab-pane.fade.active.in div.tab-pane').first();
		var lpane = $('#survey_content div.tab-pane.fade.active.in div.tab-pane').last();


		$('#survey_tabs li.active').removeClass('active');
		$('#section_tabs li.active').removeClass('active');
		$('#section_content div.tab-pane.active').removeClass('in active');
		// $('#' + section_id + ' li').addClass('active');
		// $('#' + section_id + ' li').next().removeClass('active');
		// $('#section_content div:active').removeClass('in active');
		// $('#' + section_id).addClass('in active');
		// $('#section_content div:active').removeClass('in active');
		// ('#section_content div.tab-pane').first();
		// this.addClass('in active');
		// $(this + '#section_tabs li:first').addClass('active');
		// $('#survey_content div').addClass('in active')
		// $('#section_tabs li:active').addClass('active');
		// $('#section_content div:active').addClass('in active');
		// 	var apane = $('#survey_content div.tab-pane.fade.active.in div.active');
		// var fpane = $('#survey_content div.tab-pane.fade.active.in div.tab-pane').first();
		// var lpane = $('#survey_content div.tab-pane.fade.active.in div.tab-pane').last();

		// This needs to happen on click of survey tab

		if (apane.get(0).id === fpane.get(0).id) {
			console.log('rendering');
			//$('.previous').addClass('disabled');
			$('.previous').hide();
		}

		if (apane.get(0).id === lpane.get(0).id) {
			console.log('rendering');
			//$('.previous').addClass('disabled');
			// $('.next').hide();

		}

		// return false;
	},
	'click .final-submit-btn': function() {
		console.log('final submit');
		var survey_id = $('#survey_content div.tab-pane.fade.in.active').get(0).id;
		var pdform = '#pdform_' + survey_id;

		_.values($(pdform + ' input')).forEach(function(element) {
			$('#' + element.id).prop('readonly', true)
		});

		if (!Answers.findOne().submit_id) {
			var submission_id = Random.hexString(6);

			var values = {
				submitted: true,
				submit_id: submission_id
			};

			Meteor.call('insertAnswers', values, function(err, res) {
				if (err) {
					console.log('cannot insert: ' + err);
				} else {
					console.log('inserted: ' + res);
				}
			});

		}

		return false;
	}
});

Template.appl_submit_details.submit_id = function() {
	var ret = false;
	if (Answers.findOne().submit_id) {
		ret = Answers.findOne().submit_id;

	}
	return ret;
}
Template.filepicker.events({
	'click #uploadBtn': function(evt) {
		filepicker.pick(function(InkBlob) {
			console.log('inside' + hdesc);
			var url = InkBlob.url;
			var hrec = {
				userid: Meteor.userId(),
				imgurl: url,
				checked: true
			};
			console.log(JSON.stringify(hrec));
			Meteor.call('insertHfile', hrec, function(err, res) {
				if (err) {
					console.log('Failed to set ', hrec);
				} else if (res) {
					console.log('Updating ', hrec);
				}
			});

		});
	}
});

function save_form_vals() {

	var form_vals = $('#section_content div.tab-pane.active div.form-group input').serializeArray();

	var values = _.object(_.map(form_vals, function(item) {
		return [item.name, item.value]
	}));

	console.log(values);

	Meteor.call('insertAnswers', values, function(err, res) {
		if (err) {
			console.log('cannot insert: ' + err);
		} else {
			console.log('inserted: ' + res);
		}
	});
}