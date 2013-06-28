###
Little HTML5/coffeescript dice app
By Bart Nagel <bart@tremby.net>
Licence undecided: email me to enquire
###

# get the list element, parent of all dice
getDiceList = -> $ '#dice > ul'

# jquery selector for die elements, useful for traversal to die from 
# a child element
diceSelector = '#dice > ul > li'

# get all die elements as a jquery object
getDice = -> $(diceSelector)

# get the number of dice
getDiceNum = -> getDice().length

# get the total of all dice
getTotal = ->
	total = 0
	getDice().each ->
		value = $(@).data 'value'
		unless value?
			value = 0
		total += value
	return total

# update the displayed total of all dice
updateTotal = ->
	$t = $ '#total'
	$t.text getTotal()
	$t.addClass 'notransition'
	$t.css 'color', 'yellow'
	setTimeout ->
		$t.removeClass 'notransition'
		$t.css 'color', ''
	, 0

# add the current score to the throw history
updateHistory = ->
	$history = $ '#history > ol'
	$li = $('<li/>')
	$li.append $('<strong/>').text getTotal()
	$ol = $('<ol/>')
	$li.append $ol
	getDice().each ->
		$innerli = $('<li/>').text $(@).data 'value'
		if $(@).find('input.hold').is ':checked'
			$innerli.addClass 'hold'
		$ol.append $innerli
	$history.append $li
	$history.scrollTop $history.prop 'scrollHeight'
	# FIXME: this does not work on Android browsers. known Android bug, workarounds I can find don't work

# on document ready...
$ ->
	# toggle configuration mode
	$('#configuration-toggle').click (e) ->
		e.stopPropagation()
		$('body').toggleClass 'configuring'
		configuring = $('body').is '.configuring'
		getDiceList().sortable 'option', disabled: not configuring
		if configuring
			getDice().each ->
				$(@).data 'rotation', 0
				$(@).find('.content').css
					'transform': ''
					'-webkit-transform': ''

	# make the dice sortable
	getDiceList().sortable
		disabled: true

	# remove a die
	getDiceList().on 'click', 'button.remove', ->
		if getDiceNum() <= 1
			alert "can't remove the last die"
		else
			$(@).closest(diceSelector).remove()
			resize()

	# duplicate a die
	duplicateDie = ->
		getDiceList().append $clone = $(@).closest(diceSelector).clone()
		unless Modernizr.inputtypes.color
			$clone.find('.sp-replacer').remove()
			$clone.find('input.color').show()
			$.fn.spectrum.processNativeColorInputs()
		resize()
	getDiceList().on 'click', 'button.duplicate', duplicateDie

	# change a die's colour
	getDiceList().on 'change', 'input.colour', ->
		newcolour = new Colour $(@).val()
		light = newcolour.shade() > 0.5
		$die = $(@).closest diceSelector
		$die.find('.image .content').css
			'background-color': newcolour.hex()
			'color': if light then 'black' else 'white'
			'border-color': newcolour.shiftshade(if light then -0.3 else 0.3).hex()
		$die.toggleClass 'light', light

	# change a die's geometry
	getDiceList().on 'change', 'input.sides', ->
		geometry = parseInt $(@).val()
		$(@).closest(diceSelector).find('.image .sides').text 'd' + geometry

	# prevent dice from rolling when someone is toggling hold status
	getDiceList().on 'click', 'div.hold', (e) ->
		e.stopPropagation()

	# change a die's label
	getDiceList().on 'change', 'input.label', ->
		$(@).closest(diceSelector).find('> .label').text $(@).val()

	# roll the dice
	$('#dice').click ->
		# abort if dice configuration is open
		if $('body').is('.configuring')
			return

		# abort if all dice are held
		if getDiceNum() == getDice().filter(':has(input.hold:checked)').length
			return

		# play the roll sound
		$('#sound').html '<audio autoplay="autoplay"><source src="roll.ogg" type="audio/ogg"><source src="roll.mp3" type="audio/mpeg"><embed hidden="true" autostart="true" loop="false" src="roll.mp3"></audio>'

		# loop through dice
		getDice().each ->
			# abort if this die is held
			if $(@).find('input.hold').is ':checked'
				return

			# get a random number for this die
			sides = parseInt($(@).find('input.sides').val())
			basezero = $(@).find('input.base-zero').is(':checked')
			value = Math.floor(Math.random() * sides) + if basezero then 0 else 1

			# store and display it
			$(@).data 'value', value
			$(@).find('svg').toggle(not basezero and sides == 6)
			$circles = $(@).find('svg circle')
			$circles.hide()
			switch value
				when 1 then $circles.filter('.dot-2-2').show()
				when 2 then $circles.filter('.dot-1-1, .dot-3-3').show()
				when 3 then $circles.filter('.dot-1-1, .dot-2-2, .dot-3-3').show()
				when 4 then $circles.filter('.dot-1-1, .dot-1-3, .dot-3-1, .dot-3-3').show()
				when 5 then $circles.filter('.dot-1-1, .dot-1-3, .dot-2-2, .dot-3-1, .dot-3-3').show()
				when 6 then $circles.filter('.dot-1-1, .dot-1-2, .dot-1-3, .dot-3-1, .dot-3-2, .dot-3-3').show()
			$(@).find('.value')
				.toggle(basezero or sides != 6)
				.text(value)
				.css('text-decoration', if /^[69]*$/.test(String(value)) then 'underline' else '')

			# spin the die to show something has happened
			unless $(@).data 'rotation'
				$(@).data 'rotation', 0
			$(@).data 'rotation', $(@).data('rotation') + (Math.round(Math.random()) * 2 - 1) * 360 * (0.5 + Math.random() * 1)
			$(@).find('.content').css
				'transform': 'rotate(' + $(@).data('rotation') + 'deg)'
				'-webkit-transform': 'rotate(' + $(@).data('rotation') + 'deg)'

		# update the sum of all die scores
		updateTotal()
		updateHistory()

	resize = ->
		width = $(window).width()
		height = $(window).height()
		idealDieLength = Math.sqrt(width * height / getDiceNum())
		nw = Math.ceil(width / idealDieLength)
		nh = Math.ceil(height / idealDieLength)
		length = Math.max(width / nw, height / nh) * 0.8 # arbitrary scale to account for margins etc
		getDice().width length
		getDice().find('.content .value').css
			'font-size': (length * 0.6) + 'px'
			'line-height': length + 'px'

	$(window).resize resize
	resize()

	# duplicate first die to start with two
	duplicateDie.apply getDice().first().children(':first') # expects context to be a descendant of the die element
