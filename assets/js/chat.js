var BAAS = BAAS || {};

BAAS.cocoa = {
		init:function(){
				this.setParameters();
				this.bindEvent();
		},

		setParameters:function(){
			this.$name = $('#jsi-name');
			this.$textArea = $('#jsi-msg');
			this.$board = $('#jsi-board');
			this.$button = $('#jsi-button');
			this.$msgDom = $('<li>');

			//各自登録時に出たコードに書き換え。「chatRoom」は任意でok。複数の部屋を作りたい場合はここを動的にする。
			this.chatDataStore = new MilkCocoa('guitarj64t40ky.mlkcca.com').dataStore('chatRoom');
		},

		bindEvent:function(){
			var self = this;
			this.$button.on('click',function(){
					self.sendMsg();
			});

			//pushを監視
			this.chatDataStore.on('push',function(data){
					self.addText(data.value);
			});
		},

		//ユーザー、メッセージ送信
		sendMsg:function(){
				if (this.$textArea.val() == ''){ return }

				var self = this;
				var name = this.$name.val();
				var text = this.$textArea.val();
				self.chatDataStore.push({user:name, message:text},function(data){
						self.$textArea.val('');
				});
		},

		//受け取り後の処理
		addText:function(json){
			var usrDom = $('<li>');

			//他人のつぶやきは左吹き出し
			if (json.user != this.$name.val()) {
				msgDom = $('<li class="left_arrow_box">');
			} else {
				msgDom = $('<li class="right_arrow_box">');
			}

			usrDom.html(json.user);
			msgDom.html(json.message)
			this.$board.append(usrDom[0]);
			this.$board.append(msgDom[0]);

			scrollBy(0, 150);
		}
}

$(function(){
		BAAS.cocoa.init();
});

var content = document.getElementById('jsi-msg');

function voice_operation() {
	var speech = new webkitSpeechRecognition();
	speech.lang = "ja";

	speech.addEventListener( 'result' , function( e ) {
		var text = e.results[0][0].transcript.replace(/\s+/g, "");

		if (content.textContent == '') {
			content.textContent = text;
		} else if (text == 'いいよ' || text == 'ok' || text == 'よし') {
			document.getElementById('jsi-button').click();
		}

		voice_operation();
	} );

	speech.onnomatch = function() {
		voice_operation();
	};

	speech.onerror = function() {
		voice_operation();
	};

	speech.start();
}

window.onload = function(){
	// 音声認識をスタート
	voice_operation();
}
