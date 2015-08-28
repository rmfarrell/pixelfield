class PixelField
	constructor: (@pixelArray, @width, @height) ->

	container: null

	parseMemberType: () ->
		func = ""
		switch @memberType
			when "div" then func = div
			else func = div
		return func

	div: (index) ->
		return "<div class='pf-" + index + "'></div>"

	rgbcss: (val) ->
		return "rgba"

	createMember: () ->
		return ""

	wrapRows: () ->

	insertText: (text, repeat, loc) ->
		loc ||= 0
		repeat ||= false
		
		text = text.split('')

		pxs = @container.querySelectorAll('.row > div')
		
		Array.prototype.forEach.call pxs, (el, index) ->
			console.log el
			el.innerHTML = text[index]


	genrateCSS: () ->

		css = ".pixelfield .row { height: " + parseFloat(100/@height) + "%}"
		css += ".pixelfield .row > div { width: " + parseFloat(100/@width) + "%}"
		css += ".pixelfield { height: 0;padding-bottom: " + parseFloat(@height/@width) * 100 + "%}"

		c = 0
		for row in @pixelArray
			for arr in row
				c++
				color = "rgba(" + arr.toString() + ")"
				css += ".pf-" + c + "{" + 
				"color:" + color + 
				"; background-color:" + color + 
				"}"
		return css

	generateHTML: (container) ->

		@container = container

		css = this.genrateCSS(container)
		@container.innerHTML += "<style>" + 
		@container.innerHTML += css
		@container.innerHTML += "</style>"
		html="<div class='row-container'>"
		c = 0

		for row, i in @pixelArray
			html += "<div class='row'>"
			for arr, i in row
				c++
				html += "<div class='pf-" + c + "'></div>"
			html += "</div>"
		html += "</div>"

		@container.innerHTML += html