define(['jquery'], function ($) {
    return function (domLocation) {
        $(domLocation).append('<p>Hello AMD!</p>');
    };
});
