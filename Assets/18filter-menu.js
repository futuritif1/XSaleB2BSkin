; (function ($, window, document, undefined) {
    var pluginName = 'filterMenu',
        defaults = {

        };
    function FilterMenu(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {

        };
        this.init();
    };
    FilterMenu.prototype.init = function () {
        var instance = this;
        instance.$element.on('keyup', 'input[type="text"].dot-format', function (e) {
            var $this = $(e.currentTarget);
            $this.val($this.val().replace(',','.'));
        });
        instance.$element.on('focusout', 'input[type="text"]', function (e) {
            var $this = $(e.currentTarget);
            instance.FilterChanged($this);
        });
        instance.$element.on('change', 'select, input[type="checkbox"], input[type="radio"]', function (e) {
            var $this = $(e.currentTarget);
            instance.FilterChanged($this);
        });
        instance.$element.on('touchspin.on.stopspin', 'input[type="text"]', function (e) {
            var $this = $(e.currentTarget);
            instance.FilterChanged($this);
        });
        instance.$element.on('click', '.clear-filter', function (e) {
            var $this = $(e.currentTarget);
            $this.closest('.filter-item').find('input[type="radio"]').prop('checked', false).first().trigger('change');            
        });
    };

    FilterMenu.prototype.FilterChanged = function ($item) {
        console.log('filter changed');
        var instance = this;        
        //Walidacja
        //jeśli poprawnie
        //serializacja 
        var serializedFilter = instance.SerializeFilter(true);
        instance.UpdateUrl(serializedFilter);
        //aktualizacja linku

        //przeładowanie grida
        $(instance.options.articleGridSel).trigger('reload');
    };
    FilterMenu.prototype.SerializeFilter = function (stringify) {
        var instance = this;
        var $filters = instance.$element.find('.filter-item');
        var result = { Filters: {} };
        for (var i = 0; i < $filters.length; i++) {
            var $item = $($filters[i]);
            var type = $item.data('type');
            var range = $item.data('range');
            var parameterId = $item.data('id');
            var keysNumber = Object.keys(result.Filters).length;
            var stringValue = null;
            var parameterMultiValueIds = [];
            var intValue = null;
            var intValueFrom = null;
            var intValueTo = null;
            var decimalValue = null;
            var decimalValueFrom = null;
            var decimalValueTo = null;
            var dateValue = null;
            var dateValueFrom = null;
            var dateValueTo = null;
            if (type == 1 || type == 8) {
                stringValue = $item.find('input[type="text"]').val();                                
            }
            if (type == 2) {
                if (range==true) {
                    intValueFrom = $item.find('input[type="text"].from').val();
                    intValueTo = $item.find('input[type="text"].to').val();
                } else {
                    intValue = $item.find('input[type="text"].equals').val();
                }                
            }
            if (type == 3) {
                if (range == true) {
                    decimalValueFrom = $item.find('input[type="text"].from').val();
                    decimalValueTo = $item.find('input[type="text"].to').val();
                } else {
                    decimalValue = $item.find('input[type="text"].equals').val();
                }
            }
            if (type == 4 || type == 9) {
                if (range == true) {
                    dateValueFrom = $item.find('input[type="text"].from').val();                    
                    dateValueTo = $item.find('input[type="text"].to').val();                    
                } else {
                    dateValue = $item.find('input[type="text"].equals').val();
                }
            }
            if (type == 5) {
                var $select = $item.find('select');      
                var value = $select.val();
                if (value!=null) {
                    parameterMultiValueIds.push(value);
                }                        
            }            
            if (type == 6) {
                var radios = $item.find('input[type="radio"]');
                for (var j = 0; j < radios.length; j++) {
                    var $radio = $(radios[j]);
                    var checked = $radio.is(':checked');
                    if (checked) {
                        parameterMultiValueIds.push($radio.val());
                    }
                }
            }
            if (type == 7) {
                var checkBoxes = $item.find('input[type="checkbox"]');
                for (var j = 0; j < checkBoxes.length; j++) {
                    var $checkBox = $(checkBoxes[j]);
                    var checked = $checkBox.is(':checked');
                    if (checked) {
                        parameterMultiValueIds.push($checkBox.val());
                    }
                }
            }
            var obj = {
                Pid: parameterId
                //, Type: type, Range: range
            };
            if (type==1) {
                obj.Sv = stringValue;
            }
            if (type == 2) {
                if (range == true) {
                    obj.Ivf = intValueFrom;
                    obj.Ivt = intValueTo;
                } else {
                    obj.Iv = intValue;
                }                
            }
            if (type == 3) {
                if (range == true) {
                    obj.Dvf = decimalValueFrom;
                    obj.Dvt = decimalValueTo;
                } else {
                    obj.Dv = decimalValue;
                }
            }
            if (type == 4 || type == 9) {
                if (range == true) {
                    obj.Dtvf = dateValueFrom;
                    obj.Dtvt = dateValueTo;
                } else {
                    obj.Dtv = dateValue;
                }
            }
            if (type == 5 || type == 6 || type == 7) {
                obj.VIds = parameterMultiValueIds;
            }
            result.Filters[keysNumber] = stringify == true ? JSON.stringify(obj) : obj;
        }
        return result;
    };
    FilterMenu.prototype.UpdateUrl = function (serializedFilter) {
        var instance = this;
        var filterUrl = $.param(serializedFilter);
        //filterUrl = JSON.stringify(serializedFilter);
        var search = window.location.search.includes('?Search=');
        var currentUrl = location.protocol + '//' + location.hostname + ':' + location.port + window.location.pathname;
        if (search) {
            currentUrl = currentUrl + window.location.search;
        }
        //location = (currentUrl +'?'+ filterUrl);
        
        window.history.pushState("", "", currentUrl + (search?'&':'?') + filterUrl);
        console.log(serializedFilter);
        //aktualizacja linku
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
                new FilterMenu(this, options));
            }
        });
    }
})(jQuery, window, document);
