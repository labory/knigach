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

function Book(title, author, date, state, note) {
    var self = this;
    self.title = ko.observable(title);
    self.author = ko.observable(author);
    self.date = ko.observable(date);
    self.state = ko.observable(state);
    self.note = ko.observable(note);
    self.date.formatted = ko.computed(function() {
        return moment(self.date()).format('MMMM Do YYYY');
    });
}

function KnigachViewModel(code) {
    var self = this;

    self.categories = ['All', 'Read', 'Done'];
    self.selectedCategory = ko.observable('All');
    self.selectedBook = ko.observable();
    self.code = ko.observable(code);
    self.books = ko.observableArray([]);

    if (self.code()) {
        $.getJSON("/books/" + self.code(), function (data) {
            self.books($.map(data, function(book) { return new Book(book.title, book.author, book.date, book.state, book.note);}));
        });
    }

    self.filteredBooks = ko.computed(function() {
        if (self.selectedBook() != null) {
            return [];
        }
        switch( self.selectedCategory() ) {
            case 'Done':
                return self.books().filter(function(book) {
                    return book.state() == 'Done';
                });
            case 'Read':
                return self.books().filter(function(book) {
                    return book.state() == 'Read';
                });
            default:
                return self.books();
        }
    });

    self.addBook = function() {
        var book = new Book("", "", new Date(), "Read", "");
        self.books.push(book);
        self.selectBook(book);
    };

    self.save = function() {
        console.log("save");
        $.ajax({
            type: 'POST',
            url: '/save' + (self.code() ? '/' + self.code() : ''),
            contentType: 'application/json; charset=utf-8',
            data: ko.toJSON(self.books()),
            success: function(data) {
                if (!self.code()) {
                    self.code(data);
                    var parts = window.location.href.split('#');
                    window.location = parts[0] + self.code() + '#' + parts[1];
                }
            },
            dataType: 'text'
        });
    };

    self.removeBook = function(book) {
        self.books.remove(book);
    };

    self.selectBook = function selectBook(book) {
        self.selectedBook(book);
    };

    self.selectCategory = function(category) {
        location.hash = '/' + category;
        self.selectBook(null);
        self.selectedCategory(category);
    };

    // set up filter routing
    Router({ '/:filter': self.selectedCategory }).init();
}