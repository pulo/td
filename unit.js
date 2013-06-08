/*
* 存放各种敌方角色
* */

/*
*
*
* 单元基类：拥有属性 XY,WH，及一些其他属性
* */
WSUI.Unit=WSUI.Core.extend({
    init:function(_opt){
        var _this=this;
        if(!_opt)_opt={};
        this._super(_opt);
        this.set({
            'x':_opt.x||0,
            'y':_opt.y||0,
            'w':_opt.w||this.missArg('miss argument w(width)'),
            'h':_opt.h||this.missArg('miss argument h(height)')
        });

        //创建一个dom
        this.dom=jQuery("<div>",{
            'id':this.id,
            'class':'unit',
            'style':'width:'+this.get('w')+'px;height:'+this.get('h')+'px;-webkit-transform: translate('+this.get('x')+'px,'+this.get('y')+'px)'
        });
        $('#stage').append(this.dom);
        //在Timer的全局变量里增加实时更新属性的事件
        this.renderEvent=function(){
            _this.dom.css('transform','translate('+_this.get('x')+'px,'+_this.get('y')+'px)')
//            _this.dom.css('left',_this.get('x'));
//            _this.dom.css('top',_this.get('y'));
        };
        RenderTimer.addEvent(this.renderEvent);
    },
    destroy:function(){
        jQuery(this).trigger("before_destroy");
        this.dom.remove();
        RenderTimer.removeEvent(this.renderEvent);
        this._super();
        jQuery(this).trigger("after_destroy");
    }
});

WSUI.Enemy=WSUI.Unit.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        this._super(_opt);
        var _this=this;
        this.set({
            hp:100,
            maxHp:100,
            spd:5//默认移动速度
        });
        this.addObserver('hp,maxHp',function(v){
            _this.dom_life.children('div').css('width',v/_this.get('maxHp')*100+'%');
        });
        this.dom.addClass('enemy');
        //为dom增加血条
        this.dom_life=jQuery('<div class="life">',{
            'class':'life',
            'style':'width:'+this.get('w')+'px;'
        });
        this.dom_life.append(jQuery('<div class="hp">'));
        this.dom_life.appendTo(this.dom);

        //绑定skill-move
        WSUI.Skill['move'].apply(this);

        //添加到middleware
        //WSUI.MiddleWare.list.enemy[this.get('id')]=this;
        //WSUI.MiddleWare.reg(this,'enemy');
    },

    hurt:function(_lostHp){//受伤事件 lostHp:所收到伤害的值(扣除血量)
        this.set('hp',this.get('hp')-_lostHp);
        if(this.get('hp')<=0)this.die();
    },
    die:function(){//死亡
        //处理死亡
        this.destroy();
    }
});

//小型怪物
WSUI.Enemy_Light=WSUI.Enemy.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        if(!_opt.w)_opt.w=24;
        if(!_opt.h)_opt.h=24;
        this._super(_opt);
        this.set({
            w:_opt.w,
            h:_opt.h,
            hp:200,
            maxHp:200,
            spd:2
        });
        this.dom.addClass('enemy_light');
    }
});

//塔
WSUI.Tower=WSUI.Unit.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        if(!_opt.w)_opt.w=24;
        if(!_opt.h)_opt.h=24;
        var _this=this;
        this._super(_opt);
        this.set({
            'w':_opt.w,
            'h':_opt.h
        });
        WSUI.Skill['shot'].apply(this);//绑定射击功能
//        var _l=0;
//        setInterval(function(){
//            _l++;
//            if(_l>25)_i=0;
//            for(var i=0;i<2;i++){
//                _this.shot(i*8*Math.random()+90+_l*14.4);
//            }
//        },180);
        _this.shot(0);
    }
});

//子弹
WSUI.Bullet=WSUI.Unit.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        if(!_opt.w)_opt.w=8;
        if(!_opt.h)_opt.h=8;
        var _this=this;
        this._super(_opt);
        this.set({
            'w':_opt.w,
            'h':_opt.h,
            'spd':10,//默认移动速度
            'power':30//威力
        });
        //this.dom.addClass('bullet');
        //绑定skill-move
        WSUI.Skill['move'].apply(this);
        this.startMove(_opt.direction);
        //绑定skill-hit
        //添加到middleware
        //WSUI.MiddleWare.reg(this,'bullet');

        //子弹自销毁事件
        this.lifeTimer=setTimeout(function(){
            _this.destroy();
        },2500)
    },
    destroy:function(){
        clearTimeout(this.lifeTimer);
        this._super();
    }
});
