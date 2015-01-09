// jQuery.cssSelect: a navigable custom dropdown solution.

(function(factory){
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS:
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($){
  "use strict";
  $.fn.cssSelect = function(options) {
    if (this.length === 0) return;

    if (this.length > 1) {
      // build a cssSelect for each matched element:
      return this.each(function(){
        $(this).cssSelect();
      });
    }

    // flag to check if the mouse is in the dropdown ul container
    var mouseInContainer = false;

    // keep a reference to the original <select>:
    var $originalSelect = this;
    // 'hide' it:
    $originalSelect.addClass('hidden');

    var KEYCODES = {
      UP: 38,
      DOWN: 40,
      RETURN: 13
    };

    options = $.extend({
      classRoot: 'select ' + 'name-' + $originalSelect.attr('name'),
      // 'decorator' options need to return a DOM string that jQuery can use.
      liDecorator: function(){ return '';}
    }, options);

    // create a new 'select' that we'll
    // be appending list items to:
    var $cssSelect = $('<div><ul/></div>').addClass(options.classRoot);

    // create a 'selected' item that we display by default
    // and give it little adornments:
    $('<a class="selected" />')
      .attr('data-option-value', $originalSelect.find('option:selected').val())
      .append($('<span/>').addClass('text'))
      .append($('<span/>').addClass('handle'))
    .prependTo($cssSelect);

    // this is triggered when user tried to scroll on the select options
    $originalSelect.on('blur', function(event){
      if (!mouseInContainer) {
        $cssSelect.removeClass('active');
      }

    });

    // when original <select> gets focus via 'tab' key,
    // trigger focus on new 'select':
    $originalSelect.on('focus', function(event){
      $cssSelect.addClass('active');
    });

    // keep new select up to date with original select:
    $originalSelect.on('change', function(event){
      var $selectedOption = $originalSelect.find('option:selected');

      $cssSelect.setValue($selectedOption.val());
    });

    // grab the text of each original <option>
    // and append it to a new <li>.
    // also, add a 'data-option' attribute:
    $originalSelect.children("option").each(function(index, element) {
      // if the item is a placeholder, we _don't_ want to make a corresponding
      // element for it. `return true;` skips to the next element here:
      if (typeof $(element).data('placeholder') !== "undefined") return true;
      var optionText = $(element).text();
      var $li = $('<li/>').html(options.liDecorator.call(this))
        .attr('data-option-value', $(element).val())
        .data('option', index)
        .appendTo($cssSelect.find('ul'));

      // note: the following calls to #find that use tagName are somewhat busted.
      // jQuery should be able to use #find based on a passed-in DOM node or a jQuery object.
      // that functionality isn't working, so instead we match against tagName or className.
      if ($(options.liDecorator.call(this)).length && $li.find($(options.liDecorator.call(this))[0].tagName).length > 0) {
        $li.find($(options.liDecorator.call(this))[0].tagName).text(optionText);
      } else {
        $li.text(optionText);
      }

      $cssSelect.find('li:first').addClass('hover');
    });

    // on click, select a matching element in the original <select>
    // and fire a change event to activate the new selection:
    $cssSelect.on('click', 'li', function(event){
      event.preventDefault();

      $originalSelect[0].selectedIndex = $(this).data('option');
      $originalSelect.trigger('change');
      $cssSelect.removeClass('active');
    });

    $cssSelect.on('click', '.selected', function(event){
      $originalSelect.trigger('focus');
    });

    // on hover, add a special class to the hovered list item.
    // remove that class from all other list items:
    $cssSelect.on('mouseover', 'li', function(event){
      $(this).siblings().removeClass('hover');
      $(this).addClass('hover');
    });

    $cssSelect.on('mouseenter', function(event){
      mouseInContainer = true;
    });

    $cssSelect.on('mouseleave', function(event){
      mouseInContainer = false;
    });

    // users can use up/down to select choices in new select.
    // 'return' key registers whatever is currently selected
    // as the user's choice:
    $(window).on('keydown', function(event){
      var isActive = $cssSelect.hasClass('active');
      if (!isActive && !$originalSelect.is(':focus')) return;
      if (event.keyCode !== KEYCODES.UP && event.keyCode !== KEYCODES.DOWN && event.keyCode !== KEYCODES.RETURN) return;

      // If it's not already open, open it
      // This happens if you select something, and then press up/down.
      // Without this, the REAL (original) select box will open up,
      // since it still has focus.
      if (!isActive) $cssSelect.addClass('active');

      event.preventDefault();

      var $currentSelection = $cssSelect.find('li.hover');

      if (event.keyCode === KEYCODES.UP) {
        $currentSelection.prev().trigger('mouseover');
      }

      if (event.keyCode === KEYCODES.DOWN) {
        $currentSelection.next().trigger('mouseover');
      }

      if (event.keyCode === KEYCODES.RETURN) {
        $currentSelection.trigger('click');
      }
    });

    //detect of the user clicks outside the dropdown list
    $(window).on('mousedown', function(event){
      var isActive = $cssSelect.hasClass('active');
      if (!isActive && !$originalSelect.is(':focus')) return;

      if (!mouseInContainer) {
        $cssSelect.removeClass('active');
      }
    });

    if($originalSelect.find('option:selected').is('[data-placeholder]')) {
      $cssSelect.addClass('placeholder');
    }

    $cssSelect.setValue = function(val) {
      var $selectedOption = $originalSelect.find('[value="' + val + '"]');

      if(!$selectedOption.is('[data-placeholder]')) {
        $cssSelect.removeClass('placeholder');
      }

      $cssSelect.find('a.selected').attr('data-option-value', $selectedOption.val());

      // remove 'selected' class from all <li>:
      $cssSelect.find('li').removeClass('selected');

      $cssSelect.find('.text').text($selectedOption.text());
      $cssSelect.find('ul li')
        .filter('[data-option-value="' + $selectedOption.val() + '"]')
          .addClass('selected');
    };

    $cssSelect.find('.text').text($originalSelect.find('option:selected').text());
    $cssSelect.insertBefore($originalSelect);

    $cssSelect.originalSelect = $originalSelect;
    return $cssSelect;
  };

  return function(querySelector, options) {
    return $.fn.cssSelect.call($(querySelector), options);
  };
}));
