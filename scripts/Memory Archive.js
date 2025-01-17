(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"Memory Archive_atlas_1", frames: [[0,246,835,250],[837,246,441,250],[1280,246,422,250],[0,498,422,250],[0,750,422,250],[0,1002,422,250],[0,1254,422,250],[0,1506,422,250],[0,1758,422,250],[424,498,422,250],[848,498,422,250],[1272,498,422,250],[424,750,422,250],[848,750,422,250],[1272,750,422,250],[424,1002,422,250],[424,1254,422,250],[424,1506,422,250],[424,1758,422,250],[848,1002,422,250],[1272,1002,422,250],[848,1254,422,250],[848,1506,422,250],[848,1758,422,250],[1272,1254,422,250],[1272,1506,422,250],[1272,1758,422,250],[0,0,1022,244],[1024,0,1022,244]]},
		{name:"Memory Archive_atlas_2", frames: [[0,0,422,250],[424,0,422,250],[848,0,422,250],[1272,0,422,250],[0,252,422,250],[424,252,422,250],[848,252,422,250],[1272,252,422,250],[0,504,422,250],[424,504,422,250],[848,504,422,250],[1272,504,422,250],[0,756,422,250],[424,756,422,250],[848,756,422,250],[1272,756,422,250],[0,1008,422,250]]}
];


