jQuery(document).ready(function($){
    (function ( $, rwmb ) {
        'use strict';

        $('.rwmb_math_operator_json').each(function(){
            etrck_group_math_operator($(this));
        });

        $('.rwmb-clone .rwmb_math_operator_json').each(function( index ){
            var cloneId = $(this).parent().find('input').attr('name');
            var groupId = cloneId.split('[')[0];
            etrck_group_math_operator($(this), cloneId, groupId, index);
        });

        if (typeof rwmb !== 'undefined' && rwmb.$document) {
            rwmb.$document.on('clone', function(events, index){
                let cloneId = 0;
                const clone = events.target;
                const cloneClass = clone.className;

                if( cloneClass === 'rwmb-math_operator rwmb-text' ){
                    cloneId = clone.id;//math_operator_{random_number-letters}
                    //get the parent group id
                    var groupId = $('#'+cloneId).attr('name');
                    groupId = groupId.split('[')[0];// get group_id from group_id[index][cloneId]
                }
                $('.rwmb-clone .rwmb_math_operator_json').each(function(){
                    etrck_group_math_operator($(this), cloneId, groupId, index);
                });
            });
        }

    })( jQuery, window.rwmb || {} );

   function etrck_math_operator(object) {
        // Get the formula from data-formula
        var formula = object.data('formula');
        // Get the operator field id from data-operatorfield attribute
        var operatorField = object.data('operatorfield');

        // Get the operator field value
        var operatorFieldValue = jQuery('[name="' + operatorField + '"]').val();

        // If the operator field is empty, set it to 0
        if (operatorFieldValue === '') {
            jQuery('[name="' + operatorField + '"]').val(0);
        }

        // Check if this field acts as a total value
        var isTotalValueField = jQuery('[name="' + operatorField + '"]').siblings('.rwmb_total_value_option').val() === 'true';

        if (isTotalValueField) {
            // Add a change event listener to update the total value when any .rwmb-math_operator field changes
            jQuery(document).on('change input', '.rwmb-math_operator', function() {
                update_total_value();
            });
        } else {
            // Regular field calculation
            var ids = object.data('jsoptions');
            ids = ids.fields_id;

            // Join with [name=] to get the radio and checkbox fields
            var idsWithNames = [];
            jQuery.each(ids, function(i, id) {
                idsWithNames.push('[name*="' + id + '"]');
            });

            // Every time the value of the ids fields changes, apply the formula
            jQuery(document).on('change input', idsWithNames.join(','), function() {
                var $group = jQuery(this).closest('.rwmb-group-wrapper'); // Adjust the class name to match the group wrapper

                // Get the operator field value within the group
                var operatorFieldValue = $group.find('[name*="' + operatorField + '"]').val();
                // If the operator field is empty, set it to 0
                if (operatorFieldValue === '') {
                    $group.find('[name*="' + operatorField + '"]').val(0);
                }

                // Get the value of the ids fields within the group
                var values = [];
                jQuery.each(ids, function(index, id) {
                    var val = $group.find('[name*="' + id + '"]').val();
                    // Radio
                    if ($group.find('[name*="' + id + '"]').attr('type') === 'radio') {
                        if ($group.find('[name*="' + id + '"]').is(':checked')) {
                            val = +parseInt($group.find('[name*="' + id + '"]:checked').val());
                        } else {
                            val = 0;
                        }
                    }
                    // Checkbox
                    if ($group.find('[name*="' + id + '"]').attr('type') === 'checkbox') {
                        if ($group.find('[name*="' + id + '"]').is(':checked')) {
                            val = +parseInt($group.find('[name*="' + id + '"]:checked').val());
                        } else {
                            val = 0;
                        }
                    }
                    // Select
                    if ($group.find('[name*="' + id + '"]').attr('type') === 'select') {
                        if ($group.find('[name*="' + id + '"]').val() === '') {
                            val = 0;
                        } else {
                            val = +parseInt($group.find('[name*="' + id + '"]:selected').val());
                        }
                    }
                    // If it's empty, set it to 0
                    if (val === '') {
                        val = 0;
                    }
                    console.log(val);
                    values.push(val);
                });

                // Replace all occurrences, even if repeated, of the ids in the formula with the values
                var formulaWithValues = formula;
                jQuery.each(ids, function(index, id) {
                    formulaWithValues = formulaWithValues.replace(new RegExp(id, 'g'), values[index]);
                });

                // Evaluate the formula
                if (math.evaluate(formulaWithValues) === Infinity) {
                    $group.find('[name*="' + operatorField + '"]').val(0);
                } else {
                    $group.find('[name*="' + operatorField + '"]').val(math.evaluate(formulaWithValues).toFixed(2)).trigger('change');
                }
            });
        }
    }


    //MB GROUPS, based on the function above
    function etrck_group_math_operator(object, cloneId, groupId, index){

        if(!index){
            etrck_math_operator(object);
        }

        //get the formula form data-formula
        var formula = object.data('formula');
        //get the operator field id from data-operatorfield attribute
        var operatorField = object.data('operatorfield');

        operatorField = groupId+'['+index+']['+operatorField+']'; //name of the newly cloned field

        //get the operator field value
        var operatorFieldValue = jQuery('[name="'+operatorField +'"]').val();

        //if the operator field is empty, set it to 0
        if(operatorFieldValue === ''){
            jQuery('[name="'+operatorField +'"]').val(0);
        }

        //get the ids that we will apply the formula to, from the data-jsoptions attribute, and convert them to the new format
        var ids = object.data('jsoptions');
        ids = ids.fields_id;

        //join with [name=] to get the radio and checkbox fields
        var idsWithNames = [];
        jQuery.each(ids, function(i, id){
            idsWithNames.push('[name*="'+groupId+'['+index+']['+id+']"]');
        });

        //get the id of each idsWithNames
        var idsWithNamesIds = [];
        jQuery.each(idsWithNames, function(i, id){
            idsWithNamesIds.push(jQuery(id).attr('id'));
        });

        //replace the item in the formula with the new id
        jQuery.each(ids, function(i, id){
            formula = formula.replace(id, idsWithNamesIds[i]);
        });

        console.log('etrck_group_math_operator: ' + idsWithNames.join(','));

        //everytime the value of the ids fields changes, apply the formula
        jQuery(document).on('change input', idsWithNames.join(','), idsWithNamesIds, function() {
            console.log('group changed');
            //get the operator field value
            var operatorFieldValue = jQuery('[name="' + operatorField + '"]').val();
            //if the operator field is empty, set it to 0
            if(operatorFieldValue === ''){
                jQuery('[name="' + operatorField + '"]').val(0);
            }

            //get the value of the ids fields
            var values = [];
            jQuery.each(idsWithNames, function(index, id){
                var val = jQuery(id).val();
                //if it's empty, set it to 0
                if(val === ''){
                    val = 0;
                }
                values.push(val);
            });

            //replace all occurrences, even if repeated, of the ids in the formula with the values
            var formulaWithValues = formula;
            jQuery.each(idsWithNamesIds, function(index, id){
                formulaWithValues = formulaWithValues.replace(new RegExp(id, 'g'), values[index]);
            });

            if(math.evaluate(formulaWithValues) === Infinity){
                jQuery('[name="' + operatorField + '"]').val(0);
            } else {
                jQuery('[name="' + operatorField + '"]').val(math.evaluate(formulaWithValues).toFixed(2)).trigger('change');
            }

            // Update total value if the field is marked as total
            if (jQuery('[name="' + operatorField + '"]').siblings('.rwmb_total_value_option').val() === 'true') {
                update_total_value();
            }

        });
    }

    // Function to update the total value
    function update_total_value() {
        var total = 0;
        jQuery('.rwmb-math_operator').each(function() {
            total += parseFloat(jQuery(this).val()) || 0;
        });
        jQuery('.rwmb-math_operator-total').val(total.toFixed(2)).trigger('change');
    }

});
