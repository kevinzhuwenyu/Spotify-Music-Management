/*
 *  Starter code for University of Waterloo CS349 Fall 2016.
 *  
 *  bwbecker 20161113
 *  
 *  Some code adapted from https://github.com/possan/playlistcreator-example
 */
"use strict";

// An anonymous function that is executed passing "window" to the
// parameter "exports".  That is, it exports startApp to the window
// environment.
(function(exports) {
	var client_id = '3000293df39944c2b11916093cf9d3c7';		// Fill in with your value from Spotify
	var redirect_uri = 'http://localhost:3000/index.html';
	var g_access_token = '';
	var skin = 0; //skin number

	/*
	 * Get the playlists of the logged-in user.
	 */
	function getPlaylists(callback) {
		console.log('getPlaylists');
		var url = 'https://api.spotify.com/v1/users/cs349/playlists';
		$.ajax(url, {
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + g_access_token
			},
			success: function(r) {
				console.log('got playlist response', r);
				callback(r.items);
			},
			error: function(r) {
				callback(null);
			}
		});
	}

	function postTrack(track){
		var name = track.getName();
		var tag = track.getTag();
		var rate = track.getRate();
		var id = track.getID();

		if(tag.length ==0){
			tag[0] = "null";
		}

		$.ajax({
			url: "http://localhost:3000/Tracks",
			type: 'POST',
			dataType: "json",
			data:{Name: name, Rate:rate, Tag:tag, Id:id},

			success: function(){
				console.log("post track success", name);
			}

		});
	}


	function getJsonTracks(callback){

		$.ajax({
			url: "http://localhost:3000/Tracks",
			type: 'GET',
			dataType: "json",

			success: function(r){
				console.log("get track success", name);
				callback(r);
			},
			error:function(r){
				callback(null);
			}

		});

	}

	function postTags(tag){

		$.ajax({
			url: "http://localhost:3000/Tags",
			type: 'POST',
			dataType: "json",
			data:{Name: tag},
			success: function(){
				console.log("post tag success", name);
			}
		})
	}

	function getJTags(callback){

		$.ajax({
			url: "http://localhost:3000/Tags",
			type: 'GET',
			dataType: "json",

			success: function(r){
				console.log("get tag success", name);
				callback(r);
			},
			error:function(r){
				callback(null);
			}

		});

	}


    //post tags to json file
	function updateJsontag(Model){

		getJTags(function(tags){
			var length = tags.length;

			if(length == 0){
				var Mtag = Model.getTags();
				postTags(Mtag);
			}
		});

	}


	/* 
	*Get the playlist's tracks 
	*/

	function getTracks(url, callback){
		console.log('getTracks');
		var url = url + '/tracks';

		$.ajax(url,{
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + g_access_token
			},
			success:function(r) {
				console.log('got playlist tracks', r);
				callback(r.items);
			},
			error:function(r){
				callback(null);
			}
		});
	}
	
	/*
	 * Redirect to Spotify to login.  Spotify will show a login page, if
	 * the user hasn't already authorized this app (identified by client_id).
	 * 
	 */
	var doLogin = function(callback) {
		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
			'&response_type=token' +
			'&scope=playlist-read-private' +
			'&redirect_uri=' + encodeURIComponent(redirect_uri);

		console.log("doLogin url = " + url);
		window.location = url;
	}


	/* get songs from playlist */

	/*
	 * What to do once the user is logged in.
	 */
	function loggedIn(Model) {
		$('#login').hide();
		$('#loggedin').show();

		getJsonTracks(function(tracks){
			var length = tracks.length;

				getPlaylists(function(items) {
					console.log('items = ', items);

					//console.log('length of items', items.length)
					items.forEach(function(item){
						$('#playlists').append('<li>' + item.name + '<ul id=' + 
						item.id + '>' + '</ul>' + '</li>'); //sublist for each playlist


						getTracks(item.href, function(tracks){
							console.log('tracks = ' , tracks);

							tracks.forEach(function(track){
								var TrackID = track.track.id;
								var TrackName = track.track.name;
								var preview = track.track.preview_url;

								var playbtn = '<span id=playbtn'+TrackID+' class=playbtn>' +
								'<i class="fa fa-play" aria-hidden="true"></i>'+'</span>';

								var pausebtn = '<span id=pausebtn'+TrackID+' class=playbtn>' +
								'<i class="fa fa-pause" aria-hidden="true"></i>'+'</span>';

 								//var ratebtn = '<button id=btn'+TrackID+' class=btn2>' +'Rate'+'</button>';
								var cinfo = ' class=info'
								$('#'+item.id).append('<li id=track'+TrackID+' class=tracks'+'>' +playbtn + pausebtn
								+TrackName+'<ul id='+TrackID+'>'+'</ul>' + '</li>'); //tracks for each playlist
	
								$('#' + TrackID).append('<li id=tag'+ TrackID +' class=info' + TrackID + '>' + "Tag:" +'</li>'); //show tag
								$('#' + TrackID).append('<li id=rate'+ TrackID +' class=info' + TrackID + '>' + "Rate:" +'</li>'); // show rate
	
	
								$(document).ready(function(){
									$("#track" + TrackID).click(function(){
										$(".info"+TrackID).slideToggle("slow");
									});
									var a = new Audio(preview);


									$('#playbtn'+TrackID).click(function(){
										a.play();
									});

									$('#pausebtn'+TrackID).click(function(){
										//var a = new Audio(preview);
										a.pause();

									})


								});
	
								$(".info"+TrackID).css("display","none"); //default display none
	
								//console.log('name of track', track.track.name);
								//console.log('id of track', track.track.id);
								var newtrack = settest(TrackName, TrackID);
								Model.addTrack(newtrack);

								//console.log("length of Jsontracks", length);
								if(length ==0){
								postTrack(newtrack);
							}
					
								});
							});
							});
							});
							});

		// Post data to a server-side database.  See 
		// https://github.com/typicode/json-server
		var now = new Date();
		$.post("http://localhost:3000/demo", {"msg": "accessed at " + now.toISOString()}, null, "json");
	}

	/* track object */
	var Track = function(name, id){
		this.Name = name;
		this.ID = id;
		this.tag = [];
		this.rate = -1;

		this.setRate = function(r){
			this.rate = r;
		}

		this.setTag = function(t){
			this.tag = t;
		}

		this.getName = function(){
			return this.Name;
		}

		this.getID = function(){
			return this.ID;
		}

		this.getRate = function(){
			return this.rate;
		}

		this.getTag = function(){
			return this.tag;
		}

		this.addTag = function(tagName){
			if(this.tag.indexOf(tagName) != -1){
				return "tag already included";
			}else{
				this.tag.push(tagName);
			}
		}

		this.deleteTag = function(tagName){
			var index = this.tag.indexOf(tagName);
			if(index == -1){
				return "tag does not exist";
			}else{
				this.tag.splice(index, 1);
			}
		}

		this.changerate = function(num){
			this.rate = num;
		}
	}

	/* model */
	var model = function(){
		this.alltracks = [];
		this.Tags = ["one", "two", "three"];
		this.search_result = [];

		this.search_alltag = function(taglist){
			this.search_result = []; // empty search_result 
			var tag = taglist.split(",");

			for(var j=0; j< this.alltracks.length; j++){
				var cotain_alltag = true;
				var track_tag = this.alltracks[j].getTag();
				var track_name = this.alltracks[j].getName();


				for(var i = 0; i < tag.length; i++){
					var tag_ava = this.Tags.indexOf(tag[i]);

					if(tag_ava != -1){ //tag exist
						if(track_tag.indexOf(tag[i]) == -1 ){
							cotain_alltag = false;
						}
					}else{
						cotain_alltag = false;
					}
				}

				if(cotain_alltag == true && this.search_result.indexOf(track_name) == -1 ){
						this.search_result.push(track_name);
				}


			}
		}

		this.search_tag = function(taglist){
			this.search_result = []; // empty search_result 

			var tag = taglist.split(",");

			for(var i = 0; i < tag.length; i++){
				var tag_ava = this.Tags.indexOf(tag[i]);

				if(tag_ava != -1){ //tag exist
					//iterate alltracks
					for(var j=0; j< this.alltracks.length; j++){
						var track_tag = this.alltracks[j].getTag();
						var track_name = this.alltracks[j].getName();

						//track has tag[i] and track name not in search_list
						if(track_tag.indexOf(tag[i]) != -1 && this.search_result.indexOf(track_name) == -1 ){
							this.search_result.push(track_name);
						}

					}
				}else{
					return "tag does not exist";
				}
			}
			return null;
		}

		this.search_rate = function(rate){
			this.search_result = [];
			var sign = rate.substr(0,1);
			var rate = Number(rate.substr(1));

			for(var i =0; i < this.alltracks.length; i++){
				var track_name = this.alltracks[i].getName();
				var track_rate = this.alltracks[i].getRate();

				if(sign == ">"){
					if(track_rate > rate && this.search_result.indexOf(track_name) == -1){
						this.search_result.push(track_name);
					}
					
				}else if(sign == "="){
					if(track_rate == rate && this.search_result.indexOf(track_name) == -1){
						this.search_result.push(track_name);
					}
				}else{
						return "No result";
					}
				}
			return null;
		}

		this.addtag_to_track = function(tagname, index){
			if(this.Tags.indexOf(tagname) > -1 && index > -1){
				this.alltracks[index].addTag(tagname);
				this.notify();
				return null;
			}else if(index == -1){
				return "track does not exist";

			}else{
				return "tag exist";
			}
		}

		this.change_trackrate = function(rate, index){
			if(index == -1){
				return "track does not exist";
			}else if(rate >0 && rate<6){
				this.alltracks[index].changerate(rate);
				this.notify();
			}
		}

		this.getresult = function(){
			return this.search_result;
		}

		this.getallTracks = function(){
			//this.notify();

			return this.alltracks;
		}

		this.addTrack = function(newTrack){
			//var newTrack = new Track(name, id);
			this.alltracks.push(newTrack);
			this.notify(newTrack);
		}


		this.newtag = function(value){
			if(this.Tags.indexOf(value) > -1){
				return "tag already exist";
			}else{
				this.Tags.push(value);
				this.notify(value);
				return null;
			}
		}

		this.getTags = function(){
			return this.Tags;
		}

		this.removeTag = function(index){
			this.Tags.splice(index, 1);
			this.notify();
		}

		this.getIndex_name = function(name){
			for(var i =0; i < this.alltracks.length; i++){
				var track = this.alltracks[i];
				if(track.getName() == name){
					return i;
				}
			}
			return -1;
		}

	}

	// Add observer functionality to model objects
    _.assignIn(model.prototype, {
        // Add an observer to the list
        addObserver: function(observer) {
            if (_.isUndefined(this._observers)) {
                this._observers = [];   // _observers : list of functions
            }
            this._observers.push(observer);
            observer(this, null);
        },

        // Notify all the observers on the list
        notify: function(args) {
            if (_.isUndefined(this._observers)) {
                this._observers = [];
            }
            _.forEach(this._observers, function(obs) {  // execute this function on each element in _observers
                obs(this, args);
            });
        }
    });

    //search by tag or rate
    var searchView = function(Model){
    	var that = this;

    	this.updateView = function(obs, args){


    		$('#searchallbtn').click(function(){
    			$('#searchlist').empty();
    			var tag_input = $('#searchalltag').val();


    			Model.search_alltag(tag_input);
    			var result = Model.getresult();

    			if(result.length == 0){
    				$('#searchlist').append('<li> No result </li>');

    			}else{
    				for(var i =0; i < result.length; i++){
    					$('#searchlist').append('<li>' + result[i] +'</li>');
    				}
    			}

    			//document.getElementById("searchalltag").value = "";


    		});


    		//search by tag
    		$('#searchbtn').click(function(){
    			$('#searchlist').empty();

    			console.log("search by tag click");

    			var tag_input = $('#searchtag').val();
    			Model.search_tag(tag_input);
    			var result = Model.getresult();

    			if(result.length == 0){
    				$('#searchlist').append('<li> No result </li>');

    			}else{
    				for(var i =0; i < result.length; i++){
    					$('#searchlist').append('<li>' + result[i] +'</li>');
    				}
    			}

    			//document.getElementById("searchtag").value = "";


    		});


    		$('#searchratebtn').click(function(){
    			$('#searchlist').empty();

    			var tag_input = $('#searchrate').val();

    			Model.search_rate(tag_input);
    			var result = Model.getresult();

    			if(result.length == 0){ //if result is not empty
    				$('#searchlist').append('<li> No result </li>');

    			}else{
    				for(var i =0; i < result.length; i++){ //display all tracks 
    					$('#searchlist').append('<li>' + result[i] +'</li>');
    				}
    			}

    			//document.getElementById("searchrate").value = "";

    		});

    	};
    	Model.addObserver(this.updateView);
    }



    //add rate and tag
    var Rateview = function(Model){
    	var that=this;

    	this.updateView = function(obs, args){
    		var addtagbtn= $('.addtagbtn');

    		$('#addtagbtn').click(function(){
    			var name = $('.tageratename').val(); //get name of song
    			var tagname = $('#tagingname').val(); // get name of tag
    			var index = Model.getIndex_name(name); //get index of song  
    			var error = Model.addtag_to_track(tagname, index);

    			//console.log("alltracls  log   ", Model.getallTracks());

    			//document.getElementById("tagingname").value = "";



    		});

    		$('#addratebtn').click(function(){
    			var rate = $('#rating').val();
    			var name = $('.tageratename').val(); //get name of song
    			var index = Model.getIndex_name(name); //get index of song
    			var error = Model.change_trackrate(rate, index);

    			//document.getElementById("rating").value = "";

    		});
    	};

    	Model.addObserver(this.updateView);
    }

    // playlist View */

    var listView = function(Model){
    	var that = this;

    	//display tag and rate for tracks
    	this.updateView = function(obs, args){

    		var Tracks = Model.getallTracks();

    		_.forEach(Tracks, function(song, index){

    			var rate = song.getRate();
    			var ID = song.getID();
    			var Stags = song.getTag();

    			$('#tag'+ID).empty();
    			$('#rate'+ID).empty();

    			//display rate
    			if(rate == -1){
    				$('#tag'+ID).append('No rate.');
    			}else{
    				$('#tag'+ID).append('Rate:'+rate);
    			}


    			//dispaly tags
    			if(Stags.length == 0){
    				$('#rate'+ID).append('No Tag.');
    			}else{

    				//console.log("tag which length > 0", Stags);
    				$('#rate'+ID).append('Tags: ')

    				_.forEach(Stags, function(Stag, index){
    					$('#rate'+ID).append(Stag + ' ');
    				});
    			}
    		});
    	};

        Model.addObserver(this.updateView);

    }

    //tag view

    var tagView = function(Model, div){
    	var that = this;

    	this.updateView = function(obs, args){
    		var tags = Model.getTags();

    		// Display each pair
            var myDiv = $(div + " .list");
            myDiv.empty();

            _.forEach(tags, function(tag, idx){

            	var t = $("template#list_item");

            	// turn the html from the template into a DOM element
                var elem = $(t.html());

                elem.find(".value").html(tag);
                elem.find(".btn").click(that.DeletetagControl(idx));
                myDiv.append(elem);
            });
            that.newInputRow();
    	};

    	this.DeletetagControl = function(index){
    		return function(){Model.removeTag(index);}
    	};

    	this.newInputRow = function() {
    		var template = $("template#list_input").html();
            $(div + " .list").append(template);
            var row = $(div).find(".input_row");
            row.find(".value").focus();


            row.find("#addItemBtn").click(function(){

            var name = row.find(".value").val(); // get tag name
            var error = Model.newtag(name);

            /*if(error == null) {//success
            	row.find(".error").hide();
            }else{//fail
            	row.find(".error").html(err).show();
            }*/
        });

            //console.log("add been clicked");


        };

        Model.addObserver(this.updateView);
    }

    exports.openTag =function(){
			document.getElementById("mySidenav").style.width = "250px";
			document.getElementById("mySearch").style.width = "0";
			document.getElementById("myTagrate").style.width = "0";
	}
	
	exports.closeNav = function(){
			document.getElementById("mySidenav").style.width = "0";
	}
	
	exports.openSearch =function() {
		document.getElementById("mySearch").style.width = "250px";
		document.getElementById("mySidenav").style.width = "0";
		document.getElementById("myTagrate").style.width = "0";
	}

	exports.closeSearch=function() {
		document.getElementById("mySearch").style.width = "0";
	}

	exports.openTagrate=function() {
		document.getElementById("myTagrate").style.width = "250px";
		document.getElementById("mySidenav").style.width = "0";
		document.getElementById("mySearch").style.width = "0";
	}

	exports.closeTagrate=function() {
		document.getElementById("myTagrate").style.width = "0";
	}

	exports.backgroundchange=function(){
		var skinnum = skin%3;
		skin++;
		console.log("randomnumber is ---", skinnum);

		if(skinnum == 0){
			document.body.style.backgroundColor = "rgba(95, 39, 39, 0.83)";
			document.getElementById("a3").style.color = "rgba(181, 170, 166, 0.96)";
			document.getElementById("tagmanage").style.backgroundColor = "#9c0d3c";
			document.getElementById("search").style.backgroundColor = "#9c0d3c";
			document.getElementById("tagrate").style.backgroundColor = "#9c0d3c";
			document.getElementById("changeback").style.backgroundColor = "#9c0d3c";
			document.getElementById("playlists").style.color = "#0b0b0c";
			document.getElementById("playlists").style.fontFamily = "cursive";
			document.getElementById("playlists").style.fontSize = "20px";
			document.getElementById("supertitle").style.color = "#0b101b";
		}if(skinnum == 2){
			document.body.style.backgroundColor = "rgba(86, 81, 81, 0.83)";
			document.getElementById("a3").style.color = "darksalmon";
			document.getElementById("tagmanage").style.backgroundColor = "#333";
			document.getElementById("search").style.backgroundColor = "#333";
			document.getElementById("tagrate").style.backgroundColor = "#333";
			document.getElementById("changeback").style.backgroundColor = "#333";

			document.getElementById("playlists").style.color = "gainsboro";
			document.getElementById("playlists").style.fontFamily = "fantasy";
			document.getElementById("playlists").style.fontSize = "18";
			document.getElementById("supertitle").style.color = "beige";

		}if(skinnum == 1){
			document.body.style.backgroundColor = "rgba(10, 10, 10, 0.831373)";
			document.getElementById("a3").style.color = "#ece6e4";
			document.getElementById("a3").style.fontFamily = "-webkit-body";
			document.getElementById("tagmanage").style.backgroundColor = "#333";
			document.getElementById("search").style.backgroundColor = "#333";
			document.getElementById("tagrate").style.backgroundColor = "#333";
			document.getElementById("changeback").style.backgroundColor = "#333";

			document.getElementById("playlists").style.color = "rgb(179, 138, 214)";
			document.getElementById("playlists").style.fontFamily = "monospace";
			document.getElementById("playlists").style.fontSize = "20";
			document.getElementById("supertitle").style.color = "rgb(89, 84, 226)";
			document.getElementById("supertitle").style.fontFamily = "fantasy";


		}

	}


	function settest(name, id){
		var newtrack = new Track(name, id);

		if(name == "Aqualung" ||  name =="Circle of Light" || name =="Digging for Some Words"){
			var tag = ["one"];
			newtrack.setTag(tag);
		}if(name == "Great Heart" || name == "Locomotive Breath" || name =="Rebel"){
			var tag = ["two"];
			newtrack.setTag(tag);
		}if(name == "Momma is a Revolutionary" || name == "Why Don’t you Do Right" || name == "Wind Up"){
			var tag = ["three"];
			newtrack.setTag(tag);
		}if(name == "Wake Up and Rise" ){
			var tag = ["one", "two"];
			newtrack.setTag(tag);
		}if(name == "Your Time Will Come"){
			var tag = ["one", "two", "three"];
			var rate = 5;
			newtrack.setTag(tag);
			newtrack.setRate(rate);
		}if(name == "Aqualung" || name == "Digging For Some Words"){
			var rate = 4;
			newtrack.setRate(rate);
		}

		return newtrack;

	}



	/*
	 * Export startApp to the window so it can be called from the HTML's
	 * onLoad event.
	 */
	exports.startApp = function() {
		console.log('start app.');

		console.log('location = ' + location);

		var Model = new model();

		// Parse the URL to get access token, if there is one.
		var hash = location.hash.replace(/#/g, '');
		var all = hash.split('&');
		var args = {};
		all.forEach(function(keyvalue) {
			var idx = keyvalue.indexOf('=');
			var key = keyvalue.substring(0, idx);
			var val = keyvalue.substring(idx + 1);
			args[key] = val;
		});
		console.log('args', args);



		if (typeof(args['access_token']) == 'undefined') {
			$('#start').click(function() {
				doLogin(function() {});
			});
			$('#login').show();
			$('#loggedin').hide();
		} else {
			g_access_token = args['access_token'];
			loggedIn(Model);
			settest(Model);
			updateJsontag(Model);

			var View_main = new listView(Model);
			var View_add = new Rateview(Model);
			var View_search = new searchView(Model);
			var View_tag = new tagView(Model, "div#lv1");

		}
	}

})(window);
