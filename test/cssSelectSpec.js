define(['../jquery', '../dist/jquery.cssSelect'],function($, cssSelect){
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

      it("retains data attributes on original select", function() {
        var val = $('.select').filter('.name-' + selectName).find('a.selected').attr('data-option-value');
        expect(val).to.equal($originalSelect.find('option:selected').val());
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
          $('.select ul li').eq(2).trigger('click');
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
        $('.select ul li').eq(2).trigger('click');
        expect($('.select .text').text()).to.equal('third');
      });

      it("updates content of [data-option-value] attribute", function(){
        $('.select ul li').eq(1).trigger('click');
        expect($('.select a.selected').attr('data-option-value')).to.equal($originalSelect.find('option').eq(1).val());
      });

      it("handles <option> elements with complex-ish values", function(){
        $('.select ul li').filter(function(index){
          return $(this).text().match(/\//) !== null;
        }).first().trigger('click');
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

    describe("additional elements", function() {
      var $additionalElSelect, selectOptions;

      before(function(){
        $additionalElSelect = $('<select class="decorate-me-add-items" />')
          .attr('name', 'decoratable-with-items');

        selectOptions = ['first', 'second', 'third'];

        $.each(selectOptions, function(index, element){
          $additionalElSelect.append($('<option/>').text(element));
        });

        $additionalElCSSSelect = $additionalElSelect.cssSelect({
          additionalItems: [
            {
              label: 'hello',
              value: 'itemValue'
            }
          ]
        });
      });

      it("can add additional arbitrary list items", function() {
        expect($additionalElCSSSelect.find('li').length).to.equal(4);
        expect($additionalElCSSSelect.find('[data-option-value="itemValue"]')
          .text()).to.equal('hello');
      });
    });

    afterEach(function(){
      $originalSelect.remove();
      $('.select').remove();
      $('.otherSelect').remove();
    });
  });

  describe("CSS Select Standalone API", function(){
    var $select, selectOptions;
    before(function(){
      $select = $('<select class="standalone-api" />').attr('name', 'standalone-api');
      selectOptions = ['fourth', 'fifth', 'sixth', 'complex/value'];

      $.each(selectOptions, function(index, element){
        $select.append($('<option/>').text(element).val(element));
      });

      $('body').append($select);
    });

    after(function(){
      $('body').remove('select.standalone-api');
    });

    it("has a standalone api that doesn't require jQuery (`$`) to be available in the scope", function(){
      var wrappedCssSelectNode = cssSelect('.standalone-api');
      expect(wrappedCssSelectNode.hasClass('select')).to.equal(true);
    });

    it("can take a DOM node as the first argument (an alternative to a query selector)", function(){
      var $select = $('<select class="standalone-api-with-node" />').attr('name', 'standalone-api-with-node');
      var selectOptions = ['fourth', 'fifth', 'sixth', 'complex/value'];

      $.each(selectOptions, function(index, element){
        $select.append($('<option/>').text(element).val(element));
      });

      var wrappedCssSelectNode = cssSelect($select[0]);

      expect(wrappedCssSelectNode.hasClass('name-standalone-api-with-node')).to.equal(true);
    });

    it("accepts optional params (e.g. for 'decoration')", function(){
      var $decoratableSelect = $('<select class="decorate-me-again" />').attr('name', 'decoratable');
      var selectOptions = ['first', 'second', 'third'];

      $.each(selectOptions, function(index, element){
        $decoratableSelect.append($('<option/>').text(element));
      });

      $('body').append($decoratableSelect);

      var $decoratedCSSSelect = cssSelect('select.decorate-me-again', {
        liDecorator: function(){
          return '<a href="#" data-test="hello world">this text will be replaced.</a>';
        }
      });

      expect($decoratedCSSSelect.find('ul a').data('test')).to.equal("hello world");

      $('body').remove('select.decorate-me-again');
    });
  });
});
