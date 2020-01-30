$("#full").spectrum({
    color: "#66ccff",
    flat: true,
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxPaletteSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function() {
    },
    palette: [
    ]
});

   
function pxSliderChange(){ //画笔大小值随slider变化
    var pxSlider=document.getElementById("pxSlider");
    var pxSliderValue=document.getElementById("pxSliderValue");
    pxSliderValue.value=pxSlider.value;
    
} 
function transparencySliderChange(){//颜色透明度随slider变化
    var transparencySlider=document.getElementById("transparencySlider");
    var transparencySliderValue=document.getElementById("transparencySliderValue");
    transparencySliderValue.value=(parseFloat(transparencySlider.value)/100).toFixed(2);
    
}
$('.brush').click(function(){//不同的画笔按钮，选中/取消
    $('.brush').css({"background": ""});
    $(this).css({"background": "red"});
    $('#brushSelected').text($(this).text())
    $('#brushSelected').val($(this).val())
    // var brush = document.getElementById("brushSelected");
    // brush.value = $(this).val()
});


