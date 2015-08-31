class PixelField
	constructor: (@pixelArray, @width, @height) ->

	container: null
	styleSheet: null

	parseMemberType: () ->
		func = ""
		switch @memberType
			when "div" then func = div
			else func = div
		return func

	addCSSRules: (sheet, selector, rules, index) ->


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


	# baseCSS: () ->

	# 	css = ".pixelfield .pf-row { height: " + parseFloat(100/@height) + "%}"
	# 	css += ".pixelfield .pf-row > div { width: " + parseFloat(100/@width) + "%}"
	# 	css += ".pixelfield { height: 0;padding-bottom: " + parseFloat(@height/@width) * 100 + "%}"

	# 	c = 0
	# 	for row in @pixelArray
	# 		for arr in row
	# 			c++
	# 			color = "rgba(" + arr.toString() + ")"
	# 			css += ".pf-" + c + "{" + 
	# 			"color:" + color + 
	# 			"; background-color:" + color + 
	# 			"}"
	# 	return css

	generateCSS: () ->
		style = document.createElement('style')
		style.appendChild(document.createTextNode(""))
		@container.appendChild(style)
		return style

	baseStyles: () ->
		console.log @styleSheet.sheet
		@styleSheet.sheet.addRule(".pixelfield .pf-row", "height:" + parseFloat(100/@height) + "%")
		@styleSheet.sheet.addRule(".pixelfield .pf-row > div", "width:" + parseFloat(100/@height) + "%")
		@styleSheet.sheet.addRule(".pixelfield", "height: 0;padding-bottom:" + parseFloat(@height/@width) * 100 + "%")


	init: (container) ->
		@container = container
		@generateHTML()
		@styleSheet = @generateCSS(container)
		@baseStyles()

	generateHTML: () ->
		html="<div class='pf-row-container'>"
		c = 0

		for row, i in @pixelArray
			html += "<div class='pf-row'>"
			for arr, i in row
				c++
				html += "<div class='pf-" + c + "'></div>"
			html += "</div>"
		html += "</div>"

		@container.innerHTML += html