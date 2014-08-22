define(['../jquery', '../jquery.cssSelect'],function($){
  describe("CSS Select Plugin", function(){
    // Sample DOM region:
    // <!-- output: -->
    // <div class="select">
    //    <a class="selected">
    //      <span class="text">Placeholder Option</span>
    //      <span class="handle"></span>
    //   </a>
    //   <ul>
    //     <li>Option 1</li>
    //     <li>Option 2</li>
    //     <li>Option 3</li>
    //     <li>Option 4</li>
    //   </ul>
    // </div>
    // <!-- original markup: -->
    // <select id="category" name="category" class="hidden">
    //   <option data-placeholder>Please Select From The Following Options:</option>
    //   <option value="1">Option 1</option>
    //   <option value="2">Option 2</option>
    //   <option value="3">Option 3</option>
    //   <option value="4">Option 4</option>
    // </select>

    var $originalSelect, selectOptions;
    var selectName = "selectName";

    beforeEach(function(){
      $originalSelect = $('<select class="original" />').attr('name', selectName);
      selectOptions = ['first', 'second', 'third', 'complex/value'];
      $.each(selectOptions, function(index, element){
        $originalSelect.append($('<option/>').text(element).val(element));
      });

      $('body').append($originalSelect, $('<select class="otherSelect" />'));
      $('select').cssSelect();
    });

    describe("initialize", function () {
      it("'hides' <select> element that it is attached to", function(){
        expect($('select.original').hasClass('hidden')).to.be.true;
      });

      it("creates an instance of cssSelect for _each_ select found by the jQuery selector", function(){
        expect($('.select').length).to.equal(2);
      });

      it("adopts a `className` similar to the original element's `name`", function(){
        expect($('.select').filter('.name-' + selectName).hasClass('name-' + selectName));
      });

      it("appends new unordered list that replicates select options", function(){
        expect($('.select').filter('.name-' + selectName).find('ul').length).to.equal(1);
        expect($('.select').filter('.name-' + selectName).find('ul li').length).to.equal(selectOptions.length);
        expect($('.select').filter('.name-' + selectName).find('ul li').eq(1).text()).to.equal('second');
      });
    });

    describe("tabbing out of the select", function(){
      beforeEach(function(){
        $originalSelect.trigger('blur');
      });

      it("hides the options", function(){
        expect($('.select').hasClass('active')).to.be.false;
      });
    });

    describe("clicking on the select", function(){
      beforeEach(function(){
        $('.select .selected').trigger('click');
      });

      it("shows the options", function(){
        expect($('.select').hasClass('active')).to.be.true;
      });

      it("adds a special (hover) class to the first list item", function(){
        expect($('.select ul li').eq(0).hasClass('hover')).to.be.true;
      });
    });

    describe("tabbing into the select", function(){
      beforeEach(function(){
        $originalSelect.trigger('focus');
      });

      it("shows the options", function(){
        expect($('.select').hasClass('active')).to.be.true;
      });

      it("adds a special (hover) class to the first list item", function(){
        expect($('.select ul li').eq(0).hasClass('hover')).to.be.true;
      });

      describe("tabbing out of the select", function(){
        beforeEach(function(){
          $originalSelect.trigger('blur');
        });

        it("hides the options", function(){
          expect($('.select').hasClass('active')).to.be.false;
        });
      });

      describe("when a new option is selected through the unordered list", function(){
        beforeEach(function () {
          $('.select ul li').eq(2).trigger('mousedown');
        });
        it("fires select event on appropriate old option", function(){
          expect($('select.original option:selected').index()).to.equal(2);
        });
      });

      describe("using the keyboard", function(){
        describe("when I press the down key", function(){
          beforeEach(function () {
            $(window).trigger(jQuery.Event('keydown', {keyCode: 40}));
          });

          it("highlights the second option", function(){
            expect($('.select ul li').eq(1).hasClass('hover')).to.be.true;
          });

          describe("then I press the up key", function(){
            beforeEach(function () {
              $(window).trigger(jQuery.Event('keydown', {keyCode: 38}));
            });

            it("highlights the first option", function(){
              expect($('.select ul li').eq(0).hasClass('hover')).to.be.true;
            });
          });

          describe("then I press enter", function(){
            beforeEach(function () {
              $(window).trigger(jQuery.Event('keydown', {keyCode: 13}));
            });

            it("selects the option", function(){
              expect($originalSelect[0].selectedIndex).to.equal(1);
            });

            it("shows the newly selected option in the collapsed box", function(){
              expect($('.select .text').text()).to.equal($('select.original option:selected').text());
            });

            it("gives the cssSelect option a 'selected' className", function(){
              expect($('.select ul li.selected').length).to.equal(1);
            });
          });
        });
      });

      describe("when you hover over the second list item", function(){
        beforeEach(function () {
          $('.select ul li').eq(1).trigger('mouseover');
        });

        it("adds a special class to the list item", function(){
          expect($('.select ul li').eq(1).hasClass('hover')).to.be.true;
        });

        describe("then hover over the first list item", function(){
          beforeEach(function(){
            $('.select ul li').eq(0).trigger('mouseover');
          });

          it("removes the special class from the second list item", function(){
            expect($('.select ul li').eq(1).hasClass('hover')).to.be.false;
          });

          it("adds a special class to the first list item", function(){
            expect($('.select ul li').eq(0).hasClass('hover')).to.be.true;
          });
        });
      });

      it("populates an element with some text that corresponds to the selected <option>", function(){
        $('.select ul li').eq(2).trigger('mousedown');
        expect($('.select .text').text()).to.equal('third');
      });

      it("handles <option> elements with complex-ish values", function(){
        $('.select ul li').filter(function(index){
          return $(this).text().match(/\//) !== null;
        }).first().trigger('mousedown');
      });
    });

    describe("decoration", function(){
      var $decoratedSelect, $decoratedCSSSelect, selectOptions;

      before(function(){
        $decoratedSelect = $('<select class="decorate-me" />').attr('name', 'decoratable');
        selectOptions = ['first', 'second', 'third'];

        $.each(selectOptions, function(index, element){
          $decoratedSelect.append($('<option/>').text(element));
        });

        $decoratedCSSSelect = $decoratedSelect.cssSelect({
          liDecorator: function(){
            return '<a href="#" data-test="hello world">this text will be replaced.</a>';
          }
        });
      });

      it("can decorate list items with markup", function(){
        expect($decoratedCSSSelect.find('ul a').length > 0 ).to.equal(true);
        expect($decoratedCSSSelect.find('ul a').attr('href')).to.equal("#");
        expect($decoratedCSSSelect.find('ul a').data('test')).to.equal("hello world");
      });
    });

    afterEach(function(){
      $originalSelect.remove();
      $('.select').remove();
      $('.otherSelect').remove();
    });
  });
});
