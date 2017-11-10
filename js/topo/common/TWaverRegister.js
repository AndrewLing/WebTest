/*********************** 节点类型定义 ****************************/

HtmlBasicAttachment = function (elementUI, showInAttachmentDiv) {
    twaver.network.BasicAttachment.superClass.constructor.call(this, elementUI, showInAttachmentDiv);
    this._roundRect = {x: 0, y: 0, width: 0, height: 0};
    this._contentRect = {x: 0, y: 0, width: 0, height: 0};
    this._triangleDiv = twaver.Util.createDiv();
    this._roundDiv = twaver.Util.createDiv();
    this._contentDiv = twaver.Util.createDiv();

    twaver.Util.setCSSStyle(this._triangleDiv, "border-style", "solid");
    twaver.Util.setCSSStyle(this._contentDiv, "white-space", "nowrap");

    var self = this;

    function toRotatedPoint(x, y, ox, oy, lx, ly, ispositive) {
        if (!ox) {
            ox = this._origin.x;
        }
        if (!oy) {
            oy = this._origin.y;
        }
        if (!lx) {
            lx = this._location.x;
        }
        if (!ly) {
            ly = this._location.y;
        }
        x = x - ox - lx;
        y = y - oy - ly;
        var point = twaver.Util.transformPoint({
            x: ox + lx,
            y: oy + ly
        }, (ispositive ? this._radian : -this._radian), x, y).point;
        return point;
    }

    this.hit = function (x, y) {
        if (this._radian && this._origin) {
            var point = toRotatedPoint.call(self, x, y);
            x = point.x, y = point.y;
        }
        return twaver.Util.containsPoint(this._roundRect, x, y) || twaver.Util.containsPoint(this._pointerRect, x, y);
    };
    this.intersects = function (rect) {
        var a = {x: rect.x, y: rect.y}, b = {x: rect.x + rect.width, y: rect.y}, c = {
            x: rect.x,
            y: rect.y + rect.height
        }, d = {x: rect.x + rect.width, y: rect.y + rect.height};
        if (this._radian && this._origin) {
            if (rect.width * rect.height > 50) return false;
            a = toRotatedPoint.call(self, a.x, a.y);
            b = toRotatedPoint.call(self, b.x, b.y);
            c = toRotatedPoint.call(self, c.x, c.y);
            d = toRotatedPoint.call(self, d.x, d.y);
        }
        rect = twaver.Util.getRect([a, b, c, d]);
        return twaver.Util.intersects(this._roundRect, rect) || twaver.Util.intersects(this._pointerRect, rect);
    };
    this.getContentWidth = function () {
        return this._contentDiv.scrollWidth || parseInt(twaver.Util.getCSSStyle(this._contentDiv.firstChild, "width"));
    };
    this.getContentHeight = function () {
        return this._contentDiv.scrollHeight || parseInt(twaver.Util.getCSSStyle(this._contentDiv.firstChild, "height"));
    };

    this._view.appendChild(this._roundDiv);
    this._roundDiv.appendChild(this._contentDiv);
};
twaver.Util.ext(HtmlBasicAttachment, twaver.network.BasicAttachment, {
    calculateMeasure: function () {
        var contentWidth = this.getContentWidth();
        var contentHeight = this.getContentHeight();
        var cornerRadius = Math.min(this.getCornerRadius(), contentHeight / 2);
        var pointerLength = this.getPointerLength();
        var pointerWidth = this.getPointerWidth();
        var position = this.getPosition();
        var xOffset = this.getXOffset();
        var yOffset = this.getYOffset();

        this._contentRect.width = contentWidth;
        this._contentRect.height = contentHeight;
        this._contentRect.x = cornerRadius;

        var roundRect = this._roundRect;
        roundRect.width = contentWidth + cornerRadius * 2;
        roundRect.height = contentHeight;
        var location;

        if (pointerLength > 0) {
            var direction = this.getDirection();
            location = this._network.getPosition(position, this._ui, null, xOffset, yOffset);
            var endPoint;
            if (direction === 'aboveleft') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - (roundRect.width - cornerRadius);

                this._pointers = [location,
                    {x: location.x, y: location.y - pointerLength},
                    {x: location.x - Math.min(pointerWidth, contentWidth), y: location.y - pointerLength}];

                var hBorderWidth = pointerLength / 2;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = fillColor + " " + fillColor + " transparent transparent";
                this._triangleDivLocation = this._pointers[2];
            }
            else if (direction === 'aboveright') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - cornerRadius;

                this._pointers = [location,
                    {x: location.x, y: location.y - pointerLength},
                    {x: location.x + Math.min(pointerWidth, contentWidth), y: location.y - pointerLength}];

                var hBorderWidth = pointerLength / 2;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = fillColor + " transparent transparent " + fillColor;
                this._triangleDivLocation = this._pointers[1];
            }
            else if (direction === 'belowleft') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - (roundRect.width - cornerRadius);

                this._pointers = [location,
                    {x: location.x, y: location.y + pointerLength},
                    {x: location.x - Math.min(pointerWidth, contentWidth), y: location.y + pointerLength}];

                var hBorderWidth = pointerLength / 2;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = " transparent " + fillColor + " " + fillColor + " transparent";
                this._triangleDivLocation = {x: this._pointers[2].x, y: location.y}
            }
            else if (direction === 'belowright') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - cornerRadius;

                this._pointers = [location,
                    {x: location.x, y: location.y + pointerLength},
                    {x: location.x + Math.min(pointerWidth, contentWidth), y: location.y + pointerLength}];

                var hBorderWidth = pointerLength / 2;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = "transparent transparent " + fillColor + " " + fillColor;
                this._triangleDivLocation = this._pointers[0];
            }
            else if (direction === 'above') {
                roundRect.y = location.y - pointerLength - roundRect.height;
                roundRect.x = location.x - roundRect.width / 2;

                this._pointers = [location,
                    {x: location.x - Math.min(pointerWidth, contentWidth) / 2, y: location.y - pointerLength},
                    {x: location.x + Math.min(pointerWidth, contentWidth) / 2, y: location.y - pointerLength}];

                var hBorderWidth = pointerLength;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + "0px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = fillColor + " transparent transparent transparent";
                this._triangleDivLocation = this._pointers[1];
            }
            else if (direction === 'below') {
                roundRect.y = location.y + pointerLength;
                roundRect.x = location.x - roundRect.width / 2;

                this._pointers = [location,
                    {x: location.x - Math.min(pointerWidth, contentWidth) / 2, y: location.y + pointerLength},
                    {x: location.x + Math.min(pointerWidth, contentWidth) / 2, y: location.y + pointerLength}];

                var hBorderWidth = pointerLength;
                var vBorderWidth = Math.min(pointerWidth, contentWidth) / 2;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = "0px " + vBorderWidth + "px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = "transparent transparent " + fillColor + " transparent ";
                this._triangleDivLocation = {x: this._pointers[1].x, y: location.y};
            }
            else if (direction === 'left') {
                roundRect.y = location.y - roundRect.height / 2;
                roundRect.x = location.x - roundRect.width - pointerLength;

                this._pointers = [location,
                    {x: location.x - pointerLength, y: location.y - Math.min(pointerWidth, contentHeight) / 2},
                    {x: location.x - pointerLength, y: location.y + Math.min(pointerWidth, contentHeight) / 2}];

                var hBorderWidth = Math.min(pointerWidth, contentHeight) / 2;
                var vBorderWidth = pointerLength;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px 0px " + hBorderWidth + "px " + vBorderWidth + "px";
                this._triangleBorderColorStyle = "transparent transparent  transparent " + fillColor;
                this._triangleDivLocation = this._pointers[1];
            }
            else if (direction === 'right') {
                roundRect.y = location.y - roundRect.height / 2;
                roundRect.x = location.x + pointerLength;

                this._pointers = [location,
                    {x: location.x + pointerLength, y: location.y - Math.min(pointerWidth, contentHeight) / 2},
                    {x: location.x + pointerLength, y: location.y + Math.min(pointerWidth, contentHeight) / 2}];

                var hBorderWidth = Math.min(pointerWidth, contentHeight) / 2;
                var vBorderWidth = pointerLength;
                var fillColor = this.getFillColor();
                this._triangleBorderWidthStyle = hBorderWidth + "px " + vBorderWidth + "px " + hBorderWidth + "px " + "0px";
                this._triangleBorderColorStyle = "transparent " + fillColor + " transparent  transparent ";
                this._triangleDivLocation = {x: location.x, y: this._pointers[1].y};
            }
            else {
                throw "Can not resolve '" + direction + "' attachment direction";
            }
        }
        else {
            location = this._network.getPosition(position, this._ui, {
                width: roundRect.width,
                height: roundRect.height
            }, xOffset, yOffset);
            roundRect.x = location.x;
            roundRect.y = location.y;
            this._pointers = null;
        }
        this._location = location;
    },
    updateMeasure: function () {
        this.calculateMeasure();

        if (this._ui.isShadowable() && this.isShadowable()) {
            twaver.Util.setCSSStyle(this._roundDiv, "text-shadow", this._ui._shadowXOffset + "px " + this._ui._shadowYOffset + "px " + this._ui._shadowBlur + "px " + this._ui._shadowColor);
        } else {
            twaver.Util.removeCSSStyle(this._roundDiv, "text-shadow");
        }

        this._pointerRect = twaver.Util.getRect(this._pointers);
        this._viewRect = twaver.Util.unionRect(this._pointerRect, this._roundRect);

        twaver.Util.setCSSStyle(this._contentDiv, "left", this._contentRect.x + "px");
        twaver.Util.setCSSStyle(this._contentDiv, "top", this._contentRect.y + "px");


        twaver.Util.setCSSStyle(this._roundDiv, "left", this._roundRect.x + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "top", this._roundRect.y + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "width", this._roundRect.width + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "height", this._roundRect.height + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "background", this.isFill() ? this.getFillColor() : null);


        twaver.Util.setCSSStyle(this._roundDiv, "-webkit-border-radius", this.getCornerRadius() + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "-moz-border-radius", this.getCornerRadius() + "px");
        twaver.Util.setCSSStyle(this._roundDiv, "border-radius", this.getCornerRadius() + "px");

        if (this._pointers) {
            twaver.Util.setCSSStyle(this._triangleDiv, "left", this._triangleDivLocation.x + "px");
            twaver.Util.setCSSStyle(this._triangleDiv, "top", this._triangleDivLocation.y + "px");
            twaver.Util.setCSSStyle(this._triangleDiv, "border-width", this._triangleBorderWidthStyle);
            twaver.Util.setCSSStyle(this._triangleDiv, "border-color", this._triangleBorderColorStyle);

            this._view.appendChild(this._triangleDiv);
        } else {
            if (this._triangleDiv.parentNode == this._view)
                this._view.removeChild(this._triangleDiv);
        }

        if (this._element.getStyle('label.rotatable') && this.label) {
            var fromLocation = this._ui.getFromPoint();
            var toLocation = this._ui.getToPoint();

            var points = this._ui.getLinkPoints();
            if (points.size() % 2 == 0) {
                fromLocation = points.get(points.size() / 2 - 1);
                toLocation = points.get(points.size() / 2);
            }

            if (fromLocation.x > toLocation.x) {
                this._radian = twaver.Util.getRadiansBetweenLines(toLocation, fromLocation);
            } else {
                this._radian = twaver.Util.getRadiansBetweenLines(fromLocation, toLocation);
            }
            this._origin = {x: this._contentRect.width / 2, y: 0};


            var deg = "rotate(" + (twaver.Util.toDegrees(this._radian)) + "deg)";
            var origin = this._origin.x + "px " + this._origin.y + "px";
            if (twaver.Util.isChrome || twaver.Util.isSafari) {
                twaver.Util.setCSSStyle(this._roundDiv, "-webkit-transform", deg);
                twaver.Util.setCSSStyle(this._roundDiv, "-webkit-transform-origin", origin);
            } else if (twaver.Util.isIE) {
                twaver.Util.setCSSStyle(this._roundDiv, "-ms-transform", deg);
                twaver.Util.setCSSStyle(this._roundDiv, "-ms-transform-origin", origin);
            } else {
                twaver.Util.setCSSStyle(this._roundDiv, "transform", deg);
                twaver.Util.setCSSStyle(this._roundDiv, "transform-origin", origin);
            }
        } else {
            twaver.Util.removeCSSStyle(this._roundDiv, "-webkit-transform");
            twaver.Util.removeCSSStyle(this._roundDiv, "-webkit-transform-origin");

            twaver.Util.removeCSSStyle(this._roundDiv, "-ms-transform");
            twaver.Util.removeCSSStyle(this._roundDiv, "-ms-transform-origin");

            twaver.Util.removeCSSStyle(this._roundDiv, "transform");
            twaver.Util.removeCSSStyle(this._roundDiv, "transform-origin");

            delete this._origin;
            delete this._radian;
        }

    }
});

HtmlAlarmAttachment = function (elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.alarm = true;
};
twaver.Util.ext(HtmlAlarmAttachment, twaver.network.AlarmAttachment, {
    updateMeasure: function () {
        var font = this.getFont('alarm.font');
        this._contentDiv.innerHTML = this._network.getAlarmLabel(this._element);

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);

        this._fillColor = this._network.getAlarmFillColor(this._element);
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});

function HtmlLabelAttachment(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}
twaver.Util.ext(HtmlLabelAttachment, twaver.network.LabelAttachment, {
    updateMeasure: function () {
        var font = this.getFont('label.font');
        var text = this.getLabel();
        this._contentDiv.innerHTML = text;

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);

        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});

HtmlComponentAttachment = function (elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
};
twaver.Util.ext(HtmlComponentAttachment, HtmlBasicAttachment, {
    updateMeasure: function () {
        var component = this._element.getStyle("component.content");
        if (!component.parentNode || component.parentNode != this._contentDiv) {
            this._contentDiv.appendChild(component);
        }
        this._fillColor = this._element.getStyle("component.fillcolor");
        if (!this._fillColor) this._fillColor = "blue";
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
    },
    getPosition: function () {
        return this.getStyle('component.position');
    },
    getDirection: function () {
        return this.getStyle('component.direction');
    },
    getPointerLength: function () {
        return this.getStyle('component.pointer.length');
    },
    getPointerWidth: function () {
        return this.getStyle('component.pointer.width');
    },
    isShadowable: function () {
        return false;
    },
    getCornerRadius: function () {
        var radius = this.getStyle('component.corner.radius');
        return radius ? radius : 10;
    },
    getPointerLength: function () {
        var length = this.getStyle('component.pointer.length');
        return length ? length : 8;
    },
    getPointerWidth: function () {
        var pwidth = this.getStyle('component.pointer.width');
        return pwidth ? pwidth : 5;
    },
    getPosition: function () {
        var position = this.getStyle('component.position');
        return position ? position : "top";
    },
    getXOffset: function () {
        var xoffset = this.getStyle('component.xoffset');
        return xoffset ? xoffset : 0;
    },
    getYOffset: function () {
        var yoffset = this.getStyle('component.yoffset');
        return yoffset ? yoffset : 0;
    },
    getDirection: function () {
        var direction = this.getStyle('component.direction');
        return direction ? direction : "aboveright";
    },
    isFill: function () {
        return this._fillColor != null;
    },
    getFillColor: function () {
        return this._fillColor;
    }
});

topo.ChipNode = function (id) {
    topo.ChipNode.superClass.constructor.call(this, id);
};
twaver.Util.ext('topo.ChipNode', twaver.Node, {
    getElementUIClass: function () {
        return topo.ChipNodeUI;
    },
    getCanvasUIClass: function () {
        return topo.CanvasChipNodeUI;
    }
});

topo.ChipNodeUI = function (network, element) {
    topo.ChipNodeUI.superClass.constructor.call(this, network, element);
};
twaver.Util.ext('topo.ChipNodeUI', twaver.network.NodeUI, {
    drawTopPin: function (ctx) {
        var gap = this.getElement().getWidth() / this.getNetwork().hPinNumber;
        var offsetX = (gap + 10) / 2;
        var offsetY = 0;
        ctx.beginPath();
        for (var i = 0; i < this.getNetwork().hPinNumber; i++) {
            ctx.moveTo(offsetX + i * gap, offsetY + 5);
            ctx.lineTo(offsetX + i * gap, offsetY);
        }
        ctx.stroke();
    },
    drawBottomPin: function (ctx) {
        var gap = this.getElement().getWidth() / this.getNetwork().hPinNumber;
        var offsetX = (gap + 10) / 2;
        var offsetY = this.getElement().getHeight() + 5;
        ctx.beginPath();
        for (var i = 0; i < this.getNetwork().hPinNumber; i++) {
            ctx.moveTo(offsetX + i * gap, offsetY + 5);
            ctx.lineTo(offsetX + i * gap, offsetY);
        }
        ctx.stroke();
    },
    drawLeftPin: function (ctx) {
        var gap = this.getElement().getHeight() / this.getNetwork().vPinNumber;
        var offsetX = 0;
        var offsetY = (gap + 10) / 2;
        ctx.beginPath();
        for (var i = 0; i < this.getNetwork().vPinNumber; i++) {
            ctx.moveTo(offsetX + 5, offsetY + i * gap);
            ctx.lineTo(offsetX, offsetY + i * gap);
        }
        ctx.stroke();
    },
    drawRightPin: function (ctx) {
        var gap = this.getElement().getHeight() / this.getNetwork().vPinNumber;
        var offsetX = this.getElement().getWidth() + 5;
        var offsetY = (gap + 10) / 2;
        ctx.beginPath();
        for (var i = 0; i < this.getNetwork().vPinNumber; i++) {
            ctx.moveTo(offsetX + 5, offsetY + i * gap);
            ctx.lineTo(offsetX, offsetY + i * gap);
        }
        ctx.stroke();
    },
    drawBody: function () {
        twaver.network.NodeUI.prototype.drawBody.call(this);
        if (this.getNetwork().pinVisible) {
            if (!this.pinCanvas) {
                this.pinCanvas = document.createElement("canvas");
                this.pinCanvas.style.position = 'absolute';
            }

            var rect = this.getBodyRect();
            twaver.Util.grow(rect, 5, 5);
            this.pinCanvas.style.left = rect.x + 'px';
            this.pinCanvas.style.top = rect.y + 'px';
            this.pinCanvas.setAttribute('width', rect.width);
            this.pinCanvas.setAttribute('height', rect.height);
            var ctx = this.pinCanvas.getContext("2d");
            this.drawTopPin(ctx);
            this.drawBottomPin(ctx);
            this.drawLeftPin(ctx);
            this.drawRightPin(ctx);

            this.addBodyBounds(rect);
            this.addComponent(this.pinCanvas);
            this.pinCanvas._viewRect = rect;
        }
    },
    hit: function (x, y) {
        return twaver.Util.containsPoint(this.getViewRect(), x, y);
    }
});

topo.CanvasChipNodeUI = function (network, element) {
    topo.CanvasChipNodeUI.superClass.constructor.call(this, network, element);
};
twaver.Util.ext('topo.CanvasChipNodeUI', twaver.canvas.NodeUI, {
    drawTopPin: function (ctx) {
        var gap = this.getElement().getWidth() / this.getNetwork().hPinNumber;
        var offsetX = this.getElement().getX() + gap / 2;
        var offsetY = this.getElement().getY();
        ctx.beginPath();
        for (var i = 0; i < this.getNetwork().hPinNumber; i++) {
            ctx.moveTo(offsetX + i * gap, offsetY - 5);
            ctx.lineTo(offsetX + i * gap, offsetY);
        }
        ctx.stroke();
    },
    drawBottomPin: function (ctx) {
        var gap = this.getElement().getWidth() / this.getNetwork().hPinNumber;
        var offsetX = this.getElement().getX() + gap / 2;
        var offsetY = this.getElement().getY() + this.getElement().getHeight();
        ctx.beginPath();
        for (var i = 0; i < this.getNetwork().hPinNumber; i++) {
            ctx.moveTo(offsetX + i * gap, offsetY + 5);
            ctx.lineTo(offsetX + i * gap, offsetY);
        }
        ctx.stroke();
    },
    drawLeftPin: function (ctx) {
        var gap = this.getElement().getHeight() / this.getNetwork().vPinNumber;
        var offsetX = this.getElement().getX();
        var offsetY = this.getElement().getY() + gap / 2;
        ctx.beginPath();
        for (var i = 0; i < this.getNetwork().vPinNumber; i++) {
            ctx.moveTo(offsetX - 5, offsetY + i * gap);
            ctx.lineTo(offsetX, offsetY + i * gap);
        }
        ctx.stroke();
    },
    drawRightPin: function (ctx) {
        var gap = this.getElement().getHeight() / this.getNetwork().vPinNumber;
        var offsetX = this.getElement().getX() + this.getElement().getWidth();
        var offsetY = this.getElement().getY() + gap / 2;
        ctx.beginPath();
        for (var i = 0; i < this.getNetwork().vPinNumber; i++) {
            ctx.moveTo(offsetX + 5, offsetY + i * gap);
            ctx.lineTo(offsetX, offsetY + i * gap);
        }
        ctx.stroke();
    },
    paintBody: function (ctx) {
        twaver.canvas.NodeUI.prototype.paintBody.call(this, ctx);
        if (this.getNetwork().pinVisible) {
            this.drawTopPin(ctx);
            this.drawBottomPin(ctx);
            this.drawLeftPin(ctx);
            this.drawRightPin(ctx);
        }
    },
    hit: function (x, y) {
        return twaver.Util.containsPoint(this.getViewRect(), x, y);
    }
});

topo.Rack = function (id) {
    topo.Rack.superClass.constructor.call(this, id);

    this.setIcon('rack_icon');
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', 'rectangle');
    this.setStyle('vector.gradient', 'none');
    this.setStyle('vector.fill.color', '#C0C0C0');
    this.setStyle('vector.deep', 1);
    this.setWidth(60);
    this.setHeight(40);
};
twaver.Util.ext('topo.Rack', twaver.Follower);

topo.Card = function (id) {
    topo.Card.superClass.constructor.call(this, id);

    this.setIcon('card_icon');
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', 'rectangle');
    this.setStyle('vector.gradient', 'none');
    this.setStyle('vector.deep', 2);
    this.setWidth(30);
    this.setHeight(100);
};
twaver.Util.ext('topo.Card', twaver.Follower);

topo.LED = function (id) {
    topo.LED.superClass.constructor.call(this, id);

    this.setIcon('led_icon');
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', 'circle');
    this.setStyle('vector.gradient', 'radial.southwest');
    this.setStyle('vector.fill.color', '#00FF00');
    this.setWidth(20);
    this.setHeight(20);
};
twaver.Util.ext('topo.LED', twaver.Follower);

topo.Port = function (id) {
    topo.Port.superClass.constructor.call(this, id);

    this.setIcon('port_icon');
    this.setImage('port_image');
};
twaver.Util.ext('topo.Port', twaver.Follower);

topo.TextNode = function (id) {
    topo.TextNode.superClass.constructor.call(this, id);
    this.setSize(150, 40);
    //element.setStyle('vector.fill.color', "#555555");
    this.setStyle('label.position', 'center');
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', 'rectangle');
    //element.setStyle('vector.gradient', 'linear.north');
    //element.setIcon("card_icon");
    this.setStyle('grid.row.count', 0);
    this.setStyle('grid.column.count', 0);
    this.setStyle('label.font', 'bold 20px Arial');
    //element.setStyle('whole.alpha', 0.1);
    this.setName("Text");
    //this.setCenterLocation(point);
};
twaver.Util.ext('topo.TextNode', twaver.Grid);

topo.BusNode = function (id) {
    topo.TextNode.superClass.constructor.call(this, id);
    this.setSize(500, 8);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "rectangle");
    this.setStyle('vector.fill.color', "#FFFF00");
};
twaver.Util.ext('topo.BusNode', twaver.Node);

topo.Slot = function (id) {
    topo.Slot.superClass.constructor.call(this, id);

    this.setIcon('slot_icon');
    this.setStyle('outer.padding', 0);
    this.setWidth(35);
    this.setHeight(105);
};
twaver.Util.ext('topo.Slot', twaver.Grid);

topo.KPICard = function (id) {
    topo.KPICard.superClass.constructor.call(this, id);
};
twaver.Util.ext('topo.KPICard', twaver.Grid, {
    getElementUIClass: function () {
        return topo.KPICardUI;
    }
});

topo.KPICardUI = function (network, element) {
    topo.KPICardUI.superClass.constructor.call(this, network, element);
};
twaver.Util.ext('topo.KPICardUI', twaver.network.GridUI, {
    drawBody: function () {
        if (!this._nodeCanvas) {
            this._nodeCanvas = twaver.Util.createCanvas();
        }
        this.addComponent(this._nodeCanvas);
        var rect = this.getBodyRect();
        var bounds = {x: rect.x, y: rect.y, width: rect.width, height: rect.height};
        var g = this.setShadow(this, this._nodeCanvas, rect);

        g.fillStyle = '#000000';
        g.rect(rect.x, rect.y, rect.width, rect.height);
        g.fill();

        twaver.Util.grow(rect, -4, -4);
        g.strokeStyle = '#FFFFFF';
        g.lineWidth = 1;
        g.beginPath();
        g.rect(rect.x, rect.y, rect.width, rect.height);
        g.stroke();

        twaver.Util.grow(rect, -1, 0);
        var value = this.getElement().getClient('value');
        var h = rect.height * value / 100;
        rect.y = rect.y + rect.height - h;
        rect.height = h;

        g.beginPath();
        twaver.Util.fill(g, '#FF9900', 'spread.west', '#FFFFFF', rect.x, rect.y, rect.width, rect.height);
        g.rect(rect.x, rect.y, rect.width, rect.height);
        g.fill();
        this.addBodyBounds(bounds);
    }
});

topo.MatrixNode = function (id) {
    topo.MatrixNode.superClass.constructor.call(this, id);
};
twaver.Util.ext('topo.MatrixNode', twaver.Node, {
    getElementUIClass: function () {
        return topo.MatrixNodeUI;
    }
});

topo.MatrixNodeUI = function (network, element) {
    topo.MatrixNodeUI.superClass.constructor.call(this, network, element);
};
twaver.Util.ext('topo.MatrixNodeUI', twaver.network.NodeUI, {
    updateMeasure: function () {
        topo.MatrixNodeUI.superClass.updateMeasure.call(this);
        var element = this.getElement();
        var imagePadding = element.getStyle('image.padding');
        var point = {
            x: element.getX() + element.getWidth() + imagePadding - 3,
            y: element.getY() - imagePadding + 3
        };
        this.setHotSpot(point);
    }
});

topo.AbstractPipe = function (id) {
    topo.AbstractPipe.superClass.constructor.call(this, id);
    this.setSize(160, 160);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.fill.color', '#C0C0C0');
    this.setStyle('vector.outline.width', 1);
    this.setStyle('vector.outline.color', '#00B200');
    this.setClient('holeIndex', -1);
    this.setClient('innerWidth', 1);
    this.setClient('innerColor', '#00B200');
};
twaver.Util.ext('topo.AbstractPipe', twaver.Follower, {
    IPipe: true,
    onClientChanged: function (clientProp, oldValue, newValue) {
        topo.AbstractPipe.superClass.onClientChanged.call(this, clientProp, oldValue, newValue);
        if (clientProp === 'holeIndex') {
            this._adjustBounds();
        }
    },
    updateFollowerImpl: function (e) {
        topo.AbstractPipe.superClass.updateFollowerImpl.call(this, e);
        this._adjustBounds();
    },
    _adjustBounds: function () {
        var host = this.getHost();
        if (host && host.IPipe) {
            var bounds = host.getPipeHoleBoundsByHole(this);
            if (bounds != null) {
                this.setLocation(bounds.x + host.getClient('innerWidth'), bounds.y + host.getClient('innerWidth'));
                this.setSize(bounds.width - host.getClient('innerWidth') * 2, bounds.height - host.getClient('innerWidth') * 2);
            }
        }
    },
    getPipeHoleBoundsByHole: function (hole) {
        return this.getPipeHoleBoundsByHoleIndex(hole.getClient('holeIndex'));
    },
    getPipeHoleBoundsByHoleIndex: function (holeIndex) {
        return null;
    },
    getPipeHoleByHoleIndex: function (holeIndex) {
        for (var i = 0, c = this.getChildrenCount(); i < c; i++) {
            var element = this.getChildAt(i);
            if (element.IPipe) {
                if (element.getClient('holeIndex') === holeIndex) {
                    return element;
                }
            }
        }
        return null;
    }
});

topo.RoundPipe = function (id) {
    topo.RoundPipe.superClass.constructor.call(this, id);
    this.setClient('holeCount', 0);
    this.setClient('isCenterHole', true);
    this.setIcon('roundPipe');
    this.setStyle('vector.shape', 'circle');
    this.setStyle('vector.gradient', 'radial.northwest');
};
twaver.Util.ext('topo.RoundPipe', topo.AbstractPipe, {
    getElementUIClass: function () {
        return topo.RoundPipeUI;
    },
    getPipeHoleBoundsByHoleIndex: function (holeIndex) {
        var holeCount = this.getClient('holeCount');
        if (holeIndex < 0 || holeIndex >= holeCount) {
            return null;
        }
        var center = this.getClient('isCenterHole');
        var R = Math.min(this.getWidth(), this.getHeight()) / 2.0;
        var cx = this.getX() + this.getWidth() / 2.0;
        var cy = this.getY() + this.getHeight() / 2.0;
        var count = center ? holeCount - 1 : holeCount;
        var angle = Math.PI / count;
        var r = R * Math.sin(angle) / (1 + Math.sin(angle));
        var x = (R - r) * Math.sin(angle * 2 * holeIndex);
        var y = (R - r) * Math.cos(angle * 2 * holeIndex);
        if (center && holeIndex == holeCount - 1) {
            r = R - 2 * r;
            return {x: cx - r, y: cy - r, width: 2 * r, height: 2 * r};
        } else {
            return {x: cx + x - r, y: cy + y - r, width: 2 * r, height: 2 * r};
        }
    }
});

topo.RoundPipeUI = function (network, element) {
    topo.RoundPipeUI.superClass.constructor.call(this, network, element);
};
twaver.Util.ext('topo.RoundPipeUI', twaver.network.NodeUI, {
    drawBody: function () {
        topo.RoundPipeUI.superClass.drawBody.call(this);

        var roundPipe = this.getElement();
        if (roundPipe == null || roundPipe.getClient('holeCount') <= 0) {
            return;
        }
        var innerWidth = roundPipe.getClient('innerWidth');
        if (innerWidth > 0) {
            var innerColor = roundPipe.getClient('innerColor');
            var g = this._vectorCanvas.getContext('2d');
            g.strokeStyle = innerColor;
            g.lineWidth = innerWidth;
            for (var i = 0, c = roundPipe.getClient('holeCount'); i < c; i++) {
                var rect = roundPipe.getPipeHoleBoundsByHoleIndex(i);
                if (rect != null) {
                    g.beginPath();
                    g.arc(rect.x + rect.width / 2, rect.y + rect.height / 2, Math.min(rect.width, rect.height) / 2, 0, Math.PI * 2, true);
                    g.stroke();
                }
            }
        }
    }
});

topo.SquarePipe = function (id) {
    topo.SquarePipe.superClass.constructor.call(this, id);
    this.setClient('cellCounts', []);
    this.setClient('isHorizontal', true);
    this.setIcon('squarePipe');
    this.setStyle('vector.shape', 'rectangle');
    this.setStyle('vector.gradient', 'linear.northwest');
};
twaver.Util.ext('topo.SquarePipe', topo.AbstractPipe, {
    getElementUIClass: function () {
        return topo.SquarePipeUI;
    },
    getAllCellCount: function () {
        var cellCounts = this.getClient('cellCounts');
        if (cellCounts == null || cellCounts.length == 0) {
            return 0;
        }
        var count = 0;
        for (var i = 0, c = cellCounts.length; i < c; i++) {
            count += cellCounts[i];
        }
        return count;
    },
    getRowIndexByPoint: function (point) {
        for (var i = 0, count = this.getAllCellCount(); i < count; i++) {
            var rect = this.getPipeHoleBoundsByHoleIndex(i);
            if (rect != null && twaver.Util.containsPoint(rect, point)) {
                return this.getRowIndexByCellIndex(i);
            }
        }
        return -1;
    },
    getRowIndexByCellIndex: function (cellIndex) {
        if (cellIndex < 0 || cellIndex >= this.getAllCellCount()) {
            return -1;
        }
        var count = 0;
        var cellCounts = this.getClient('cellCounts');
        var isHorizontal = this.getClient('isHorizontal');
        for (var i = 0, c = cellCounts.length; i < c; i++) {
            var rowCount = cellCounts[i];
            count += rowCount;
            if (count >= cellIndex + 1) {
                if (isHorizontal) {
                    return i;
                } else {
                    return rowCount - (count - cellIndex);
                }
            }
        }
        return -1;
    },
    getColumnIndexByPoint: function (point) {
        var count = this.getAllCellCount();
        for (var i = 0; i < count; i++) {
            var rect = this.getPipeHoleBoundsByHoleIndex(i);
            if (rect != null && rect.containsPoint(point)) {
                return this.getColumnIndexByCellIndex(i);
            }
        }
        return -1;
    },
    getColumnIndexByCellIndex: function (cellIndex) {
        if (cellIndex < 0 || cellIndex >= this.getAllCellCount()) {
            return -1;
        }
        var count = 0;
        var cellCounts = this.getClient('cellCounts');
        var isHorizontal = this.getClient('isHorizontal');
        for (var i = 0, c = cellCounts.length; i < c; i++) {
            var columnCount = cellCounts[i];
            count += columnCount;
            if (count >= cellIndex + 1) {
                if (isHorizontal) {
                    return columnCount - (count - cellIndex);
                } else {
                    return i;
                }
            }
        }
        return -1;
    },
    getPipeHoleBoundsByHoleIndex: function (holeIndex) {
        if (holeIndex < 0 || holeIndex >= this.getAllCellCount()) {
            return null;
        }
        var row = this.getRowIndexByCellIndex(holeIndex);
        var column = this.getColumnIndexByCellIndex(holeIndex);
        if (row < 0 || column < 0) {
            return null;
        }

        var location = this.getLocation();
        var borderWidth = this.getStyle('vector.outline.width');
        if (borderWidth < 0) {
            borderWidth = 0;
        }
        var x = location.x + borderWidth;
        var y = location.y + borderWidth;
        var w = this.getWidth() - borderWidth * 2;
        var h = this.getHeight() - borderWidth * 2;

        var cellCounts = this.getClient('cellCounts');
        var rect = {};
        if (this.getClient('isHorizontal')) {
            var rowCount = cellCounts[row];
            rect.width = w / rowCount;
            rect.height = h / cellCounts.length;
            rect.x = x + column * w / rowCount;
            rect.y = y + row * h / cellCounts.length;
        } else {
            var columnCount = cellCounts[column];
            rect.width = w / cellCounts.length;
            rect.height = h / columnCount;
            rect.x = x + column * w / cellCounts.length;
            rect.y = y + row * h / columnCount;
        }
        return rect;
    }
});

topo.SquarePipeUI = function (network, element) {
    topo.SquarePipeUI.superClass.constructor.call(this, network, element);
};
twaver.Util.ext('topo.SquarePipeUI', twaver.network.NodeUI, {
    drawBody: function () {
        topo.SquarePipeUI.superClass.drawBody.call(this);

        var squarePipe = this.getElement();
        if (squarePipe == null) {
            return;
        }
        var cellCounts = squarePipe.getClient('cellCounts');
        var count = squarePipe.getAllCellCount();
        if (cellCounts == null || count <= 0) {
            return;
        }
        var innerWidth = squarePipe.getClient('innerWidth');
        if (innerWidth > 0) {
            var innerColor = squarePipe.getClient('innerColor');
            var g = this._vectorCanvas.getContext('2d');
            g.strokeStyle = innerColor;
            g.lineWidth = innerWidth;
            for (var i = 0; i < count; i++) {
                var rect = squarePipe.getPipeHoleBoundsByHoleIndex(i);
                if (rect != null) {
                    g.beginPath();
                    g.rect(rect.x, rect.y, rect.width, rect.height);
                    g.stroke();
                }
            }
        }
    }
});

topo.StoryLayouter = function (network, part) {
    topo.StoryLayouter.superClass.constructor.call(this, network);
    this.part = part;
    this.setElliptical(false);
    this.setCeaseRate(0.8);
    this.setInterval(80);
    this.setMoveSpeed(2);
    this.lastElement = null;
};
twaver.Util.ext('topo.StoryLayouter', twaver.layout.CloudLayouter, {
    isLayoutable: function (node) {
        return node.getClient('part') === this.part;
    },
    getLayoutRect: function () {
        var w = this.getNetwork().getView().clientWidth / this.getNetwork().getZoom();
        var h = this.getNetwork().getView().clientHeight / this.getNetwork().getZoom();
        if (this.part === 0) {
            return {x: w / 8, y: h / 8, width: w / 4, height: h / 4};
        }
        if (this.part === 1) {
            return {x: w * 5 / 8, y: h / 8, width: w / 4, height: h / 4};
        }
        if (this.part === 2) {
            return {x: w / 8, y: h * 5 / 8, width: w / 4, height: h / 4};
        }
        if (this.part === 3) {
            return {x: w * 5 / 8, y: h * 5 / 8, width: w / 4, height: h / 4};
        }
        return null;
    },
    updateNode: function (node, zIndex, count, alpha) {
        node.setStyle('whole.alpha', 0.3 + alpha * 0.7);
        var point = node.getCenterLocation();
        var image = twaver.Util.getImageAsset(node.getImage());
        if (image) {
            node.setWidth = image.getWidth() * (0.1 + alpha * 0.4);
            node.setheight = image.getHeight() * (0.1 + alpha * 0.4);
            node.setCenterLocation(point);
        }
    },
    handleMouseMove: function (e) {
        topo.StoryLayouter.superClass.handleMouseMove.call(this, e);
        this._handleMouseEvent(e);
    },
    handleMouseOver: function (e) {
        topo.StoryLayouter.superClass.handleMouseOver.call(this, e);
        this._handleMouseEvent(e);
    },
    _handleMouseEvent: function (e) {
        var element = this.getNetwork().getElementAt(e);
        if (element != this.lastElement) {
            if (this.lastElement != null) {
                this.lastElement.setStyle('vector.outline.width', -1);
            }
            this.lastElement = element;
            if (this.lastElement != null) {
                this.lastElement.setStyle('vector.outline.width', 1);
            }
        }

        var point = network.getLogicalPoint(e);
        var activeRect = this.getLayoutRect();
        twaver.Util.grow(activeRect, activeRect.width / 2, activeRect.height / 2);
        if (twaver.Util.containsPoint(activeRect, point) && !this.isRunning()) {
            this.start();
        } else {
            this.stop();
        }
    },
    handleRollOut: function (e) {
        topo.StoryLayouter.superClass.handleRollOut.call(this, e);
        this.stop();
    },
    handleResize: function (e) {
        topo.StoryLayouter.superClass.handleResize.call(this, e);
        this.updateLayoutRect();
    }
});

