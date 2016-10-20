/****************************************************
 * Tiny Trap contributed by @dp0613 (YIT)
 * http://youngit.us
 * Released under MIT licensed.
 * All rights reserved.
 ****************************************************/
; ( function() {
	"use strict"; 
	
	/**
	 * GLOBAL VARIABLES HERE
	 * global is simple :p
	 */
	var $doc = document,
		$win = window;
		
	/*Below is Objects*/
	var	checkCase;
	
	/*Below is DOM objects*/
	var dropLists = $doc.getElementsByClassName( 'drop-list' ),
		carets = $doc.getElementsByClassName( 'caret' ),
		buttons = $doc.getElementsByClassName( 'buttons' ),
		rippleButtons = $doc.getElementsByClassName( 'button-ripple' ),
		rotateCarets = $doc.getElementsByClassName( 'rotate-caret' ),
		slideLists = $doc.getElementsByClassName( 'slide-list' );
	
	checkCase = {
		/**
		 * This function return true if el is invisible
		 */
		isHidden: function isHidden( el ) {
			return ( el.offsetParent === null );
		},
		
		/**
		 * This function return true if el has class
		 */
		hasClass: function hasClass( el, cls ) {
			return ( ' ' + el.className + ' ' ).indexOf( ' ' + cls + ' ' ) > -1;
		},
		
	};
	
	/**
	 * Fn uses for addEvent just fired once
	 */
	function addEventListenerOnce(element, event, fn) {
        var func = function () {
			fn();
            element.removeEventListener(event, func);
        };
        element.addEventListener(event, func);
    }
	
	/**
	 * addEvent fn
	 */
	function addEvent( el, event, fn ) {
		if( el ) {
			var len = Object.keys( el ).length;
			for( var i = 0; i < len; i++ ) {
				el[i].addEventListener( event, fn );
			}
		}
	}
	
	/*/ DROP LIST /======================================
	 * This version have no animation
	 * So sad for that but keep in touch,
	 * it'll be better
	===================================================*/
	var ttDropList = {
		toggle: function( dropEl ) {
			if( checkCase.isHidden( dropEl ) ) {
				dropEl.style.display = 'block';
			}
			else {
				dropEl.style.display = 'none';
			}
		},
		
		hide: ( function() {
			document.onclick = function() {
				var len = Object.keys( dropLists ).length;
				for( var i = 0; i < len; i++ ) {
					dropLists[i].style.display = 'none';
				}
			};
		} () ),
		
		addEvent: ( function() {
			addEvent( carets, 'click', function( e ) {
				e.stopPropagation();
				var _this = e.target;
				ttDropList.toggle( _this.nextElementSibling );
			} );
			for( var i = 0; i < dropLists.length; i++ ) {
				addEvent( dropLists[i].childNodes, 'click', function( e ) {
					e.stopPropagation();
					var _this = e.target;
					ttDropList.toggle( _this.parentNode );
				} );
			}
		} () ),
	};
	
	/*/ SLIDE LIST /======================================
	 * Slide list like jQuery toggleSlide()
	 * With rotate caret :)
	 * I confused so much about how list can slide up 
	 * and down :3
	======================================================*/
	var ttSlideList = {
		toggle: function( el, className ) {
			el.classList.toggle( className );
		},
		
		setHeight: function( el ) {
			if( checkCase.hasClass( el, 'up' ) ) {
				var height = ( el.children.length * 43 ) + 20;
				el.style.maxHeight = height + 'px';
				el.style.padding = '10px 0';
			}
			else {
				el.style.maxHeight = '0';
				el.style.padding = '0';
			}
		},
		
		rotateCaret: function( caret ) {
			if(  checkCase.hasClass( caret.nextElementSibling, 'up' ) ) {
				caret.pseudoStyle( 'after', 'border-top-color', '#FFFFFF' );
				caret.pseudoStyle( 'after', 'border-bottom-color', 'transparent' );
				caret.pseudoStyle( 'after', 'top', '21px' );
			}
			else {
				caret.pseudoStyle( 'after', 'border-top-color', 'transparent' );
				caret.pseudoStyle( 'after', 'border-bottom-color', '#FFFFFF' );
				caret.pseudoStyle( 'after', 'top', '15px' );
			}
		},
		
		addEvent: ( function() {
			addEvent( rotateCarets, 'click', function( e ) {
				var _this = e.target;
				var slideList = _this.nextElementSibling;
				ttSlideList.rotateCaret( _this );
				ttSlideList.toggle( slideList, 'up' );
				ttSlideList.setHeight( slideList );
			} )
		} () ),
	};
	
	
	/*/ BUTTONS /==========================================
	 * Below is some lines make our buttons have effect
	 * I collected theme and edit in my mind
	 * Inspire me if you can !!
	=======================================================*/
	var ttButtons = {
		ripple: ( function() {
			var btn, ink, d, x, y;
			addEvent( rippleButtons, 'click', function( e ) {
				btn = this;
				ink = btn.getElementsByClassName( 'ink' );
				
				if( ink.length == 0 ) {
					btn.insertAdjacentHTML( 'afterbegin', '<span class="ink"></span>' );
					ink = btn.getElementsByClassName( 'ink' );
				}
				ink = ink[0];
				//Incase of quick double clicks stop the previous animation
				ink.classList.remove( 'animate' );
				
				//Get click coordinates
				//logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
				d = Math.max( btn.offsetWidth, btn.offsetHeight );
				x = e.pageX - btn.offsetLeft - ink.clientWidth / 2;
				y = e.pageY - btn.offsetTop - ink.clientHeight / 2;
				ink.style.cssText = 'top: ' + y + 'px; left:' + x + 'px; height:' + d + 'px; width:' + d + 'px;';
				ink.classList.add( 'animate' );
			} );
		} ()),
		
		
	};
	
} ( window ) );

/**
 * Below is some magic in JS with pseudo classes
 * Copyright McGivery
 * @fn pseudoStyle()
 * @url http://mcgivery.com/htmlelement-pseudostyle-settingmodifying-before-and-after-in-javascript/
 */
( function() {
	var UID = {
		_current: 0,
		getNew: function(){
			this._current++;
			return this._current;
		}
	};
	
	HTMLElement.prototype.pseudoStyle = function(element,prop,value){
		var _this = this;
		var _sheetId = "pseudoStyles";
		var _head = document.head || document.getElementsByTagName('head')[0];
		var _sheet = document.getElementById(_sheetId) || document.createElement('style');
		_sheet.id = _sheetId;
		var className = "pseudoStyle" + UID.getNew();
		_this.className +=  " " + className; 
		_sheet.innerHTML += " ." + className + ":" + element + "{" + prop + ":" + value + "}";
		_head.appendChild(_sheet);
		return this;
	};
} () );