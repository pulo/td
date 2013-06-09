/*
* 技能库
* */
//WSUI.Skill=(function(){
//
//})();
WSUI.Skill={
    move:function(){
        var _this=this;
        //d:移动方向
        //s:移动单位

        this.move=function(){
            $(_this).trigger('before_move');
            var moveOffset=WSUI.Util.Geometry.GetOffset(_this._temp_d,_this.spd);
            _this.set('x',_this.get('x')+moveOffset[0]);
            _this.set('y',_this.get('y')+moveOffset[1]);
            $(_this).trigger('after_move');
        };

        this.startMove=function(d){
            if(_this._ismove){
                _this._temp_d=d;
                return false;
            }else{
                _this._ismove=true;
            }
            if(!d)d=0;
            _this._temp_d=d;
            GameTimer.addEvent(_this.move);
        //_temp_d 在使用后立即消除

        };
        this.stopMove=function(){
            GameTimer.removeEvent(_this.move);
            _this._ismove=false;
            delete _this._temp_d;
        };

        //监听destroy，如果触发则需要执行停止
        $(this).on('before_destroy',function(){
            _this.stopMove();
        })

    },

    //绑定hit
    //参数一，添加需要被检测的物体；参数二，配置
    /*
     * once，每次检测时，如发生碰撞，只对一个被碰撞对象发生事件，默认为'T' or 'F'
     * auto_off 一旦发生碰撞 ，关闭后续碰撞检测 默认'F'
     * */
    hit:function(testList,cfg){
        if(!cfg)cfg={};
        if(!cfg.once)cfg.once='T';
        if(!cfg.auto_off)cfg.auto_off='F';

        var _this=this;
        this.checkList=[];
        this.hitBind=function(objList){//绑定物体列表 数组形式
            _this.checkList=objList;
        };
        this.onHit=jQuery.noop;//给对象初始化碰撞事件
        this.hit=function(){
            $(_this).trigger('before_hit_test');//开始碰撞检测
            //讲碰撞绑定的函数放在每次测试时运行，实时更新碰撞检测的对象
            _this.hitBind(testList());
            //xy碰撞检测
            for(i in _this.checkList){
                if(WSUI.Util.Position.HitTest(_this,_this.checkList[i])){//发生碰撞
                    _this.onHit(_this.checkList[i]);//执行碰撞事件，并把被碰撞对象返回回去

                    if(cfg.auto_off=='T')_this.hitOff();//如果once为T 则退出循环
                    if(cfg.once=='T')return false;//如果once为T 则退出循环
                }
            }
            $(_this).trigger('after_hit_test');//结束碰撞检测
        };



        //自动开始碰撞测试
        GameTimer.addEvent(_this.hit);
        this.hitOff=function(){
        //关闭碰撞测试
            GameTimer.removeEvent(_this.hit);
        };
        //监听destroy，如果触发则需要执行停止
        $(this).on('before_destroy',function(){
            _this.hitOff();
        })
    },
    //射击
    shot:function(type){//设计类型
        var _this=this;
        this.shot=function(d){
            WSUI.MiddleWare.Create('Bullet',{x:_this.get('x'),y:_this.get('y'),direction:d});
        }
    },
    //沿着路径移动
    moveInPath:function(path){
        var _this=this;
        //如果move skill 不存在，先绑定move skill
        if(!this.move)WSUI.Skill['move'].apply(this);
        this.onMoveInPathFinish=jQuery.noop;//给对象初始化到达终点的事件
        //监听destroy，如果触发则需要执行停止
        $(this).on('before_destroy',function(){
            _this.stopMoveInPath();
        })
        this.moveInPath=function(){
            //起点坐标
            var currentPoint=0;
            //开始移动往指定目标
            var goPoint=function(nextPoint){
                //如果下一点为空，说明到达终点了
                if(!nextPoint){
                    _this.onMoveInPathFinish();
                    _this.stopMove();
                    return false;
                }

                //求路径的角度
                //只允许0 90 180 270
                //console.log(currentPoinjht,nextPoint);
                var angle=Math.round(WSUI.Util.Geometry.GetAngle([_this.get('x'),_this.get('y')],nextPoint)/90)*90;

                _this.startMove(angle);


                _this.checkStep=function(){
                    var con1=WSUI.Util.Number.InRange(this.get('x'),nextPoint[0],nextPoint[0]+4);//条件1 x坐标在路径点范围内
                    var con2=WSUI.Util.Number.InRange(this.get('y'),nextPoint[1],nextPoint[1]+4);//条件2 y坐标在路径点范围内

                    if(con1&&con2){

                        $(_this).off('after_move',_this.checkStep);
                        currentPoint++;
                        goPoint(path[currentPoint]);
                    }
                }
                //todo:以下有逻辑BUG
                //currentPoint++;
                $(_this).on('after_move',_this.checkStep)
            };
            goPoint(path[currentPoint]);
        };
        this.stopMoveInPath=function(){
            $(_this).off('after_move',_this.checkStep);
        }

    }


}