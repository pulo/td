/*
* 初始化一些场景
* */



//关卡类
WSUI.Stage=WSUI.Core.extend({
    init:function(_opt){
        var _this=this;
        if(!_opt)_opt={};
        this._super(_opt);
        this.set({
            map:_opt.map,
            start_gold:_opt.map,
            wave:_opt.wave
        });


        //此处需要2个时间，一个渲染时间（决定渲染频率），另一个游戏时间（决定游戏速度，主要体现在MOVE等地方）
        window.RenderTimer=WSUI.Create(WSUI.Util.timer);
        window.GameTimer=WSUI.Create(WSUI.Util.timer);
        RenderTimer.start();
        GameTimer.start();


        //创建地图
        WSUI.Create(WSUI.Map,{
            map:this.get('map')
        });
        //创建怪物的移动路径
        var way=WSUI.Util.Findway(this.get('map'));
        //放大way到实际坐标
        for(var i in way){
            way[i][0]=way[i][0]*30;
            way[i][1]=way[i][1]*30;
        }
        WSUI.Path=way;

        //创建UI组件

        //创建塔选择菜单
        WSUI.Create(WSUI.Ui.TowerMenu,{
            el:$('.map_cell.tower')
        });
        this.start();
//        this.set('nextWaveStep',100);
//        var waveIndex=0;
//        var newWave=function(){//下一波
//
////            var _r=_this.get('nextWaveStep');
////            if(_r<100){
////                _this.set('nextWaveStep',_r+1);
////                return false;
////            }
////
////            //怪物出现计时
////            _this.set('nextEnemyStep',10);
////            var enemyIndex=0;
////            var waveEnemyShow=function(){//怪物出现单个
////                var _r=_this.get('nextEnemyStep');
////                if(_r<10){
////                    _this.set('nextEnemyStep',_r+1);
////                    return false;
////                }
////
////                _this.set('nextEnemyStep',0);
////
////                console.log(waveIndex);
////                if(enemyIndex==_opt.wave[waveIndex].number)GameTimer.removeEvent(waveEnemyShow);
////                enemyIndex++;
////            }
////
////            GameTimer.addEvent(waveEnemyShow);
////
////
////
////            console.log(waveIndex);
////            _this.set('nextWaveStep',0);
////            if(waveIndex==_opt.wave.length)GameTimer.removeEvent(newWave);
////            waveIndex++;
//        }
//
//
//          GameTimer.addEvent(newWave);
//        var WaveTimer=WSUI.Create(WSUI.Util.timer,{delay:15000});
//
//        var waveIndex=0;
//        var WaveComming=function(){
//            var EnemyComming=function(){
//                WSUI.MiddleWare.Create(_opt.wave[waveIndex].enemy[0],{x:0,y:0});//todo 得考虑以后多种敌人
//
//            };
//            var EnemyTimer=WSUI.Create(WSUI.Util.timer,{delay:500,repeatCount:_opt.wave[waveIndex].number});
//            EnemyTimer.addEvent( EnemyComming );
//            EnemyTimer.start();
//            console.log(waveIndex);
//            waveIndex++;
//            if(!_opt.wave[waveIndex]){
//                WaveTimer.stop();
//                //EnemyTimer.stop();
//            }
//
//        };
//
//        WaveComming();//初次运行
//        WaveTimer.addEvent(WaveComming);
//        WaveTimer.start();
    },
    start:function(){
        var _this=this;
        this.newWave();
        var waveTimer=WSUI.Create(WSUI.Util.timer,{
            delay:1000,
            repeatCount:this.wave.length
        });
        waveTimer.addEvent(function(){
            _this.newWave();
        });
        waveTimer.start();
    },
    newWave:function(){//放一波怪物，放好后删除WAVE数组第一项
        var enemyType=this.wave[0].enemy[0];
        var waveEnemyTimer=WSUI.Create(WSUI.Util.timer,{
            delay:100,
            repeatCount:this.wave[0].number
        });
        waveEnemyTimer.addEvent(function(){
            WSUI.MiddleWare.Create(enemyType,{x:0,y:0});
        });
        waveEnemyTimer.start();
        this.wave.shift();//删除第一项
    }



})



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
//tower1=WSUI.MiddleWare.Create('Tower',{x:400,y:200});
//enemy1=WSUI.MiddleWare.Create('Enemy_Light',{x:550,y:0});
//enemy2=WSUI.MiddleWare.Create('Enemy_Light',{x:560,y:0});
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