(lib.AnMovieClip = function(){
	this.currentSoundStreamInMovieclip;
	this.actionFrames = [];
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(positionOrLabel);
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		var keys = this.soundStreamDuration.keys();
		for(var i = 0;i<this.soundStreamDuration.size; i++){
			var key = keys.next().value;
			key.instance.stop();
		}
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var keys = this.soundStreamDuration.keys();
			for(var i = 0; i< this.soundStreamDuration.size ; i++){
				var key = keys.next().value; 
				var value = this.soundStreamDuration.get(key);
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					this.soundStreamDuration.delete(key);
				}
			}
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var keys = this.soundStreamDuration.keys();
				var maxDuration = 0;
				for(var i=0;i<this.soundStreamDuration.size;i++){
					var key = keys.next().value;
					var value = this.soundStreamDuration.get(key);
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				}
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.archive = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.Archive_bastyle_nullatopremovebgpreview = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.halo1 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.halo1pngcopy = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.halo10 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.halo11 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.halo12 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.halo13 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.halo14 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.halo16 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.halo15 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.halo18 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.halo2 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.halo21 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.halo19 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.halo22 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.halo25 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.halo26 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.halo27 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.halo28 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.halo3 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.halo24 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.halo30 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.halo34 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.halo35 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.halo17 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.halo32 = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.halo31 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.halo36 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.halo37 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.halo5 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.halo6 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.halo7 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.halo8 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.halo9 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.halo39 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.halo38 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.sharplandscape = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.sharplandscapepngcopy = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.halo4 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.halo40 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.sharpabove = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.sharplandscapepngcopy2 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.halo33pngcopy = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.memory = function() {
	this.initialize(ss["Memory Archive_atlas_1"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.halo23 = function() {
	this.initialize(ss["Memory Archive_atlas_2"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



// stage content:
(lib.TajukAnimated = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{Jarum:29});

	this.actionFrames = [0];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(77));

	// Layer_3
	this.instance = new lib.sharpabove();
	this.instance.setTransform(-140,-87,0.4227,0.459);

	this.instance_1 = new lib.memory();
	this.instance_1.setTransform(-126,0,0.4475,0.4398);

	this.instance_2 = new lib.archive();
	this.instance_2.setTransform(76,0,0.4475,0.4398);

	this.instance_3 = new lib.archive();
	this.instance_3.setTransform(80,0,0.4475,0.4398);

	this.instance_4 = new lib.archive();
	this.instance_4.setTransform(80,0,0.4475,0.4398);

	this.instance_5 = new lib.archive();
	this.instance_5.setTransform(80,0,0.4475,0.4398);

	this.instance_6 = new lib.archive();
	this.instance_6.setTransform(85,0,0.4475,0.4398);

	this.instance_7 = new lib.archive();
	this.instance_7.setTransform(80,0,0.4475,0.4398);

	this.instance_8 = new lib.archive();
	this.instance_8.setTransform(80,0,0.4475,0.4398);

	this.instance_9 = new lib.archive();
	this.instance_9.setTransform(80,0,0.4475,0.4398);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_2,p:{x:76}},{t:this.instance_1,p:{x:-126}},{t:this.instance,p:{x:-140,y:-87}}]},29).to({state:[{t:this.instance_3,p:{x:80}},{t:this.instance_1,p:{x:-122}},{t:this.instance_2,p:{x:80}},{t:this.instance,p:{x:-138,y:-83}}]},1).to({state:[{t:this.instance_4,p:{x:80}},{t:this.instance_1,p:{x:-119}},{t:this.instance_3,p:{x:80}},{t:this.instance_2,p:{x:80}},{t:this.instance,p:{x:-140,y:-78}}]},1).to({state:[{t:this.instance_5,p:{x:80}},{t:this.instance_1,p:{x:-115}},{t:this.instance_4,p:{x:80}},{t:this.instance_3,p:{x:80}},{t:this.instance_2,p:{x:80}},{t:this.instance,p:{x:-140,y:-75}}]},1).to({state:[{t:this.instance_6,p:{x:85}},{t:this.instance_1,p:{x:-111}},{t:this.instance_5,p:{x:85}},{t:this.instance_4,p:{x:85}},{t:this.instance_3,p:{x:85}},{t:this.instance_2,p:{x:85}},{t:this.instance,p:{x:-137,y:-70}}]},1).to({state:[{t:this.instance_7},{t:this.instance_1,p:{x:-110}},{t:this.instance_6,p:{x:80}},{t:this.instance_5,p:{x:80}},{t:this.instance_4,p:{x:80}},{t:this.instance_3,p:{x:80}},{t:this.instance_2,p:{x:80}},{t:this.instance,p:{x:-145,y:-63}}]},1).to({state:[{t:this.instance_8},{t:this.instance_1,p:{x:-109}},{t:this.instance_7},{t:this.instance_6,p:{x:80}},{t:this.instance_5,p:{x:80}},{t:this.instance_4,p:{x:80}},{t:this.instance_3,p:{x:80}},{t:this.instance_2,p:{x:80}},{t:this.instance,p:{x:-147,y:-57}}]},1).to({state:[{t:this.instance_9},{t:this.instance_1,p:{x:-107}},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6,p:{x:80}},{t:this.instance_5,p:{x:80}},{t:this.instance_4,p:{x:80}},{t:this.instance_3,p:{x:80}},{t:this.instance_2,p:{x:80}},{t:this.instance,p:{x:-150,y:-50}}]},1).to({state:[]},1).wait(40));

	// Layer_6
	this.instance_10 = new lib.halo33pngcopy();
	this.instance_10.setTransform(181,3,0.4628,0.4248);

	this.instance_11 = new lib.Archive_bastyle_nullatopremovebgpreview();
	this.instance_11.setTransform(181,3,0.4429,0.4248);

	this.instance_12 = new lib.sharpabove();
	this.instance_12.setTransform(-179,-6,0.4227,0.459);

	this.instance_13 = new lib.memory();
	this.instance_13.setTransform(-102,-1,0.4475,0.4398);

	this.instance_14 = new lib.halo32();
	this.instance_14.setTransform(181,3,0.4628,0.4248);

	this.instance_15 = new lib.halo31();
	this.instance_15.setTransform(181,3,0.4628,0.4248);

	this.instance_16 = new lib.halo30();
	this.instance_16.setTransform(181,3,0.4628,0.4248);

	this.instance_17 = new lib.halo28();
	this.instance_17.setTransform(181,3,0.4628,0.4248);

	this.instance_18 = new lib.halo27();
	this.instance_18.setTransform(181,3,0.4628,0.4248);

	this.instance_19 = new lib.halo26();
	this.instance_19.setTransform(181,3,0.4628,0.4248);

	this.instance_20 = new lib.halo25();
	this.instance_20.setTransform(181,3,0.4628,0.4248);

	this.instance_21 = new lib.halo24();
	this.instance_21.setTransform(181,3,0.4628,0.4248);

	this.instance_22 = new lib.halo23();
	this.instance_22.setTransform(181,3,0.4628,0.4248);

	this.instance_23 = new lib.halo22();
	this.instance_23.setTransform(181,3,0.4628,0.4248);

	this.instance_24 = new lib.halo21();
	this.instance_24.setTransform(181,3,0.4628,0.4248);

	this.instance_25 = new lib.halo19();
	this.instance_25.setTransform(181,3,0.4628,0.4248);

	this.instance_26 = new lib.halo18();
	this.instance_26.setTransform(181,3,0.4628,0.4248);

	this.instance_27 = new lib.halo17();
	this.instance_27.setTransform(181,3,0.4628,0.4248);

	this.instance_28 = new lib.halo16();
	this.instance_28.setTransform(181,3,0.4628,0.4248);

	this.instance_29 = new lib.sharplandscape();
	this.instance_29.setTransform(71,-43,0.4628,0.4248);

	this.instance_30 = new lib.halo15();
	this.instance_30.setTransform(181,3,0.4628,0.4248);

	this.instance_31 = new lib.sharplandscapepngcopy();
	this.instance_31.setTransform(82,-39,0.4628,0.4248);

	this.instance_32 = new lib.halo14();
	this.instance_32.setTransform(181,3,0.4628,0.4248);

	this.instance_33 = new lib.sharplandscapepngcopy2();
	this.instance_33.setTransform(92,-35,0.4628,0.4248);

	this.instance_34 = new lib.halo13();
	this.instance_34.setTransform(181,3,0.4628,0.4248);

	this.instance_35 = new lib.halo12();
	this.instance_35.setTransform(181,3,0.4628,0.4248);

	this.instance_36 = new lib.halo11();
	this.instance_36.setTransform(181,3,0.4628,0.4248);

	this.instance_37 = new lib.halo10();
	this.instance_37.setTransform(181,3,0.4628,0.4248);

	this.instance_38 = new lib.halo9();
	this.instance_38.setTransform(181,3,0.4628,0.4248);

	this.instance_39 = new lib.halo8();
	this.instance_39.setTransform(181,3,0.4628,0.4248);

	this.instance_40 = new lib.halo7();
	this.instance_40.setTransform(181,3,0.4628,0.4248);

	this.instance_41 = new lib.halo6();
	this.instance_41.setTransform(181,3,0.4628,0.4248);

	this.instance_42 = new lib.halo5();
	this.instance_42.setTransform(181,3,0.4628,0.4248);

	this.instance_43 = new lib.halo4();
	this.instance_43.setTransform(181,3,0.4628,0.4248);

	this.instance_44 = new lib.halo3();
	this.instance_44.setTransform(181,3,0.4628,0.4248);

	this.instance_45 = new lib.halo2();
	this.instance_45.setTransform(181,3,0.4628,0.4248);

	this.instance_46 = new lib.halo1pngcopy();
	this.instance_46.setTransform(181,3,0.4628,0.4248);

	this.instance_47 = new lib.halo1();
	this.instance_47.setTransform(181,3,0.4628,0.4248);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10}]},45).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_14}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_15}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_16}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_17}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_18}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_19}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_20}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_21}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_22}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_23}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_24}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_25}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_26}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_27}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_28}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_30},{t:this.instance_29}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_32},{t:this.instance_31},{t:this.instance_12}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_34},{t:this.instance_33,p:{x:92,y:-35}},{t:this.instance_12}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_35},{t:this.instance_12},{t:this.instance_33,p:{x:103,y:-31}}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_36},{t:this.instance_12},{t:this.instance_33,p:{x:113,y:-27}}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_37},{t:this.instance_12},{t:this.instance_33,p:{x:126,y:-23}}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_38},{t:this.instance_12},{t:this.instance_33,p:{x:136,y:-18}}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_39},{t:this.instance_12},{t:this.instance_33,p:{x:145,y:-14}}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_40},{t:this.instance_12},{t:this.instance_33,p:{x:155,y:-9}}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_41},{t:this.instance_12},{t:this.instance_33,p:{x:166,y:-4}}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_42},{t:this.instance_12},{t:this.instance_33,p:{x:176,y:0}}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_43},{t:this.instance_12},{t:this.instance_33,p:{x:181,y:3}}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_44},{t:this.instance_12},{t:this.instance_33,p:{x:183,y:5}}]},1).to({state:[{t:this.instance_13},{t:this.instance_11},{t:this.instance_45},{t:this.instance_12},{t:this.instance_33,p:{x:183,y:5}}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_46},{t:this.instance_33,p:{x:183,y:5}}]},1).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_47},{t:this.instance_33,p:{x:183,y:5}}]},1).wait(1));

	// Layer_1
	this.instance_48 = new lib.memory();
	this.instance_48.setTransform(-300,0,0.4475,0.4398);

	this.instance_49 = new lib.archive();
	this.instance_49.setTransform(266,0,0.4475,0.4398);

	this.instance_50 = new lib.sharpabove();
	this.instance_50.setTransform(-155,-44,0.4227,0.459);

	this.instance_51 = new lib.archive();
	this.instance_51.setTransform(80,0,0.4475,0.4398);

	this.instance_52 = new lib.archive();
	this.instance_52.setTransform(80,0,0.4475,0.4398);

	this.instance_53 = new lib.archive();
	this.instance_53.setTransform(80,0,0.4475,0.4398);

	this.instance_54 = new lib.archive();
	this.instance_54.setTransform(80,0,0.4475,0.4398);

	this.instance_55 = new lib.archive();
	this.instance_55.setTransform(80,0,0.4475,0.4398);

	this.instance_56 = new lib.archive();
	this.instance_56.setTransform(80,0,0.4475,0.4398);

	this.instance_57 = new lib.archive();
	this.instance_57.setTransform(80,0,0.4475,0.4398);

	this.instance_58 = new lib.archive();
	this.instance_58.setTransform(80,0,0.4475,0.4398);

	this.instance_59 = new lib.halo40();
	this.instance_59.setTransform(177,-11,0.568,0.568);

	this.instance_60 = new lib.halo39();
	this.instance_60.setTransform(177,-11,0.568,0.568);

	this.instance_61 = new lib.halo38();
	this.instance_61.setTransform(177,-11,0.568,0.568);

	this.instance_62 = new lib.halo37();
	this.instance_62.setTransform(177,-11,0.568,0.568);

	this.instance_63 = new lib.halo36();
	this.instance_63.setTransform(177,-11,0.568,0.568);

	this.instance_64 = new lib.halo35();
	this.instance_64.setTransform(177,-11,0.568,0.568);

	this.instance_65 = new lib.halo34();
	this.instance_65.setTransform(183,5,0.4628,0.4248);

	this.instance_66 = new lib.Archive_bastyle_nullatopremovebgpreview();
	this.instance_66.setTransform(183,4,0.4429,0.4248);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_49,p:{x:266}},{t:this.instance_48,p:{x:-300,y:0}}]}).to({state:[{t:this.instance_49,p:{x:256}},{t:this.instance_48,p:{x:-295,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:250}},{t:this.instance_48,p:{x:-287,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:242}},{t:this.instance_48,p:{x:-279,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:236}},{t:this.instance_48,p:{x:-272,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:227}},{t:this.instance_48,p:{x:-265,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:220}},{t:this.instance_48,p:{x:-260,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:212}},{t:this.instance_48,p:{x:-254,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:207}},{t:this.instance_48,p:{x:-250,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:199}},{t:this.instance_48,p:{x:-245,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:192}},{t:this.instance_48,p:{x:-241,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:186}},{t:this.instance_48,p:{x:-236,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:179}},{t:this.instance_48,p:{x:-231,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:171}},{t:this.instance_48,p:{x:-225,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:164}},{t:this.instance_48,p:{x:-219,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:156}},{t:this.instance_48,p:{x:-214,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:149}},{t:this.instance_48,p:{x:-208,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:141}},{t:this.instance_48,p:{x:-202,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:134}},{t:this.instance_48,p:{x:-197,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:128}},{t:this.instance_48,p:{x:-193,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:121}},{t:this.instance_48,p:{x:-188,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:115}},{t:this.instance_48,p:{x:-183,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:108}},{t:this.instance_48,p:{x:-178,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:99}},{t:this.instance_48,p:{x:-167,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:92}},{t:this.instance_48,p:{x:-162,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:85}},{t:this.instance_48,p:{x:-155,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:85}},{t:this.instance_48,p:{x:-144,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:80}},{t:this.instance_48,p:{x:-139,y:0}}]},1).to({state:[{t:this.instance_49,p:{x:80}},{t:this.instance_48,p:{x:-133,y:0}}]},1).to({state:[]},1).to({state:[{t:this.instance_58},{t:this.instance_48,p:{x:-106,y:0}},{t:this.instance_57},{t:this.instance_56},{t:this.instance_55},{t:this.instance_54},{t:this.instance_53},{t:this.instance_52},{t:this.instance_51},{t:this.instance_49,p:{x:80}},{t:this.instance_50,p:{x:-155,y:-44}}]},8).to({state:[{t:this.instance_49,p:{x:80}},{t:this.instance_48,p:{x:-102,y:0}},{t:this.instance_50,p:{x:-158,y:-39}},{t:this.instance_59}]},1).to({state:[{t:this.instance_49,p:{x:80}},{t:this.instance_48,p:{x:-98,y:0}},{t:this.instance_50,p:{x:-159,y:-35}},{t:this.instance_60}]},1).to({state:[{t:this.instance_49,p:{x:80}},{t:this.instance_48,p:{x:-96,y:0}},{t:this.instance_50,p:{x:-164,y:-21}},{t:this.instance_61}]},1).to({state:[{t:this.instance_49,p:{x:80}},{t:this.instance_48,p:{x:-94,y:0}},{t:this.instance_50,p:{x:-170,y:-11}},{t:this.instance_62}]},1).to({state:[{t:this.instance_49,p:{x:82}},{t:this.instance_48,p:{x:-96,y:3}},{t:this.instance_50,p:{x:-169,y:-10}},{t:this.instance_63}]},1).to({state:[{t:this.instance_49,p:{x:81}},{t:this.instance_48,p:{x:-94,y:0}},{t:this.instance_50,p:{x:-172,y:-8}},{t:this.instance_64}]},1).to({state:[{t:this.instance_48,p:{x:-100,y:0}},{t:this.instance_50,p:{x:-177,y:-5}},{t:this.instance_66},{t:this.instance_65}]},1).to({state:[]},1).wait(32));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-111,-30,750.7,161);
// library properties:
lib.properties = {
	id: 'CA4FC6D36359254FB08F70F0A161CDB1',
	width: 378,
	height: 114,
	fps: 60,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/Memory Archive_atlas_1.png", id:"Memory Archive_atlas_1"},
		{src:"images/Memory Archive_atlas_2.png", id:"Memory Archive_atlas_2"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['CA4FC6D36359254FB08F70F0A161CDB1'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;