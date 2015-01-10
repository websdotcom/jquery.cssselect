[![Build Status](https://travis-ci.org/websdotcom/jquery.cssselect.svg?branch=master)](https://travis-ci.org/websdotcom/jquery.cssselect)

cssSelect
=========

Keyboard-aware custom `<select>` dropdown boxes without inline styles. UMD-compatible – for your `<script>` tag with jQuery on the page, AMD module loader, or CommonJS.

Keep your dropdown styling in the stylesheet(s).

Introduction
============

cssSelect takes an existing `<select>` as its argument and generates the following markup by default:

```html
<div class="select name-{original-select-name}">
  <a class="selected" data-option-value="{selected option value}">
    <span class="text">{selected option text}</span>
    <span class="handle"></span>
  </a>
  <ul>
    <li data-option-value="{original first option value}">{original first option text}</li>
    <li data-option-value="{original second option value}" class="selected">{original second option text}</li>
    <li data-option-value="{original third option value}">{original third option text}</li>
  </ul>
</div>

```

The example above shows the second of three options being selected,
hence the class `selected` on the second item in the list.

This markup is placed adjacent to the original `<select>` in the DOM tree.
The original `<select>` is also given the class `hidden`.

It's probably ideal to place the select off-screen at this point with some CSS, e.g.:

```css
.hidden {
  text-indent: -999em;
}
```

You'll also want to style the new `.select` on the page - cssSelect's philosophy
is that it should not add any inline-styling to elements on the page.
all of that stuff should stay in stylesheet(s) so that it's easy to modify and override.

Usage
=====

cssSelect can be used as a jQuery plugin:

```js
$('select#customizable-select').cssSelect();
```

If you're using some kind of module-loader, it is also exposed as a standalone function:

```js
var cssSelect = require('jquery.cssselect');
cssSelect('select#customizable-select');
```

CommonJS-style module loader pictured above, but the same should work for an AMD-style loader.

Using a module loader allows you to hide the jQuery dependency, so your module
that depends on `cssSelect` will be able to operate without declaring `jquery`
as a dependency in that module.


Contributing
============

Write issues/submit pull requests. I'm very interested in issues that people may have
and making this as good as it can possibly be.

If you're submitting pull requests, make sure you run/update/add tests: `npm test`

`npm install` beforehand to get the project's development dependencies.
