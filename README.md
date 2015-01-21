# jquery-csseval

use expressions to evaluate css on the fly.
You can use this lib for parallax stuff, for example.

### Usage
```html
<script src="jquery.js">
<script src="csseval.js">

<!-- init -->

<script>
$(function() {
    $('.parallax').csseval();
});
</script>

<!-- ...later in your markup: -->

<div class="parallax" data-trigger="scroll" data-css="{ 'margin-left': this.scrollTop() * 0.5 + 'px' }">
Hello World!
</div>

<!--
the above code does this:
each time a scroll event gets triggered data-css gets evaluated and the resulting css gets
set to the element ( with $el.css(...) ).
Notice how we used the expression 'scrollTop() * 0.5' inside there.
-->
```

## License
MIT
