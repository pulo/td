/*
* ��ʼ��һЩ����
* */

$('#stage').css({
    width:960,
    height:480,
    'background':'#fff',
    'border':'1px solid #eee'
});

//�˴���Ҫ2��ʱ�䣬һ����Ⱦʱ�䣨������ȾƵ�ʣ�����һ����Ϸʱ�䣨������Ϸ�ٶȣ���Ҫ������MOVE�ȵط���
var RenderTimer=WSUI.Create(WSUI.Util.timer);
var GameTimer=WSUI.Create(WSUI.Util.timer);
RenderTimer.start();
GameTimer.start();


//
//enemy1=WSUI.MiddleWare.Create('Enemy_Light',{x:100,y:20});
//enemy1.startMove(0);
//$(enemy1).on('after_move',function(){
//    if(this.get('x')>500)this.startMove(270);
//    if(this.get('y')>120)this.stopMove();
//});
//$(enemy1).on('after_destroy',function(){
    //delete enemy1;
//})
//WSUI.MiddleWare.Create('Enemy_Light',{x:500,y:300});

//$(enemy1).on('before_move',function(){console.log(123)});
//enemy1.startMove(-30);
tower1=WSUI.MiddleWare.Create('Tower',{x:400,y:200});
enemy1=WSUI.MiddleWare.Create('Enemy_Light',{x:550,y:0});
enemy2=WSUI.MiddleWare.Create('Enemy_Light',{x:560,y:0});
//var bullet1=WSUI.Create(WSUI.Bullet,{x:620,y:120,direction:180});

//WSUI.MiddleWare.reg(bullet1,'tb1');
//WSUI.MiddleWare.reg(bullet1,'tb2');
//console.log(WSUI.MiddleWare.list);
//WSUI.MiddleWare.unreg(bullet1);
//bullet1.startMove(180);
//
//setInterval(function(){
//    //WSUI.Create(WSUI.Bullet,{x:0,y:0,direction:300})
//    var enemy1=WSUI.MiddleWare.Create('Enemy_Light',{x:5,y:5});
//    enemy1.startMove(0);
//    $(enemy1).on('after_move',function(){
//        if(this.get('x')>800){
//            this.destroy();
//        }
//
//    });
//
//},3500)