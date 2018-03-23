SummernoteEditor = {
    init: function ($filed, height, uploadImageUrl, onChangeHandler, airMode, fullscreen, resizeBar, width, maxWidth, useTemplates, placeholder
        ) {
        //if (useTemplates==null) {
        //    useTemplates = false;
        //}
        if (maxWidth == null) {
            maxWidth = '100%';
        }        
        if (width==null) {
            width = '100%';
        }
        if (airMode==null) {
            airMode = true;
        }
        if (resizeBar == null) {
            resizeBar = true;
        }
        if (placeholder == null) {
            placeholder = '';
        }
        if (fullscreen==null) {
            fullscreen = true;
        }
        //if (JsHelper.isMobilePhone()) {
        //    airMode = true;
        //}
        var minHeight = 100;
        var fullscreenButton = 'fullscreen';
        if (!fullscreen) {
            fullscreenButton = null;
        }
        var toolbar =
            [
                                    ['style', ['style']],
                                    ['font', ['bold', 'italic', 'underline', 'clear']],
                                    ['fontname', ['fontname']],
                                    ['color', ['color']],
                                    ['para', ['ul', 'ol', 'paragraph']],
                                    ['table', ['table']],
                                    ['insert', ['link', 'picture']],
                                    ['view', [fullscreenButton, 'codeview', 'help']],
                                    //['cleaner', ['cleaner']],
                                    //['pasteclean', ['pasteclean']],
            ];
        //if (useTemplates) {
        //    toolbar.push(['insert', ['template']]);
        //}        
        var fontNames = [
    'Monospace', 'Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
    'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande',
    'Sacramento'
        ];
        var onImageUploadHandler = null;
        if (uploadImageUrl!=null && uploadImageUrl!='') {
            onImageUploadHandler = function (files) {
                for (var i = files.length - 1; i >= 0; i--) {
                    var f = files[i];

                    var data = new FormData();
                    data.append('fileup', f);
                    $.ajax({
                        url: uploadImageUrl,
                        method: 'POST',
                        data: data,
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            if (response.Success) {
                                var result = response.Data.result;
                                var imgNode = $('<img>').attr('src', result.FileDownloadUrl).attr('data-fileid', result.FileDBId.toString());
                                $filed.summernote('insertNode', imgNode[0]);
                                setTimeout(function () {
                                    $filed.summernote('editor.insertText', '');
                                }, 100);
                            } else {
                                SAlert.SendError(response.Errors);
                            }
                        }
                    });
                }
            };
        }
        var template = undefined;        
        //if (useTemplates === true) {
        //    var getHeadersUrl = window.location.origin + '/Config/EmailTemplate/GetTemplateHeaders';
        //    template = {
        //        //path: '/summernote/tpls', // path to your template folder
        //        list: {
        //        }
        //    };
        //    if (SummernoteEditor.TemplatesListCache != null) {
        //        template.list = SummernoteEditor.TemplatesListCache;
        //    } else {
        //        var data = $.ajax({
        //            type: "POST",
        //            url: getHeadersUrl,
        //            cache: false,
        //            async: false,
        //        }).responseJSON;
        //        if (data.Success) {
        //            SummernoteEditor.TemplatesListCache = data.Data.templateHeaders;
        //            template.list = data.Data.templateHeaders;
        //        }                
        //    }
        //};
        $filed.summernote(
                            {
                                //cleaner:{
                                //    notTime:2400, // Time to display Notifications.
                                //    action: 'button', // both|button|paste 'button' only cleans via toolbar button, 'paste' only clean when pasting content, both does both options.
                                //    newline:'<br>', // Summernote's default is to use '<p><br></p>'
                                //    notStyle:'position:absolute;top:0;left:0;right:0', // Position of Notification
                                //    icon:'<i class="note-icon">[Your Button]</i>',
                                //    keepHtml: false, //Remove all Html formats
                                //    keepClasses: false, //Remove Classes
                                //    badTags: ['style','script','applet','embed','noframes','noscript', 'html'], //Remove full tags with contents
                                //    badAttributes: ['style','start'] //Remove attributes from remaining tags            
                                //},
                                placeholder: placeholder,
                                toolbar: toolbar,
                                height: height,
                                width: width,
                                maxWidth: maxWidth,
                                disableResizeEditor: false,
                                dialogsFade: true,
                                dialogsInBody: true,
                                airMode: airMode,
                                minHeight: minHeight,
                                maxHeight: '100%',
                                resizebar: false,
                                focus: false,
                                fontNames: fontNames,
                                codemirror: {
                                    mode: 'text/html',
                                    htmlMode: true,
                                    lineNumbers: true,
                                    theme: 'cerulean'
                                },
                                callbacks: {
                                    onInit: function () {
                                        //$placeholder.show();
                                    },
                                    onFocus: function () {
                                        //$placeholder.hide();
                                    },
                                    onBlur: function () {
                                        //var $self = $(this);
                                        //setTimeout(function () {
                                        //    if ($self.summernote('isEmpty') && !$self.summernote('codeview.isActivated')) {
                                        //        $placeholder.show();
                                        //    }
                                        //}, 300);                                        
                                    },
                                    onChange: function (contents, $editable) {
                                        var $summernoteContainer = $filed.closest('.summernote');
                                        if ($summernoteContainer != undefined && $summernoteContainer != null) {
                                            if (height == '100%') {
                                                var a = $summernoteContainer.find('.note-toolbar');
                                                if (a.length > 0) {
                                                    $summernoteContainer.find('.note-editing-area').css('padding-bottom', a[0].scrollHeight + 1);                                                    
                                                }
                                            }
                                        }
                                        if (onChangeHandler!=null)
                                            onChangeHandler(contents, $editable);
                                    },                                    
                                    onImageUpload: onImageUploadHandler,
                                    onPaste: function (e) {
                                        if (JsHelper.isIE() || JsHelper.isEDGE()) {//dla IE i EDGE
                                            setTimeout(function () {
                                                var $pastedHtmlElem = $($filed.summernote('code'));
                                                console.log($pastedHtmlElem);
                                                if ($pastedHtmlElem.find('style').length > 0) {
                                                    $pastedHtmlElem.find('style').remove();
                                                    var bufferHTML = '';
                                                    for (var i = 0; i < $pastedHtmlElem.length; i++) {
                                                        if ($($pastedHtmlElem[i]).html() != undefined) {
                                                            console.log($($pastedHtmlElem[i]).html());
                                                            bufferHTML = bufferHTML + $($pastedHtmlElem[i]).html();
                                                        }
                                                    }
                                                    console.log(bufferHTML);
                                                    $filed.summernote('code', bufferHTML);
                                                }
                                            }, 100);
                                        } else {
                                            var appendText = '';
                                            e.preventDefault();
                                            var clipboardData = ((e.originalEvent || e).clipboardData || window.clipboardData);
                                            var bufferText = clipboardData.getData('Text');
                                            var bufferHTML = clipboardData.getData('text/html');
                                            //var bufferRTF = clipboardData.getData('text/rtf');
                                            var $pastedHtmlElem = $(bufferHTML);
                                            if ($pastedHtmlElem.find('style').length > 0) {
                                                $pastedHtmlElem.find('style').remove();
                                                bufferHTML = '';
                                                for (var i = 0; i < $pastedHtmlElem.length; i++) {
                                                    if ($($pastedHtmlElem[i]).html() != undefined) {
                                                        console.log($($pastedHtmlElem[i]).html());
                                                        bufferHTML = bufferHTML + $($pastedHtmlElem[i]).html();
                                                    }
                                                }
                                            }
                                            appendText = bufferHTML;
                                            if (appendText == '') {
                                                appendText = bufferText.replace(/(?:\r\n|\r|\n)/g, '<br />');
                                            }
                                            var a = $("<p>").append(appendText);
                                            setTimeout(function () {
                                                $filed.summernote('editor.pasteHTML', a);
                                            }, 100);
                                        }
                                    }
                                },
                                template: template,
                                icons: {
                                    'align': 'fa fa-align-left',//
                                    'alignCenter': 'fa fa-align-center',//
                                    'alignJustify': 'fa fa-align-justify',//
                                    'alignLeft': 'fa fa-align-left',//
                                    'alignRight': 'fa fa-align-right',//
                                    'indent': 'fa fa-indent',//
                                    'outdent': 'fa fa-outdent',//
                                    'arrowsAlt': 'fa fa-arrows-alt',//
                                    'bold': 'fa fa-bold',//
                                    'caret': 'fa fa-caret-down',//
                                    'circle': 'note-icon-circle',
                                    'close': 'fa fa-times',//
                                    'code': 'fa fa-code',//
                                    'eraser': 'fa fa-eraser',
                                    'font': 'fa fa-font',//
                                    'frame': 'note-icon-frame',
                                    'italic': 'fa fa-italic',//
                                    'link': 'fa fa-link',//
                                    'unlink': 'note-icon-chain-broken',
                                    'magic': 'fa fa-magic',//
                                    'menuCheck': 'fa fa-check',
                                    'minus': 'note-icon-minus',
                                    'orderedlist': 'fa fa-list-ol',//
                                    'pencil': 'fa fa-pencil',//
                                    'picture': 'fa fa-picture-o',//
                                    'question': 'fa fa-question',//
                                    'redo': 'note-icon-redo',
                                    'square': 'note-icon-square',
                                    'strikethrough': 'note-icon-strikethrough',
                                    'subscript': 'note-icon-subscript',
                                    'superscript': 'note-icon-superscript',
                                    'table': 'fa fa-table',//
                                    'textHeight': 'note-icon-text-height',
                                    'trash': 'fa fa-trash',//
                                    'underline': 'fa fa-underline',//
                                    'undo': 'fa fa-undo',//
                                    'unorderedlist': 'fa fa-list',//
                                    'video': 'fa fa-video-camera'//
                                }
                            }
                       );
        //$filed.summernote('fontName', 'monospace');        
        var $summernoteContainer = $filed.closest('.summernote');
        if ($summernoteContainer != undefined && $summernoteContainer != null) {
            if (airMode) {
                $summernoteContainer.addClass('air-mode');
                $summernoteContainer.find('.note-editable').css("min-height", minHeight).css('padding', 5);
            }

            if (height == '100%') {
                var a = $summernoteContainer.find('.note-toolbar');
                $summernoteContainer.find('.note-editing-area').css("height", '100%');
                if (a.length > 0) {
                    $summernoteContainer.find('.note-editing-area').css('padding-bottom', a[0].scrollHeight + 1);
                }
                $summernoteContainer.find('.note-editable').css("height", '100%').css("overflow", 'auto');
                $filed.closest('.grid-stack-item-content').css("overflow", 'hidden');
            }
            if (!resizeBar) {
                $summernoteContainer.find('.note-resizebar').css('display', 'none');
            }
        }
        $filed.trigger('summernote.change');
        //$filed.summernote('focus');
    },
    TemplatesListCache: null
}
