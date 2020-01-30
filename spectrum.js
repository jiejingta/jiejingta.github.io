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

   
function SliderChange(){ 
} 

function spInputChange(){ 
} 

function InitPage(){
    console.log("InitPage()")
    var slider=document.getElementById("slider"); 
    var sliderValue=document.getElementById("sliderValue"); 
    sliderValue.value=slider.value; 
}

