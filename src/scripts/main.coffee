getImageData = (img) ->
	c=$('#canvas')
	i=$('#img_to_sample')
	c.width(i.width)
	c.height(i.height)
	c=c[0]
	i=i[0]
	ctx=c.getContext('2d')
	ctx.drawImage i,0,0
	imgData=ctx.getImageData(0,0,c.width,c.height)
	info=[]
	for x in [0..imgData.data.length] by 4
		arr=[]
		arr.push imgData.data[x]
		arr.push imgData.data[x+1]
		arr.push imgData.data[x+2]
		info.push(arr)

	for a, index in info
		rgbaVal = "rgba(" +  a[0] + ',' + a[1] + ',' + a[2] + ",1)"
		$('body').append("<div style='background-color:" + rgbaVal + "; display: inline-block; width: 5px; height: 5px'></div>")






	# for d in [imgData.data.length..0] by 4
	# 	console.log(d)
	# for(i=0;i<imgData.data.length;i+=4)
	# 	console.log(imgData.data[i])

# 	var c=document.getElementById("myCanvas");
# var ctx=c.getContext("2d");
# var img=document.getElementById("scream");
# ctx.drawImage(img,0,0);
# var imgData=ctx.getImageData(0,0,c.width,c.height);
# // invert colors
# for (var i=0;i<imgData.data.length;i+=4)
#   {
#   imgData.data[i]=255-imgData.data[i];
#   imgData.data[i+1]=255-imgData.data[i+1];
#   imgData.data[i+2]=255-imgData.data[i+2];
#   imgData.data[i+3]=255;
#   }


putImageOnPage = (path) ->
	img = $('<img src="' + path + '" id="img_to_sample" />')
	$('body').append(img)
	img.on 'load', ->
		getImageData()


$('document').ready ->
	$('#uploader').on 'submit', (e) ->
		e.preventDefault()
		file_data = $('[name=uploadme]').prop('files')[0]
		form_data = new FormData()
		form_data.append 'uploadme', file_data
		form_data.append 'height', $('[name=height]').val()
		form_data.append 'width', $('[name=width]').val()
		
		$.ajax({
			url: '/uploads/new-image',
			dataType: '',
			cache: false,
			contentType: false,
			processData: false,
			data: form_data
			type: 'post',
			success: (res) ->
				pixelField = new PixelField(res.pixels, res.dimensions.width, res.dimensions.height)
				pixelField.generateHTML(document.getElementById('preview'))
				pixelField.insertText('this is some text', true)
			error: ->
				console.log 'error'
		})

