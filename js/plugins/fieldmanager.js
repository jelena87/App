// Field Manager Plugin
(function ($)
{
    var selectedField = null;
    var optionsIndex = 0;
    var settingIdsTypes = [];
    var selectingField = false;
    var savingField = false;
    var deletingField = false;
    var baseLoc = window.location;

    var FieldTypes = {
        NAME: 0,
        COMMENT: 1,
        MINLENGTH: 2,
        MAXLENGTH: 3,
        MINVALUE: 4,
        MAXVALUE: 5,
        DEFAULT: 6,
        VALUES: 7,
        REFERENCEOBJECT: 8,
        REFERENCEOBJECTLIST: 9,
        RULECHECK: 10,
        DEFAULTDISPLAY: 11,
        REQUIRED: 12
    }

    $.fn.FieldManager = function ()
    {
        $(this).reloadInlineFunctions();
        $('.sortable-list').reloadSortable();
    }

    $.fn.reloadSortable = function ()
    {
        //Static droppable types
        $("#draggable-fieldtypes .list-group-item").draggable({
            cursor: 'move',
            helper: 'clone',
            zIndex: 100,
            connectToSortable: '.sortable-list',
            revert: 'invalid',
            scroll: false
        });

        //Primary sortable (overall list)
        $('.sortable-list').sortable({
            connectWith: '.sortable-sub',
            tolerance: 'pointer',
            update: function (event, ui)
            {
                if (ui.item)
                {
                    console.log('ADDING TO SORTABLE LIST');
                    $(ui.item).removeAttr('style').removeClass('col-md-12');
                    if ($(ui.item).data('id') === undefined)
                    {
                        $('.sortable-list').newField($(ui.item));
                    } else
                    {
                        //Prevent adding fieldgroups inside fieldgroups
                        if ($(ui.item).parent().hasClass('field-group') && $(ui.item).data('fieldtype') === 9/*FieldGroup*/)
                        {
                            return $('.sortable-list').sortable("cancel");
                        }

                        $('.sortable-list').sortFields();
                    }
                }
            }
        });

        //Sub sortables (fieldgroups)
        $('.sortable-sub').sortable({
            connectWith: '.sortable-list'
        });
    }

    $.fn.reloadInlineFunctions = function ()
    {
        //Edit field title in-line
        $('#dropped-fieldtypes .fieldname').editable({
            type: 'text',
            name: 'name',
            mode: 'inline',
            container: 'body',
            placement: 'right',
            success: function (response, newValue)
            {
                var fieldid = $(this).closest('.list-group-item').data('id');
                console.log('fieldid: ', fieldid);
                $.ajax({
                    type: "POST",
                    url: baseLoc + "/UpdateName",
                    data: { id: fieldid, name: newValue },
                    success: function (result)
                    {
                        console.log('success %s', result);
                    },
                    error: function (error)
                    {
                        console.log('error %s', error);
                    }
                });
            },
            title: 'Field name'
        }).click(function (e)
        {
            e.stopPropagation();
        });

        //Load settings
        $('#dropped-fieldtypes .list-group-item').on('click', function (e)
        {
            e.stopPropagation();
            $(this).loadField();
        });

        //Delete field
        $('#dropped-fieldtypes button[data-toggle=delete]').on('click', function (e)
        {
            e.stopPropagation();

            var field = $(this).closest('.list-group-item');
            $(field).stop().deleteField();
        });
    }

    /* Add new field (Drag&Drop from Field Types) */
    $.fn.newField = function (field)
    {
        //Set group based on where the field is
        var groupid = 0;
        if ($(field).parent().hasClass('field-group'))
        {
            groupid = $(field).parent().data('groupid');
        }

        //Prevent adding fieldgroups inside fieldgroups
        if (groupid > 0 && $(field).data('fieldtype') === 'FieldGroup'/*FieldGroup*/)
        {
            return $(field).remove();
        }

        $.ajax({
            type: "POST",
            url: baseLoc + "/AddField",
            data: {
                Type: $(field).data('fieldtype'),
                GroupId: groupid
            },
            success: function (data)
            {
                if (data !== undefined && data.id !== undefined)
                {
                    $(field).attr('data-id', data.id);
                    if ($(field).data('fieldtype') === 'FieldGroup'/*FieldGroup*/)
                    {
                        $(field).append($('<div></div>').addClass('well field-group sortable-sub').attr('data-groupid', data.id));

                        $('.sortable-list').reloadSortable();
                    }
                    $(field).find('.fieldname').text(data.name);

                    $(this).reloadInlineFunctions();

                    $(this).sortFields();

                    /*Load field settings as soon as it has been dropped */
                    $(field).click();
                }
            },
            error: function (error)
            {
                console.log('error %s', error);
            }
        });
    };

    //Upon re-sorting the fields, loop our droppable zone elements into a json array and save them in the order they are in the dom
    $.fn.sortFields = function ()
    {
        var fields = { fieldOrder: [] };
        var order = 1;

        $.each($('#dropped-fieldtypes .list-group-item'), function (index, field)
        {
            var group = 0;
            if ($(field).parent().hasClass('field-group'))
            {
                group = $(field).parent().data('groupid');
            }

            fields.fieldOrder.push({ Id: $(field).data('id'), Order: order, GroupId: group, GroupFields: null });
            order++;
        });

        $.ajax({
            type: 'POST',
            url: baseLoc + '/SortFields',
            data: fields,
            dataType: 'json'
        });
    };

    $.fn.loadField = function ()
    {
        if (selectingField || savingField)
        {
            return;
        }

        selectingField = true;

        if (selectedField !== null)
        {
            selectedField.stop().css('background-color', '');
        }

        selectedField = $(this);
        var fieldid = selectedField.data('id');
        var fieldtype = selectedField.data('fieldtype');
        var formBody = $('#settings-form');

        $('#field-settings').show("slide", { direction: "right" }, 200);
        formBody.empty();

        $.ajax({
            type: "GET",
            url: baseLoc + "/LoadSettings",
            data: { Id: fieldid, Type: fieldtype },
            success: function (settings)
            {
                if (settings)
                {
                    $(formBody).empty();
                    settingIdsTypes = [];
                    $.each(settings, function (index, data)
                    {
                        $(formBody).appendSetting(index, data);
                    });

                    $('<div></div>').addClass('form-group').append(
                        $('<div></div>').addClass('col-sm-offset-4 col-sm-8').append(
                            $('<button></button>').attr('id', 'save-settings').addClass('btn primarycolor primarycolorhover').text('Save').on('click', function (e)
                            {
                                e.preventDefault();
                                if ($('#settings-form').valid())
                                {
                                    $(this).saveField();
                                }
                            })
                        )
                    ).appendTo(formBody);

                    selectedField.css('background-color', '#bbbbbb');

                    $(formBody).formValidation();
                }
                selectingField = false;
            },
            error: function (error)
            {
                console.log('error %s', error);
                selectingField = false;
            }
        });
    };

    //Append setting during setting creation
    $.fn.appendSetting = function (name, data)
    {
        settingIdsTypes.push({ id: data.id, type: data.type });

        var setting = $('<div></div>').addClass('form-group').attr('data-relation', data.type);
        switch (data.type)
        {
            case FieldTypes.NAME:
                setting.append($('<label></label>').addClass('control-label col-sm-4').text(data.displayName));
                setting.append($('<div></div>').addClass('col-sm-8').append(
                    $('<input>')
                        .attr('type', 'text')
                        .attr('name', 'type[' + data.id + ']')
                        .attr('data-settingtype', data.type)
                        .val(data.value)
                ));
                break;
            case FieldTypes.COMMENT:
            case FieldTypes.RULECHECK:
                setting.append($('<label></label>').addClass('control-label col-sm-4').text(data.displayName));
                setting.append($('<div></div>').addClass('col-sm-8').append(
                    $('<input>')
                        .attr('type', 'text')
                        .attr('name', 'type[' + data.id + ']')
                        .attr('data-settingtype', data.type)
                        .val(data.value)
                ));
                break;
            case FieldTypes.MINLENGTH: //Minimum Length
            case FieldTypes.MAXLENGTH: //Maximum Length
            case FieldTypes.MINVALUE: //Minimum Value
            case FieldTypes.MAXVALUE: //Maximum Value
                setting.append($('<label></label>').addClass('control-label col-sm-4').text(data.displayName));
                setting.append($('<div></div>').addClass('col-sm-8').append(
                    $('<input>')
                        .attr('type', 'text')
                        .attr('name', 'type[' + data.id + ']')
                        .attr('data-settingtype', data.type)
                        .val(data.value),
                ));
                break;
            case FieldTypes.DEFAULT: //Default
                if (selectedField.data('fieldtype') === 'Checkbox'/*Checkbox Field Type*/)
                {
                    /* Display a checkbox for Default */
                    setting.append($('<label></label>').addClass('control-label col-sm-4').text(data.displayName));
                    setting.append($('<div></div>').addClass('col-sm-8').append(
                        $('<input>')
                            .attr('type', 'checkbox')
                            .attr('name', 'type[' + data.id + ']')
                            .attr('data-settingtype', data.type)
                            .prop('checked', data.value === "true" ? 'checked' : '')
                    ));
                } else if (selectedField.data('fieldtype') === 'Date'/*Date Field Type*/)
                {
                    setting.append($('<label></label>').addClass('control-label col-sm-4').text(data.displayName));
                    setting.append($('<div></div>').addClass('col-sm-8').append(
                        $('<input>')
                            .attr('type', 'text')
                            .attr('name', 'type[' + data.id + ']')
                            .attr('data-settingtype', data.type)
                            .val(data.value).datepicker(),
                    ));
                } else
                {
                    setting.append($('<label></label>').addClass('control-label col-sm-4').text(data.displayName));
                    setting.append($('<div></div>').addClass('col-sm-8').append(
                        $('<input>')
                            .attr('type', 'text')
                            .attr('name', 'type[' + data.id + ']')
                            .attr('data-settingtype', data.type)
                            .val(data.value)
                    ));
                }
                break;
            case FieldTypes.VALUES: //Value system
                optionsIndex = 0;

                setting.addClass('setting-options').append($('<label></label>').addClass('control-label col-sm-4').text(data.displayName));
                var optionrender = $('<div></div>').addClass('option-rows col-sm-8');
                //Create key, value inputs for all options
                if (data.value !== null)
                {
                    $.each(JSON.parse(data.value), function (index, option)
                    {
                        optionrender.append($('<div></div>').addClass('row').attr('data-optionid', optionsIndex).append(
                            //Default radio
                            $('<div></div>').addClass('col-sm-1').append(
                                $('<input></input>')
                                    .attr('type', 'radio')
                                    .attr('name', 'type[' + data.id + '][default]')
                                    .attr('value', optionsIndex)
                                    .attr('data-option', optionsIndex)
                                    .prop('checked', option.default ? true : false)
                                    .attr('data-name', 'default')
                            ),
                            //Value input
                            $('<div></div>').addClass('col-sm-5').append(
                                $('<input></input>')
                                    .attr('type', 'text')
                                    .attr('name', 'type[' + data.id + '][' + optionsIndex + '][value]')
                                    .attr('data-option', optionsIndex)
                                    .attr('placeholder', 'Value') //Need translation
                                    .val(option.value)
                                    .attr('data-name', 'value'),
                                $('<span></span>')
                            ),
                            //Value label
                            $('<div></div>').addClass('col-sm-5').append(
                                $('<input></input>').attr('type', 'text')
                                    .attr('name', 'type[' + data.id + '][' + optionsIndex + '][label]')
                                    .attr('data-option', optionsIndex)
                                    .attr('placeholder', 'Label') //Need translation
                                    .val(option.label)
                                    .attr('data-name', 'label'),
                                $('<span></span>')
                            ),

                            $('<div></div>').addClass('col-sm-1').append(
                                optionsIndex > 0 ?
                                    $('<button></button>').addClass('btn primarycolor primarycolorhover btn-xs').attr('data-optionid', optionsIndex).append(
                                        $('<span></span>')
                                            .addClass('glyphicon glyphicon-remove')
                                            .attr('aria-hidden', true))
                                        .on('click', function (e)
                                        {
                                            e.preventDefault();
                                            $(this).deleteSettingOption();
                                        })
                                    : '&nbsp;'
                            )
                        ));

                        optionsIndex++;
                    });
                }

                optionrender.append($('<div></div>').addClass('col-sm-11').append(
                    $('<button></button>').addClass('btn btn-sm primarycolor primarycolorhover add-option push-right').attr('type', 'button').attr('name', 'add-option').attr('data-id', data.id).text('Add Option').on('click', function (e)
                    {
                        e.preventDefault();
                        $(this).addSettingOption();
                    })
                ));

                setting.append(optionrender);
                break;
            case FieldTypes.REFERENCEOBJECT: // Referenced Object

                var selectOptions = $('<select></select>')
                    .addClass('form-control')
                    .attr('name', 'type[' + data.id + ']')
                    .attr('required', 'required');

                selectOptions.append(
                    $('<option></option').val('').text('-')
                );

                $.each(JSON.parse(data.selectables), function (index, value)
                {
                    console.log(data.value + ' - ' + value.Id);

                    selectOptions.append(
                        $('<option></option').val(value.Id).text(value.Name)
                    );
                });

                selectOptions.val(data.value);

                setting.append($('<label></label>').addClass('control-label col-sm-4').text(data.displayName));
                setting.append($('<div></div>').addClass('col-sm-8').append(selectOptions));
                break;
            case FieldTypes.REFERENCEOBJECTLIST: // Referenced Object List

                var selectOptions = $('<select></select>')
                    .addClass('form-control')
                    .attr('multiple', 'multiple')
                    .attr('name', 'type[' + data.id + ']')
                    .attr('required', 'required');

                $.each(JSON.parse(data.selectables), function (index, value)
                {
                    selectOptions.append(
                        $('<option></option').val(value.Id).text(value.Name)
                    );
                });

                if (data.value !== null)
                {
                    selectOptions.val(JSON.parse(data.value));
                }

                setting.append($('<label></label>').addClass('control-label col-sm-4').text(data.displayName));
                setting.append($('<div></div>').addClass('col-sm-8').append(selectOptions));
                break;
            case FieldTypes.DEFAULTDISPLAY: // Default Display

                //Translate these
                var options = ['None', 'Static', 'Creationtime'];

                var selectOptions = $('<select></select>')
                    .addClass('form-control')
                    .attr('name', 'type[' + data.id + ']')
                    .attr('required', 'required').on('change', function (e)
                    {
                        console.log($(this).val());
                        switch ($(this).val())
                        {
                            default:
                                $('div[data-relation=6]').hide(); /* Default Relation */
                                break;
                            case '1':
                                $('div[data-relation=6]').show(); /* Default Relation */
                                break;
                        }
                    });
                $.each(options, function (index, value)
                {
                    selectOptions.append(
                        $('<option></option').val(index).text(value)
                    );
                });

                selectOptions.val(data.value);

                setting.append($('<label></label>').addClass('control-label col-sm-4').text(data.displayName));
                setting.append($('<div></div>').addClass('col-sm-8').append(selectOptions));

                if (data.value === "1")
                {
                    $('div[data-relation=6]').show();
                } else
                {
                    $('div[data-relation=6]').hide(); /* Default Relation */
                }
                break;
            case FieldTypes.REQUIRED: //Required checkbox
                setting.append($('<label></label>').addClass('control-label col-sm-4').text(data.displayName));
                setting.append($('<div></div>').addClass('col-sm-8').append(
                    $('<input>').attr('type', 'checkbox').attr('name', 'type[' + data.id + ']').attr('data-fieldid', data.fieldId).prop('checked', data.value !== null && data.value ? 'checked' : '')
                ));
                break;
        }
        setting.appendTo(this);
    }

    //Remove dropdown option
    $.fn.deleteSettingOption = function ()
    {
        var optionid = $(this).data('optionid');
        $('div.row[data-optionid=' + optionid + ']').remove();
    }

    //Add another dropdown value label pair on clicking "Add Option"
    $.fn.addSettingOption = function ()
    {
        var id = $(this).data('id');
        $('<div></div>').addClass('row').attr('data-optionid', optionsIndex).append(
            $('<div></div>').addClass('col-sm-1').append(
                $('<input></input>')
                    .attr('type', 'radio')
                    .attr('name', 'type[' + id + '][default]')
                    .attr('value', optionsIndex)
                    .attr('data-option', optionsIndex)
                    .attr('data-name', 'default')
            ),
            //Value input
            $('<div></div>').addClass('col-sm-5').append(
                $('<input></input>')
                    .attr('type', 'text')
                    .attr('name', 'type[' + id + '][' + optionsIndex + '][value]')
                    .attr('data-option', optionsIndex)
                    .attr('placeholder', 'Value') //Need translation
                    .attr('data-name', 'value')
            ),
            //Value label
            $('<div></div>').addClass('col-sm-5').append(
                $('<input></input>').attr('type', 'text')
                    .attr('name', 'type[' + id + '][' + optionsIndex + '][label]')
                    .attr('data-option', optionsIndex)
                    .attr('placeholder', 'Label') //Need translation
                    .attr('data-name', 'label')
            ),

            $('<div></div>').addClass('col-sm-1').append(
                optionsIndex > 0 ?
                    $('<button></button>').addClass('btn primarycolor primarycolorhover btn-xs').attr('data-optionid', optionsIndex).append(
                        $('<span></span>')
                            .addClass('glyphicon glyphicon-remove')
                            .attr('aria-hidden', true))
                        .on('click', function (e)
                        {
                            e.preventDefault();
                            $(this).deleteSettingOption();
                        })
                    : '&nbsp;'
            )
        ).insertBefore($(this).parent());

        optionsIndex++;
    }

    $.fn.formValidation = function ()
    {
        $(this).validate();

        //Name
        if ($('input[data-settingtype=' + FieldTypes.NAME + ']').length)
        {
            $('input[data-settingtype=' + FieldTypes.NAME + ']').rules('add', {
                required: true,
                minlength: 5
            });
        }

        //Minimum Length
        if ($('input[data-settingtype=' + FieldTypes.MINLENGTH + ']').length)
        {
            $('input[data-settingtype=' + FieldTypes.MINLENGTH + ']').rules('add', {
                required: false,
                digits: true
            });
        }

        //Maximum Length
        if ($('input[data-settingtype=' + FieldTypes.MAXLENGTH + ']').length)
        {
            $('input[data-settingtype=' + FieldTypes.MAXLENGTH + ']').rules('add', {
                required: false,
                digits: true
            });
        }

        //Minimum Value
        if ($('input[data-settingtype=' + FieldTypes.MINVALUE + ']').length)
        {
            $('input[data-settingtype=' + FieldTypes.MINVALUE + ']').rules('add',
                {
                    required: false,
                    decimal: true
                });
        }

        ////Maximum Value
        //$('input[data-settingtype=' + FieldTypes.MAXVALUE + ']').rules('add', {
        //    required: false,
        //    decimal: true
        //});
    }

    //Save field's settings
    $.fn.saveField = function ()
    {
        if (selectedField === null)
        {
            return;
        }

        if (selectingField || savingField)
        {
            return;
        }

        savingField = true;

        var data = [];

        if (settingIdsTypes.length > 0)
        {
            $.each(settingIdsTypes, function (index, ids)
            {
                var inputs = $('#settings-form input[name^="type[' + ids.id + ']"], #settings-form select[name^="type[' + ids.id + ']"]');
                switch (ids.type)
                {
                    default:
                        var val = inputs.val();
                        if (ids.type === 0)
                        { //Name
                            selectedField.find('.fieldname').text(val);
                        }

                        if (ids.type === 6/*Default*/ && selectedField.data('fieldtype') === 'Checkbox'/*Checkbox Field Type*/)
                        {
                            val = $(inputs).prop('checked');
                        }

                        data.push({
                            id: ids.id,
                            fieldid: selectedField.data('id'),
                            value: val
                        });
                        break;
                    case 12: //Checkbox
                        data.push({
                            id: ids.id,
                            fieldid: selectedField.data('id'),
                            value: inputs.prop('checked') ? true : false
                        });
                        break;
                    case 9: //Reference to Object
                        console.log(inputs.val());
                        data.push({
                            id: ids.id,
                            fieldid: selectedField.data('id'),
                            value: JSON.stringify(inputs.val())
                        });
                        break;
                    case 7: //Value system
                        var values = [];
                        $.each(inputs, function (optionindex, option)
                        {
                            var name = $(option).data('name');
                            var idx = $(option).data('option');

                            if (values[idx] === undefined)
                            {
                                values[idx] = {};
                            }

                            switch (name)
                            {
                                case 'label':
                                    values[idx].label = $(option).val();
                                    break;
                                case 'value':
                                    values[idx].value = $(option).val();
                                    break;
                                case 'default':
                                    values[idx][name] = $(option).prop('checked') ? true : false
                                    break;
                            }
                        });

                        data.push({
                            id: ids.id,
                            fieldid: selectedField.data('id'),
                            value: JSON.stringify(values)
                        });
                        break;
                }
            });
        }

        $.ajax({
            type: "POST",
            url: baseLoc + "/SaveSettings",
            data: { settings: data },
            success: function (result)
            {
                selectedField.effect('highlight', {}, 1500);
                console.log(result);
                savingField = false;
            },
            error: function (error)
            {
                console.log('error %s', error);
                savingField = false;
            }
        });

        selectedField.find('.fieldname').text($('#settings-form input[name="name"]').val());
    };

    //Delete field
    $.fn.deleteField = function ()
    {
        selectedField = $(this);

        if (selectedField === undefined || selectedField === null || deletingField)
        {
            return;
        }

        deletingField = true;

        $.ajax({
            type: "DELETE",
            url: baseLoc + "/DeleteField",
            data: { id: selectedField.data('id') },
            success: function (data)
            {
                alert(selectedField.text() + ' field deleted');

                selectedField.remove();
                $('#field-settings').hide();

                selectedField = null;
                deletingField = false;
            },
            error: function (error)
            {
                console.log('error %s', error);
                deletingField = false;
            }
        });
    }
}(jQuery));