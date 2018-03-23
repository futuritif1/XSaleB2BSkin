; (function ($, window, document, undefined) {
    var pluginName = 'cartSummary',
        defaults = {
            finalized:false
        };
    function CartSummary(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {};
        this.init();
    };
    CartSummary.prototype.init = function () {
        var instance = this;
        instance.references.$addressDataForm = $(instance.options.addressDataFormSel);        
        instance.references.$addressDataForm.on('change', 'select', function (e) {
            instance.submitAddressDataForm.apply(instance, [true, true]);
        });
        instance.references.$addressDataForm.on('focusout', 'input[type="text"], textarea[type="text"]', function (e) {
            instance.submitAddressDataForm();
        });                
        instance.$element.on('click', '.finalize-order', function (e) {
            var $this = $(e.currentTarget);
            var id = $this.closest('.cart-details').data('id');            
            if (instance.submitAddressDataForm.apply(instance, [false, false])) {
                if (instance.finalizeOrder()) {
                    instance.options.finalized = true;
                    swal({
                        title: "",
                        text: 'Zamówienie zostało zatwierdzone',
                        timer: 3 * 1000,
                        showConfirmButton: true,
                        type: "success",
                        html: true,                        
                        //showCancelButton: true,
                        //cancelButtonText: 'OK'
                    }, function () {
                        location = '/';
                    });
                    
                }
            }
        });
        window.onbeforeunload = function () {
            if (!instance.submitAddressDataForm.apply(instance, [false, false])) {
                return 'Wprowadzone dane wysyłki mogą nie zostać zapisane. Sprawdź poprawność danych.';
            }
        };
    };
    CartSummary.prototype.finalizeOrder = function () {
        var instance = this;
        var id = instance.$element.data('id');               
        var result = $.ajax({
            type: 'POST',
            url: '/Cart/FinalizeOrder',
            cache: false,
            data: { id: id },
            async: false,
            success: function (data) {
            }
        });
        if (result == null && result.responseJSON == null) 
            return false;
        else 
            return result.responseJSON.Success;                        
    };
    CartSummary.prototype.submitAddressDataForm = function (async, reloadSummary) {
        var instance = this;
        if (instance.options.finalized) {
            return true;
        }
        if (instance.validateAddressDataForm()) {
            var id = instance.$element.data('id');
            var formSerialized = instance.references.$addressDataForm.serialize();
            formSerialized.Id = id;
            var result = $.ajax({
                type: 'POST',
                url: '/Cart/AddressData',
                cache: false,
                data: formSerialized,
                async: async != null ? async : true,
                success: function (data) {
                    if (data.Success) {
                    } else {
                    }
                    if (reloadSummary == true) {
                        instance.references.$cartSummary.trigger('reload');
                    }
                }
            });
            if (async != null && async == false) {
                if (result != null && result.responseJSON != null && result.responseJSON.Success) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        }
        return false;
    };    
    CartSummary.prototype.validateAddressDataForm = function () {
        var instance = this;
        return instance.references.$addressDataForm.valid();
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
                new CartSummary(this, options));
            }
        });
    }
})(jQuery, window, document);
