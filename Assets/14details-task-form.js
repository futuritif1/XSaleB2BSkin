DetailsTaskForm = {
    selector: {
        editor: null,
        submit:null
    },
    init: function (formSel, submitSel,editorSel) {
        this.selector.editor = editorSel; this.selector.submit = submitSel;
        $(document).on('click', submitSel, function () {
            DetailsTaskForm.submit.apply(this, [ formSel ]);
        });
    },    
    submit: function (formSel) {
        var $this = $(this);
        var $form = $this.closest(formSel);
        var submitUrl = $form.attr('action');
        var serialized = $form.serialize();
        $.ajax({
            async: true,
            type: "POST",
            url: submitUrl,
            data: serialized,
            success: function (data) {
                if (data.Success) {
                    swal({
                        title: 'Zapisano',
                        text: "",
                        timer: 1000,
                        showConfirmButton: false,
                        type: "success",
                    });
                    DetailsTaskForm.addToList.apply($this, [data, $form]);
                } else {                    
                    swal('Błąd podczas zapisu', '', "error");
                    console.log(data.Errors);
                }
            }
        });
    },
    onChangeEditor: function () {
        var $editor = $(DetailsTaskForm.selector.editor);        
            var value = $editor.summernote("code");            
            if (value != '<p><br></p>' && value != '') {
                $(DetailsTaskForm.selector.submit).show();
            } else {
                $(DetailsTaskForm.selector.submit).hide();
            }        
    },
    addToList: function (data, $form) {
        var $button = this;
        var $taskList = $button.closest('.task-details').find('.task-list');
        var $proto = $taskList.find('.prototype-element');
        var $newProto = $proto.clone();
        $newProto.find('.created-by').text(data.Data.CreatedByClientUser);
        $newProto.find('.task-type').text(data.Data.TaskType);
        $newProto.find('.task-details-content').html(data.Data.DisplayContent);
        $newProto.find('.created-date').text(data.Data.DisplayCreated);
        var textareaId = $form.find('textarea')[0].id;
        var $editor = $('#' + textareaId);
        $editor.summernote("code",'');
        //console.log(data.Data.id,
        //data.Data.DisplayContent,
        //data.Data.DisplayCreated,
        //data.Data.CreatedByClientUser,
        //data.Data.TaskType);
        
        //zmiany
        
        $newProto.removeClass('prototype-element');
        $taskList.find('.feed-activity-list').prepend($newProto);
    }
}