var when = function (event, conditioncallback, truecallback, checkparents, falsecallback) {
    this.addEventListener(event, function (e) {
        var p = [];
        p.push(e.target);
        if (checkparents) {
            while (p[p.length - 1].parentElement) {
                p.push(p[p.length - 1].parentElement)
            }
        }
        if ((!(p.some(function (f) {
            if (conditioncallback.call(f)) {
                truecallback.bind(f, e).call();
                return true
            } else {
                return false
            }
        }))) && falsecallback) {
            falsecallback()
        }
    })
};
var dragging, offset;
var dragables = document.getElementsByClassName('drop');
[].slice.call(dragables).reverse().forEach(function (e) {
    var b = getComputedStyle(e);
    console.log(b);
    e.style.top = b.top;
    e.style.left = b.left
});
var pm = [0, 0];

when('mousedown',

function () {
    event.preventDefault();
    return this.classList.contains('drop')
},

function (e) {
    var order = [].slice.call(dragables).sort(function (a, b) {
        return parseInt(getComputedStyle(b)['z-index']) - parseInt(getComputedStyle(a)['z-index'])
    });
    order.unshift(this);
    order = order.reverse();
    order.forEach(function (a, i) {
        if (!a.style) a.style;
        a.style['z-index'] = i
    });
    this.style.position = 'relative';
    dragging = this;
    var b = getComputedStyle(this);
    pm = [e.pageX, e.pageY];
    offset = [e.pageX - (parseInt(b.left) || 0), e.pageY - (parseInt(b.top) || 0)];
    e.preventDefault()
}, true);

when('mousemove',

function () {
    return dragging
},

function (e) {
    var dy = e.pageY - pm[1];
    var before = dragging.getBoundingClientRect();
    var ev = [e.pageX, e.pageY];
    if (dy > 0) {
        ev[1] = (before.bottom)
    }
    if (dy < -0) {
        ev[1] = (before.top - 1)
    }
    var ex = document.elementFromPoint(ev[0], ev[1]);
    if (ex && dragging !== ex) {
        if (dragging.parentElement === ex.parentElement) {
            ex.parentElement.insertBefore(dragging, ex);
            if (dy > 0) {
                ex.parentElement.insertBefore(ex, dragging)
            }
            var after = dragging.getBoundingClientRect();
            offset[1] += after.top - before.top
        }
    }
    if (dy) {
        pm = [e.pageX, e.pageY];
        dragging.style.top = e.pageY - offset[1] + 'px';
        dragging.style.left = e.pageX - offset[0] + 'px'
    }
    e.preventDefault()
});

when('mouseup',

function () {
    return dragging
},

function (e) {
    dragging.style.top = 0 + 'px';
    dragging.style.left = 0 + 'px';
    e.preventDefault();
    dragging.style.position = '';
    dragging = false;
    offset = []
});
