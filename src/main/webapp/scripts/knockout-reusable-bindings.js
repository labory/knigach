ko.bindingHandlers.datepicker = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {};
        $(element).datepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "changeDate", function(event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                value(event.date);
            }
        });
    },
    update: function(element, valueAccessor)   {
        var widget = $(element).data("datepicker");
        //when the view model is updated, update the widget
        if (widget) {
            widget.date = ko.utils.unwrapObservable(valueAccessor());

            if (!widget.date) {
                return;
            }

            if (typeof widget.date === 'string') {
                widget.date = new Date(widget.date);
            }

            widget.setValue();
        }
    }
};

ko.bindingHandlers.rating = {
    init:function (element, valueAccessor) {
        $(element).addClass("starRating");
        for (var i = 0; i < 5; i++) {
            $("<span>").appendTo(element);
        }
        $("span", element).each(function (index) {
            $(this).hover(
                function () {$(this).prevAll().add(this).addClass("hoverChosen")},
                function () {$(this).prevAll().add(this).removeClass("hoverChosen")}
            ).click(function () {
                    var observable = valueAccessor();
                    observable(index + 1);
                });
        });
    },
    update: function (element, valueAccessor) {
        var observable = valueAccessor();
        $("span", element).each(function (index) {
            $(this).toggleClass("chosen", index < observable());
        });
    }
};
