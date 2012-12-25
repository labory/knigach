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
    self.dateFormatted = ko.computed(function() {
        return moment(self.date()).format('MMMM Do YYYY');
    });
}

function KnigachViewModel() {
    var self = this;

    self.categories = ['All', 'Read', 'Done'];
    self.selectedCategory = ko.observable();
    self.selectedBook = ko.observable();

    self.books = ko.observableArray([
        new Book("Little Women", "Louisa May Alcott", new Date(), "Read", ""),
        new Book("Pride and Prejudice", "Jane Austen", new Date(), "Read", ""),
        new Book("Agnes Grey", "Anne Bronte", new Date(), "Done", ""),
        new Book("Lord Jim", "Joseph Conrad", new Date(), "Done", ""),
        new Book("Robinson Crusoe",	"Daniel Defoe", new Date(), "Done", "")
    ]);

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

    self.selectCategory('All');

    // set up filter routing
    Router({ '/:filter': self.selectedCategory }).init();
}