topo.AlarmOverview = function (elementBox) {
    topo.AlarmOverview.superClass.constructor.call(this);
    this._init();
    this.setElementBox(elementBox);
};
twaver.Util.ext('topo.AlarmOverview', twaver.controls.TabPane, {
    setElementBox: function (elementBox) {
        this._elementBox = elementBox;
        if (this._alarmStateStatistics == null) {
            this._alarmStateStatistics = new twaver.AlarmStateStatistics(elementBox);
            var ass = this._alarmStateStatistics;
            var table = this._table;
            var update = function (e) {
                twaver.AlarmSeverity.forEach(function (severity) {
                    var data = table.getDataBox().getDataById(severity.name);
                    data.setClient('new', ass.getNewAlarmCount(severity));
                    data.setClient('acked', ass.getAcknowledgedAlarmCount(severity));
                    data.setClient('total', ass.getTotalAlarmCount(severity));
                });
                var data = table.getDataBox().getDataById('total');
                data.setClient('total', ass.getTotalAlarmCount());
                data.setClient('new', ass.getNewAlarmCount());
                data.setClient('acked', ass.getAcknowledgedAlarmCount());
            }
            ass.addPropertyChangeListener(function (e) {
                if (e.property === 'alarmState') {
                    update();
                }
            });
            update();
        } else {
            this._alarmStateStatistics.setElementBox(elementBox);
        }
    },
    _addTab: function (name, icon, view) {
        var tab = new twaver.Tab(name);
        tab.setIcon(icon);
        tab.setView(view)
        tab.setWidth(50);
        this.getTabBox().add(tab);
    },
    _headerImage: 'data:image/gif;base64,R0lGODlhAgAYAIcAANDQ0Ovs7uzt7+3u8O7v8e/w8vDx8/Hy9Pn5+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAP8ALAAAAAACABgAAAghABEIHEiwYMEDCA8YWMiwgMMCBAgMmDhAgIAAGAMAABAQADs=',
    _init: function () {
        var tabPane = this;
        // Init Table
        var table = new twaver.controls.Table();
        this._table = table;
        table.getView().style.overflow = 'hidden';
        var tablePane = new twaver.controls.TablePane(table);
        tablePane.getTableHeader().getView().style.background = 'url(' + this._headerImage + ') repeat-x';
        var column = topo.Util.createColumn(table, 'Severity', 'severity', 'client');
        column.setWidth(120);
        column.setHorizontalAlign('center');
        column.renderCell = function (params) {
            var severity = params.value;
            var span = document.createElement('span');
            span.innerHTML = severity.toString().toUpperCase();
            span.style.whiteSpace = 'nowrap';
            params.div.style.backgroundColor = severity.color ? severity.color : '';
            params.div.appendChild(span);
        };
        topo.Util.createColumn(table, 'New', 'new', 'client').setWidth(40);
        topo.Util.createColumn(table, 'Acked', 'acked', 'client').setWidth(40);
        topo.Util.createColumn(table, 'Total', 'total', 'client').setWidth(40);

        twaver.AlarmSeverity.severities.forEachReverse(function (severity) {
            var data = new twaver.Data(severity.name);
            data.setClient('severity', severity);
            table.getDataBox().add(data);
        });
        var data = new twaver.Data('total');
        data.setClient('severity', 'Total');
        data.setClient('new', 0);
        data.setClient('acked', 0);
        data.setClient('total', 0);
        table.getDataBox().add(data);

        // Init Bar Chart
        var barChart = new twaver.charts.BarChart(table.getDataBox());
        barChart.setYScaleValueGap(2);
        barChart.setYScaleMinTextVisible(true);
        barChart.formatYScaleText = function (value) {
            return value.toFixed(0);
        };
        barChart.setVisibleFunction(function (data) {
            return data.getId() !== 'total';
        });
        barChart.getValue = function (data) {
            return data.getClient('total');
        };
        barChart.getColor = function (data) {
            return data.getClient('severity').color;
        };
        barChart.getName = function (data) {
            return data.getClient('severity').nickName;
        };
        barChart.getToolTipByData = function (data, info) {
            var severity = data.getClient('severity');
            return '<h4 style="margin:0px"><span style="color:' + severity.color + '">' + severity.name +
                '</span>:&nbsp;<span style="text-decoration: underline">' + info.value + '</span></h4>';
        };

        // Init Pie Chart
        var pieChart = new twaver.charts.PieChart(table.getDataBox());
        pieChart.setVisibleFunction(barChart.getVisibleFunction());
        pieChart.getValue = barChart.getValue;
        pieChart.getColor = barChart.getColor;
        pieChart.getName = barChart.getName;
        pieChart.getToolTipByData = barChart.getToolTipByData;

        // init tabPane
        var r = function (name, width, height, src) {
            var img = document.createElement('img');
            img.src = src;
            twaver.Util.registerImage(name, img, width, height);
        }
        r('bar', 18, 18, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFgSURBVHjanFO9SgNBEM7d/szeXe4SkVQWCrFIbZVX0CewSGdjbyuIIPgEgm+gb2AnwQcQ0cIUgiiIEJGQgOTu9s8JSyLqaX4GdpmZ3W+/b5YZz1pbmt8oru3Di7kw5web1HmdztPN2e4sGMfhlxYy+tfB9f6KczaOXn6f/scWln8+aoyZwiYlYRx8P5hklDZSTYNRBowJwkZ+q3nskieXe1NEMjQOhAfG2DRT9doSJjNlC9iaO+tJzNPUXp3eE4pszOOJ1IYzEoSUcj8rFImY+lqt+zYc6+S459ogAASjhGTSFIgMhKhWEiGECwkd/UeuDKUEBBbr52OR32EgkiQGYO7HPDGqJ5UI86OKgJBnUhXAQEAcRZyKXOsJLJOWhzRejqAM6BfUNujr58e89y5R2GCQ37bbHourytw9dF97H73+cEtqd9PDwcHuxFaesRsbjdWvCcBgrlb2FhvTTwEGAPjOf5jsJjzBAAAAAElFTkSuQmCC');
        r('table', 18, 18, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjaYvz//z8D6YAFiCMat5OkZ0W9JwucRaQeiB0scH5wlZOkGN/dR0+2950hqJkJzpIU51dVE+HnZQOyDSJnABGcAWej+A0C7j56/Ob9y6cv3gPZ3ZVBEEE4A8L+9+8flAMMyfCGbf+JAL///P324zdEMcK249Wm/Pys71++su69g+YToLo/f//9BqH/6I7k52eXlGD5+ZkJzRvnlqYbRc+EsHfNTETX9v7Vi59fmD5+/IbmJaAlcO7PP//QtVn3INzmqicGJIEB8PvPv19//xkr8f/68//X3/8/f2NoC7ZtkxTgvvvo7faLTUAuyDN//v3+9x9o28/fIBKo7fcfDL8B9WhKinx6/x0YAIZRM48tSLZKmAuRWj8pLjBvEZAxvz0CXdu9R2+Bep6++Qy0BOgZoKvgXvr1B+o9oLXo2rZdbAJ55i/QD/9MlPmBvteQ4f39G+Q2IFuQhw2o+efvv+jaoAEA9AyQBAcAUN1vEANI/gV57w8o6lC0kZp3GMnLpgABBgBINSR0kosVBQAAAABJRU5ErkJggg==');
        r('pie', 18, 18, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIjSURBVHjanJNNaBNBFICTbGrSNCUNiAlVDy0aKeJPFcSDKIhU60WPAYmgiEUUBcGDQRS9iiCiYBV68CAehJ4kUBEpSvFgj3pRY7trk83+z85mZ3dndsbBYpRND8bHzOPxmI/3M+/FGWOx3iXJb/l2rSfmxa3JZMf6R2Y1RjLi9Ux58dHUYHFUtHILSyPYJ03Fvjd9plAciibZEXlxTpp/trtyM53J4I/1/YWhzcW8VFculR9fqB4/PLGz8zLxdxzp7cye0zdSAqG2yNoyVB2zYcVccvLA2P3qbEu2KKVRjOc2dqxCgRgCkVoidVq25hgrgB+gOvu2DF89P+NjGk0yO5jtSyAKGswD1DOpY9vqxqSNPYR9j8RxzBFhEHZhqX6BWcvUM5hvMWRQB3+tqzRkhNBUIdGXYWS06RPW1RJkhuA7+4UR7NYUcOLa1Mi2fChAiHQbaXPvLZ90RXMtmQIa4jbBQcPx1m0/WtqVs5FqQ41riLSWrqxRGxKGoSnHE5Rgf7YhTJ49pMEftqdBVwWc0ZQA5YLfSf7p5N6L09++tFAbiKYdKx10iaFDSYcih3VTebfw+XLlro9JFEvni1tPPVlecl8Z/eM7SrojqVBSQVNaab6Z/1SeuDOQWe9jtsaUbBg/ktn04emDK83XtXQ65mNkAFcIi9VzL7MDnKG4uyV8Arg3nis8vP6c1xCELCDcww2uw1UGR/6t192J/9+a/hRgAEzlajsC1G6iAAAAAElFTkSuQmCC');

        this._addTab('Table', 'table', tablePane);
        this._addTab('Bar', 'bar', new twaver.charts.ChartPane(barChart, null, 'top'));
        this._addTab('Pie', 'pie', new twaver.charts.ChartPane(pieChart, null, 'top'));

        var tabBox = tabPane.getTabBox();
        tabPane.setTabOrientation('bottom');
        tabBox.getSelectionModel().setSelection(tabBox.getDataById('Table'));
    }
});

topo.CustomAlarmElementMapping = function (elementBox) {
    this._elementFinder = new twaver.QuickFinder(elementBox, 'MAPPINGID', 'client');
    this._alarmFinder = new twaver.QuickFinder(elementBox.getAlarmBox(), 'MAPPINGID', 'client');
};
twaver.Util.ext('topo.CustomAlarmElementMapping', Object, {
    getCorrespondingAlarms: function (element) {
        return this._alarmFinder.find(element.getClient('MAPPINGID'));
    },
    getCorrespondingElements: function (alarm) {
        return this._elementFinder.find(alarm.getClient('MAPPINGID'));
    }
});

topo.AutoPackTable = function (dataBox) {
    topo.AutoPackTable.superClass.constructor.call(this, dataBox);
};
twaver.Util.ext('topo.AutoPackTable', twaver.controls.Table, {
    _minPackWidth: 100,
    getMinPackWidth: function () {
        return this._minPackWidth;
    },
    setMinPackWidth: function (v) {
        this._minPackWidth = v;
    },
    adjustBounds: function (rect) {
        topo.AutoPackTable.superClass.adjustBounds.call(this, rect);
        this.packColumns(rect.width);
    },
    packColumns: function (width) {
        var packCoumns = new twaver.List(),
            packWidth;
        this.getColumnBox().getRoots().forEach(function (column) {
            if (column.getClient('pack')) {
                packCoumns.add(column);
            } else {
                width -= column.getWidth();
            }
        });
        if (packCoumns.size() === 0) {
            return;
        }
        packWidth = width / packCoumns.size();
        if (packWidth < this._minPackWidth) {
            packWidth = this._minPackWidth;
        }
        packCoumns.forEach(function (column) {
            column.setWidth(packWidth);
        });
    }
});

topo.AutoPackTreeTable = function (dataBox) {
    topo.AutoPackTreeTable.superClass.constructor.call(this, dataBox);
};
twaver.Util.ext('topo.AutoPackTreeTable', twaver.controls.TreeTable, {
    _minPackWidth: 100,
    getMinPackWidth: function () {
        return this._minPackWidth;
    },
    setMinPackWidth: function (v) {
        this._minPackWidth = v;
    },
    adjustBounds: function (rect) {
        topo.AutoPackTreeTable.superClass.adjustBounds.call(this, rect);
        this.packColumns(rect.width);
    },
    packColumns: function (width) {
        var packCoumns = new twaver.List(),
            packWidth;
        this.getColumnBox().getRoots().forEach(function (column) {
            if (column.getClient('pack')) {
                packCoumns.add(column);
            } else {
                width -= column.getWidth();
            }
        });
        if (packCoumns.size() === 0) {
            return;
        }
        packWidth = width / packCoumns.size();
        if (packWidth < this._minPackWidth) {
            packWidth = this._minPackWidth;
        }
        packCoumns.forEach(function (column) {
            column.setWidth(packWidth);
        });
    }
});

function CommonHtmlToPoLabelAttachment(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}
twaver.Util.ext(CommonHtmlToPoLabelAttachment, twaver.network.LabelAttachment, {
    updateMeasure: function () {
        /* var font = this.getFont('label.font');*/
        //var font = "14px '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif";
        var fontsize = this.getElement().getClient("labelfontsize")
        var font = fontsize + "px" + " '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif"
        var color = this.getStyle('label.color');
        var text = this.getLabel();
        if (text.indexOf("<br>") > -1) {
            var textarr = text.split("<br>")
            var texthtml = "";
            for (var i = 0; i < textarr.length; i++) {
                texthtml = texthtml + "<div>" + textarr[i] + "</div>";
            }
            this._contentDiv.innerHTML = texthtml;
        }
        else {
            this._contentDiv.innerHTML = text;
        }

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);
        twaver.Util.setCSSStyle(this._contentDiv, "color", color);
        twaver.Util.setCSSStyle(this._contentDiv, "text-align", "center");
        /* console.info(this._contentDiv);*/
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        //twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});

function CommonHtmlLabelNodeUI(network, element) {
    CommonHtmlLabelNodeUI.superClass.constructor.call(this, network, element);
}
twaver.Util.ext(CommonHtmlLabelNodeUI, twaver.network.NodeUI, {
    checkLabelAttachment: function () {
        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new CommonHtmlToPoLabelAttachment(this);
                this.addAttachment(this._labelAttachment);
            }
        } else {
            if (this._labelAttachment) {
                this.removeAttachment(this._labelAttachment);
                this._labelAttachment = null;
            }
        }
    }
});

/**
 * 逆变器类
 */
topo.NiBianQi = function (id) {
    topo.NiBianQi.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setStyle('label.xoffset', -70);
    this.setImage("nibianqizcr");
};
twaver.Util.ext('topo.NiBianQi', twaver.Node, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 通用节点
 */
topo.TongYong = function (id) {
    topo.TongYong.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("tongyong");
};
twaver.Util.ext('topo.TongYong', twaver.Node, {});

/**
 * 逆变器类3D
 */
topo.NiBianQi3D = function (id) {
    topo.NiBianQi3D.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.yoffset', 2);
    this.setImage("nibianqi3d");
    this.setName(Msg.topocfg.nibianqi);
};
twaver.Util.ext('topo.NiBianQi3D', twaver.Node, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 集中式逆变器
 */
topo.JZNiBianQi = function (id) {
    topo.JZNiBianQi.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setStyle('label.xoffset', -70);
    this.setImage("jzNBQ-right");
};
twaver.Util.ext('topo.JZNiBianQi', twaver.Node, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 集中式逆变器类3D
 */
topo.JZNiBianQi3D = function (id) {
    topo.JZNiBianQi3D.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.yoffset', 2);
    this.setImage("jzNBQ3D");
    this.setName(Msg.topocfg.jizhongnibianqi);
};
twaver.Util.ext('topo.JZNiBianQi3D', twaver.Node, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 集中式箱变3D
 */
topo.JZXiangBian3D = function (id) {
    topo.JZXiangBian3D.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.yoffset', 2);
    this.setImage("xiangbian3D");
    this.setName(Msg.topocfg.jizhongxb3d);
};
twaver.Util.ext('topo.JZXiangBian3D', twaver.Node, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 直流汇流箱类
 */
topo.ZLHuiLiuXiang = function (id) {
    topo.ZLHuiLiuXiang.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setStyle('label.xoffset', -70);
    this.setImage("zlHLXr");
};
twaver.Util.ext('topo.ZLHuiLiuXiang', twaver.Follower, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 直流汇流箱类3D
 */
topo.ZLHuiLiuXiang3D = function (id) {
    topo.ZLHuiLiuXiang3D.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.yoffset', 2);
    this.setImage("3d-zlHLXr");
    this.setName(Msg.topocfg.zhiliuhuiliuxiang);
};
twaver.Util.ext('topo.ZLHuiLiuXiang3D', twaver.Node, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 组串支架类 2 * 3
 */
topo.Shelf23 = function (id) {
    topo.Shelf23.superClass.constructor.call(this, id);
    //this.setImage('zuchuan23r');
    //this.setStyle('grid.row.count', 2);
    //this.setStyle('grid.column.count', 3);
    //this.setStyle('label.color', "#ffffff");
    //this.setStyle('label.position', "bottom.bottom");
    //this.setStyle('label.font', Msg.topocfg.font12);
    //this.setWidth(114);
    //this.setHeight(30);
    this.setSize(114, 30);
    this.setStyle("grid.border", 0.5);
    this.setStyle("grid.row.count", 2);
    this.setStyle("grid.column.count", 3);
    this.setStyle("grid.deep", 4);
    this.setStyle("grid.fill.color", "#626262");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.Shelf23', twaver.Grid, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 组串支架类 2 * 2
 */
topo.Shelf22 = function (id) {
    topo.Shelf22.superClass.constructor.call(this, id);
    //this.setImage("zuchuan22r");
    //this.setStyle('grid.row.count', 2);
    //this.setStyle('grid.column.count', 2);
    //this.setStyle('label.color', "#ffffff");
    //this.setStyle('label.position', "bottom.bottom");
    //this.setStyle('label.font', Msg.topocfg.font12);
    //this.setWidth(76);
    //this.setHeight(30);
    this.setSize(76, 30);
    this.setStyle("grid.border", 0.5);
    this.setStyle("grid.row.count", 2);
    this.setStyle("grid.column.count", 2);
    this.setStyle("grid.deep", 4);
    this.setStyle("grid.fill.color", "#626262");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.Shelf22', twaver.Grid, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 组串支架类 2 * 4
 */
topo.Shelf24 = function (id) {
    topo.Shelf24.superClass.constructor.call(this, id);
    //this.setImage("zuchuan24r");
    this.setSize(152, 30);
    this.setStyle("grid.border", 0.5);
    this.setStyle("grid.row.count", 2);
    this.setStyle("grid.column.count", 4);
    this.setStyle("grid.deep", 4);
    this.setStyle("grid.fill.color", "#626262");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.Shelf24', twaver.Grid, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 组串支架类 2 * 5
 */
topo.Shelf25 = function (id) {
    topo.Shelf25.superClass.constructor.call(this, id);
    this.setImage("zuchuan25r");
    this.setStyle('grid.row.count', 2);
    this.setStyle('grid.column.count', 5);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setWidth(196);
    this.setHeight(30);
};
twaver.Util.ext('topo.Shelf25', twaver.Grid, {});

/**
 * 组串支架类 2 * 6
 */
topo.Shelf26 = function (id) {
    topo.Shelf26.superClass.constructor.call(this, id);
    this.setImage("zuchuan26r");
    this.setStyle('grid.row.count', 2);
    this.setStyle('grid.column.count', 6);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setWidth(235);
    this.setHeight(30);
};
twaver.Util.ext('topo.Shelf26', twaver.Grid, {});

/**
 * 组串支架类 2 * 7
 */
topo.Shelf27 = function (id) {
    topo.Shelf27.superClass.constructor.call(this, id);
    this.setImage("zuchuan27r");
    this.setStyle('grid.row.count', 2);
    this.setStyle('grid.column.count', 7);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setWidth(274);
    this.setHeight(30);
};
twaver.Util.ext('topo.Shelf27', twaver.Grid,{
});

/** 集中式组串 */
topo.JZZuChuan = function (id) {
    topo.JZZuChuan.superClass.constructor.call(this, id);
    //this.setImage("jzZuChuan");
    this.setStyle('grid.row.count', 2);
    this.setStyle('grid.column.count', 8);
    //this.setStyle('grid.fill.color',"#0000ff");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setWidth(38 * 8);
    this.setHeight(15 * 2);
    //for (var i = 0; i < 8; i++) {
    //    for (var j = 0; j < 2; j++) {
    //        var cell = new twaver.Grid();
    //        cell.setImage("zuchuanlan");
    //        cell.setStyle("follower.row.index", j);
    //        cell.setStyle("follower.column.index", i);
    //        cell.setStyle('label.color', "#0000ff");
    //        cell.setStyle('label.position', "bottom.bottom");
    //        cell.setStyle('label.font', Msg.topocfg.font12);
    //        var cellname = 8 * i + (j + 1);
    //        cell.setToolTip("Pv" + cellname);
    //        this.addChild(cell);
    //    }
    //}
};
twaver.Util.ext('topo.JZZuChuan', twaver.Grid, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/

});

/**
 * 组串3D类
 */
topo.ZuChuan3D = function (id) {
    topo.ZuChuan3D.superClass.constructor.call(this, id);
    this.setImage("zuchuan3dr");
    this.setName(Msg.topocfg.guangfubanzu);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font14);
};
twaver.Util.ext('topo.ZuChuan3D', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 表格类
 */
topo.Table = function (id) {
    topo.Table.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('grid.row.count', 10);
    this.setStyle('grid.column.count', 2);
    this.setStyle('grid.fill', false);
    this.setStyle('grid.border', 1);
    this.setStyle('grid.deep', 1);
    this.setStyle('grid.padding', 1);
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setWidth(400);
    this.setHeight(360);
};
twaver.Util.ext('topo.Table', twaver.Grid, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 总线（母线）类
 */
topo.BusNode = function (id) {
    topo.TextNode.superClass.constructor.call(this, id);
    this.setSize(500, 8);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "rectangle");
    this.setStyle('vector.fill.color', "#ffff00");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.BusNode', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 横线
 */
topo.HengXian = function (id) {
    topo.HengXian.superClass.constructor.call(this, id);
    this.setSize(40, 1);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "rectangle");
    this.setStyle('vector.fill.color', "#ffcc00");
    this.setStyle('label.color', '#FFFFFF');
    this.setStyle('label.position', 'top.top');
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.HengXian', twaver.Grid, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 竖线
 */
topo.ShuXian = function (id) {
    topo.ShuXian.superClass.constructor.call(this, id);
    this.setSize(1, 40);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "rectangle");
    this.setStyle('vector.fill.color', "#ffcc00");
    this.setStyle('label.color', '#FFFFFF');
    this.setStyle('label.position', 'right.right');
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.ShuXian', twaver.Grid, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 数据类
 */
topo.Text = function (id) {
    topo.Text.superClass.constructor.call(this, id);
    /* this.setStyle('body.type', 'none');*/
    this.setStyle('label.color', '#ffffff');
    this.setStyle('label.position', 'center');
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', 0);
    this.setStyle('label.font', Msg.topocfg.font12);
    /*this.setWidth(0);
     this.setHeight(0);*/
    this.setImage("toumingpic");
    this.setName('Text');
};
twaver.Util.ext('topo.Text', twaver.Follower, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 子阵
 */
topo.ZiZhen = function (id) {
    topo.ZiZhen.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("zizhenr");
};
twaver.Util.ext('topo.ZiZhen', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 子阵小机
 */
topo.ZiZhenXJ = function (id) {
    topo.ZiZhen.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("zizhenxjr");
};
twaver.Util.ext('topo.ZiZhenXJ', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 三相
 */
topo.SanXiang = function (id) {
    topo.SanXiang.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    //this.setImage("sanxiangr");
    this.setImage("xbsjzt1");
};
twaver.Util.ext('topo.SanXiang', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 两相 ，两脚
 */
topo.LiangXiangLJ = function (id) {
    topo.LiangXiangLJ.superClass.constructor.call(this, id);
    this.setImage("xbljzt2");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.LiangXiangLJ', twaver.Node,{
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 两相 ，两脚
 */
topo.LiangXiangLJNew = function (id) {
    topo.LiangXiangLJNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("LiangXiangLJNew");
    this.setStyle('image.state', 'circle');
    this.setStyle('ljbAlign', this.getStyle("ljbAlign"));
    this.setClient('ljbAlign', this.getClient("ljbAlign"));
};
twaver.Util.ext('topo.LiangXiangLJNew', twaver.Follower,{
    serializeXml:function(serializer, newInstance){
        twaver.SerializationSettings.setPropertyType("angle","number");
        twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 两相 ，三脚
 */
topo.LiangXiangSJ = function (id) {
    topo.LiangXiangSJ.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    //this.setImage("liangxiangsjr");
    this.setImage("xbljzt1");
    this.setStyle('ljbAlign', this.getStyle("ljbAlign"));
    this.setClient('ljbAlign', this.getClient("ljbAlign"));
};
twaver.Util.ext('topo.LiangXiangSJ', twaver.Node,{
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 两相 ，三脚
 */
topo.LiangXiangSJNew = function (id) {
    topo.LiangXiangSJNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("LiangXiangSJNew");
    this.setStyle('image.state', 'circle');
    this.setStyle('ljbAlign', this.getStyle("ljbAlign"));
    this.setClient('ljbAlign', this.getClient("ljbAlign"));
};
twaver.Util.ext('topo.LiangXiangSJNew', twaver.Follower,{
    serializeXml:function(serializer, newInstance){
        twaver.SerializationSettings.setPropertyType("angle","number");
        twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

topo.LiangXiangsanjiao = function (id) {
    topo.LiangXiangsanjiao.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("LiangXiangsanjiao");
    this.setStyle('image.state', 'circle');
    this.setStyle('ljbAlign', this.getStyle("ljbAlign"));
    this.setClient('ljbAlign', this.getClient("ljbAlign"));
};
twaver.Util.ext('topo.LiangXiangsanjiao', twaver.Follower,{
    serializeXml:function(serializer, newInstance){
        twaver.SerializationSettings.setPropertyType("angle","number");
        twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

topo.LiangXiangsanjiao3D = function (id) {
    topo.LiangXiangsanjiao3D.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("LiangXiangsanjiao3D");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
    this.setStyle('ljbAlign', this.getStyle("ljbAlign"));
    this.setClient('ljbAlign', this.getClient("ljbAlign"));
};
twaver.Util.ext('topo.LiangXiangsanjiao3D', twaver.Follower,{
    serializeXml:function(serializer, newInstance){
        twaver.SerializationSettings.setPropertyType("angle","number");
        twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 断路器
 */
topo.DuanLuQi = function (id) {
    topo.DuanLuQi.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    //this.setImage("duanluqir");
    this.setImage("duanluqierror");
};
twaver.Util.ext('topo.DuanLuQi', twaver.Follower, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 断路器（主接线）
 */
topo.DuanLuQiZJX = function (id) {
    topo.DuanLuQi.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    //this.setImage("duanluqizjxr");
    this.setImage("duanluqizjxerror");
};
twaver.Util.ext('topo.DuanLuQiZJX', twaver.Follower, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 隔离刀闸
 */
topo.GeLiDaoZha = function (id) {
    topo.GeLiDaoZha.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    //this.setImage("GLDZ-HE");
    this.setImage("GLDZ-GUZHANG");
};
twaver.Util.ext('topo.GeLiDaoZha', twaver.Node, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 光字牌
 */
function HtmlGuangZiPaiLabelAttachment(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}
twaver.Util.ext(HtmlGuangZiPaiLabelAttachment, twaver.network.LabelAttachment, {
    updateMeasure: function () {
        var font = this.getFont('label.font');
        //var font = "30px arial, tahoma, helvetica, sans-serif";
        //alert(this.getElement().getClient("nodetypeid"))
        //var fontsize = this.getElement().getClient("labelfontsize")
        //var font = fontsize + "px" + " '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif";
        //var font = "16px '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif";
        var color = this.getStyle('label.color');
        var text = this.getLabel();
        this._contentDiv.innerHTML = text;

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);
        twaver.Util.setCSSStyle(this._contentDiv, "color", color);
        twaver.Util.setCSSStyle(this._contentDiv, "text-align", "center");
        /* console.info(this._contentDiv);*/
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        //twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});

function HtmlGuangZiPaiLabelNodeUI(network, element) {
    HtmlLabelNodeUI.superClass.constructor.call(this, network, element);
}
twaver.Util.ext(HtmlGuangZiPaiLabelNodeUI, twaver.network.NodeUI, {
    checkLabelAttachment: function () {
        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new HtmlGuangZiPaiLabelAttachment(this);
                this.addAttachment(this._labelAttachment);
            }
        } else {
            if (this._labelAttachment) {
                this.removeAttachment(this._labelAttachment);
                this._labelAttachment = null;
            }
        }
    }
});

topo.GuangZiPai = function (id) {
    topo.GuangZiPai.superClass.constructor.call(this, id);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "rectangle");
    //this.setStyle('vector.fill.color', "#00ff00");
    this.setStyle('vector.fill.color', "#808080");
    this.setStyle('vector.outline.color', "#666666");
    this.setStyle('vector.outline.width', 2);
    this.setStyle('vector.padding', 2);
    this.setStyle('label.color', "#000000");
    this.setStyle('label.position', "center");
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', 0);
    this.setStyle('label.font', Msg.topocfg.font18);
    //this.setStyle('lable.font', "30px arial, tahoma, helvetica, sans-serif");
    this.setName(Msg.topocfg.guangzipai);
    this.setSize(200, 40);
};
twaver.Util.ext('topo.GuangZiPai', twaver.Grid, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
    /*getElementUIClass: function () {
     return HtmlGuangZiPaiLabelNodeUI;
     }*/
});

/**
 * 箱变
 */
topo.XiangBian = function (id) {
    topo.XiangBian.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xiangbianr");
};
twaver.Util.ext('topo.XiangBian', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 数采
 */
topo.ShuJuCaiJiQi = function (id) {
    topo.ShuJuCaiJiQi.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("shujucaijiqir");
};
twaver.Util.ext('topo.ShuJuCaiJiQi', twaver.Node, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 交流汇流箱
 */
topo.JLHuiLiuXiang = function (id) {
    topo.JLHuiLiuXiang.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("jiaoliuhuiliuxiangr");
};
twaver.Util.ext('topo.JLHuiLiuXiang', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 交流汇流箱3D
 */
topo.JLHuiLiuXiang3D = function (id) {
    topo.JLHuiLiuXiang3D.superClass.constructor.call(this, id);
    this.setImage("jiaoliuhuiliuxiang3dr");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setName(Msg.topocfg.huiliuxiang);

};
twaver.Util.ext('topo.JLHuiLiuXiang3D', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 环境监测仪
 */
topo.HuJingJianCeYi = function (id) {
    topo.HuJingJianCeYi.superClass.constructor.call(this, id);
    this.setImage("huanjingyir");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);

};
twaver.Util.ext('topo.HuJingJianCeYi', twaver.Node, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 三相3D
 */
topo.SanXiang3D = function (id) {
    topo.SanXiang3D.superClass.constructor.call(this, id);
    //this.setImage("sanxiang3dr");
    this.setImage("xbsjft1");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setName(Msg.topocfg.xiangbian);

};
twaver.Util.ext('topo.SanXiang3D', twaver.Node, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 两相3D  ，两脚
 */
topo.LiangXiang3DLJ = function (id) {
    topo.LiangXiang3DLJ.superClass.constructor.call(this, id);
    //this.setImage("liangxiang3dljr");
    this.setImage("xbljft2");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setName(Msg.topocfg.xiangbian);

};
twaver.Util.ext('topo.LiangXiang3DLJ', twaver.Node, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 两相3D  ，三脚
 */
topo.LiangXiang3DSJ = function (id) {
    topo.LiangXiang3DSJ.superClass.constructor.call(this, id);
    //this.setImage("liangxiang3dsjr");
    this.setImage("xbljft1");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setName(Msg.topocfg.xiangbian);

};
twaver.Util.ext('topo.LiangXiang3DSJ', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 断路器3D
 */
topo.DuanLuQi3D = function (id) {
    topo.DuanLuQi3D.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("duanluqi3dr");

};
twaver.Util.ext('topo.DuanLuQi3D', twaver.Follower, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

function HtmlToPoLabelAttachment(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}
twaver.Util.ext(HtmlToPoLabelAttachment, twaver.network.LabelAttachment, {
    updateMeasure: function () {
        var font = this.getFont('label.font');
        //var font = "14px '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif";
        var fontsize = this.getElement().getClient("labelfontsize");
        /*	var font = fontsize + "px" + " '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif"*/
        var color = this.getStyle('label.color');
        var text = this.getLabel();
        if (text.indexOf("<br>") > -1) {
            var textarr = text.split("<br>");
            var texthtml = "";
            for (var i = 0; i < textarr.length; i++) {
                texthtml = texthtml + "<div>" + textarr[i] + "</div>";
            }
            this._contentDiv.innerHTML = texthtml;
        }
        else {
            this._contentDiv.innerHTML = text;
        }

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);
        twaver.Util.setCSSStyle(this._contentDiv, "color", color);
        twaver.Util.setCSSStyle(this._contentDiv, "text-align", "center");
        /* console.info(this._contentDiv);*/
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        //twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});

function HtmlLabelNodeUI(network, element) {
    HtmlLabelNodeUI.superClass.constructor.call(this, network, element);
}
twaver.Util.ext(HtmlLabelNodeUI, twaver.network.NodeUI, {
    checkLabelAttachment: function () {
        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new HtmlToPoLabelAttachment(this);
                this.addAttachment(this._labelAttachment);
            }
        } else {
            if (this._labelAttachment) {
                this.removeAttachment(this._labelAttachment);
                this._labelAttachment = null;
            }
        }
    }
});

/**
 * 跳转按钮
 */
topo.SkipButton = function (id) {
    topo.SkipButton.superClass.constructor.call(this, id);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "rectangle");
    this.setStyle('vector.outline.color', "#3e3e3e");
    this.setStyle('vector.outline.width', 1);
    this.setStyle('vector.fill.color', "#222222");
    this.setStyle('label.color', "#FFFFFF");
    this.setStyle('label.position', "center");
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', 0);
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setName(Msg.topocfg.skipbutton);
    this.setSize(120, 40);

};
twaver.Util.ext('topo.SkipButton', twaver.Grid, {
    getElementUIClass: function () {
        return HtmlLabelNodeUI;
    }
    /*serializeXml:function(serializer, newInstance){
     twaver.SerializationSettings.setPropertyType("angle","number");
     twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
     this.serializePropertyXml(serializer, "angle", newInstance);
     }*/
});


function HtmlLabelAttachmentChart(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}
twaver.Util.ext(HtmlLabelAttachmentChart, twaver.network.LabelAttachment, {
    updateMeasure: function () {
        var font = this.getFont('label.font');
        var text = this.getLabel();
        var color = this.getStyle('label.color');
        this._contentDiv.innerHTML = text;

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);
        twaver.Util.setCSSStyle(this._contentDiv, "color", color);
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
//        twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});


function chartNodeUI(network, element) {
    chartNodeUI.superClass.constructor.call(this, network, element);
}
twaver.Util.ext(chartNodeUI, twaver.network.NodeUI, {
    checkAttachments: function () {
        twaver.network.NodeUI.prototype.checkAttachments.call(this);
        this.checkComponentAttachment();
    },
    checkComponentAttachment: function () {
        if (!this._componentAttachment && this._element.getStyle('component.content')) {
            this._componentAttachment = new HtmlComponentAttachment(this);
            this.addAttachment(this._componentAttachment);
        }
    },
    checkLabelAttachment: function () {
        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new HtmlLabelAttachmentChart(this);
                this.addAttachment(this._labelAttachment);
            }
        } else {
            if (this._labelAttachment) {
                this.removeAttachment(this._labelAttachment);
                this._labelAttachment = null;
            }
        }
    },
    checkAlarmAttachment: function () {
        var label = this._network.getAlarmLabel(this._element);
        if (label != null && label !== "") {
            if (!this._alarmAttachment) {
                this._alarmAttachment = new HtmlAlarmAttachment(this, false);
                this.addAttachment(this._alarmAttachment);
            }
        } else {
            if (this._alarmAttachment) {
                this.removeAttachment(this._alarmAttachment);
                this._alarmAttachment = null;
            }
        }
    },
    drawBody: function () {
    }
});
function chartNode(id) {
    chartNode.superClass.constructor.call(this, id);

}
twaver.Util.ext(chartNode, twaver.Node, {
    getElementUIClass: function () {
        return chartNodeUI;
    }
});


var dafatCharValue = ["00", "", "", "", "", "", "", "", "", "", "", "", "01", "", "", "", "", "", "", "", "", "", "", "", "02", "", "", "", "", "", "", "", "", "", "", "", "03", "", "", "", "", "", "", "", "", "", "", "", "04", "", "", "", "", "", "", "", "", "", "", "", "05", "", "", "", "", "", "", "", "", "", "", "", "06", "", "", "", "", "", "", "", "", "", "", "", "07", "", "", "", "", "", "", "", "", "", "", "", "08", "", "", "", "", "", "", "", "", "", "", "", "09", "", "", "", "", "", "", "", "", "", "", "", "10", "", "", "", "", "", "", "", "", "", "", "", "11", "", "", "", "", "", "", "", "", "", "", "", "12", "", "", "", "", "", "", "", "", "", "", "", "13", "", "", "", "", "", "", "", "", "", "", "", "14", "", "", "", "", "", "", "", "", "", "", "", "15", "", "", "", "", "", "", "", "", "", "", "", "16", "", "", "", "", "", "", "", "", "", "", "", "17", "", "", "", "", "", "", "", "", "", "", "", "18", "", "", "", "", "", "", "", "", "", "", "", "19", "", "", "", "", "", "", "", "", "", "", "", "20", "", "", "", "", "", "", "", "", "", "", "", "21", "", "", "", "", "", "", "", "", "", "", "", "22", "", "", "", "", "", "", "", "", "", "", "", "23", "", "", "", "", "", "", "", "", "", "", ""];
var realCharValue = ["00:00", "00:05", "00:10", "00:15", "00:20", "00:25", "00:30", "00:35", "00:40", "00:45", "00:50", "00:55", "01:00", "01:05", "01:10", "01:15", "01:20", "01:25", "01:30", "01:35", "01:40", "01:45", "01:50", "01:55", "02:00", "02:05", "02:10", "02:15", "02:20", "02:25", "02:30", "02:35", "02:40", "02:45", "02:50", "02:55", "03:00", "03:05", "03:10", "03:15", "03:20", "03:25", "03:30", "03:35", "03:40", "03:45", "03:50", "03:55", "04:00", "04:04", "04:10", "04:15", "04:20", "04:25", "04:30", "04:35", "04:40", "04:45", "04:50", "04:55", "05:00", "05:05", "05:10", "05:15", "05:20", "05:25", "05:30", "05:35", "05:40", "05:45", "05:50", "05:55", "06:00", "06:05", "06:10", "06:15", "06:20", "06:25", "06:30", "06:35", "06:40", "06:45", "06:50", "06:55", "07:00", "07:05", "07:10", "07:15", "07:20", "07:25", "07:30", "07:35", "07:40", "07:45", "07:50", "07:55", "08:00", "08:05", "08:10", "08:15", "08:20", "08:25", "08:30", "08:35", "08:40", "08:45", "08:50", "08:55", "09:00", "09:05", "09:10", "09:15", "09:20", "09:25", "09:30", "09:35", "09:40", "09:45", "09:50", "09:55", "10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55", "11:00", "11:05", "11:10", "11:15", "11:20", "11:25", "11:30", "11:35", "11:40", "11:45", "11:50", "11:55", "12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30", "12:35", "12:40", "12:45", "12:50", "12:55", "13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30", "13:35", "13:40", "13:45", "13:50", "13:55", "14:00", "14:05", "14:10", "14:15", "14:20", "14:25", "14:30", "14:35", "14:40", "14:45", "14:50", "14:55", "15:00", "15:05", "15:10", "15:15", "15:20", "15:25", "15:30", "15:35", "15:40", "15:45", "15:50", "15:55", "16:00", "16:05", "16:10", "16:15", "16:20", "16:25", "16:30", "16:35", "16:40", "16:45", "16:50", "16:55", "17:00", "17:05", "17:10", "17:15", "17:20", "17:25", "17:30", "17:35", "17:40", "17:45", "17:50", "17:55", "18:00", "18:05", "18:10", "18:15", "18:20", "18:25", "18:30", "18:35", "18:40", "18:45", "18:50", "18:55", "19:00", "19:05", "19:10", "19:15", "19:20", "19:25", "19:30", "19:35", "19:40", "19:45", "19:50", "19:55", "20:00", "20:05", "20:10", "20:15", "20:20", "20:25", "20:30", "20:35", "20:40", "20:45", "20:50", "20:55", "21:00", "21:05", "21:10", "21:15", "21:20", "21:25", "21:30", "21:35", "21:40", "21:45", "21:50", "21:55", "22:00", "22:05", "22:10", "22:15", "22:20", "22:25", "22:30", "22:35", "22:40", "22:45", "22:50", "22:55", "23:00", "23:05", "23:10", "23:15", "23:20", "23:25", "23:30", "23:35", "23:40", "23:45", "23:50", "23:55"];
/**
 * 注册实体 曲线图
 */
topo.circleChart = function (id) {
    topo.circleChart.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#FFFFFF");
    this.setStyle('component.fillcolor', 'transparent'); //设置背景色
//	this.setStyle('component.fillcolor', '#071f30');
    this.setStyle('component.position', 'topright');  //设置位置
    this.setStyle('component.direction', 'aboveright');
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.position', 'right.right');
    this.setStyle('component.pointer.length', 1);
    this.setStyle('component.pointer.width', 1);
    this.setStyle('label.yoffset', -8);
    this.setStyle('label.xoffset', 40);
    this.lineChart = new twaver.charts.LineChart();
//	this.lineChart.setXAxisText("分钟"); //设置x轴名字
    this.lineChart.setXAxisTextColor("red");//设置x轴名字颜色
    this.lineChart.setYAxisTextColor('white');//设置Y轴名字颜色
    this.lineChart.setYScaleTextColor("#FFFFFF");//设置Y轴坐标上的颜色
    this.lineChart.setXScaleTextColor("#FFFFFF");//设置X轴坐标上的颜色
    this.lineChart.isInterruptable(false); //设置是否可截断
    this.lineChart.setYScaleMinTextVisible(true);
    this.lineChart.setYScaleValueGap(2); //设置y轴间距
    this.lineChart.setLowerLimit(0); //设置y轴最小值
    this.lineChart.setUpperLimit(10); //设置y轴最大值
    this.lineChart.setFocusOnClick(false);
    this.lineChart.setMaxZoom(1);//设置最大放大倍数
    this.lineChart.setMinZoom(1);
    this.lineChart.setInterruptable(true);//设置不连续
    this.lineChart.setValueVisible(false);//线上是否显示值
    this.lineChart.setYScaleLineWidth(0);//设置y轴网格线宽度

    this.lineChart.setXScaleLineWidth(0);//设置x轴网格线宽度
    this.setStyle('component.width', 500);
    this.setStyle('component.height', 300);
    this.setStyle('circleChart.color', 'white');
    this.lineChart.getView().style.width = 500 + "px";//这种曲线图宽度
    this.lineChart.getView().style.height = 300 + "px";//这种曲线图高度

    this.lineChart.formatValueText = function (value) {
        return value + '';
    };
    this.lineChart.addToolTipInfo = function (x, y, w, h, value, data, index) {
        if (value == 'undefined' || !value) {
            value = "";
        }
        this._toolTipInfos && this._toolTipInfos.add({
            data: data,
            rect: {x: x, y: y, width: w, height: h},
            value: Msg.circleChart.chartTime + "：" + realCharValue[index] + "<br/>" + Msg.circleChart.chartValue + "：" + value,
            index: index
        })
    };

    var developedElement = new twaver.Element();
    developedElement.setName('circleChart');
    developedElement.setStyle('chart.color', 'white');//设置线条颜色
    developedElement.setStyle('chart.value.color', 'white');
    developedElement.setStyle('chart.marker.shape', 'circle');//设置描点形状
    developedElement.setStyle('chart.marker.size', 5);//设置点大小
    developedElement.setStyle('chart.marker.color', 'red');//设置点大小
    developedElement.setStyle('chart.values', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 3, 4]);//修改数据
    this.lineChart.getDataBox().add(developedElement);
    this.lineChart.setXScaleTexts(new twaver.List(dafatCharValue));//x轴
    this.setStyle('component.content', this.lineChart.getView());

};
twaver.Util.ext('topo.circleChart', twaver.Node, {
    getElementUIClass: function () {
        return chartNodeUI;
    },
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setStyleType("component.width", "cdata");
        twaver.SerializationSettings.setStyleType("component.height", "cdata");
        twaver.SerializationSettings.setStyleType("component.fillcolor", "cdata");
        twaver.SerializationSettings.setStyleType("circleChart.color", "cdata");
        twaver.Node.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "component.width", newInstance);
        this.serializePropertyXml(serializer, "component.height", newInstance);
        this.serializePropertyXml(serializer, "component.fillcolor", newInstance);
        this.serializePropertyXml(serializer, "circleChart.color", newInstance);
    }
});

/**
 *  图片
 */
topo.ImageNode = function (id) {
    topo.ImageNode.superClass.constructor.call(this, id);
    this.setImage("imagenoder");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.ImageNode', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  接地开关（左）
 */
topo.JieDiKaiGuanZuo = function (id) {
    topo.JieDiKaiGuanZuo.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setStyle('label.yoffset', -12);
    this.setHeight(48);
    this.setWidth(48);
    //this.setImage("jiedikaiguanzuor");
    this.setImage("jiedikaiguanzuoerror");
};
twaver.Util.ext('topo.JieDiKaiGuanZuo', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  接地开关（右）
 */
topo.JieDiKaiGuanYou = function (id) {
    topo.JieDiKaiGuanYou.superClass.constructor.call(this, id);
    this.setImage("jiedikaiguanyour");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setStyle('label.yoffset', -12);
};
twaver.Util.ext('topo.JieDiKaiGuanYou', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  隔离刀闸（上）
 */
topo.GeLiDaoZhaShang = function (id) {
    topo.GeLiDaoZhaShang.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "left.left");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setStyle('label.xoffset', 12);
    this.setImage("gelidaozhashangr");
};
twaver.Util.ext('topo.GeLiDaoZhaShang', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  隔离刀闸（下）
 */
topo.GeLiDaoZhaXia = function (id) {
    topo.GeLiDaoZhaXia.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "left.left");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setStyle('label.xoffset', 12);
    this.setImage("gelidaozhaxiar");
};
twaver.Util.ext('topo.GeLiDaoZhaXia', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  地线（右）
 */
topo.DiXianYou = function (id) {
    topo.DiXianYou.superClass.constructor.call(this, id);
    this.setImage("dixianyour");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setWidth(18);
    this.setHeight(48);
};
twaver.Util.ext('topo.DiXianYou', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  地线（左）
 */
topo.DiXianZuo = function (id) {
    topo.DiXianZuo.superClass.constructor.call(this, id);
    this.setImage("dixianzuor");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.DiXianZuo', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  上箭头
 */
topo.ShangJianTou = function (id) {
    topo.ShangJianTou.superClass.constructor.call(this, id);
    this.setImage("shangjiantour");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setWidth(12);
    this.setHeight(49);
};
twaver.Util.ext('topo.ShangJianTou', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  上箭头new
 */
topo.ShangJianTouNew = function (id) {
    topo.ShangJianTouNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("UpArrow");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.ShangJianTouNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  下箭头
 */
topo.XiaJianTou = function (id) {
    topo.XiaJianTou.superClass.constructor.call(this, id);
    this.setImage("xiajiantour");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.XiaJianTou', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  连线
 */
topo.Link = function (id) {
    topo.Link.superClass.constructor.call(this, id);
    this.setStyle('link.corner', "none");
    this.setStyle('link.color', "#ffff00");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setStyle('link.width', 1);
};
twaver.Util.ext('topo.Link', twaver.Link, {
    /* getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  连线
 */
topo.ShapeLink = function (id, fromnode, tonode) {
    topo.ShapeLink.superClass.constructor.call(this, id, fromnode, tonode);
    this.setStyle('link.corner', "none");
    this.setStyle('link.color', "#ffff00");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setStyle('link.width', 1);
};
twaver.Util.ext('topo.Link', twaver.ShapeLink, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 功率调节
 */
topo.PowerRegulation = function (id) {
    topo.PowerRegulation.superClass.constructor.call(this, id);
    this.setImage("powerRegulation");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.PowerRegulation', twaver.Node, {});

/**
 * PID
 */
topo.pidTopo = function (id) {
    topo.PowerRegulation.superClass.constructor.call(this, id);
    this.setImage("pidTopoImg");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.pidTopo', twaver.Node, {});

/**
 * PID3D
 */
topo.pidTopo3D = function (id) {
    topo.PowerRegulation.superClass.constructor.call(this, id);
    this.setImage("pidTopoImg3D");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setName(Msg.topocfg.pidTopo);
    this.setSize(128, 128);
};
twaver.Util.ext('topo.pidTopo3D', twaver.Node, {});

/**
 *  箱变电表
 */
topo.DianBiao = function (id) {
    topo.DianBiao.superClass.constructor.call(this, id);
    this.setImage("dianbiaor");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.DianBiao', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  关口电表
 */
topo.gkDianBiao = function (id) {
    topo.gkDianBiao.superClass.constructor.call(this, id);
    this.setImage("gk_dianbiaor");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.gkDianBiao', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  汇集站线路电表
 */
topo.hjzDianBiao = function (id) {
    topo.hjzDianBiao.superClass.constructor.call(this, id);
    this.setImage("hjz_dianbiaor");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.hjzDianBiao', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  厂用电生产区电表
 */
topo.cydFactoryDianBiao = function (id) {
    topo.cydFactoryDianBiao.superClass.constructor.call(this, id);
    this.setImage("cyd_factorydianbiaor");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.cydFactoryDianBiao', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  厂用电非生产区电表
 */
topo.cydFactoryNonDianBiao = function (id) {
    topo.cydFactoryNonDianBiao.superClass.constructor.call(this, id);
    this.setImage("cyd_factorynondianbiaor");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.cydFactoryNonDianBiao', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  逆变器开关
 */
topo.NiBianQiKaiGuan = function (id) {
    topo.NiBianQiKaiGuan.superClass.constructor.call(this, id);
    //this.setImage("nibianqikaiguanr");
    this.setImage("NBQkgerror");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font14);
};
twaver.Util.ext('topo.NiBianQiKaiGuan', twaver.Follower, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 *  不规则图形
 */
topo.ShapeNode = function (id) {
    topo.ShapeNode.superClass.constructor.call(this, id);
    /*this.setStyle('label.color', "#ffffff");
     this.setStyle('label.position', "bottom.bottom");
     this.setStyle('label.font', Msg.topocfg.font14);*/

    this.setStyle('vector.outline.width', 2);
    this.setStyle('vector.fill', true);
    this.setStyle('vector.fill.color', "#efa110");
    this.setStyle('vector.outline.color', "#FFFFFF");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setStyle('whole.alpha', 0.8);
};
twaver.Util.ext('topo.ShapeNode', twaver.ShapeNode, {});

/**
 * PT
 */
topo.PT = function (id) {
    topo.PT.superClass.constructor.call(this, id);
    this.setImage("ptr");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);

};
twaver.Util.ext('topo.PT', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});
topo.PT1 = function (id) {
    topo.PT.superClass.constructor.call(this, id);
    this.setImage("pt1");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);

};
twaver.Util.ext('topo.PT1', twaver.Node, {
    /*getElementUIClass: function () {
     return CommonHtmlLabelNodeUI;
     }*/
});

/**
 * 箱变-两卷变1
 */
topo.XBLJZT1 = function (id) {
    topo.XBLJZT1.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xbljzt1");
};
twaver.Util.ext('topo.XBLJZT1', twaver.Node, {});
/**
 * 箱变-两卷变1（箱变分图）
 */
topo.XBLJFT1 = function (id) {
    topo.XBLJFT1.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("xbljft1");
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT1', twaver.Node, {});
/**
 * 箱变-两卷变2
 */
topo.XBLJZT2 = function (id) {
    topo.XBLJZT2.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xbljzt2");
};
twaver.Util.ext('topo.XBLJZT2', twaver.Node, {});
/**
 * 箱变-两卷变2（箱变分图）
 */
topo.XBLJFT2 = function (id) {
    topo.XBLJFT2.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("xbljft2");
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT2', twaver.Node, {});
/**
 * 箱变-两卷变3
 */
topo.XBLJZT3 = function (id) {
    topo.XBLJZT3.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xbljzt3");
};
twaver.Util.ext('topo.XBLJZT3', twaver.Node, {});
/**
 * 箱变-两卷变3（箱变分图）
 */
topo.XBLJFT3 = function (id) {
    topo.XBLJFT3.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("xbljft3");
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT3', twaver.Node, {});
/**
 * 箱变-两卷变4
 */
topo.XBLJZT4 = function (id) {
    topo.XBLJZT4.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xbljzt4");
};
twaver.Util.ext('topo.XBLJZT4', twaver.Node, {});
/**
 * 箱变-两卷变4（箱变分图）
 */
topo.XBLJFT4 = function (id) {
    topo.XBLJFT4.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("xbljft4");
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT4', twaver.Node, {});
/**
 * 箱变-两卷变5
 */
topo.XBLJZT5 = function (id) {
    topo.XBLJZT5.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xbljzt5");
};
twaver.Util.ext('topo.XBLJZT5', twaver.Node, {});
/**
 * 箱变-两卷变5（箱变分图）
 */
topo.XBLJFT5 = function (id) {
    topo.XBLJFT5.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("xbljft5");
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT5', twaver.Node, {});
/**
 * 箱变-三卷变1
 */
topo.XBSJZT1 = function (id) {
    topo.XBSJZT1.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xbsjzt1");
};
twaver.Util.ext('topo.XBSJZT1', twaver.Node, {});
/**
 * 箱变-三卷变1（箱变分图）
 */
topo.XBSJFT1 = function (id) {
    topo.XBSJFT1.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("xbsjft1");
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT1', twaver.Node, {});
/**
 * 箱变-三卷变2
 */
topo.XBSJZT2 = function (id) {
    topo.XBSJZT2.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xbsjzt2");
};
twaver.Util.ext('topo.XBSJZT2', twaver.Node, {});
/**
 * 箱变-三卷变2（箱变分图）
 */
topo.XBSJFT2 = function (id) {
    topo.XBSJFT2.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("xbsjft2");
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT2', twaver.Node, {});
/**
 * 箱变-三卷变3
 */
topo.XBSJZT3 = function (id) {
    topo.XBSJZT3.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xbsjzt3");
};
twaver.Util.ext('topo.XBSJZT3', twaver.Node, {});
/**
 * 箱变-三卷变3（箱变分图）
 */
topo.XBSJFT3 = function (id) {
    topo.XBSJFT3.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("xbsjft3");
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT3', twaver.Node, {});
/**
 * 箱变-三卷变4
 */
topo.XBSJZT4 = function (id) {
    topo.XBSJZT4.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xbsjzt4");
};
twaver.Util.ext('topo.XBSJZT4', twaver.Node, {});
/**
 * 箱变-三卷变4（箱变分图）
 */
topo.XBSJFT4 = function (id) {
    topo.XBSJFT4.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("xbsjft4");
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT4', twaver.Node, {});
/**
 * 箱变-三卷变5
 */
topo.XBSJZT5 = function (id) {
    topo.XBSJZT5.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xbsjzt5");
};
twaver.Util.ext('topo.XBSJZT5', twaver.Node, {});
/**
 * 箱变-三卷变5（箱变分图）
 */
topo.XBSJFT5 = function (id) {
    topo.XBSJFT5.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("xbsjft5");
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT5', twaver.Node, {});
/**
 * 箱变-三卷变6
 */
topo.XBSJZT6 = function (id) {
    topo.XBSJZT5.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xbsjzt6");
};
twaver.Util.ext('topo.XBSJZT6', twaver.Node, {});
/**
 * 箱变-三卷变6（箱变分图）
 */
topo.XBSJFT6 = function (id) {
    topo.XBSJFT5.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setImage("xbsjft6");
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT6', twaver.Node, {});

/**
 * 通关机
 */
topo.TGJ = function (id) {
    topo.TGJ.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setStyle('label.xoffset', -70);
    this.setImage("tgjd");
};
twaver.Util.ext('topo.TGJ', twaver.Node, {});

/**
 * 避雷针
 */
topo.BiLeiZhen = function (id) {
    topo.BiLeiZhen.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("bileizhenr");
    this.setWidth(11);
    this.setHeight(30);
};
twaver.Util.ext('topo.BiLeiZhen', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 带电装置
 */
topo.DaiDianZZ = function (id) {
    topo.DaiDianZZ.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("daidianzzr");
    this.setHeight(20);
    this.setWidth(20);
};
twaver.Util.ext('topo.DaiDianZZ', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 电容
 */
topo.DianRong = function (id) {
    topo.DianRong.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("dianrongr");
    this.setWidth(30);
    this.setHeight(21);
};
twaver.Util.ext('topo.DianRong', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 电抗
 */
topo.DianKang = function (id) {
    topo.DianKang.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("diankangr");
    this.setWidth(16);
    this.setHeight(30);
};
twaver.Util.ext('topo.DianKang', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 分裂电抗
 */
topo.FLDianKang = function (id) {
    topo.FLDianKang.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("fldiankangr");
    this.setWidth(22);
    this.setHeight(30);
};
twaver.Util.ext('topo.FLDianKang', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 电感
 */
topo.DianGan = function (id) {
    topo.DianGan.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setWidth(31);
    this.setHeight(11);
    this.setImage("dianganr");
};
twaver.Util.ext('topo.DianGan', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 手车
 */
topo.ShouChe = function (id) {
    topo.ShouChe.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setWidth(23);
    this.setHeight(106);
    //this.setImage("shoucher");
    this.setImage("shouchemr");
};
twaver.Util.ext('topo.ShouChe', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 单手车分
 */
topo.danshouchefen = function (id) {
    topo.danshouchefen.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("sh_sigle_Hand-car_break-off");
    this.setStyle('image.state', 'circle');
    this.setStyle('wholeColorzdy', '#00ff26');
    this.setClient('wholeColorzdy', '#00ff26');
    //this.setName(Msg.stationStatusConfig.danshouchefen);
};
twaver.Util.ext('topo.danshouchefen', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 远控/就地
 */
topo.YuanKong = function (id) {
    topo.YuanKong.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setHeight(32);
    this.setWidth(32);
    //this.setImage("yuankongr");
    this.setImage("yuankongmr");
};
twaver.Util.ext('topo.YuanKong', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 新的远控/就地
 */
topo.YuanKongNew = function (id) {
    topo.YuanKongNew.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("jiudiNew");
};
twaver.Util.ext('topo.YuanKongNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 更新的远控/就地
 */
topo.RemoteNew = function (id) {
    topo.RemoteNew.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("localNew");
};
twaver.Util.ext('topo.RemoteNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 属性表单
 */
topo.PropertySheet = function (dataBox) {
    topo.PropertySheet.superClass.constructor.call(this, dataBox);
    this.setBorderColor("none");
    this.setRowHeight(35);
    this.setSelectColor("none");
    this.setCategorizable(false);
    this._view.style.minWidth = '400px';
};
twaver.Util.ext('topo.PropertySheet', twaver.controls.PropertySheet, {
    adjustWidth: function () {
        twaver.controls.PropertySheet.prototype.adjustWidth.call(this);
        //this._view.style.overflowX = "auto";
    },
    onCategoryRendered: function (div, categoryName) {
        div.style.backgroundColor = "none";    //232323
        div.style.color = "#c0c0c0";
        div.style.fontSize = "14px";
        div.style.fontFamily = Msg.topocfg.fontclass;
        div.style.border = "none";

    },

    updateCurrentRowIndex: function (newIndex) {
        var self = this;
        twaver.controls.PropertySheet.prototype.updateCurrentRowIndex.apply(this, arguments);
        var params = this._rowList.get(newIndex);
        var pro = null;
        if (params) {
            pro = params.property;
        }
        if (this._currentEditor) {
            this._currentEditor.style.background = "#001f41";
            this._currentEditor.style.padding = "1px 1px 1px 1px";
            this._currentEditor.style.color = "#c0c0c0";
            this._currentEditor.style.fontSize = "14px";
            this._currentEditor.style.fontFamily = Msg.topocfg.fontclass;
            if (pro) {
                if (pro._propertyName == "label.color" || pro._propertyName == "link.color"
                    || pro._propertyName == "vector.outline.color" || pro._propertyName == "vector.fill.color"
                    || pro._propertyName == "component.fillcolor" || pro._propertyName == "grid.fill.color"
                    || pro._propertyName == "circleChart.color") {
                    var $v = $(this._currentEditor);
                    $v.attr("readonly", true);
                    $v.colpick({
                        colorScheme: 'dark',
                        onSubmit: function (hsb, hex, rgb, el) {
                            var strcol = "#" + hex;
                            if (pro._propertyName == "circleChart.color") {
                                self._currentData.setStyle(pro._propertyName, strcol);
                                self._currentData.lineChart.getDataBox()._dataList.forEach(function (datas) {
                                    datas.setStyle('chart.color', strcol);
                                });
                                self._currentData.lineChart.setXScaleTexts(new twaver.List(dafatCharValue));//x轴
                                self._currentData.setStyle('component.content', self._currentData.lineChart.getView());
                            } else {
                                self._currentData.setStyle(pro._propertyName, strcol);
                            }
                            $v.colpickHide();
                        }
                    });
                }
                if (pro._propertyName == "name") {
                    if (self._currentData instanceof topo.SkipButton || self._currentData instanceof topo.IndexNode || self._currentData instanceof topo.StatusButton) {
                        var $ve = $(this._currentEditor);
                        $ve.attr("title", Msg.topocfg.skiptip);
                    }
                    else if (self._currentData instanceof topo.Text) {
                        var $ve = $(this._currentEditor);
                        $ve.attr("title", Msg.topocfg.oneormorechar);
                    }
                    else {
                        var $ve = $(this._currentEditor);
                        $ve.attr("title", Msg.topocfg.nomorechar);
                    }
                }
                if ((pro._propertyName == "grid.column.count")) {         //表格 1-50
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.tablecheck);
                }
                if ((pro._propertyName == "grid.row.count")) {            //表格   1-50
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.tablecheck);
                }
                if ((pro._propertyName == "label.xoffset")) {            //标签 x   -100 - 100
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.nodeprocheck);
                }
                if ((pro._propertyName == "label.yoffset")) {            //标签 y    -100 - 100
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.nodeprocheck);
                }
                if ((pro._propertyName == "link.width")) {               // 连线宽度 0 - 100
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.linkprocheck);
                }
                if ((pro._propertyName == "link.from.xoffset")) {        //连线起点x   -100 - 100
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.nodeprocheck);
                }
                if ((pro._propertyName == "link.from.yoffset")) {        //连线起点y   -100 - 100
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.nodeprocheck);
                }
                if ((pro._propertyName == "link.to.xoffset")) {          //连线终点 x   -100 - 100
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.nodeprocheck);
                }
                if ((pro._propertyName == "link.to.yoffset")) {          //连线终点y   -100 - 100
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.nodeprocheck);
                }
                if ((pro._propertyName == "link.extend")) {
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.linkprocheck);
                }
                if (((pro._propertyName == "width")) && ((self._currentData instanceof topo.HengXian)
                    || (self._currentData instanceof topo.ShuXian))) {
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.xianwidthcheck);
                }
                if (((pro._propertyName == "height")) && ((self._currentData instanceof topo.HengXian)
                    || (self._currentData instanceof topo.ShuXian))) {
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.xianheightcheck);
                }
                if (pro._propertyName == "component.height") {          //曲线高度
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.circlenodeHeightprocheck);
                }
                if (pro._propertyName == "component.width") {          //曲线宽度
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.circlenodeWidthprocheck);
                }
                if (pro._propertyName == "grid.border" || pro._propertyName == "grid.deep" || pro._propertyName == "grid.padding"
                    || pro._propertyName == "grid.cell.deep") {          //表格属性
                    var $ve = $(this._currentEditor);
                    $ve.attr("title", Msg.topocfg.tableprocheck);
                }
            }
        }
    },


    onNameRendered: function (params) {
        params.rowDiv.style.border = "none";
        params.rowDiv.style.color = "#c0c0c0";
        params.rowDiv.style.backgroundColor = "none";   //#051733
        params.rowDiv.style.fontSize = "14px";
        params.rowDiv.style.fontFamily = Msg.topocfg.fontclass;
        params.nameRender.style.border = "none";
        params.nameRender.style.textAlign = "right";
        params.nameRender.style.margin = "0px 0px 0px -5px"
        params.nameRender.style.height = "28px";
    },

    onValueRendered: function (params) {
        var pro = params.property;
        if (pro.isEditable()) {
            params.valueRender.style.backgroundColor = "none";
        }
        else {
            params.valueRender.style.backgroundColor = "#001f41";
        }
        params.valueRender.style.border = "1px solid #247ed3";
        params.valueRender.style.height = "28px";
        params.valueRender.style.width = "150px";
    },

    handlePropertyChange: function (e) {
        var valflag = true;
        if (e.property == "name") {
            var newvalue = e.newValue;
            if ((newvalue != null) && (newvalue != undefined)) {
                newvalue = newvalue.replace(/(^\s*)|(\s*$)/g, "");
            }
            if (((newvalue == "") || ((newvalue != "") && (newvalue.length > 32))) && (e.source instanceof topo.Text)) {
                var valuetemp = e.oldValue ? e.oldValue : "Text";
                this._currentData.setName(valuetemp);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else if ((newvalue != "") && (newvalue.length > 32)) {
                var valuetemp = e.newValue.substr(0, 32);
                this._currentData.setName(valuetemp);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                valflag = true;
            }
        }
        else if (e.property == "S:label.xoffset") {
            var newvalue = e.newValue;
            if ((isNaN(newvalue)) || (newvalue > 100) || (newvalue < -100)) {
                this._currentData.setStyle("label.xoffset", e.oldValue ? e.oldValue : 0);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                valflag = true;
            }
        }
        else if (e.property == "S:label.yoffset") {
            var newvalue = e.newValue;
            if ((isNaN(newvalue)) || (newvalue > 100) || (newvalue < -100)) {
                this._currentData.setStyle("label.yoffset", e.oldValue ? e.oldValue : 0);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                valflag = true;
            }
        }
        else if (e.property == "S:link.width") {
            var newvalue = e.newValue;
            if ((isNaN(newvalue)) || (newvalue > 100) || (newvalue <= 0)) {
                this._currentData.setStyle("link.width", e.oldValue ? e.oldValue : 1);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                valflag = true;
            }
        }
        else if (e.property == "S:link.from.xoffset") {
            var newvalue = e.newValue;
            if ((isNaN(newvalue)) || (newvalue > 100) || (newvalue < -100)) {
                this._currentData.setStyle("link.from.xoffset", e.oldValue ? e.oldValue : 0);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                valflag = true;
            }
        }
        else if (e.property == "S:link.from.yoffset") {
            var newvalue = e.newValue;
            var oldValue = e.oldValue;
            if ((isNaN(newvalue)) || (newvalue > 100) || (newvalue < -100)) {
                this._currentData.setStyle("link.from.yoffset", e.oldValue ? e.oldValue : 0);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                valflag = true;
            }
        }
        else if (e.property == "S:link.to.xoffset") {
            var newvalue = e.newValue;
            if ((isNaN(newvalue)) || (newvalue > 100) || (newvalue < -100)) {
                this._currentData.setStyle("link.to.xoffset", e.oldValue ? e.oldValue : 0);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                valflag = true;
            }
        }
        else if (e.property == "S:link.to.yoffset") {
            var newvalue = e.newValue;
            if ((isNaN(newvalue)) || (newvalue > 100) || (newvalue < -100)) {
                this._currentData.setStyle("link.to.yoffset", e.oldValue ? e.oldValue : 0);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                valflag = true;
            }
        }
        else if (e.property == "S:grid.border" || e.property == "S:grid.deep" || e.property == "S:grid.padding"
            || e.property == "S:grid.cell.deep") {
            var property = e.property;
            var property = property.substr(2, property.length);
            var newvalue = e.newValue;
            if ((isNaN(newvalue)) || (newvalue > 10) || (newvalue < -10)) {
                this._currentData.setStyle(property, e.oldValue ? e.oldValue : 0);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                valflag = true;
            }
        }
        else if (e.property == "S:link.extend") {
            var newvalue = e.newValue;
            if ((isNaN(newvalue)) || (newvalue > 100) || (newvalue < 1)) {
                this._currentData.setStyle("link.extend", e.oldValue ? e.oldValue : 0);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                valflag = true;
            }
        }
        else if (e.property == "S:component.height") {
            var newvalue = e.newValue;
            if ((isNaN(newvalue)) || (newvalue > 800) || (newvalue < 100)) {
                this._currentData.setStyle("component.height", e.oldValue ? e.oldValue : 500);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                this._currentData.lineChart.getView().style.height = newvalue + 'px';
                this._currentData.lineChart.setXScaleTexts(new twaver.List(dafatCharValue));//x轴
                this._currentData.setStyle('component.content', this._currentData.lineChart.getView());
                valflag = true;
            }
        } else if (e.property == "S:component.width") {
            var newvalue = e.newValue;
            if ((isNaN(newvalue)) || (newvalue > 1200) || (newvalue < 100)) {
                this._currentData.setStyle("component.width", e.oldValue ? e.oldValue : 500);
                this._box.getSelectionModel().appendSelection(this._currentData);
                valflag = false;
            }
            else {
                this._currentData.lineChart.getView().style.width = newvalue + 'px';
                this._currentData.lineChart.setXScaleTexts(new twaver.List(dafatCharValue));//x轴
                this._currentData.setStyle('component.content', this._currentData.lineChart.getView());
                valflag = true;
            }
        }
        else {
            valflag = true;
        }
        if ((this._currentData === e.source) && valflag) {
            this.invalidate();
        }
    }
});

/**
 * 电站状态
 */
topo.StatusButton = function (id) {
    topo.StatusButton.superClass.constructor.call(this, id);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "circle");
    this.setStyle('vector.outline.width', 2);
    this.setStyle('label.color', "#FFFFFF");
    this.setStyle('label.position', "center");
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', 0);
    this.setStyle('label.font', Msg.topocfg.font14);
    //this.setStyle('vector.fill.color', "rgb(44, 44, 68)");
    //this.setStyle('vector.outline.color', "rgb(0, 184, 18)");
    this.setStyle('vector.fill.color', "rgb(128, 128, 128)");
    this.setStyle('vector.outline.color', "rgb(128, 128, 128)");
    //   this.setName(Msg.topocfg.statusButton);
    this.setSize(20, 40);

};
twaver.Util.ext('topo.StatusButton', twaver.Grid, {
    getElementUIClass: function () {
        return HtmlLabelNodeUI;
    }
    /*serializeXml:function(serializer, newInstance){
     twaver.SerializationSettings.setPropertyType("angle","number");
     twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
     this.serializePropertyXml(serializer, "angle", newInstance);
     }*/
});

/**
 * 索引节点
 */
topo.IndexNode = function (id) {
    topo.IndexNode.superClass.constructor.call(this, id);
    this.setImage("indexnode");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "center");
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', -40);
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setName(Msg.topocfg.indexnode);
    this.setSize(120, 40);

};
twaver.Util.ext('topo.IndexNode', twaver.Grid, {
    getElementUIClass: function () {
        return HtmlLabelNodeUI;
    }
    /*serializeXml:function(serializer, newInstance){
     twaver.SerializationSettings.setPropertyType("angle","number");
     twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
     this.serializePropertyXml(serializer, "angle", newInstance);
     }*/
});

/**
 * 天气
 */
topo.WEATHER = function (id) {
    topo.WEATHER.superClass.constructor.call(this, id);
    this.setImage("weatherIcons_99");
    this.setSize(50, 50);
};
twaver.Util.ext('topo.WEATHER', twaver.Node, {});

/**
 * 跳转图元
 */
topo.JUMP = function (id) {
    topo.JUMP.superClass.constructor.call(this, id);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.outline.color', "#3e3e3e");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "top.top");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("jump");
    this.setSize(50, 1);
};
twaver.Util.ext('topo.JUMP', twaver.Node, {
    getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }
});

/**
 * 箱变主图元拆分图元1
 */
topo.YXB1 = function (id) {
    topo.YXB1.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("Y176-35");
    this.setSize(30, 30);
};
twaver.Util.ext('topo.YXB1', twaver.Node, {});

/**
 * 箱变主图元拆分图元1
 */
topo.YXB1New = function (id) {
    topo.YXB1New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("x-1jiao");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.YXB1New', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 箱变主图元拆分图元2
 */
topo.YXB2 = function (id) {
    topo.YXB2.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("C176-35");
    this.setSize(65, 65);
};
twaver.Util.ext('topo.YXB2', twaver.Node, {});

topo.YXB2New = function (id) {
    topo.YXB2New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("yuanxing");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.YXB2New', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 箱变主图元拆分图元3
 */
topo.YXB3 = function (id) {
    topo.YXB3.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("T176-35");
    this.setSize(30, 30);
};
twaver.Util.ext('topo.YXB3', twaver.Node, {});

topo.YXB3New = function (id) {
    topo.YXB3New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("cunsanjiao");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.YXB3New', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 箱变拆分图元4（接地变）
 */
topo.YXB4New = function (id) {
    topo.YXB4New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("jiedibianfenjie");
};
twaver.Util.ext('topo.YXB4New', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 远方就地,对图片进行具体的设置
 */
topo.RCLC = function (id) {
    topo.YuanKong.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#000000");
    this.setStyle('label.position', "center");
    this.setStyle('label.font', Msg.topocfg.font16);
    this.setHeight(55);
    this.setWidth(55);
    this.setName('就地');
    this.setImage("RCLCG");
};
twaver.Util.ext('topo.RCLC', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 五防总投入
 */
topo.FivePrevent = function (id) {
    topo.YuanKong.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#000000");
    this.setStyle('label.position', "center");
    this.setStyle('label.font', Msg.topocfg.font16);
    this.setHeight(55);
    this.setWidth(55);
    this.setName('投入');
    this.setImage("fivePreventR");
};
twaver.Util.ext('topo.FivePrevent', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 电站状态展示框
 */
topo.stationStatusPic = function (id) {
    topo.stationStatusPic.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setSize(243, 144);
    this.setImage("stationStatus");
};
twaver.Util.ext('topo.stationStatusPic', twaver.Node, {});

/**
 * 跳转关联topo图
 */
topo.skipTopoPic = function (id) {
    topo.skipTopoPic.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setSize(22, 80);
    this.setImage("skip_grey");
};
twaver.Util.ext('topo.skipTopoPic', twaver.Node, {});

/**
 * 电站图标
 */
topo.stationPic = function (id) {
    topo.stationPic.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("station_pic");
};
twaver.Util.ext('topo.stationPic', twaver.Node, {});


// ========================== add 添加图元 2016-09-26 =========================

/**
 * 主变遥调升
 */
topo.zhuBianRegulationUp = function (id) {
    topo.zhuBianRegulationUp.superClass.constructor.call(this, id);
    this.setImage('transfer_up_32');
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setName(Msg.topocfg.zhubianRegulation);
};
twaver.Util.ext('topo.zhuBianRegulationUp', twaver.Node, {});

/**
 * 主变图元降
 */
topo.zhuBianRegulationDown = function (id) {
    topo.zhuBianRegulationDown.superClass.constructor.call(this, id);
    this.setImage("transfer_down_32");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setName(Msg.topocfg.zhubianRegulationDown);
};
twaver.Util.ext('topo.zhuBianRegulationDown', twaver.Node, {});

/**
 * 主变图元停
 */
topo.zhuBianRegulationStop = function (id) {
    topo.zhuBianRegulationStop.superClass.constructor.call(this, id);
    this.setImage("transfer_stop_32");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setName(Msg.topocfg.zhubianRegulationStop);
};
twaver.Util.ext('topo.zhuBianRegulationStop', twaver.Node, {});

/**
 * 主变遥调升new
 */
topo.zhuBianRegulationUpNew = function (id) {
    topo.zhuBianRegulationUpNew.superClass.constructor.call(this, id);
    this.setImage('zhubiansheng');
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setName(Msg.topocfg.zhubianRegulation);
};
twaver.Util.ext('topo.zhuBianRegulationUpNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 主变图元降new
 */
topo.zhuBianRegulationDownNew = function (id) {
    topo.zhuBianRegulationDownNew.superClass.constructor.call(this, id);
    this.setImage("zhubianjiang");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setName(Msg.topocfg.zhubianRegulationDown);
};
twaver.Util.ext('topo.zhuBianRegulationDownNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 主变图元停new
 */
topo.zhuBianRegulationStopNew = function (id) {
    topo.zhuBianRegulationStopNew.superClass.constructor.call(this, id);
    this.setImage("zhubianting");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setName(Msg.topocfg.zhubianRegulationStop);
};
twaver.Util.ext('topo.zhuBianRegulationStopNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 通用遥控遥调
 */
topo.tongYongYaoKong = function (id) {
    topo.tongYongYaoKong.superClass.constructor.call(this, id);
    this.setName(Msg.topocfg.tongYongYaoKong);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "rectangle");
    this.setStyle('vector.outline.color', "#3e3e3e");
    this.setStyle('vector.outline.width', 1);
    this.setStyle('vector.fill.color', "#ffaa7f");
    this.setStyle('label.color', "#FFFFFF");
    this.setStyle('label.position', "center");
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', 0);
    this.setStyle('label.font', Msg.topocfg.font14);
    // this.setName(Msg.topocfg.skipbutton);
    this.setSize(120, 40);
};
twaver.Util.ext('topo.tongYongYaoKong', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    },
    getElementUIClass: function () {
        return HtmlLabelNodeUI;
    }
});

/**
 * 电动机
 */
topo.motor = function (id) {
    topo.motor.superClass.constructor.call(this, id);
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("motor");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.motor);
};
twaver.Util.ext('topo.motor', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 发电机
 */
topo.dynamotor = function (id) {
    topo.dynamotor.superClass.constructor.call(this, id);
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("dynamotor");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.dynamotor);
};
twaver.Util.ext('topo.dynamotor', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 变电站图元
 */
topo.Substation = function (id) {
    topo.Substation.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "top.top");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.xoffset', 0);
    this.setImage("substation");
    this.setName(Msg.topocfg.substation);
};
twaver.Util.ext('topo.Substation', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 电网图元
 */
topo.Powergrid = function (id) {
    topo.Powergrid.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "center");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', 0);
    this.setImage("lineframe");
    this.setName(Msg.topocfg.powergrid);
};
twaver.Util.ext('topo.Powergrid', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 人工置位图元
 */
topo.Manualsetting = function (id) {
    topo.Manualsetting.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', -40);
    this.setImage("manualsettingDE");
};
twaver.Util.ext('topo.Manualsetting', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 集控中心图元
 */
topo.CentralizedCC = function (id) {
    topo.CentralizedCC.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "top.top");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', -3);
    this.setImage("centralizedCC");
    this.setName(Msg.topocfg.centralizedCC);
};
twaver.Util.ext('topo.CentralizedCC', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 三相
 */
topo.SanXiangNew = function (id) {
    topo.SanXiangNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("SanXiangNew");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.SanXiangNew', twaver.Node, {});

/**
 * 三相3D
 */
topo.SanXiang3DNew = function (id) {
    topo.SanXiang3DNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("SanXiang3DNew");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.SanXiang3DNew', twaver.Node, {});

/**
 * 两相3D  ，两脚
 */
topo.LiangXiang3DLJNew = function (id) {
    topo.LiangXiang3DLJNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("LiangXiang3DLJNew");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.LiangXiang3DLJNew', twaver.Node, {});

/**
 * 两相3D  ，三脚
 */
topo.LiangXiang3DSJNew = function (id) {
    topo.LiangXiang3DSJNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("LiangXiang3DSJNew");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.LiangXiang3DSJNew', twaver.Node, {});

topo.XBLJZT3New = function (id) {
    topo.XBLJZT3New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBLJZT3New");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.XBLJZT3New', twaver.Node, {});

topo.XBLJFT3New = function (id) {
    topo.XBLJFT3New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBLJFT3New");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT3New', twaver.Node, {});

topo.XBLJZT4New = function (id) {
    topo.XBLJZT4New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBLJZT4New");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.XBLJZT4New', twaver.Node, {});

topo.XBLJFT4New = function (id) {
    topo.XBLJFT4New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBLJFT4New");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT4New', twaver.Node, {});

topo.XBLJZT5New = function (id) {
    topo.XBLJZT5New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBLJZT5New");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.XBLJZT5New', twaver.Node, {});

topo.XBLJFT5New = function (id) {
    topo.XBLJFT5New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBLJFT5New");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT5New', twaver.Node, {});

topo.XBSJZT2New = function (id) {
    topo.XBSJZT2New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJZT2New");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.XBSJZT2New', twaver.Node, {});

topo.XBSJFT2New = function (id) {
    topo.XBSJFT2New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJFT2New");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT2New', twaver.Node, {});

topo.XBSJZT3New = function (id) {
    topo.XBSJZT3New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJZT3New");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.XBSJZT3New', twaver.Node, {});

topo.XBSJFT3New = function (id) {
    topo.XBSJFT3New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJFT3New");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT3New', twaver.Node, {});

topo.XBSJZT4New = function (id) {
    topo.XBSJZT4New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJZT4New");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.XBSJZT4New', twaver.Node, {});

topo.XBSJFT4New = function (id) {
    topo.XBSJFT4New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJFT4New");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT4New', twaver.Node, {});

topo.XBSJZT5New = function (id) {
    topo.XBSJZT5New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJZT5New");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.XBSJZT5New', twaver.Node, {});

topo.XBSJFT5New = function (id) {
    topo.XBSJFT5New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJFT5New");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT5New', twaver.Node, {});

topo.XBSJZT6New = function (id) {
    topo.XBSJZT6New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJZT6New");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.XBSJZT6New', twaver.Node, {});

topo.XBSJFT6New = function (id) {
    topo.XBSJFT6New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJFT6New");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT6New', twaver.Node, {});

/**
 *  地线
 */
topo.DiXianYouNew = function (id) {
    topo.DiXianYouNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("DiXianYouNew");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.DiXianYouNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 带电装置
 */
topo.DaiDianZZNew = function (id) {
    topo.DaiDianZZNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("DaiDianZZNew");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.DaiDianZZNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 电容
 */
topo.DianRongNew = function (id) {
    topo.DianRongNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("drq_sl");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.DianRongNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 电抗
 */
topo.DianKangNew = function (id) {
    topo.DianKangNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("diankang");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.DianKangNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 分裂电抗
 */
topo.FLDianKangNew = function (id) {
    topo.FLDianKangNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("fenliediankang");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.FLDianKangNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 电感
 */
topo.DianGanNew = function (id) {
    topo.DianGanNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("diangan");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.DianGanNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 避雷针(New)
 */
topo.BiLeiZhenNew = function (id) {
    topo.BiLeiZhenNew.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("BiLeiZhenNew");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.BiLeiZhenNew', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 避雷器1
 */
topo.bileizhen1 = function (id) {
    topo.bileizhen1.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("bileiqi1");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.bileizhen1);
};
twaver.Util.ext('topo.bileizhen1', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 避雷器2
 */
topo.bileizhen2 = function (id) {
    topo.bileizhen2.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("bileiqi2");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.bileizhen2);
};
twaver.Util.ext('topo.bileizhen2', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 击穿间隙
 */
topo.breakdownGap = function (id) {
    topo.breakdownGap.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("jichuanjianxi");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.breakdownGap);
};
twaver.Util.ext('topo.breakdownGap', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 直流消谐器
 */
topo.dCharmonic = function (id) {
    topo.dCharmonic.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("zhiliuxiaoxieqi");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.dCharmonic);
};
twaver.Util.ext('topo.dCharmonic', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 消弧线圈
 */
topo.xiaohuxianquan = function (id) {
    topo.xiaohuxianquan.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xiaohuxianquan");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.xiaohuxianquan);
};
twaver.Util.ext('topo.xiaohuxianquan', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * CT-GD
 */
topo.ctgd = function (id) {
    topo.ctgd.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("CT-GD");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.ctgd);
};
twaver.Util.ext('topo.ctgd', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * ct
 */
topo.ct = function (id) {
    topo.ct.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("CT");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.ct);
};
twaver.Util.ext('topo.ct', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * pt
 */
topo.ptsl = function (id) {
    topo.ptsl.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("PT");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.pt);
};
twaver.Util.ext('topo.ptsl', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * pt1gd
 */
topo.pt1gd = function (id) {
    topo.pt1gd.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("PT1-GD");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.pt1gd);
};
twaver.Util.ext('topo.pt1gd', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * pt1
 */
topo.pt1sl = function (id) {
    topo.pt1sl.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("PT1");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.pt1);
};
twaver.Util.ext('topo.pt1sl', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * pt2
 */
topo.pt2 = function (id) {
    topo.pt2.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("PT2");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.pt2);
};
twaver.Util.ext('topo.pt2', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * pt3
 */
topo.pt3 = function (id) {
    topo.pt3.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("PT3");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.pt3);
};
twaver.Util.ext('topo.pt3', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * pt4gd
 */
topo.pt4gd = function (id) {
    topo.pt4gd.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("PT4-GD");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.pt4gd);
};
twaver.Util.ext('topo.pt4gd', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * pt5gd
 */
topo.pt5gd = function (id) {
    topo.pt5gd.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("PT5-GD");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.pt5gd);
};
twaver.Util.ext('topo.pt5gd', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * PT5
 */
topo.pt5 = function (id) {
    topo.pt5.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("PT5");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.pt5);
};
twaver.Util.ext('topo.pt5', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 并联电抗器
 */
topo.bianliandiankang = function (id) {
    topo.bianliandiankang.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("biliandiankangqi");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.bianliandiankang);
};
twaver.Util.ext('topo.bianliandiankang', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 串联电抗器
 */
topo.chuanliandiankang = function (id) {
    topo.chuanliandiankang.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("chuanliandiankangqi");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.chuanliandiankang);
};
twaver.Util.ext('topo.chuanliandiankang', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 电抗器-GD
 */
topo.diankangqigd = function (id) {
    topo.diankangqigd.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("diankangqiGD");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.diankangqigd);
};
twaver.Util.ext('topo.diankangqigd', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 电抗器-GD
 */
topo.diankangqigd1 = function (id) {
    topo.diankangqigd1.superClass.constructor.call(this, id);
    this.setStyle('label.ct', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("rongkangqiGD");
    this.setStyle('image.state', 'circle');
    //this.setName(Msg.stationStatusConfig.diankangqigd1);
};
twaver.Util.ext('topo.diankangqigd1', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 隔离手车
 */
topo.ShouCheSecond = function (id) {
    topo.ShouCheSecond.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "right.right");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setWidth(23);
    this.setHeight(106);
    this.setImage("SH_Hand-car_Close");
};
twaver.Util.ext('topo.ShouCheSecond', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 新可跳转电站图元
 */
topo.StationJump = function (id) {
    topo.StationJump.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "top.top");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', -3);
    this.setSize(116, 86);
    this.setImage("stationSkip");
    //this.setName(Msg.stationInfo.name);
};
twaver.Util.ext('topo.StationJump', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * PT1
 */
topo.PT1New = function (id) {
    topo.PT1New.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("PT1New");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.PT1New', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

topo.XBSJZT7 = function (id) {
    topo.XBSJZT7.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJZT7");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.XBSJZT7', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

topo.XBSJFT7 = function (id) {
    topo.XBSJFT7.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJFT7");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT7', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

topo.XBSJFT8 = function (id) {
    topo.XBSJFT8.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJFT8");
    this.setStyle('image.state', 'circle');
    this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT8', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

topo.XBSJZT8 = function (id) {
    topo.XBSJZT8.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("XBSJZT8");
    this.setStyle('image.state', 'circle');
};
twaver.Util.ext('topo.XBSJZT8', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 软压板分
 */
topo.ruanyafen = function (id) {
    topo.ruanyafen.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("ruanyaerror");
    this.setStyle('image.state', 'circle');
    this.setStyle('wholeColorzdy', '#00ff26');
    this.setClient('wholeColorzdy', '#00ff26');
    //this.setName(Msg.stationStatusConfig.ruanyafen);
};
twaver.Util.ext('topo.ruanyafen', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 硬压板分
 */
topo.yingyafen = function (id) {
    topo.yingyafen.superClass.constructor.call(this, id);
    this.setStyle('label.position', "right.right");
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("yingyaerror");
    this.setStyle('image.state', 'circle');
    this.setStyle('wholeColorzdy', '#00ff26');
    this.setClient('wholeColorzdy', '#00ff26');
};
twaver.Util.ext('topo.yingyafen', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 主机状态
 */
topo.zhujizt = function (id) {
    topo.zhujizt.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "center");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.xoffset', -70);
    this.setStyle('label.yoffset', 0);
    this.setName(Msg.topocfg.mainServer + " : ");
    this.setImage("zbDefault");
};
twaver.Util.ext('topo.zhujizt', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});

/**
 * 备机状态
 */
topo.beijizt = function (id) {
    topo.beijizt.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "center");
    this.setStyle('label.font', Msg.topocfg.font14);
    this.setStyle('label.xoffset', -70);
    this.setStyle('label.yoffset', 0);
    this.setName(Msg.topocfg.bakcupServer + " : ");
    this.setImage("zbDefault");
};
twaver.Util.ext('topo.beijizt', twaver.Follower, {
    serializeXml: function (serializer, newInstance) {
        twaver.SerializationSettings.setPropertyType("angle", "number");
        twaver.Follower.prototype.serializeXml.call(this, serializer, newInstance);
        this.serializePropertyXml(serializer, "angle", newInstance);
    }
});


/**
 * 图元注册
 */
function registerCustomImage(){

    //△
    twaver.Util.registerShape('triangle', function (g, shapeData, data, view) {
        var rect = shapeData.rect;
        g.moveTo(rect.x + rect.w / 2, rect.y);
        g.lineTo(rect.x + rect.w, rect.y + rect.h);
        g.lineTo(rect.x, rect.y + rect.h);
        g.closePath();
    });

    //圆形Y
    twaver.Util.registerImage('gardenY', {
        w: 100,
        h: 100,
        lineWidth: 2,
        v: [
            {
                shape: 'circle',
                r: 50,
                state: 'circle'
            },
            {
                shape: 'line',
                x1: -20,
                y1: -25,
                x2: 0,
                y2: -10
            },
            {
                shape: 'line',
                x1: 20,
                y1: -25,
                x2: 0,
                y2: -10
            },
            {
                shape: 'line',
                x1: 0,
                y1: -10,
                x2: 0,
                y2: 15
            }
        ]
    });

    //圆形下Y
    twaver.Util.registerImage('gardenYx', {
        w: 100,
        h: 100,
        lineWidth: 2,
        v: [
            {
                shape: 'circle',
                r: 50,
                state: 'circle'
            },
            {
                shape: 'line',
                x1: -20,
                y1: -10,
                x2: 0,
                y2: 5
            },
            {
                shape: 'line',
                x1: 20,
                y1: -10,
                x2: 0,
                y2: 5
            },
            {
                shape: 'line',
                x1: 0,
                y1: 5,
                x2: 0,
                y2: 30
            }
        ]
    });

    //圆形△
    twaver.Util.registerImage('gardenSanjiao', {
        w: 100,
        h: 100,
        lineWidth: 2,
        v: [
            {
                shape: 'circle',
                r: 50,
                state: 'circle'
            },
            {
                shape: 'triangle',
                rect: { x: -22, y: -35, w: 45, h: 40 },
                lineWidth: 2
            }
        ]
    });

    //圆形下△
    twaver.Util.registerImage('gardenSanjiaox', {
        w: 100,
        h: 100,
        lineWidth: 2,
        v: [
            {
                shape: 'circle',
                r: 50,
                state: 'circle'
            },
            {
                shape: 'triangle',
                rect: { x: -22, y: -10, w: 45, h: 35 },
                lineWidth: 2
            }
        ]
    });

    //线条
    twaver.Util.registerImage('xiantiao', {
        w: 20,
        h: 20,
        lineWidth: 2,
        v: [
            {
                shape: 'line',
                x1: 0,
                y1: -10,
                x2: 0,
                y2: 10
            }
        ]
    });

    //箭头
    twaver.Util.registerImage('jiantou', {
        w: 100,
        h: 100,
        lineWidth: 2,
        v: [
            {
                shape: 'line',
                x1: -50,
                y1: 50,
                x2: 45,
                y2: -45
            },
            {
                shape: 'triangle',
                rect: { x: -8, y: -75, w: 16, h: 16 },
                lineWidth: 2,
                rotate:45
            }
        ]
    });

    //线条分支
    twaver.Util.registerImage('xiantiaofz', {
        w: 60,
        h: 40,
        lineWidth: 2,
        v: [
            {
                shape: 'line',
                x1: 0,
                y1: -20,
                x2: 0,
                y2: 0
            },
            {
                shape: 'line',
                x1: 30,
                y1: 0,
                x2: -30,
                y2: 0
            },
            {
                shape: 'line',
                x1: 30,
                y1: 0,
                x2: 30,
                y2: 15
            },
            {
                shape: 'line',
                x1: -30,
                y1: 0,
                x2: -30,
                y2: 15
            }
        ]
    });

    //圆形横杠
    twaver.Util.registerImage('gardenHenggang', {
        w: 105,
        h: 105,
        lineWidth: 2,
        v: [
            {
                shape: 'circle',
                r: 50,
                state: 'circle'
            },
            {
                shape: 'line',
                x1: -20,
                y1: 0,
                x2: 20,
                y2: 0
            }
        ]
    });

    //箭头向下
    twaver.Util.registerImage('jiantoux', {
        w: 100,
        h: 100,
        lineWidth: 2,
        v: [
            {
                shape: 'line',
                x1: 0,
                y1: -50,
                x2: 0,
                y2: 50
            },
            {
                shape: 'triangle',
                rect: { x: -15, y: -50, w: 30, h: 30 },
                lineWidth: 2,
                rotate:180
            }
        ]
    });

    //击穿间隙上部
    twaver.Util.registerImage('jichuanjianxishangbu', {
        w: 50,
        h: 100,
        lineWidth: 1,
        v: [
            {
                shape: 'path',
                data: 'M 12.68799 3.996002 C 12.228 3.527008 11.483 3.527008 11.02399 3.996002 L 0 14.08499 L 0 -18 L -2 -18 L -2 14.08002 L -12.961 3.996033 C -13.42001 3.527039 -14.16501 3.527039 -14.625 3.996033 C -15.08499 4.465027 -15.08499 5.225037 -14.62399 5.694031 L -1 18 L 12.68799 5.694 C 12.91699 5.459991 13.03198 5.152008 13.03198 4.843994 C 13.03201 4.537994 12.918 4.230011 12.68799 3.996002 Z',
                lineColor: '<%= getClient("wholeColorzdy") %>',
                fill: '<%= getClient("wholeColorzdy") %>'
            }
        ]
    });

    //击穿间隙xia部
    twaver.Util.registerImage('jichuanjianxixiabu', {
        w: 50,
        h: 100,
        lineWidth: 1,
        v: [
            {
                shape: 'path',
                data: 'M 3 3 L 3 -6 L 2.968994 -6 L 2.968994 -14 L 13.99298 -3.996002 C 14.452 -3.527008 15.19699 -3.527008 15.65698 -3.996002 C 15.88599 -4.230011 16.00098 -4.537994 16.00098 -4.845001 C 16.00098 -5.153015 15.88696 -5.459991 15.65698 -5.695007 L 1.968994 -18 L -11.65601 -5.694 C -12.116 -5.225006 -12.116 -4.464996 -11.65601 -3.996002 C -11.19601 -3.527008 -10.45102 -3.527008 -9.992004 -3.996002 L 0.9689941 -14 L 0.9689941 3 L -23 3 L -23 5 L 0.9689941 5 L 2.968994 5 L 25 5 L 25 3 L 3 3 ZM -16 12 L 18 12 L 18 10 L -16 10 L -16 12 ZM -9 19 L 11 19 L 11 17 L -9 17 L -9 19 Z',
                lineColor: '<%= getClient("wholeColorzdy") %>',
                fill: '<%= getClient("wholeColorzdy") %>'
            }
        ]
    });

    //圆形上卍
    twaver.Util.registerImage('gardenWanUp', {
        w: 100,
        h: 100,
        lineWidth: 2,
        v: [
            {
                shape: 'circle',
                r: 50,
                state: 'circle'
            },
            {
                shape: 'line',
                x1: -35,
                y1: -20,
                x2: 0,
                y2: 0
            },
            {
                shape:'line',
                x1:-35,
                y1:-20,
                x2:-30,
                y2:-35
            },
            {
                shape: 'line',
                x1: 35,
                y1: -20,
                x2: 0,
                y2: 0
            },
            {
                shape: 'line',
                x1: 35,
                y1: -20,
                x2: 45,
                y2: -10
            },
            {
                shape: 'line',
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 40
            },
            {
                shape: 'line',
                x1: 0,
                y1: 40,
                x2: -14,
                y2: 45
            }
        ]
    });


    //圆形倒Y
    twaver.Util.registerImage('gardenYDao', {
        w: 100,
        h: 100,
        lineWidth: 2,
        v: [
            {
                shape: 'circle',
                r: 50,
                state: 'circle'
            },
            {
                shape: 'line',
                x1: 0,
                y1: 0,
                x2: 0,
                y2: -30
            },
            {
                shape: 'line',
                x1: 0,
                y1: 0,
                x2: -30,
                y2: 30
            },
            {
                shape: 'line',
                x1: 0,
                y1: 0,
                x2: 30,
                y2: 30
            }
        ]
    });
    /*----------------------拼接图形-------------------------*/
    twaver.Util.registerImage('LiangXiangLJNew', {
        w: 60,
        h: 140,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:0,
                y:20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('LiangXiang3DLJNew', {
        w: 105,
        h: 230,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:0,
                y:40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('LiangXiangSJNew', {
        w: 60,
        h: 140,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:0,
                y:20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiaofz",
                x:0,
                y:55,
                w:50,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('LiangXiang3DSJNew', {
        w: 105,
        h: 230,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:0,
                y:40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiaofz",
                x:0,
                y:100,
                w:105,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBLJZT3New', {
        w: 60,
        h: 140,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:0,
                y:20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBLJFT3New', {
        w: 105,
        h: 230,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:0,
                y:40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBLJZT4New', {
        w: 60,
        h: 140,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:0,
                y:20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBLJFT4New', {
        w: 105,
        h: 230,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:0,
                y:40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBLJZT5New', {
        w: 90,
        h: 140,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:0,
                y:20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"jiantou",
                x:0,
                y:-20,
                w:80,
                h:80,
                lineColor: '<%= getClient("wholeColorJT") %>',
                fill: '<%= getClient("wholeColorJT") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBLJFT5New', {
        w: 155,
        h: 230,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:0,
                y:40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"jiantou",
                x:0,
                y:-38,
                w:140,
                h:140,
                lineColor: '<%= getClient("wholeColorJT") %>',
                fill: '<%= getClient("wholeColorJT") %>'
            }
        ]
    });

    /*-----------三相-----------*/
    twaver.Util.registerImage('SanXiangNew', {
        w: 140,
        h: 120,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-50,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-15,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('SanXiang3DNew', {
        w: 240,
        h: 210,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-95,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-35,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT2New', {
        w: 140,
        h: 120,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-50,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-15,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT2New', {
        w: 240,
        h: 210,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-95,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-35,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT3New', {
        w: 140,
        h: 120,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-50,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-15,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT3New', {
        w: 240,
        h: 210,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-95,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-35,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT4New', {
        w: 140,
        h: 120,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-50,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-15,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT4New', {
        w: 240,
        h: 210,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-95,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-35,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT5New', {
        w: 140,
        h: 120,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-50,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:0,
                y:-15,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT5New', {
        w: 240,
        h: 210,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-95,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:0,
                y:-35,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT6New', {
        w: 140,
        h: 120,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-50,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-15,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT7', {
        w: 140,
        h: 120,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-50,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-15,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT8', {
        w: 140,
        h: 120,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-50,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-15,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT6New', {
        w: 240,
        h: 210,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-95,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-35,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT7', {
        w: 240,
        h: 210,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-95,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-35,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT8', {
        w: 240,
        h: 210,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-95,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-35,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('PT1New', {
        w: 100,
        h: 100,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-39,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenHenggang",
                lineWidth: 2,
                x:0,
                y:-5,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenHenggang",
                lineWidth: 2,
                x:-20,
                y:25,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenHenggang",
                lineWidth: 2,
                x:20,
                y:25,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('DiXianYouNew', {
        w: 46,
        h: 20,
        lineWidth: 2,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'line',
                x1: 12,
                y1: -10,
                x2: 12,
                y2: 10
            },
            {
                shape: 'line',
                x1: 17,
                y1: -7,
                x2: 17,
                y2: 7
            },
            {
                shape: 'line',
                x1: 22,
                y1: -4,
                x2: 22,
                y2: 4
            },
            {
                shape: 'line',
                x1: -23,
                y1: 0,
                x2: 12,
                y2: 0
            }
        ]
    });

    twaver.Util.registerImage('BiLeiZhenNew', {
        w: 100,
        h: 70,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'vector',
                name:"jiantoux",
                x:0,
                y:-20,
                w:50,
                h:30,
                fill: '<%= getClient("wholeColor") %>'
            },
            {
                shape: 'rect',
                rect: [ -10, -20, 20, 40]
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:27,
                w:10,
                h:15,
                lineColor: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('DaiDianZZNew', {
        w: 40,
        h: 40,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        rotate:45,
        v: [
            {
                shape: 'circle',
                r: 19,
                state: 'circle',
                lineColor: '<%= getClient("wholeColor") %>'
            },
            {
                shape: 'line',
                x1: 0,
                y1: 19,
                x2: 0,
                y2: -19,
                lineColor: '<%= getClient("wholeColor") %>'
            },
            {
                shape: 'line',
                x1: 19,
                y1: 0,
                x2: -19,
                y2: 0,
                lineColor: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //避雷器1
    twaver.Util.registerImage('bileiqi1', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M -10 39 L 10 39 L 10 37 L -10 37 L -10 39 ZM -17 33 L 17 33 L 17 31 L -17 31 L -17 33 ZM 2 25 L 2 18 L 16 18 L 16 -36 L -14 -36 L -14 18 L 0 18 L 0 25 L -24 25 L -24 27 L 24 27 L 24 25 L 2 25 ZM 14 -25 L 3.200012 -29 L 14 -33 L 14 -25 ZM 8.600006 -25 L -7.600006 -25 L 0.5 -28 L 8.600006 -25 ZM 11.29999 -34 L 0.5 -30 L -10.29999 -34 L 11.29999 -34 ZM -12 -32.63 L -2.200012 -29 L -12 -25.37 L -12 -32.63 ZM -12 -23 L 14 -23 L 14 -15 L -12 -15 L -12 -23 ZM -12 -13 L 14 -13 L 14 -4 L -12 -4 L -12 -13 ZM -12 -2 L 14 -2 L 14 7 L -12 7 L -12 -2 ZM -12 16 L -12 9 L 14 9 L 14 16 L -12 16 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //避雷器2
    twaver.Util.registerImage('bileiqi2', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M -16 34 L 18 34 L 18 32 L -16 32 L -16 34 ZM 3 26 L 3 19 L 17 19 L 17 -6.984985 C 17.008 -7.041992 17.03201 -7.096985 17.03201 -7.154999 C 17.03201 -7.213013 17.00803 -7.266998 17 -7.324005 L 17 -35 L -13 -35 L -13 19 L 1 19 L 1 26 L -23 26 L -23 28 L 25 28 L 25 26 L 3 26 ZM 3 -33 L 15 -33 L 15 -7.983002 L 3 2 L 3 -33 ZM -11 -33 L 1 -33 L 1 2 L -10.961 -8.003998 C -10.97299 -8.015991 -10.98801 -8.019012 -11 -8.029999 L -11 -33 ZM -11 17 L -11 -4.938995 L 2 6 L 15 -4.890991 L 15 17 L -11 17 ZM -9 40 L 11 40 L 11 38 L -9 38 L -9 40 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //组合击穿间隙图
    twaver.Util.registerImage('jichuanjianxi', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'vector',
                name:"jichuanjianxishangbu",
                x:2.5,
                y:-20,
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            },
            {
                shape: 'vector',
                name:"jichuanjianxixiabu",
                x:0,
                y:20,
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //直流消谐器
    twaver.Util.registerImage('zhiliuxiaoxieqi', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColorzdy") %>',
        v: [
            {
                shape: 'path',
                data: 'M 13 15 L 13 -11.612 L 24 -17 L 24 -24 L 21 -24 L 21 -18.53003 L 13 -14.612 L 13 -28 L 1 -28 L 1 -38 L -1 -38 L -1 -28 L -13 -28 L -13 -1.877991 L -25 4 L -25 11 L -22 11 L -22 5.530029 L -13 1.122009 L -13 15 L -1.031006 15 L -1.031006 23 L -24 23 L -24 25 L 24 25 L 24 23 L 1 23 L 1 15 L 13 15 ZM -11 -26 L 11 -26 L 11 -13.633 L -11 -2.857971 L -11 -26 ZM -11 13 L -11 0.1430054 L 11 -10.63202 L 11 13 L -11 13 ZM -17 31 L 17 31 L 17 29 L -17 29 L -17 31 ZM -10 37 L 10 37 L 10 35 L -10 35 L -10 37 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //电感
    twaver.Util.registerImage('diangan', {
        w: 100,
        h: 50,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 24 -15 C 20.51199 -15 17.49399 -13.01199 16 -10.11099 C 14.50601 -13.01199 11.48801 -15 8 -15 C 4.511993 -15 1.493988 -13.01199 0 -10.11099 C -1.493988 -13.01199 -4.511993 -15 -8 -15 C -11.48801 -15 -14.50601 -13.01199 -16 -10.11099 C -17.49399 -13.01199 -20.51199 -15 -24 -15 C -28.97101 -15 -33 -10.97101 -33 -6 L -33 13 L -31 13 L -31 -5 L -30.92001 -5 C -30.96701 -5.328003 -31 -5.660004 -31 -6 C -31 -9.865997 -27.866 -13 -24 -13 C -20.134 -13 -17 -9.865997 -17 -6 C -17 -5.660004 -17.03299 -5.328003 -17.07999 -5 L -17 -5 C -17 -4.447998 -16.552 -4 -16 -4 C -15.448 -4 -15 -4.447998 -15 -5 L -14.92001 -5 C -14.96701 -5.328003 -15 -5.660004 -15 -6 C -15 -9.865997 -11.866 -13 -8 -13 C -4.134003 -13 -1 -9.865997 -1 -6 C -1 -5.660004 -1.03299 -5.328003 -1.079987 -5 L -1 -5 C -1 -4.447998 -0.552002 -4 0 -4 C 0.553009 -4 1 -4.447998 1 -5 L 1.079987 -5 C 1.03299 -5.328003 1 -5.660004 1 -6 C 1 -9.865997 4.134003 -13 8 -13 C 11.866 -13 15 -9.865997 15 -6 C 15 -5.660004 14.96701 -5.328003 14.92001 -5 L 15 -5 C 15 -4.447998 15.44699 -4 16 -4 C 16.55301 -4 17 -4.447998 17 -5 L 17.07999 -5 C 17.03299 -5.328003 17 -5.660004 17 -6 C 17 -9.865997 20.134 -13 24 -13 C 27.866 -13 31 -9.865997 31 -6 C 31 -5.660004 30.96701 -5.328003 30.92001 -5 L 31 -5 L 31 13 L 33 13 L 33 -6 C 33 -10.97101 28.97101 -15 24 -15 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //电抗
    twaver.Util.registerImage('diankang', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 0 13.94901 L 0 34 L -2 34 L -2 13.94101 L -2 12 L -2 11.931 C -1.666992 11.95499 -1.338989 12 -1 12 C 7.835999 12 15 4.835999 15 -4 C 15 -12.15799 8.890991 -18.875 1 -19.862 L 1 0 L 0 0 L -1 0 L -19 0 L -19 -2 L -18.883 -2 C -18.95599 -2.657013 -19 -3.322998 -19 -4 C -19 -13.94101 -10.94101 -22 -1 -22 L -1 -38 L 1 -38 L 1 -21.883 C 9.998993 -20.88699 17 -13.26401 17 -4 C 17 5.604004 9.472992 13.42801 0 13.94901 ZM -17 -4 C -17 -3.321014 -16.944 -2.656006 -16.862 -2 L -1 -2 L -1 -20 C -9.835999 -20 -17 -12.836 -17 -4 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //分裂电抗
    twaver.Util.registerImage('fenliediankang', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 20 1 L 17 1 C 17 -8.604004 9.472992 -16.42801 0 -16.94901 L 0 -35 L -2 -35 L -2 -16.94901 C -11.47299 -16.42801 -19 -8.602997 -19 1 L -22 1 L -24 1 L -24 3 L -24 35 L -22 35 L -22 3 L -18.87601 3 C -18.02701 10.659 -12.379 16.86099 -5 18.539 L -5 17 L -5 16.47601 L -5 1 L -6 1 L -7 1 L -17 1 C -17 -7.835999 -9.835999 -15 -1 -15 C 7.835999 -15 15 -7.835999 15 1 L 5 1 L 4 1 L 3 1 L 3 16.47601 L 3 17 L 3 18.539 C 10.38 16.86099 16.02701 10.659 16.87701 3 L 20 3 L 20 35 L 22 35 L 22 3 L 22 1 L 20 1 ZM -7 3 L -7 15.802 C -12.26501 13.66901 -16.13101 8.830994 -16.86099 3 L -7 3 ZM 5 15.802 L 5 3 L 14.86099 3 C 14.13101 8.830994 10.26501 13.66901 5 15.802 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //手车分
    twaver.Util.registerImage('shouchefen', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M -8.071014 -24.5 C -7.637024 -24.5 -7.25 -24.686 -6.988007 -24.979 L -0.5030212 -32.18301 L 6.079987 -24.88501 L 6.079987 -24.88501 C 6.336975 -24.646 6.685974 -24.49902 7.070984 -24.49902 C 7.859985 -24.49902 8.499969 -25.11502 8.499969 -25.87402 C 8.499969 -26.24503 8.347961 -26.58102 8.099976 -26.82803 L 8.099976 -26.82803 L 0.5289612 -35.07803 L 0.5289612 -35.07803 C 0.2689514 -35.33704 -0.09503174 -35.49902 -0.499054 -35.49902 L -0.5020447 -35.49902 C -0.5030518 -35.49902 -0.5050354 -35.49902 -0.5050354 -35.49902 C -0.9090271 -35.49902 -1.274048 -35.33704 -1.533051 -35.07803 L -1.534058 -35.07803 L -9.105072 -26.82803 L -9.101074 -26.82504 C -9.347076 -26.57803 -9.498077 -26.24304 -9.498077 -25.87405 C -9.5 -25.116 -8.859985 -24.5 -8.071014 -24.5 ZM 8.100006 -17.82999 L 0.5289917 -26.07999 L 0.5289917 -26.07999 C 0.2689819 -26.33899 -0.09500122 -26.50098 -0.4990234 -26.50098 L -0.5020142 -26.50098 C -0.5030212 -26.50098 -0.5050049 -26.50098 -0.5050049 -26.50098 C -0.9089966 -26.50098 -1.274017 -26.33899 -1.53302 -26.07999 L -1.534027 -26.07999 L -9.105042 -17.82999 L -9.101044 -17.827 C -9.347046 -17.57999 -9.498047 -17.245 -9.498047 -16.87601 C -9.498047 -16.117 -8.858032 -15.50101 -8.069061 -15.50101 C -7.635071 -15.50101 -7.248047 -15.68701 -6.986053 -15.98001 L -1.933044 -21.59302 L -1.933044 -11.95102 C -1.933044 -11.15601 -1.302032 -10.51102 -0.5240479 -10.51102 C 0.2539368 -10.51102 0.8849487 -11.15601 0.8849487 -11.95102 L 0.8849487 -21.64801 L 6.08194 -15.88602 L 6.08194 -15.88602 C 6.338928 -15.647 6.687927 -15.50003 7.072937 -15.50003 C 7.861938 -15.50003 8.501923 -16.11603 8.501923 -16.87503 C 8.5 -17.246 8.347992 -17.582 8.100006 -17.82999 L 8.100006 -17.82999 ZM 7.071014 26.5 C 6.686005 26.5 6.337006 26.646 6.080017 26.88599 L 6.080017 26.88498 L -0.5029907 34.18399 L -6.987976 26.97998 C -7.249969 26.68597 -7.636963 26.50098 -8.070984 26.50098 C -8.859985 26.50098 -9.499969 27.11597 -9.499969 27.87598 C -9.499969 28.24496 -9.348969 28.57999 -9.102966 28.82697 L -9.106964 28.83096 L -1.53595 37.08096 L -1.534943 37.07996 C -1.274933 37.33997 -0.9109497 37.50095 -0.5069275 37.50095 C -0.5069275 37.50095 -0.5049133 37.50095 -0.5039368 37.50095 L -0.500946 37.50095 C -0.09695435 37.50095 0.2680664 37.33994 0.5270691 37.07996 L 0.5270691 37.08096 L 8.098083 28.83096 L 8.098083 28.82996 C 8.346069 28.58295 8.498077 28.24695 8.498077 27.87595 C 8.5 27.11499 7.859985 26.5 7.071014 26.5 ZM 7.071014 17.5 C 6.686005 17.5 6.337006 17.646 6.080017 17.88599 L 6.080017 17.88498 L 0.8830261 23.64798 L 0.8830261 13.95099 C 0.8830261 13.155 0.2520142 12.51099 -0.5259705 12.51099 C -1.303955 12.51099 -1.934967 13.15598 -1.934967 13.95099 L -1.934967 23.59299 L -6.987976 17.98099 C -7.249969 17.68698 -7.636963 17.50198 -8.070984 17.50198 C -8.859985 17.50198 -9.499969 18.11697 -9.499969 18.87698 C -9.499969 19.24597 -9.348969 19.58099 -9.102966 19.82797 L -9.106964 19.83197 L -1.53595 28.08197 L -1.534943 28.08096 C -1.274933 28.34097 -0.9109497 28.50195 -0.5069275 28.50195 C -0.5069275 28.50195 -0.5049133 28.50195 -0.5039368 28.50195 L -0.500946 28.50195 C -0.09695435 28.50195 0.2680664 28.34094 0.5270691 28.08096 L 0.5270691 28.08197 L 8.098083 19.83197 L 8.098083 19.83096 C 8.346069 19.58395 8.498077 19.24796 8.498077 18.87695 C 8.5 18.11499 7.859985 17.5 7.071014 17.5 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //手车合
    twaver.Util.registerImage('shouchehe', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M -8.071014 -26.5 C -7.637024 -26.5 -7.25 -26.686 -6.988007 -26.979 L -1.934998 -32.59201 L -1.934998 -16.95001 C -1.934998 -16.155 -1.303986 -15.51001 -0.526001 -15.51001 C 0.2519836 -15.51001 0.8829956 -16.155 0.8829956 -16.95001 L 0.8829956 -32.647 L 6.079987 -26.88501 L 6.079987 -26.88501 C 6.336975 -26.646 6.685974 -26.49902 7.070984 -26.49902 C 7.859985 -26.49902 8.499969 -27.11502 8.499969 -27.87402 C 8.499969 -28.24503 8.347961 -28.58102 8.099976 -28.82803 L 8.099976 -28.82803 L 0.5289612 -37.07803 L 0.5289612 -37.07803 C 0.2689514 -37.33704 -0.09603882 -37.49902 -0.499054 -37.49902 L -0.5050659 -37.49902 C -0.9090576 -37.49902 -1.274078 -37.33704 -1.533081 -37.07803 L -1.534088 -37.07803 L -9.105103 -28.82803 L -9.101105 -28.82504 C -9.347107 -28.57803 -9.498108 -28.24304 -9.498108 -27.87405 C -9.5 -27.116 -8.859985 -26.5 -8.071014 -26.5 ZM 7.071014 25.5 C 6.686005 25.5 6.337006 25.646 6.080017 25.88599 L 6.080017 25.88498 L 0.8830261 31.64798 L 0.8830261 15.95001 C 0.8830261 15.15402 0.2520142 14.51001 -0.5259705 14.51001 C -1.303955 14.51001 -1.934967 15.155 -1.934967 15.95001 L -1.934967 31.59201 L -6.987976 25.98001 C -7.249969 25.686 -7.636963 25.50101 -8.070984 25.50101 C -8.859985 25.50101 -9.499969 26.116 -9.499969 26.87601 C -9.499969 27.245 -9.348969 27.58002 -9.102966 27.827 L -9.106964 27.83099 L -1.53595 36.08099 L -1.534943 36.07999 C -1.274933 36.34 -0.9109497 36.50098 -0.5069275 36.50098 L -0.5009155 36.50098 C -0.09790039 36.50098 0.2680969 36.33997 0.5270996 36.07999 L 0.5270996 36.08099 L 8.098114 27.83099 L 8.098114 27.82999 C 8.3461 27.58298 8.498108 27.24698 8.498108 26.87598 C 8.5 26.11499 7.859985 25.5 7.071014 25.5 Z',
                lineColor: '<%= getClient("wholeColorzdy") %>',
                fill: '<%= getClient("wholeColorzdy") %>'
            }
        ]
    });

    //手车双分
    twaver.Util.registerImage('shuangfen', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColorzdy") %>',
        v: [
            {
                shape: 'path',
                data: 'M -9.071014 -25.5 C -8.637024 -25.5 -8.25 -25.686 -7.988007 -25.979 L -1.503021 -33.18301 L 5.079987 -25.88501 L 5.079987 -25.88501 C 5.336975 -25.646 5.685974 -25.49902 6.070984 -25.49902 C 6.859985 -25.49902 7.499969 -26.11502 7.499969 -26.87402 C 7.499969 -27.24503 7.347961 -27.58102 7.099976 -27.82803 L 7.099976 -27.82803 L -0.4710388 -36.07803 L -0.4710388 -36.07803 C -0.7310486 -36.33704 -1.095032 -36.49902 -1.499054 -36.49902 L -1.502045 -36.49902 C -1.503052 -36.49902 -1.505035 -36.49902 -1.505035 -36.49902 C -1.909027 -36.49902 -2.274048 -36.33704 -2.533051 -36.07803 L -2.534058 -36.07803 L -10.10507 -27.82803 L -10.10107 -27.82504 C -10.34708 -27.57803 -10.49808 -27.24304 -10.49808 -26.87405 C -10.5 -26.116 -9.859985 -25.5 -9.071014 -25.5 ZM -9.071014 -16.5 C -8.637024 -16.5 -8.25 -16.686 -7.988007 -16.979 L -2.934998 -22.59201 L -2.934998 -12.95001 C -2.934998 -12.155 -2.303986 -11.51001 -1.526001 -11.51001 C -0.7480164 -11.51001 -0.1170044 -12.155 -0.1170044 -12.95001 L -0.1170044 -22.647 L 5.079987 -16.88501 L 5.079987 -16.88501 C 5.336975 -16.646 5.685974 -16.49902 6.070984 -16.49902 C 6.859985 -16.49902 7.499969 -17.11502 7.499969 -17.87402 C 7.499969 -18.24503 7.347961 -18.58102 7.099976 -18.82803 L 7.099976 -18.82803 L -0.4710388 -27.07803 L -0.4710388 -27.07803 C -0.7310486 -27.33704 -1.095032 -27.49902 -1.499054 -27.49902 L -1.502045 -27.49902 C -1.503052 -27.49902 -1.505035 -27.49902 -1.505035 -27.49902 C -1.909027 -27.49902 -2.274048 -27.33704 -2.533051 -27.07803 L -2.534058 -27.07803 L -10.10507 -18.82803 L -10.10107 -18.82504 C -10.34708 -18.57803 -10.49808 -18.24304 -10.49808 -17.87405 C -10.5 -17.116 -9.859985 -16.5 -9.071014 -16.5 ZM 6.071014 25.5 C 5.686005 25.5 5.337006 25.646 5.080017 25.88599 L 5.080017 25.88498 L -1.502991 33.18399 L -7.987976 25.97998 C -8.249969 25.68597 -8.636963 25.50098 -9.070984 25.50098 C -9.859985 25.50098 -10.49997 26.11597 -10.49997 26.87598 C -10.49997 27.24496 -10.34897 27.57999 -10.10297 27.82697 L -10.10696 27.83096 L -2.53595 36.08096 L -2.534943 36.07996 C -2.274933 36.33997 -1.91095 36.50095 -1.506927 36.50095 C -1.506927 36.50095 -1.504913 36.50095 -1.503937 36.50095 L -1.500946 36.50095 C -1.096954 36.50095 -0.7319336 36.33994 -0.4729309 36.07996 L -0.4729309 36.08096 L 7.098083 27.83096 L 7.098083 27.82996 C 7.346069 27.58295 7.498077 27.24695 7.498077 26.87595 C 7.5 26.11499 6.859985 25.5 6.071014 25.5 ZM 6.071014 16.5 C 5.686005 16.5 5.337006 16.646 5.080017 16.88599 L 5.080017 16.88498 L -0.1169739 22.64798 L -0.1169739 12.95099 C -0.1169739 12.155 -0.7479858 11.51099 -1.52597 11.51099 C -2.303955 11.51099 -2.934967 12.15598 -2.934967 12.95099 L -2.934967 22.59299 L -7.987976 16.98099 C -8.249969 16.68698 -8.636963 16.50198 -9.070984 16.50198 C -9.859985 16.50198 -10.49997 17.11697 -10.49997 17.87698 C -10.49997 18.24597 -10.34897 18.58099 -10.10297 18.82797 L -10.10696 18.83197 L -2.53595 27.08197 L -2.534943 27.08096 C -2.274933 27.34097 -1.91095 27.50195 -1.506927 27.50195 C -1.506927 27.50195 -1.504913 27.50195 -1.503937 27.50195 L -1.500946 27.50195 C -1.096954 27.50195 -0.7319336 27.34094 -0.4729309 27.08096 L -0.4729309 27.08197 L 7.098083 18.83197 L 7.098083 18.83096 C 7.346069 18.58395 7.498077 18.24796 7.498077 17.87695 C 7.5 17.11499 6.859985 16.5 6.071014 16.5 ZM -11.16901 -16 L -11.16901 -14.23099 L 9.169006 15.83301 L 9.169006 14.064 L -11.16901 -16 Z',
                lineColor: '<%= getClient("wholeColorzdy") %>',
                fill: '<%= getClient("wholeColorzdy") %>'
            }
        ]
    });

    //手车双合
    twaver.Util.registerImage('shuanghe', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColorzdy") %>',
        v: [
            {
                shape: 'path',
                data: 'M -9.071014 -25.5 C -8.637024 -25.5 -8.25 -25.686 -7.988007 -25.979 L -1.503021 -33.18301 L 5.079987 -25.88501 L 5.079987 -25.88501 C 5.336975 -25.646 5.685974 -25.49902 6.070984 -25.49902 C 6.859985 -25.49902 7.499969 -26.11502 7.499969 -26.87402 C 7.499969 -27.24503 7.347961 -27.58102 7.099976 -27.82803 L 7.099976 -27.82803 L -0.4710388 -36.07803 L -0.4710388 -36.07803 C -0.7310486 -36.33704 -1.095032 -36.49902 -1.499054 -36.49902 L -1.502045 -36.49902 C -1.503052 -36.49902 -1.505035 -36.49902 -1.505035 -36.49902 C -1.909027 -36.49902 -2.274048 -36.33704 -2.533051 -36.07803 L -2.534058 -36.07803 L -10.10507 -27.82803 L -10.10107 -27.82504 C -10.34708 -27.57803 -10.49808 -27.24304 -10.49808 -26.87405 C -10.5 -26.116 -9.859985 -25.5 -9.071014 -25.5 ZM -9.071014 -16.5 C -8.637024 -16.5 -8.25 -16.686 -7.988007 -16.979 L -2.934998 -22.59201 L -2.934998 -12.95001 C -2.934998 -12.155 -2.303986 -11.51001 -1.526001 -11.51001 C -0.7480164 -11.51001 -0.1170044 -12.155 -0.1170044 -12.95001 L -0.1170044 -22.647 L 5.079987 -16.88501 L 5.079987 -16.88501 C 5.336975 -16.646 5.685974 -16.49902 6.070984 -16.49902 C 6.859985 -16.49902 7.499969 -17.11502 7.499969 -17.87402 C 7.499969 -18.24503 7.347961 -18.58102 7.099976 -18.82803 L 7.099976 -18.82803 L -0.4710388 -27.07803 L -0.4710388 -27.07803 C -0.7310486 -27.33704 -1.095032 -27.49902 -1.499054 -27.49902 L -1.502045 -27.49902 C -1.503052 -27.49902 -1.505035 -27.49902 -1.505035 -27.49902 C -1.909027 -27.49902 -2.274048 -27.33704 -2.533051 -27.07803 L -2.534058 -27.07803 L -10.10507 -18.82803 L -10.10107 -18.82504 C -10.34708 -18.57803 -10.49808 -18.24304 -10.49808 -17.87405 C -10.5 -17.116 -9.859985 -16.5 -9.071014 -16.5 ZM 6.071014 25.5 C 5.686005 25.5 5.337006 25.646 5.080017 25.88599 L 5.080017 25.88498 L -1.502991 33.18399 L -7.987976 25.97998 C -8.249969 25.68597 -8.636963 25.50098 -9.070984 25.50098 C -9.859985 25.50098 -10.49997 26.11597 -10.49997 26.87598 C -10.49997 27.24496 -10.34897 27.57999 -10.10297 27.82697 L -10.10696 27.83096 L -2.53595 36.08096 L -2.534943 36.07996 C -2.274933 36.33997 -1.91095 36.50095 -1.506927 36.50095 C -1.506927 36.50095 -1.504913 36.50095 -1.503937 36.50095 L -1.500946 36.50095 C -1.096954 36.50095 -0.7319336 36.33994 -0.4729309 36.07996 L -0.4729309 36.08096 L 7.098083 27.83096 L 7.098083 27.82996 C 7.346069 27.58295 7.498077 27.24695 7.498077 26.87595 C 7.5 26.11499 6.859985 25.5 6.071014 25.5 ZM 6.071014 16.5 C 5.686005 16.5 5.337006 16.646 5.080017 16.88599 L 5.080017 16.88498 L -0.1169739 22.64798 L -0.1169739 12.95099 C -0.1169739 12.155 -0.7479858 11.51099 -1.52597 11.51099 C -2.303955 11.51099 -2.934967 12.15598 -2.934967 12.95099 L -2.934967 22.59299 L -7.987976 16.98099 C -8.249969 16.68698 -8.636963 16.50198 -9.070984 16.50198 C -9.859985 16.50198 -10.49997 17.11697 -10.49997 17.87698 C -10.49997 18.24597 -10.34897 18.58099 -10.10297 18.82797 L -10.10696 18.83197 L -2.53595 27.08197 L -2.534943 27.08096 C -2.274933 27.34097 -1.91095 27.50195 -1.506927 27.50195 C -1.506927 27.50195 -1.504913 27.50195 -1.503937 27.50195 L -1.500946 27.50195 C -1.096954 27.50195 -0.7319336 27.34094 -0.4729309 27.08096 L -0.4729309 27.08197 L 7.098083 18.83197 L 7.098083 18.83096 C 7.346069 18.58395 7.498077 18.24796 7.498077 17.87695 C 7.5 17.11499 6.859985 16.5 6.071014 16.5 ZM 9.169006 -16 L -1 -0.9679871 L -11.16901 -16 L -11.16901 -14.23099 L -1.597992 -0.08297729 L -11.16901 14.06503 L -11.16901 15.83405 L -1 0.8009949 L 9.169006 15.83301 L 9.169006 14.064 L -0.401001 -0.08401489 L 9.169006 -14.23203 L 9.169006 -16 Z',
                lineColor: '<%= getClient("wholeColorzdy") %>',
                fill: '<%= getClient("wholeColorzdy") %>'
            }
        ]
    });

    //单手双分
    twaver.Util.registerImage('danshuangfen', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColorzdy") %>',
        v: [
            {
                shape: 'path',
                data: 'M -14 0 L -14 2 L 12 18 L 12 16 L -14 0 ZM -8.571014 -14 C -8.137024 -14 -7.75 -14.186 -7.488007 -14.479 L -1.003021 -21.68301 L 5.579987 -14.384 L 5.579987 -14.38501 C 5.836975 -14.146 6.185974 -13.99902 6.570984 -13.99902 C 7.359985 -13.99902 7.999969 -14.61401 7.999969 -15.37402 C 7.999969 -15.74503 7.847961 -16.08102 7.599976 -16.32803 L 7.599976 -16.32904 L 0.02896118 -24.57904 L 0.02896118 -24.57803 C -0.2310486 -24.83804 -0.5950317 -24.99902 -0.999054 -24.99902 L -1.002045 -24.99902 C -1.003052 -24.99902 -1.005035 -24.99902 -1.005035 -24.99902 C -1.409027 -24.99902 -1.774048 -24.83801 -2.033051 -24.57803 L -2.034058 -24.57904 L -9.605072 -16.32904 L -9.601074 -16.32504 C -9.847076 -16.07803 -9.998077 -15.74304 -9.998077 -15.37405 C -10 -14.61499 -9.359985 -14 -8.571014 -14 ZM -8.571014 -5 C -8.137024 -5 -7.75 -5.186005 -7.488007 -5.479004 L -2.434998 -11.09201 L -2.434998 -1.450012 C -2.434998 -0.6540222 -1.803986 -0.01000977 -1.026001 -0.01000977 C -0.2480164 -0.01000977 0.3829956 -0.6549988 0.3829956 -1.450012 L 0.3829956 -11.147 L 5.579987 -5.38501 L 5.579987 -5.386017 C 5.836975 -5.147003 6.185974 -5.000031 6.570984 -5.000031 C 7.359985 -5.000031 7.999969 -5.615021 7.999969 -6.375031 C 7.999969 -6.746033 7.847961 -7.082031 7.599976 -7.329041 L 7.599976 -7.330048 L 0.02896118 -15.58005 L 0.02896118 -15.57904 C -0.2310486 -15.83905 -0.5950317 -16.00003 -0.999054 -16.00003 L -1.002045 -16.00003 C -1.003052 -16.00003 -1.005035 -16.00003 -1.005035 -16.00003 C -1.409027 -16.00003 -1.774048 -15.83902 -2.033051 -15.57904 L -2.034058 -15.58005 L -9.605072 -7.330048 L -9.601074 -7.32605 C -9.847076 -7.079041 -9.998077 -6.744049 -9.998077 -6.375061 C -10 -5.61499 -9.359985 -5 -8.571014 -5 Z',
                lineColor: '<%= getClient("wholeColorzdy") %>',
                fill: '<%= getClient("wholeColorzdy") %>'
            }
        ]
    });

    //单手双合
    twaver.Util.registerImage('danshuanghe', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColorzdy") %>',
        v: [
            {
                shape: 'path',
                data: 'M 13 3 L 0 11 L -13 3 L -13 5 L -1.625 12 L -13 19 L -13 21 L 0 13 L 13 21 L 13 19 L 1.625 12 L 13 5 L 13 3 ZM -7.571014 -11 C -7.137024 -11 -6.75 -11.186 -6.488007 -11.479 L -0.00302124 -18.68301 L 6.579987 -11.384 L 6.579987 -11.38501 C 6.836975 -11.146 7.185974 -10.99902 7.570984 -10.99902 C 8.359985 -10.99902 8.999969 -11.61401 8.999969 -12.37402 C 8.999969 -12.74503 8.847961 -13.08102 8.599976 -13.32803 L 8.599976 -13.32904 L 1.028961 -21.57904 L 1.028961 -21.57803 C 0.7689514 -21.83804 0.4049683 -21.99902 0.0009460449 -21.99902 C -6.103516E-05 -21.99902 -0.001068115 -21.99902 -0.002044678 -21.99902 C -0.00302124 -21.99902 -0.0050354 -21.99902 -0.0050354 -21.99902 C -0.4090271 -21.99902 -0.7740479 -21.83801 -1.033051 -21.57803 L -1.034058 -21.57904 L -8.605072 -13.32904 L -8.601074 -13.32504 C -8.847076 -13.07803 -8.998077 -12.74304 -8.998077 -12.37405 C -9 -11.61499 -8.359985 -11 -7.571014 -11 ZM -7.571014 -2 C -7.137024 -2 -6.75 -2.186005 -6.488007 -2.479004 L -1.434998 -8.09201 L -1.434998 1.549988 C -1.434998 2.345978 -0.8039856 2.98999 -0.02600098 2.98999 C 0.7519836 2.98999 1.382996 2.345001 1.382996 1.549988 L 1.382996 -8.147003 L 6.579987 -2.38501 L 6.579987 -2.386017 C 6.836975 -2.147003 7.185974 -2.000031 7.570984 -2.000031 C 8.359985 -2.000031 8.999969 -2.615021 8.999969 -3.375031 C 8.999969 -3.746033 8.847961 -4.082031 8.599976 -4.329041 L 8.599976 -4.330048 L 1.028961 -12.58005 L 1.028961 -12.57904 C 0.7689514 -12.83905 0.4049683 -13.00003 0.0009460449 -13.00003 C -6.103516E-05 -13.00003 -0.001068115 -13.00003 -0.002044678 -13.00003 C -0.00302124 -13.00003 -0.0050354 -13.00003 -0.0050354 -13.00003 C -0.4090271 -13.00003 -0.7740479 -12.83902 -1.033051 -12.57904 L -1.034058 -12.58005 L -8.605072 -4.330048 L -8.601074 -4.32605 C -8.847076 -4.079041 -8.998077 -3.744049 -8.998077 -3.375061 C -9 -2.61499 -8.359985 -2 -7.571014 -2 Z',
                lineColor: '<%= getClient("wholeColorzdy") %>',
                fill: '<%= getClient("wholeColorzdy") %>'
            }
        ]
    });

    //单手车分
    twaver.Util.registerImage('danshouchefen', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColorzdy") %>',
        v: [
            {
                shape: 'path',
                data: 'M -8.571014 -3 C -8.137024 -3 -7.75 -3.186005 -7.488007 -3.479004 L -1.003021 -10.68301 L 5.579987 -3.384003 L 5.579987 -3.38501 C 5.836975 -3.145996 6.185974 -2.999023 6.570984 -2.999023 C 7.359985 -2.999023 7.999969 -3.614014 7.999969 -4.374023 C 7.999969 -4.745026 7.847961 -5.081024 7.599976 -5.328033 L 7.599976 -5.329041 L 0.02896118 -13.57904 L 0.02896118 -13.57803 C -0.2310486 -13.83804 -0.5950317 -13.99902 -0.999054 -13.99902 C -1.000061 -13.99902 -1.001068 -13.99902 -1.002045 -13.99902 C -1.003021 -13.99902 -1.005035 -13.99902 -1.005035 -13.99902 C -1.409027 -13.99902 -1.774048 -13.83801 -2.033051 -13.57803 L -2.034058 -13.57904 L -9.605072 -5.329041 L -9.601074 -5.325043 C -9.847076 -5.078033 -9.998077 -4.743042 -9.998077 -4.374054 C -10 -3.61499 -9.359985 -3 -8.571014 -3 ZM 7.600006 3.670013 L 0.0289917 -4.579987 L 0.0289917 -4.578979 C -0.2310181 -4.838989 -0.5950012 -4.999969 -0.9990234 -4.999969 C -1.000031 -4.999969 -1.001038 -4.999969 -1.002014 -4.999969 C -1.002991 -4.999969 -1.005005 -4.999969 -1.005005 -4.999969 C -1.408997 -4.999969 -1.774017 -4.838959 -2.03302 -4.578979 L -2.034027 -4.579987 L -9.605042 3.670013 L -9.601044 3.674011 C -9.847046 3.921021 -9.998047 4.256012 -9.998047 4.625 C -9.998047 5.38501 -9.358032 6 -8.569061 6 C -8.135071 6 -7.748047 5.813995 -7.486053 5.520996 L -2.433044 -0.09100342 L -2.433044 9.550995 C -2.433044 10.34698 -1.802032 10.991 -1.024048 10.991 C -0.2460632 10.991 0.3849487 10.34601 0.3849487 9.550995 L 0.3849487 -0.1459961 L 5.58194 5.617004 L 5.58194 5.615997 C 5.838928 5.855011 6.187927 6.001984 6.572937 6.001984 C 7.361938 6.001984 8.001923 5.386993 8.001923 4.626984 C 8 4.253998 7.847992 3.917999 7.600006 3.670013 L 7.600006 3.670013 Z',
                lineColor: '<%= getClient("wholeColorzdy") %>',
                fill: '<%= getClient("wholeColorzdy") %>'
            }
        ]
    });

    //消弧线圈
    twaver.Util.registerImage('xiaohuxianquan', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 13.646 -20.14001 C 13.375 -20.15201 13.12 -20.05301 12.92599 -19.88303 C 12.733 -19.71402 12.60098 -19.47403 12.577 -19.20303 C 12.53 -18.66104 12.931 -18.20303 13.474 -18.18002 L 23.23801 -19.43604 L 3.238007 -3.218048 C 1.893005 -4.138062 1 -5.376038 1 -7.000061 C 1 -11.41806 7.582001 -13.00006 12 -13.00006 L 12 -15.00006 C 7.582001 -15.00006 1 -16.58206 1 -21.00006 C 1 -25.41806 7.582001 -27.00006 12 -27.00006 L 12 -37.37506 L 10 -37.37506 L 10 -28.89505 C 4.832001 -28.37704 -1 -25.87805 -1 -21.00006 C -1 -17.47006 2.057007 -15.19006 5.703003 -14.00006 C 2.057007 -12.81006 -1 -10.53006 -1 -7.000061 C -1 -4.900055 0.08401489 -3.243073 1.727997 -1.993073 L -9 6.70694 L -9 -27 L -11 -27 L -11 8.32901 L -28.15201 22.23801 L -26.73801 23.65201 L -11 10.89001 L -11 28 L -9 28 L -9 9.268005 L 3.520996 -0.8859863 C 4.208008 -0.5409851 4.942993 -0.2479858 5.703003 0 C 2.057007 1.190002 -1 3.471008 -1 7 C -1 10.52899 2.057007 12.81 5.703003 14 C 2.057007 15.19 -1 17.47101 -1 21 C -1 25.87799 4.832001 28.37701 10 28.89499 L 10 37.125 L 12 37.125 L 12 27 C 7.582001 27 1 25.418 1 21 C 1 16.582 7.582001 15 12 15 L 12 13 C 7.582001 13 1 11.418 1 7 C 1 2.582001 7.582001 1 12 1 L 12 -1 C 9.895996 -1 7.306 -1.36499 5.164001 -2.217987 L 24.60199 -17.97998 L 21.17499 -9.113983 C 21.12799 -8.572998 21.53 -8.11499 22.073 -8.090973 C 22.616 -8.066956 23.09399 -8.486969 23.13998 -9.027985 L 27.15198 -21.35098 L 13.646 -20.14001 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //CT-GD
    twaver.Util.registerImage('CT-GD', {
        w: 50,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 10.5 1 C 10.5 -2.371002 6.554016 -5.140991 1.5 -5.46701 L 1.5 -39.5 L -0.5 -39.5 L -0.5 -5.46701 C -5.554016 -5.141022 -9.5 -2.370026 -9.5 1 C -9.5 4.370026 -5.554016 7.140991 -0.5 7.46701 L -0.5 41.5 L 1.5 41.5 L 1.5 7.46701 C 6.554016 7.140991 10.5 4.371002 10.5 1 ZM -7.5 1 C -7.5 -1.294006 -4.445007 -3.18399 -0.5 -3.460999 L -0.5 5.460999 C -4.445007 5.18399 -7.5 3.294006 -7.5 1 ZM 1.5 5.460999 L 1.5 -3.460999 C 5.445007 -3.18399 8.5 -1.294006 8.5 1 C 8.5 3.294006 5.445007 5.18399 1.5 5.460999 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //CT
    twaver.Util.registerImage('CT', {
        w: 70,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M -0.5 19.53299 L -0.5 19.46799 C 4.554016 19.142 8.5 16.371 8.5 13.00101 C 8.5 10.68201 6.625 8.651001 3.812012 7.501007 C 6.625 6.351013 8.5 4.320007 8.5 2.001007 C 8.5 -1.369995 4.554016 -4.140015 -0.5 -4.466003 L -0.5 -4.531006 C 4.554016 -4.856995 8.5 -7.627991 8.5 -10.99799 C 8.5 -14.3681 4.554016 -17.13901 -0.5 -17.46509 L -0.5 -17.53009 C 4.554016 -17.85599 8.5 -20.62711 8.5 -23.9971 C 8.5 -27.3671 4.554016 -30.13811 -0.5 -30.4641 L -0.5 -39.5 L -2.5 -39.5 L -2.5 -30.467 C -6.494019 -30.209 -9.791016 -28.423 -11 -26.022 C -12.20898 -28.423 -15.50598 -30.209 -19.5 -30.467 L -19.5 -39.5 L -21.5 -39.5 L -21.5 -30.467 C -26.55402 -30.14101 -30.5 -27.37 -30.5 -24 C -30.5 -20.63 -26.55402 -17.85901 -21.5 -17.53299 L -21.5 -17.46799 C -26.55402 -17.142 -30.5 -14.371 -30.5 -11.00101 C -30.5 -7.631012 -26.55402 -4.859985 -21.5 -4.533997 L -21.5 -4.468994 C -26.55402 -4.143005 -30.5 -1.372009 -30.5 1.997986 C -30.5 4.316986 -28.625 6.348114 -25.81201 7.497986 C -28.625 8.64801 -30.5 10.67899 -30.5 12.99799 C -30.5 16.36899 -26.55402 19.13901 -21.5 19.46509 L -21.5 19.53009 C -26.55402 19.85599 -30.5 22.62701 -30.5 25.9971 C -30.5 29.3671 -26.55402 32.13809 -21.5 32.46411 L -21.5 41.4971 L -19.5 41.4971 L -19.5 32.46411 C -15.50598 32.20609 -12.20898 30.4201 -11 28.0191 C -9.791016 30.4201 -6.494019 32.20609 -2.5 32.46411 L -2.5 41.4971 L -0.5 41.4971 L -0.5 32.46411 C 4.554016 32.13809 8.5 29.3671 8.5 25.9971 C 8.5 22.62701 4.554016 19.85901 -0.5 19.53299 ZM -0.5 -28.461 C 3.445007 -28.18401 6.5 -26.29401 6.5 -24 C 6.5 -21.70599 3.445007 -19.81599 -0.5 -19.539 L -0.5 -28.461 ZM -0.5 -15.461 C 3.445007 -15.18399 6.5 -13.29401 6.5 -11 C 6.5 -8.705994 3.445007 -6.81601 -0.5 -6.539001 L -0.5 -15.461 ZM -0.5 -2.460999 C 3.445007 -2.18399 6.5 -0.2940063 6.5 2 C 6.5 4.294006 3.445007 6.18399 -0.5 6.460999 L -0.5 -2.460999 ZM -0.5 8.539001 C 3.445007 8.81601 6.5 10.70599 6.5 13 C 6.5 15.29401 3.445007 17.18399 -0.5 17.461 L -0.5 8.539001 ZM -21.5 30.461 C -25.44501 30.18399 -28.5 28.29401 -28.5 26 C -28.5 23.70599 -25.44501 21.81601 -21.5 21.539 L -21.5 30.461 ZM -21.5 17.461 C -25.44501 17.18399 -28.5 15.29401 -28.5 13 C -28.5 10.70599 -25.44501 8.81601 -21.5 8.539001 L -21.5 17.461 ZM -21.5 6.460999 C -25.44501 6.18399 -28.5 4.294006 -28.5 2 C -28.5 -0.2940063 -25.44501 -2.18399 -21.5 -2.460999 L -21.5 6.460999 ZM -21.5 -6.539001 C -25.44501 -6.81601 -28.5 -8.705994 -28.5 -11 C -28.5 -13.29401 -25.44501 -15.18399 -21.5 -15.461 L -21.5 -6.539001 ZM -21.5 -19.539 C -25.44501 -19.81599 -28.5 -21.70599 -28.5 -24 C -28.5 -26.29401 -25.44501 -28.18401 -21.5 -28.461 L -21.5 -19.539 ZM -19.5 -28.461 C -15.55499 -28.18401 -12.5 -26.29401 -12.5 -24 C -12.5 -21.70599 -15.55499 -19.81599 -19.5 -19.539 L -19.5 -28.461 ZM -19.5 -15.461 C -15.55499 -15.18399 -12.5 -13.29401 -12.5 -11 C -12.5 -8.705994 -15.55499 -6.81601 -19.5 -6.539001 L -19.5 -15.461 ZM -19.5 -2.460999 C -15.55499 -2.18399 -12.5 -0.2940063 -12.5 2 C -12.5 4.294006 -15.55499 6.18399 -19.5 6.460999 L -19.5 -2.460999 ZM -11 4.022003 C -10.26801 5.476013 -8.768982 6.700012 -6.812012 7.5 C -8.768005 8.299988 -10.26703 9.523987 -11 10.978 C -11.73199 9.523987 -13.23102 8.299988 -15.18799 7.5 C -13.23102 6.700012 -11.73199 5.476013 -11 4.022003 ZM -19.5 8.539001 C -15.55499 8.81601 -12.5 10.70599 -12.5 13 C -12.5 15.29401 -15.55499 17.18399 -19.5 17.461 L -19.5 8.539001 ZM -19.5 30.461 L -19.5 21.539 C -15.55499 21.81601 -12.5 23.70599 -12.5 26 C -12.5 28.29401 -15.55499 30.18399 -19.5 30.461 ZM -2.5 30.461 C -6.445007 30.18399 -9.5 28.29401 -9.5 26 C -9.5 23.70599 -6.445007 21.81601 -2.5 21.539 L -2.5 30.461 ZM -2.5 19.53299 C -6.494019 19.79099 -9.791016 21.577 -11 23.978 C -12.20898 21.577 -15.50598 19.79099 -19.5 19.53299 L -19.5 19.46799 C -15.50598 19.20999 -12.20898 17.42401 -11 15.02301 C -9.791016 17.42401 -6.494019 19.20999 -2.5 19.46799 L -2.5 19.53299 ZM -2.5 17.461 C -6.445007 17.18399 -9.5 15.29401 -9.5 13 C -9.5 10.70599 -6.445007 8.81601 -2.5 8.539001 L -2.5 17.461 ZM -2.5 6.460999 C -6.445007 6.18399 -9.5 4.294006 -9.5 2 C -9.5 -0.2940063 -6.445007 -2.18399 -2.5 -2.460999 L -2.5 6.460999 ZM -2.5 -4.46701 C -6.494019 -4.209015 -9.791016 -2.423004 -11 -0.02200317 C -12.20898 -2.423004 -15.50598 -4.209015 -19.5 -4.46701 L -19.5 -4.532013 C -15.50598 -4.790009 -12.20898 -6.575989 -11 -8.97699 C -9.791016 -6.575989 -6.494019 -4.790009 -2.5 -4.532013 L -2.5 -4.46701 ZM -2.5 -6.539001 C -6.445007 -6.81601 -9.5 -8.705994 -9.5 -11 C -9.5 -13.29401 -6.445007 -15.18399 -2.5 -15.461 L -2.5 -6.539001 ZM -2.5 -17.46701 C -6.494019 -17.20901 -9.791016 -15.423 -11 -13.022 C -12.20898 -15.423 -15.50598 -17.20901 -19.5 -17.46701 L -19.5 -17.53201 C -15.50598 -17.79001 -12.20898 -19.576 -11 -21.97701 C -9.791016 -19.576 -6.494019 -17.79001 -2.5 -17.53201 L -2.5 -17.46701 ZM -2.5 -19.539 C -6.445007 -19.81599 -9.5 -21.70599 -9.5 -24 C -9.5 -26.29401 -6.445007 -28.18401 -2.5 -28.461 L -2.5 -19.539 ZM -0.5 30.461 L -0.5 21.539 C 3.445007 21.81601 6.5 23.70599 6.5 26 C 6.5 28.29401 3.445007 30.18399 -0.5 30.461 ZM 28.5 -11 C 28.5 -14.371 24.55402 -17.14099 19.5 -17.46701 L 19.5 -17.53201 C 24.55402 -17.858 28.5 -20.629 28.5 -23.99899 C 28.5 -27.369 24.55402 -30.14 19.5 -30.466 L 19.5 -39.5 L 17.5 -39.5 L 17.5 -30.467 C 12.44598 -30.14101 8.5 -27.37 8.5 -24 C 8.5 -20.63 12.44598 -17.85901 17.5 -17.53299 L 17.5 -17.46799 C 12.44598 -17.142 8.5 -14.371 8.5 -11.00101 C 8.5 -7.631012 12.44598 -4.859985 17.5 -4.533997 L 17.5 -4.468994 C 12.44598 -4.143005 8.5 -1.372009 8.5 1.997986 C 8.5 4.316986 10.375 6.348114 13.18799 7.497986 C 10.375 8.64801 8.5 10.67899 8.5 12.99799 C 8.5 16.36899 12.44598 19.13901 17.5 19.46509 L 17.5 19.53009 C 12.44598 19.85599 8.5 22.62701 8.5 25.9971 C 8.5 29.3671 12.44598 32.13809 17.5 32.46411 L 17.5 41.4971 L 19.5 41.4971 L 19.5 32.46411 C 24.55402 32.13809 28.5 29.3671 28.5 25.9971 C 28.5 22.62701 24.55402 19.85611 19.5 19.53009 L 19.5 19.46509 C 24.55402 19.1391 28.5 16.3681 28.5 12.99799 C 28.5 10.67899 26.625 8.64801 23.81201 7.497986 C 26.625 6.348114 28.5 4.316986 28.5 1.997986 C 28.5 -1.372986 24.55402 -4.142914 19.5 -4.468994 L 19.5 -4.533997 C 24.55402 -4.859009 28.5 -7.628998 28.5 -11 ZM 19.5 -28.461 C 23.44501 -28.18401 26.5 -26.29401 26.5 -24 C 26.5 -21.70599 23.44501 -19.81599 19.5 -19.539 L 19.5 -28.461 ZM 19.5 -15.461 C 23.44501 -15.18399 26.5 -13.29401 26.5 -11 C 26.5 -8.705994 23.44501 -6.81601 19.5 -6.539001 L 19.5 -15.461 ZM 17.5 30.461 C 13.55499 30.18399 10.5 28.29401 10.5 26 C 10.5 23.70599 13.55499 21.81601 17.5 21.539 L 17.5 30.461 ZM 17.5 17.461 C 13.55499 17.18399 10.5 15.29401 10.5 13 C 10.5 10.70599 13.55499 8.81601 17.5 8.539001 L 17.5 17.461 ZM 17.5 6.460999 C 13.55499 6.18399 10.5 4.294006 10.5 2 C 10.5 -0.2940063 13.55499 -2.18399 17.5 -2.460999 L 17.5 6.460999 ZM 17.5 -6.539001 C 13.55499 -6.81601 10.5 -8.705994 10.5 -11 C 10.5 -13.29401 13.55499 -15.18399 17.5 -15.461 L 17.5 -6.539001 ZM 17.5 -19.539 C 13.55499 -19.81599 10.5 -21.70599 10.5 -24 C 10.5 -26.29401 13.55499 -28.18401 17.5 -28.461 L 17.5 -19.539 ZM 26.5 26 C 26.5 28.29401 23.44501 30.18399 19.5 30.461 L 19.5 21.539 C 23.44501 21.81601 26.5 23.70599 26.5 26 ZM 26.5 13 C 26.5 15.29401 23.44501 17.18399 19.5 17.461 L 19.5 8.539001 C 23.44501 8.81601 26.5 10.70599 26.5 13 ZM 26.5 2 C 26.5 4.294006 23.44501 6.18399 19.5 6.460999 L 19.5 -2.460999 C 23.44501 -2.18399 26.5 -0.2940063 26.5 2 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //PT
    twaver.Util.registerImage('PT', {
        w: 100,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 34.5 -27.5 L 34.5 -32.5 L 41.5 -32.5 L 41.5 -34.5 L 25.5 -34.5 L 25.5 -32.5 L 32.5 -32.5 L 32.5 -27.5 L 22.5 -27.5 L 22.5 14.5 L 32.5 14.5 L 32.5 22.5 L -13.5 22.5 L -13.5 10.979 C -10.76001 13.177 -7.286011 14.5 -3.5 14.5 C 5.336975 14.5 12.5 7.337006 12.5 -1.5 C 12.5 -5.765991 10.82001 -9.631989 8.098999 -12.5 C 10.82098 -15.36801 12.5 -19.23401 12.5 -23.5 C 12.5 -32.33701 5.336975 -39.5 -3.5 -39.5 C -8.018005 -39.5 -12.091 -37.62 -15 -34.60901 C -17.909 -37.62 -21.98199 -39.5 -26.5 -39.5 C -35.33698 -39.5 -42.5 -32.33701 -42.5 -23.5 C -42.5 -19.23401 -40.82001 -15.36801 -38.099 -12.5 C -40.82098 -9.631989 -42.5 -5.765991 -42.5 -1.5 C -42.5 7.337006 -35.33698 14.5 -26.5 14.5 C -22.23401 14.5 -18.36798 12.82001 -15.5 10.099 L -15.5 22.5 L -15.5 24.5 L 8.5 24.5 L 8.5 46.5 L 10.5 46.5 L 10.5 24.5 L 34.5 24.5 L 34.5 22.5 L 34.5 14.5 L 44.5 14.5 L 44.5 -27.5 L 34.5 -27.5 ZM -3.5 -37.5 C 4.231995 -37.5 10.5 -31.23199 10.5 -23.5 C 10.5 -19.76501 9.028015 -16.38101 6.645996 -13.871 C 3.883972 -16.138 0.3519897 -17.5 -3.5 -17.5 C -7.35199 -17.5 -10.88397 -16.138 -13.646 -13.871 C -13.66498 -13.89099 -13.68097 -13.91101 -13.70001 -13.92999 C -11.70001 -16.60098 -10.50104 -19.90698 -10.50104 -23.5 C -10.50104 -27.09302 -11.70001 -30.39899 -13.70001 -33.07001 C -11.146 -35.79099 -7.526001 -37.5 -3.5 -37.5 ZM 5.143005 -12.5 C 2.762024 -10.62701 -0.2349854 -9.5 -3.5 -9.5 C -6.765015 -9.5 -9.762024 -10.62701 -12.14301 -12.5 C -9.762024 -14.37299 -6.765015 -15.5 -3.5 -15.5 C -0.2349854 -15.5 2.762024 -14.37299 5.143005 -12.5 ZM -12.5 -23.5 C -12.5 -20.535 -13.42798 -17.79001 -15 -15.526 C -16.57202 -17.79001 -17.5 -20.535 -17.5 -23.5 C -17.5 -26.465 -16.57202 -29.20999 -15 -31.474 C -13.42798 -29.20999 -12.5 -26.465 -12.5 -23.5 ZM -40.5 -23.5 C -40.5 -31.23199 -34.23199 -37.5 -26.5 -37.5 C -22.474 -37.5 -18.854 -35.79099 -16.30103 -33.07001 C -18.30103 -30.39902 -19.5 -27.09302 -19.5 -23.5 C -19.5 -19.90698 -18.30103 -16.60101 -16.30103 -13.92999 C -16.32001 -13.91098 -16.336 -13.88998 -16.35504 -13.871 C -19.11707 -16.138 -22.64905 -17.5 -26.50104 -17.5 C -30.35303 -17.5 -33.88501 -16.138 -36.64703 -13.871 C -39.02802 -16.38101 -40.5 -19.76501 -40.5 -23.5 ZM -17.85699 -12.5 C -20.23798 -10.62701 -23.23499 -9.5 -26.5 -9.5 C -29.76501 -9.5 -32.76202 -10.62701 -35.14301 -12.5 C -32.76202 -14.37299 -29.76501 -15.5 -26.5 -15.5 C -23.23499 -15.5 -20.23798 -14.37299 -17.85699 -12.5 ZM -26.5 12.5 C -34.23199 12.5 -40.5 6.231995 -40.5 -1.5 C -40.5 -5.234985 -39.02802 -8.618988 -36.646 -11.129 C -33.88397 -8.862 -30.35199 -7.5 -26.5 -7.5 C -22.64801 -7.5 -19.11603 -8.862 -16.354 -11.129 C -16.33502 -11.10901 -16.31903 -11.08899 -16.29999 -11.07001 C -18.29999 -8.399017 -19.49896 -5.093018 -19.49896 -1.5 C -19.49896 2.093018 -18.29999 5.398987 -16.29999 8.070007 C -18.854 10.79099 -22.474 12.5 -26.5 12.5 ZM -17.5 -1.5 C -17.5 -4.464996 -16.57202 -7.209991 -15 -9.473999 C -13.42798 -7.209991 -12.5 -4.464996 -12.5 -1.5 C -12.5 1.464996 -13.42798 4.209991 -15 6.473999 C -16.57202 4.209991 -17.5 1.464996 -17.5 -1.5 ZM -10.5 -1.5 C -10.5 -5.093994 -11.69897 -8.398987 -13.69897 -11.07001 C -13.67999 -11.08902 -13.664 -11.11002 -13.64496 -11.129 C -10.88293 -8.862 -7.350952 -7.5 -3.498962 -7.5 C 0.3530273 -7.5 3.88501 -8.862 6.647034 -11.129 C 9.030029 -8.618988 10.50104 -5.234009 10.50104 -1.5 C 10.50104 6.231995 4.233032 12.5 -3.498962 12.5 C -7.524963 12.5 -11.14496 10.79099 -13.69794 8.070007 C -11.69897 5.398987 -10.5 2.093994 -10.5 -1.5 ZM 42.5 12.5 L 34.5 12.5 L 34.5 -7.493988 L 39.50299 -7.493988 L 33.50598 -17.5 L 27.50897 -7.493988 L 32.5 -7.493988 L 32.5 12.5 L 24.5 12.5 L 24.5 -25.5 L 42.5 -25.5 L 42.5 12.5 ZM 38.5 -38.5 L 28.5 -38.5 L 28.5 -36.5 L 38.5 -36.5 L 38.5 -38.5 ZM 36.5 -42.5 L 30.5 -42.5 L 30.5 -40.5 L 36.5 -40.5 L 36.5 -42.5 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //PT1-GD
    twaver.Util.registerImage('PT1-GD', {
        w: 70,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 11.17499 4 C 17.33002 0.5899963 21.5 -5.964996 21.5 -13.5 C 21.5 -24.54599 12.54602 -33.5 1.5 -33.5 C -9.546021 -33.5 -18.5 -24.54599 -18.5 -13.5 C -18.5 -5.964996 -14.33002 0.5899963 -8.174988 4 C -14.33002 7.410004 -18.5 13.965 -18.5 21.5 C -18.5 32.54599 -9.546021 41.5 1.5 41.5 C 12.54602 41.5 21.5 32.54599 21.5 21.5 C 21.5 13.965 17.33002 7.410004 11.17499 4 ZM 19.5 -13.5 C 19.5 -6.183014 15.12701 0.1010132 8.859009 2.916016 C 6.875 2.129028 4.736023 1.661011 2.5 1.550018 L 2.5 -11.5 L 1.781006 -11.5 L 17.5 -21.5 L 16.66302 -23.17401 C 18.45001 -20.37799 19.5 -17.064 19.5 -13.5 ZM 5.650024 4 C 4.630005 4.240997 3.578003 4.390015 2.5 4.449005 L 2.5 3.550995 C 3.578003 3.609985 4.630981 3.759003 5.650024 4 ZM 1.5 -31.5 C 7.747009 -31.5 13.24701 -28.315 16.47498 -23.483 L 1.764954 -13.883 L -13.73804 -23.04999 C -10.55499 -28.12 -4.929016 -31.5 1.5 -31.5 ZM -16.5 -13.5 C -16.5 -16.21899 -15.88 -18.78699 -14.80103 -21.09799 L 0.5469971 -12.276 L 0.9949951 -11.5 L 0.5 -11.5 L 0.5 1.549988 C -1.736023 1.66098 -3.875 2.128998 -5.859009 2.915985 C -12.12701 0.1010132 -16.5 -6.183014 -16.5 -13.5 ZM 0.5 3.550995 L 0.5 4.449005 C -0.5780029 4.390015 -1.630981 4.240997 -2.650024 4 C -1.630981 3.759003 -0.5780029 3.609985 0.5 3.550995 ZM 0.5 23.5 L 0.5 39.44901 C -8.973999 38.92801 -16.5 31.104 -16.5 21.5 C -16.5 18.78101 -15.88 16.21301 -14.80103 13.90201 L 0.5469971 22.724 L 0.9949951 23.5 L 0.5 23.5 ZM 19.5 21.5 C 19.5 31.104 11.974 38.92801 2.5 39.44901 L 2.5 23.5 L 1.781006 23.5 L 17.5 13.5 L 16.66302 11.82599 C 18.45001 14.62201 19.5 17.936 19.5 21.5 ZM 1.765015 21.117 L -13.73798 11.95001 C -11.854 8.950012 -9.117981 6.548004 -5.858948 5.084015 C -3.578918 5.988007 -1.100952 6.5 1.500061 6.5 C 4.101074 6.5 6.579041 5.988007 8.85907 5.084015 C 11.96307 6.478027 14.60309 8.71402 16.47406 11.51703 L 1.765015 21.117 ZM 2.5 -43.5 L 0.5 -43.5 L 0.5 -33.5 L 1.5 -33.5 L 2.5 -33.5 L 2.5 -43.5 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //PT1
    twaver.Util.registerImage('PT1', {
        w: 70,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 12.46399 5.5 C 17.33398 1.85199 20.5 -3.946991 20.5 -10.5 C 20.5 -21.20801 12.078 -29.92499 1.5 -30.45001 L 1.5 -41.5 L -0.5 -41.5 L -0.5 -30.45001 C -11.078 -29.92603 -19.5 -21.20901 -19.5 -10.5 C -19.5 -3.946991 -16.33398 1.85199 -11.46399 5.5 C -16.33398 9.14801 -19.5 14.94699 -19.5 21.5 C -19.5 32.54599 -10.54602 41.5 0.5 41.5 C 11.54602 41.5 20.5 32.54599 20.5 21.5 C 20.5 14.94699 17.33398 9.14801 12.46399 5.5 ZM -17.5 -10.5 C -17.5 -20.44101 -9.440979 -28.5 0.5 -28.5 C 10.44098 -28.5 18.5 -20.44101 18.5 -10.5 C 18.5 -4.350006 15.41101 1.075012 10.70398 4.321014 C 7.713989 2.541016 4.231995 1.5 0.5 1.5 C -3.231995 1.5 -6.713989 2.540985 -9.703979 4.321014 C -14.41101 1.075012 -17.5 -4.350006 -17.5 -10.5 ZM 8.721985 5.5 C 6.255981 6.769989 3.464966 7.5 0.5 7.5 C -2.464966 7.5 -5.255981 6.769989 -7.721985 5.5 C -5.255981 4.230011 -2.464966 3.5 0.5 3.5 C 3.464966 3.5 6.255981 4.230011 8.721985 5.5 ZM 0.5 39.5 C -9.440979 39.5 -17.5 31.44101 -17.5 21.5 C -17.5 15.35001 -14.41101 9.924988 -9.703979 6.678986 C -6.713989 8.458984 -3.231995 9.5 0.5 9.5 C 4.231995 9.5 7.713989 8.459015 10.70398 6.678986 C 15.41095 9.925995 18.5 15.34998 18.5 21.5 C 18.5 31.44101 10.44098 39.5 0.5 39.5 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //PT2
    twaver.Util.registerImage('PT2', {
        w: 70,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 15.371 -27.371 C 14.448 -34.76999 8.148987 -40.5 0.5 -40.5 C -7.148987 -40.5 -13.448 -34.76999 -14.371 -27.371 C -21.76999 -26.448 -27.5 -20.14899 -27.5 -12.5 C -27.5 -4.851013 -21.76999 1.447998 -14.371 2.371002 C -13.448 9.769989 -7.148987 15.5 0.5 15.5 C 8.148987 15.5 14.448 9.770996 15.371 2.371002 C 22.76999 1.447998 28.5 -4.851013 28.5 -12.5 C 28.5 -20.14899 22.771 -26.448 15.371 -27.371 ZM 0.5 -38.5 C 7 -38.5 12.371 -33.72299 13.332 -27.492 C 7.838013 -27.431 3.062012 -24.41699 0.5 -19.96201 C -2.062988 -24.41699 -6.838013 -27.431 -12.332 -27.492 C -11.371 -33.72299 -6 -38.5 0.5 -38.5 ZM 13.5 -25.5 C 13.5 -20.15399 10.271 -15.56699 5.660004 -13.569 C 4.612 -13.95401 3.514008 -14.228 2.371002 -14.371 C 2.227997 -15.51401 1.95401 -16.612 1.570007 -17.66 C 3.566986 -22.271 8.154999 -25.5 13.5 -25.5 ZM -0.5700073 -17.66 C -0.95401 -16.612 -1.229004 -15.51401 -1.371002 -14.371 C -2.514008 -14.228 -3.612 -13.95401 -4.660004 -13.569 C -9.270996 -15.56699 -12.5 -20.15399 -12.5 -25.5 C -7.154999 -25.5 -2.566986 -22.271 -0.5700073 -17.66 ZM -14.492 0.3320007 C -20.72299 -0.6289978 -25.5 -5.998993 -25.5 -12.5 C -25.5 -19.00101 -20.72299 -24.371 -14.492 -25.332 C -14.431 -19.83801 -11.41699 -15.06201 -6.962006 -12.5 C -11.41699 -9.937012 -14.431 -5.161987 -14.492 0.3320007 ZM -4.660004 -11.431 C -3.612 -11.04599 -2.514008 -10.772 -1.371002 -10.629 C -1.227997 -9.485992 -0.95401 -8.388 -0.5700073 -7.339996 C -2.567017 -2.729004 -7.154999 0.5 -12.5 0.5 C -12.5 -4.846008 -9.270996 -9.433014 -4.660004 -11.431 ZM 0.5 13.5 C -6 13.5 -11.371 8.723999 -12.332 2.490997 C -6.838013 2.429993 -2.062012 -0.5840149 0.5 -5.037994 C 3.062988 -0.5839844 7.838013 2.431 13.332 2.490997 C 12.371 8.723999 7 13.5 0.5 13.5 ZM 1.570007 -7.339996 C 1.95401 -8.388 2.229004 -9.485992 2.371002 -10.629 C 3.514008 -10.772 4.612 -11.04599 5.660004 -11.431 C 10.271 -9.433014 13.5 -4.846008 13.5 0.5 C 8.154999 0.5 3.566986 -2.729004 1.570007 -7.339996 ZM 15.492 0.3320007 C 15.431 -5.161987 12.41699 -9.937988 7.962006 -12.5 C 12.41699 -15.06299 15.431 -19.83801 15.492 -25.332 C 21.724 -24.371 26.5 -19.00101 26.5 -12.5 C 26.5 -5.998993 21.724 -0.6289978 15.492 0.3320007 ZM 2.5 39.5 L 2.5 15.5 L 0.5 15.5 L 0.5 39.5 L 2.5 39.5 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //PT3
    twaver.Util.registerImage('PT3', {
        w: 70,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 0.5 -35.5 L 0.5 -45.5 L -1.5 -45.5 L -1.5 -35.5 L -21.5 -35.5 L -21.5 -33.5 L 20.5 -33.5 L 20.5 -35.5 L 0.5 -35.5 ZM -21.5 -23.5 L -1.5 -23.5 L -1.5 -18.44901 C -6.266998 -18.21301 -10.58499 -16.31702 -13.901 -13.315 L -13.935 -13.349 L -14.63998 -12.64401 C -14.64099 -12.642 -14.64297 -12.64102 -14.64499 -12.63901 L -15.34998 -11.93402 L -15.31699 -11.90103 C -18.52798 -8.353027 -20.50098 -3.663025 -20.50098 1.499969 C -20.50098 6.658966 -18.53098 11.34598 -15.32397 14.89398 L -15.50699 15.077 L -14.078 16.50699 L -13.89499 16.323 C -10.57999 19.32098 -6.263977 21.215 -1.500977 21.45001 L -1.500977 26.50101 L -21.50098 26.50101 L -21.50098 28.50101 L 20.49902 28.50101 L 20.49902 26.50101 L 0.4990234 26.50101 L 0.4990234 21.45001 C 5.266022 21.21402 9.584015 19.31802 12.90002 16.31601 L 12.93402 16.35001 L 13.63901 15.64502 C 13.64001 15.64301 13.642 15.64203 13.64401 15.64001 L 14.349 14.93503 L 14.31601 14.90204 C 17.52701 11.35403 19.5 6.664032 19.5 1.501038 C 19.5 -3.657959 17.53 -8.344971 14.323 -11.89297 L 14.50601 -12.07599 L 13.07703 -13.50598 L 12.89401 -13.32199 C 9.57901 -16.31998 5.263 -18.21399 0.5 -18.44901 L 0.5 -23.5 L 20.5 -23.5 L 20.5 -25.5 L -21.5 -25.5 L -21.5 -23.5 ZM -13.909 13.479 C -16.755 10.29501 -18.5 6.106995 -18.5 1.5 C -18.5 -3.109985 -16.75201 -7.303009 -13.901 -10.487 L -1.921997 1.492004 L -13.909 13.479 ZM -0.5 19.5 C -5.105988 19.5 -9.295013 17.755 -12.479 14.90799 L -0.4930115 2.921997 L 11.48599 14.901 C 8.302002 17.75201 4.109985 19.5 -0.5 19.5 ZM 12.90799 -10.479 C 15.75497 -7.295013 17.5 -3.106018 17.5 1.5 C 17.5 6.109985 15.75201 10.30301 12.901 13.487 L 0.9219971 1.507996 L 12.90799 -10.479 ZM 11.479 -11.90799 L -0.5069885 0.07800293 L -12.48599 -11.901 C -9.300995 -14.75201 -5.109985 -16.5 -0.4989929 -16.5 C 4.105988 -16.5 8.295013 -14.755 11.479 -11.90799 ZM -15.5 35.5 L 14.5 35.5 L 14.5 33.5 L -15.5 33.5 L -15.5 35.5 ZM -9.5 42.5 L 8.5 42.5 L 8.5 40.5 L -9.5 40.5 L -9.5 42.5 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //PT4-GD
    twaver.Util.registerImage('PT4-GD', {
        w: 80,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 34.5 -1.5 C 34.5 -11.526 27.11401 -19.806 17.49103 -21.25201 C 18.13702 -23.21902 18.5 -25.315 18.5 -27.5 C 18.5 -38.54599 9.546021 -47.5 -1.5 -47.5 C -12.54602 -47.5 -21.5 -38.54599 -21.5 -27.5 C -21.5 -25.31601 -21.138 -23.22 -20.49103 -21.25201 C -30.11401 -19.80502 -37.5 -11.526 -37.5 -1.5 C -37.5 8.526001 -30.11401 16.806 -20.49103 18.25201 C -21.13702 20.21902 -21.5 22.315 -21.5 24.5 C -21.5 35.54599 -12.54602 44.5 -1.5 44.5 C 9.546021 44.5 18.5 35.54599 18.5 24.5 C 18.5 22.31601 18.138 20.22 17.49103 18.25201 C 27.11401 16.806 34.5 8.526001 34.5 -1.5 ZM -1.5 -45.5 C 8.440979 -45.5 16.5 -37.44101 16.5 -27.5 C 16.5 -25.375 16.112 -23.345 15.43701 -21.453 C 15.12402 -21.46802 14.81702 -21.5 14.5 -21.5 C 7.945984 -21.5 2.146973 -18.33401 -1.5 -13.46399 C -5.146973 -18.33398 -10.94598 -21.5 -17.5 -21.5 C -17.81598 -21.5 -18.12402 -21.46701 -18.43701 -21.453 C -19.11304 -23.34601 -19.5 -25.375 -19.5 -27.5 C -19.5 -37.44101 -11.44098 -45.5 -1.5 -45.5 ZM -1.5 4.5 C -1.815979 4.5 -2.124023 4.53299 -2.437012 4.546997 C -3.113037 2.653992 -3.5 0.625 -3.5 -1.5 C -3.5 -3.625 -3.112 -5.654999 -2.437012 -7.546997 C -2.124023 -7.531982 -1.817017 -7.5 -1.5 -7.5 C -1.182983 -7.5 -0.8759766 -7.53299 -0.5629883 -7.546997 C 0.1130371 -5.653992 0.5 -3.625 0.5 -1.5 C 0.5 0.625 0.1119995 2.654999 -0.5629883 4.546997 C -0.8759766 4.53299 -1.184021 4.5 -1.5 4.5 ZM -1.395996 6.505005 C -1.432007 6.576996 -1.463013 6.651001 -1.5 6.722015 C -1.536987 6.651001 -1.567993 6.577026 -1.604004 6.505005 C -1.569031 6.505005 -1.535034 6.5 -1.5 6.5 C -1.464966 6.5 -1.43103 6.505005 -1.395996 6.505005 ZM -2.679016 8.70401 C -5.926025 13.41101 -11.35004 16.5 -17.5 16.5 C -17.53497 16.5 -17.56897 16.495 -17.604 16.495 C -15.53503 12.341 -11.91602 9.108002 -7.494995 7.544983 L -6.937012 7.866974 L -6.574036 7.238983 C -5.661011 6.970978 -4.717041 6.777985 -3.750061 6.655975 C -3.434021 7.363007 -3.072021 8.042999 -2.679016 8.70401 ZM -17.604 -19.495 C -17.56903 -19.495 -17.53503 -19.5 -17.5 -19.5 C -11.34998 -19.5 -5.926025 -16.41101 -2.679016 -11.70401 C -3.072998 -11.043 -3.434021 -10.36301 -3.75 -9.654999 C -9.84198 -10.41699 -14.97498 -14.216 -17.604 -19.495 ZM -1.604004 -9.505005 C -1.567993 -9.576996 -1.536987 -9.651001 -1.5 -9.722015 C -1.463013 -9.651001 -1.432007 -9.577026 -1.395996 -9.505005 C -1.430969 -9.505005 -1.464966 -9.5 -1.5 -9.5 C -1.535034 -9.5 -1.56897 -9.505005 -1.604004 -9.505005 ZM 0.75 6.654999 C 6.84198 7.415985 11.97498 11.216 14.604 16.49399 C 14.56903 16.49399 14.53503 16.49899 14.5 16.49899 C 8.349976 16.49899 2.926025 13.41 -0.3209839 8.703003 C 0.07202148 8.042999 0.434021 7.363007 0.75 6.654999 ZM 1.491028 -7.747986 C 4.013 -8.126984 6.379028 -8.968994 8.5 -10.198 L 8.5 7.196991 C 6.379028 5.967987 4.013977 5.126984 1.491028 4.746979 C 2.137024 2.779968 2.5 0.6839905 2.5 -1.501007 C 2.5 -3.686005 2.138 -5.779999 1.491028 -7.747986 ZM 9.010986 7.507996 C 9.006958 7.505981 9.002014 7.502991 8.997986 7.5 L 9.028015 7.5 L 9.010986 7.507996 ZM 0.75 -9.654999 C 0.434021 -10.36301 0.07202148 -11.043 -0.3209839 -11.70401 C 2.926025 -16.41101 8.350037 -19.5 14.5 -19.5 C 14.53497 -19.5 14.56897 -19.495 14.604 -19.495 C 11.97498 -14.216 6.84198 -10.41699 0.75 -9.654999 ZM -35.5 -1.5 C -35.5 -10.67801 -28.62701 -18.23499 -19.75 -19.345 C -17.01801 -13.242 -11.323 -8.774994 -4.491028 -7.747986 C -5.137024 -5.780975 -5.5 -3.684998 -5.5 -1.5 C -5.5 0.6849976 -5.138 2.779999 -4.491028 4.747986 C -5.443054 4.890991 -6.379028 5.083984 -7.28302 5.356995 L -16.375 0.1080017 L -16.5 -0.1080017 L -16.5 -12.5 L -18.5 -12.5 L -18.5 -0.1080017 L -18.625 0.1080017 L -29.06299 6.134003 L -28.06299 7.865997 L -17.5 1.768005 L -9.700012 6.270996 C -14.16302 8.281982 -17.75 11.875 -19.75 16.34399 C -28.62701 15.23499 -35.5 7.678009 -35.5 -1.5 ZM -1.5 42.5 C -11.44098 42.5 -19.5 34.44101 -19.5 24.5 C -19.5 22.375 -19.112 20.345 -18.43701 18.453 C -18.12402 18.46802 -17.81702 18.5 -17.5 18.5 C -10.94598 18.5 -5.146973 15.33401 -1.5 10.46399 C 2.146973 15.33398 7.945984 18.5 14.5 18.5 C 14.81598 18.5 15.12402 18.46701 15.43701 18.453 C 16.11304 20.34601 16.5 22.375 16.5 24.5 C 16.5 34.44101 8.440979 42.5 -1.5 42.5 ZM 16.75 16.345 C 15.42102 13.375 13.39301 10.79401 10.86902 8.803009 L 25.50702 2.261017 L 24.68402 0.5030212 L 10.5 6.84201 L 10.5 -9.60199 L 25.26898 -2.846985 L 26.10095 -4.665985 L 10.72797 -11.698 C 13.31598 -13.703 15.39697 -16.32098 16.74994 -19.345 C 25.62695 -18.23599 32.49994 -10.67801 32.49994 -1.5 C 32.49994 7.678009 25.62701 15.23499 16.75 16.345 ZM -0.5 26.892 L -0.5 14.5 L -2.5 14.5 L -2.5 26.892 L -2.625 27.108 L -13.06299 33.134 L -12.06299 34.866 L -1.5 28.76801 L 9.062988 34.866 L 10.06299 33.134 L -0.375 27.108 L -0.5 26.892 ZM -1.5 -27.23199 L 9.062988 -21.134 L 10.06299 -22.866 L -0.375 -28.892 L -0.5 -29.108 L -0.5 -41.5 L -2.5 -41.5 L -2.5 -29.108 L -2.625 -28.892 L -13.06299 -22.866 L -12.06299 -21.134 L -1.5 -27.23199 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //PT5-GD
    twaver.Util.registerImage('PT5-GD', {
        w: 80,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M -18 17.49402 L -28.505 11.50903 L -29.5 13.20905 L -19.117 19.12506 L -18.99402 19.33606 L -18.99402 31.5 L -17.00601 31.5 L -17.00601 19.336 L -16.88303 19.125 L -6.500031 13.20898 L -7.495026 11.50897 L -18 17.49402 ZM -1.993988 -11.664 L -1.993988 0.5 L -0.005981445 0.5 L -0.005981445 -11.664 L 0.1170044 -11.875 L 10.5 -17.79102 L 9.505005 -19.49103 L -1 -13.50598 L -11.505 -19.49097 L -12.5 -17.79095 L -2.117004 -11.87494 L -1.993988 -11.664 ZM 16.793 -1.434998 C 17.884 -3.903992 18.5 -6.627991 18.5 -9.5 C 18.5 -20.54602 9.54599 -29.5 -1.5 -29.5 C -12.54599 -29.5 -21.5 -20.54602 -21.5 -9.5 C -21.5 -6.599976 -20.86899 -3.85199 -19.76001 -1.364014 C -29.74002 -0.2399902 -37.5 8.218994 -37.5 18.5 C -37.5 29.54602 -28.54599 38.5 -17.5 38.5 C -10.646 38.5 -4.604004 35.04999 -1 29.79498 C 2.604004 35.04999 8.645996 38.5 15.5 38.5 C 26.54599 38.5 35.5 29.54602 35.5 18.5 C 35.5 7.890991 27.233 -0.7650146 16.793 -1.434998 ZM -1.5 -27.5 C 8.44101 -27.5 16.5 -19.44098 16.5 -9.5 C 16.5 -6.604004 15.79999 -3.877991 14.58499 -1.453979 C 8.112976 -1.159973 2.440979 2.188049 -1 7.205017 C -4.604004 1.950012 -10.646 -1.5 -17.5 -1.5 C -17.535 -1.5 -17.569 -1.494995 -17.604 -1.494995 C -18.806 -3.90802 -19.5 -6.619995 -19.5 -9.5 C -19.5 -19.44098 -11.44101 -27.5 -1.5 -27.5 ZM 13.371 0.6370239 C 10.509 4.828003 5.920013 7.739014 0.6289978 8.364014 C 3.490997 4.171997 8.079987 1.262024 13.371 0.6370239 ZM -2.567993 8.445984 C -8.338989 8.105957 -13.38498 5.06897 -16.431 0.5529785 C -10.66 0.8939819 -5.614014 3.93103 -2.567993 8.445984 ZM -17.5 36.5 C -27.44101 36.5 -35.5 28.44098 -35.5 18.5 C -35.5 8.984985 -28.11301 1.215027 -18.76401 0.5629883 C -15.50101 6.14801 -9.618011 9.997009 -2.792999 10.43396 C -3.884003 12.90295 -4.5 15.62695 -4.5 18.49896 C -4.5 21.89099 -3.648987 25.08197 -2.158997 27.88098 C -5.322998 33.04401 -11.00101 36.5 -17.5 36.5 ZM -2.5 18.5 C -2.5 15.94397 -1.959991 13.51801 -1 11.31598 C -0.04000854 13.51697 0.5 15.94397 0.5 18.5 C 0.5 21.05603 -0.04000854 23.48199 -1 25.68402 C -1.959991 23.48199 -2.5 21.05603 -2.5 18.5 ZM 15.5 36.5 C 9.001007 36.5 3.322998 33.04401 0.1589966 27.88202 C 1.648987 25.08301 2.5 21.89203 2.5 18.5 C 2.5 15.59998 1.868988 12.85199 0.7600098 10.36401 C 7.194 9.639038 12.69101 5.861023 15.79401 0.5140381 C 25.59799 0.6720581 33.5 8.65802 33.5 18.49902 C 33.5 28.44098 25.44101 36.5 15.5 36.5 ZM -0.5 -39.5 L -2.5 -39.5 L -2.5 -29.5 L -1.5 -29.5 L -0.5 -29.5 L -0.5 -39.5 ZM 12.5 26.33301 L 12.5 10.79303 L 26.12799 16.65302 L 26.978 14.84204 L 12.5 8.616028 L 12.5 8.5 L 12.229 8.5 L 11.87302 8.346985 L 11.79999 8.5 L 10.5 8.5 L 10.5 28.5 L 12.5 28.5 L 12.5 28.43298 L 27.509 22.25195 L 26.65601 20.50293 L 12.5 26.33301 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //PT5
    twaver.Util.registerImage('PT5', {
        w: 80,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 15.793 -0.4349976 C 16.884 -2.903992 17.5 -5.627991 17.5 -8.5 C 17.5 -19.54602 8.54599 -28.5 -2.5 -28.5 C -13.54599 -28.5 -22.5 -19.54602 -22.5 -8.5 C -22.5 -5.599976 -21.86899 -2.85199 -20.76001 -0.3640137 C -30.74002 0.7600098 -38.5 9.218994 -38.5 19.5 C -38.5 30.54602 -29.54599 39.5 -18.5 39.5 C -11.646 39.5 -5.604004 36.04999 -2 30.79498 C 1.604004 36.04999 7.645996 39.5 14.5 39.5 C 25.54599 39.5 34.5 30.54602 34.5 19.5 C 34.5 8.890991 26.233 0.2349854 15.793 -0.4349976 ZM -2.5 -26.5 C 7.44101 -26.5 15.5 -18.44098 15.5 -8.5 C 15.5 -5.604004 14.79999 -2.877991 13.58499 -0.4539795 C 7.112976 -0.1599731 1.440979 3.188049 -2 8.205017 C -5.604004 2.950012 -11.646 -0.5 -18.5 -0.5 C -18.535 -0.5 -18.569 -0.4949951 -18.604 -0.4949951 C -19.806 -2.90802 -20.5 -5.619995 -20.5 -8.5 C -20.5 -18.44098 -12.44101 -26.5 -2.5 -26.5 ZM 12.371 1.637024 C 9.509003 5.828003 4.920013 8.739014 -0.3710022 9.364014 C 2.490997 5.171997 7.079987 2.262024 12.371 1.637024 ZM -3.567993 9.445984 C -9.338989 9.105957 -14.38498 6.06897 -17.431 1.552979 C -11.66 1.893982 -6.614014 4.93103 -3.567993 9.445984 ZM -18.5 37.5 C -28.44101 37.5 -36.5 29.44098 -36.5 19.5 C -36.5 9.984985 -29.11301 2.215027 -19.76401 1.562988 C -16.50101 7.14801 -10.61801 10.99701 -3.792999 11.43396 C -4.884003 13.90295 -5.5 16.62695 -5.5 19.49896 C -5.5 22.89099 -4.648987 26.08197 -3.158997 28.88098 C -6.322998 34.04401 -12.00101 37.5 -18.5 37.5 ZM -3.5 19.5 C -3.5 16.94397 -2.959991 14.51801 -2 12.31598 C -1.040009 14.51697 -0.5 16.94397 -0.5 19.5 C -0.5 22.05603 -1.040009 24.48199 -2 26.68402 C -2.959991 24.48199 -3.5 22.05603 -3.5 19.5 ZM 14.5 37.5 C 8.001007 37.5 2.322998 34.04401 -0.8410034 28.88202 C 0.6489868 26.08301 1.5 22.89203 1.5 19.5 C 1.5 16.59998 0.868988 13.85199 -0.2399902 11.36401 C 6.194 10.63904 11.69101 6.861023 14.79401 1.514038 C 24.59799 1.672058 32.5 9.65802 32.5 19.49902 C 32.5 29.44098 24.44101 37.5 14.5 37.5 ZM -1.5 -38.5 L -3.5 -38.5 L -3.5 -28.5 L -2.5 -28.5 L -1.5 -28.5 L -1.5 -38.5 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //并联电抗器
    twaver.Util.registerImage('biliandiankangqi', {
        w: 80,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M -0.5 24.5 L -0.5 15.383 C 8.498993 14.38699 15.5 6.764984 15.5 -2.5 C 15.5 -12.104 7.972992 -19.92801 -1.5 -20.44901 L -1.5 -40.5 L -3.5 -40.5 L -3.5 -20.44101 L -3.5 -18.5 L -3.5 -18.431 C -3.166992 -18.45499 -2.838989 -18.5 -2.5 -18.5 C 6.335999 -18.5 13.5 -11.33701 13.5 -2.5 C 13.5 5.65799 7.390991 12.37601 -0.5 13.36099 L -0.5 -6.5 L -1.5 -6.5 L -2.5 -6.5 L -20.5 -6.5 L -20.5 -4.5 L -20.383 -4.5 C -20.45599 -3.842987 -20.5 -3.177002 -20.5 -2.5 C -20.5 7.44101 -12.44101 15.5 -2.5 15.5 L -2.5 24.5 L -26.5 24.5 L -26.5 26.5 L 21.5 26.5 L 21.5 24.5 L -0.5 24.5 ZM -2.5 13.5 C -11.336 13.5 -18.5 6.337006 -18.5 -2.5 C -18.5 -3.178986 -18.444 -3.843994 -18.362 -4.5 L -2.5 -4.5 L -2.5 13.5 ZM -19.5 33.5 L 14.5 33.5 L 14.5 31.5 L -19.5 31.5 L -19.5 33.5 ZM -12.5 40.5 L 7.5 40.5 L 7.5 38.5 L -12.5 38.5 L -12.5 40.5 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //串联电抗器
    twaver.Util.registerImage('chuanliandiankangqi', {
        w: 80,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 1 -15.94901 L 1 -36 L -1 -36 L -1 -15.94101 L -1 -14 L -1 -13.931 C -0.6669922 -13.95499 -0.3389893 -14 0 -14 C 8.835999 -14 16 -6.837006 16 2 C 16 10.15799 9.890991 16.87601 2 17.86099 L 2 -2 L 1 -2 L 0 -2 L -18 -2 L -18 0 L -17.883 0 C -17.95599 0.6570129 -18 1.322998 -18 2 C -18 11.94101 -9.94101 20 0 20 L 0 36 L 2 36 L 2 19.883 C 10.99899 18.88699 18 11.26498 18 2 C 18 -7.604004 10.47299 -15.42801 1 -15.94901 ZM -16 2 C -16 1.321014 -15.944 0.6560059 -15.862 0 L 0 0 L 0 18 C -8.835999 18 -16 10.83701 -16 2 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //电抗器-GD
    twaver.Util.registerImage('diankangqiGD', {
        w: 80,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 19.5 26.5 L 19.5 31.5 L 0.5 31.5 L 0.5 20.383 C 9.498993 19.38699 16.5 11.76498 16.5 2.5 C 16.5 -7.104004 8.972992 -14.92801 -0.5 -15.44901 L -0.5 -35.5 L -2.5 -35.5 L -2.5 -15.44101 L -2.5 -13.5 L -2.5 -13.431 C -2.166992 -13.45499 -1.838989 -13.5 -1.5 -13.5 C 7.335999 -13.5 14.5 -6.337006 14.5 2.5 C 14.5 10.65799 8.390991 17.37601 0.5 18.36099 L 0.5 -1.5 L -0.5 -1.5 L -1.5 -1.5 L -19.5 -1.5 L -19.5 0.5 L -19.383 0.5 C -19.45599 1.157013 -19.5 1.822998 -19.5 2.5 C -19.5 12.44101 -11.44101 20.5 -1.5 20.5 L -1.5 31.5 L -20.5 31.5 L -20.5 26.5 L -22.5 26.5 L -22.5 31.5 L -22.5 32.5 L -22.5 33.5 L 21.5 33.5 L 21.5 32.5 L 21.5 31.5 L 21.5 26.5 L 19.5 26.5 ZM -17.5 2.5 C -17.5 1.821014 -17.444 1.156006 -17.362 0.5 L -1.5 0.5 L -1.5 18.5 C -10.336 18.5 -17.5 11.33701 -17.5 2.5 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    //容抗器-GD
    twaver.Util.registerImage('rongkangqiGD', {
        w: 80,
        h: 100,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'path',
                data: 'M 18.5 20.5 L 0.5 20.5 L 0.5 13.383 C 9.498993 12.38699 16.5 4.764984 16.5 -4.5 C 16.5 -14.104 8.972992 -21.92801 -0.5 -22.44901 L -0.5 -42.5 L -2.5 -42.5 L -2.5 -22.44101 L -2.5 -20.5 L -2.5 -20.431 C -2.166992 -20.45499 -1.838989 -20.5 -1.5 -20.5 C 7.335999 -20.5 14.5 -13.33701 14.5 -4.5 C 14.5 3.65799 8.390991 10.37601 0.5 11.36099 L 0.5 -8.5 L -0.5 -8.5 L -1.5 -8.5 L -19.5 -8.5 L -19.5 -6.5 L -19.383 -6.5 C -19.45599 -5.842987 -19.5 -5.177002 -19.5 -4.5 C -19.5 5.44101 -11.44101 13.5 -1.5 13.5 L -1.5 20.5 L -19.5 20.5 L -19.5 22.5 L 18.5 22.5 L 18.5 20.5 ZM -1.5 11.5 C -10.336 11.5 -17.5 4.337006 -17.5 -4.5 C -17.5 -5.178986 -17.444 -5.843994 -17.362 -6.5 L -1.5 -6.5 L -1.5 11.5 ZM 19.5 36.5 L 19.5 42.5 L 0.5 42.5 L 0.5 30.5 L 18.5 30.5 L 18.5 28.5 L 0.5 28.5 L -1.5 28.5 L -19.5 28.5 L -19.5 30.5 L -1.5 30.5 L -1.5 42.5 L -20.5 42.5 L -20.5 36.5 L -22.5 36.5 L -22.5 42.5 L -22.5 43.5 L -22.5 44.5 L 21.5 44.5 L 21.5 43.5 L 21.5 42.5 L 21.5 36.5 L 19.5 36.5 Z',
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('drq_sl', {
        w: 50,
        h: 30,
        lineWidth: 2,
        lineColor: '<%= getClient("wholeColor") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:5,
                y:0,
                w:10,
                h:25,
                lineColor: '<%= getClient("wholeColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-5,
                y:0,
                w:10,
                h:25,
                lineColor: '<%= getClient("wholeColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-15,
                w:10,
                h:20,
                lineColor: '<%= getClient("wholeColor") %>',
                rotate:-90
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-15,
                w:10,
                h:20,
                lineColor: '<%= getClient("wholeColor") %>',
                rotate:90
            }
        ]
    });

    //Y形
    twaver.Util.registerImage('x-1jiao', {
        w: 25,
        h: 25,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColorgd") %>',
        v: [
            {
                shape: 'line',
                x1: -10,
                y1: -10,
                x2: 0,
                y2: -2.5
            },
            {
                shape: 'line',
                x1: 10,
                y1: -10,
                x2: 0,
                y2: -2.5
            },
            {
                shape: 'line',
                x1: 0,
                y1: -2.5,
                x2: 0,
                y2: 10
            }
        ]
    });

    //圆形
    twaver.Util.registerImage('yuanxing', {
        w: 50,
        h: 50,
        lineWidth: 1,
        lineColor: '<%= getClient("wholeColorgd") %>',
        v: [
            {
                shape: 'circle',
                r: 24,
                state: 'circle'
            }
        ]
    });

    //△
    twaver.Util.registerImage('cunsanjiao', {
        w: 25,
        h: 25,
        lineWidth: 1,
        v: [
            {
                shape: 'triangle',
                rect: { x: -10, y: -10, w: 20, h: 20 },
                lineWidth: 1,
                lineColor: '<%= getClient("wholeColorgd") %>',
            }
        ]
    });

    twaver.Util.registerImage('LiangXiangsanjiao', {
        w: 60,
        h: 140,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:0,
                y:20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });


    twaver.Util.registerImage('LiangXiangsanjiao3D', {
        w: 105,
        h: 230,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:0,
                y:40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('UpArrow', {
        w: 25,
        h: 125,
        lineWidth: 1,
        v: [
            {
                shape: 'vector',
                name:"jiantou",
                x:0,
                y:0,
                w:80,
                h:80,
                lineColor: '<%= getClient("wholeColor") %>',
                fill: '<%= getClient("wholeColor") %>',
                rotate:-45
            }
        ]
    });

    twaver.Util.registerImage('HengXian', {
        w: 125,
        h: 20,
        lineWidth: 1,
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x1:-60,
                x2:60,
                y1:0,
                y2:0,
                w:10,
                h:20,
                lineColor: '<%= getClient("wholeColorgd") %>'
            }
        ]
    });

    twaver.Util.registerImage('zhubiansheng', {
        w: 40,
        h: 40,
        lineWidth: 1,
        v: [
            {
                shape: 'triangle',
                rect: { x: -15, y: -15, w: 30, h: 30 },
                lineColor: '<%= getClient("wholeColorzdy") %>',
                fill: '<%= getClient("wholeColorzdy") %>'
            }
        ]
    });


    twaver.Util.registerImage('zhubianjiang', {
        w: 40,
        h: 40,
        lineWidth: 1,
        v: [
            {
                shape: 'triangle',
                rect: { x: -15, y: -15, w: 30, h: 30 },
                lineColor: '<%= getClient("wholeColorzdy") %>',
                fill: '<%= getClient("wholeColorzdy") %>',
                rotate: 180
            }
        ]
    });


    twaver.Util.registerImage('zhubianting', {
        w: 40,
        h: 40,
        lineWidth: 1,
        v: [
            {
                shape: 'circle',
                r: 15,
                lineColor:'<%= getClient("wholeColorzdy") %>',
                fill:'<%= getClient("wholeColorzdy") %>'
            }
        ]
    });

    twaver.Util.registerImage('motor', {
        w: 55,
        h: 55,
        lineWidth: 2,
        v: [
            {
                shape: 'path',
                data: 'M 21.98198 0.2089888 C 21.98198 12.28745 12.19045 22.07898 0.111987 22.07898 C -11.96648 22.07898 -21.75801 12.28745 -21.75801 0.2089888 C -21.75801 -11.86948 -11.96648 -21.66101 0.111987 -21.66101 C 12.19045 -21.66101 21.98198 -11.86948 21.98198 0.2089888 ZM -16.20002 11.99999 L -8.900011 -12.90001 ZM -8.700011 -12.80001 L -0.7000086 7.299994 ZM -0.6000102 7.299994 L 8.19998 -13.00001 ZM 8.19998 -13.00001 L 15.99998 12.09998 Z',
                lineColor: '<%= getClient("wholeColorzdy") %>'
            }
        ]
    });

    twaver.Util.registerImage('dynamotor', {
        w: 55,
        h: 55,
        lineWidth: 2,
        v: [
            {
                shape: 'path',
                data: 'M 22.18197 0.1089887 C 22.18197 12.18745 12.39044 21.97898 0.311978 21.97898 C -11.76649 21.97898 -21.55802 12.18745 -21.55802 0.1089887 C -21.55802 -11.96948 -11.76649 -21.76101 0.311978 -21.76101 C 12.39044 -21.76101 22.18197 -11.96948 22.18197 0.1089887 M 0.1246031 0.126995 C -0.437843 4.111891 -4.157471 7.213344 -8.183413 7.054282 C -12.20936 6.895225 -15.01709 3.535885 -14.45464 -0.4490107 C -14.18075 -2.389524 -13.12872 -4.217041 -11.53603 -5.519003 M 0.1943561 0.1159795 C 0.7568014 -3.868918 4.476427 -6.970373 8.502366 -6.811311 C 12.52831 -6.652253 15.33604 -3.292912 14.7736 0.6919852 C 14.49971 2.632499 13.44767 4.460015 11.85499 5.761977',
                lineColor:'<%= getClient("wholeColorzdy") %>',
                rotate: 180
            }
        ]
    });
    //软压板分
    twaver.Util.registerImage('ruanyafen', {
        w: 60,
        h: 20,
        lineWidth: 2,
        v: [
            {
                shape: 'circle',
                r: 7.5,
                cx: -20,
                cy: 0,
                lineColor:'#00ff26',
                fill:'#00ff26'
            },
            {
                shape: 'circle',
                r: 7.5,
                cx: 20,
                cy: 0,
                lineColor:'#00ff26',
                fill: '#00ff26'
            }
        ]
    });

    //软压板合
    twaver.Util.registerImage('ruanyahe', {
        w: 60,
        h: 55,
        lineWidth: 2,
        v: [
            {
                shape: 'circle',
                r: 7.5,
                cx: -20,
                cy: 0,
                lineColor:'#ff0000',
                fill: '#ff0000'
            },
            {
                shape: 'line',
                x1: -20,
                y1: 0,
                x2: 20,
                y2: 0,
                lineWidth: 8,
                lineColor:'#ff0000'
            },
            {
                shape: 'circle',
                r: 7.5,
                cx: 20,
                cy: 0,
                lineColor:'#ff0000',
                fill: '#ff0000'
            }
        ]
    });

    //软压板error
    twaver.Util.registerImage('ruanyaerror', {
        w: 60,
        h: 55,
        lineWidth: 2,
        v: [
            {
                shape: 'circle',
                r: 7.5,
                cx: -20,
                cy: 0,
                lineColor:'#C0C0C0',
                fill: '#C0C0C0'
            },
            {
                shape: 'line',
                x1: -20,
                y1: -7,
                x2: 20,
                y2: 7,
                lineWidth: 2,
                lineColor:'#C0C0C0'
            },
            {
                shape: 'line',
                x1: 20,
                y1: -7,
                x2: -20,
                y2: 7,
                lineWidth: 2,
                lineColor:'#C0C0C0'
            },
            {
                shape: 'circle',
                r: 7.5,
                cx: 20,
                cy: 0,
                lineColor:'#C0C0C0',
                fill: '#C0C0C0'
            }
        ]
    });

    //硬压板分
    twaver.Util.registerImage('yingyafen', {
        w: 55,
        h: 65,
        lineWidth: 2,
        v: [
            {
                shape: 'path',
                data:'M -15.68003 -16.64702 C -17.42005 -15.287 -17.72904 -12.77303 -16.36902 -11.03203 L -15.13804 -9.45601 C -13.77805 -7.715009 -11.26404 -7.407026 -9.523051 -8.76701 L -3.391027 -13.55901 C -2.813024 -14.01003 -2.191045 -14.00102 -1.928044 -13.66502 L 19.73296 14.05998 C 22.45296 17.54097 21.83595 22.56999 18.35397 25.28899 C 14.87197 28.00798 9.843954 27.39197 7.124962 23.90999 L -16.27103 -6.034008 L -18.73406 -9.18602 L -21.19605 -12.33803 C -22.55604 -14.07903 -22.24802 -16.59203 -20.50703 -17.95302 L -14.20304 -22.87801 C -12.46204 -24.23802 -10.56403 -24.71703 -9.204051 -22.97702 L -9.091044 -22.83202 C -8.762034 -22.41103 -8.884044 -21.95802 -9.548045 -21.43901 L -15.68003 -16.64702 ZM 21.42895 18.98598 C 21.42895 23.40428 17.84725 26.98598 13.42895 26.98598 C 9.010671 26.98598 5.428948 23.40428 5.428948 18.98598 C 5.428948 14.56767 9.010671 10.98598 13.42895 10.98598 C 17.84725 10.98598 21.42895 14.56767 21.42895 18.98598 ZM 10.48706 2.266682 L -2.120946 12.11787 L -9.50944 2.661885 L 3.098567 -7.189313 Z',
                fill:'#C0C0C0',
                lineColor:'#C0C0C0'
            },
            {
                shape: 'path',
                data:'M 14.42999 -26.59901 C 18.84798 -26.59901 22.42999 -23.01701 22.42999 -18.59901 C 22.42999 -14.18101 18.84798 -10.599 14.42999 -10.599 C 10.01199 -10.599 6.429986 -14.18101 6.429986 -18.59901 C 6.429986 -23.01701 10.01199 -26.59901 14.42999 -26.59901 ZM 10.39098 2.212489 L -2.167017 11.94949 L -9.46372 2.582988 L 3.094282 -7.154011 ZM 13.42999 10.96099 C 17.84798 10.96099 21.42999 14.54299 21.42999 18.96099 C 21.42999 23.37899 17.84798 26.96099 13.42999 26.96099 C 9.011986 26.96099 5.429986 23.37899 5.429986 18.96099 C 5.429986 14.54299 9.011986 10.96099 13.42999 10.96099 Z',
                fill:'#FFFF00',
                lineColor:'#FFFF00'
            }
        ]
    });

    //硬压板合
    twaver.Util.registerImage('yingyahe', {
        w: 55,
        h: 55,
        lineWidth: 2,
        v: [
            {
                shape: 'path',
                data:'M -1.400041 -24.83705 C -3.609056 -24.83705 -5.400041 -23.04607 -5.400041 -20.83705 L -5.400041 -18.83705 C -5.400041 -16.62804 -3.609056 -14.83705 -1.400041 -14.83705 L 6.381972 -14.83705 C 7.114974 -14.83705 7.599959 -14.44606 7.599959 -14.02104 L 7.599959 21.16295 C 7.599959 25.58095 4.017959 29.16295 -0.4000405 29.16295 C -4.81804 29.16295 -8.400042 25.58095 -8.400042 21.16295 L -8.400042 -16.83705 L -8.400042 -20.83705 L -8.400042 -24.83705 C -8.400042 -27.04607 -6.609056 -28.83705 -4.400041 -28.83705 L 3.599959 -28.83705 C 5.808974 -28.83705 7.599959 -28.04607 7.599959 -25.83705 L 7.599959 -25.65306 C 7.599959 -25.11806 7.224959 -24.83705 6.381972 -24.83705 L -1.400041 -24.83705 ZM 7.599959 -21.08705 C 7.599959 -16.66878 4.018233 -13.08705 -0.4000405 -13.08705 C -4.818345 -13.08705 -8.400042 -16.66878 -8.400042 -21.08705 C -8.400042 -25.50536 -4.818345 -29.08705 -0.4000405 -29.08705 C 4.018233 -29.08705 7.599959 -25.50536 7.599959 -21.08705 ZM 7.599959 21.16295 C 7.599959 25.58122 4.018233 29.16295 -0.4000405 29.16295 C -4.818345 29.16295 -8.400042 25.58122 -8.400042 21.16295 C -8.400042 16.74464 -4.818345 13.16295 -0.4000405 13.16295 C 4.018233 13.16295 7.599959 16.74464 7.599959 21.16295 ZM -8.400042 -5.837049 L 7.599959 -5.837049 L 7.599959 6.162951 L -8.400042 6.162951 Z',
                fill:'#C0C0C0',
                lineColor:'#C0C0C0'
            },
            {
                shape: 'path',
                data:'M 8.085466 -21.10176 C 8.085466 -16.63628 4.465479 -13.01629 -5.693473E-06 -13.01629 C -4.465498 -13.01629 -8.085488 -16.63628 -8.085488 -21.10176 C -8.085488 -25.56726 -4.465498 -29.18725 -5.693473E-06 -29.18725 C 4.465479 -29.18725 8.085466 -25.56726 8.085466 -21.10176 ZM 8.165468 21.01823 C 8.165468 25.48372 4.545481 29.10371 0.07999613 29.10371 C -4.385496 29.10371 -8.005486 25.48372 -8.005486 21.01823 C -8.005486 16.55273 -4.385496 12.93275 0.07999613 12.93275 C 4.545481 12.93275 8.165468 16.55273 8.165468 21.01823 ZM -8.080019 -5.84001 L 8.039976 -5.84001 L 8.039976 6.239977 L -8.080019 6.239977 Z',
                fill:'#FFFF00',
                lineColor:'#FFFF00'
            }
        ]
    });

    //硬压板error
    twaver.Util.registerImage('yingyaerror', {
        w: 55,
        h: 65,
        lineWidth: 2,
        v: [
            {
                shape: 'path',
                data:'M -15.68003 -16.64702 C -17.42005 -15.287 -17.72904 -12.77303 -16.36902 -11.03203 L -15.13804 -9.45601 C -13.77805 -7.715009 -11.26404 -7.407026 -9.523051 -8.76701 L -3.391027 -13.55901 C -2.813024 -14.01003 -2.191045 -14.00102 -1.928044 -13.66502 L 19.73296 14.05998 C 22.45296 17.54097 21.83595 22.56999 18.35397 25.28899 C 14.87197 28.00798 9.843954 27.39197 7.124962 23.90999 L -16.27103 -6.034008 L -18.73406 -9.18602 L -21.19605 -12.33803 C -22.55604 -14.07903 -22.24802 -16.59203 -20.50703 -17.95302 L -14.20304 -22.87801 C -12.46204 -24.23802 -10.56403 -24.71703 -9.204051 -22.97702 L -9.091044 -22.83202 C -8.762034 -22.41103 -8.884044 -21.95802 -9.548045 -21.43901 L -15.68003 -16.64702 ZM 21.42895 18.98598 C 21.42895 23.40428 17.84725 26.98598 13.42895 26.98598 C 9.010671 26.98598 5.428948 23.40428 5.428948 18.98598 C 5.428948 14.56767 9.010671 10.98598 13.42895 10.98598 C 17.84725 10.98598 21.42895 14.56767 21.42895 18.98598 ZM 10.48706 2.266682 L -2.120946 12.11787 L -9.50944 2.661885 L 3.098567 -7.189313 Z',
                fill:'#C0C0C0',
                lineColor:'#C0C0C0'
            },
            {
                shape: 'path',
                data:'M 14.42999 -26.59901 C 18.84798 -26.59901 22.42999 -23.01701 22.42999 -18.59901 C 22.42999 -14.18101 18.84798 -10.599 14.42999 -10.599 C 10.01199 -10.599 6.429986 -14.18101 6.429986 -18.59901 C 6.429986 -23.01701 10.01199 -26.59901 14.42999 -26.59901 ZM 10.39098 2.212489 L -2.167017 11.94949 L -9.46372 2.582988 L 3.094282 -7.154011 ZM 13.42999 10.96099 C 17.84798 10.96099 21.42999 14.54299 21.42999 18.96099 C 21.42999 23.37899 17.84798 26.96099 13.42999 26.96099 C 9.011986 26.96099 5.429986 23.37899 5.429986 18.96099 C 5.429986 14.54299 9.011986 10.96099 13.42999 10.96099 Z',
                fill:'#C0C0C0',
                lineColor:'black'
            }
        ]
    });


    /*===================垂直三卷变=======================*/
    twaver.Util.registerImage('SanXiangNewVert', {
        w: 140,
        h: 130,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:-20,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:20,
                y:0,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('SanXiang3DNewVert', {
        w: 240,
        h: 220,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:-40,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:40,
                y:0,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT2NewVert', {
        w: 140,
        h: 130,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:-20,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:20,
                y:0,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT2NewVert', {
        w: 240,
        h: 220,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:-40,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:40,
                y:0,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT3NewVert', {
        w: 140,
        h: 130,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:-20,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:20,
                y:0,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT3NewVert', {
        w: 240,
        h: 220,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:-40,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:40,
                y:0,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT4NewVert', {
        w: 140,
        h: 130,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:-20,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:20,
                y:0,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT4NewVert', {
        w: 240,
        h: 220,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:-40,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:40,
                y:0,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT5NewVert', {
        w: 140,
        h: 130,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenY",
                lineWidth: 2,
                x:-20,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:20,
                y:0,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT5NewVert', {
        w: 240,
        h: 220,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-40,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:40,
                y:0,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT6NewVert', {
        w: 140,
        h: 130,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:-20,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:20,
                y:0,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT6NewVert', {
        w: 240,
        h: 220,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:-40,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:40,
                y:0,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT7Vert', {
        w: 140,
        h: 130,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:-20,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:20,
                y:0,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT7Vert', {
        w: 240,
        h: 220,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:-40,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:40,
                y:0,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJZT8Vert', {
        w: 140,
        h: 130,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:-20,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-20,
                y:15,
                w:50,
                h:50,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:20,
                y:0,
                w:50,
                h:50,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-20,
                y:50,
                w:10,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBSJFT8Vert', {
        w: 240,
        h: 220,
        lineWidth: 2,
        lineColor: '<%= getClient("colorTop") %>',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:-40,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYx",
                lineWidth: 2,
                x:-40,
                y:30,
                w:100,
                h:100,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:40,
                y:0,
                w:100,
                h:100,
                lineColor: '<%= getClient("rightColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:-40,
                y:90,
                w:20,
                h:20,
                lineColor: '<%= getClient("leftColor") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                rotate:90,
                lineColor: '<%= getClient("rightColor") %>'
            }
        ]
    });
    /*=====================三卷变结束============================*/


    //新就地
    twaver.Util.registerImage('jiudiNew', {
        w: 200,
        h: 200,
        lineWidth: 0.5,
        v: [
            {
                shape: 'path',
                data:'M -94.80001 -94.8 L 94.79999 -94.8 L 94.79999 94.8 L -94.80001 94.8 Z',
                lineColor:'#2E2E2E',
                fill:'#2E2E2E'
            },
            {
                shape: 'path',
                data:'M -88.48001 -88.48 L 88.47999 -88.48 L 88.47999 88.48 L -88.48001 88.48 Z',
                lineColor:'#C0C0C0',
                fill:'#C0C0C0'
            },
            {
                shape:'path',
                data:'M -49.16239 20.81155 C -49.79038 21.8978 -50.8342 22.44092 -52.28536 22.44092 L -55.13676 22.44092 C -56.94435 22.44092 -57.85239 21.62623 -57.85239 19.99686 L -57.85239 3.431549 L -59.61754 3.431549 C -59.5242 8.42151 -60.09278 12.42705 -61.31481 15.45667 C -62.53684 18.49478 -64.91302 21.31224 -68.44334 23.93451 L -68.85069 23.52717 C -66.04171 21.08311 -64.07288 18.359 -62.94419 15.32089 C -61.80702 12.29127 -61.28935 8.32816 -61.3827 3.431549 L -62.8763 3.431549 L -64.09834 3.703111 L -65.18459 2.616863 L -61.3827 2.616863 C -61.3827 -3.255677 -61.42513 -6.650212 -61.51848 -7.566736 L -58.66707 -6.208922 L -59.61754 -5.258453 L -59.61754 2.616863 L -53.23583 2.616863 L -51.60645 0.9874885 L -49.29817 3.431549 L -56.08723 3.431549 L -56.08723 19.31795 C -56.08723 20.41269 -55.54411 20.94733 -54.45786 20.94733 L -53.37161 20.94733 C -52.37022 20.94733 -51.82709 20.48058 -51.74223 19.53011 C -51.64888 18.57964 -51.60645 17.15394 -51.60645 15.24452 L -50.92755 15.24452 C -50.8342 16.33925 -50.72387 17.4255 -50.58809 18.51175 C -50.45231 19.598 -49.97708 20.37026 -49.16239 20.81155 ZM -56.90192 -5.530016 C -55.27254 -4.70684 -54.13538 -4.002475 -53.50739 -3.416917 C -52.87091 -2.822874 -52.64178 -2.194885 -52.82848 -1.515978 C -53.00669 -0.8370725 -53.30372 -0.3363795 -53.71106 -0.02238451 C -54.1184 0.3000955 -54.50029 -0.1581665 -54.8652 -1.380198 C -55.22162 -2.602229 -55.99388 -3.849719 -57.17348 -5.122673 ZM -75.50396 3.431549 L -75.50396 8.319674 L -68.036 8.319674 L -68.036 3.431549 ZM -73.60302 -7.566736 C -72.42343 -6.921773 -71.5154 -6.2853 -70.88741 -5.65731 C -70.25093 -5.020836 -70.00482 -4.435277 -70.1406 -3.892151 C -70.27639 -3.349026 -70.56493 -2.873792 -71.02319 -2.466448 C -71.47296 -2.059104 -71.85484 -2.466448 -72.17732 -3.688479 C -72.49131 -4.910514 -73.10233 -6.107087 -74.01038 -7.295173 ZM -79.98476 -1.728137 L -66.94975 -1.728137 L -65.45615 -3.221731 L -63.14786 -0.9134495 L -75.50396 -0.9134495 C -76.86179 -0.9049635 -77.94804 -0.7691815 -78.76271 -0.5061055 ZM -77.4049 10.62795 C -77.31155 9.185279 -77.26912 7.700171 -77.26912 6.155659 C -77.26912 4.619635 -77.31155 3.075124 -77.4049 1.530614 L -75.50396 2.616863 L -68.17178 2.616863 L -67.08553 1.394832 L -65.18459 3.159988 L -66.27084 3.974674 C -66.27084 6.427221 -66.21992 8.370591 -66.13506 9.813268 L -68.036 10.62795 L -68.036 9.134361 L -70.61583 9.134361 L -70.61583 19.86108 C -70.61583 20.76911 -70.81951 21.44802 -71.22685 21.8978 C -71.6342 22.35606 -72.28764 22.7634 -73.19569 23.11983 C -73.28056 22.03358 -74.46014 21.13403 -76.72601 20.4042 L -76.72601 19.86108 C -74.63837 20.14113 -73.37389 20.25993 -72.92413 20.20902 C -72.46587 20.16659 -72.24522 19.86956 -72.24522 19.31795 L -72.24522 9.134361 L -75.50396 9.134361 L -75.50396 9.949049 ZM -73.8746 13.34358 L -75.09663 14.02248 C -76.90421 16.83994 -78.62693 19.09731 -80.25631 20.81155 L -80.66365 20.53998 C -79.66226 19.01244 -78.77969 17.47642 -78.01591 15.93191 C -77.24366 14.39588 -76.67508 12.98715 -76.31865 11.7142 ZM -69.12225 12.52889 L -68.85069 12.12155 C -67.49287 12.94472 -66.5424 13.62363 -65.99928 14.16675 C -65.45615 14.70988 -65.18459 15.27846 -65.18459 15.86402 C -65.18459 16.45806 -65.43069 17.04362 -65.9314 17.62917 C -66.42359 18.22322 -66.81396 17.88376 -67.08553 16.61081 C -67.35709 15.34635 -68.036 13.98854 -69.12225 12.52889 ZM -23.90399 12.25733 C -21.73149 12.53738 -20.50946 12.63073 -20.2379 12.53738 C -19.96634 12.45251 -19.83055 12.13003 -19.83055 11.57842 L -19.83055 1.666394 L -24.71868 3.56733 C -24.71868 9.550192 -24.66776 13.75941 -24.5829 16.19498 L -26.61962 17.14545 C -26.52627 13.98854 -26.48384 9.685972 -26.48384 4.246235 L -30.69305 5.87561 L -30.69305 19.04639 C -30.69305 20.14113 -30.09901 20.67577 -28.9279 20.67577 L -18.60852 20.67577 C -17.60714 20.50604 -17.04704 19.7847 -16.91126 18.51175 C -16.77548 17.24729 -16.70758 15.7537 -16.70758 14.02248 L -16.02868 14.02248 C -15.93533 15.83856 -15.79955 17.20486 -15.62133 18.10441 C -15.43463 19.01244 -14.94243 19.64043 -14.12774 19.99686 C -14.84908 21.54137 -15.8929 22.30514 -17.25071 22.30514 L -29.6068 22.30514 C -31.50774 22.30514 -32.45821 21.26981 -32.45821 19.18217 L -32.45821 6.418736 L -35.4454 7.504985 L -36.26008 8.183892 L -37.6179 7.504985 L -32.45821 5.604048 L -32.45821 0.7159255 C -32.45821 -0.4551875 -32.50064 -1.855432 -32.59399 -3.493294 L -29.74258 -1.999699 L -30.69305 -1.185012 L -30.69305 5.060924 L -26.48384 3.431549 L -26.48384 -3.08595 C -26.48384 -4.70684 -26.52627 -6.242867 -26.61962 -7.702516 L -23.49665 -6.344704 L -24.71868 -5.258453 L -24.71868 2.752644 L -20.2379 0.8517065 L -19.15165 -0.5061055 L -16.97915 1.123269 L -18.0654 2.209519 L -18.0654 12.52889 C -18.0654 13.0805 -18.26907 13.60665 -18.67641 14.09886 C -19.08376 14.59955 -19.69477 15.02387 -20.50946 15.3803 C -20.59432 14.39588 -21.73149 13.53028 -23.90399 12.80045 ZM -39.11149 16.46655 L -33.68024 14.56561 L -33.54446 15.24452 C -40.06196 18.06198 -43.72806 20.00535 -44.54274 21.08311 L -46.17212 18.63905 C -45.08587 18.37597 -43.36314 17.83285 -41.01243 17.00967 L -41.01243 4.789361 L -41.55556 4.789361 C -42.72667 4.797846 -43.81292 4.933629 -44.81431 5.196704 L -46.03634 3.974674 L -41.01243 3.974674 L -41.01243 -2.271263 C -41.01243 -3.527239 -41.05486 -5.071754 -41.14821 -6.887828 L -38.02524 -5.394236 L -39.11149 -4.443764 L -39.11149 3.974674 L -37.75368 3.974674 L -36.26008 2.481081 L -33.9518 4.789361 L -39.00001 4.999991 Z',
                fill:'<%= getClient("jiudiColor")%>',
                lineColor:'<%= getClient("jiudiColor")%>'
            },
            {
                shape:'path',
                data:'M -13.33536 -82.24641 L -1.250828 -82.24641 L 0.65011 -84.14735 L 2.958391 -81.43172 L -9.669264 -81.43172 C -10.29725 -81.42323 -11.11194 -81.28745 -12.11333 -81.02438 ZM -15.77942 -75.59312 L 1.600579 -75.59312 L 3.501516 -77.49406 L 6.08136 -74.77843 L -1.658171 -74.77843 L -1.658171 -65.27375 C -1.836384 -63.63589 -1.293259 -62.77877 -0.02879626 -62.6939 L 1.73636 -62.6939 C 2.82261 -62.59207 3.416653 -63.13519 3.501516 -64.3148 C 3.594866 -65.48591 3.688215 -66.8522 3.773079 -68.39672 L 4.316204 -68.39672 C 4.316204 -67.12377 4.409553 -65.94417 4.587766 -64.85792 C 4.774466 -63.77167 5.31759 -63.18611 6.217141 -63.10125 C 5.589153 -61.8283 4.545334 -61.19183 3.094172 -61.20031 L -0.5719213 -61.20031 C -2.651072 -61.19183 -3.601541 -62.27808 -3.423328 -64.45906 L -3.423328 -74.77843 L -7.496766 -74.77843 C -7.225203 -67.88754 -9.847477 -63.09276 -15.37208 -60.38562 L -15.64364 -60.79297 C -11.29864 -63.67832 -9.211002 -68.3458 -9.397701 -74.77843 L -11.29864 -74.77843 C -12.46975 -74.76995 -13.556 -74.63417 -14.55739 -74.37109 ZM -21.21067 -84.28313 L -20.80333 -84.55469 C -19.35217 -83.45995 -18.33381 -82.55191 -17.74825 -81.83057 C -17.15421 -81.10075 -16.93356 -80.40487 -17.06934 -79.72597 C -17.20512 -79.04706 -17.56155 -78.50394 -18.15559 -78.09659 C -18.74115 -77.68925 -19.14849 -78.18146 -19.37762 -79.59019 C -19.59827 -80.99043 -20.20928 -82.55191 -21.21067 -84.28313 ZM -17.27301 -61.87922 C -16.45833 -60.78448 -15.32116 -59.87644 -13.87848 -59.15511 C -12.42732 -58.42528 -10.29725 -58.01794 -7.496766 -57.93307 C -4.687791 -57.83973 -2.065515 -57.83973 0.3785475 -57.93307 C 2.82261 -58.01794 5.130891 -58.1622 7.303391 -58.3489 L 7.303391 -57.80578 C 5.495803 -57.34752 4.587766 -56.62618 4.587766 -55.63328 C 0.5143287 -55.63328 -2.854744 -55.70117 -5.527937 -55.83695 C -8.192645 -55.97273 -10.43303 -56.32916 -12.24911 -56.9232 C -14.0567 -57.50876 -15.41451 -58.34042 -16.32255 -59.42667 C -17.2221 -60.51292 -17.85857 -61.05604 -18.22348 -61.05604 C -18.57991 -61.05604 -19.30973 -60.55535 -20.39598 -59.56245 C -21.48223 -58.56106 -22.246 -57.61908 -22.70426 -56.71953 L -24.6052 -58.62047 C -23.15404 -59.79158 -21.29553 -60.87783 -19.03817 -61.87922 L -19.03817 -72.06281 L -20.12442 -72.06281 C -21.29553 -72.05433 -22.38178 -71.91855 -23.38317 -71.65547 L -24.6052 -72.8775 L -19.17395 -72.8775 L -18.22348 -74.23531 L -16.05098 -72.60594 M 10.29366 -78.98766 L 37.31413 -78.98766 L 39.35085 -81.02438 L 42.20226 -78.17297 L 25.50116 -78.17297 C 25.4163 -76.44176 25.18717 -74.45596 24.82226 -72.19859 L 33.64804 -72.19859 L 35.00585 -73.5564 L 37.17835 -71.51969 L 35.82054 -70.705 C 34.92099 -63.72924 34.28451 -59.60488 33.9196 -58.34042 C 33.56317 -57.07595 32.99459 -56.19338 32.22233 -55.70117 C 31.45856 -55.20048 30.38929 -54.76767 29.03147 -54.41125 C 28.67505 -55.85392 27.18145 -57.12687 24.55069 -58.21312 L 24.68647 -58.75625 C 27.13054 -58.02642 28.74294 -57.64454 29.50671 -57.60211 C 30.27896 -57.55119 30.86452 -57.70395 31.27186 -58.06886 C 31.67921 -58.42528 32.06958 -59.57942 32.426 -61.53128 C 32.79092 -63.47465 33.24069 -66.75886 33.78382 -71.3839 L 24.68647 -71.3839 C 23.15045 -63.50011 18.7121 -57.89064 11.37991 -54.54703 L 11.10835 -55.09016 C 19.25522 -59.69823 23.32866 -67.39533 23.32866 -78.17297 L 14.77444 -78.17297 C 13.60333 -78.16448 12.51708 -78.0287 11.51569 -77.76563 ZM 23.32866 -85.64094 C 25.68786 -84.72442 27.13054 -83.86729 27.67366 -83.05261 C 28.21679 -82.23792 28.17435 -81.37231 27.53788 -80.47276 C 26.90989 -79.56473 26.31585 -79.81083 25.77272 -81.21956 C 25.2296 -82.6198 24.33005 -83.96065 23.0571 -85.2336 ',
                lineColor:'<%= getClient("yuanfangColor")%>',
                fill:'<%= getClient("yuanfangColor")%>'
            },
            {
                shape:'path',
                data:'M -13.30007 7.979971 L 45.21992 -2.660028 L 63.83992 7.979971 L 45.21992 18.61996 L -13.30007 7.979971 Z',
                fill:'<%= getClient("jiudiColor")%>',
                lineColor:'<%= getClient("jiudiColor")%>'
            }
        ]
    });
    //新远方
    twaver.Util.registerImage('yuanfangNew', {
        w: 200,
        h: 200,
        lineWidth: 0.5,
        v: [
            {
                shape: 'path',
                data:'M -94.80001 -94.8 L 94.79999 -94.8 L 94.79999 94.8 L -94.80001 94.8 Z',
                lineColor:'#2E2E2E',
                fill:'#2E2E2E'
            },
            {
                shape: 'path',
                data:'M -88.48001 -88.48 L 88.47999 -88.48 L 88.47999 88.48 L -88.48001 88.48 Z',
                lineColor:'#C0C0C0',
                fill:'#C0C0C0'
            },
            {
                shape:'path',
                data:'M -49.16239 20.81155 C -49.79038 21.8978 -50.8342 22.44092 -52.28536 22.44092 L -55.13676 22.44092 C -56.94435 22.44092 -57.85239 21.62623 -57.85239 19.99686 L -57.85239 3.431549 L -59.61754 3.431549 C -59.5242 8.42151 -60.09278 12.42705 -61.31481 15.45667 C -62.53684 18.49478 -64.91302 21.31224 -68.44334 23.93451 L -68.85069 23.52717 C -66.04171 21.08311 -64.07288 18.359 -62.94419 15.32089 C -61.80702 12.29127 -61.28935 8.32816 -61.3827 3.431549 L -62.8763 3.431549 L -64.09834 3.703111 L -65.18459 2.616863 L -61.3827 2.616863 C -61.3827 -3.255677 -61.42513 -6.650212 -61.51848 -7.566736 L -58.66707 -6.208922 L -59.61754 -5.258453 L -59.61754 2.616863 L -53.23583 2.616863 L -51.60645 0.9874885 L -49.29817 3.431549 L -56.08723 3.431549 L -56.08723 19.31795 C -56.08723 20.41269 -55.54411 20.94733 -54.45786 20.94733 L -53.37161 20.94733 C -52.37022 20.94733 -51.82709 20.48058 -51.74223 19.53011 C -51.64888 18.57964 -51.60645 17.15394 -51.60645 15.24452 L -50.92755 15.24452 C -50.8342 16.33925 -50.72387 17.4255 -50.58809 18.51175 C -50.45231 19.598 -49.97708 20.37026 -49.16239 20.81155 ZM -56.90192 -5.530016 C -55.27254 -4.70684 -54.13538 -4.002475 -53.50739 -3.416917 C -52.87091 -2.822874 -52.64178 -2.194885 -52.82848 -1.515978 C -53.00669 -0.8370725 -53.30372 -0.3363795 -53.71106 -0.02238451 C -54.1184 0.3000955 -54.50029 -0.1581665 -54.8652 -1.380198 C -55.22162 -2.602229 -55.99388 -3.849719 -57.17348 -5.122673 ZM -75.50396 3.431549 L -75.50396 8.319674 L -68.036 8.319674 L -68.036 3.431549 ZM -73.60302 -7.566736 C -72.42343 -6.921773 -71.5154 -6.2853 -70.88741 -5.65731 C -70.25093 -5.020836 -70.00482 -4.435277 -70.1406 -3.892151 C -70.27639 -3.349026 -70.56493 -2.873792 -71.02319 -2.466448 C -71.47296 -2.059104 -71.85484 -2.466448 -72.17732 -3.688479 C -72.49131 -4.910514 -73.10233 -6.107087 -74.01038 -7.295173 ZM -79.98476 -1.728137 L -66.94975 -1.728137 L -65.45615 -3.221731 L -63.14786 -0.9134495 L -75.50396 -0.9134495 C -76.86179 -0.9049635 -77.94804 -0.7691815 -78.76271 -0.5061055 ZM -77.4049 10.62795 C -77.31155 9.185279 -77.26912 7.700171 -77.26912 6.155659 C -77.26912 4.619635 -77.31155 3.075124 -77.4049 1.530614 L -75.50396 2.616863 L -68.17178 2.616863 L -67.08553 1.394832 L -65.18459 3.159988 L -66.27084 3.974674 C -66.27084 6.427221 -66.21992 8.370591 -66.13506 9.813268 L -68.036 10.62795 L -68.036 9.134361 L -70.61583 9.134361 L -70.61583 19.86108 C -70.61583 20.76911 -70.81951 21.44802 -71.22685 21.8978 C -71.6342 22.35606 -72.28764 22.7634 -73.19569 23.11983 C -73.28056 22.03358 -74.46014 21.13403 -76.72601 20.4042 L -76.72601 19.86108 C -74.63837 20.14113 -73.37389 20.25993 -72.92413 20.20902 C -72.46587 20.16659 -72.24522 19.86956 -72.24522 19.31795 L -72.24522 9.134361 L -75.50396 9.134361 L -75.50396 9.949049 ZM -73.8746 13.34358 L -75.09663 14.02248 C -76.90421 16.83994 -78.62693 19.09731 -80.25631 20.81155 L -80.66365 20.53998 C -79.66226 19.01244 -78.77969 17.47642 -78.01591 15.93191 C -77.24366 14.39588 -76.67508 12.98715 -76.31865 11.7142 ZM -69.12225 12.52889 L -68.85069 12.12155 C -67.49287 12.94472 -66.5424 13.62363 -65.99928 14.16675 C -65.45615 14.70988 -65.18459 15.27846 -65.18459 15.86402 C -65.18459 16.45806 -65.43069 17.04362 -65.9314 17.62917 C -66.42359 18.22322 -66.81396 17.88376 -67.08553 16.61081 C -67.35709 15.34635 -68.036 13.98854 -69.12225 12.52889 ZM -23.90399 12.25733 C -21.73149 12.53738 -20.50946 12.63073 -20.2379 12.53738 C -19.96634 12.45251 -19.83055 12.13003 -19.83055 11.57842 L -19.83055 1.666394 L -24.71868 3.56733 C -24.71868 9.550192 -24.66776 13.75941 -24.5829 16.19498 L -26.61962 17.14545 C -26.52627 13.98854 -26.48384 9.685972 -26.48384 4.246235 L -30.69305 5.87561 L -30.69305 19.04639 C -30.69305 20.14113 -30.09901 20.67577 -28.9279 20.67577 L -18.60852 20.67577 C -17.60714 20.50604 -17.04704 19.7847 -16.91126 18.51175 C -16.77548 17.24729 -16.70758 15.7537 -16.70758 14.02248 L -16.02868 14.02248 C -15.93533 15.83856 -15.79955 17.20486 -15.62133 18.10441 C -15.43463 19.01244 -14.94243 19.64043 -14.12774 19.99686 C -14.84908 21.54137 -15.8929 22.30514 -17.25071 22.30514 L -29.6068 22.30514 C -31.50774 22.30514 -32.45821 21.26981 -32.45821 19.18217 L -32.45821 6.418736 L -35.4454 7.504985 L -36.26008 8.183892 L -37.6179 7.504985 L -32.45821 5.604048 L -32.45821 0.7159255 C -32.45821 -0.4551875 -32.50064 -1.855432 -32.59399 -3.493294 L -29.74258 -1.999699 L -30.69305 -1.185012 L -30.69305 5.060924 L -26.48384 3.431549 L -26.48384 -3.08595 C -26.48384 -4.70684 -26.52627 -6.242867 -26.61962 -7.702516 L -23.49665 -6.344704 L -24.71868 -5.258453 L -24.71868 2.752644 L -20.2379 0.8517065 L -19.15165 -0.5061055 L -16.97915 1.123269 L -18.0654 2.209519 L -18.0654 12.52889 C -18.0654 13.0805 -18.26907 13.60665 -18.67641 14.09886 C -19.08376 14.59955 -19.69477 15.02387 -20.50946 15.3803 C -20.59432 14.39588 -21.73149 13.53028 -23.90399 12.80045 ZM -39.11149 16.46655 L -33.68024 14.56561 L -33.54446 15.24452 C -40.06196 18.06198 -43.72806 20.00535 -44.54274 21.08311 L -46.17212 18.63905 C -45.08587 18.37597 -43.36314 17.83285 -41.01243 17.00967 L -41.01243 4.789361 L -41.55556 4.789361 C -42.72667 4.797846 -43.81292 4.933629 -44.81431 5.196704 L -46.03634 3.974674 L -41.01243 3.974674 L -41.01243 -2.271263 C -41.01243 -3.527239 -41.05486 -5.071754 -41.14821 -6.887828 L -38.02524 -5.394236 L -39.11149 -4.443764 L -39.11149 3.974674 L -37.75368 3.974674 L -36.26008 2.481081 L -33.9518 4.789361 L -39.00001 4.999991 Z',
                lineColor:'<%= getClient("jiudiColor")%>',
                fill:'<%= getClient("jiudiColor")%>'
            },
            {
                shape:'path',
                data:'M -13.33536 -82.24641 L -1.250828 -82.24641 L 0.65011 -84.14735 L 2.958391 -81.43172 L -9.669264 -81.43172 C -10.29725 -81.42323 -11.11194 -81.28745 -12.11333 -81.02438 ZM -15.77942 -75.59312 L 1.600579 -75.59312 L 3.501516 -77.49406 L 6.08136 -74.77843 L -1.658171 -74.77843 L -1.658171 -65.27375 C -1.836384 -63.63589 -1.293259 -62.77877 -0.02879626 -62.6939 L 1.73636 -62.6939 C 2.82261 -62.59207 3.416653 -63.13519 3.501516 -64.3148 C 3.594866 -65.48591 3.688215 -66.8522 3.773079 -68.39672 L 4.316204 -68.39672 C 4.316204 -67.12377 4.409553 -65.94417 4.587766 -64.85792 C 4.774466 -63.77167 5.31759 -63.18611 6.217141 -63.10125 C 5.589153 -61.8283 4.545334 -61.19183 3.094172 -61.20031 L -0.5719213 -61.20031 C -2.651072 -61.19183 -3.601541 -62.27808 -3.423328 -64.45906 L -3.423328 -74.77843 L -7.496766 -74.77843 C -7.225203 -67.88754 -9.847477 -63.09276 -15.37208 -60.38562 L -15.64364 -60.79297 C -11.29864 -63.67832 -9.211002 -68.3458 -9.397701 -74.77843 L -11.29864 -74.77843 C -12.46975 -74.76995 -13.556 -74.63417 -14.55739 -74.37109 ZM -21.21067 -84.28313 L -20.80333 -84.55469 C -19.35217 -83.45995 -18.33381 -82.55191 -17.74825 -81.83057 C -17.15421 -81.10075 -16.93356 -80.40487 -17.06934 -79.72597 C -17.20512 -79.04706 -17.56155 -78.50394 -18.15559 -78.09659 C -18.74115 -77.68925 -19.14849 -78.18146 -19.37762 -79.59019 C -19.59827 -80.99043 -20.20928 -82.55191 -21.21067 -84.28313 ZM -17.27301 -61.87922 C -16.45833 -60.78448 -15.32116 -59.87644 -13.87848 -59.15511 C -12.42732 -58.42528 -10.29725 -58.01794 -7.496766 -57.93307 C -4.687791 -57.83973 -2.065515 -57.83973 0.3785475 -57.93307 C 2.82261 -58.01794 5.130891 -58.1622 7.303391 -58.3489 L 7.303391 -57.80578 C 5.495803 -57.34752 4.587766 -56.62618 4.587766 -55.63328 C 0.5143287 -55.63328 -2.854744 -55.70117 -5.527937 -55.83695 C -8.192645 -55.97273 -10.43303 -56.32916 -12.24911 -56.9232 C -14.0567 -57.50876 -15.41451 -58.34042 -16.32255 -59.42667 C -17.2221 -60.51292 -17.85857 -61.05604 -18.22348 -61.05604 C -18.57991 -61.05604 -19.30973 -60.55535 -20.39598 -59.56245 C -21.48223 -58.56106 -22.246 -57.61908 -22.70426 -56.71953 L -24.6052 -58.62047 C -23.15404 -59.79158 -21.29553 -60.87783 -19.03817 -61.87922 L -19.03817 -72.06281 L -20.12442 -72.06281 C -21.29553 -72.05433 -22.38178 -71.91855 -23.38317 -71.65547 L -24.6052 -72.8775 L -19.17395 -72.8775 L -18.22348 -74.23531 L -16.05098 -72.60594 M 10.29366 -78.98766 L 37.31413 -78.98766 L 39.35085 -81.02438 L 42.20226 -78.17297 L 25.50116 -78.17297 C 25.4163 -76.44176 25.18717 -74.45596 24.82226 -72.19859 L 33.64804 -72.19859 L 35.00585 -73.5564 L 37.17835 -71.51969 L 35.82054 -70.705 C 34.92099 -63.72924 34.28451 -59.60488 33.9196 -58.34042 C 33.56317 -57.07595 32.99459 -56.19338 32.22233 -55.70117 C 31.45856 -55.20048 30.38929 -54.76767 29.03147 -54.41125 C 28.67505 -55.85392 27.18145 -57.12687 24.55069 -58.21312 L 24.68647 -58.75625 C 27.13054 -58.02642 28.74294 -57.64454 29.50671 -57.60211 C 30.27896 -57.55119 30.86452 -57.70395 31.27186 -58.06886 C 31.67921 -58.42528 32.06958 -59.57942 32.426 -61.53128 C 32.79092 -63.47465 33.24069 -66.75886 33.78382 -71.3839 L 24.68647 -71.3839 C 23.15045 -63.50011 18.7121 -57.89064 11.37991 -54.54703 L 11.10835 -55.09016 C 19.25522 -59.69823 23.32866 -67.39533 23.32866 -78.17297 L 14.77444 -78.17297 C 13.60333 -78.16448 12.51708 -78.0287 11.51569 -77.76563 ZM 23.32866 -85.64094 C 25.68786 -84.72442 27.13054 -83.86729 27.67366 -83.05261 C 28.21679 -82.23792 28.17435 -81.37231 27.53788 -80.47276 C 26.90989 -79.56473 26.31585 -79.81083 25.77272 -81.21956 C 25.2296 -82.6198 24.33005 -83.96065 23.0571 -85.2336 ',
                lineColor:'<%= getClient("yuanfangColor")%>',
                fill:'<%= getClient("yuanfangColor")%>'
            },
            {
                shape:'path',
                data:'M 8.870008 -30.19009 L 19.51 28.32989 L 8.870008 46.94989 L -1.769979 28.32989 L 8.870008 -30.19009 Z',
                lineColor:'<%= getClient("yuanfangColor")%>',
                fill:'<%= getClient("yuanfangColor")%>'
            }
        ]
    });
    //新远方就地ERROR
    twaver.Util.registerImage('yuanfangNewError', {
        w: 200,
        h: 200,
        lineWidth: 0.5,
        v: [
            {
                shape: 'path',
                data:'M -94.80001 -94.8 L 94.79999 -94.8 L 94.79999 94.8 L -94.80001 94.8 Z',
                lineColor:'#2E2E2E',
                fill:'#2E2E2E'
            },
            {
                shape: 'path',
                data:'M -88.48001 -88.48 L 88.47999 -88.48 L 88.47999 88.48 L -88.48001 88.48 Z',
                lineColor:'#C0C0C0',
                fill:'#C0C0C0'
            },
            {
                shape:'path',
                data:'M -49.16239 20.81155 C -49.79038 21.8978 -50.8342 22.44092 -52.28536 22.44092 L -55.13676 22.44092 C -56.94435 22.44092 -57.85239 21.62623 -57.85239 19.99686 L -57.85239 3.431549 L -59.61754 3.431549 C -59.5242 8.42151 -60.09278 12.42705 -61.31481 15.45667 C -62.53684 18.49478 -64.91302 21.31224 -68.44334 23.93451 L -68.85069 23.52717 C -66.04171 21.08311 -64.07288 18.359 -62.94419 15.32089 C -61.80702 12.29127 -61.28935 8.32816 -61.3827 3.431549 L -62.8763 3.431549 L -64.09834 3.703111 L -65.18459 2.616863 L -61.3827 2.616863 C -61.3827 -3.255677 -61.42513 -6.650212 -61.51848 -7.566736 L -58.66707 -6.208922 L -59.61754 -5.258453 L -59.61754 2.616863 L -53.23583 2.616863 L -51.60645 0.9874885 L -49.29817 3.431549 L -56.08723 3.431549 L -56.08723 19.31795 C -56.08723 20.41269 -55.54411 20.94733 -54.45786 20.94733 L -53.37161 20.94733 C -52.37022 20.94733 -51.82709 20.48058 -51.74223 19.53011 C -51.64888 18.57964 -51.60645 17.15394 -51.60645 15.24452 L -50.92755 15.24452 C -50.8342 16.33925 -50.72387 17.4255 -50.58809 18.51175 C -50.45231 19.598 -49.97708 20.37026 -49.16239 20.81155 ZM -56.90192 -5.530016 C -55.27254 -4.70684 -54.13538 -4.002475 -53.50739 -3.416917 C -52.87091 -2.822874 -52.64178 -2.194885 -52.82848 -1.515978 C -53.00669 -0.8370725 -53.30372 -0.3363795 -53.71106 -0.02238451 C -54.1184 0.3000955 -54.50029 -0.1581665 -54.8652 -1.380198 C -55.22162 -2.602229 -55.99388 -3.849719 -57.17348 -5.122673 ZM -75.50396 3.431549 L -75.50396 8.319674 L -68.036 8.319674 L -68.036 3.431549 ZM -73.60302 -7.566736 C -72.42343 -6.921773 -71.5154 -6.2853 -70.88741 -5.65731 C -70.25093 -5.020836 -70.00482 -4.435277 -70.1406 -3.892151 C -70.27639 -3.349026 -70.56493 -2.873792 -71.02319 -2.466448 C -71.47296 -2.059104 -71.85484 -2.466448 -72.17732 -3.688479 C -72.49131 -4.910514 -73.10233 -6.107087 -74.01038 -7.295173 ZM -79.98476 -1.728137 L -66.94975 -1.728137 L -65.45615 -3.221731 L -63.14786 -0.9134495 L -75.50396 -0.9134495 C -76.86179 -0.9049635 -77.94804 -0.7691815 -78.76271 -0.5061055 ZM -77.4049 10.62795 C -77.31155 9.185279 -77.26912 7.700171 -77.26912 6.155659 C -77.26912 4.619635 -77.31155 3.075124 -77.4049 1.530614 L -75.50396 2.616863 L -68.17178 2.616863 L -67.08553 1.394832 L -65.18459 3.159988 L -66.27084 3.974674 C -66.27084 6.427221 -66.21992 8.370591 -66.13506 9.813268 L -68.036 10.62795 L -68.036 9.134361 L -70.61583 9.134361 L -70.61583 19.86108 C -70.61583 20.76911 -70.81951 21.44802 -71.22685 21.8978 C -71.6342 22.35606 -72.28764 22.7634 -73.19569 23.11983 C -73.28056 22.03358 -74.46014 21.13403 -76.72601 20.4042 L -76.72601 19.86108 C -74.63837 20.14113 -73.37389 20.25993 -72.92413 20.20902 C -72.46587 20.16659 -72.24522 19.86956 -72.24522 19.31795 L -72.24522 9.134361 L -75.50396 9.134361 L -75.50396 9.949049 ZM -73.8746 13.34358 L -75.09663 14.02248 C -76.90421 16.83994 -78.62693 19.09731 -80.25631 20.81155 L -80.66365 20.53998 C -79.66226 19.01244 -78.77969 17.47642 -78.01591 15.93191 C -77.24366 14.39588 -76.67508 12.98715 -76.31865 11.7142 ZM -69.12225 12.52889 L -68.85069 12.12155 C -67.49287 12.94472 -66.5424 13.62363 -65.99928 14.16675 C -65.45615 14.70988 -65.18459 15.27846 -65.18459 15.86402 C -65.18459 16.45806 -65.43069 17.04362 -65.9314 17.62917 C -66.42359 18.22322 -66.81396 17.88376 -67.08553 16.61081 C -67.35709 15.34635 -68.036 13.98854 -69.12225 12.52889 ZM -23.90399 12.25733 C -21.73149 12.53738 -20.50946 12.63073 -20.2379 12.53738 C -19.96634 12.45251 -19.83055 12.13003 -19.83055 11.57842 L -19.83055 1.666394 L -24.71868 3.56733 C -24.71868 9.550192 -24.66776 13.75941 -24.5829 16.19498 L -26.61962 17.14545 C -26.52627 13.98854 -26.48384 9.685972 -26.48384 4.246235 L -30.69305 5.87561 L -30.69305 19.04639 C -30.69305 20.14113 -30.09901 20.67577 -28.9279 20.67577 L -18.60852 20.67577 C -17.60714 20.50604 -17.04704 19.7847 -16.91126 18.51175 C -16.77548 17.24729 -16.70758 15.7537 -16.70758 14.02248 L -16.02868 14.02248 C -15.93533 15.83856 -15.79955 17.20486 -15.62133 18.10441 C -15.43463 19.01244 -14.94243 19.64043 -14.12774 19.99686 C -14.84908 21.54137 -15.8929 22.30514 -17.25071 22.30514 L -29.6068 22.30514 C -31.50774 22.30514 -32.45821 21.26981 -32.45821 19.18217 L -32.45821 6.418736 L -35.4454 7.504985 L -36.26008 8.183892 L -37.6179 7.504985 L -32.45821 5.604048 L -32.45821 0.7159255 C -32.45821 -0.4551875 -32.50064 -1.855432 -32.59399 -3.493294 L -29.74258 -1.999699 L -30.69305 -1.185012 L -30.69305 5.060924 L -26.48384 3.431549 L -26.48384 -3.08595 C -26.48384 -4.70684 -26.52627 -6.242867 -26.61962 -7.702516 L -23.49665 -6.344704 L -24.71868 -5.258453 L -24.71868 2.752644 L -20.2379 0.8517065 L -19.15165 -0.5061055 L -16.97915 1.123269 L -18.0654 2.209519 L -18.0654 12.52889 C -18.0654 13.0805 -18.26907 13.60665 -18.67641 14.09886 C -19.08376 14.59955 -19.69477 15.02387 -20.50946 15.3803 C -20.59432 14.39588 -21.73149 13.53028 -23.90399 12.80045 ZM -39.11149 16.46655 L -33.68024 14.56561 L -33.54446 15.24452 C -40.06196 18.06198 -43.72806 20.00535 -44.54274 21.08311 L -46.17212 18.63905 C -45.08587 18.37597 -43.36314 17.83285 -41.01243 17.00967 L -41.01243 4.789361 L -41.55556 4.789361 C -42.72667 4.797846 -43.81292 4.933629 -44.81431 5.196704 L -46.03634 3.974674 L -41.01243 3.974674 L -41.01243 -2.271263 C -41.01243 -3.527239 -41.05486 -5.071754 -41.14821 -6.887828 L -38.02524 -5.394236 L -39.11149 -4.443764 L -39.11149 3.974674 L -37.75368 3.974674 L -36.26008 2.481081 L -33.9518 4.789361 L -39.00001 4.999991 Z',
                lineColor:'#363636',
                fill:'#363636'
            },
            {
                shape:'path',
                data:'M -13.33536 -82.24641 L -1.250828 -82.24641 L 0.65011 -84.14735 L 2.958391 -81.43172 L -9.669264 -81.43172 C -10.29725 -81.42323 -11.11194 -81.28745 -12.11333 -81.02438 ZM -15.77942 -75.59312 L 1.600579 -75.59312 L 3.501516 -77.49406 L 6.08136 -74.77843 L -1.658171 -74.77843 L -1.658171 -65.27375 C -1.836384 -63.63589 -1.293259 -62.77877 -0.02879626 -62.6939 L 1.73636 -62.6939 C 2.82261 -62.59207 3.416653 -63.13519 3.501516 -64.3148 C 3.594866 -65.48591 3.688215 -66.8522 3.773079 -68.39672 L 4.316204 -68.39672 C 4.316204 -67.12377 4.409553 -65.94417 4.587766 -64.85792 C 4.774466 -63.77167 5.31759 -63.18611 6.217141 -63.10125 C 5.589153 -61.8283 4.545334 -61.19183 3.094172 -61.20031 L -0.5719213 -61.20031 C -2.651072 -61.19183 -3.601541 -62.27808 -3.423328 -64.45906 L -3.423328 -74.77843 L -7.496766 -74.77843 C -7.225203 -67.88754 -9.847477 -63.09276 -15.37208 -60.38562 L -15.64364 -60.79297 C -11.29864 -63.67832 -9.211002 -68.3458 -9.397701 -74.77843 L -11.29864 -74.77843 C -12.46975 -74.76995 -13.556 -74.63417 -14.55739 -74.37109 ZM -21.21067 -84.28313 L -20.80333 -84.55469 C -19.35217 -83.45995 -18.33381 -82.55191 -17.74825 -81.83057 C -17.15421 -81.10075 -16.93356 -80.40487 -17.06934 -79.72597 C -17.20512 -79.04706 -17.56155 -78.50394 -18.15559 -78.09659 C -18.74115 -77.68925 -19.14849 -78.18146 -19.37762 -79.59019 C -19.59827 -80.99043 -20.20928 -82.55191 -21.21067 -84.28313 ZM -17.27301 -61.87922 C -16.45833 -60.78448 -15.32116 -59.87644 -13.87848 -59.15511 C -12.42732 -58.42528 -10.29725 -58.01794 -7.496766 -57.93307 C -4.687791 -57.83973 -2.065515 -57.83973 0.3785475 -57.93307 C 2.82261 -58.01794 5.130891 -58.1622 7.303391 -58.3489 L 7.303391 -57.80578 C 5.495803 -57.34752 4.587766 -56.62618 4.587766 -55.63328 C 0.5143287 -55.63328 -2.854744 -55.70117 -5.527937 -55.83695 C -8.192645 -55.97273 -10.43303 -56.32916 -12.24911 -56.9232 C -14.0567 -57.50876 -15.41451 -58.34042 -16.32255 -59.42667 C -17.2221 -60.51292 -17.85857 -61.05604 -18.22348 -61.05604 C -18.57991 -61.05604 -19.30973 -60.55535 -20.39598 -59.56245 C -21.48223 -58.56106 -22.246 -57.61908 -22.70426 -56.71953 L -24.6052 -58.62047 C -23.15404 -59.79158 -21.29553 -60.87783 -19.03817 -61.87922 L -19.03817 -72.06281 L -20.12442 -72.06281 C -21.29553 -72.05433 -22.38178 -71.91855 -23.38317 -71.65547 L -24.6052 -72.8775 L -19.17395 -72.8775 L -18.22348 -74.23531 L -16.05098 -72.60594 M 10.29366 -78.98766 L 37.31413 -78.98766 L 39.35085 -81.02438 L 42.20226 -78.17297 L 25.50116 -78.17297 C 25.4163 -76.44176 25.18717 -74.45596 24.82226 -72.19859 L 33.64804 -72.19859 L 35.00585 -73.5564 L 37.17835 -71.51969 L 35.82054 -70.705 C 34.92099 -63.72924 34.28451 -59.60488 33.9196 -58.34042 C 33.56317 -57.07595 32.99459 -56.19338 32.22233 -55.70117 C 31.45856 -55.20048 30.38929 -54.76767 29.03147 -54.41125 C 28.67505 -55.85392 27.18145 -57.12687 24.55069 -58.21312 L 24.68647 -58.75625 C 27.13054 -58.02642 28.74294 -57.64454 29.50671 -57.60211 C 30.27896 -57.55119 30.86452 -57.70395 31.27186 -58.06886 C 31.67921 -58.42528 32.06958 -59.57942 32.426 -61.53128 C 32.79092 -63.47465 33.24069 -66.75886 33.78382 -71.3839 L 24.68647 -71.3839 C 23.15045 -63.50011 18.7121 -57.89064 11.37991 -54.54703 L 11.10835 -55.09016 C 19.25522 -59.69823 23.32866 -67.39533 23.32866 -78.17297 L 14.77444 -78.17297 C 13.60333 -78.16448 12.51708 -78.0287 11.51569 -77.76563 ZM 23.32866 -85.64094 C 25.68786 -84.72442 27.13054 -83.86729 27.67366 -83.05261 C 28.21679 -82.23792 28.17435 -81.37231 27.53788 -80.47276 C 26.90989 -79.56473 26.31585 -79.81083 25.77272 -81.21956 C 25.2296 -82.6198 24.33005 -83.96065 23.0571 -85.2336 ',
                lineColor:'#363636',
                fill:'#363636'
            },
            {
                shape:'path',
                data:'M 55.05981 -3.160012 L -17.25363 9.720148 L -17.26627 9.720148 L -17.26311 9.720148 L -17.26627 9.720148 L -17.25363 9.720148 L 55.05982 23.00794 L 75.50818 9.720137 L 75.5145 9.720137 L 75.50818 9.720137 L 75.5145 9.720137 L 75.50818 9.720137 L 55.05981 -3.160012 ZM -17.25679 9.720148 L 55.05981 23.00794 L 75.50817 9.720137 L -17.25679 9.720137 Z',
                rotate:45,
                lineColor:'#363636',
                fill:'#363636'
            }
        ]
    });

    //更新的远方就地
    twaver.Util.registerImage('localNew', {
        w: 42,
        h: 90,
        lineWidth: 1,
        v: [
            {
                shape:'path',
                data:'M 14.2999 -8.950035 C 13.72178 -7.950034 12.76084 -7.450034 11.4249 -7.450034 L 8.799908 -7.450034 C 7.135845 -7.450034 6.299907 -8.200035 6.299907 -9.700035 L 6.299907 -24.95003 L 4.674907 -24.95003 C 4.760845 -20.35628 4.237407 -16.66878 3.112409 -13.87972 C 1.987409 -11.08284 -0.2000911 -8.489098 -3.450091 -6.075034 L -3.825091 -6.450034 C -1.239154 -8.700035 0.573346 -11.20784 1.612409 -14.00472 C 2.659284 -16.79378 3.135846 -20.44222 3.049909 -24.95003 L 1.674909 -24.95003 L 0.5499089 -24.70003 L -0.4500911 -25.70003 L 3.049909 -25.70003 C 3.049909 -31.10628 3.010846 -34.23128 2.924909 -35.07503 L 5.549907 -33.82503 L 4.674907 -32.95003 L 4.674907 -25.70003 L 10.5499 -25.70003 L 12.0499 -27.20003 L 14.1749 -24.95003 L 7.924907 -24.95003 L 7.924907 -10.32503 C 7.924907 -9.317223 8.424908 -8.825035 9.424908 -8.825035 L 10.4249 -8.825035 C 11.34678 -8.825035 11.84678 -9.254723 11.9249 -10.12972 C 12.01084 -11.00472 12.0499 -12.31722 12.0499 -14.07503 L 12.6749 -14.07503 C 12.76084 -13.06722 12.8624 -12.06722 12.9874 -11.06722 C 13.1124 -10.06722 13.5499 -9.356285 14.2999 -8.950035 ZM 7.174907 -33.20003 C 8.674908 -32.44222 9.721783 -31.79378 10.2999 -31.25472 C 10.88584 -30.70784 11.09678 -30.12972 10.9249 -29.50472 C 10.76084 -28.87972 10.4874 -28.41878 10.1124 -28.12972 C 9.737408 -27.83284 9.385845 -28.25472 9.049908 -29.37972 C 8.721783 -30.50472 8.010845 -31.65316 6.924907 -32.82503 ZM -9.950092 -24.95003 L -9.950092 -20.45003 L -3.075091 -20.45003 L -3.075091 -24.95003 ZM -8.200092 -35.07503 C -7.114155 -34.48128 -6.278218 -33.89534 -5.700093 -33.31722 C -5.114155 -32.73128 -4.887593 -32.19222 -5.012593 -31.69222 C -5.137593 -31.19222 -5.403218 -30.75472 -5.825093 -30.37972 C -6.239155 -30.00472 -6.590718 -30.37972 -6.887593 -31.50472 C -7.176655 -32.62972 -7.739155 -33.73128 -8.575092 -34.82503 ZM -14.0751 -29.70003 L -2.075091 -29.70003 L -0.7000911 -31.07503 L 1.424909 -28.95003 L -9.950092 -28.95003 C -11.2001 -28.94222 -12.2001 -28.81722 -12.9501 -28.57503 ZM -11.7001 -18.32503 C -11.61416 -19.65316 -11.5751 -21.02034 -11.5751 -22.44222 C -11.5751 -23.85628 -11.61416 -25.27816 -11.7001 -26.70003 L -9.950092 -25.70003 L -3.200091 -25.70003 L -2.200091 -26.82503 L -0.4500911 -25.20003 L -1.450091 -24.45003 C -1.450091 -22.19222 -1.403216 -20.40316 -1.325091 -19.07503 L -3.075091 -18.32503 L -3.075091 -19.70003 L -5.450093 -19.70003 L -5.450093 -9.825035 C -5.450093 -8.989098 -5.637593 -8.364098 -6.012593 -7.950034 C -6.387593 -7.528159 -6.989155 -7.153159 -7.825093 -6.825034 C -7.903218 -7.825034 -8.989155 -8.65316 -11.0751 -9.325035 L -11.0751 -9.825035 C -9.153217 -9.567223 -7.989155 -9.457848 -7.575093 -9.504723 C -7.153218 -9.543785 -6.950093 -9.817223 -6.950093 -10.32503 L -6.950093 -19.70003 L -9.950092 -19.70003 L -9.950092 -18.95003 ZM -8.450092 -15.82503 L -9.575092 -15.20003 C -11.23916 -12.60628 -12.8251 -10.52816 -14.3251 -8.950035 L -14.7001 -9.200035 C -13.77822 -10.60628 -12.96572 -12.02034 -12.2626 -13.44222 C -11.55166 -14.85628 -11.02822 -16.15316 -10.7001 -17.32503 ZM -4.075093 -16.57503 L -3.825091 -16.95003 C -2.575091 -16.19222 -1.700091 -15.56722 -1.200091 -15.06722 C -0.7000911 -14.56722 -0.4500911 -14.04378 -0.4500911 -13.50472 C -0.4500911 -12.95784 -0.676654 -12.41878 -1.137591 -11.87972 C -1.590716 -11.33284 -1.950091 -11.64534 -2.200091 -12.81722 C -2.450091 -13.98128 -3.075091 -15.23128 -4.075093 -16.57503 ZM 5.549907 25.40934 C 7.549907 25.66716 8.674908 25.75309 8.924908 25.66716 C 9.174908 25.58903 9.299908 25.29216 9.299908 24.78434 L 9.299908 15.65934 L 4.799907 17.40934 C 4.799907 22.91716 4.846782 26.79216 4.924907 29.03434 L 3.049909 29.90934 C 3.135846 27.00309 3.174909 23.04216 3.174909 18.03434 L -0.7000911 19.53434 L -0.7000911 31.65934 C -0.7000911 32.66716 -0.1532161 33.15934 0.9249089 33.15934 L 10.4249 33.15934 C 11.34678 33.00309 11.8624 32.33903 11.9874 31.16716 C 12.1124 30.00309 12.1749 28.62809 12.1749 27.03434 L 12.7999 27.03434 C 12.88584 28.70622 13.01084 29.96403 13.1749 30.79216 C 13.34678 31.62809 13.7999 32.20622 14.5499 32.53434 C 13.88584 33.95622 12.9249 34.65934 11.6749 34.65934 L 0.2999089 34.65934 C -1.450091 34.65934 -2.325091 33.70622 -2.325091 31.78434 L -2.325091 20.03434 L -5.075093 21.03434 L -5.825093 21.65934 L -7.075093 21.03434 L -2.325091 19.28434 L -2.325091 14.78434 C -2.325091 13.70622 -2.364154 12.41716 -2.450091 10.90934 L 0.1749089 12.28434 L -0.7000911 13.03434 L -0.7000911 18.78434 L 3.174909 17.28434 L 3.174909 11.28434 C 3.174909 9.792152 3.135846 8.37809 3.049909 7.034341 L 5.924907 8.28434 L 4.799907 9.28434 L 4.799907 16.65934 L 8.924908 14.90934 L 9.924908 13.65934 L 11.9249 15.15934 L 10.9249 16.15934 L 10.9249 25.65934 C 10.9249 26.16716 10.7374 26.65153 10.3624 27.10466 C 9.987408 27.56559 9.424908 27.95622 8.674908 28.28434 C 8.596783 27.37809 7.549907 26.58122 5.549907 25.90934 ZM -8.450092 29.28434 L -3.450091 27.53434 L -3.325091 28.15934 C -9.325092 30.75309 -12.7001 32.54216 -13.4501 33.53434 L -14.9501 31.28434 C -13.9501 31.04216 -12.36416 30.54216 -10.2001 29.78434 L -10.2001 18.53434 L -10.7001 18.53434 C -11.77822 18.54216 -12.77822 18.66716 -13.7001 18.90934 L -14.8251 17.78434 L -10.2001 17.78434 L -10.2001 12.03434 C -10.2001 10.87809 -10.23916 9.456215 -10.3251 7.784341 L -7.450093 9.15934 L -8.450092 10.03434 L -8.450092 17.78434 L -7.200093 17.78434 L -5.825093 16.40934 L -3.700091 18.53434 L -8.000046 18.99998 Z',
                lineColor:'<%= getClient("jiudiColor")%>',
                fill:'<%= getClient("jiudiColor")%>'
            },
            {
                shape:'path',
                data:'M -18.92005 -41.81003 L 18.91995 -41.81003 L 18.91995 41.60996 L -18.92005 41.60996 Z',
                lineColor:'<%= getClient("jiudiColor")%>'
            }
        ]
    });

    //更新的远方就地
    twaver.Util.registerImage('remoteNew', {
        w: 42,
        h: 90,
        lineWidth: 1,
        v: [
            {
                shape:'path',
                data:'M -4.575047 -31.82502 L 6.549953 -31.82502 L 8.299953 -33.57502 L 10.42495 -31.07502 L -1.200046 -31.07502 C -1.778171 -31.06721 -2.528171 -30.94221 -3.450046 -30.70002 ZM -6.825047 -25.70002 L 9.174953 -25.70002 L 10.92495 -27.45002 L 13.29995 -24.95002 L 6.174953 -24.95002 L 6.174953 -16.20002 C 6.010891 -14.69221 6.510891 -13.90315 7.674953 -13.82502 L 9.299953 -13.82502 C 10.29995 -13.73127 10.84683 -14.23127 10.92495 -15.31721 C 11.01089 -16.39534 11.09683 -17.65315 11.17495 -19.07502 L 11.67495 -19.07502 C 11.67495 -17.90315 11.76089 -16.81721 11.92495 -15.81721 C 12.09683 -14.81721 12.59683 -14.27815 13.42495 -14.20002 C 12.84683 -13.02815 11.88589 -12.44221 10.54995 -12.45002 L 7.174953 -12.45002 C 5.260891 -12.44221 4.385891 -13.44221 4.549953 -15.45002 L 4.549953 -24.95002 L 0.7999539 -24.95002 C 1.049954 -18.60627 -1.364109 -14.19221 -6.450047 -11.70002 L -6.700047 -12.07502 C -2.700046 -14.73127 -0.7781711 -19.02815 -0.9500461 -24.95002 L -2.700046 -24.95002 C -3.778171 -24.94221 -4.778172 -24.81721 -5.700047 -24.57502 ZM -11.82505 -33.70002 L -11.45005 -33.95002 C -10.11411 -32.94221 -9.176609 -32.10627 -8.637547 -31.44221 C -8.090672 -30.77034 -7.887547 -30.12971 -8.012547 -29.50471 C -8.137547 -28.87971 -8.465672 -28.37971 -9.012547 -28.00471 C -9.551609 -27.62971 -9.926609 -28.08284 -10.13755 -29.37971 C -10.34067 -30.66877 -10.90317 -32.10627 -11.82505 -33.70002 ZM -8.200047 -13.07502 C -7.450047 -12.06721 -6.403172 -11.23127 -5.075047 -10.56721 C -3.739109 -9.895336 -1.778171 -9.520336 0.7999539 -9.442211 C 3.385891 -9.356274 5.799953 -9.356274 8.049953 -9.442211 C 10.29995 -9.520336 12.42495 -9.653149 14.42495 -9.825024 L 14.42495 -9.325024 C 12.76089 -8.903149 11.92495 -8.239086 11.92495 -7.325024 C 8.174953 -7.325024 5.073391 -7.387524 2.612454 -7.512524 C 0.1593289 -7.637524 -1.903171 -7.965649 -3.575046 -8.512524 C -5.239109 -9.051586 -6.489109 -9.817211 -7.325047 -10.81721 C -8.153172 -11.81721 -8.739109 -12.31721 -9.075047 -12.31721 C -9.403172 -12.31721 -10.07505 -11.85627 -11.07505 -10.94221 C -12.07505 -10.02034 -12.77817 -9.153149 -13.20005 -8.325024 L -14.95005 -10.07502 C -13.61411 -11.15315 -11.90317 -12.15315 -9.825047 -13.07502 L -9.825047 -22.45002 L -10.82505 -22.45002 C -11.90317 -22.44221 -12.90317 -22.31721 -13.82505 -22.07502 L -14.95005 -23.20002 L -9.950047 -23.20002 L -9.075047 -24.45002 L -7.075047 -22.95002 M -14.82505 13.40935 L 10.04995 13.40935 L 11.92495 11.53435 L 14.54995 14.15935 L -0.8250461 14.15935 C -0.9031711 15.7531 -1.114109 17.58123 -1.450046 19.65935 L 6.674953 19.65935 L 7.924953 18.40935 L 9.924953 20.28435 L 8.674953 21.03435 C 7.846828 27.45623 7.260891 31.2531 6.924953 32.41716 C 6.596828 33.58123 6.073391 34.39373 5.362453 34.84685 C 4.659328 35.30779 3.674954 35.70623 2.424954 36.03435 C 2.096829 34.70623 0.7218289 33.53435 -1.700046 32.53435 L -1.575046 32.03435 C 0.6749539 32.70623 2.159329 33.05779 2.862454 33.09685 C 3.573391 33.14373 4.112453 33.0031 4.487453 32.66716 C 4.862453 32.33904 5.221828 31.27654 5.549953 29.47966 C 5.885891 27.6906 6.299953 24.66716 6.799953 20.40935 L -1.575046 20.40935 C -2.989109 27.66716 -7.075047 32.83123 -13.82505 35.90935 L -14.07505 35.40935 C -6.575047 31.16716 -2.825046 24.08123 -2.825046 14.15935 L -10.70005 14.15935 C -11.77817 14.16716 -12.77817 14.29216 -13.70005 14.53435 ZM -2.825046 7.284351 C -0.6531711 8.128101 0.6749539 8.917164 1.174954 9.667164 C 1.674954 10.41716 1.635891 11.21404 1.049954 12.04216 C 0.4718289 12.8781 -0.07504606 12.65154 -0.5750461 11.35466 C -1.075046 10.0656 -1.903171 8.831226 -3.075046 7.659351 ',
                lineColor:'<%= getClient("yuanfangColor")%>',
                fill:'<%= getClient("yuanfangColor")%>'
            },
            {
                shape:'path',
                data:'M -18.92005 -41.81003 L 18.91995 -41.81003 L 18.91995 41.60996 L -18.92005 41.60996 Z',
                lineColor:'<%= getClient("yuanfangColor")%>'
            }
        ]
    });

    //接地变分解图元
    twaver.Util.registerImage('jiedibianfenjie', {
        w: 25,
        h: 25,
        lineWidth: 1,
        lineColor:'<%= getClient("wholeColorgd") %>',
        v: [
            {
                shape:'line',
                x1:0,
                y1:0,
                x2:-10,
                y2:-7
            },
            {
                shape:'line',
                x2:-6,
                y2:-10.5,
                x1:-10,
                y1:-7
            },
            {
                shape:'line',
                x1:0,
                y1:0,
                x2:9,
                y2:-7
            },
            {
                shape:'line',
                x2:11.5,
                y2:-3.5,
                x1:9,
                y1:-7
            },
            {
                shape:'line',
                x1:0,
                y1:0,
                x2:0,
                y2:11
            },
            {
                shape:'line',
                x1:0,
                y1:11,
                x2:-3.5,
                y2:11
            }
        ]
    });
    /*=====================两卷变变压类型 --> 接地变=======================*/
    twaver.Util.registerImage('LiangXiangLJNewVert', {
        w: 60,
        h: 140,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenWanUp",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYDao",
                lineWidth: 2,
                x:0,
                y:20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });
    twaver.Util.registerImage('LiangXiang3DLJNewVert', {
        w: 105,
        h: 230,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenWanUp",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenYDao",
                lineWidth: 2,
                x:0,
                y:40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('LiangXiangSJNewVert', {
        w: 60,
        h: 140,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenWanUp",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                rotate:180,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiaofz",
                x:0,
                y:55,
                w:50,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('LiangXiang3DSJNewVert', {
        w: 105,
        h: 230,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenWanUp",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                rotate:180,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiaofz",
                x:0,
                y:100,
                w:105,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('LiangXiangsanjiaoVert', {
        w: 60,
        h: 140,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenWanUp",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                rotate:180,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });


    twaver.Util.registerImage('LiangXiangsanjiao3DVert', {
        w: 105,
        h: 230,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiao",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenWanUp",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                rotate:180,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBLJZT3NewVert', {
        w: 60,
        h: 140,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenWanUp",
                lineWidth: 2,
                x:0,
                y:-20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:0,
                y:20,
                w:50,
                h:50,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:55,
                w:10,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });

    twaver.Util.registerImage('XBLJFT3NewVert', {
        w: 105,
        h: 230,
        lineWidth: 2,
        lineColor: '#EC6C00',
        v: [
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:-100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenWanUp",
                lineWidth: 2,
                x:0,
                y:-40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorTop") %>'
            },
            {
                shape: 'vector',
                name:"gardenSanjiaox",
                lineWidth: 2,
                x:0,
                y:40,
                w:100,
                h:100,
                lineColor: '<%= getClient("colorBelow") %>'
            },
            {
                shape: 'vector',
                name:"xiantiao",
                x:0,
                y:100,
                w:20,
                h:20,
                lineColor: '<%= getClient("colorBelow") %>'
            }
        ]
    });
}