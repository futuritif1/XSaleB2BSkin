; (function ($, window, document, undefined) {
    var pluginName = 'categoryMenu',
        defaults = {
            
        };
    function CategoryMenu(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {
            
        };
        this.init();
    };
    CategoryMenu.prototype.init = function () {        
        var instance = this;
        var $categoryTree = instance.$element.find('.category-tree');
        $categoryTree.nestable({
            group: 1,
            handleClass:'no-hendle'
        });        
        $('.dd').nestable('collapseAll');
        //console.log($categoryTree.nestable('serialize'));
        instance.$element.on('click', '.dd-handle', function (e) {
            instance.$element.find('.dd-handle').removeClass('selected');
            var $this = $(e.currentTarget);
            $this.addClass('selected');
            var selectedId = $this.closest('.dd-item').data('id');
            var selecetdName = $this.closest('.dd-item').data('urlname');
            //console.log(encodeURI(selecetdName));
            location = '/Towary/' + JsHelper.string.encodeSpecialCharactersMVCUrl(selecetdName) + '/' + selectedId;
        });
        instance.$element.on('click', '.dd-item button[data-action="expand"]', function (e) {
            var $this = $(e.currentTarget);
            var $item = $this.closest('.dd-item');
            var categoryId = $item.data('id');
            instance.loadLevel($item, categoryId);
        });       
        if (instance.options.categoryBranchIds != null && instance.options.categoryBranchIds.length>0) {
            instance.expandItemsBranch.apply(instance, [instance.options.categoryBranchIds]);
        }
        //instance.$element.mouseover( function (e) {
        //    var $this = $(e.currentTarget);
        //    if ($this.hasClass('dd-handle') && $this.hasClass('main-category')) {
        //        console.log('onmouseover');
        //    }            
        //});
    };
    //CategoryMenu.prototype.expandItemsBranch = function ($item, categoryId) {
    //    var itemsToExpand = [];
    //    itemsToExpand.push($item);
    //    while (true) {
    //        $item.parent('li ')
    //    }
    //}
    CategoryMenu.prototype.expandItemsBranch = function (categoryIds) {
        var instance = this;
        var categoryId = categoryIds.shift();
        if (categoryId != null) {
            var $selectedLi = instance.$element.find('li.dd-item[data-id=' + categoryId + ']');
            if ($selectedLi.length>0) {
                $.ajax({
                    type: 'POST',
                    url: '/Category/GetCategories',
                    cache: false,
                    data: {
                        parentId: categoryId
                    },
                    success: function (data) {
                        if (data.Success) {
                            $selectedLi.find('.dd-list').html(data.Data.html);
                            $selectedLi.removeClass('dd-collapsed');
                            $selectedLi.children('[data-action="expand"]').hide();
                            $selectedLi.children('[data-action="collapse"]').show();
                            $selectedLi.children('ol').show();
                            if (categoryIds.length==0) {
                                $selectedLi.find('.dd-handle').first().addClass('selected');
                            }
                            instance.expandItemsBranch(categoryIds);
                        } else {
                            instance.references.stopLoading = true;
                            //Error message
                        }
                    }
                });
            }
        }
    }
    CategoryMenu.prototype.loadLevel = function ($item, categoryId) {

        $.ajax({
            type: 'POST',
            url: '/Category/GetCategories',
            cache: false,
            data: {
                parentId: categoryId
            },
            success: function (data) {
                if (data.Success) {
                    $item.find('.dd-list').html(data.Data.html);
                } else {
                    instance.references.stopLoading = true;
                    //Error message
                }
            }
        });
    };
    $.fn[pluginName] = function (options) {
        if (this.length == 1) {
            var pluginData = this.data('plugin_' + pluginName);
            if (pluginData)
                return pluginData;
        }
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new CategoryMenu(this, options));
            }
        });
    }
})(jQuery, window, document);

MenuColumn = {
    mouseEnter: function (t) {
        var $this = $(t);
        $this.closest('.category-filter-column').addClass('category-list-expanded');
    },
    mouseLeave: function (t) {
        var $this = $(t);
        $this.closest('.category-filter-column').removeClass('category-list-expanded');
    },
}
